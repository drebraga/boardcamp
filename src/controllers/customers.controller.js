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

    const customer = req.body;

    try {

        await db.query(`
            INSERT INTO 
                customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
        `, [customer.name, customer.phone, customer.cpf, customer.birthday]);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.response.message);

    }
};

export const putCustomers = async (req, res) => {

    const { id } = req.params;
    const customer = req.body;

    try {

        await db.query(`
            UPDATE
                customers
            SET 
                name = $1,
                phone = $2,
                cpf = $3,
                birthday = $4
            WHERE 
                id = $5
        `, [customer.name, customer.phone, customer.cpf, customer.birthday, id]);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.response.message);

    }
};