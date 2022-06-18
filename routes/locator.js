const express = require('express');
const router = express.Router();
const Locator = require('../models/Locator');
//Getting All
router.get('/locator', async (req, res) => {
    try {
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        const locator = await Locator.find()
            .sort({ createAt: -1 })
            .limit(limit)
            .skip(limit * page);
        res.json(locator);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Save one
router.post('/locator', async (req, res) => {
    const locator = new Locator({
        name: req.body.name,
        address: req.body.address,
        storeID: req.body.storeID,
        status: req.body.status,
    });
    try {
        const newLocator = await locator.save();
        res.status(201).json(newLocator);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
//Update one
router.patch('/locator/:id', getLocatorById, async (req, res) => {
    if (req.body.name != null) {
        req.locator.name = req.body.name;
    }

    if (req.body.address != null) {
        req.locator.address = req.body.address;
    }

    try {
        const updateLocator = await req.locator.save();
        res.json(updateLocator);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// //Update in-active one
// router.patch('/locator/active/:id', getLocatorById, async (req, res) => {

//     // if (req.body.status != null) {
//     //     if (req.body.status == true) {
//     //         req.locator.status = false;
//     //     } else {
//     //         req.locator.status = true;
//     //     }
//     // }
//     let id = req.body._id;
//     try {
//         const updateLocator = await req.locator.updateOne(
//             { _id: id },
//             {
//                 $set: {
//                     status: true
//                 }
//             });
//         res.json(updateLocator);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });
//Update status one
router.patch('/locator/status/:status/:id', getLocatorById, async (req, res) => {
    if (req.locator.status != null) {
        req.locator.status = req.params.status;
    }
    try {
        const updateLocator = await req.locator.save();
        res.json(updateLocator);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Book locator
// router.patch('/locator/book/:id', getLocatorById, async (req, res) => {
//     if (req.locator.status != null) {
//         switch (req.locator.status) {
//             case 'booked':
//                 if (req.locator.user == req.body.user) {
//                     return res
//                         .status(200)
//                         .json({ message: 'You booked this locator' });
//                 } else {
//                     let lengthBook = req.locator.book.length;
//                     let time = req.locator.book[lengthBook - 1].time;
//                     return res
//                         .status(200)
//                         .json({ message: 'Locator was booked', time: time });
//                 }
//             case 'busy':
//                 if (req.locator.user == req.body.user) {
//                     return res
//                         .status(200)
//                         .json({ message: 'You booked this locator' });
//                 } else
//                     return res.status(200).json({ message: 'Locator is busy' });
//             case 'deactive':
//                 return res
//                     .status(200)
//                     .json({ message: 'This locator is not active' });
//         }
//     }
//     if (req.body.user != null) {
//         req.locator.user = req.body.user;
//         let book = {
//             user: req.body.user,
//             time: req.body.time,
//         };
//         req.locator.book.push(book);
//         req.locator.status = 'booked';
//     }
//     try {
//         const updateLocator = await req.locator.save();
//         res.json(updateLocator);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

//Getting one
router.get('/locator/:id', getLocatorById, async (req, res) => {
    res.send(req.locator);
});

//Deleting one
router.delete('/locator/:id', getLocatorById, async (req, res) => {
    try {
        await req.locator.remove();
        res.json({ message: `Deleted Locator` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getLocatorById(req, res, next) {
    let locator;
    try {
        locator = await Locator.findById(req.params.id);
        if (locator == null) {
            return res.status(404).json({ message: 'Can not find locator' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    req.locator = locator;
    next();
}

module.exports = router;
