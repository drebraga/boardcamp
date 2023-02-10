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
    try {
        const game = {
            name: 'Banco Imobiliário',
            image: 'http://',
            stockTotal: 3,
            pricePerDay: 1500,
        }
        db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ('Banco Imobiliário', 'http://', 3, 1500)
        `);
        return res.status(200).send("Tudo certo");
    } catch (err) {
        return res.status(500).send(err.response.message);
    }
};