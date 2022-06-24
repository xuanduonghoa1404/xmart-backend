const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");
//Getting All
router.get("/shop", async (req, res) => {
  try {
    const shop = await Shop.find()
    if (shop && shop.length !== 0) {
    res.json(shop[0]);
    } else {
      res.json({ message: "No shop found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Save one
router.post("/shop", async (req, res) => {
  const shop = new Shop({
    fromEmailAdress: req.body.fromEmailAdress,
    fromEmailPassword: req.body.fromEmailPassword,
    schedule: req.body.schedule,
    templateEmail: req.body.templateEmail,
    warningQuantity: req.body.warningQuantity,
    warningDateExpiration: req.body.warningDateExpiration,
    timeWarning: req.body.timeWarning,
  });
  try {
    const newShop = await shop.save();
    res.status(201).json(newShop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Update one
router.patch("/shop/:id", getShopById, async (req, res) => {
  if (req.body.fromEmailAdress != null) {
    req.shop.fromEmailAdress = req.body.fromEmailAdress;
  }

  if (req.body.fromEmailPassword != null) {
    req.shop.fromEmailPassword = req.body.fromEmailPassword;
  }
  if (req.body.schedule != null) {
    req.shop.schedule = req.body.schedule;
  }
  if (req.shop.templateEmail != null) {
    req.shop.templateEmail = req.body.templateEmail;
  }
  try {
    const updateShop = await req.shop.save();
    res.json(updateShop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Update status one
// router.patch("/shop/status/:id", getShopById, async (req, res) => {
//   if (req.shop.status != null) {
//     req.shop.status = !req.shop.status;
//   }
//   try {
//     const updateShop = await req.shop.save();
//     res.json(updateShop);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

//Getting one
router.get("/shop/:id", getShopById, async (req, res) => {
  res.send(req.shop);
});

//Deleting one
// router.delete("/shop/:id", getShopById, async (req, res) => {
//   try {
//     await req.shop.remove();
//     res.json({ message: `Deleted Shop` });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

async function getShopById(req, res, next) {
  let shop;
  try {
    shop = await Shop.findById(req.params.id);
    if (shop == null) {
      return res.status(404).json({ message: "Can not find shop" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.shop = shop;
  next();
}

module.exports = router;
