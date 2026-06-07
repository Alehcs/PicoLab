import { NavLink } from 'react-router-dom';
import { footerSidebarRoutes, primarySidebarRoutes } from '../../app/routes';
import { PicoMascot } from '../pico/PicoMascot';

type SidebarProps = {
  compact?: boolean;
};

export function Sidebar({ compact = false }: SidebarProps) {
  return (
    <aside className={compact ? 'bg-white' : 'p-sidebar hidden flex-col md:flex'} aria-label="Primary">
      <NavLink to="/" className="flex items-center gap-2.5 px-2.5 pb-4 pt-1 no-underline">
        <PicoMascot size={34} />
        <div>
          <div className="text-[15px] font-extrabold leading-none tracking-[-0.02em] text-pico-text">
            PicoLab
          </div>
          <div className="mt-1 text-[10px] font-medium tracking-[0.04em] text-pico-muted">
            Visual STEM coach
          </div>
        </div>
      </NavLink>

      <div className="p-divider" />

      <nav className="mt-1.5 flex flex-1 flex-col gap-0.5">
        {primarySidebarRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === '/'}
            className={({ isActive }) => `p-nav${isActive ? ' active' : ''}`}
          >
            <route.icon size={16} />
            {route.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-divider mt-auto" />
      {footerSidebarRoutes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={({ isActive }) => `p-nav mt-1${isActive ? ' active' : ''}`}
        >
          <route.icon size={16} />
          {route.label}
        </NavLink>
      ))}

      <div className="mt-3.5 rounded-xl bg-pico-softYellow px-3 py-2.5 text-xs leading-relaxed text-[#886018]">
        <span className="font-bold">Pico's tip:</span> Mistakes are the most useful data in learning.
      </div>
    </aside>
  );
}
