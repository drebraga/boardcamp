import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import gamesRouter from "./routes/games.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use([gamesRouter]);

app.listen(process.env.PORT, () => {
    console.log(`Servidor aberto na porta ${process.env.PORT}`);
});