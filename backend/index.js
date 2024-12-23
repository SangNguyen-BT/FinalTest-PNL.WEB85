import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js"

import teacherRoute from "./routes/teacherRoute.js"
import teacherPositionRoute from "./routes/teacherPositionRoute.js"
import userRoute from "./routes/userRoute.js"

// App Config
const app = express();
const port = process.env.PORT;
connectDB()

// Middlewares
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// API Endpoints
app.use("/api", teacherRoute)
app.use("/api", teacherPositionRoute)
app.use("/api", userRoute)


app.listen(port, () => {
  console.log("Server is working on PORT: " + port);
});
