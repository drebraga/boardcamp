import express from "express";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors());
app.use([]);

app.listen(process.env.PORT, () => {
    console.log(`Servidor aberto na porta ${process.env.PORT}`);
});