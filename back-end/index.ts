import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import {AppDataSource} from "./db-connection.js";
import {Comment} from "./src/entities/comment.js";
import {loginRouter} from "./src/routes/login_route.js";
import {searchRouter} from "./src/routes/search_route.js";
import {profileRouter} from "./src/routes/profile_route.js";
import {listRouter} from "./src/routes/list_route.js";

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json({ limit: '5mb' })); /*this is to limit the size of the json data
                                          that can be sent to the server, previously the image made it
                                          unable to send so I manually bump up the amount it can take here*/
                                            /*express limits it by default*/

app.use("/login", loginRouter)
app.use("/search", searchRouter)
app.use("/profile", profileRouter)
app.use("/list", listRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data source has been initialized!');
  })
  .catch((error: any) => {
    console.error('Error during data source initialization:', error);
  });
