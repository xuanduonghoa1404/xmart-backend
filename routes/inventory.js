const express = require('express');

const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const moment = require('moment');
//Getting All
router.get('/inventory', async (req, res) => {
    try {
        const inventory = await Product.find().sort({ createdAt: -1 })
        .populate("type", "name")
        res.json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/inventory-date-expiration', async (req, res) => {
    try {
        let inventories = await Product.find({
            'inventory.imports.date_expiration': {
                $gt: new Date(),
                $lt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            }
        }).sort({ createdAt: -1 })
        .populate("type", "name")
        inventories.forEach((inventory) => {
            let inventoryArray = inventory.inventory;
            let newInventory = [];
            inventoryArray.forEach(inventoryEle => {
                let imports = inventoryEle.imports;
                let newImports = [];
                imports.forEach((importEle) => {
                    let condition = importEle.date_expiration > new Date() && importEle.date_expiration < new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                    if (condition) {
                       newImports.push(importEle);
                    }
                })
                if (newImports.length) {
                    inventoryEle.imports = newImports;
                    newInventory.push(inventoryEle);
                }
                
            }
            )
            inventory.inventory = newInventory;
        }
        );
        // .where('imports').elemMatch({
        //     date_expiration: { $gte: new Date() },
        //     date_expiration: { $lte: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
        // })
        // get products with remain 5 days from today to date expiration in imports array 
        // inventories.forEach(element => {
        //     element.dateExpiration = element.dateExpiration.toISOString().split('T')[0];
        // }
        // );
        res.json(inventories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/inventoryInput', async (req, res) => {
    try {
        const inventory = await Inventory.find({ amountInput: { $ne: 0 } });
        res.json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/inventoryOutput', async (req, res) => {
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
router.patch('/updateImportInventory/:id', getInventoryById, async (req, res) => {
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
});

//Deleting one
router.delete('/inventory/:id', getInventoryById, async (req, res) => {
    try {
        await req.inventory.remove();
        res.json({ message: `Deleted Inventory` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

