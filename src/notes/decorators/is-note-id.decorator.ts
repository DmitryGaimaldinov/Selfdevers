import {
  IsNumber,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { IncorrectInputError } from "../../errors/incorrect-input.error";
import { applyDecorators, Inject, Injectable, Scope } from "@nestjs/common";
import { isString } from "@nestjs/common/utils/shared.utils";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { NotesService } from "../notes.service";
import { NoteDto } from "../dto/note.dto";

@ValidatorConstraint({ name: 'IsNoteIdConstraint', async: true })
@Injectable()
export class IsNoteIdConstraint implements ValidatorConstraintInterface {
  constructor(
    private notesService: NotesService,
  ) {}

  async validate(noteIdString: string, args: ValidationArguments): Promise<boolean> {
    const noteId = Number.parseInt(noteIdString);

    const note: NoteDto | null = await this.notesService.findById({ id: noteId, finderId: null });
    if (!note) {
      throw new IncorrectInputError(`Не найден пост с id: ${noteId}`);
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Недопустимое id поста`;
  }
}

function CheckIsNoteId() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: IsNoteIdConstraint,
    });
  };
}

export function IsNoteId() {
  return applyDecorators(
    IsNumber(),
    CheckIsNoteId(),
  );
}