import { Controller, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('files')
  @UseInterceptors(
  FileFieldsInterceptor([  // 여러 필드를 받을 수 있도록 FileFieldsInterceptor 사용
    { name: 'thumbnail_url', maxCount: 1 },
    { name: 'file_url', maxCount: 1 },
    { name: 'avatar_url', maxCount: 1 },
  ])
  )
  async uploadFiles(
  @UploadedFiles() files: { thumbnail?: Express.Multer.File[], file_url?: Express.Multer.File[], avatar_url?: Express.Multer.File[] },
  @Query('type') type: string
  ) {
  // 파일 업로드 처리
  
  const uploadedFiles = await this.fileUploadService.uploadFiles(files);
  

  // 응답 구조를 type에 따라 다르게 반환
  switch (type) {
    case 'avatar':
      return { avatar_url: uploadedFiles.avatar.url };
    case 'thumbnail':
      return { thumbnail_url: uploadedFiles.thumbnail.url };
    case 'file':
      return { 
        file_url: uploadedFiles.file.url, 
        file_type: uploadedFiles.file.type, 
        file_size: uploadedFiles.file.size};
    default:
      return { message: "Invalid type", uploadedFiles };
  }
  }

}
