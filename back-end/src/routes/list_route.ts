export { router as listRouter }

import {List} from "../entities/list.js";
import {User} from "../entities/user.js";
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
