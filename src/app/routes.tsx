import type { ReactNode } from 'react';
import {
  BookOpen,
  FlaskConical,
  Home,
  type LucideIcon,
  Map,
  Plus,
  Route,
  Settings,
  Target,
  User,
} from 'lucide-react';
import { AddProblemPage } from '../pages/AddProblemPage';
import { GrowthMapPage } from '../pages/GrowthMapPage';
import { GrowthPathPage } from '../pages/GrowthPathPage';
import { HomePage } from '../pages/HomePage';
import { PracticeMissionsPage } from '../pages/PracticeMissionsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ScanConfirmPage } from '../pages/ScanConfirmPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SmartNotebookPage } from '../pages/SmartNotebookPage';
import { VisualLabPage } from '../pages/VisualLabPage';

export type AppRoute = {
  path: string;
  label: string;
  icon: LucideIcon;
  element: ReactNode;
  sidebar?: boolean;
  footer?: boolean;
};

export const appRoutes: AppRoute[] = [
  { path: '/', label: 'Home', icon: Home, element: <HomePage /> },
  { path: '/add-problem', label: 'Add Problem', icon: Plus, element: <AddProblemPage /> },
  {
    path: '/scan-confirm',
    label: 'Scan & Confirm',
    icon: Plus,
    element: <ScanConfirmPage />,
    sidebar: false,
  },
  {
    path: '/smart-notebook',
    label: 'Smart Notebook',
    icon: BookOpen,
    element: <SmartNotebookPage />,
  },
  { path: '/visual-lab', label: 'Visual Lab', icon: FlaskConical, element: <VisualLabPage /> },
  { path: '/growth-map', label: 'Growth Map', icon: Map, element: <GrowthMapPage /> },
  { path: '/growth-path', label: 'Roadmap', icon: Route, element: <GrowthPathPage /> },
  {
    path: '/practice-missions',
    label: 'Practice Missions',
    icon: Target,
    element: <PracticeMissionsPage />,
  },
  { path: '/profile', label: 'Profile', icon: User, element: <ProfilePage /> },
  { path: '/settings', label: 'Settings', icon: Settings, element: <SettingsPage />, footer: true },
];

export const primarySidebarRoutes = appRoutes.filter((route) => route.sidebar !== false && !route.footer);
export const footerSidebarRoutes = appRoutes.filter((route) => route.sidebar !== false && route.footer);
