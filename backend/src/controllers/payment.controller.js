import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {instance}  from "../app.js"
import crypto from "crypto"
import {payment} from "../models/payment.model.js"
import { Teacher } from "../models/teacher.model.js";


const coursePayment = asyncHandler(async (req, res) => {
  const { fees, courseID } = req.body;
  const studentID = req.Student._id;

  if (!fees || !courseID) {
      throw new ApiError(400, "Fees and course ID are required");
  }

  // Create payment entry (assuming payment is auto-approved)
  const orderDetails = await payment.create({
      courseID,
      studentID,
      amountPaid: fees,
      status: "Paid", // Mark as paid directly
  });

  // Enroll student in the course
  await student.findByIdAndUpdate(studentID, {
      $addToSet: { enrolledCourses: courseID }
  });

  return res
      .status(200)
      .json(new ApiResponse(200, { orderDetails }, "Payment processed & student enrolled"));
});

// const coursePaymentConfirmation = asyncHandler(async(req,res)=>{
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;
  
//   const studentID = req.Student._id
//   const courseID = req.params.courseID
//   console.log(courseID)

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.KEY_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {

//     const orderDetails = await payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       courseID, 
//       studentID,
//     });

//     return res
//     .status(200)
//     .json(new ApiResponse(200,{orderDetails}, "payment confirmed" ))
//   } else {
//     throw new ApiError(400, "payment failed")
//   }
// })


const teacherAmount = asyncHandler(async (req, res) => {
    const teacher = req.teacher;
  
    const price = {
      math: 700,
      physics: 800,
      computer: 1000,
      chemistry: 600,
      biology: 500,
    };
  
    // Calculate balance based on enrolled students' subjects
    const newEnrolledStudents = await Teacher.aggregate([
      { $match: { _id: teacher._id } },
      { $unwind: "$enrolledStudent" },
      { $match: { "enrolledStudent.isNewEnrolled": true } },
      { 
        $group: {
          _id: null,
          totalBalance: { 
            $sum: { 
              $switch: {
                branches: [
                  { case: { $eq: ["$enrolledStudent.subject", "math"] }, then: price.math },
                  { case: { $eq: ["$enrolledStudent.subject", "physics"] }, then: price.physics },
                  { case: { $eq: ["$enrolledStudent.subject", "computer"] }, then: price.computer },
                  { case: { $eq: ["$enrolledStudent.subject", "chemistry"] }, then: price.chemistry },
                  { case: { $eq: ["$enrolledStudent.subject", "biology"] }, then: price.biology },
                ],
                default: 0
              }
            }
          }
        }
      }
    ]);
  
    const totalBalance = newEnrolledStudents.length > 0 ? newEnrolledStudents[0].totalBalance : 0;
  
    // Update teacher balance
    await Teacher.findByIdAndUpdate(
      teacher._id,
      { $inc: { Balance: totalBalance } }
    );
  
    // Mark students as no longer newly enrolled
    const newTeacher = await Teacher.findOneAndUpdate(
      { _id: teacher._id, "enrolledStudent.isNewEnrolled": true },
      { $set: { "enrolledStudent.$[elem].isNewEnrolled": false } },
      { 
        new: true,
        arrayFilters: [{ "elem.isNewEnrolled": true }]
      }
    ) || await Teacher.findById(teacher._id); // Fallback if no new enrollments
  
    return res.status(200).json(new ApiResponse(200, { newTeacher }, "Balance updated"));
  });
  

const withdrawAmount = asyncHandler(async (req, res) => {
  const teacherId = req.teacher._id;
  const amount = req.body.amount;

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  if (teacher.Balance < amount) {
      throw new ApiError(400, "Insufficient balance");
  }

  teacher.Balance -= amount;
  teacher.WithdrawalHistory.push({ amount });
  await teacher.save();

  return res.status(200).json(new ApiResponse(200, { teacher }, "Withdrawal successful"));
});


export {coursePayment,teacherAmount, withdrawAmount}