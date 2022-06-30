const router = require("express").Router();

router.get("/health", (_req, res) => {
  res.json({ message: "ok" });
});

module.exports = router;
