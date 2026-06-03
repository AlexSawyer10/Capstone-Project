import { Game } from "../entities/game.js";
import { ListLikes } from "../entities/list_likes.js";
import { CommentLikes } from "../entities/comment_likes.js";
export { router as listRouter };
import { List } from "../entities/list.js";
import { User } from "../entities/user.js";
import { ListGame } from "../entities/list_game.js";
import { Comment } from "../entities/comment.js";
import express from "express";
import { In } from "typeorm";
import { AppDataSource } from "../../db-connection.js";
const router = express.Router();
function isVoteLiked(value) {
    return value === true || value === 1;
}
function isVoteDisliked(value) {
    return value === false || value === 0;
}
function isVoteNeutral(value) {
    return value === null || value === undefined;
}
async function getCommentsForList(listId, viewerProvId) {
    let viewerUserId = null;
    if (viewerProvId) {
        const viewer = await AppDataSource.getRepository(User).findOneBy({ userProviderId: viewerProvId });
        viewerUserId = viewer?.userId ?? null;
    }
    const rows = await AppDataSource.getRepository(Comment)
        .createQueryBuilder("comment")
        .innerJoin(User, "user", "user.userId = comment.userId")
        .select("comment.commentId", "commentId")
        .addSelect("comment.commentDescription", "commentDescription")
        .addSelect("comment.commentLikes", "commentLikes")
        .addSelect("comment.commentDislikes", "commentDislikes")
        .addSelect("comment.userId", "commentUserId")
        .addSelect("user.name", "name")
        .addSelect("user.userEmail", "userEmail")
        .addSelect("user.userPicture", "userPicture")
        .where("comment.listId = :listId", { listId })
        .orderBy("comment.commentId", "DESC")
        .getRawMany();
    const voteByCommentId = {};
    if (viewerUserId != null) {
        const commentIds = rows.map((row) => Number(row.commentId));
        if (commentIds.length > 0) {
            const voteRows = await AppDataSource.getRepository(CommentLikes)
                .createQueryBuilder("cl")
                .select(["cl.commentId", "cl.isLiked"])
                .where("cl.userId = :userId", { userId: viewerUserId })
                .andWhere("cl.commentId IN (:...commentIds)", { commentIds })
                .getMany();
            for (const vote of voteRows) {
                voteByCommentId[vote.commentId] = {
                    liked: isVoteLiked(vote.isLiked),
                    disliked: isVoteDisliked(vote.isLiked),
                };
            }
        }
    }
    return rows.map((row) => {
        const commentId = Number(row.commentId);
        const vote = voteByCommentId[commentId];
        return {
            commentId,
            commentDescription: row.commentDescription,
            commentLikes: Number(row.commentLikes ?? 0),
            commentDislikes: Number(row.commentDislikes ?? 0),
            name: row.name,
            userEmail: row.userEmail,
            userPicture: row.userPicture,
            isOwnComment: viewerUserId != null && Number(row.commentUserId) === viewerUserId,
            liked: vote?.liked ?? false,
            disliked: vote?.disliked ?? false,
        };
    });
}
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
async function assignGameToSlot(slot_id_parsed, game_id_parsed, list_id_parsed, prov_id, game_name, game_released, game_description, game_image, res) {
    console.log("assignGameToSlot:", { slot_id_parsed, game_id_parsed, list_id_parsed, prov_id, game_name, game_released, game_description, game_image });
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: prov_id });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const list = await AppDataSource.getRepository(List).findOneBy({ listId: list_id_parsed });
        if (!list || list.userId !== user.userId) {
            return res.status(403).json({ message: "List not found or does not belong to this user." });
        }
        const existingGame = await AppDataSource.getRepository(Game).findOneBy({ gameId: game_id_parsed });
        if (!existingGame) {
            const newGame = new Game();
            newGame.gameId = game_id_parsed;
            newGame.gameName = game_name;
            newGame.gameReleased = game_released;
            newGame.gameDescription = game_description;
            newGame.gameImage = game_image;
            await AppDataSource.getRepository(Game).save(newGame);
        }
        const existingListGame = await AppDataSource.getRepository(ListGame).findOneBy({
            gameId: game_id_parsed,
            listId: list_id_parsed,
        });
        if (existingListGame) {
            existingListGame.listGameRank = slot_id_parsed;
            await AppDataSource.getRepository(ListGame).save(existingListGame);
        }
        else {
            const newListGame = new ListGame();
            newListGame.gameId = game_id_parsed;
            newListGame.listId = list_id_parsed;
            newListGame.listGameRank = slot_id_parsed;
            await AppDataSource.getRepository(ListGame).save(newListGame);
        }
        return res.status(200).json({ message: "Game assigned to slot successfully." });
    }
    catch (err) {
        console.error("Error assigning game to list slot:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}
router.post("/set/slot", async (req, res) => {
    const { slot, gameID, listID, provID, gameName, gameReleased, gameDescription, gameImage, } = req.body ?? {};
    const slot_id_parsed = parseInt(String(slot));
    const game_id_parsed = parseInt(String(gameID));
    const list_id_parsed = parseInt(String(listID));
    const prov_id = typeof provID === "string" ? provID : "";
    if (!Number.isFinite(slot_id_parsed) || !Number.isFinite(game_id_parsed) || !Number.isFinite(list_id_parsed) || !prov_id) {
        return res.status(400).json({ message: "Invalid slot assignment payload." });
    }
    const game_name = typeof gameName === "string" ? gameName : "";
    const game_released = gameReleased != null ? String(gameReleased) : "";
    const game_description = typeof gameDescription === "string" ? gameDescription : "";
    const game_image = typeof gameImage === "string" ? gameImage : "";
    return assignGameToSlot(slot_id_parsed, game_id_parsed, list_id_parsed, prov_id, game_name, game_released, game_description, game_image, res);
});
router.post("/set/slot/number/:slot/:gameID/:listID/:provID/:gameName/:gameReleased/:gameDescription/:gameImage", async (req, res) => {
    const slot_id_parsed = parseInt(req.params.slot);
    const game_id_parsed = parseInt(req.params.gameID);
    const list_id_parsed = parseInt(req.params.listID);
    const prov_id = req.params.provID;
    const game_name = decodeURIComponent(req.params.gameName);
    const game_released = req.params.gameReleased;
    const game_description_raw = decodeURIComponent(req.params.gameDescription);
    const game_description = game_description_raw === '_' ? '' : game_description_raw;
    const game_image = decodeURIComponent(req.params.gameImage);
    return assignGameToSlot(slot_id_parsed, game_id_parsed, list_id_parsed, prov_id, game_name, game_released, game_description, game_image, res);
});
router.get("/by/prov/:id", async (req, res) => {
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
router.get("/by/user/id/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const lists = await AppDataSource.getRepository(List).find({
            where: { userId: userId },
        });
        if (lists.length === 0) {
            return res.status(200).json([]);
        }
        const listIds = lists.map((list) => list.listId);
        const commentCountRows = await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .select("comment.listId", "listId")
            .addSelect("COUNT(comment.commentId)", "commentCount")
            .where("comment.listId IN (:...listIds)", { listIds })
            .groupBy("comment.listId")
            .getRawMany();
        const countByListId = {};
        for (const row of commentCountRows) {
            countByListId[Number(row.listId)] = Number(row.commentCount);
        }
        const listsWithCommentCounts = lists.map((list) => ({
            ...list,
            commentCount: countByListId[list.listId] ?? 0,
        }));
        return res.status(200).json(listsWithCommentCounts);
    }
    catch (err) {
        console.error("Error fetching lists by userId:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.get("/top", async (_req, res) => {
    try {
        const lists = await AppDataSource.getRepository(List).find({
            where: { public: true },
            order: { listLikes: "DESC" },
            take: 50,
        });
        if (lists.length === 0) {
            return res.status(200).json([]);
        }
        const listIds = lists.map((list) => list.listId);
        const commentCountRows = await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .select("comment.listId", "listId")
            .addSelect("COUNT(comment.commentId)", "commentCount")
            .where("comment.listId IN (:...listIds)", { listIds })
            .groupBy("comment.listId")
            .getRawMany();
        const countByListId = {};
        for (const row of commentCountRows) {
            countByListId[Number(row.listId)] = Number(row.commentCount);
        }
        const userIds = [...new Set(lists.map((list) => list.userId))];
        const users = await AppDataSource.getRepository(User).find({
            where: { userId: In(userIds) },
        });
        const userById = {};
        for (const user of users) {
            userById[user.userId] = user;
        }
        const listsWithCommentCounts = lists.map((list) => ({
            ...list,
            commentCount: countByListId[list.listId] ?? 0,
            ownerName: userById[list.userId]?.name ?? null,
            ownerEmail: userById[list.userId]?.userEmail ?? null,
            ownerPicture: userById[list.userId]?.userPicture ?? null,
        }));
        return res.status(200).json(listsWithCommentCounts);
    }
    catch (err) {
        console.error("Error fetching top lists:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.get("/worst", async (_req, res) => {
    try {
        const lists = await AppDataSource.getRepository(List).find({
            where: { public: true },
            order: { listDislikes: "DESC" },
            take: 50,
        });
        if (lists.length === 0) {
            return res.status(200).json([]);
        }
        const listIds = lists.map((list) => list.listId);
        const commentCountRows = await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .select("comment.listId", "listId")
            .addSelect("COUNT(comment.commentId)", "commentCount")
            .where("comment.listId IN (:...listIds)", { listIds })
            .groupBy("comment.listId")
            .getRawMany();
        const countByListId = {};
        for (const row of commentCountRows) {
            countByListId[Number(row.listId)] = Number(row.commentCount);
        }
        const userIds = [...new Set(lists.map((list) => list.userId))];
        const users = await AppDataSource.getRepository(User).find({
            where: { userId: In(userIds) },
        });
        const userById = {};
        for (const user of users) {
            userById[user.userId] = user;
        }
        const listsWithCommentCounts = lists.map((list) => ({
            ...list,
            commentCount: countByListId[list.listId] ?? 0,
            ownerName: userById[list.userId]?.name ?? null,
            ownerEmail: userById[list.userId]?.userEmail ?? null,
            ownerPicture: userById[list.userId]?.userPicture ?? null,
        }));
        return res.status(200).json(listsWithCommentCounts);
    }
    catch (err) {
        console.error("Error fetching worst lists:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.get("/search/:query", async (req, res) => {
    const query = decodeURIComponent(req.params.query).trim();
    try {
        if (!query) {
            return res.status(200).json([]);
        }
        const likeQuery = `%${query}%`;
        const listIdRows = await AppDataSource.getRepository(List)
            .createQueryBuilder("list")
            .select("DISTINCT list.listId", "listId")
            .leftJoin(ListGame, "lg", "lg.listId = list.listId")
            .leftJoin(Game, "game", "game.gameId = lg.gameId")
            .where("list.public = :isPublic", { isPublic: true })
            .andWhere("(list.listName LIKE :q OR list.listDescription LIKE :q OR game.gameName LIKE :q)", { q: likeQuery })
            .getRawMany();
        const listIds = listIdRows.map((row) => Number(row.listId));
        if (listIds.length === 0) {
            return res.status(200).json([]);
        }
        const lists = await AppDataSource.getRepository(List).find({
            where: { listId: In(listIds), public: true },
            order: { listLikes: "DESC" },
        });
        const commentCountRows = await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .select("comment.listId", "listId")
            .addSelect("COUNT(comment.commentId)", "commentCount")
            .where("comment.listId IN (:...listIds)", { listIds })
            .groupBy("comment.listId")
            .getRawMany();
        const countByListId = {};
        for (const row of commentCountRows) {
            countByListId[Number(row.listId)] = Number(row.commentCount);
        }
        const userIds = [...new Set(lists.map((list) => list.userId))];
        const users = await AppDataSource.getRepository(User).find({
            where: { userId: In(userIds) },
        });
        const userById = {};
        for (const user of users) {
            userById[user.userId] = user;
        }
        const listsWithMetadata = lists.map((list) => ({
            ...list,
            commentCount: countByListId[list.listId] ?? 0,
            ownerName: userById[list.userId]?.name ?? null,
            ownerEmail: userById[list.userId]?.userEmail ?? null,
            ownerPicture: userById[list.userId]?.userPicture ?? null,
        }));
        return res.status(200).json(listsWithMetadata);
    }
    catch (err) {
        console.error("Error searching lists:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.get("/individual/game/list/:listId", async (req, res) => {
    const listIdParsed = parseInt(req.params.listId);
    const viewerProvId = typeof req.query.provId === "string" ? req.query.provId : undefined;
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
            .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(c.commentId)')
                .from(Comment, 'c')
                .where('c.listId = list.listId');
        }, 'commentCount')
            .from(List, 'list')
            .leftJoin(ListGame, 'lg', 'lg.listId = list.listId')
            .leftJoin(Game, 'game', 'game.gameId = lg.gameId')
            .where('list.listId = :listId', { listId: listIdParsed })
            .getRawMany();
        console.log("list with game list:", listWithGames);
        console.log("commentCount from subquery (first row):", listWithGames[0]?.commentCount);
        const comments = await getCommentsForList(listIdParsed, viewerProvId);
        return res.status(200).json({ listWithGames, comments });
    }
    catch (err) {
        console.error("Error fetching list with games:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.get("/number/of/comments/:listId", async (req, res) => {
    const listIdParsed = parseInt(req.params.listId);
    try {
        const list = await AppDataSource.getRepository(List).find({});
        const commentCount = await AppDataSource.createQueryBuilder()
            .select("COUNT(*)", "count")
            .from("COMMENT", "comment")
            .where("comment.LIST_ID = :listId", { listId: listIdParsed })
            .getRawOne();
    }
    catch (err) { }
});
router.get("/vote/:listID/:provID", async (req, res) => {
    const listId = parseInt(req.params.listID);
    const provId = decodeURIComponent(req.params.provID);
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user)
            return res.status(404).json({ message: "User not found." });
        const existing = await AppDataSource.getRepository(ListLikes).findOneBy({
            userId: user.userId, listId
        });
        if (!existing || isVoteNeutral(existing.isLiked)) {
            return res.status(200).json({ liked: false, disliked: false });
        }
        return res.status(200).json({
            liked: isVoteLiked(existing.isLiked),
            disliked: isVoteDisliked(existing.isLiked),
        });
    }
    catch (err) {
        console.error("Error fetching vote status:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.post("/like/:listID/:provID", async (req, res) => {
    const listId = parseInt(req.params.listID);
    const provId = decodeURIComponent(req.params.provID);
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user)
            return res.status(404).json({ message: "User not found." });
        const list = await AppDataSource.getRepository(List).findOneBy({ listId });
        if (!list)
            return res.status(404).json({ message: "List not found." });
        const existing = await AppDataSource.getRepository(ListLikes).findOneBy({
            userId: user.userId, listId
        });
        if (existing) {
            if (isVoteLiked(existing.isLiked)) {
                // already liked — undo to neutral (remove row)
                list.listLikes = Math.max(0, list.listLikes - 1);
                await AppDataSource.getRepository(ListLikes).remove(existing);
                await AppDataSource.getRepository(List).save(list);
                return res.status(200).json({
                    listLikes: list.listLikes,
                    listDislikes: list.listDislikes,
                    liked: false,
                    disliked: false,
                });
            }
            if (isVoteDisliked(existing.isLiked)) {
                // was disliked — switch to like
                list.listDislikes = Math.max(0, list.listDislikes - 1);
                list.listLikes += 1;
                existing.isLiked = true;
                await AppDataSource.getRepository(ListLikes).save(existing);
                await AppDataSource.getRepository(List).save(list);
                return res.status(200).json({
                    listLikes: list.listLikes,
                    listDislikes: list.listDislikes,
                    liked: true,
                    disliked: false,
                });
            }
            // neutral row — add like
            list.listLikes += 1;
            existing.isLiked = true;
            await AppDataSource.getRepository(ListLikes).save(existing);
            await AppDataSource.getRepository(List).save(list);
            return res.status(200).json({
                listLikes: list.listLikes,
                listDislikes: list.listDislikes,
                liked: true,
                disliked: false,
            });
        }
        // no existing record — create new
        const newLike = new ListLikes();
        newLike.userId = user.userId;
        newLike.listId = listId;
        newLike.isLiked = true;
        list.listLikes += 1;
        await AppDataSource.getRepository(ListLikes).save(newLike);
        await AppDataSource.getRepository(List).save(list);
        return res.status(200).json({
            listLikes: list.listLikes,
            listDislikes: list.listDislikes,
            liked: true,
            disliked: false,
        });
    }
    catch (err) {
        console.error("Error liking list:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.post("/dislike/:listID/:provID", async (req, res) => {
    const listId = parseInt(req.params.listID);
    const provId = decodeURIComponent(req.params.provID);
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user)
            return res.status(404).json({ message: "User not found." });
        const list = await AppDataSource.getRepository(List).findOneBy({ listId });
        if (!list)
            return res.status(404).json({ message: "List not found." });
        const existing = await AppDataSource.getRepository(ListLikes).findOneBy({
            userId: user.userId, listId
        });
        if (existing) {
            if (isVoteDisliked(existing.isLiked)) {
                // already disliked — undo to neutral (remove row)
                list.listDislikes = Math.max(0, list.listDislikes - 1);
                await AppDataSource.getRepository(ListLikes).remove(existing);
                await AppDataSource.getRepository(List).save(list);
                return res.status(200).json({
                    listLikes: list.listLikes,
                    listDislikes: list.listDislikes,
                    liked: false,
                    disliked: false,
                });
            }
            if (isVoteLiked(existing.isLiked)) {
                // was liked — switch to dislike
                list.listLikes = Math.max(0, list.listLikes - 1);
                list.listDislikes += 1;
                existing.isLiked = false;
                await AppDataSource.getRepository(ListLikes).save(existing);
                await AppDataSource.getRepository(List).save(list);
                return res.status(200).json({
                    listLikes: list.listLikes,
                    listDislikes: list.listDislikes,
                    liked: false,
                    disliked: true,
                });
            }
            // neutral row — add dislike
            list.listDislikes += 1;
            existing.isLiked = false;
            await AppDataSource.getRepository(ListLikes).save(existing);
            await AppDataSource.getRepository(List).save(list);
            return res.status(200).json({
                listLikes: list.listLikes,
                listDislikes: list.listDislikes,
                liked: false,
                disliked: true,
            });
        }
        // no existing record — create new
        const newDislike = new ListLikes();
        newDislike.userId = user.userId;
        newDislike.listId = listId;
        newDislike.isLiked = false;
        list.listDislikes += 1;
        await AppDataSource.getRepository(ListLikes).save(newDislike);
        await AppDataSource.getRepository(List).save(list);
        return res.status(200).json({
            listLikes: list.listLikes,
            listDislikes: list.listDislikes,
            liked: false,
            disliked: true,
        });
    }
    catch (err) {
        console.error("Error disliking list:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.delete("/delete/game/:gameID/:listID/:provID", async (req, res) => {
    const game_id_parsed = parseInt(req.params.gameID);
    const list_id_parsed = parseInt(req.params.listID);
    const prov_id = req.params.provID;
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: prov_id });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const list = await AppDataSource.getRepository(List).findOneBy({ listId: list_id_parsed });
        if (!list || list.userId !== user.userId) {
            return res.status(403).json({ message: "List not found or does not belong to this user." });
        }
        await AppDataSource.getRepository(ListGame).delete({
            gameId: game_id_parsed,
            listId: list_id_parsed,
        });
        console.log(`Game ${game_id_parsed} deleted from list ${list_id_parsed}`);
        return res.status(200).json({ message: "Game deleted from list successfully." });
    }
    catch (err) {
        console.error("Error deleting game from list:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
router.delete("/delete/list/:listID/:provID", async (req, res) => {
    const list_id_parsed = parseInt(req.params.listID);
    const prov_id = decodeURIComponent(req.params.provID);
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: prov_id });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const list = await AppDataSource.getRepository(List).findOneBy({ listId: list_id_parsed });
        if (!list || list.userId !== user.userId) {
            return res.status(403).json({ message: "List not found or does not belong to this user." });
        }
        const comments = await AppDataSource.getRepository(Comment).find({
            where: { listId: list_id_parsed },
            select: ["commentId"],
        });
        const commentIds = comments.map((c) => c.commentId);
        if (commentIds.length > 0) {
            await AppDataSource.getRepository(CommentLikes).delete({ commentId: In(commentIds) });
            await AppDataSource.getRepository(Comment).delete({ listId: list_id_parsed });
        }
        await AppDataSource.getRepository(ListLikes).delete({ listId: list_id_parsed });
        await AppDataSource.getRepository(ListGame).delete({ listId: list_id_parsed });
        await AppDataSource.getRepository(List).delete({ listId: list_id_parsed });
        console.log(`List ${list_id_parsed} deleted by user ${user.userId}`);
        return res.status(200).json({ message: "List deleted successfully." });
    }
    catch (err) {
        console.error("Error deleting list:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
//# sourceMappingURL=list_route.js.map