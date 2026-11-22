import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

const statusColors: Record<string, string> = {
  available: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  in_progress: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  completed: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
};

const statusIcons: Record<string, string> = {
  available: '📖',
  in_progress: '⏳',
  completed: '✅',
};

export default function Modules() {
  const { t } = useTranslation();
  const { outcomes, language } = useAppStore();

  const year1 = outcomes.filter((o) => o.id <= 13);
  const year2 = outcomes.filter((o) => o.id > 13);

  const renderOutcomes = (list: typeof outcomes, yearLabel: string) => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        📚 {yearLabel}
        <span className="text-xs font-normal text-slate-500">
          ({list.filter((o) => o.status === 'completed').length}/{list.length} {t('modules.completed')})
        </span>
      </h2>
      <div className="grid gap-3">
        {list.map((outcome) => (
          <div
            key={outcome.id}
            className="card p-4 transition-all card-hover cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-sm font-bold text-brand-700 dark:text-brand-300 flex-shrink-0">
                {outcome.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm leading-snug">
                    {language === 'hi' ? outcome.titleHi : outcome.title}
                  </h3>
                  <span
                    className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[outcome.status] || statusColors.available}`}
                  >
                    {statusIcons[outcome.status] || '📖'} {t(`modules.${outcome.status}`)}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex gap-1">
                    {['Watch', 'Read', 'Practice', 'Simulate', 'Quiz', 'Apply', 'Review'].map(
                      (stage, i) => (
                        <div
                          key={stage}
                          className={`h-1.5 flex-1 rounded-full ${
                            outcome.status === 'completed'
                              ? 'bg-green-400'
                              : i < 3 && outcome.status === 'in_progress'
                              ? 'bg-brand-400'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      )
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {language === 'hi' ? '7 चरण: देखें → पढ़ें → अभ्यास → सिमुलेट → क्विज़ → लागू → समीक्षा' : '7 stages: Watch → Read → Practice → Simulate → Quiz → Apply → Review'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.modules')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'hi'
            ? 'DGT पाठ्यक्रम के अनुसार 30 शिक्षण परिणाम — सभी अनलॉक'
            : '30 Learning Outcomes mapped to DGT Curriculum — All Unlocked'}
        </p>
      </div>

      {renderOutcomes(year1, t('modules.year1'))}
      {renderOutcomes(year2, t('modules.year2'))}
    </div>
  );
}
