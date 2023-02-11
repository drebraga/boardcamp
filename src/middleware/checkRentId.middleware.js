import db from "../database/database.connection.js";

const checkRentId = () => {
    return async (req, res, next) => {

        const { id } = req.params;

        try {

            const { rows: rent } = await db.query(`
                SELECT id, "returnDate" FROM rentals WHERE id = $1;
            `, [id]);

            if (rent.length === 0) return res.sendStatus(404);

            if (rent[0].returnDate !== null) return res.sendStatus(400);

            next();

        } catch (err) {
            return res.status(500).send(err.message);
        }
    };
};

export default checkRentId;