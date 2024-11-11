require("dotenv").config();
const express = require("express");
const app = express();
require("./config/db");
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routerMajor = require("./routes/majorRoute");
const routerSetup = require("./routes/setupRoute");
const routerSections = require("./routes/sectionsRoute")
const routerQuestions = require("./routes/questionRoute");
const routerEvaluations = require("./routes/evaluationsRoute");
const routerAnswer = require("./routes/answerRoute");
const routerAuth = require("./routes/authRoute")
const routerUsers = require("./routes/userRoutes")
const routerRole = require('./routes/roleRoute')
const routerDownload = require("./routes/downloadRoute");
const routerOptions = require("./routes/optionsRoute");

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

app.use("/api/v1/major", routerMajor);
app.use("/api/v1/setup", routerSetup);
app.use("/api/v1/sections", routerSections);
app.use("/api/v1/questions", routerQuestions);
app.use("/api/v1/evaluations", routerEvaluations);
app.use("/api/v1/answers", routerAnswer);
app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/users", routerUsers);
app.use("/api/v1/roles", routerRole);
app.use("/api/v1/download", routerDownload);
app.use("/api/v1/options", routerOptions);

const port = process.env.PORT | 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
