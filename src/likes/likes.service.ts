import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikeEntity } from "./entities/like.entity";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeEntity) private likesRepo: Repository<LikeEntity>,
  ) {}

  async likeNote({ userId, noteId } : { userId: number, noteId: number }): Promise<void> {
    const isLiked = await this.isNoteLikedByUser({ userId: userId, noteId})
    if (!isLiked) {
      const like = this.likesRepo.create({ note: { id: noteId }, userId: userId });
      await this.likesRepo.save(like);
    }
  }

  async deleteLikeNote({ userId, noteId } : { userId: number, noteId: number }): Promise<void> {
    const like = await this.likesRepo.findOneBy({ userId, note: { id: noteId } });
    if (like) {
      await this.likesRepo.remove(like);
    }
  }

  async getNoteLikesCount(noteId: number): Promise<number> {
    return await this.likesRepo.countBy({ note: { id: noteId } });
  }

  async isNoteLikedByUser({ userId, noteId } : { userId: number, noteId: number }) {
    if (!userId) {
      return false;
    }
    return await this.likesRepo.exist({ where: { userId, note: { id: noteId } } });
  }
}
