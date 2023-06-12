import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { HttpErrorFilter } from "./utils/http-error.filter";
import { TrimPipe } from "./utils/pipes/trim-pipe";
import { useContainer } from "class-validator";
import { TransformUserTagPipe } from "./users/transform-user-tag-pipe";
import { join } from 'path';
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";

export let serverUrl: string;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // const config = new DocumentBuilder()
  //   .setTitle('Selfdevers')
  //   .setDescription('The selfdevers api description')
  //   .setVersion('1.0')
  //   .addTag('selfdevers')
  //   .build();
  //
  // const swaggerOptions: SwaggerDocumentOptions =  {
  //   operationIdFactory: (
  //     controllerKey: string,
  //     methodKey: string
  //   ) => methodKey
  // };

  // const document = SwaggerModule.createDocument(app, config, swaggerOptions);
  // SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new TransformUserTagPipe(),
    new TrimPipe(),
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    // new BaseErrorInterceptor(),
  );
  app.useGlobalFilters(new HttpErrorFilter());
  app.useStaticAssets(join(__dirname, '..', 'files/profile'));
  await app.listen(3000, 'localhost');
  serverUrl = await app.getUrl();

  console.log(await app.getUrl());
}
bootstrap();
