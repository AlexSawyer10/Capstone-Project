export { router as profileRouter }

import express from 'express';
import dotenv from "dotenv";
import { AppDataSource } from "../../db-connection.js";
import { User } from "../entities/user.js";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {

})