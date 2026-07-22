import { Router } from "express";

import { AuthRoutes } from "../modules/user/user.routes.js";
import { BannerRoutes } from "../modules/Banner/Banner.routes.js";
import { SmsRoutes } from "../modules/sms/sms.routes.js";
import { AdmissionRoutes } from "../modules/Admission/Admission.routes.js";
import { AttendanceRoutes } from "../modules/Attendance/Attendance.routes.js";
import { ClassesRoutes } from "../modules/Classes/Classes.routes.js";
import { ContactRoutes } from "../modules/Contact/Contact.routes.js";
import { DonateRoutes } from "../modules/Donate/Donate.routes.js";
import { EventRoutes } from "../modules/Event/Event.routes.js";
import { ExaminationRoutes } from "../modules/Examination/Examination.routes.js";
import { FeesRoutes } from "../modules/Fees/Fees.routes.js";
import { NoticeRoutes } from "../modules/Notice/Notice.routes.js";
import { ParentsRoutes } from "../modules/Parents/Parents.routes.js";
import { SettingsRoutes } from "../modules/Settings/Settings.routes.js";
import { StaffRoutes } from "../modules/Staff/Staff.routes.js";
import { StudentRoutes } from "../modules/Student/Student.routes.js";
import { TeacherRoutes } from "../modules/Teacher/Teacher.routes.js";
import { ExamResultRoutes } from "../modules/ExamResult/ExamResult.routes.js";
import { ExamRoutes } from "../modules/Exam/Exam.routes.js";
import { ResultSettingRoutes } from "../modules/ResultSetting/ResultSetting.routes.js";
import { GradeRuleRoutes } from "../modules/GradeRule/GradeRule.routes.js";
import { SubjectRoutes } from "../modules/Subject/Subject.routes.js";
import { SectionRoutes } from "../modules/Section/Section.routes.js";
import { AcademicSessionRoutes } from "../modules/AcademicSession/AcademicSession.routes.js";
import { StudentAcademicRecordRoutes } from "../modules/StudentAcademicRecord/StudentAcademicRecord.routes.js";
import { GalleryRoutes } from "../modules/Gallery/Gallery.routes.js";
import { NotificationRoutes } from "../modules/Notification/Notification.routes.js";


const router = Router();

const moduleRoutes = [
  
  {
    path: "/auth",
    route: AuthRoutes,
  },
 

  {
    path: "/banner",
    route: BannerRoutes
  },
  {
    path: "/gallery",
    route: GalleryRoutes
  },
  {
    path: "/admission",
    route: AdmissionRoutes
  },
  {
    path: "/notification",
    route: NotificationRoutes
  },
  {
    path: "/attendance",
    route: AttendanceRoutes
  },
  {
    path: "/exam",
    route: ExamRoutes
  },
   
  {
    path: "/exam-result",
    route: ExamResultRoutes
  },
  {
    path: "/result-setting",
    route: ResultSettingRoutes
  },
  {
    path: "/grade-rule",
    route: GradeRuleRoutes
  },
  {
    path: "/subject",
    route: SubjectRoutes
  },
  {
    path: "/section",
    route: SectionRoutes
  },
   
  {
    path: "/academic-session",
    route: AcademicSessionRoutes
  },
  {
    path: "/student-academic-record",
    route: StudentAcademicRecordRoutes
  },
   
  {
    path: "/classes",
    route: ClassesRoutes
  },
  {
    path: "/contact",
    route: ContactRoutes
  },
   
  {
    path: "/donate",
    route: DonateRoutes
  },
   
  {
    path: "/event",
    route: EventRoutes
  },
   
  {
    path: "/examination",
    route: ExaminationRoutes
  },
  {
    path: "/fees",
    route: FeesRoutes
  },
  {
    path: "/notice",
    route: NoticeRoutes
  },
  {
    path: "/parents",
    route: ParentsRoutes
  },
  {
    path: "/setting",
    route: SettingsRoutes
  },
  {
    path: "/staff",
    route: StaffRoutes
  },
  {
    path: "/student",
    route: StudentRoutes
  },
  {
    path: "/teacher",
    route: TeacherRoutes
  },
   
  {
    path: "/Sms",
    route: SmsRoutes
  },
  
 
];
moduleRoutes.forEach((route) => router.use(route?.path, route?.route));

export default router;
