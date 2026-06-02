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
let ListLikes = class ListLikes {
    likeId;
    userId;
    listId;
    isLiked;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'LIKE_ID' }),
    __metadata("design:type", Number)
], ListLikes.prototype, "likeId", void 0);
__decorate([
    Column({ name: 'USER_ID', type: 'int' }),
    __metadata("design:type", Number)
], ListLikes.prototype, "userId", void 0);
__decorate([
    Column({ name: 'LIST_ID', type: 'int' }),
    __metadata("design:type", Number)
], ListLikes.prototype, "listId", void 0);
__decorate([
    Column({ name: 'IS_LIKED', type: 'boolean', nullable: true }),
    __metadata("design:type", Object)
], ListLikes.prototype, "isLiked", void 0);
ListLikes = __decorate([
    Entity('LIST_LIKES')
], ListLikes);
export { ListLikes };
//# sourceMappingURL=list_likes.js.map