import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

const RANK_THRESHOLDS = [
  { min: 0, name: 'Apprentice', nameHi: 'शिक्षु', icon: '🔧', color: 'from-slate-400 to-slate-500' },
  { min: 500, name: 'Junior Electrician', nameHi: 'जूनियर इलेक्ट्रीशियन', icon: '⚡', color: 'from-blue-400 to-blue-500' },
  { min: 1500, name: 'Electrician', nameHi: 'इलेक्ट्रीशियन', icon: '💡', color: 'from-green-400 to-green-500' },
  { min: 3500, name: 'Senior Electrician', nameHi: 'सीनियर इलेक्ट्रीशियन', icon: '🌟', color: 'from-amber-400 to-amber-500' },
  { min: 6000, name: 'Master Electrician', nameHi: 'मास्टर इलेक्ट्रीशियन', icon: '🏆', color: 'from-purple-400 to-purple-500' },
  { min: 10000, name: 'Power Systems Specialist', nameHi: 'पावर सिस्टम विशेषज्ञ', icon: '👑', color: 'from-yellow-400 to-orange-500' },
];

export default function Progress() {
  const { t } = useTranslation();
  const {
    xp, level, streak, rank, rankHi, language,
    outcomes, completedLessons, labAttempts, completedQuizzes, badges,
  } = useAppStore();

  const completedOutcomes = outcomes.filter((o) => o.status === 'completed').length;
  const inProgressOutcomes = outcomes.filter((o) => o.status === 'in_progress').length;
  const earnedBadges = badges.filter((b) => b.earned).length;

  const currentRankIdx = RANK_THRESHOLDS.findIndex((r, i) => {
    const next = RANK_THRESHOLDS[i + 1];
    return !next || xp < next.min;
  });
  const currentRank = RANK_THRESHOLDS[currentRankIdx];
  const nextRank = RANK_THRESHOLDS[currentRankIdx + 1];
  const progressToNext = nextRank
    ? ((xp - currentRank.min) / (nextRank.min - currentRank.min)) * 100
    : 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.progress')}</h1>
        <p className="text-sm text-slate-500">{language === 'hi' ? 'अपनी प्रगति ट्रैक करें' : 'Track your learning journey'}</p>
      </div>

      {/* Rank Card */}
      <div className={`card p-6 bg-gradient-to-r ${currentRank.color} text-white border-0`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">{language === 'hi' ? 'वर्तमान रैंक' : 'Current Rank'}</p>
            <h2 className="text-2xl font-bold mt-1">{currentRank.icon} {language === 'hi' ? currentRank.nameHi : currentRank.name}</h2>
            <p className="text-sm mt-2 opacity-90">Level {level} • {xp} XP</p>
          </div>
          <div className="text-6xl opacity-30">{currentRank.icon}</div>
        </div>
        {nextRank && (
          <div className="mt-4">
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>{language === 'hi' ? 'अगली रैंक तक' : 'Next rank'}: {language === 'hi' ? nextRank.nameHi : nextRank.name}</span>
              <span>{nextRank.min - xp} XP {language === 'hi' ? 'शेष' : 'to go'}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="h-2 bg-white rounded-full transition-all" style={{ width: `${progressToNext}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-brand-600">{completedOutcomes}</p>
          <p className="text-xs text-slate-500 mt-1">{t('modules.outcomes')}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{completedLessons.length}</p>
          <p className="text-xs text-slate-500 mt-1">{language === 'hi' ? 'पूर्ण पाठ' : 'Lessons Done'}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{labAttempts.length}</p>
          <p className="text-xs text-slate-500 mt-1">{language === 'hi' ? 'लैब प्रयास' : 'Lab Attempts'}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{streak}</p>
          <p className="text-xs text-slate-500 mt-1">{language === 'hi' ? 'दिन की स्ट्रीक' : 'Day Streak'} 🔥</p>
        </div>
      </div>

      {/* Rank Progression */}
      <div className="card p-5">
        <h2 className="font-semibold text-lg mb-4">{language === 'hi' ? 'करियर पथ' : 'Career Path'}</h2>
        <div className="space-y-3">
          {RANK_THRESHOLDS.map((r, i) => {
            const isAchieved = xp >= r.min;
            const isCurrent = i === currentRankIdx;
            return (
              <div key={r.min} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isCurrent ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700' :
                isAchieved ? 'opacity-100' : 'opacity-40'
              }`}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${r.color} flex items-center justify-center text-lg ${
                  !isAchieved ? 'grayscale' : ''
                }`}>
                  {r.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{language === 'hi' ? r.nameHi : r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.min} XP</p>
                </div>
                {isAchieved && <span className="text-green-500 text-sm">✓</span>}
                {isCurrent && (
                  <span className="text-[10px] font-medium bg-brand-100 dark:bg-brand-900/40 text-brand-600 px-2 py-0.5 rounded-full">
                    {language === 'hi' ? 'वर्तमान' : 'Current'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="card p-5">
        <h2 className="font-semibold text-lg mb-4">
          🏅 {t('badges.title')} ({earnedBadges}/{badges.length})
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                badge.earned
                  ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-surface-dark-2 border-slate-200 dark:border-slate-700 opacity-50'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-medium text-sm">{language === 'hi' ? badge.nameHi : badge.name}</p>
                <p className="text-[10px] text-slate-500">{badge.description}</p>
                {badge.earned && <p className="text-[10px] text-green-600 mt-0.5">✓ Earned</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
