import db from "../database/database.connection.js";

export const getGames = async (req, res) => {

    try {

        const { rows: games } = await db.query("SELECT * FROM games");
        return res.status(200).send(games);

    } catch (err) {

        return res.status(500).send(err.message);

    }
};

export const postGames = async (req, res) => {

    const { name, image, stockTotal, pricePerDay } = req.body;

    try {

        const { rows: gameExists } = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);

        if (gameExists.length === 0) return res.sendStatus(409);

        await db.query(`
            INSERT INTO 
                games (name, image, "stockTotal", "pricePerDay")
            VALUES ($1, $2, $3, $4)
        `, [name, image, stockTotal, pricePerDay]);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.message);

    }
};