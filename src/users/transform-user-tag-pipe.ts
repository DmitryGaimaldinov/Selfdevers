import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class TransformUserTagPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata) {
    if (body) {
      if (body.userTag) {
        body.userTag = transformUserTag(body.userTag);
      }
    }

    return body;
  }
}

export function transformUserTag(userTag: string) {
  userTag = userTag.trim();
  userTag = userTag.toLowerCase();
  userTag = userTag.replace(/(\r\n|\n|\r)/gm, "");
  return userTag;
}