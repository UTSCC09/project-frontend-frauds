const express = require("express");
const rootRoutes = require("./routes/root");
const app = express();

// register routes
app.use(rootRoutes);

module.exports = app;
