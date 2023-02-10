import db from "../database/database.connection.js";

export const getGames = async (req, res) => {

    try {

        const games = await db.query("SELECT * FROM games");
        return res.status(200).send(games.rows);

    } catch (err) {

        return res.status(500).send(err.message);

    }
};

export const postGames = async (req, res) => {

    const game = req.body;

    try {

        const gameExists = await db.query(`SELECT * FROM games WHERE name = $1`, [game.name]);

        if (gameExists.rows[0]) return res.sendStatus(409);

        await db.query(`
            INSERT INTO 
                games (name, image, "stockTotal", "pricePerDay")
            VALUES ($1, $2, $3, $4)
        `, [game.name, game.image, game.stockTotal, game.pricePerDay]);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.message);

    }
};