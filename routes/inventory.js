const express = require('express');

const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Type = require("../models/Type");
const Shop = require("../models/Shop");
const Cart = require("../models/Cart");
const moment = require("moment");
//Getting All
router.get("/inventory", async (req, res) => {
  try {
    const inventory = await Product.find()
      .sort({ createdAt: -1 })
      .populate("type", "name");
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/inventory-date-expiration", async (req, res) => {
  try {
    const type = await Type.find();
    let shop = await Shop.find();
    const ONE_DAY = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    shop = shop[0];
    let conditionOrElement = {
      $or: [],
    };
    let mapType = new Map();
    type.forEach((element) => {
      let conditionAndElement = { $and: [] };
      let numberOfDate = 0;
      let check = false;
      shop.warningType.forEach((item) => {
        if (element._id.toString() === item.type.toString()) {
          numberOfDate = item.numberOfDate;
          check = true;
        }
      });
      if (!check) {
        numberOfDate = 10;
      }
      mapType.set(element._id.toString(), numberOfDate);

      conditionAndElement.$and.push({ type: element._id });
      let conditionDate = {
        "inventory.imports.date_expiration": {
          $gt: new Date(),
          $lt: new Date(Date.now() + numberOfDate * ONE_DAY),
        },
      };
      conditionAndElement.$and.push(conditionDate);
      conditionOrElement.$or.push(conditionAndElement);
    });

    let inventories = await Product.find(conditionOrElement)
      .sort({ createdAt: -1 })
      .populate("type", "name");
    inventories.forEach((inventory) => {
      let inventoryArray = inventory.inventory;
      let newInventory = [];
      inventoryArray.forEach((inventoryEle) => {
        let imports = inventoryEle.imports;
        let newImports = [];
        imports.forEach((importEle) => {
          let numberOfDateType = mapType.get(inventory.type._id.toString());
          let condition =
            importEle.date_expiration > new Date() &&
            importEle.date_expiration <
              new Date(Date.now() + numberOfDateType * ONE_DAY);
          if (condition) {
            newImports.push(importEle);
          }
        });
        if (newImports.length) {
          inventoryEle.imports = newImports;
          newInventory.push(inventoryEle);
        }
      });
      inventory.inventory = newInventory;
    });
    res.json(inventories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/inventory-quantity", async (req, res) => {
  try {
    const type = await Type.find();
    let shop = await Shop.find();
    shop = shop[0];
    let conditionOrElement = {
      $or: [],
    };
    let mapType = new Map();
    type.forEach((element) => {
      let conditionAndElement = { $and: [] };
      let quantity = 0;
      let check = false;
      shop.warningType.forEach((item) => {
        if (element._id.toString() === item.type.toString()) {
          quantity = item.quantity;
          check = true;
        }
      });
      if (!check) {
        quantity = 200;
      }
      mapType.set(element._id.toString(), quantity);

      conditionAndElement.$and.push({ type: element._id });
      let conditionQuantity = {
        "inventory.imports.quantity": {
          $lt: quantity,
        },
      };
      conditionAndElement.$and.push(conditionQuantity);
      conditionOrElement.$or.push(conditionAndElement);
    });

    let inventories = await Product.find(conditionOrElement)
      .sort({ createdAt: -1 })
      .populate("type", "name");
    inventories.forEach((inventory) => {
      let inventoryArray = inventory.inventory;
      let newInventory = [];
      inventoryArray.forEach((inventoryEle) => {
        let imports = inventoryEle.imports;
        let newImports = [];
        imports.forEach((importEle) => {
          let quantity = mapType.get(inventory.type._id.toString());
          let condition = importEle.quantity < quantity;
          if (condition) {
            newImports.push(importEle);
          }
        });
        if (newImports.length) {
          inventoryEle.imports = newImports;
          newInventory.push(inventoryEle);
        }
      });
      inventory.inventory = newInventory;
    });
    res.json(inventories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/inventory-quantity-check", async (req, res) => {
  try {
    const typeId = String(req.query.typeId);
    const condition = Number(req.query.condition);

    // const type = await Type.find();
    const product = await Product.find({ type: typeId });
    console.log("product", product);
    let products = [];
    for (let item of product) {
      let newProduct = getProductWithInventory(item);
      console.log(newProduct.name, newProduct.quantity);
      if (0 < newProduct.quantity && newProduct.quantity < condition) {
        products.push(newProduct);
      }
    }

    // let shop = await Shop.find();
    // shop = shop[0];
    // let conditionOrElement = {
    //   $or: [],
    // };
    // let mapType = new Map();
    // type.forEach((element) => {
    //   let conditionAndElement = { $and: [] };
    //   let quantity = condition || 200;
    //     let check = false;

    //   shop.warningType.forEach((item) => {
    //     if (element._id.toString() === item.type.toString()) {
    //       quantity = item.quantity;
    //       check = true;
    //     }
    //   });
    //   if (!check) {
    //     quantity = 200;
    //   }
    //   mapType.set(element._id.toString(), quantity);

    //   conditionAndElement.$and.push({ type: element._id });
    //   let conditionQuantity = {
    //     "inventory.imports.quantity": {
    //       $lt: quantity,
    //     },
    //   };
    //   conditionAndElement.$and.push(conditionQuantity);
    //   conditionOrElement.$or.push(conditionAndElement);
    // });

    // let inventories = await Product.find(conditionOrElement)
    //   .sort({ createdAt: -1 })
    //   .populate("type", "name");
    // inventories.forEach((inventory) => {
    //   let inventoryArray = inventory.inventory;
    //   let newInventory = [];
    //   inventoryArray.forEach((inventoryEle) => {
    //     let imports = inventoryEle.imports;
    //     let newImports = [];
    //     imports.forEach((importEle) => {
    //       let quantity = mapType.get(inventory.type._id.toString());
    //       let condition = importEle.quantity < quantity;
    //       if (condition) {
    //         newImports.push(importEle);
    //       }
    //     });
    //     if (newImports.length) {
    //       inventoryEle.imports = newImports;
    //       newInventory.push(inventoryEle);
    //     }
    //   });
    //   inventory.inventory = newInventory;
    // });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/inventory-date-check", async (req, res) => {
  try {
    const typeId = String(req.query.typeId);
    const dateRemain = new Date(Number.parseInt(req.query.dateRemain));

    const product = await Product.find({ type: typeId });
    console.log(
      "cart",
      // await checkAvailableInventoryLocatorWithCart(
      //   "62933b3fe744ac34445c4fc0",
      //   "6365be2799e837385c7f463c"
      // ) // true
      await checkAvailableInventoryLocatorWithCart(
        "62933b3fe744ac34445c4fc0",
        "6365d3639be4c928709c6090"
      ) // true
    );
    let products = [];
    for (let item of product) {
      let newProduct = getProductWithDateRemain(item, dateRemain);
      products.push(newProduct);
    }
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/inventoryInput", async (req, res) => {
  try {
    const inventory = await Inventory.find({ amountInput: { $ne: 0 } });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/inventoryOutput", async (req, res) => {
  try {
    const inventory = await Inventory.find({ amountOutput: { $ne: 0 } });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Save one
// router.post('/importInventory', async (req, res) => {
//     const inventory = new Inventory(
//         {
//             name: req.body.name,
//             name_type: req.body.name_type,
//             description: req.body.description,
//             amountInput: req.body.amountInput,
//             unit: req.body.unit,
//             priceperunit: req.body.priceperunit
//         }
//     );
//     try {
//         const newInventory = await inventory.save();
//         res.status(201).json(newInventory);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// router.post('/exportInventory', async (req, res) => {
//     const inventory = new Inventory(
//         {
//             name: req.body.name,
//             name_type: req.body.name_type,
//             description: req.body.description,
//             amountOutput: req.body.amountOutput,
//             unit: req.body.unit,
//             priceperunit: req.body.priceperunit
//         }
//     );
//     try {
//         const newInventory = await inventory.save();
//         res.status(201).json(newInventory);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

//update one
router.patch(
  "/updateImportInventory/:id",
  getInventoryById,
  async (req, res) => {
    if (req.body.name != null) {
      req.inventory.name = req.body.name;
    }

    if (req.body.description != null) {
      req.inventory.description = req.body.description;
    }
    if (req.body.amountInput != null) {
      req.inventory.amountInput = req.body.amountInput;
    }
    if (req.body.unit != null) {
      req.inventory.unit = req.body.unit;
    }
    if (req.body.name_type != null) {
      req.inventory.name_type = req.body.name_type;
    }
    if (req.body.priceperunit != null) {
      req.inventory.priceperunit = req.body.priceperunit;
    }
    if (req.body.amountOutput != null) {
      req.inventory.amountOutput = req.body.amountOutput;
    }

    try {
      const updateInventory = await req.inventory.save();
      res.json(updateInventory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

//Deleting one
router.delete("/inventory/:id", getInventoryById, async (req, res) => {
  try {
    await req.inventory.remove();
    res.json({ message: `Deleted Inventory` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function getProductWithInventory(item) {
  let quantity = 0;
  if (!item.inventory.length) {
    quantity = 0;
  } else {
    item?.inventory?.forEach((i) => {
      i?.imports?.forEach((j) => {
        quantity += j.quantity;
      });
    });
  }
  return {
    ...item._doc,
    quantity: quantity,
  };
}

function getProductInventoryWithLocator(item, locatorId) {
  let quantity = 0;
  if (!item.inventory.length) {
    quantity = 0;
  } else {
    item?.inventory?.forEach((i) => {
      if (i.locator == locatorId) {
        i.imports?.forEach((j) => {
          quantity += j.quantity;
        });
      }
    });
  }
  return {
    ...item._doc,
    quantity: quantity,
  };
}

function getProductWithDateRemain(item, date) {
  let remain = [];
  date = new Date(new Date(date).setHours(0, 0, 0));
  if (item.inventory.length) {
    item?.inventory?.forEach((i) => {
      i?.imports?.forEach((j) => {
        if (j.quantity > 0) {
          let date_expiration = new Date(
            new Date(j.date_expiration).setHours(0, 0, 0)
          );
          let dateRemain = Number.parseInt(
            (date_expiration.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
          );
          remain.push({
            date: j.date_expiration,
            dateRemain: dateRemain,
            quantity: j.quantity,
          });
        }
      });
    });
  }

  return {
    ...item._doc,
    remain: remain,
  };
}

async function checkAvailableInventoryLocatorWithCart(locatorId, cartId) {
  let checkAvailable = true;
  let cart = await Cart.findById(cartId).populate({
    path: "products.product",
  });
  for (let cartItem of cart.products) {
    let product = cartItem.product;
    let quantity = cartItem.quantity;
    let quantityInventory = getProductInventoryWithLocator(
      product,
      locatorId
    ).quantity;
    if (quantity > quantityInventory) {
      checkAvailable = false;
      return false;
    }
  }
  return checkAvailable;
}

async function getInventoryById(req, res, next) {
    let inventory;
    try {
        inventory = await Inventory.findById(req.params.id);
        if (inventory == null) {
            return res.status(404).json({ message: 'Can not find inventory' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
    req.inventory = inventory;
    next();
}

module.exports = router;

