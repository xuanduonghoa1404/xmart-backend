const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");
//Getting All
router.get("/shop", async (req, res) => {
  try {
    const shop = await Shop.find();
    if (shop && shop.length !== 0) {
      res.json({
        ...shop[0]._doc,
        imageBanner: shop[0].imageBanner.toString().replace(/,/g, "\n"),
        imageBannerSecondary: shop[0].imageBannerSecondary
          .toString()
          .replace(/,/g, "\n"),
      });
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
    warningQuantity: req.body.imageBannerSecondary.split("\n"),
    warningDateExpiration: req.body.imageBanner.split("\n"),
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
  if (req.shop.imageBanner) {
    req.shop.imageBanner = req.body.imageBanner.split("\n");
  }
  if (req.shop.imageBannerSecondary) {
    req.shop.imageBannerSecondary = req.body.imageBannerSecondary.split("\n");
  }
  try {
    const updateShop = await req.shop.save();
    res.json(updateShop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

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
