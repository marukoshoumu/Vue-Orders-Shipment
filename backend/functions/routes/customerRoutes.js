const express = require("express");
const router = express.Router();
const { customers } = require("../data");

// 顧客一覧を取得
router.get("/", (req, res) => {
  res.json(customers);
});

module.exports = router;
