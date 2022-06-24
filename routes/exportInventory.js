const express = require("express");
const router = express.Router();
const ExportInventory = require("../models/ExportInventory");
const Inventory = require("../models/Inventory");
const { number, func } = require("joi");

//get all export inventory
router.get("/exportInventory", async (req, res) => {
  try {
    const exportInventory = await ExportInventory.find().sort({ createdAt: -1 }).populate('export.inventory');
    res.json(exportInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Save one
router.post("/exportInventory", async (req, res) => {
  try {
    let totalPrice = 0;
    for (let i = 0; i < req.body.export.length; i++) {
      let inventory = await Inventory.findById(req.body.export[i].inventory);
      totalPrice +=
        Number(inventory.priceperunit) * Number(req.body.export[i].amount);
        if(inventory.amount >= req.body.export[i].amount){
          inventory.amount -= req.body.export[i].amount;
        } else {
          res.status(400).json({inventory: inventory.name });
        }
     
      let newExport = { amount: req.body.export[i].amount, time: new Date() };
      if (!inventory.export) inventory.export = [];
      inventory.export.push(newExport);
      try {
        await inventory.save();
      } catch (error) {
        res.status(400).json({ message: err.message });
      }
    }
    const exportInventory = new ExportInventory({
      name: req.body.name,
      export: req.body.export,
      totalPrice: totalPrice,
    });

    const newExportInventory = await exportInventory.save();

    const inventory = res.status(201).json(newExportInventory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Getting one
router.get("/exportInventory/:id", getExportInventoryById, async (req, res) => {
  res.send(req.exportInventory);
});

//Deleting one
router.delete(
  "/exportInventory/:id",
  getExportInventoryById,
  async (req, res) => {
    try {
      await req.exportInventory.remove();
      res.json({ message: `Deleted ExportInventory` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getExportInventoryById(req, res, next) {
  let exportInventory;
  try {
    exportInventory = await ExportInventory.findById(req.params.id);
    if (exportInventory == null) {
      return res.status(404).json({ message: "Can not find exportInventory" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.exportInventory = exportInventory;
  next();
}

module.exports = router;
