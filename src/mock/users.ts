import type { RoleKey } from "@/config/roles";

export interface MockUser {
  id: string;
  fullName: string;
  username: string;
  role: RoleKey;
  status: "active" | "pending";
  email?: string;
  phone?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "u-001",
    fullName: "د. منى عبد الله",
    username: "manager",
    role: "manager",
    status: "active",
    email: "manager@taaheeli.example",
  },
  {
    id: "u-002",
    fullName: "د. خالد الشمري",
    username: "doctor",
    role: "doctor",
    status: "active",
  },
  {
    id: "u-003",
    fullName: "سارة المطيري",
    username: "admin",
    role: "admin",
    status: "active",
    phone: "0500000000",
  },
  {
    id: "u-004",
    fullName: "أم محمد",
    username: "parent",
    role: "parent",
    status: "active",
  },
  {
    id: "u-005",
    fullName: "محمد العتيبي",
    username: "patient",
    role: "patient",
    status: "active",
  },
  {
    id: "u-006",
    fullName: "نورة القحطاني",
    username: "noura",
    role: "patient",
    status: "pending",
  },
];

export const MOCK_PASSWORD = "123456";

export function findUser(username: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.username === username.trim().toLowerCase());
}
