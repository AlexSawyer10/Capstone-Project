export { router as loginRouter }

import express from 'express';
import { AppDataSource } from "../../db-connection.js";
import { User } from "../entities/user.js";

const router = express.Router();



router.post('/', async (req, res) => {
  const { user_provider_id, user_email, name, user_picture } = req.body;

  console.log(user_provider_id);
  console.log(name);
  console.log(user_email);
  console.log(user_picture);

  try {
    const userExists = await CheckIfUserExists(user_provider_id);

    if (!userExists) {
      const user = new User();
      user.userProviderId = user_provider_id;
      user.userEmail = user_email;
      user.name = name;
      user.userPicture = user_picture;

      await AppDataSource.getRepository(User).save(user);
      console.log("User saved to the database.");
      res.status(201).json({ message: "User created successfully." });
    } else {
      res.status(200).json({ message: "User already exists." });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

async function CheckIfUserExists(user_provider_id: string): Promise<boolean> {
  const user = await AppDataSource.getRepository(User).findOneBy({ userProviderId: user_provider_id });

  if (user) {
    console.log("User already exists in the database.");
    return true;
  } else {
    console.log("User does not exist in the database.");
    return false;
  }
}
