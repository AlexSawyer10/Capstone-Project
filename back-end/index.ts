import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import {AppDataSource} from "./db-connection.js";
import {Comment} from "./src/entities/comment.js";
import {loginRouter} from "./src/routes/login_route.js";

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use("/login", loginRouter)

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
