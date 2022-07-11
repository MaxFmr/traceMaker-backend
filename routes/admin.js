const express = require('express');
const router = express.Router();
const axios = require('axios');
const base64_encode = require('base-64');
const { Parser } = require('json2csv');

const User = require('../models/User');
const Data = require('../models/Data');
const driver = require('bigchaindb-driver');
const https = require('https');

//consulter les donées en JSON
router.get('/admin/consult/:_id', async (req, res) => {
  const user = await User.findById(req.params._id);

  const apiHeader = user.apiHeader;

  //définition des dates : J et J-5_____________________________________________

  //ajourd'hui
  const date = new Date();
  const nowDate = date.toISOString().split('T')[0];

  //hier
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 5);

  const yesterdayDate = yesterday.toISOString().split('T')[0];
  //_____________________________________________________________________________

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

    // const buyer = new driver.Ed25519Keypair();
    // const conn = new driver.Connection('https://test.ipdb.io/api/v1/');

    // response.data.map((batch) => {
    //   driver.Transaction.makeCreateTransaction(
    //     { batch: batch },
    //     null,
    //     [
    //       driver.Transaction.makeOutput(
    //         driver.Transaction.makeEd25519Condition(buyer.publicKey)
    //       ),
    //     ],
    //     buyer.publicKey
    //   );
    // });

    // const txSigned = driver.Transaction.signTransaction(tx, buyer.privateKey);
    // conn.postTransactionCommit(txSigned);
    // console.log(txSigned);

    // const newData = new Data({
    //   batch: response.data,
    // });

    // await newData.save();
    res.send({ data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//consulter les donées en CSV
router.get('/admin/consult/csv/:_id', async (req, res) => {
  const user = await User.findById(req.params._id);

  const apiHeader = user.apiHeader;

  //définition des dates : J et J-3_____________________________________________

  //ajourd'hui
  const date = new Date();
  const nowDate = date.toISOString().split('T')[0];

  //hier
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 2);

  const yesterdayDate = yesterday.toISOString().split('T')[0];
  //__________________________________________________________________________________

  try {
    const response = await axios.get(
      `https://www.tracabapp.com/group/espace-acheteurs/mes_achats?p_p_id=portlet_abapp_reporting_PortletAbappReportingPortlet_INSTANCE_gOeclmmi98B4&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=ligneAchat&p_p_cacheability=cacheLevelPage&dateStart=${yesterdayDate}&dateStop=${nowDate}&446025806`,

      {
        headers: {
          Authorization: `Basic ${apiHeader}`,
        },
      }
    );
    console.log(response.data);

    const csv = response.data;
    res.set('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//consulter les donées bacs en CSV

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

router.get('/admin/consult/bacs/csv', async (req, res) => {
  //__________________________________________________________________________________

  try {
    const response = await axios.get(
      `https://rfid.w-fish.com/api/fisheries/buyers/inventory/statistics`,
      { httpsAgent },

      {
        headers: {
          Authorization: `Token 8715b425b864cb2d457c57bc9857fe46a7b1eb08ed66c49da3d2540782d7faa1`,
        },
      }
    );
    console.log(response.data);

    const csv = response.data;
    res.set('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get id of user
router.get('/admin/userid', async (req, res) => {
  console.log('route : /userid');
  try {
    const user = await User.findOne({ email: req.query.email });

    res.json(user._id);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
