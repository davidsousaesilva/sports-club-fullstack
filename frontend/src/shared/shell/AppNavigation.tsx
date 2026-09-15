import { NavLink } from "react-router";
import {
  CalendarDays,
  CircleUserRound,
  ClipboardCheck,
  Dumbbell,
  Euro,
  FileBarChart2,
  Flag,
  Home,
  Settings,
  Shield,
  Trophy,
  UserRound,
  Users,
  Waves,
} from "lucide-react";

import type { NavigationIconKey, NavigationItem } from "../hooks/navigation";
import { cn } from "../../lib/utils/cn";

const navigationIcons: Record<NavigationIconKey, typeof Home> = {
  dashboard: Home,
  people: Users,
  modalities: Waves,
  teams: UserRound,
  training: Dumbbell,
  selfGuidedTraining: ClipboardCheck,
  competition: Trophy,
  event: Flag,
  calendar: CalendarDays,
  finance: Euro,
  sportsReport: FileBarChart2,
  financeReport: Shield,
  clubSettings: Settings,
  notification: CircleUserRound,
  profile: CircleUserRound,
};

type AppNavigationProps = {
  items: NavigationItem[];
};

function AppNavigation({ items }: AppNavigationProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-4 py-6">
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = navigationIcons[item.iconKey];

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition",
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { AppNavigation };
