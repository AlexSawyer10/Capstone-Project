export { router as searchRouter }

import express from 'express';
import { AppDataSource } from "../../db-connection.js";
import { User } from "../entities/user.js";
import dotenv from "dotenv";


const router = express.Router();

dotenv.config();
const API_KEY = process.env.API_KEY;

router.get("/:userSearchInput", async (req, res) => {
    try {
        const { userSearchInput } = req.params;
        const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(userSearchInput)}`;
        const rawgData = await fetch(url);
        const data = await rawgData.json();
/*
        console.log(data); its working
*/
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ message: "Search failed", error });
    }
});

/*This gets the description of the game that they want to learn more about*/
router.get("/id/:id", async (req, res) => {
    try
    {
        const { id } = req.params;

        const url = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`

        const rawgData = await fetch(url);
        const data = await rawgData.json();

        console.log("data test", data); /*works !*/

        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
})

