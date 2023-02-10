import db from "../database/database.connection.js";

export const getCustomers = async (req, res) => {

    try {

        const customers = await db.query("SELECT * FROM customers");
        return res.status(200).send(customers.rows);

    } catch (err) {

        return res.status(500).send(err.response.message);

    }
};

export const getCustomersById = async (req, res) => {

    const { id } = req.params

    try {

        const customers = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        return res.status(200).send(customers.rows[0]);

    } catch (err) {

        return res.status(500).send(err.response.message);

    }
};

export const postCustomers = async (req, res) => {

    const game = req.body;

    try {

        db.query(`
            INSERT INTO 
                customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
        `, [game.name, game.phone, game.cpf, game.birthday]);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.response.message);

    }
};