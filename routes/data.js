const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("../models/User");
const Data = require("../models/Data");

// **Create**
router.post("/data/create", async (req, res) => {
  console.log("route : /create");
  // ce console.log s'affichera dans le terminal quand cette route sera interrogée
  console.log(req.fields);
  // ce console.log affichera les données transmises à la route
  try {
    const response = await axios.get(
      "https://www.tracabapp.com/api/jsonws/abapp.ligneachat/get-lignes-achat/code-criee/CC/date-start/2021-11-01/date-stop/2021-11-04/code-espece-fao/-1/code-calibre/-1/zdp/-1/code-engin-c/-1/p-francais/false",
      {
        headers: {
          Authorization: "Basic anBrZXJsaWRvdUBnbWFpbC5jb206VmluY2kxOTY2Kys=",
        },
      }
    );
    console.log(response.data);

    // Création d'un nouveau document grâce aux données envoyées via Postman :
    const newData = new Data({
      batch: response.data,
    });
    // "new Student" permet ici de créer un document "Student" sur la base du modèle "Student"

    // On sauvegarde ensuite "newStudent" dans la BDD :
    await newData.save();

    // On retourne un message qui apparaîtra dans Postman :
    res.json({ message: "Data created" });

    // On peut sinon choisir de retouner "newStudent" :
    // res.json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
