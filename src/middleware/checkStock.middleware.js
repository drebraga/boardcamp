import db from "../database/database.connection.js";

const checkStock = () => {
    return async (req, res, next) => {

        const { gameId } = req.body;

        try {

            const { rows: checkStock } = await db.query(`
                SELECT "stockTotal" FROM games WHERE id = $1;
            `, [gameId]);

            const { rows: totalRentals } = await db.query(`
                SELECT "gameId" FROM rentals 
                WHERE "gameId" = $1 AND "returnDate" IS NULL;
            `, [gameId]);

            if (checkStock[0].stockTotal <= totalRentals.length) return res.sendStatus(400);

            next();

        } catch (err) {
            return res.status(500).send(err.message);
        }
    };
};

export default checkStock;