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
let List = class List {
    listId;
    userId;
    listName;
    listDescription;
    listImage;
    public;
    listLikes;
    listDislikes;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'LIST_ID' }),
    __metadata("design:type", Number)
], List.prototype, "listId", void 0);
__decorate([
    Column({ name: 'USER_ID', type: 'int' }),
    __metadata("design:type", Number)
], List.prototype, "userId", void 0);
__decorate([
    Column({ name: 'LIST_NAME', type: 'varchar' }),
    __metadata("design:type", String)
], List.prototype, "listName", void 0);
__decorate([
    Column({ name: 'LIST_DESCRIPTION', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], List.prototype, "listDescription", void 0);
__decorate([
    Column({ name: 'LIST_IMAGE', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], List.prototype, "listImage", void 0);
__decorate([
    Column({ name: 'PUBLIC', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], List.prototype, "public", void 0);
__decorate([
    Column({ name: 'LIST_LIKES', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], List.prototype, "listLikes", void 0);
__decorate([
    Column({ name: 'LIST_DISLIKES', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], List.prototype, "listDislikes", void 0);
List = __decorate([
    Entity('LIST')
], List);
export { List };
//# sourceMappingURL=list.js.map