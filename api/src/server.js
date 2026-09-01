import express from "express";
import cors from "cors";
import dns from "node:dns";
import connectDatabase from "./database/connection.js";
import cardRoutes from "./routes/cardRoutes.js";
import quadroRoutes from "./routes/quadroRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
connectDatabase();

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

app.use("/card", cardRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/quadro", quadroRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API está funcionando! ",
  });
});

app.get("/teste", (req, res) => {
  res.send("Servidor de teste funcionando!");
});

app.listen(PORT, () => {
  console.log("Esse é o servidor TaskVibe");
  console.log(`Servidor rodando na porta ${PORT}`);
});