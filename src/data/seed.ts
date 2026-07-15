import type {
  DemoData,
  Patient,
  RegistrationRequest,
  Employee,
  Appointment,
  RehabSession,
  TreatmentPlan,
  Exercise,
  AppNotification,
} from "@/types/demo";

const SEED_VERSION = 1;

function isoDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function isoDateTime(daysFromNow: number, hoursAgo: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

const employees: Employee[] = [
  { id: "e1", fullName: "د. خالد الشمري", role: "doctor", specialty: "طب التأهيل", employmentStatus: "active", assignedCaseCount: 12, todayAppointmentCount: 4, phone: "0501234567", email: "k.shammari@taaheeli.example", hireDate: "2021-09-01" },
  { id: "e2", fullName: "أ. منيرة العنزي", role: "therapist", specialty: "علاج طبيعي", employmentStatus: "active", assignedCaseCount: 15, todayAppointmentCount: 6, phone: "0502345678", email: "m.otaibi@taaheeli.example", hireDate: "2022-01-15" },
  { id: "e3", fullName: "أ. سارة المطيري", role: "therapist", specialty: "علاج وظيفي", employmentStatus: "active", assignedCaseCount: 10, todayAppointmentCount: 3, phone: "0503456789", email: "s.mutairi@taaheeli.example", hireDate: "2022-03-10" },
  { id: "e4", fullName: "أ. فهد الدوسري", role: "therapist", specialty: "علاج نطق وتخاطب", employmentStatus: "active", assignedCaseCount: 8, todayAppointmentCount: 2, phone: "0504567890", email: "f.dosari@taaheeli.example", hireDate: "2023-01-20" },
  { id: "e5", fullName: "سارة المطيري", role: "admin", specialty: "إدارة مكتبية", employmentStatus: "active", assignedCaseCount: 0, todayAppointmentCount: 0, phone: "0505678901", email: "s.admin@taaheeli.example", hireDate: "2021-06-01" },
  { id: "e6", fullName: "أ. نورة القحطاني", role: "nurse", specialty: "تمريض تأهيلي", employmentStatus: "on-leave", assignedCaseCount: 5, todayAppointmentCount: 0, phone: "0506789012", email: "n.qahtani@taaheeli.example", hireDate: "2022-11-05" },
  { id: "e7", fullName: "أ. عبدالله الحربي", role: "coordinator", specialty: "تنسيق المواعيد", employmentStatus: "active", assignedCaseCount: 0, todayAppointmentCount: 0, phone: "0507890123", email: "a.harbi@taaheeli.example", hireDate: "2023-05-01" },
];

const patients: Patient[] = [
  { id: "p1", fullName: "محمد العتيبي", fileNumber: "T-1001", username: "mohammed", status: "active", assignedTherapistId: "e2", birthDate: "1998-04-15", gender: "male", phone: "0551112222", email: "m.otaibi@example.com", progress: 65, lastSessionDate: isoDate(-1), nextAppointmentDate: isoDate(2), createdAt: isoDate(-120) },
  { id: "p2", fullName: "فاطمة الزهراني", fileNumber: "T-1002", username: "fatimah", status: "active", assignedTherapistId: "e3", birthDate: "2001-07-22", gender: "female", phone: "0552223333", progress: 40, lastSessionDate: isoDate(-2), nextAppointmentDate: isoDate(1), createdAt: isoDate(-90) },
  { id: "p3", fullName: "عبدالرحمن السبيعي", fileNumber: "T-1003", username: "abdulrahman", status: "active", assignedTherapistId: "e2", birthDate: "1995-12-03", gender: "male", phone: "0553334444", progress: 80, lastSessionDate: isoDate(0), nextAppointmentDate: isoDate(3), createdAt: isoDate(-200) },
  { id: "p4", fullName: "ريم الشهري", fileNumber: "T-1004", username: "reem", status: "active", assignedTherapistId: "e4", birthDate: "2003-03-18", gender: "female", phone: "0554445555", progress: 25, lastSessionDate: isoDate(-3), nextAppointmentDate: isoDate(0), createdAt: isoDate(-60) },
  { id: "p5", fullName: "ماجد الغامدي", fileNumber: "T-1005", username: "majed", status: "active", assignedTherapistId: "e1", birthDate: "1990-09-30", gender: "male", phone: "0555556666", progress: 90, lastSessionDate: isoDate(-1), nextAppointmentDate: isoDate(5), createdAt: isoDate(-300) },
  { id: "p6", fullName: "هند البقمي", fileNumber: "T-1006", username: "hind", status: "active", assignedTherapistId: "e3", birthDate: "2005-02-14", gender: "female", phone: "0556667777", caregiverName: "أم هند", caregiverRelation: "الأم", progress: 55, lastSessionDate: isoDate(-1), nextAppointmentDate: isoDate(1), createdAt: isoDate(-45) },
  { id: "p7", fullName: "سلطان الرشيدي", fileNumber: "T-1007", username: "sultan", status: "active", assignedTherapistId: "e2", birthDate: "1992-11-25", gender: "male", phone: "0557778888", progress: 70, lastSessionDate: isoDate(0), nextAppointmentDate: isoDate(2), createdAt: isoDate(-150) },
  { id: "p8", fullName: "لمى المطيري", fileNumber: "T-1008", username: "lama", status: "inactive", assignedTherapistId: null, birthDate: "2000-06-08", gender: "female", phone: "0558889999", progress: 15, lastSessionDate: isoDate(-30), nextAppointmentDate: null, createdAt: isoDate(-250) },
  { id: "p9", fullName: "تركي العنزي", fileNumber: "T-1009", username: "turki", status: "active", assignedTherapistId: "e4", birthDate: "1997-01-19", gender: "male", phone: "0559990000", progress: 50, lastSessionDate: isoDate(-2), nextAppointmentDate: isoDate(4), createdAt: isoDate(-80) },
  { id: "p10", fullName: "جواهر الحربي", fileNumber: "T-1010", username: "jawahir", status: "active", assignedTherapistId: "e1", birthDate: "2002-08-11", gender: "female", phone: "0550001111", caregiverName: "أبو جواهر", caregiverRelation: "الأب", progress: 35, lastSessionDate: isoDate(-1), nextAppointmentDate: isoDate(0), createdAt: isoDate(-55) },
];

const requests: RegistrationRequest[] = [
  { id: "r1", fullName: "نورة القحطاني", username: "noura", birthDate: "1999-05-12", gender: "female", hasCaregiver: false, caregiverName: "", caregiverRelation: "", phone: "0561234567", email: "noura@example.com", consent: true, status: "pending", submittedAt: isoDateTime(-2, 5), reviewedAt: null, reviewNote: null },
  { id: "r2", fullName: "بدر الشمري", username: "badr", birthDate: "2004-03-25", gender: "male", hasCaregiver: true, caregiverName: "خالد الشمري", caregiverRelation: "الأب", phone: "0562345678", consent: true, status: "pending", submittedAt: isoDateTime(-1, 2), reviewedAt: null, reviewNote: null },
  { id: "r3", fullName: "أحمد المطيري", username: "ahmad_m", birthDate: "1996-11-08", gender: "male", hasCaregiver: false, caregiverName: "", caregiverRelation: "", phone: "", email: "ahmad@example.com", consent: true, status: "approved", submittedAt: isoDateTime(-10, 0), reviewedAt: isoDateTime(-8, 0), reviewNote: "تم التفعيل" },
];

const appointments: Appointment[] = [
  { id: "a1", patientId: "p3", employeeId: "e2", date: isoDate(0), time: "09:00", type: "علاج طبيعي", status: "completed" },
  { id: "a2", patientId: "p7", employeeId: "e2", date: isoDate(0), time: "10:00", type: "علاج طبيعي", status: "completed" },
  { id: "a3", patientId: "p1", employeeId: "e2", date: isoDate(0), time: "11:00", type: "متابعة", status: "scheduled" },
  { id: "a4", patientId: "p4", employeeId: "e4", date: isoDate(0), time: "12:00", type: "علاج نطق", status: "scheduled" },
  { id: "a5", patientId: "p10", employeeId: "e1", date: isoDate(0), time: "13:00", type: "تقييم", status: "scheduled" },
  { id: "a6", patientId: "p2", employeeId: "e3", date: isoDate(1), time: "09:00", type: "علاج وظيفي", status: "scheduled" },
  { id: "a7", patientId: "p6", employeeId: "e3", date: isoDate(1), time: "10:00", type: "علاج وظيفي", status: "scheduled" },
  { id: "a8", patientId: "p1", employeeId: "e2", date: isoDate(2), time: "09:00", type: "علاج طبيعي", status: "scheduled" },
  { id: "a9", patientId: "p3", employeeId: "e2", date: isoDate(3), time: "11:00", type: "علاج طبيعي", status: "scheduled" },
  { id: "a10", patientId: "p5", employeeId: "e1", date: isoDate(5), time: "14:00", type: "متابعة", status: "scheduled" },
  { id: "a11", patientId: "p9", employeeId: "e4", date: isoDate(4), time: "10:00", type: "علاج نطق", status: "scheduled" },
  { id: "a12", patientId: "p4", employeeId: "e4", date: isoDate(-1), time: "09:00", type: "علاج نطق", status: "missed" },
];

const sessions: RehabSession[] = [
  { id: "s1", patientId: "p3", employeeId: "e2", date: isoDate(0), durationMin: 45, type: "علاج طبيعي", notes: "تحسن ملحوظ في مدى الحركة", attendance: "attended" },
  { id: "s2", patientId: "p7", employeeId: "e2", date: isoDate(0), durationMin: 40, type: "علاج طبيعي", notes: "تمارين تقوية العضلات", attendance: "attended" },
  { id: "s3", patientId: "p1", employeeId: "e2", date: isoDate(-1), durationMin: 50, type: "علاج طبيعي", notes: "جلسة متابعة", attendance: "attended" },
  { id: "s4", patientId: "p2", employeeId: "e3", date: isoDate(-2), durationMin: 35, type: "علاج وظيفي", notes: "تمارين الحياة اليومية", attendance: "attended" },
  { id: "s5", patientId: "p4", employeeId: "e4", date: isoDate(-3), durationMin: 30, type: "علاج نطق", notes: "تمارين النطق", attendance: "attended" },
  { id: "s6", patientId: "p5", employeeId: "e1", date: isoDate(-1), durationMin: 45, type: "تقييم", notes: "تقييم شهري", attendance: "attended" },
  { id: "s7", patientId: "p6", employeeId: "e3", date: isoDate(-1), durationMin: 40, type: "علاج وظيفي", notes: "تحسن في المهارات الحركية الدقيقة", attendance: "attended" },
  { id: "s8", patientId: "p9", employeeId: "e4", date: isoDate(-2), durationMin: 30, type: "علاج نطق", notes: "تمارين المخاطبة", attendance: "late" },
  { id: "s9", patientId: "p4", employeeId: "e4", date: isoDate(-1), durationMin: 30, type: "علاج نطق", notes: "لم يحضر المريض", attendance: "missed" },
  { id: "s10", patientId: "p10", employeeId: "e1", date: isoDate(-1), durationMin: 45, type: "تقييم", notes: "تقييم أولي", attendance: "attended" },
];

const treatmentPlans: TreatmentPlan[] = [
  { id: "tp1", patientId: "p1", employeeId: "e2", title: "خطة علاج طبيعي - المرحلة الثانية", startDate: isoDate(-60), endDate: isoDate(30), goals: ["زيادة مدى الحركة في الكتف", "تقوية عضلات الذراع"], progress: 65, status: "active" },
  { id: "tp2", patientId: "p2", employeeId: "e3", title: "خطة علاج وظيفي", startDate: isoDate(-45), endDate: isoDate(45), goals: ["تحسين مهارات الحياة اليومية", "زيادة الاستقلالية"], progress: 40, status: "active" },
  { id: "tp3", patientId: "p3", employeeId: "e2", title: "خطة علاج طبيعي - المرحلة الأولى", startDate: isoDate(-120), endDate: isoDate(-10), goals: ["استعادة المشي", "تقوية الأطراف السفلية"], progress: 80, status: "completed" },
  { id: "tp4", patientId: "p5", employeeId: "e1", title: "خطة تأهيل شاملة", startDate: isoDate(-90), endDate: null, goals: ["تحسين التوازن", "زيادة القدرة على التحمل"], progress: 90, status: "active" },
  { id: "tp5", patientId: "p4", employeeId: "e4", title: "خطة علاج النطق", startDate: isoDate(-30), endDate: isoDate(60), goals: ["تحسين وضوح النطق", "زيادة المفردات"], progress: 25, status: "active" },
];

const exercises: Exercise[] = [
  { id: "ex1", patientId: "p1", title: "تمارين مدى الحركة - الكتف", description: "تحريك الكتف في دوائر بطيئة ١٠ مرات", frequency: "٣ مرات يومياً", status: "active" },
  { id: "ex2", patientId: "p1", title: "تمرين تقوية الذراع", description: "استخدام شريط مطاطي للضغط ١٥ مرة", frequency: "مرتان يومياً", status: "active" },
  { id: "ex3", patientId: "p2", title: "تمارين الحياة اليومية", description: "تمارين ارتداء الملابس واستخدام الأدوات", frequency: "مرة يومياً", status: "active" },
  { id: "ex4", patientId: "p4", title: "تمارين النطق - المقاطع", description: "تكرار مقاطع صوتية محددة ٢٠ مرة", frequency: "مرتان يومياً", status: "active" },
  { id: "ex5", patientId: "p5", title: "تمارين التوازن", description: "الوقوف على قدم واحدة ٣٠ ثانية", frequency: "٣ مرات يومياً", status: "active" },
];

const notifications: AppNotification[] = [
  { id: "n1", type: "registration", title: "طلب تسجيل جديد", message: "وصل طلب تسجيل جديد من نورة القحطاني", createdAt: isoDateTime(-2, 5), read: false, link: "/manager/requests/r1" },
  { id: "n2", type: "registration", title: "طلب تسجيل جديد", message: "وصل طلب تسجيل جديد من بدر الشمري", createdAt: isoDateTime(-1, 2), read: false, link: "/manager/requests/r2" },
  { id: "n3", type: "missed-appointment", title: "موعد فائت", message: "لم يحضر المريض لمى المطيري موعد علاج النطق أمس", createdAt: isoDateTime(-1, 12), read: false, link: "/manager/patients/p4" },
  { id: "n4", type: "incomplete-file", title: "ملف غير مكتمل", message: "ملف المريضة هند البقمي ينقصه تقرير التقييم الأخير", createdAt: isoDateTime(-3, 8), read: false, link: "/manager/patients/p8" },
  { id: "n5", type: "report-review", title: "تقرير بانتظار المراجعة", message: "تقرير الحضور الأسبوعي بانتظار مراجعتك", createdAt: isoDateTime(-4, 10), read: true, link: "/manager/reports" },
  { id: "n6", type: "attendance-change", title: "تغير في معدل الحضور", message: "انخفض معدل الحضور بنسبة ١٠٪ هذا الأسبوع", createdAt: isoDateTime(-5, 6), read: true, link: "/manager/reports" },
];

export function generateSeedData(): DemoData {
  return {
    patients,
    requests,
    employees,
    appointments,
    treatmentPlans,
    sessions,
    exercises,
    notifications,
    version: SEED_VERSION,
  };
}

export { SEED_VERSION };
