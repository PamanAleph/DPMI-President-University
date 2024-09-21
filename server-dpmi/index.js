require("dotenv").config();
const express = require("express");
const app = express();
require("./config/db");
const cors = require("cors");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routerMajor = require("./routes/majorRoute");

app.use("/api/v1/major", routerMajor);
app.use("/api/v1/major", routerMajor);

const port = process.env.PORT | 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
