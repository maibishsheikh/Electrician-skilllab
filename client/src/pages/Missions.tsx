import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

interface Mission {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  xpReward: number;
  type: 'daily' | 'weekly' | 'challenge';
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
}

const MISSIONS: Mission[] = [
  {
    id: 'm1', title: 'First Circuit', titleHi: 'पहला सर्किट',
    description: 'Build and simulate your first DC circuit',
    descriptionHi: 'अपना पहला DC सर्किट बनाएं और सिमुलेट करें',
    xpReward: 50, type: 'daily', icon: '⚡', progress: 0, target: 1, completed: false,
  },
  {
    id: 'm2', title: 'Safety First', titleHi: 'सुरक्षा पहले',
    description: 'Find all 8 hazards in the safety workshop',
    descriptionHi: 'सुरक्षा कार्यशाला में सभी 8 खतरे खोजें',
    xpReward: 100, type: 'daily', icon: '🛡️', progress: 0, target: 8, completed: false,
  },
  {
    id: 'm3', title: 'Quiz Master', titleHi: 'क्विज़ मास्टर',
    description: 'Score 100% on any quiz',
    descriptionHi: 'किसी भी क्विज़ में 100% स्कोर करें',
    xpReward: 75, type: 'daily', icon: '📝', progress: 0, target: 1, completed: false,
  },
  {
    id: 'm4', title: 'Lab Explorer', titleHi: 'लैब एक्सप्लोरर',
    description: 'Complete 3 different virtual labs',
    descriptionHi: '3 अलग-अलग वर्चुअल लैब पूरे करें',
    xpReward: 150, type: 'weekly', icon: '🔬', progress: 0, target: 3, completed: false,
  },
  {
    id: 'm5', title: 'Week Warrior', titleHi: 'सप्ताह योद्धा',
    description: 'Maintain a 7-day learning streak',
    descriptionHi: '7 दिन की लर्निंग स्ट्रीक बनाए रखें',
    xpReward: 200, type: 'weekly', icon: '🔥', progress: 0, target: 7, completed: false,
  },
  {
    id: 'm6', title: "Ohm's Explorer", titleHi: 'ओम का अन्वेषक',
    description: 'Take 5 readings in the Ohm\'s Law lab and verify V=IR',
    descriptionHi: "ओम के नियम लैब में 5 रीडिंग लें और V=IR सत्यापित करें",
    xpReward: 100, type: 'weekly', icon: '📊', progress: 0, target: 5, completed: false,
  },
  {
    id: 'm7', title: 'Circuit Champion', titleHi: 'सर्किट चैंपियन',
    description: 'Build 5 different circuits with correct results',
    descriptionHi: 'सही परिणामों के साथ 5 अलग-अलग सर्किट बनाएं',
    xpReward: 300, type: 'challenge', icon: '🏆', progress: 0, target: 5, completed: false,
  },
  {
    id: 'm8', title: 'Master All Basics', titleHi: 'सभी मूल बातें सीखें',
    description: 'Complete all Year 1 learning outcomes',
    descriptionHi: 'वर्ष 1 के सभी शिक्षण परिणाम पूरे करें',
    xpReward: 500, type: 'challenge', icon: '🎓', progress: 0, target: 13, completed: false,
  },
];

export default function Missions() {
  const { t } = useTranslation();
  const { language, streak, labAttempts, completedQuizzes, outcomes } = useAppStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'challenge'>('daily');

  // Calculate real progress
  const missionsWithProgress = MISSIONS.map((m) => {
    let progress = m.progress;
    let completed = m.completed;
    switch (m.id) {
      case 'm2': // Safety hazards
        progress = 0; // Would come from safety store
        break;
      case 'm4': // Lab explorer
        progress = labAttempts.length;
        completed = labAttempts.length >= m.target;
        break;
      case 'm5': // Streak
        progress = streak;
        completed = streak >= m.target;
        break;
      case 'm8': // Year 1 outcomes
        progress = outcomes.filter((o) => o.id <= 13 && o.status === 'completed').length;
        completed = progress >= m.target;
        break;
    }
    return { ...m, progress: Math.min(progress, m.target), completed };
  });

  const filtered = missionsWithProgress.filter((m) => m.type === activeTab);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.missions')}</h1>
        <p className="text-sm text-slate-500">{language === 'hi' ? 'मिशन पूरा करें, XP कमाएं' : 'Complete missions, earn XP'}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-lg">
        {(['daily', 'weekly', 'challenge'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab ? 'bg-white dark:bg-surface-dark shadow text-brand-600' : 'text-slate-500'
            }`}
          >
            {tab === 'daily' && `📅 ${language === 'hi' ? 'दैनिक' : 'Daily'}`}
            {tab === 'weekly' && `📆 ${language === 'hi' ? 'साप्ताहिक' : 'Weekly'}`}
            {tab === 'challenge' && `🏆 ${language === 'hi' ? 'चुनौती' : 'Challenge'}`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((mission) => (
          <div
            key={mission.id}
            className={`card p-4 transition-all ${mission.completed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{mission.icon}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">
                      {language === 'hi' ? mission.titleHi : mission.title}
                      {mission.completed && ' ✅'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'hi' ? mission.descriptionHi : mission.description}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    +{mission.xpReward} XP
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>{language === 'hi' ? 'प्रगति' : 'Progress'}</span>
                    <span>{mission.progress}/{mission.target}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${mission.completed ? 'bg-green-500' : ''}`}
                      style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
