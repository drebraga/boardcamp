import db from "../database/database.connection.js";

const checkCustomer = () => {
    return async (req, res, next) => {

        const { customerId } = req.body;

        try {

            const { rows: customersExists } = await db.query(`
                SELECT * FROM customers WHERE id = $1
            `, [customerId]);

            if (customersExists.length === 0) return res.sendStatus(400);

            next();

        } catch (err) {
            return res.status(500).send(err.message);
        }
    };
};

export default checkCustomer;