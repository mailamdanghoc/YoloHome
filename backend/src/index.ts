import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
require("dotenv").config();

// Import routes
import testRoute from "./routes/test.router";

// App setup
const app = express();
const port = process.env.PORT || 3001;
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

// Binding routes
app.use("/api/v1/test", testRoute);

// Error handlers
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status ?? 500).json({
    success: false,
    message: err.message ?? "Server is down! Please try again later!",
  });
});

// Listening for requests
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}...`);
});
