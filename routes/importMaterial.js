const express = require("express");
const router = express.Router();
const ImportInventory = require("../models/ImportInventory");
const Inventory = require("../models/Inventory");
const { number, func } = require("joi");

//get all import inventory
router.get("/importInventory", async (req, res) => {
  try {
    const importInventory = await ImportInventory.find().populate('import.inventory').sort({ createdAt: -1 });
  //   .populate({
  //     path: 'import.inventory',
  //     populate: {
  //         path: 'name',
  //     },
  // });
    res.json(importInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Save one
router.post("/importInventory", async (req, res) => {
  try {
    let totalPrice = 0;
    for (let i = 0; i < req.body.import.length; i++) {
      let inventory = await Inventory.findById(req.body.import[i].inventory);
      totalPrice +=
        Number(inventory.priceperunit) * Number(req.body.import[i].amount);
      inventory.amount += req.body.import[i].amount;
      let newImport = { amount: req.body.import[i].amount, time: new Date() };
      if (!inventory.import) inventory.import = [];
      inventory.import.push(newImport);
      try {
        await inventory.save();
      } catch (error) {
        res.status(400).json({ message: err.message });
      }
    }
    const importInventory = new ImportInventory({
      name: req.body.name,
      import: req.body.import,
      totalPrice: totalPrice,
    });

    const newImportInventory = await importInventory.save();

    const inventory = res.status(201).json(newImportInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Update one
router.patch("/importInventory/:id", getImportInventoryById, async (req, res) => {
  if (req.body.name != null) {
    req.importInventory.name = req.body.name;
  }

  try {
    const updateImportInventory = await req.importInventory.save();
    res.json(updateImportInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Getting one
router.get("/importInventory/:id", getImportInventoryById, async (req, res) => {
  res.send(req.importInventory);
});

//Deleting one
router.delete(
  "/importInventory/:id",
  getImportInventoryById,
  async (req, res) => {
    try {
      await req.importInventory.remove();
      res.json({ message: `Deleted ImportInventory` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getImportInventoryById(req, res, next) {
  let importInventory;
  try {
    importInventory = await ImportInventory.findById(req.params.id);
    if (importInventory == null) {
      return res.status(404).json({ message: "Can not find importInventory" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.importInventory = importInventory;
  next();
}

module.exports = router;
