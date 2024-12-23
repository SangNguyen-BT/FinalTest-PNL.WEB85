import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isActive: Boolean,
    isDeleted: Boolean,
    code: String,
    startDate: Date,
    endDate: Date,
    teacherPositionsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacherPosition",
      },
    ],
    degrees: [
      {
        type: { type: String },
        school: String,
        major: String,
        year: Number,
        isGraduated: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const teacherModel = mongoose.model("teacher", teacherSchema);

export default teacherModel;
