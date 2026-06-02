export { router as profileRouter };
import express from 'express';
import dotenv from "dotenv";
import { AppDataSource } from "../../db-connection.js";
import { User } from "../entities/user.js";
dotenv.config();
const router = express.Router();
router.get("/:query", async (req, res) => {
    const query = decodeURIComponent(req.params.query);
    /*express already decodes it but for readability i'm going to keep it*/
    try {
        console.log(query);
        const users = await AppDataSource.getRepository(User)
            .createQueryBuilder('user')
            .where('user.userEmail LIKE :query OR user.name LIKE :query', { query: `%${query}%` })
            .select(['user.userId', 'user.userEmail', 'user.name', 'user.userPicture'])
            .getMany();
        console.log(users);
        return res.status(200).json(users);
    }
    catch (err) {
        console.error('Error searching profiles:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
router.get("/", async (req, res) => {
});
//# sourceMappingURL=profile_route.js.map