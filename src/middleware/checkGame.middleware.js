import db from "../database/database.connection.js";

const checkGame = () => {
    return async (req, res, next) => {

        const { gameId } = req.body;

        try {

            const { rows: gameExists } = await db.query(`
                SELECT * FROM games WHERE id = $1
            `, [gameId]);

            if (gameExists.length === 0) return res.sendStatus(400);

            next();

        } catch (err) {
            return res.status(500).send(err.message);
        }
    };
};

export default checkGame;