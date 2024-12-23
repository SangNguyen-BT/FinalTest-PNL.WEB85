import express from "express";

import errorHandler from "../middlewares/errorMiddleware.js";

import teacherPositionModel from "../models/teacherPositionModel.js";

const router = express.Router();

router.get("/teacher-positions", async (req, res, next) => {
  try {
    const teacherPositions = await teacherPositionModel.find();

    res.status(200).json({
      success: true,
      message: "Danh sách vị trí công tác",
      data: teacherPositions,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/teacher-positions", async (req, res, next) => {
  try {
    const { name, code, des, isActive, isDeleted } = req.body;

    const existingPosition = await teacherPositionModel.findOne({ code });
    if (existingPosition) {
      return res.status(400).json({
        success: false,
        message: "Code đã tồn tại, vui lòng chọn mã khác.",
      });
    }

    const newTeacherPosition = new teacherPositionModel({
      name,
      code,
      des,
      isActive,
      isDeleted,
    });
    await newTeacherPosition.save();

    return res.status(201).json({
      success: true,
      message: "Vị trí công tác đã được tạo thành công.",
      data: newTeacherPosition,
    });
    
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;
