var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
let Comment = class Comment {
    /*so there's a difference between primary generated column and primary column. Generated column auto produces you a new PK in the database
    * primary column does not. */
    commentId;
    userId;
    listId;
    commentDescription;
    commentLikes;
    commentDislikes;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'COMMENT_ID', type: 'int', })
    /*so there's a difference between primary generated column and primary column. Generated column auto produces you a new PK in the database
    * primary column does not. */
    ,
    __metadata("design:type", Number)
], Comment.prototype, "commentId", void 0);
__decorate([
    Column({ name: 'USER_ID' }),
    __metadata("design:type", Number)
], Comment.prototype, "userId", void 0);
__decorate([
    Column({ name: 'LIST_ID' }),
    __metadata("design:type", Number)
], Comment.prototype, "listId", void 0);
__decorate([
    Column({ name: 'COMMENT_DESCRIPTION' }),
    __metadata("design:type", String)
], Comment.prototype, "commentDescription", void 0);
__decorate([
    Column({ name: 'COMMENT_LIKES', default: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "commentLikes", void 0);
__decorate([
    Column({ name: 'COMMENT_DISLIKES', default: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "commentDislikes", void 0);
Comment = __decorate([
    Entity('COMMENT')
], Comment);
export { Comment };
//# sourceMappingURL=comment.js.map