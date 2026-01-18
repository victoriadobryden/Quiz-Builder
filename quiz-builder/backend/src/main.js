require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("../db/db");
require("../models"); // register models + relations
const { quizzesRouter } = require("./routes/quizzes");
const categoriesRouter = require("./routes/categories");

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/quizzes", quizzesRouter);
app.use("/categories", categoriesRouter);

async function start() {
  await sequelize.authenticate();
  await sequelize.sync(); // dev/demo; later can replace with migrations
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
