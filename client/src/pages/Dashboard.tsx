import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/context/store';

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { xp, labAttempts, streak, rank, rankHi, language, outcomes, completedLessons, badges } = useAppStore();
  const completedOutcomes = outcomes.filter((o) => o.status === 'completed').length;
  const earnedBadges = badges.filter((b) => b.earned).length;
  const progressPercent = Math.round((completedOutcomes / 30) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="card p-6 bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-700 dark:to-brand-900 text-white border-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('dashboard.welcome')}, Trainee! 👋</h1>
            <p className="text-brand-100 mt-1 text-sm">
              {language === 'hi'
                ? 'आज कुछ नया सीखने का समय है। अपना अभ्यास जारी रखें।'
                : "Time to learn something new today. Keep up your practice."}
            </p>
          </div>
          <Link
            to="/labs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-medium text-sm transition-colors"
          >
            🔬 {t('dashboard.startLab')}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="⚡"
          label={t('dashboard.xpEarned')}
          value={xp}
          color="bg-amber-100 dark:bg-amber-900/40"
        />
        <StatCard
          icon="🧪"
          label={t('dashboard.labsCompleted')}
          value={labAttempts.length}
          color="bg-blue-100 dark:bg-blue-900/40"
        />
        <StatCard
          icon="🔥"
          label={t('dashboard.streakDays')}
          value={streak}
          color="bg-orange-100 dark:bg-orange-900/40"
        />
        <StatCard
          icon="🏅"
          label={t('dashboard.rank')}
          value={language === 'hi' ? rankHi : rank}
          color="bg-purple-100 dark:bg-purple-900/40"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <div className="md:col-span-2 card p-5">
          <h2 className="font-semibold text-lg mb-4">{t('dashboard.overallProgress')}</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-surface-dark-2"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  className="text-brand-500"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{progressPercent}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {completedOutcomes} / 30 {t('modules.outcomes')}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {completedLessons.length} lessons completed
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {earnedBadges} / {badges.length} {t('badges.title')}
              </p>
            </div>
          </div>

          {/* Year 1 & 2 progress bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{t('modules.year1')}</span>
                <span>{outcomes.filter((o) => o.id <= 13 && o.status === 'completed').length}/13</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(outcomes.filter((o) => o.id <= 13 && o.status === 'completed').length / 13) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{t('modules.year2')}</span>
                <span>{outcomes.filter((o) => o.id > 13 && o.status === 'completed').length}/17</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill bg-purple-500"
                  style={{
                    width: `${(outcomes.filter((o) => o.id > 13 && o.status === 'completed').length / 17) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h2 className="font-semibold text-lg mb-4">{t('dashboard.quickActions')}</h2>
          <div className="space-y-2">
            <Link to="/labs/circuit-simulator" className="card-hover p-3 flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-medium text-sm">{t('labs.circuitSim')}</p>
                <p className="text-xs text-slate-500">Build & simulate circuits</p>
              </div>
            </Link>
            <Link to="/labs/ohms-law" className="card-hover p-3 flex items-center gap-3">
              <span className="text-2xl">🔬</span>
              <div>
                <p className="font-medium text-sm">{t('labs.ohmsLaw')}</p>
                <p className="text-xs text-slate-500">V = IR experiment</p>
              </div>
            </Link>
            <Link to="/labs/safety" className="card-hover p-3 flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-medium text-sm">{t('labs.safety')}</p>
                <p className="text-xs text-slate-500">Hazard identification</p>
              </div>
            </Link>
            <Link to="/assessments" className="card-hover p-3 flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-medium text-sm">{t('nav.quiz')}</p>
                <p className="text-xs text-slate-500">Test your knowledge</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="card p-5">
        <h2 className="font-semibold text-lg mb-4">{t('badges.title')}</h2>
        <div className="flex flex-wrap gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                badge.earned
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-surface-dark-2 border-slate-200 dark:border-slate-700 opacity-50'
              }`}
            >
              <span className="text-xl">{badge.icon}</span>
              <div>
                <p className="text-xs font-medium">
                  {language === 'hi' ? badge.nameHi : badge.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {badge.earned ? '✓ Earned' : badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
