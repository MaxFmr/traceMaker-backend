const express = require("express");
const router = express.Router();
const axios = require("axios");
const base64_encode = require("base-64");

const User = require("../models/User");
const Data = require("../models/Data");

// **Create**
router.post("/admin/consult/:_id", async (req, res) => {
  console.log("route : /create");

  const user = await User.findById(req.params._id);

  const apiHeader = user.apiHeader;

  //définition des dates : J et J-1_____________________________________________

  //ajourd'hui
  const date = new Date();
  const nowDate = date.toISOString().split("T")[0];

  //hier
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayDate = yesterday.toISOString().split("T")[0];
  //__________________________________________________________________________________

  try {
    const response = await axios.get(
      `https://www.tracabapp.com/api/jsonws/abapp.ligneachat/get-lignes-achat/code-criee/-1/date-start/${yesterdayDate}/date-stop/${nowDate}/code-espece-fao/-1/code-calibre/-1/zdp/-1/code-engin-c/-1/p-francais/false`,

      {
        headers: {
          Authorization: `Basic ${apiHeader}`,
        },
      }
    );
    console.log(response.data);

    const newData = new Data({
      batch: response.data,
    });

    await newData.save();
    res.send({ message: "Data created in data-base.", data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ged id of user
router.get("/admin/userid", async (req, res) => {
  console.log("route : /userid");
  try {
    // On recherche, grâce à la fonction find(), tous les documents de la collection "students" :
    const user = await User.findOne({ email: req.query.email });

    // On retourne ensuite les documents trouvés :
    res.json(user._id);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
