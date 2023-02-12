import db from "../database/database.connection.js";

export const getCustomers = async (req, res) => {

    const searchByCPF = req.query.cpf;
    const orderBy = req.query.order ? req.query.order : "id";
    const desc = req.query.desc ? "DESC" : "ASC";
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 99999;

    try {

        const { rows: customers } = searchByCPF ?
            await db.query(`
                SELECT * 
                FROM customers 
                WHERE LOWER(cpf) LIKE '${searchByCPF}%' 
                ORDER BY "${orderBy}" ${desc}
                LIMIT $1 OFFSET $2;
            `, [limit, offset]) :
            await db.query(`
                SELECT * 
                FROM customers 
                ORDER BY "${orderBy}" ${desc} 
                LIMIT $1 OFFSET $2;
            `, [limit, offset]);
        return res.status(200).send(customers);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export const getCustomersById = async (req, res) => {

    const { id } = req.params;

    try {

        const { rows: customer } = await db.query(`
            SELECT * FROM
                customers
            WHERE
                id = $1
            `, [id]);

        if (!customer[0]) return res.sendStatus(404);

        return res.status(200).send(customer[0]);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export const postCustomers = async (req, res) => {

    const { name, phone, cpf, birthday } = req.body;

    try {

        const { rows: customerExists } = await db.query(`
            SELECT * FROM
                customers
            WHERE
                cpf = $1
        `, [cpf]);

        if (customerExists.length !== 0) return res.sendStatus(409);

        await db.query(`
            INSERT INTO
                customers (name, phone, cpf, birthday)
            VALUES
                ($1, $2, $3, $4)
        `, [name, phone, cpf, birthday]);

        return res.sendStatus(201);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export const putCustomers = async (req, res) => {

    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {

        const { rows: customerExists } = await db.query(`
        SELECT * FROM 
            customers 
        WHERE 
            cpf = $1 AND id <> $2`, [cpf, id]);

        if (customerExists.length !== 0) return res.sendStatus(409);

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
        `, [name, phone, cpf, birthday, id]);

        return res.sendStatus(200);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};