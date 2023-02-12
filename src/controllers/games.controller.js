import db from "../database/database.connection.js";

export const getGames = async (req, res) => {

    const searchByName = req.query.name;
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 99999;

    try {

        const { rows: games } = searchByName ?
            await db.query(`
                SELECT * FROM games WHERE LOWER(name) LIKE '${searchByName}%' LIMIT $1 OFFSET $2;
            `, [limit, offset]) :
            await db.query("SELECT * FROM games LIMIT $1 OFFSET $2;", [limit, offset]);
        return res.status(200).send(games);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export const postGames = async (req, res) => {

    const { name, image, stockTotal, pricePerDay } = req.body;

    try {

        const { rows: gameExists } = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);

        if (gameExists.length !== 0) return res.sendStatus(409);

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