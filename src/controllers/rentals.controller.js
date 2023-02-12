import db from "../database/database.connection.js";
import dayjs from "dayjs";


export const getRentals = async (req, res) => {

    const searchByCustomer = req.query.customerId;
    const searchByGame = req.query.gameId;
    const orderBy = req.query.order ? req.query.order : "id";
    const desc = req.query.desc ? "DESC" : "ASC";
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 99999;

    try {

        const { rows: rentals } = searchByCustomer ?
                await db.query(`
                    SELECT * 
                    FROM rentals 
                    ORDER BY ${orderBy} ${desc}
                    WHERE "customerId" = $1 
                    LIMIT $2 OFFSET $3;
                `, [searchByCustomer, limit, offset]) : (searchByGame) ?
                await db.query(`
                    SELECT * 
                    FROM rentals 
                    ORDER BY ${orderBy} ${desc}
                    WHERE "gameId" = $1 
                    LIMIT $2 OFFSET $3;
                `, [searchByGame, limit, offset]) :
                await db.query(`
                    SELECT * 
                    FROM rentals 
                    ORDER BY ${orderBy} ${desc}
                    LIMIT $1 OFFSET $2;
                `, [limit, offset]);


        const { rows: customers } = await db.query(`
            SELECT id, name FROM customers
        `);

        const { rows: games } = await db.query(`
            SELECT id, name FROM games
        `);


        const response = rentals.map((item, i) => {
            return ({
                id: item.id,
                customerId: item.customerId,
                gameId: item.gameId,
                rentDate: item.rentDate,
                daysRented: item.daysRented,
                returnDate: item.returnDate,
                originalPrice: item.originalPrice,
                delayFee: item.delayFee,
                customer: {
                    id: rentals[i].customerId,
                    name: customers.find((e) => e.id === rentals[i].customerId).name
                },
                game: {
                    id: rentals[i].gameId,
                    name: games.find((e) => e.id === rentals[i].gameId).name
                }
            });
        });

        return res.send(response);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export const postRentals = async (req, res) => {

    const { customerId, gameId, daysRented } = req.body;

    try {

        const { rows: pricePerDay } = await db.query(`
            SELECT "pricePerDay" FROM games WHERE id = $1;
        `, [gameId]);

        const originalPrice = pricePerDay[0].pricePerDay * daysRented;
        const rentDate = dayjs().format("YYYY-MM-DD");

        await db.query(`
            INSERT INTO 
                rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice")
            VALUES ($1, $2, $3, $4, $5);
        `, [customerId, gameId, rentDate, daysRented, originalPrice]);

        return res.sendStatus(201);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export const returnRental = async (req, res) => {

    const { id } = req.params;

    try {

        const returnDate = dayjs().format("YYYY-MM-DD");

        const { rows: rentals } = await db.query(`
            SELECT "rentDate", "daysRented", "originalPrice" FROM rentals WHERE id = $1;
        `, [id]);

        const { rentDate, daysRented, originalPrice } = rentals[0];

        const diff = dayjs(returnDate).diff(rentDate, "days");
        const pricePerDay = originalPrice / daysRented;

        const delayFee = (diff <= daysRented) ? 0 : (diff - daysRented) * pricePerDay;

        await db.query(`
            UPDATE
                rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3;
        `, [returnDate, delayFee, id]);

        return res.sendStatus(200);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export const deleteRentals = async (req, res) => {

    const { id } = req.params;

    try {

        await db.query(`
            DELETE FROM
                rentals
            WHERE 
                id = $1;
        `, [id]);

        return res.sendStatus(200);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};