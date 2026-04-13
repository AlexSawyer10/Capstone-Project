import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./src/entities/user.js";
import { Game } from "./src/entities/game.js";
import { List } from "./src/entities/list.js";
import { ListGame } from "./src/entities/list_game.js";
import { Comment } from "./src/entities/comment.js";
import { CommentLikes } from "./src/entities/comment_likes.js";

dotenv.config();
const DB_PWD = process.env.DB_PASSWORD;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: `${DB_PWD}`,
    database: "capstoneDatabase",
    synchronize: false,
    logging: true,
    entities: [User, Game, List, ListGame, Comment, CommentLikes],
});