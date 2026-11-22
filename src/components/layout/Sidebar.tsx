import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const navItems = [
  { path: '/', icon: '📊', key: 'nav.home' },
  { path: '/modules', icon: '📚', key: 'nav.modules' },
  { path: '/labs', icon: '🔬', key: 'nav.labs' },
  { path: '/missions', icon: '🎯', key: 'nav.missions' },
  { path: '/assessments', icon: '📝', key: 'nav.quiz' },
  { path: '/progress', icon: '📈', key: 'nav.progress' },
  { path: '/glossary', icon: '📖', key: 'nav.glossary' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen, setSidebarOpen, xp, rank, rankHi, language, level } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-white dark:bg-surface-dark-1 border-r border-slate-200 dark:border-slate-700/50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white flex-shrink-0">
            <ZapIcon />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                SkillLab
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Electrician Trade
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive ? 'nav-item-active' : 'nav-item'
              }
              end={item.path === '/'}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{t(item.key)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Rank Card */}
        {sidebarOpen && (
          <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-950/50 dark:to-blue-950/50 border border-brand-200 dark:border-brand-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Level {level}
                </p>
                <p className="font-semibold text-sm text-brand-700 dark:text-brand-300">
                  {language === 'hi' ? rankHi : rank}
                </p>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-gradient-to-r from-brand-400 to-brand-600"
                style={{ width: `${(xp % 200) / 2}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {xp} XP — {200 - (xp % 200)} to next level
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
