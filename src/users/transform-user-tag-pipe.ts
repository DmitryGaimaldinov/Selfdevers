import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class TransformUserTagPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata) {
    if (body.userTag) {
      body.userTag = body.userTag.toLowerCase();
    }

    return body;
  }
}