import {Game} from "../entities/game.js";

export { router as listRouter }

import {List} from "../entities/list.js";
import {User} from "../entities/user.js";
import {ListGame} from "../entities/list_game.js";
import express from "express";
import {AppDataSource} from "../../db-connection.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { provider_id, list_name, list_description, list_image, public: isPublic } = req.body;

    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provider_id });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const newList = new List();
        newList.userId = user.userId;
        newList.listName = list_name;
        newList.listDescription = list_description;
        newList.listImage = list_image ?? null;
        newList.public = isPublic;

        await AppDataSource.getRepository(List).save(newList);
        console.log("List saved to the database.");
        return res.status(201).json({ message: "List created successfully." });

    }
    catch (err) {
        console.error("Error creating list:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/set/slot/number/:slot/:gameID/:listID/:provID", async (req, res) => {
   const slot_id_parsed  = parseInt(req.params.slot);
   const game_id_parsed  = parseInt(req.params.gameID);

    try {
/*first get the list where you get that list ID*/
    }
    catch (err) {
        console.error("Error assigning game to list slot:", err);
        return res.status(500).json({ message: "Internal server error." });
    }

});

router.get("/by/user/:id", async (req, res) => {
    const provider_id = req.params.id;

    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provider_id });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const lists = await AppDataSource.getRepository(List).find({
            where: { userId: user.userId },
        });

        return res.status(200).json(lists);
    }
    catch (err) {
        console.error("Error fetching lists:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/individual/game/list/:listId", async (req, res) => {
    const listIdParsed = parseInt(req.params.listId);
    try {
        const list = await AppDataSource.getRepository(List).findOneBy({ listId: listIdParsed });
        if (!list) {
            return res.status(404).json({ message: "List not found." });
        }
        const listWithGames = await AppDataSource
            .createQueryBuilder()
            .select([
                'list.listId',
                'list.listName',
                'list.listDescription',
                'list.listImage',
                'list.public',
                'list.listLikes',
                'list.listDislikes',
                'lg.listGameRank',
                'lg.listGameStatus',
                'game.gameId',
                'game.gameName',
                'game.gameReleased',
                'game.gameDescription',
                'game.gameImage',
            ])
            .from(List, 'list')
            .leftJoin(ListGame, 'lg', 'lg.listId = list.listId')
            .leftJoin(Game, 'game', 'game.gameId = lg.gameId')
            .where('list.listId = :listId', { listId: listIdParsed })
            .getRawMany();

        console.log("list with game list:", listWithGames);

        return res.status(200).json({  listWithGames });
    }
    catch (err) {
        console.error("Error fetching list with games:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
