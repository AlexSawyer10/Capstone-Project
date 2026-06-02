var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column } from 'typeorm';
let ListGame = class ListGame {
    gameId;
    listId;
    listGameRank;
    listGameStatus;
};
__decorate([
    PrimaryColumn({ name: 'GAME_ID', type: 'int' }),
    __metadata("design:type", Number)
], ListGame.prototype, "gameId", void 0);
__decorate([
    PrimaryColumn({ name: 'LIST_ID', type: 'int' }),
    __metadata("design:type", Number)
], ListGame.prototype, "listId", void 0);
__decorate([
    Column({ name: 'LIST_GAME_RANK', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ListGame.prototype, "listGameRank", void 0);
__decorate([
    Column({ name: 'LIST_GAME_STATUS', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], ListGame.prototype, "listGameStatus", void 0);
ListGame = __decorate([
    Entity('LIST_GAME')
], ListGame);
export { ListGame };
//# sourceMappingURL=list_game.js.map