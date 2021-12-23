require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(formidableMiddleware());
app.use(cors());
// Connexion à la BDD nommée "students-app" :
mongoose.connect(process.env.MONGODB_URI);

// Import des routes

const usersRoutes = require("./routes/users");
app.use(usersRoutes);

const adminRoutes = require("./routes/admin");
app.use(adminRoutes);

app.get("/", (req, res) => {
  res.json("WELCOME to JPK-MK API ! 😎");
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
