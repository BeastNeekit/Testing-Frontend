const express = require("express");
const colors = require("colors");
const { connection } = require("./db");
const orderRoutes = require('./Routes/orderRoutes');
const cors = require('cors');

require("dotenv").config

const app = express();
const port = process.env.PORT ;

app.use(express.json());

app.use(cors(
    {
      origin: ["https://frontend-delta-gilt-40.vercel.app"],
      methods: ["POST", "GET"],
      credentials: true
    }
));
app.use("/oder", orderRoutes);

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "I am in home route" });
  } catch (error) {
    res.status(500).json({ msg: "Error in home route" });
  }
});





app.listen(port, async () => {
  try {
    await connection;
    console.log(colors.bgYellow(`connectd to mongo db`));
  } catch (error) {
    console.log(colors.bgRed("Error in connecting mongoDb"));
  }
  console.log(colors.rainbow(`Backend is running on port ${port}`));
});
