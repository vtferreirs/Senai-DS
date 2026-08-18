import express from "express";
import cardRoutes from "./routes/cardRoutes.js";
import quadroRoutes from "./routes/quadroRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import connectDatabase from "./database/connection.js";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
connectDatabase();
const app = express();

console.log("Esse é o servidor do sla n pensei num nome ainda ");

const PORT = 3000;

app.use(express.json());


console.log("Rotas de produtos carregadas");

app.use("/cards", cardRoutes);
app.use("/users", usuarioRoutes);
app.use("/quadros", quadroRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "API está funcionando! "
    });
});


app.get("/teste", (req, res) => {
    res.send("Servidor de teste funcionando!");
});



const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
 