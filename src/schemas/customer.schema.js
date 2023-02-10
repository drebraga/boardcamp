import Joi from "joi";
import dayjs from "dayjs";

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().max(11).min(10).required(),
    cpf: Joi.string().length(11).required(),
    birthday: Joi.date().max(dayjs().format("YYYY-MM-DD")).iso().required()
});