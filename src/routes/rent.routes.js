import { Router } from "express";
import { getRentals, postRentals, returnRental, deleteRentals } from "../controllers/rentals.controller.js";
import { rentSchema } from "../schemas/rent.schema.js";
import checkCustomer from "../middleware/checkCustomer.middleware.js";
import checkGame from "../middleware/checkGame.middleware.js";
import schemaValidate from "../middleware/schema.validation.js";
import checkStock from "../middleware/checkStock.middleware.js";
import checkRentId from "../middleware/checkRentId.middleware.js";

const rentRouter = Router();

rentRouter.get("/rentals", getRentals);
rentRouter.post("/rentals",
    schemaValidate(rentSchema),
    checkCustomer(),
    checkGame(),
    checkStock(),
    postRentals);
rentRouter.post("/rentals/:id/return", checkRentId(), returnRental);
rentRouter.delete("/rentals/:id", deleteRentals);

export default rentRouter;