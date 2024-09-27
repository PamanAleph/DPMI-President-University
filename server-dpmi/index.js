require("dotenv").config();
const express = require("express");
const app = express();
require("./config/db");
const cors = require("cors");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routerMajor = require("./routes/majorRoute");
const routerSetup = require("./routes/setupRoute");
const routerSections = require("./routes/sectionsRoute")
const routerQuestions = require("./routes/questionRoute");
const routerEvaluations = require("./routes/evaluationsRoute");

app.use("/api/v1/major", routerMajor);
app.use("/api/v1/setup", routerSetup);
app.use("/api/v1/sections", routerSections);
app.use("/api/v1/questions", routerQuestions);
app.use("/api/v1/evaluations", routerEvaluations);

const port = process.env.PORT | 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
