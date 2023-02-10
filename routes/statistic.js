const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Table = require('../models/Table');
const Product = require('../models/Product');
const moment = require('moment');

//Getting All (For Admin)
router.get('/statistic', async (req, res) => {
    try {
        let begin = moment(Number.parseInt(req.query.begin));
        let end = moment(Number.parseInt(req.query.end));
        console.log(begin, end);
        const order = await Order.find({
            updatedAt: {
                $gte: begin.get('time'),
                $lte: end.get('time'),
            },
            // status: 'paid',
        })
            .sort({ createAt: -1 })
            // .populate('order.product')
            .populate('user', 'name email')
            .populate('cart')
            .populate({
                path: 'cart',
                populate: {
                    path: 'products',
                    populate: {
                        path: 'product'
                    },
                },
            })
        // .populate('user', 'name')
        // .populate('table', 'name');
        console.log("order", order);
        let resData = order.map((item, index) => {
            return { totalPrice: item.total, time: item.updatedAt };
        });
        res.json(resData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/statistic/order', async (req, res) => {
    try {
        const order = await Order.find({
            // status: 'paid',
        })
            .sort({ createAt: -1 })
            // .populate('order.product')
            .populate('user', 'name email')
            .populate('cart')
            .populate({
                path: 'cart',
                populate: {
                    path: 'products',
                    populate: {
                        path: 'product'
                    },
                },
            })

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/statistic/product', async (req, res) => {
    try {
        const product = await Product.find();
        let resData = product.map((item, index) => {
            // let book = item.book.map((item, index) => item.amount);
            return {
                name: item.name,
                // total: book.reduce((total, num) => total + num, 0),
                total: item.price,
            };
        });
        res.json(resData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/statistic-number-order', async (req, res) => {
    try {
        let beginParam = req.query.begin;
        let endParam = req.query.end;
        let begin = beginParam
          ? new Date(Number.parseInt(beginParam))
          : new Date("2022-12-01T00:08:17.731Z");
        let end = endParam ? new Date(Number.parseInt(endParam)) : new Date();
      //   let begin = moment(Number.parseInt(req.query.begin));
      //   let end = moment(Number.parseInt(req.query.end));
      // let endDate = new Date("2023-10-04T00:08:17.731Z");
      // let startDate = new Date("2022-09-25T00:08:56.161");
      let endDate = end;
      let startDate = begin;
      console.log("startDate", startDate);
      console.log("endDate", endDate);
      const product = await Order.aggregate([
        { $match: { created: { $gte: startDate, $lt: endDate } } },
        {
          $group: {
            _id: {
              $add: [
                { $dayOfYear: "$created" },
                {
                  $multiply: [400, { $year: "$created" }],
                },
              ],
            },
            total: { $sum: 1 },
            sub: { $sum: "$total" },
            first: { $min: "$created" },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 15 },
        { $project: { date: "$first", total: 1, _id: 0, sub: "$sub" } },
      ]);
      //
      // .aggregate([
      //     { $group: { _id: { $dayOfYear: "$createdAt"},
      //     total: { $sum: 1 } } }
      // ])
      //
      // .aggregate([
      //     { "$match": {
      //         $gte: new Date("2022-05-21"), $lte: new Date()
      //     }},
      //     { "$group": {
      //         "_id": { "$dayOfYear": "$createdAt" },
      //         "total": { "$sum": "$total" }
      //     }}
      // ])
      // let resData = product.map((item, index) => {
      //     // let book = item.book.map((item, index) => item.amount);
      //     return {
      //         name: item.name,
      //         // total: book.reduce((total, num) => total + num, 0),
      //         total: item.price,
      //     };
      // });
      res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// router.get('/statistic-order-total', async (req, res) => {
//     try {
//         let endDate = new Date("2022-10-04T00:08:17.731Z");
//         let startDate = new Date("2022-09-25T00:08:56.161");
//         const order = await Order
//             .aggregate([
//                 { $match: { "createdAt": { $gte: startDate, $lte: endDate } } },
//                 {
//                     $addFields: {
//                         createdAt: {
//                             $dateFromParts: {
//                                 year: {
//                                     $year: "$createdAt"
//                                 }, month: {
//                                     $month: "$createdAt"
//                                 }, day: {
//                                     $dayOfMonth: "$createdAt"
//                                 }
//                             }
//                         },
//                         dateRange: { $map: { input: { $range: [0, { $subtract: [endDate, startDate] }, 1000 * 60 * 60 * 24] }, in: { $add: [startDate, "$$this"] } } }
//                     }
//                 },
//                 { $unwind: "$dateRange" },
//                 {
//                     $group: {
//                         _id: {
//                             date: "$dateRange",
//                         },
//                         count: { $sum: { $cond: [{ $eq: ["$dateRange", "$createdAt"] }, 1, 0] } },
//                         subtotal: { $sum: { $cond: [{ $eq: ["$dateRange", "$createdAt"] }, "$total", 0] } },
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: "$_id.date",
//                         totalPrice: { $sum: "$count" },
//                         subtotal: { $sum: "$subtotal" },
//                     }
//                 },
//                 { $sort: { _id: 1 } },
//                 {
//                     $project: {
//                         _id: 0,
//                         date: "$_id",
//                         totalPrice: "$totalPrice",
//                         subtotal: "$subtotal",
//                     }
//                 }
//                 // { $addFields: { createdAt: { $dateFromParts: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } } }, dateRange: { $map: { input: { $range: [0, { $subtract: [endDate, startDate] }, 1000 * 60 * 60 * 24] }, in: { $add: [startDate, "$$this"] } } } } },
//                 // { $unwind: "$dateRange" },
//                 // {
//                 //     "$facet": {
//                 //     //   "total": [
//                 //     //     {
//                 //     //       "$group": {
//                 //     //         "_id": null,
//                 //     //         "total": {
//                 //     //           "$sum": "$cost"
//                 //     //         }
//                 //     //       }
//                 //     //     }
//                 //     //   ],
//                 //       "coll": [
//                 //         {
//                 //           "$group": {
//                 //             "_id": "$dateRange",
//                 //             "cost": {
//                 //               "$sum": "$total"
//                 //             }
//                 //           }
//                 //         }
//                 //       ]
//                 //     }
//                 //   },
//                 //   {
//                 //     "$unwind": {
//                 //       "path": "$coll"
//                 //     }
//                 //   },
//                 //   {
//                 //     "$project": {
//                 //     //   "total": {
//                 //     //     "$let": {
//                 //     //       "vars": {
//                 //     //         "t": {
//                 //     //           "$arrayElemAt": [
//                 //     //             "$total",
//                 //     //             0
//                 //     //           ]
//                 //     //         }
//                 //     //       },
//                 //     //       "in": "$$t.total"
//                 //     //     }
//                 //     //   },
//                 //       "date": "$coll._id",
//                 //       "cost": "$coll.cost"
//                 //     }
//                 //   }
//             ])

//         res.json(order);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });
router.get('/statistic-order-total', async (req, res) => {
    try {
        // dates that we care
        let endDate = new Date("2022-10-04T00:08:17.731Z");
        let startDate = new Date("2022-09-25T00:08:56.161Z");

        // generate boundaries
        let boundaries = [startDate]
        while (boundaries.slice(-1)[0] <= endDate) {
            boundaries.push(
                new Date(new Date(boundaries.slice(-1)[0]).getTime() + (1000 * 60 * 60 * 24))
            )
        }

        // create aggregation query
        p = [
            { $match: { "createdAt": { $gte: startDate, $lte: endDate } } },
            {
                $bucket: {
                    boundaries: boundaries,
                    groupBy: "$createdAt",
                    default: "other",
                    output: {
                        subtotal: { $sum: 1 },
                        totalPrice: { $sum: "$total" },
                    }
                }
            },
            // {
            //     $densify: {
            //         field: "_id",
            //         range: {
            //             step: 1,
            //             unit: "day",
            //             bounds: [startDate, endDate],
            //         }
            //     }
            // },
            {
                $project: {
                    totalPrice: { $ifNull: ["$totalPrice", 0] },
                    subtotal: { $ifNull: ["$subtotal", 0] },
                    date: { $dateToString: { date: "$_id" } },
                    _id: 0,
                }
            },
        ]
        let order = await Order
            .aggregate(p)
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
