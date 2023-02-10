import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controller.js";
import schemaValidate from "../middleware/schema.validation.js";
import { gameSchema } from "../schemas/game.schema.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", schemaValidate(gameSchema), postGames);

export default gamesRouter;