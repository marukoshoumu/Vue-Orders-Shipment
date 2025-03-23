const express = require("express");
const router = express.Router();

// 📌 ダミーデータ（将来的にDBに置き換え可能）
const shippingData = {
  "02/14": { ヤマト: 2, 佐川: 1 },
  "02/15": { ヤマト: 3, 佐川: 2, 西濃運輸: 1 },
  "02/16": { ヤマト: 1, 西濃運輸: 2 },
};

// 📌 発送件数データを取得するエンドポイント
router.get("/", (req, res) => {
  res.json(shippingData);
});

module.exports = router;
