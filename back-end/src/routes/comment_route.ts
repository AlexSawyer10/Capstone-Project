export { router as commentRouter }

import express from "express";
import { AppDataSource } from "../../db-connection.js";
import { Comment } from "../entities/comment.js";
import { CommentLikes } from "../entities/comment_likes.js";
import { User } from "../entities/user.js";
import { List } from "../entities/list.js";

const router = express.Router();

function isVoteLiked(value: boolean | null | number | undefined): boolean {
    return value === true || value === 1;
}

function isVoteDisliked(value: boolean | null | number | undefined): boolean {
    return value === false || value === 0;
}

router.post("/:listID/:provID", async (req, res) => {
    const listId = parseInt(req.params.listID);
    const provId = decodeURIComponent(req.params.provID);
    const { comment_description } = req.body;

    try {
        if (!comment_description?.trim()) {
            return res.status(400).json({ message: "Comment description is required." });
        }

        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user) return res.status(404).json({ message: "User not found." });

        const list = await AppDataSource.getRepository(List).findOneBy({ listId });
        if (!list) return res.status(404).json({ message: "List not found." });

        const newComment = new Comment();
        newComment.userId = user.userId;
        newComment.listId = listId;
        newComment.commentDescription = comment_description.trim().slice(0, 400);
        newComment.commentLikes = 0;
        newComment.commentDislikes = 0;

        const saved = await AppDataSource.getRepository(Comment).save(newComment);
        const commentCount = await AppDataSource.getRepository(Comment).count({ where: { listId } });

        return res.status(201).json({
            message: "Comment posted successfully.",
            comment: saved,
            commentCount,
        });
    } catch (err) {
        console.error("Error posting comment:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/vote/:commentID/:provID", async (req, res) => {
    const commentId = parseInt(req.params.commentID);
    const provId = decodeURIComponent(req.params.provID);

    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user) return res.status(404).json({ message: "User not found." });

        const existing = await AppDataSource.getRepository(CommentLikes).findOneBy({
            userId: user.userId,
            commentId,
        });

        if (!existing) {
            return res.status(200).json({ liked: false, disliked: false });
        }

        return res.status(200).json({
            liked: isVoteLiked(existing.isLiked),
            disliked: isVoteDisliked(existing.isLiked),
        });
    } catch (err) {
        console.error("Error fetching comment vote status:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/like/:commentID/:provID", async (req, res) => {
    const commentId = parseInt(req.params.commentID);
    const provId = decodeURIComponent(req.params.provID);

    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user) return res.status(404).json({ message: "User not found." });

        const comment = await AppDataSource.getRepository(Comment).findOneBy({ commentId });
        if (!comment) return res.status(404).json({ message: "Comment not found." });

        const existing = await AppDataSource.getRepository(CommentLikes).findOneBy({
            userId: user.userId,
            commentId,
        });

        if (existing) {
            if (isVoteLiked(existing.isLiked)) {
                comment.commentLikes = Math.max(0, comment.commentLikes - 1);
                await AppDataSource.getRepository(CommentLikes).remove(existing);
                await AppDataSource.getRepository(Comment).save(comment);
                return res.status(200).json({
                    commentLikes: comment.commentLikes,
                    commentDislikes: comment.commentDislikes,
                    liked: false,
                    disliked: false,
                });
            }
            if (isVoteDisliked(existing.isLiked)) {
                comment.commentDislikes = Math.max(0, comment.commentDislikes - 1);
                comment.commentLikes += 1;
                existing.isLiked = true;
                await AppDataSource.getRepository(CommentLikes).save(existing);
                await AppDataSource.getRepository(Comment).save(comment);
                return res.status(200).json({
                    commentLikes: comment.commentLikes,
                    commentDislikes: comment.commentDislikes,
                    liked: true,
                    disliked: false,
                });
            }
        }

        const newLike = new CommentLikes();
        newLike.userId = user.userId;
        newLike.commentId = commentId;
        newLike.isLiked = true;
        comment.commentLikes += 1;
        await AppDataSource.getRepository(CommentLikes).save(newLike);
        await AppDataSource.getRepository(Comment).save(comment);

        return res.status(200).json({
            commentLikes: comment.commentLikes,
            commentDislikes: comment.commentDislikes,
            liked: true,
            disliked: false,
        });
    } catch (err) {
        console.error("Error liking comment:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/dislike/:commentID/:provID", async (req, res) => {
    const commentId = parseInt(req.params.commentID);
    const provId = decodeURIComponent(req.params.provID);

    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user) return res.status(404).json({ message: "User not found." });

        const comment = await AppDataSource.getRepository(Comment).findOneBy({ commentId });
        if (!comment) return res.status(404).json({ message: "Comment not found." });

        const existing = await AppDataSource.getRepository(CommentLikes).findOneBy({
            userId: user.userId,
            commentId,
        });

        if (existing) {
            if (isVoteDisliked(existing.isLiked)) {
                comment.commentDislikes = Math.max(0, comment.commentDislikes - 1);
                await AppDataSource.getRepository(CommentLikes).remove(existing);
                await AppDataSource.getRepository(Comment).save(comment);
                return res.status(200).json({
                    commentLikes: comment.commentLikes,
                    commentDislikes: comment.commentDislikes,
                    liked: false,
                    disliked: false,
                });
            }
            if (isVoteLiked(existing.isLiked)) {
                comment.commentLikes = Math.max(0, comment.commentLikes - 1);
                comment.commentDislikes += 1;
                existing.isLiked = false;
                await AppDataSource.getRepository(CommentLikes).save(existing);
                await AppDataSource.getRepository(Comment).save(comment);
                return res.status(200).json({
                    commentLikes: comment.commentLikes,
                    commentDislikes: comment.commentDislikes,
                    liked: false,
                    disliked: true,
                });
            }
        }

        const newDislike = new CommentLikes();
        newDislike.userId = user.userId;
        newDislike.commentId = commentId;
        newDislike.isLiked = false;
        comment.commentDislikes += 1;
        await AppDataSource.getRepository(CommentLikes).save(newDislike);
        await AppDataSource.getRepository(Comment).save(comment);

        return res.status(200).json({
            commentLikes: comment.commentLikes,
            commentDislikes: comment.commentDislikes,
            liked: false,
            disliked: true,
        });
    } catch (err) {
        console.error("Error disliking comment:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/:commentID/:provID", async (req, res) => {
    const commentId = parseInt(req.params.commentID);
    const provId = decodeURIComponent(req.params.provID);

    try {
        const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: provId });
        if (!user) return res.status(404).json({ message: "User not found." });

        const comment = await AppDataSource.getRepository(Comment).findOneBy({ commentId });
        if (!comment) return res.status(404).json({ message: "Comment not found." });

        if (comment.userId !== user.userId) {
            return res.status(403).json({ message: "You can only delete your own comments." });
        }

        const listId = comment.listId;
        await AppDataSource.getRepository(CommentLikes).delete({ commentId });
        await AppDataSource.getRepository(Comment).delete({ commentId });
        const commentCount = await AppDataSource.getRepository(Comment).count({ where: { listId } });

        return res.status(200).json({
            message: "Comment deleted successfully.",
            commentCount,
        });
    } catch (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/by/list/:listId", async (req, res) => {
    const listId = parseInt(req.params.listId);

    try {
        const list = await AppDataSource.getRepository(List).findOneBy({ listId });
        if (!list) return res.status(404).json({ message: "List not found." });

        const comments = await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .innerJoin(User, "user", "user.userId = comment.userId")
            .select([
                "comment.commentId",
                "comment.commentDescription",
                "comment.commentLikes",
                "comment.commentDislikes",
                "comment.listId",
                "user.userId",
                "user.name",
                "user.userEmail",
                "user.userPicture",
            ])
            .where("comment.listId = :listId", { listId })
            .orderBy("comment.commentId", "DESC")
            .getRawMany();

        return res.status(200).json({ comments });
    } catch (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});
