import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photos } from './photos.entity';
import { Equal, Repository } from 'typeorm';
import { UserService } from '../auth/user/user.service';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photos)
    private readonly photoRepository: Repository<Photos>,
    private readonly userService: UserService,
  ) {}

  async uploadPhoto(
    dataBuffer: Buffer,
    fileName: string,
    userId: number,
  ): Promise<{ fileName: string; data: Buffer }> {
    const user = await this.userService.getOneById(userId);

    const newPhoto = {
      fileName,
      data: dataBuffer,
      user,
    };
    await this.photoRepository.save(newPhoto);

    return newPhoto;
  }

  async getAllUserPhotos(userId: number): Promise<any> {
    const photos = await this.photoRepository.find({
      where: { user: { id: Equal(userId) } },
    });

    if (!photos) throw new Error('No photos found for this user');

    return photos.map((photo) => {
      const base64String = Buffer.from(photo.data).toString('base64');
      const base64Image = `data:image/jpeg;base64,${base64String}`;

      return {
        id: photo.id,
        fileName: photo.fileName,
        data: base64Image,
      };
    });
  }

  async getPhoto(id: number): Promise<Photos> {
    const file = await this.photoRepository.findOne({
      where: { id: Equal(id) },
    });

    if (!file) throw new Error('No photo found');

    return file;
  }
}
