import db from "../database/database.connection.js";
import dayjs from "dayjs";


export const getRentals = async (req, res) => {
    try {

        const { rows: rentals } = await db.query(`
            SELECT * FROM rentals
        `);

        const { rows: customers } = await db.query(`
            SELECT id, name FROM customers
        `);

        const { rows: games } = await db.query(`
            SELECT id, name FROM games
        `);


        const response = rentals.map((item, i) => {
            return ({
                item,
                customer: {
                    id: rentals[i].customerId,
                    name: customers.find((e) => e.id === rentals[i].customerId).name
                },
                game: {
                    id: rentals[i].gameId,
                    name: games.find((e) => e.id === rentals[i].gameId).name
                }
            })
        });

        return res.send(response);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export const postRentals = async (req, res) => {

    const { customerId, gameId, daysRented } = req.body;

    try {

        const { rows: pricePerDay } = await db.query(`
            SELECT "pricePerDay" FROM games WHERE id = $1
        `, [gameId]);

        const originalPrice = pricePerDay[0].pricePerDay * daysRented;
        const rentDate = dayjs().format("YYYY-MM-DD");

        await db.query(`
            INSERT INTO 
                rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice")
            VALUES ($1, $2, $3, $4, $5)
        `, [customerId, gameId, rentDate, daysRented, originalPrice]);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.message);

    }

}

export const returnRental = async (req, res) => {

    const { id } = req.params;

    try {

        const returnDate = dayjs().format("YYYY-MM-DD");

        const { rows: rentals } = await db.query(`
            SELECT "rentDate", "daysRented", "originalPrice" FROM rentals WHERE id = $1
        `, [id]);

        if (rentals.length === 0) return res.sendStatus(404);

        const { rentDate, daysRented, originalPrice } = rentals[0];

        const diff = dayjs(returnDate).diff(rentDate, "days");
        const pricePerDay = originalPrice / daysRented;

        const delayFee = (diff <= daysRented) ? 0 : pricePerDay * diff;

        await db.query(`
            UPDATE
                rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3;
        `, [returnDate, delayFee, id]);

        return res.sendStatus(201);

    } catch (err) {

        return res.status(500).send(err.message);

    }

}

export const deleteRentals = (req, res) => {

}