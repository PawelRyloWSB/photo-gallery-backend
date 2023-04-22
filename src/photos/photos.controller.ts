import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Photos } from './photos.entity';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/auth/jwt.guard';

@Controller('photos')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ fileName: string; data: Buffer }> {
    return await this.photosService.uploadPhoto(
      file.buffer,
      file.originalname,
      req.user.id,
    );
  }

  @Get()
  readAll(@Req() req): Promise<Photos[]> {
    return this.photosService.getAllUserPhotos(req.user.id);
  }

  @Get(':id')
  async getPhoto(
    @Param('id') id: number,
    @Res({ passthrough: true }) response,
  ): Promise<string> {
    const file = await this.photosService.getPhoto(id);

    const base64String = Buffer.from(file.data).toString('base64');
    const base64Image = `data:image/jpeg;base64,${base64String}`;

    return base64Image;
  }
}
