export type EmployeeRole =
  | "employee"
  | "manager"
  | "partner"
  | "admin";

// TODO: Expand these types when the employee portal is implemented.
// Planned future usage:
// - role-based guards for portal routes
// - dashboard personalization
// - document access scopes
// - attendance and task visibility rules

export type PortalModuleKey =
  | "dashboard"
  | "documents"
  | "notices"
  | "attendance"
  | "tasks";
