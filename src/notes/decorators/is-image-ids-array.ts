import {
  IsArray,
  IsNumber,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { IncorrectInputError } from "../../errors/incorrect-input.error";
import { applyDecorators, Inject, Injectable, Scope } from "@nestjs/common";
import { NoteDto } from "../dto/note.dto";
import { PhotosService } from "../../photos/photos.service";
import { forEach } from "lodash";
import { ImageDto } from "../../photos/dtos/image.dto";

@ValidatorConstraint({ name: 'IsImageIdsArrayConstraint', async: true })
@Injectable()
export class IsImageIdsArrayConstraint implements ValidatorConstraintInterface {
  constructor(
    private photosService: PhotosService,
  ) {}

  async validate(imageIds: number[], args: ValidationArguments): Promise<boolean> {
    for (const id of imageIds) {
      const imageDto: ImageDto = await this.photosService.findOneById(id);
      if (!imageDto) {
        throw new IncorrectInputError(`Неверное id изображения: ${id}`);
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Используется id несуществующего изображения`;
  }
}

function CheckIsImageIdsArray() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: IsImageIdsArrayConstraint,
    });
  };
}

export function IsImageIdsArray() {
  return applyDecorators(
    IsNumber({},{each: true}),
    CheckIsImageIdsArray(),
  );
}