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
let Game = class Game {
    gameId;
    gameName;
    gameReleased;
    gameDescription;
    gameImage;
};
__decorate([
    PrimaryColumn({ name: 'GAME_ID', type: 'int' }),
    __metadata("design:type", Number)
], Game.prototype, "gameId", void 0);
__decorate([
    Column({ name: 'GAME_NAME', type: 'varchar' }),
    __metadata("design:type", String)
], Game.prototype, "gameName", void 0);
__decorate([
    Column({ name: 'GAME_RELEASED', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Game.prototype, "gameReleased", void 0);
__decorate([
    Column({ name: 'GAME_DESCRIPTION', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Game.prototype, "gameDescription", void 0);
__decorate([
    Column({ name: 'GAME_IMAGE', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Game.prototype, "gameImage", void 0);
Game = __decorate([
    Entity('GAME')
], Game);
export { Game };
//# sourceMappingURL=game.js.map