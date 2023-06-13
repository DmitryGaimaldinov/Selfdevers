import { Controller, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { imageFileFilter } from "../utils/image-file-filter";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { PhotosService } from "./photos.service";
import { ImageDto } from "./dtos/image.dto";
import { ImageEntity } from "./enitities/image.entity";
import { UploadImagesResultDto } from "./dtos/upload-images-result.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('photos')
export class PhotosController {
  constructor(
    private photosService: PhotosService,
  ) {}

  @Post('upload-images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, { fileFilter: imageFileFilter }))
  async uploadImages(@UploadedFiles() imageFiles: Array<Express.Multer.File>): Promise<UploadImagesResultDto> {
    // TODO: сохранить изображения. Возможно в ImageEntity стоит сохранять creatorId.
    // Нормально ли, что люди смогут добавлять id'шники фотографий с других постов в свои посты?
    // По сути нет, это нарушение приватности.
    //
    // Короче, пока этого делать не буду, потому что хочу на курсовой показать
    // как можно больше функционала соцсети. Но потом сделаю.
    let imageEntities: ImageEntity[] = [];
    if (imageFiles) {
      imageEntities = await Promise.all(imageFiles.map((file) => this.photosService.saveImage(file)));
      return {
        imageIds: imageEntities.map((imageEntity) => imageEntity.id)
      };
    }

    return {
      imageIds: [],
    };
  }
}
