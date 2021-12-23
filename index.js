const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(formidableMiddleware());
require("dotenv").config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`

// Connexion à la BDD nommée "students-app" :
mongoose.connect(process.env.MONGODB_URI);

// Import des routes

app.use(cors());

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
