import express from "express";
import rootRoutes from "./routes/root.js";

const app = express();

// register routes
app.use(rootRoutes);

export default app;
