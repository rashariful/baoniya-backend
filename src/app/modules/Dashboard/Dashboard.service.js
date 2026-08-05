

import { Classes } from "../Classes/Classes.model.js";
import { Fees } from "../Fees/Fees.model.js";
import { Student } from "../Student/Student.model.js";
import { Teacher } from "../Teacher/Teacher.model.js";

const getDashboardSummary = async () => {
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    totalFeesCollected,
    totalDueFees,
  ] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Classes.countDocuments(),
    Fees.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$paidAmount" },
        },
      },
    ]),
    Fees.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$dueAmount" },
        },
      },
    ]),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    totalFeesCollected: totalFeesCollected[0]?.total || 0,
    totalDueFees: totalDueFees[0]?.total || 0,
  };
};

export const DashboardService = {
  getDashboardSummary,
};