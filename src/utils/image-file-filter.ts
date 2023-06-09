import { BadRequestException } from "@nestjs/common";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    return callback(new BadRequestException('Разрешены только изображения!'), false);
  }
  callback(null, true);
};