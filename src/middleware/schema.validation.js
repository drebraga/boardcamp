const schemaValidate = (schema) => {
    return async (req, res, next) => {
        try {

            await schema.validateAsync(req.body, { abortEarly: false });

            next();

        } catch (err) {

            return res.sendStatus(400);

        }
    }
};

export default schemaValidate;