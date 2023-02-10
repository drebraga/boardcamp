import db from "../database/database.connection.js";

export const getGames = async (req, res) => {

    try {

        const games = await db.query("SELECT * FROM games");
        return res.status(200).send(games.rows);

    } catch (err) {

        return res.status(500).send(err.response.message);

    }
};

export const postGames = async (req, res) => {

    const game = req.body;

    try {

        db.query(`
            INSERT INTO 
                games (name, image, "stockTotal", "pricePerDay")
            VALUES ('${game.name}', '${game.image}', ${game.stockTotal}, ${game.pricePerDay})
        `);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.response.message);

    }
};