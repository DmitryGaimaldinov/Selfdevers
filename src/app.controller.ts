import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { IsString } from "class-validator";
import { IsValidUserTag } from "./decorators/validate-tag.decorator";

class TestTrimPipeDto {
  @IsString()
  text: string;
}

class TestTagValidationDto {
  @IsValidUserTag()
  userTag: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  async itWorks() {
    return 'Подключение работает!';
  }

  @Post('test-trim-pipe')
  async testTrimPipe(@Body() text: { text: string }) {
    return text.text;
  }

  @Post('test-user-tag-validation')
  async testTagValidation(@Body() tagDto: TestTagValidationDto) {
    return tagDto.userTag;
  }

  // @Get()
  // async getHello(): Promise<any> {
  //   await this.appService.seed();
  //   return 'Seed completed';
  // }
  //
  // @Get('employee')
  // async getRecords(): Promise<any> {
  //   return await this.appService.getEmployeeById(2);
  // }


  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }
  //
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   console.log(req.user);
  //   return req.user;
  // }
}
