import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, putCustomers } from "../controllers/customers.controller.js";
import { customerSchema } from "../schemas/customer.schema.js";
import schemaValidate from "../middleware/schema.validation.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomersById);
customerRouter.post("/customers", schemaValidate(customerSchema), postCustomers);
customerRouter.put("/customers/:id", schemaValidate(customerSchema), putCustomers);

export default customerRouter;