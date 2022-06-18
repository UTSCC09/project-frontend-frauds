const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
