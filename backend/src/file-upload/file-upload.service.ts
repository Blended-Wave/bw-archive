import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';


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
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // 업로드할 버킷 이름
            Key: `${folder}/${file.originalname}`,  // S3 내에서 파일의 경로 및 이름
            Body: file.buffer, // 파일의 내용
            ContentType: file.mimetype, // 파일의 MIME 타입 ex) image/jpeg,  video/mp4
            ACL: 'public-read',  // 파일의 접근 제어 목록 - 누구나 읽을 수 있도록
        };
    
        // 파일 업로드
        const uploadResult = await this.s3.upload(params).promise();
    
        // S3에서 업로드된 파일의 크기를 얻기 위해 headObject를 호출
        const fileInfo = await this.s3.headObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folder}/${file.originalname}`,
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
}
