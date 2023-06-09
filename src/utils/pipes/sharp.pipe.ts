// import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
// import * as path from 'path';
// import * as sharp from 'sharp';
//
// @Injectable()
// export class SharpPipe implements PipeTransform<any, Promise<string>> {
//
//   async transform(image: Express.Multer.File): Promise<string> {
//     console.log(`image: ${image}`);
//     // const originalName = path.parse(image.originalname).name;
//     // const filename = Date.now() + '-' + originalName + '.jpeg';
//     //
//     // await sharp(image.buffer)
//     //   .resize(800)
//     //   .jpeg()
//     //   .toFile(path.join('files', filename));
//     //
//     // return filename;
//     return '';
//   }
//
// }