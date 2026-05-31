import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./src/entities/user.js";
import { Game } from "./src/entities/game.js";
import { List } from "./src/entities/list.js";
import { ListGame } from "./src/entities/list_game.js";
import { Comment } from "./src/entities/comment.js";
import { CommentLikes } from "./src/entities/comment_likes.js";
import { ListLikes } from "./src/entities/list_likes.js";

dotenv.config();

export const AppDataSource = new DataSource(
    process.env.MYSQL_URL
        ? {
            type: "mysql" as const,
            url: process.env.MYSQL_URL,
            synchronize: false,
            logging: true,
            entities: [User, Game, List, ListGame, Comment, CommentLikes, ListLikes],
        }
        : {
            type: "mysql" as const,
            host: process.env.MYSQLHOST || "127.0.0.1",
            port: parseInt(process.env.MYSQLPORT || "3306"),
            username: process.env.MYSQLUSER || "root",
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
            database: process.env.MYSQLDATABASE || "capstoneDatabase",
            synchronize: false,
            logging: true,
            entities: [User, Game, List, ListGame, Comment, CommentLikes, ListLikes],
        }
);