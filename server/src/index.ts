import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./utils/helper";
import router from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Port where React is running
    credentials: true, // Allow cookies or auth headers if needed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Built-in middleware to parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

// Must be registered AFTER routes so thrown errors return JSON instead of HTML
app.use(errorMiddleware);

ConnectDB()
  .then(() => {
    console.log("MongoDB is connected succesfully");
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${process.env.PORT}`,
      );
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
  });

  // https://github.com/Vaibhav252-web/Notes_App.git
