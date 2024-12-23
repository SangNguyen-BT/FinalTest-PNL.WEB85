import express from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import errorHandler from "../middlewares/errorMiddleware.js";

import teacherModel from "../models/teacherModel.js";
import userModel from "../models/userModel.js";

const router = express.Router();

router.get("/teachers", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const teachers = await teacherModel
      .find()
      .populate("userId", "name email phoneNumber isActive address")
      .populate("teacherPositionsId", "name code des")
      .skip(skip)
      .limit(parseInt(limit));

    const result = teachers.map((teacher) => ({
      code: teacher.code,
      name: teacher.userId?.name || "N/A",
      email: teacher.userId?.email || "N/A",
      phoneNumber: teacher.userId?.phoneNumber || "N/A",
      isActive: teacher.isActive ? "Active" : "Inactive",
      address: teacher.userId?.address || "N/A",
      degrees:
        teacher.degrees?.map((degree) => ({
          type: degree.type,
          school: degree.school,
          major: degree.major,
        })) || [],
      position:
        teacher.teacherPositionsId?.map((pos) => pos.name).join(", ") || "N/A",
    }));

    const totalTeachers = await teacherModel.countDocuments();
    const totalPages = Math.ceil(totalTeachers / limit);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        currentPage: page,
        totalPages,
        totalTeachers,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/teachers", async (req, res, next) => {
  try {
    function generateRandomCode() {
      return uuidv4();
    }

    const existingUser = await userModel.findById(req.body.userId);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        error: "User không tồn tại",
      });
    }

    const teacher = new teacherModel({
      ...req.body,
      code: generateRandomCode(),
    });

    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Tạo thông tin giáo viên thành công",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;
