import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  DemoData,
  RegistrationRequest,
  RequestStatus,
  Patient,
  AppNotification,
  Appointment,
  RehabSession,
  TreatmentPlan,
  PlanGoal,
  Exercise,
  DemoDocument,
  ChatMessage,
  CompanionMessage,
  NotificationType,
  RoleKey,
} from "@/types/demo";
import { generateSeedData, SEED_VERSION } from "@/data/seed";

const STORAGE_KEY = "taaheeli-demo-data";

interface AddRequestForm {
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
}

interface NewAppointmentForm {
  patientId: string;
  employeeId: string;
  date: string;
  time: string;
  durationMin: number;
  type: string;
  channel: "in-person" | "video";
  notes?: string;
}

interface NewSessionForm {
  patientId: string;
  employeeId: string;
  date: string;
  durationMin: number;
  type: string;
  attendance: "attended" | "missed" | "late";
  notes: string;
  completedExerciseIds: string[];
  goalProgressUpdates: { goalId: string; newProgress: number }[];
  nextRecommendations: string;
  followUpDate: string | null;
  status: "draft" | "completed";
}

interface NewPlanForm {
  patientId: string;
  employeeId: string;
  title: string;
  startDate: string;
  endDate: string | null;
  reviewDate: string | null;
  goals: { text: string }[];
  sessionFrequency: string;
  notes: string;
  status: "active" | "completed" | "paused" | "draft";
}

interface NewDocumentForm {
  patientId: string;
  title: string;
  category: DemoDocument["category"];
  notes: string;
}

interface DemoDataContextValue {
  data: DemoData;
  addRequest: (form: AddRequestForm) => string;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, note?: string) => void;
  requestInfo: (id: string, note?: string) => void;
  forwardToManager: (id: string) => void;
  updateRequestContact: (id: string, patch: { phone?: string; email?: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (targetRole?: RoleKey) => void;
  resetDemoData: () => void;
  addAppointment: (form: NewAppointmentForm) => string;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  confirmAttendance: (id: string) => void;
  markNoShow: (id: string) => void;
  addSession: (form: NewSessionForm) => string;
  addPlan: (form: NewPlanForm) => string;
  updatePlan: (id: string, patch: Partial<TreatmentPlan>) => void;
  addPlanGoal: (planId: string, text: string) => void;
  updatePlanGoal: (planId: string, goalId: string, progress: number) => void;
  changePlanStatus: (planId: string, status: TreatmentPlan["status"]) => void;
  addExercise: (exercise: Omit<Exercise, "id" | "status">) => void;
  completeExercise: (id: string, difficultyRating?: number) => void;
  addDocument: (form: NewDocumentForm) => void;
  updateDocument: (id: string, patch: Partial<DemoDocument>) => void;
  sendMessage: (conversationId: string, sender: ChatMessage["sender"], text: string) => void;
  sendCompanionMessage: (text: string, sender: "user" | "companion") => void;
  addNotification: (n: { type: NotificationType; title: string; message: string; link?: string; targetRole?: RoleKey }) => void;
}

const DemoDataContext = createContext<DemoDataContextValue | undefined>(undefined);

function loadData(): DemoData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoData>;
      if (parsed.version === SEED_VERSION) {
        return ensureComplete(parsed);
      }
    }
  } catch {
    // fall through to seed
  }
  const seed = generateSeedData();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {
    // ignore
  }
  return seed;
}

function ensureComplete(d: Partial<DemoData>): DemoData {
  const seed = generateSeedData();
  return {
    patients: d.patients ?? seed.patients,
    requests: d.requests ?? seed.requests,
    employees: d.employees ?? seed.employees,
    appointments: d.appointments ?? seed.appointments,
    treatmentPlans: d.treatmentPlans ?? seed.treatmentPlans,
    sessions: d.sessions ?? seed.sessions,
    exercises: d.exercises ?? seed.exercises,
    notifications: d.notifications ?? seed.notifications,
    documents: d.documents ?? seed.documents,
    conversations: d.conversations ?? seed.conversations,
    companionMessages: d.companionMessages ?? seed.companionMessages,
    version: SEED_VERSION,
  };
}

function saveData(d: DemoData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    // ignore
  }
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function genFileNumber(existing: Patient[]): string {
  const maxNum = existing.reduce((max, p) => {
    const m = p.fileNumber.match(/T-(\d+)/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 1000);
  return `T-${maxNum + 1}`;
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addNotification = useCallback<DemoDataContextValue["addNotification"]>((n) => {
    const notif: AppNotification = {
      id: genId("n"),
      type: n.type,
      title: n.title,
      message: n.message,
      createdAt: new Date().toISOString(),
      read: false,
      link: n.link,
      targetRole: n.targetRole,
    };
    setData((prev) => ({ ...prev, notifications: [notif, ...prev.notifications] }));
  }, []);

  const addRequest = useCallback<DemoDataContextValue["addRequest"]>((form) => {
    const id = genId("r");
    const now = new Date().toISOString();
    const request: RegistrationRequest = {
      id,
      fullName: form.fullName,
      username: form.username,
      birthDate: form.birthDate,
      gender: form.gender,
      hasCaregiver: form.hasCaregiver,
      caregiverName: form.caregiverName,
      caregiverRelation: form.caregiverRelation,
      phone: form.phone,
      email: form.email,
      consent: form.consent,
      status: "pending",
      submittedAt: now,
      reviewedAt: null,
      reviewNote: null,
    };
    const notification: AppNotification = {
      id: genId("n"),
      type: "registration",
      title: "طلب تسجيل جديد",
      message: `وصل طلب تسجيل جديد من ${form.fullName}`,
      createdAt: now,
      read: false,
      link: `/manager/requests/${id}`,
      targetRole: "manager",
    };
    const adminNotif: AppNotification = {
      id: genId("n"),
      type: "registration",
      title: "تسجيل جديد",
      message: `طلب تسجيل جديد من ${form.fullName} بحاجة لمراجعة البيانات`,
      createdAt: now,
      read: false,
      link: "/admin/registrations",
      targetRole: "admin",
    };
    setData((prev) => ({
      ...prev,
      requests: [request, ...prev.requests],
      notifications: [notification, adminNotif, ...prev.notifications],
    }));
    return id;
  }, []);

  const approveRequest = useCallback((id: string) => {
    setData((prev) => {
      const req = prev.requests.find((r) => r.id === id);
      if (!req || req.status === "approved") return prev;

      const newPatient: Patient = {
        id: genId("p"),
        fullName: req.fullName,
        fileNumber: genFileNumber(prev.patients),
        username: req.username,
        status: "active",
        assignedTherapistId: null,
        birthDate: req.birthDate,
        gender: req.gender,
        phone: req.phone,
        email: req.email,
        caregiverName: req.caregiverName || undefined,
        caregiverRelation: req.caregiverRelation || undefined,
        progress: 0,
        lastSessionDate: null,
        nextAppointmentDate: null,
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        requests: prev.requests.map((r) =>
          r.id === id
            ? { ...r, status: "approved" as RequestStatus, reviewedAt: new Date().toISOString(), reviewNote: "تمت الموافقة على الطلب" }
            : r,
        ),
        patients: [...prev.patients, newPatient],
      };
    });
  }, []);

  const rejectRequest = useCallback((id: string, note?: string) => {
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === id
          ? { ...r, status: "rejected" as RequestStatus, reviewedAt: new Date().toISOString(), reviewNote: note ?? "تم رفض الطلب" }
          : r,
      ),
    }));
  }, []);

  const requestInfo = useCallback((id: string, note?: string) => {
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === id
          ? { ...r, status: "info-requested" as RequestStatus, reviewedAt: new Date().toISOString(), reviewNote: note ?? "يرجى استكمال المعلومات" }
          : r,
      ),
    }));
  }, []);

  const forwardToManager = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === id ? { ...r, reviewNote: "تم التحويل لمدير المركز للمراجعة" } : r,
      ),
      notifications: [{
        id: genId("n"),
        type: "registration",
        title: "طلب محوّل للمراجعة",
        message: `تم تحويل طلب ${prev.requests.find((r) => r.id === id)?.fullName ?? ""} من الموظف الإداري`,
        createdAt: new Date().toISOString(),
        read: false,
        link: `/manager/requests/${id}`,
        targetRole: "manager",
      }, ...prev.notifications],
    }));
  }, []);

  const updateRequestContact = useCallback((id: string, patch: { phone?: string; email?: string }) => {
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) => r.id === id ? { ...r, ...patch } : r),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback((targetRole?: RoleKey) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        !targetRole || n.targetRole === targetRole ? { ...n, read: true } : n,
      ),
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    const seed = generateSeedData();
    setData(seed);
  }, []);

  const addAppointment = useCallback<DemoDataContextValue["addAppointment"]>((form) => {
    const id = genId("a");
    const appt: Appointment = {
      id,
      patientId: form.patientId,
      employeeId: form.employeeId,
      date: form.date,
      time: form.time,
      durationMin: form.durationMin,
      type: form.type,
      channel: form.channel,
      status: "scheduled",
      notes: form.notes,
    };
    setData((prev) => ({
      ...prev,
      appointments: [...prev.appointments, appt],
      patients: prev.patients.map((p) =>
        p.id === form.patientId ? { ...p, nextAppointmentDate: form.date } : p,
      ),
    }));
    return id;
  }, []);

  const updateAppointment = useCallback((id: string, patch: Partial<Appointment>) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
    }));
  }, []);

  const confirmAttendance = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status: "completed" } : a)),
    }));
  }, []);

  const markNoShow = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status: "missed" } : a)),
    }));
  }, []);

  const addSession = useCallback<DemoDataContextValue["addSession"]>((form) => {
    const id = genId("s");
    const session: RehabSession = {
      id,
      patientId: form.patientId,
      employeeId: form.employeeId,
      date: form.date,
      durationMin: form.durationMin,
      type: form.type,
      notes: form.notes,
      attendance: form.attendance,
      completedExerciseIds: form.completedExerciseIds,
      goalProgressUpdates: form.goalProgressUpdates,
      nextRecommendations: form.nextRecommendations,
      followUpDate: form.followUpDate,
      status: form.status,
    };

    setData((prev) => {
      const newPatients = prev.patients.map((p) => {
        if (p.id !== form.patientId) return p;
        if (form.status !== "completed") return p;
        let newProgress = p.progress;
        if (form.goalProgressUpdates.length > 0) {
          const plans = prev.treatmentPlans.filter((tp) => tp.patientId === form.patientId);
          if (plans.length > 0) {
            const allGoals = plans.flatMap((tp) => tp.goals);
            const totalProgress = allGoals.reduce((sum, g) => {
              const update = form.goalProgressUpdates.find((u) => u.goalId === g.id);
              return sum + (update ? update.newProgress : g.progress);
            }, 0);
            newProgress = allGoals.length > 0 ? Math.round(totalProgress / allGoals.length) : p.progress;
          }
        }
        return {
          ...p,
          progress: Math.min(100, newProgress),
          lastSessionDate: form.date,
        };
      });

      const newPlans = form.status === "completed"
        ? prev.treatmentPlans.map((tp) => {
            if (tp.patientId !== form.patientId) return tp;
            const updatedGoals = tp.goals.map((g) => {
              const update = form.goalProgressUpdates.find((u) => u.goalId === g.id);
              return update ? { ...g, progress: Math.min(100, update.newProgress) } : g;
            });
            const avgProgress = updatedGoals.length > 0
              ? Math.round(updatedGoals.reduce((s, g) => s + g.progress, 0) / updatedGoals.length)
              : tp.progress;
            return { ...tp, goals: updatedGoals, progress: avgProgress };
          })
        : prev.treatmentPlans;

      return {
        ...prev,
        sessions: [session, ...prev.sessions],
        patients: newPatients,
        treatmentPlans: newPlans,
      };
    });

    return id;
  }, []);

  const addPlan = useCallback<DemoDataContextValue["addPlan"]>((form) => {
    const id = genId("tp");
    const goals: PlanGoal[] = form.goals.map((g, i) => ({ id: genId(`tp${i}g`), text: g.text, progress: 0 }));
    const plan: TreatmentPlan = {
      id,
      patientId: form.patientId,
      employeeId: form.employeeId,
      title: form.title,
      startDate: form.startDate,
      endDate: form.endDate,
      reviewDate: form.reviewDate,
      goals,
      sessionFrequency: form.sessionFrequency,
      notes: form.notes,
      progress: 0,
      status: form.status,
    };
    setData((prev) => ({ ...prev, treatmentPlans: [...prev.treatmentPlans, plan] }));
    return id;
  }, []);

  const updatePlan = useCallback((id: string, patch: Partial<TreatmentPlan>) => {
    setData((prev) => ({
      ...prev,
      treatmentPlans: prev.treatmentPlans.map((tp) => (tp.id === id ? { ...tp, ...patch } : tp)),
    }));
  }, []);

  const addPlanGoal = useCallback((planId: string, text: string) => {
    const newGoal: PlanGoal = { id: genId("g"), text, progress: 0 };
    setData((prev) => ({
      ...prev,
      treatmentPlans: prev.treatmentPlans.map((tp) =>
        tp.id === planId ? { ...tp, goals: [...tp.goals, newGoal] } : tp,
      ),
    }));
  }, []);

  const updatePlanGoal = useCallback((planId: string, goalId: string, progress: number) => {
    setData((prev) => ({
      ...prev,
      treatmentPlans: prev.treatmentPlans.map((tp) => {
        if (tp.id !== planId) return tp;
        const goals = tp.goals.map((g) => (g.id === goalId ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g));
        const avgProgress = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0;
        return { ...tp, goals, progress: avgProgress };
      }),
    }));
  }, []);

  const changePlanStatus = useCallback((planId: string, status: TreatmentPlan["status"]) => {
    setData((prev) => ({
      ...prev,
      treatmentPlans: prev.treatmentPlans.map((tp) => (tp.id === planId ? { ...tp, status } : tp)),
    }));
  }, []);

  const addExercise = useCallback<DemoDataContextValue["addExercise"]>((exercise) => {
    const ex: Exercise = { ...exercise, id: genId("ex"), status: "active" };
    setData((prev) => ({ ...prev, exercises: [...prev.exercises, ex] }));
  }, []);

  const completeExercise = useCallback((id: string, difficultyRating?: number) => {
    setData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === id ? { ...ex, status: "completed", difficultyRating } : ex,
      ),
    }));
  }, []);

  const addDocument = useCallback<DemoDataContextValue["addDocument"]>((form) => {
    const doc: DemoDocument = {
      id: genId("d"),
      patientId: form.patientId,
      title: form.title,
      category: form.category,
      status: "received",
      uploadedAt: new Date().toISOString(),
      notes: form.notes,
    };
    setData((prev) => ({ ...prev, documents: [...prev.documents, doc] }));
  }, []);

  const updateDocument = useCallback((id: string, patch: Partial<DemoDocument>) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  }, []);

  const sendMessage = useCallback((conversationId: string, sender: ChatMessage["sender"], text: string) => {
    const msg: ChatMessage = { id: genId("m"), sender, text, timestamp: new Date().toISOString() };
    setData((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, msg] } : c,
      ),
    }));
  }, []);

  const sendCompanionMessage = useCallback((text: string, sender: "user" | "companion") => {
    const msg: CompanionMessage = { id: genId("cm"), sender, text, timestamp: new Date().toISOString() };
    setData((prev) => ({ ...prev, companionMessages: [...prev.companionMessages, msg] }));
  }, []);

  const value = useMemo<DemoDataContextValue>(
    () => ({
      data,
      addRequest,
      approveRequest,
      rejectRequest,
      requestInfo,
      forwardToManager,
      updateRequestContact,
      markNotificationRead,
      markAllNotificationsRead,
      resetDemoData,
      addAppointment,
      updateAppointment,
      cancelAppointment,
      confirmAttendance,
      markNoShow,
      addSession,
      addPlan,
      updatePlan,
      addPlanGoal,
      updatePlanGoal,
      changePlanStatus,
      addExercise,
      completeExercise,
      addDocument,
      updateDocument,
      sendMessage,
      sendCompanionMessage,
      addNotification,
    }),
    [data, addRequest, approveRequest, rejectRequest, requestInfo, forwardToManager, updateRequestContact, markNotificationRead, markAllNotificationsRead, resetDemoData, addAppointment, updateAppointment, cancelAppointment, confirmAttendance, markNoShow, addSession, addPlan, updatePlan, addPlanGoal, updatePlanGoal, changePlanStatus, addExercise, completeExercise, addDocument, updateDocument, sendMessage, sendCompanionMessage, addNotification],
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData(): DemoDataContextValue {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
