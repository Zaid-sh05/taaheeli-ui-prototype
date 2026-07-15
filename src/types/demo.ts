export type ID = string;

export type RoleKey = "manager" | "doctor" | "admin" | "parent" | "patient";

export type RequestStatus = "pending" | "approved" | "rejected" | "info-requested";

export interface Patient {
  id: ID;
  fullName: string;
  fileNumber: string;
  username: string;
  status: "active" | "inactive";
  assignedTherapistId: ID | null;
  birthDate: string;
  gender: "male" | "female" | "";
  phone?: string;
  email?: string;
  caregiverName?: string;
  caregiverRelation?: string;
  progress: number;
  lastSessionDate: string | null;
  nextAppointmentDate: string | null;
  createdAt: string;
}

export interface RegistrationRequest {
  id: ID;
  fullName: string;
  username: string;
  birthDate: string;
  gender: "male" | "female" | "";
  hasCaregiver: boolean;
  caregiverName: string;
  caregiverRelation: string;
  phone?: string;
  email?: string;
  consent: boolean;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
}

export type EmployeeRole = "doctor" | "therapist" | "admin" | "nurse" | "coordinator";

export interface Employee {
  id: ID;
  fullName: string;
  role: EmployeeRole;
  specialty: string;
  employmentStatus: "active" | "on-leave";
  assignedCaseCount: number;
  todayAppointmentCount: number;
  phone?: string;
  email?: string;
  hireDate: string;
}

export interface Appointment {
  id: ID;
  patientId: ID;
  employeeId: ID;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "missed" | "cancelled";
  notes?: string;
}

export interface TreatmentPlan {
  id: ID;
  patientId: ID;
  employeeId: ID;
  title: string;
  startDate: string;
  endDate: string | null;
  goals: string[];
  progress: number;
  status: "active" | "completed" | "paused";
}

export interface RehabSession {
  id: ID;
  patientId: ID;
  employeeId: ID;
  date: string;
  durationMin: number;
  type: string;
  notes: string;
  attendance: "attended" | "missed" | "late";
}

export interface Exercise {
  id: ID;
  patientId: ID;
  title: string;
  description: string;
  frequency: string;
  status: "active" | "completed";
}

export type NotificationType =
  | "registration"
  | "missed-appointment"
  | "report-review"
  | "incomplete-file"
  | "attendance-change";

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface DemoData {
  patients: Patient[];
  requests: RegistrationRequest[];
  employees: Employee[];
  appointments: Appointment[];
  treatmentPlans: TreatmentPlan[];
  sessions: RehabSession[];
  exercises: Exercise[];
  notifications: AppNotification[];
  version: number;
}
