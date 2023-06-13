import { UsersService } from "../users/users.service";
import * as path from "path";
import * as sharp from "sharp";
import { serverUrl } from "../main";
import { Injectable } from "@nestjs/common";
import { ImageEntity } from "./enitities/image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { encode } from 'blurhash';
import * as fs from "fs";
import { ImageDto } from "./dtos/image.dto";
import { randomUUID } from "crypto";

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async saveImage(
    file: Express.Multer.File,
    size?: { width: number, height: number },
  ): Promise<ImageEntity> {
    const originalName = path.parse(file.originalname).name;
    const filename = randomUUID() + '.jpeg';

    // Сначала делам обычное jpeg-изображение, сохраняя его в файл
    let jpegImage = sharp(file.buffer);
    if (size) {
      jpegImage = jpegImage.resize(size.width, size.height);
    }
    await jpegImage
      .jpeg()
      .toFile(`files/profile/${filename}`);

    // Делаем blurhash
    const blurImage = await sharp(file.buffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer({ resolveWithObject: true });
    const blurhash = encode(new Uint8ClampedArray(blurImage.data), blurImage.info.width, blurImage.info.height, 4, 4);

    const image = this.imageRepository.create({
      filename,
      blurhash,
    });
    return await this.imageRepository.save(image);
  }

  convertImageEntityToDto(imageEntity: ImageEntity): ImageDto {
    return {
      url: this.getUrlFromFilename(imageEntity.filename),
      blurhash: imageEntity.blurhash,
    };
  }

  async findOneById(id: number): Promise<ImageDto | null> {
    const imageEntity = await this.imageRepository.findOneBy({ id });
    if (!imageEntity) {
      return null;
    }

    return this.convertImageEntityToDto(imageEntity);
  }

  private getUrlFromFilename(imagePath: string): string {
    return serverUrl + '/' + imagePath;
  }

  // async updateAvatar(userId: number, avatar?: Express.Multer.File): Promise<ImageDto | null> {
  //
  // }
  //
  // async updateBackground(userId: number, background?: Express.Multer.File): Promise<ImageDto | null> {
  //   let image: ImageEntity = null;
  //   if (background) {
  //     image = await this.saveImage(background, { width: 1920, height: 640 });
  //   }
  //   await this.usersService.update(userId, { background: image });
  //
  //   return {
  //     url: this.getUrlFromFilename(image.filename),
  //     blurhash: image.blurhash,
  //   };
  // }
}
