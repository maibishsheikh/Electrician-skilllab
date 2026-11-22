import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

export interface LearningOutcome {
  id: number;
  title: string;
  titleHi: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  score?: number;
  xpEarned: number;
}

export interface LabAttempt {
  labId: string;
  score: number;
  completedAt: string;
  hintsUsed: number;
  timeSpent: number;
}

interface AppState {
  // User
  userName: string;
  setUserName: (name: string) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Language
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Gamification
  xp: number;
  level: number;
  streak: number;
  rank: string;
  rankHi: string;
  addXP: (amount: number) => void;
  badges: Badge[];
  earnBadge: (badgeId: string) => void;

  // Progress
  completedLessons: string[];
  completeLesson: (lessonId: string) => void;
  labAttempts: LabAttempt[];
  addLabAttempt: (attempt: LabAttempt) => void;
  completedQuizzes: string[];
  completeQuiz: (quizId: string) => void;

  // Learning Outcomes
  outcomes: LearningOutcome[];
  updateOutcomeStatus: (id: number, status: LearningOutcome['status']) => void;
}

const RANKS = [
  { minXP: 0, name: 'Apprentice', nameHi: 'अपरेंटिस' },
  { minXP: 500, name: 'Junior Electrician', nameHi: 'जूनियर इलेक्ट्रीशियन' },
  { minXP: 1500, name: 'Installation Technician', nameHi: 'इंस्टॉलेशन टेक्नीशियन' },
  { minXP: 3500, name: 'Electrical Technician', nameHi: 'इलेक्ट्रिकल टेक्नीशियन' },
  { minXP: 6000, name: 'Industrial Technician', nameHi: 'इंडस्ट्रियल टेक्नीशियन' },
  { minXP: 10000, name: 'Power Systems Specialist', nameHi: 'पावर सिस्टम स्पेशलिस्ट' },
];

const DEFAULT_BADGES: Badge[] = [
  { id: 'safe_worker', name: 'Safe Workshop', nameHi: 'सुरक्षित कार्यशाला', icon: '🛡️', description: 'Complete all safety modules', earned: false },
  { id: 'circuit_builder', name: 'Circuit Builder', nameHi: 'सर्किट बिल्डर', icon: '⚡', description: 'Build 10 working circuits', earned: false },
  { id: 'ohms_master', name: 'Ohm\'s Law Master', nameHi: 'ओम नियम मास्टर', icon: '🔬', description: 'Score 90%+ on Ohm\'s law', earned: false },
  { id: 'measurement_tech', name: 'Measurement Technician', nameHi: 'मापन तकनीशियन', icon: '📏', description: 'Complete all measurement labs', earned: false },
  { id: 'wiring_planner', name: 'Wiring Planner', nameHi: 'वायरिंग प्लानर', icon: '🏠', description: 'Complete domestic wiring lab', earned: false },
  { id: 'troubleshooter', name: 'Troubleshooter', nameHi: 'समस्या निवारक', icon: '🔍', description: 'Diagnose 5 faults correctly', earned: false },
  { id: 'transformer_expert', name: 'Transformer Expert', nameHi: 'ट्रांसफॉर्मर विशेषज्ञ', icon: '🔄', description: 'Complete transformer lab', earned: false },
  { id: 'quiz_champion', name: 'Quiz Champion', nameHi: 'क्विज़ चैंपियन', icon: '🏆', description: 'Score 100% on any quiz', earned: false },
  { id: 'streak_7', name: '7-Day Streak', nameHi: '7-दिन की लय', icon: '🔥', description: 'Practice for 7 days in a row', earned: false },
  { id: 'first_lab', name: 'First Lab', nameHi: 'पहली प्रयोगशाला', icon: '🧪', description: 'Complete your first lab', earned: false },
];

const DEFAULT_OUTCOMES: LearningOutcome[] = [
  // Year 1
  { id: 1, title: 'Workshop Readiness & Safety', titleHi: 'कार्यशाला तैयारी एवं सुरक्षा', status: 'available', xpEarned: 0 },
  { id: 2, title: 'Wire Joints & Cable Testing', titleHi: 'तार जोड़ एवं केबल परीक्षण', status: 'available', xpEarned: 0 },
  { id: 3, title: 'Electrical & Magnetic Circuits', titleHi: 'विद्युत एवं चुंबकीय सर्किट', status: 'available', xpEarned: 0 },
  { id: 4, title: 'Batteries & Solar Cells', titleHi: 'बैटरी एवं सोलर सेल', status: 'locked', xpEarned: 0 },
  { id: 5, title: 'Wiring Systems', titleHi: 'वायरिंग सिस्टम', status: 'locked', xpEarned: 0 },
  { id: 6, title: 'Earthing Installation', titleHi: 'अर्थिंग इंस्टॉलेशन', status: 'locked', xpEarned: 0 },
  { id: 7, title: 'Electrical Illumination', titleHi: 'विद्युत प्रकाश व्यवस्था', status: 'locked', xpEarned: 0 },
  { id: 8, title: 'Measuring Instruments', titleHi: 'मापक यंत्र', status: 'locked', xpEarned: 0 },
  { id: 9, title: 'Instrument Calibration', titleHi: 'यंत्र अंशांकन', status: 'locked', xpEarned: 0 },
  { id: 10, title: 'Domestic Appliances', titleHi: 'घरेलू उपकरण', status: 'locked', xpEarned: 0 },
  { id: 11, title: 'Transformers', titleHi: 'ट्रांसफॉर्मर', status: 'locked', xpEarned: 0 },
  { id: 12, title: 'Engineering Drawing', titleHi: 'इंजीनियरिंग ड्राइंग', status: 'locked', xpEarned: 0 },
  { id: 13, title: 'Workshop Calculation & Science', titleHi: 'कार्यशाला गणना एवं विज्ञान', status: 'locked', xpEarned: 0 },
  // Year 2
  { id: 14, title: 'DC Machine Commissioning', titleHi: 'DC मशीन कमीशनिंग', status: 'locked', xpEarned: 0 },
  { id: 15, title: 'DC Machine Maintenance', titleHi: 'DC मशीन रखरखाव', status: 'locked', xpEarned: 0 },
  { id: 16, title: 'AC Motor Performance', titleHi: 'AC मोटर प्रदर्शन', status: 'locked', xpEarned: 0 },
  { id: 17, title: 'AC Motor Maintenance', titleHi: 'AC मोटर रखरखाव', status: 'locked', xpEarned: 0 },
  { id: 18, title: 'Alternator & MG Set', titleHi: 'अल्टरनेटर एवं MG सेट', status: 'locked', xpEarned: 0 },
  { id: 19, title: 'Parallel Operation', titleHi: 'समानांतर संचालन', status: 'locked', xpEarned: 0 },
  { id: 20, title: 'Motor Winding', titleHi: 'मोटर वाइंडिंग', status: 'locked', xpEarned: 0 },
  { id: 21, title: 'Electronics', titleHi: 'इलेक्ट्रॉनिक्स', status: 'locked', xpEarned: 0 },
  { id: 22, title: 'Control Cabinets', titleHi: 'कंट्रोल कैबिनेट', status: 'locked', xpEarned: 0 },
  { id: 23, title: 'AC/DC Speed Control', titleHi: 'AC/DC स्पीड कंट्रोल', status: 'locked', xpEarned: 0 },
  { id: 24, title: 'Inverter, UPS & Charger', titleHi: 'इन्वर्टर, UPS एवं चार्जर', status: 'locked', xpEarned: 0 },
  { id: 25, title: 'Solar Installation', titleHi: 'सोलर इंस्टॉलेशन', status: 'locked', xpEarned: 0 },
  { id: 26, title: 'Power Distribution', titleHi: 'विद्युत वितरण', status: 'locked', xpEarned: 0 },
  { id: 27, title: 'Relays & Circuit Breakers', titleHi: 'रिले एवं सर्किट ब्रेकर', status: 'locked', xpEarned: 0 },
  { id: 28, title: 'EV Charging Stations', titleHi: 'EV चार्जिंग स्टेशन', status: 'locked', xpEarned: 0 },
  { id: 29, title: 'Engineering Drawing (Y2)', titleHi: 'इंजीनियरिंग ड्राइंग (वर्ष 2)', status: 'locked', xpEarned: 0 },
  { id: 30, title: 'Workshop Calc & Science (Y2)', titleHi: 'कार्यशाला गणना एवं विज्ञान (वर्ष 2)', status: 'locked', xpEarned: 0 },
];

function getRank(xp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r;
  }
  return rank;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      userName: 'Trainee',
      setUserName: (name) => set({ userName: name }),

      // Theme
      theme: 'light',
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { theme: next };
        }),

      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Gamification
      xp: 0,
      level: 1,
      streak: 0,
      rank: 'Apprentice',
      rankHi: 'अपरेंटिस',
      addXP: (amount) =>
        set((s) => {
          const newXP = s.xp + amount;
          const newLevel = Math.floor(newXP / 200) + 1;
          const r = getRank(newXP);
          return { xp: newXP, level: newLevel, rank: r.name, rankHi: r.nameHi };
        }),
      badges: DEFAULT_BADGES,
      earnBadge: (badgeId) =>
        set((s) => ({
          badges: s.badges.map((b) =>
            b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
          ),
        })),

      // Progress
      completedLessons: [],
      completeLesson: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),
      labAttempts: [],
      addLabAttempt: (attempt) =>
        set((s) => ({ labAttempts: [...s.labAttempts, attempt] })),
      completedQuizzes: [],
      completeQuiz: (quizId) =>
        set((s) => ({
          completedQuizzes: s.completedQuizzes.includes(quizId)
            ? s.completedQuizzes
            : [...s.completedQuizzes, quizId],
        })),

      // Learning Outcomes
      outcomes: DEFAULT_OUTCOMES,
      updateOutcomeStatus: (id, status) =>
        set((s) => ({
          outcomes: s.outcomes.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    {
      name: 'electrician-skilllab-storage',
    }
  )
);
