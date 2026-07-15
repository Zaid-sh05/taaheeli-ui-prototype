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
} from "@/types/demo";
import { generateSeedData, SEED_VERSION } from "@/data/seed";

const STORAGE_KEY = "taaheeli-demo-data";

interface DemoDataContextValue {
  data: DemoData;
  addRequest: (form: {
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
  }) => string;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, note?: string) => void;
  requestInfo: (id: string, note?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const DemoDataContext = createContext<DemoDataContextValue | undefined>(undefined);

function loadData(): DemoData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoData;
      if (parsed.version === SEED_VERSION) return parsed;
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
    };
    setData((prev) => ({
      ...prev,
      requests: [request, ...prev.requests],
      notifications: [notification, ...prev.notifications],
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

  const markNotificationRead = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    const seed = generateSeedData();
    setData(seed);
  }, []);

  const value = useMemo<DemoDataContextValue>(
    () => ({
      data,
      addRequest,
      approveRequest,
      rejectRequest,
      requestInfo,
      markNotificationRead,
      markAllNotificationsRead,
      resetDemoData,
    }),
    [data, addRequest, approveRequest, rejectRequest, requestInfo, markNotificationRead, markAllNotificationsRead, resetDemoData],
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData(): DemoDataContextValue {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
