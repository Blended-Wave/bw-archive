import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';
import * as path from 'path';


@Injectable()
export class FileUploadService {
    private s3: AWS.S3;

    constructor() {
        config();
        
        // AWS SDK 설정
        AWS.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            region: process.env.S3_REGION,
        });

        this.s3 = new AWS.S3();
    }

    private async uploadFileToS3(file: Express.Multer.File, folder: string): Promise<any> {
        // 한글 파일명 문제 해결을 위해 UUID + 확장자로 파일명 생성
        const fileExtension = path.extname(file.originalname);
        const fileName = `${randomUUID()}${fileExtension}`;
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // 업로드할 버킷 이름
            Key: `${folder}/${fileName}`,  // S3 내에서 파일의 경로 및 이름 (UUID + 확장자)
            Body: file.buffer, // 파일의 내용
            ContentType: file.mimetype, // 파일의 MIME 타입 ex) image/jpeg,  video/mp4
            ACL: 'public-read',  // 파일의 접근 제어 목록 - 누구나 읽을 수 있도록
            Metadata: {
                'original-filename': encodeURIComponent(file.originalname) // 원본 파일명 메타데이터로 저장
            }
        };
    
        // 파일 업로드
        const uploadResult = await this.s3.upload(params).promise();
    
        // S3에서 업로드된 파일의 크기를 얻기 위해 headObject를 호출
        const fileInfo = await this.s3.headObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folder}/${fileName}`,
        }).promise();
    
        // 파일 타입 확인
        let fileType: string;
        if (file.mimetype.startsWith('video/')) {
            fileType = 'video';
        } else if (file.mimetype.startsWith('image/')) {
            fileType = 'image';
        } else {
            fileType = 'other'; // 다른 파일 타입에 대한 처리
        }
    
        return { 
            url: uploadResult.Location, 
            type: fileType,
            size: fileInfo.ContentLength // 파일 사이즈 추가
        };
    }
    

    async uploadFiles(files: { thumbnail_url?: Express.Multer.File[], file_url?: Express.Multer.File[], avatar_url?: Express.Multer.File[] }): Promise<any> {
        const uploadedFiles = {};
        
        // 각 파일 필드에 대해 파일을 업로드
        if (files.thumbnail_url && files.thumbnail_url.length > 0) {
          uploadedFiles['thumbnail'] = await this.uploadFileToS3(files.thumbnail_url[0], 'thumbnails');
        }
    
        if (files.file_url && files.file_url.length > 0) {
          uploadedFiles['file'] = await this.uploadFileToS3(files.file_url[0], 'files');
        }
    
        if (files.avatar_url && files.avatar_url.length > 0) {
          uploadedFiles['avatar'] = await this.uploadFileToS3(files.avatar_url[0], 'avatars');
        }
    
        return uploadedFiles;
      }

    async deleteFileFromS3(fileUrl: string): Promise<void> {
        try {
            const bucket = process.env.S3_BUCKET_NAME;
            // URL에서 객체 키(파일 경로) 추출. 예: https://bucket.s3.region.amazonaws.com/avatars/filename.jpg -> avatars/filename.jpg
            const key = new URL(fileUrl).pathname.substring(1);

            await this.s3.deleteObject({
                Bucket: bucket,
                Key: key,
            }).promise();

            console.log(`Successfully deleted ${key} from ${bucket}`);
        } catch (error) {
            console.error(`Failed to delete file from S3: ${fileUrl}`, error);
            // 에러를 던져서 호출한 쪽에서 트랜잭션 등을 롤백할 수 있게 함
            throw new Error('S3 file deletion failed');
        }
    }
}
