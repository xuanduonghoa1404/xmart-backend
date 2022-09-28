const express = require("express");
const Marketing = require("../models/Marketing");
const router = express.Router();
const Product = require("../models/Product");
const Type = require("../models/Type");
// Customers
//Getting All
router.get("/products", async (req, res) => {
    try {
        let typeId = String(req.query.typeId);
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        // const product = await Product.find({ type: typeId })
        //   .sort({ createdAt: -1 })
        //   .populate("type", "name");
        let product = [];
        if (typeId === "undefined") {
            product = await Product.find()
                .sort({ createdAt: -1 })
                .populate("type", "name").limit(limit).skip(limit * page);;
        } else {
            product = await Product.find({ type: typeId })
                .sort({ createdAt: -1 })
                .populate("type", "name").limit(limit).skip(limit * page);;
        }
        const marketings = await Marketing.find({ status: true }).sort({ createdAt: -1 });
        let products = [];
        // if (marketings.length > 0) {
        //     for (let item of product) {
        //         let priceAfterDiscount = item.price;
        //         for (let marketing of marketings) {
        //             if (marketing.apply === 'ALL') {
        //                 if (marketing.discount_type === "PERCENT") {
        //                     priceAfterDiscount = item.price - item.price * marketing.value / 100;
        //                 } else if (marketing.discount_type === "FIX_AMOUNT") {
        //                     priceAfterDiscount = item.price - marketing.value;
        //                 } else if (marketing.discount_type === "FLAT") {
        //                     if (item.price > marketing.value) {
        //                         priceAfterDiscount = marketing.value;
        //                     }
        //                 }

        //                 item._doc.priceAfterDiscount = priceAfterDiscount;
        //                 products.push(item);
        //                 break;
        //             } else if (marketing.apply === 'TYPE') {
        //                 // check condition if
        //                 if (marketing.apply_type.toString().indexOf(item.type._id.toString())) {
        //                     if (marketing.discount_type === "PERCENT") {
        //                         priceAfterDiscount = item.price - item.price * marketing.value / 100;
        //                     } else if (marketing.discount_type === "FIX_AMOUNT") {
        //                         priceAfterDiscount = item.price - marketing.value;
        //                     } else if (marketing.discount_type === "FLAT") {
        //                         if (item.price > marketing.value) {
        //                             priceAfterDiscount = marketing.value;
        //                         }
        //                     }
        //                 }

        //                 item._doc.priceAfterDiscount = priceAfterDiscount;
        //                 products.push(item);
        //                 break;
        //             } else if (marketing.apply === 'PRODUCT') {
        //                 if (marketing.apply_product.toString().indexOf(item._id.toString())) {
        //                     if (marketing.discount_type === "PERCENT") {
        //                         priceAfterDiscount = item.price - item.price * marketing.value / 100;
        //                     } else if (marketing.discount_type === "FIX_AMOUNT") {
        //                         priceAfterDiscount = item.price - marketing.value;
        //                     } else if (marketing.discount_type === "FLAT") {
        //                         if (item.price > marketing.value) {
        //                             priceAfterDiscount = marketing.value;
        //                         }
        //                     }
        //                 }
        //             }

        //             item._doc.priceAfterDiscount = priceAfterDiscount;
        //             products.push(item);
        //             break;
        //         }
        //         if (priceAfterDiscount = item.price) {
        //             // item._doc.priceAfterDiscount = item.price;
        //             products.push(item);
        //         }
        //     };
        // }
        for (let item of product) {
            products.push(getProductAfterDiscount(item, marketings));
        }
        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Find by string
router.get("/product/find/name/:string", async (req, res) => {
    try {
        const order = await Order.find({
            $or: [
                { name: req.params.string },
                { description: req.params.string },
                { type: req.params.string },
            ],
        }).sort({ createdAt: -1 });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


//Getting one
router.get("/product/:id", getProductById, async (req, res) => {
    console.log(req.product)
    res.send(req.product);
});

// function return product after discount in marketing
function getProductAfterDiscount(item, marketings) {
    if (marketings.length > 0) {
        let priceAfterDiscount = item.price;
        for (let marketing of marketings) {
            if (marketing.apply === 'ALL') {
                if (marketing.discount_type === "PERCENT") {
                    priceAfterDiscount = item.price - item.price * marketing.value / 100;
                } else if (marketing.discount_type === "FIX_AMOUNT") {
                    priceAfterDiscount = item.price - marketing.value;
                } else if (marketing.discount_type === "FLAT") {
                    if (item.price > marketing.value) {
                        priceAfterDiscount = marketing.value;
                    }
                }
                item._doc.priceAfterDiscount = priceAfterDiscount;
                return item;
                // item._doc.priceAfterDiscount = priceAfterDiscount;
                // products.push(item);
                // break;
            } else if (marketing.apply === 'TYPE') {
                // check condition if
                if (marketing.apply_type.toString().indexOf(item.type._id.toString())) {
                    if (marketing.discount_type === "PERCENT") {
                        priceAfterDiscount = item.price - item.price * marketing.value / 100;
                    } else if (marketing.discount_type === "FIX_AMOUNT") {
                        priceAfterDiscount = item.price - marketing.value;
                    } else if (marketing.discount_type === "FLAT") {
                        if (item.price > marketing.value) {
                            priceAfterDiscount = marketing.value;
                        }
                    }
                    item._doc.priceAfterDiscount = priceAfterDiscount;
                    return item;
                }


            } else if (marketing.apply === 'PRODUCT') {
                if (marketing.apply_product.toString().indexOf(item._id.toString())) {
                    if (marketing.discount_type === "PERCENT") {
                        priceAfterDiscount = item.price - item.price * marketing.value / 100;
                    } else if (marketing.discount_type === "FIX_AMOUNT") {
                        priceAfterDiscount = item.price - marketing.value;
                    } else if (marketing.discount_type === "FLAT") {
                        if (item.price > marketing.value) {
                            priceAfterDiscount = marketing.value;
                        }
                    }
                    item._doc.priceAfterDiscount = priceAfterDiscount;
                    return item;
                }
            }
        }
    }
    return item;
}


async function getProductById(req, res, next) {
    let product;
    try {
        product = await (await Product.findById(req.params.id)).populate('type', 'name');
        if (product == null) {
            return res.status(404).json({ message: "Can not find product" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    try {
        type = await (await Type.findById(product.type)).populate('type', 'name');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    product.type = type;
    req.product = product;

    next();
}

module.exports = router;
