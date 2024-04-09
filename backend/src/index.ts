import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import { createIO } from "./config/createIO";
import connectDB from "./config/db";
import { CustomError } from "./utils/error";

// App setup
const port = process.env.BACKEND_PORT || 3001;
const corsOptions = {
  origin: process.env.FRONTEND_URL || "",
};

const app = express();
const httpServer = createServer(app);
const io = createIO(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "",
  },
});

io.on("connection", socket => {
  console.log(`Socket connected: ${socket.id}`);
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

// Import routes
import ledRoute from "./routes/led.route";
import fanRoute from "./routes/fan.route";
import lightRoute from "./routes/light.route";
import temperatureRoute from "./routes/temperature.route";
import humidityRoute from "./routes/humidity.route";

// Binding routes
app.use("/api/v1/led", ledRoute);
app.use("/api/v1/fan", fanRoute);
app.use("/api/v1/light", lightRoute);
app.use("/api/v1/temperature", temperatureRoute);
app.use("/api/v1/humidity", humidityRoute);

// Default error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  let newErr: CustomError;
  if (!(err instanceof CustomError)) {
    newErr = new CustomError();
  } else {
    newErr = err;
  }

  res.status(newErr.status).json({
    message: newErr.message,
  });
});

// Listening for requests
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}...`);
});

connectDB();
