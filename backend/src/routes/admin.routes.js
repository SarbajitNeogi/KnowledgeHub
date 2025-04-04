import { Router } from "express";
import { adminLogin, adminLogout, adminSignUp, approveStudent, approveTeacher, checkStudentDocuments, checkTeacherDocuments, forApproval, sendmessage, allmessages, readMessage, toapproveCourse, approveCourse } from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router()

router.route("/signup").post(adminSignUp)

router.route("/login").post(adminLogin)

router.route("/:adminID/approve").post(forApproval)

router.route("/:adminID/approve/student/:studentID").post(approveStudent)

router.route("/:adminID/approve/teacher/:teacherID").post(approveTeacher)

router.route("/:adminID/documents/student/:studentID").get(checkStudentDocuments)

router.route("/:adminID/documents/teacher/:teacherID").get(checkTeacherDocuments)

router.route("/logout").post(authAdmin, adminLogout)

router.route("/contact-us").post(sendmessage)

router.route("/messages/all").get(allmessages)

router.route("/message/read").patch(readMessage)

router.route("/:adminID/approve/course").get(toapproveCourse)

router.route("/:adminID/approve/course/:courseID").post(approveCourse)

export default router;

//testing