import { UserRole } from "./types";

export function getHomePath(role?: UserRole | null) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "driver") return "/driver";
  if (role === "parent") return "/parent";
  return "/login";
}
