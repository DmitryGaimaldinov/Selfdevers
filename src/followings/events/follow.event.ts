export class FollowEvent {
  followerId: number;
  followedUserId: number;
  followingEntityId: number;

  constructor(params: { followerId: number, followedUserId: number, followingEntityId: number }) {
    this.followerId = params.followerId;
    this.followedUserId = params.followedUserId;
    this.followingEntityId = params.followingEntityId;
  }

  static eventName = 'follow.event';
}