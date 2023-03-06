const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { number, func } = require('joi');
//Getting All (For Admin)
router.get("/order", async (req, res) => {
  try {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    const order = await Order.find()
      .sort({ createAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .populate("user", "name email")
      .populate("cart")
      .populate({
        path: "cart",
        populate: {
          path: "products",
          populate: {
            path: "product",
          },
        },
      });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Add order

router.post("/add", async (req, res) => {
  try {
    const cart = req.body.cartId;
    const total = req.body.total;
    const user = req.user._id;

    const order = new Order({
      cart,
      user,
      total,
    });

    const orderDoc = await order.save();

    const cartDoc = await Cart.findById(orderDoc.cart._id).populate({
      path: "products.product",
      populate: {
        path: "brand",
      },
    });

    const newOrder = {
      _id: orderDoc._id,
      created: orderDoc.created,
      user: orderDoc.user,
      total: orderDoc.total,
      products: cartDoc.products,
    };

    res.status(200).json({
      success: true,
      message: `Your order has been placed successfully!`,
      order: { _id: orderDoc._id },
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});


//Update status one
router.patch('/order/:id/status/:status', getOrderById, async (req, res) => {
    if (req.order.status != null) {
        req.order.status = req.params.status;
    }
    try {
        const updateOrder = await req.order.save();
        res.json(updateOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.patch("/order-ship/:id", getOrderById, async (req, res) => {
  if (req.body.locator != null) {
    req.order.locator = req.body.locator;
    req.order.status = "Shipped";
  }
  try {
    const updateOrder = await req.order.save();
    res.json(updateOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Update status one
router.patch('/order/:id/add', getOrderById, async (req, res) => {
    let order = req.order;
    let orderList = req.order.order;
    orderList.push(req.body.order);

    try {
        const updateOrder = await req.order.save();
        res.json(updateOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Calculate one
router.get('/order/:id/calculate', getOrderById, async (req, res) => {
    try {
        let order = req.order.order;
        let totalPrice = await caculateTotalPrice(order);
        req.order.totalPrice = totalPrice;
        res.json(req.order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//Getting one
router.get("/order/:id", getOrderById, async (req, res) => {
  try {
    let r = [req.order];
    res.json(r);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//Deleting one (For Admin)
router.delete("/order/:id", getOrderById, async (req, res) => {
  try {
    await req.order.remove();
    res.json({ message: `Deleted Order` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getOrderById(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("cart")
      .populate({
        path: "cart",
        populate: {
          path: "products",
          populate: {
            path: "product",
          },
        },
      });
      if (order == null) {
        return res.status(404).json({ message: "Can not find order" });
      }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.order = order;
  next();
}

async function caculateTotalPrice(order) {
    let totalPrice = 0;
    try {
        for (let i = 0; i < order.length; i++) {
            let product = order[i];
            totalPrice += product.product.price * product.amount;
        }
        return totalPrice;
    } catch (error) {
        return 0;
    }
}

module.exports = router;
