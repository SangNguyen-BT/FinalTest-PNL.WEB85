import express from "express";

import errorHandler from "../middlewares/errorMiddleware.js";

import userModel from "../models/userModel.js";

const router = express.Router();

router.get("/user-id", async (req, res, next) => {
  try {
    const user = await userModel.findOne();
    if (!user) {
      return res.status(404).json({ message: "Không thấy user" });
    }
    res.json({ userId: user._id })
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;
