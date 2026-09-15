const roles = ["MANAGER", "EMPLOYEE", "COACH", "ATHLETE"] as const;

type Role = (typeof roles)[number];

const roleLabels: Record<Role, string> = {
  MANAGER: "Gerente",
  EMPLOYEE: "Colaborador",
  COACH: "Treinador",
  ATHLETE: "Atleta",
};

const roleColorClasses: Record<Role, string> = {
  MANAGER: "bg-violet-500",
  EMPLOYEE: "bg-emerald-500",
  COACH: "bg-blue-500",
  ATHLETE: "bg-orange-500",
};

const roleBadgeClasses: Record<Role, string> = {
  MANAGER: "bg-violet-100 text-violet-700",
  EMPLOYEE: "bg-emerald-100 text-emerald-700",
  COACH: "bg-blue-100 text-blue-700",
  ATHLETE: "bg-orange-100 text-orange-700",
};

export { roles, roleLabels, roleColorClasses, roleBadgeClasses };
export type { Role };
