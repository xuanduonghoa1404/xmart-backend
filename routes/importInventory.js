const express = require("express");
const router = express.Router();
const ImportInventory = require("../models/ImportInventory");
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const { number, func } = require("joi");

//get all import inventory
router.get("/importInventory", async (req, res) => {
  try {
    const importInventory = await ImportInventory.find().populate('imports.product').sort({ createdAt: -1 }).populate('locator');
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
    console.log("req.body", req.body)
    const locator = req.body.locator
    const importInventory = new ImportInventory({
      name: req.body.name,
      locator: locator,
      imports: req.body.imports
    });
    const newImportInventory = await importInventory.save();
    if (newImportInventory && newImportInventory.imports) {

      let imports = newImportInventory.imports
      let listProducts = await Product.find()
      // for (let item of imports) {
      //   let productID = item.product._id
      //   let quantity = item.quantity
      //   let product = await Product.findOne({ _id: productID });
      //   if (product) {
      //     let inventories = product.inventory
          
      //     if (inventories.length === 0) {
      //       product = {
      //         ...product,
      //         inventory: [
      //           {
      //             locator: locator,
      //             quantity: quantity
      //           }
      //         ]
      //       }
      //     } else {
      //       let isExist = false
      //       for (let i = 0; i < inventories.length; i++) {
      //        if(inventories[i].locator == locator) {
      //         isExist = i
      //         // product = {
      //         //   ...product,
      //         //   inventory: [
      //         //     {
      //         //       locator: locator,
      //         //       quantity: quantity + inven.quantity
      //         //     }
      //         //   ]
      //         // }
      //        }
      //       }

      //     }
      //   }
      //   product = {
      //     ...product,

      //   }
      // }
      for (let item of imports) {
        let productID = item.product
        let quantity = item.quantity
        let product = listProducts.find(p => {
          console.log("product._id", p._id, productID, p._id.toString() == productID.toString());
          return p._id.toString() == productID.toString()
        })
        console.log("product 1111", product)
        if (product) {
          let inventories = product.inventory
          if (inventories.length === 0) {
            product.inventory = [
              {
                locator: importInventory.locator,
                imports: [ 
                  {
                    sku: item.sku,
                    date_manufacture: item.date_manufacture,
                    date_expiration: item.date_expiration,
                    quantity: quantity
                  }
                ]
              }
            ]

          } else {
            let isExist = false
            for (let i = 0; i < inventories.length; i++) {
              if (inventories[i].locator.toString() == importInventory.locator.toString()) {
                isExist = true
                product.inventory[i] =
                {
                  locator: importInventory.locator,
                  imports: [...product.inventory[i].imports, 
                  {
                    sku: item.sku,
                    date_manufacture: item.date_manufacture,
                    date_expiration: item.date_expiration,
                    quantity: quantity
                  }]
                }
                break;
              }
            }
            if (!isExist) {
              product.inventory.push({
                locator: importInventory.locator,
                imports: [ 
                  {
                    sku: item.sku,
                    date_manufacture: item.date_manufacture,
                    date_expiration: item.date_expiration,
                    quantity: quantity
                  }]
              }
              )

            }
          }
          console.log("product", product)
          console.log("product.imports", product.inventory.imports)
          await Product.findByIdAndUpdate(productID.toString(), product)
        }
      }
    }
    res.status(201).json(newImportInventory);
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
