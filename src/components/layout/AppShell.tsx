import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { primarySidebarRoutes } from '../../app/routes';
import { AppLogo } from '../pico/AppLogo';
import { Sidebar } from './Sidebar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="p-app">
      <Sidebar />

      <div className="p-content flex-col">
        <header className="border-b-[1.5px] border-pico-border bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2.5">
            <AppLogo size={32} />
            <div>
              <div className="text-[15px] font-extrabold leading-none tracking-[-0.02em] text-pico-text">
                PicoLab
              </div>
              <div className="mt-1 text-[10px] font-medium tracking-[0.04em] text-pico-muted">
                Visual STEM coach
              </div>
            </div>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-1" aria-label="Mobile primary">
            {primarySidebarRoutes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                end={route.path === '/'}
                className={({ isActive }) => `p-nav shrink-0${isActive ? ' active' : ''}`}
              >
                <route.icon size={15} />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="p-scroll bg-pico-bg px-5 py-7 md:px-9 md:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
