import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

export default function TopBar() {
  const { i18n } = useTranslation();
  const { theme, toggleTheme, language, setLanguage, sidebarOpen, setSidebarOpen, xp, userName } =
    useAppStore();

  const handleLangToggle = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
    i18n.changeLanguage(next);
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-surface-dark-1 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark-2 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* XP Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
          <span className="text-sm">⚡</span>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{xp} XP</span>
        </div>

        {/* Language Toggle */}
        <button
          onClick={handleLangToggle}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-surface-dark-2 hover:bg-slate-200 dark:hover:bg-surface-dark-3 transition-colors"
        >
          <span>{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
          <span>{language === 'en' ? 'हिंदी' : 'ENG'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark-2 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
