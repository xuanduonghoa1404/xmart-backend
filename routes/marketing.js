const express = require("express");
const router = express.Router();
const Marketing = require("../models/Marketing");
//Getting All
router.get("/marketing", async (req, res) => {
  try {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    const marketing = await Marketing.find()
      // .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page);
    let newMarketing = [];
    marketing.forEach(function (mkt) {
      if (mkt.discount_type === "PERCENT") {
        mkt._doc.discount = "-" + mkt.value + "%";
      } else if (mkt.discount_type === "FIX_AMOUNT") {
        mkt._doc.discount = "-" + mkt.value + "đ";
      } else if (mkt.discount_type === "FLAT") {
        mkt._doc.discount = "" + mkt.value + "đ";
      }
      if (mkt.condition === "QTY") {
        mkt._doc.condition_text = "Còn " + mkt.condition_value + " sản phẩm";
      } else if (mkt.condition === "DATE") {
        mkt._doc.condition_text = "Còn " + mkt.condition_value + " ngày";
      } else if (mkt.condition === "ALL") {
        mkt._doc.condition_text = "Không";
      }
      let dateFrom = mkt.dateFrom;
      let dateTo = mkt.dateTo;
      if (dateFrom) {
        dateFrom.setTime(dateFrom.getTime() - 7 * 60 * 60 * 1000);
      }
      if (dateTo) {
        dateTo.setTime(dateTo.getTime() - 7 * 60 * 60 * 1000);
      }

      mkt._doc.dateFrom = dateFrom;
      mkt._doc.dateTo = dateTo;
      // mkt._doc.toDate = new Date(mkt.dateTo).toLocaleDateString();
      // mkt._doc.toTime = new Date(mkt.dateTo).toLocaleTimeString();
      newMarketing.push(mkt);
    });
    res.json(newMarketing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Save one
router.post("/marketing", async (req, res) => {
  let dateFrom = new Date(req.body.dateFrom) || new Date();
  let dateTo = new Date(req.body.dateTo) || null;
  console.log("dateFrom", dateFrom);
  console.log("dateTo", dateTo);
  const marketing = new Marketing({
    name: req.body.name,
    description: req.body.description,
    apply: req.body.apply,
    apply_type: req.body.apply_type,
    apply_product: req.body.apply_product,
    discount_type: req.body.discount_type,
    value: req.body.value,
    status: req.body.status,
    condition: req.body.condition,
    condition_value: req.body.condition_value,
    isFlashSale: req.body.isFlashSale,
    dateFrom: dateFrom,
    dateTo: dateTo,
  });
  try {
    const newMarketing = await marketing.save();
    res.status(201).json(newMarketing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Update one
router.patch("/marketing/:id", getMarketingById, async (req, res) => {
  if (req.body.name != null) {
    req.marketing.name = req.body.name;
  }
  if (req.body.description != null) {
    req.marketing.description = req.body.description;
  }

  if (req.body.apply != null) {
    req.marketing.apply = req.body.apply;
  }
  if (req.body.apply_product != null) {
    req.marketing.apply_product = req.body.apply_product;
  }
  if (req.body.apply_type != null) {
    req.marketing.apply_type = req.body.apply_type;
  }
  if (req.body.discount_type != null) {
    req.marketing.discount_type = req.body.discount_type;
  }
  if (req.body.value != null) {
    req.marketing.value = req.body.value;
  }
  if (req.marketing.status != null) {
    req.marketing.status = req.body.status;
  }
  if (req.marketing.condition != null) {
    req.marketing.condition = req.body.condition;
  }
  if (req.marketing.condition_value != null) {
    req.marketing.condition_value = req.body.condition_value;
  }
  if (req.marketing.isFlashSale != null) {
    req.marketing.isFlashSale = req.body.isFlashSale;
  }
  let dateFrom = req.body.dateFrom ? new Date(req.body.dateFrom) : new Date();
  let dateTo = req.body.dateTo ? new Date(req.body.dateTo) : null;
  dateFrom.setTime(dateFrom.getTime() + 7 * 60 * 60 * 1000);
  if (dateTo) {
    dateTo.setTime(dateTo.getTime() + 7 * 60 * 60 * 1000);
  }

  if (req.marketing.dateFrom != null) {
    req.marketing.dateFrom = dateFrom;
  }
  if (req.marketing.dateTo != null) {
    req.marketing.dateTo = dateTo;
  }

  try {
    const updateMarketing = await req.marketing.save();
    res.json(updateMarketing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Update status one
router.patch("/marketing/status/:id", getMarketingById, async (req, res) => {
  if (req.marketing.status != null) {
    req.marketing.status = !req.marketing.status;
  }
  try {
    const updateMarketing = await req.marketing.save();
    res.json(updateMarketing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Getting one
router.get("/marketing/:id", getMarketingById, async (req, res) => {
  res.send(req.marketing);
});

//Deleting one
router.delete("/marketing/:id", getMarketingById, async (req, res) => {
  try {
    await req.marketing.remove();
    res.json({ message: `Deleted Marketing` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getMarketingById(req, res, next) {
  let marketing;
  try {
    marketing = await Marketing.findById(req.params.id);
    if (marketing == null) {
      return res.status(404).json({ message: "Can not find marketing" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.marketing = marketing;
  next();
}

module.exports = router;
