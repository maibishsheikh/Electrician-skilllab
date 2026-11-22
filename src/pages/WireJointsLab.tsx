import { useState } from 'react';
import { useAppStore } from '@/context/store';
import {
  Cable, Minus, Split, Link2, FlaskConical, ClipboardList, Target, BarChart3,
  ListChecks, Check, Search, Plug, ShieldCheck, Circle, Globe, Palette,
  PartyPopper, GraduationCap, RotateCcw, X, type LucideIcon,
} from 'lucide-react';
import { THEMES, withAlpha } from '@/components/simulations/theme';

type JointType = 'straight' | 'tee' | 'western' | 'married';
const TH = THEMES.cable;
const JOINT_ICONS: Record<JointType, LucideIcon> = { straight: Minus, tee: Split, western: Link2, married: Cable };

interface JointStep {
  en: string;
  hi: string;
}

interface JointInfo {
  name: { en: string; hi: string };
  icon: string;
  description: { en: string; hi: string };
  use: { en: string; hi: string };
  strength: number; // 1-5
  difficulty: number; // 1-5
  steps: JointStep[];
  testCriteria: { en: string; hi: string }[];
}

const JOINT_DATA: Record<JointType, JointInfo> = {
  straight: {
    name: { en: 'Straight Joint (In-line Splice)', hi: 'सीधा जोड़ (इन-लाइन स्प्लाइस)' },
    icon: '➖',
    description: {
      en: 'Used to extend wire length by joining two wires end-to-end. The simplest and most common joint.',
      hi: 'दो तारों को छोर से छोर तक जोड़कर तार की लंबाई बढ़ाने के लिए उपयोग किया जाता है। सबसे सरल और सबसे आम जोड़।',
    },
    use: { en: 'Extending wire runs, repair splices', hi: 'तार रन बढ़ाना, मरम्मत स्प्लाइस' },
    strength: 3,
    difficulty: 2,
    steps: [
      { en: 'Strip 50mm insulation from both wire ends', hi: 'दोनों तार के सिरों से 50mm इन्सुलेशन उतारें' },
      { en: 'Clean the bare copper with emery paper', hi: 'एमरी पेपर से नंगे तांबे को साफ करें' },
      { en: 'Cross the stripped ends at right angles', hi: 'उतारे गए सिरों को समकोण पर क्रॉस करें' },
      { en: 'Twist one wire tightly around the other (5-6 turns)', hi: 'एक तार को दूसरे के चारों ओर कसकर मोड़ें (5-6 मोड़)' },
      { en: 'Twist the second wire around the first (5-6 turns)', hi: 'दूसरे तार को पहले के चारों ओर मोड़ें (5-6 मोड़)' },
      { en: 'Solder the joint for better conductivity', hi: 'बेहतर चालकता के लिए जोड़ को सोल्डर करें' },
      { en: 'Apply insulation tape — minimum 3 layers, half-overlap', hi: 'इन्सुलेशन टेप लगाएं — न्यूनतम 3 परतें, आधी ओवरलैप' },
    ],
    testCriteria: [
      { en: 'Joint resistance < 10% of equivalent wire length', hi: 'जोड़ प्रतिरोध < समतुल्य तार लंबाई का 10%' },
      { en: 'No sharp wire ends protruding', hi: 'कोई नुकीले तार सिरे बाहर न निकलें' },
      { en: 'Insulation complete with no bare copper visible', hi: 'इन्सुलेशन पूर्ण और कोई नंगा तांबा दिखाई न दे' },
      { en: 'Mechanical pull test — joint must hold under moderate tension', hi: 'मैकेनिकल पुल टेस्ट — मध्यम तनाव में जोड़ टिकना चाहिए' },
    ],
  },
  tee: {
    name: { en: 'T-Joint (Tee Splice)', hi: 'T-जोड़ (टी स्प्लाइस)' },
    icon: '🔀',
    description: {
      en: 'Used to connect a branch wire at right angles to a continuous run wire without cutting the main wire.',
      hi: 'मुख्य तार को काटे बिना एक शाखा तार को निरंतर रन तार से समकोण पर जोड़ने के लिए उपयोग किया जाता है।',
    },
    use: { en: 'Branch connections, junction boxes, distribution boards', hi: 'शाखा कनेक्शन, जंक्शन बॉक्स, वितरण बोर्ड' },
    strength: 3,
    difficulty: 3,
    steps: [
      { en: 'Strip 50mm insulation from the branch wire end', hi: 'शाखा तार के सिरे से 50mm इन्सुलेशन उतारें' },
      { en: 'Strip 30mm insulation from the main wire (without cutting it)', hi: 'मुख्य तार से 30mm इन्सुलेशन उतारें (बिना काटे)' },
      { en: 'Wrap the branch wire around the main wire at 90 degrees', hi: 'शाखा तार को मुख्य तार के चारों ओर 90 डिग्री पर लपेटें' },
      { en: 'Make 6-8 tight turns around the main wire', hi: 'मुख्य तार के चारों ओर 6-8 कसे हुए मोड़ बनाएं' },
      { en: 'Cut off excess wire and press the end flat', hi: 'अतिरिक्त तार काटें और सिरे को सपाट दबाएं' },
      { en: 'Solder the joint thoroughly', hi: 'जोड़ को अच्छी तरह सोल्डर करें' },
      { en: 'Insulate with tape — extend insulation 10mm beyond stripped area', hi: 'टेप से इन्सुलेट करें — उतारे गए क्षेत्र से 10mm आगे इन्सुलेशन बढ़ाएं' },
    ],
    testCriteria: [
      { en: 'Branch wire perpendicular to main wire', hi: 'शाखा तार मुख्य तार के लंबवत हो' },
      { en: 'No damage to main wire conductor', hi: 'मुख्य तार के चालक को कोई नुकसान न हो' },
      { en: 'Tight, uniform wrapping', hi: 'कसी हुई, समान लपेट' },
    ],
  },
  western: {
    name: { en: 'Western Union Joint', hi: 'वेस्टर्न यूनियन जोड़' },
    icon: '🔗',
    description: {
      en: 'The strongest wire joint, specifically designed for overhead lines where the joint must bear the weight and tension of the wire.',
      hi: 'सबसे मजबूत तार जोड़, विशेष रूप से ओवरहेड लाइनों के लिए डिज़ाइन किया गया जहां जोड़ को तार का भार और तनाव सहना होता है।',
    },
    use: { en: 'Overhead transmission lines, outdoor wiring', hi: 'ओवरहेड ट्रांसमिशन लाइनें, बाहरी वायरिंग' },
    strength: 5,
    difficulty: 4,
    steps: [
      { en: 'Strip 100mm insulation from both wire ends', hi: 'दोनों तार के सिरों से 100mm इन्सुलेशन उतारें' },
      { en: 'Make a small hook at the end of each stripped wire', hi: 'प्रत्येक उतारे गए तार के सिरे पर एक छोटा हुक बनाएं' },
      { en: 'Interlock the two hooks firmly', hi: 'दोनों हुक को मजबूती से इंटरलॉक करें' },
      { en: 'Wind the first wire tightly around the second (8-10 turns)', hi: 'पहले तार को दूसरे के चारों ओर कसकर लपेटें (8-10 मोड़)' },
      { en: 'Wind the second wire around the first (8-10 turns)', hi: 'दूसरे तार को पहले के चारों ओर लपेटें (8-10 मोड़)' },
      { en: 'Cut excess wire and press ends flat against the main wire', hi: 'अतिरिक्त तार काटें और सिरों को मुख्य तार के सामने सपाट दबाएं' },
      { en: 'Solder thoroughly for electrical continuity', hi: 'विद्युत निरंतरता के लिए अच्छी तरह सोल्डर करें' },
      { en: 'Apply heavy-duty insulation', hi: 'हैवी-ड्यूटी इन्सुलेशन लगाएं' },
    ],
    testCriteria: [
      { en: 'Joint can withstand the full tensile load of the wire', hi: 'जोड़ तार के पूर्ण तनाव भार को सह सके' },
      { en: 'Hooks properly interlocked before winding', hi: 'लपेटने से पहले हुक ठीक से इंटरलॉक हों' },
      { en: 'Equal number of turns on both sides', hi: 'दोनों तरफ मोड़ की संख्या बराबर हो' },
      { en: 'Wire ends pressed flat — no protrusions', hi: 'तार सिरे सपाट दबे — कोई उभार नहीं' },
    ],
  },
  married: {
    name: { en: 'Married Joint (Britannia Joint)', hi: 'मैरिड जोड़ (ब्रिटानिया जोड़)' },
    icon: '💍',
    description: {
      en: 'Used to join large-diameter conductors. Uses a separate binding wire to hold the two conductors together.',
      hi: 'बड़े व्यास के चालकों को जोड़ने के लिए उपयोग किया जाता है। दो चालकों को एक साथ रखने के लिए एक अलग बाइंडिंग तार का उपयोग करता है।',
    },
    use: { en: 'Joining thick cables (>4mm²), power distribution', hi: 'मोटी केबल जोड़ना (>4mm²), विद्युत वितरण' },
    strength: 4,
    difficulty: 5,
    steps: [
      { en: 'Strip insulation from both thick conductors (100mm)', hi: 'दोनों मोटे चालकों से इन्सुलेशन उतारें (100mm)' },
      { en: 'Overlap the stripped ends side by side', hi: 'उतारे गए सिरों को बगल में ओवरलैप करें' },
      { en: 'Take a thin binding wire (16-18 SWG)', hi: 'एक पतला बाइंडिंग तार लें (16-18 SWG)' },
      { en: 'Start winding the binding wire from one end', hi: 'एक सिरे से बाइंडिंग तार लपेटना शुरू करें' },
      { en: 'Make tight, closely-spaced turns across the entire overlap', hi: 'पूरे ओवरलैप में कसे हुए, नजदीकी मोड़ बनाएं' },
      { en: 'Continue winding to the other end', hi: 'दूसरे सिरे तक लपेटना जारी रखें' },
      { en: 'Solder the entire joint thoroughly', hi: 'पूरे जोड़ को अच्छी तरह सोल्डर करें' },
      { en: 'Apply multiple layers of insulation tape', hi: 'इन्सुलेशन टेप की कई परतें लगाएं' },
    ],
    testCriteria: [
      { en: 'Binding wire covers entire overlapping area uniformly', hi: 'बाइंडिंग तार पूरे ओवरलैप क्षेत्र को समान रूप से कवर करे' },
      { en: 'No gaps between binding wire turns', hi: 'बाइंडिंग तार के मोड़ों के बीच कोई अंतराल न हो' },
      { en: 'Solder flows through all binding turns', hi: 'सोल्डर सभी बाइंडिंग मोड़ों से प्रवाहित हो' },
    ],
  },
};

const CABLE_QUIZ = [
  {
    q: { en: 'Which color code represents Earth wire in Indian standard?', hi: 'भारतीय मानक में अर्थ वायर किस रंग कोड से दर्शाया जाता है?' },
    options: [
      { en: 'Red', hi: 'लाल' },
      { en: 'Black', hi: 'काला' },
      { en: 'Green or Green-Yellow', hi: 'हरा या हरा-पीला' },
      { en: 'Blue', hi: 'नीला' },
    ],
    correct: 2,
  },
  {
    q: { en: 'What is the minimum insulation resistance per IE Rules for a 240V circuit?', hi: 'IE नियमों के अनुसार 240V सर्किट के लिए न्यूनतम इन्सुलेशन प्रतिरोध क्या है?' },
    options: [
      { en: '0.1 MΩ', hi: '0.1 MΩ' },
      { en: '0.24 MΩ', hi: '0.24 MΩ' },
      { en: '1 MΩ', hi: '1 MΩ' },
      { en: '10 MΩ', hi: '10 MΩ' },
    ],
    correct: 2,
  },
  {
    q: { en: 'XLPE cable insulation can withstand a maximum temperature of:', hi: 'XLPE केबल इन्सुलेशन अधिकतम कितने तापमान तक सह सकता है:' },
    options: [
      { en: '70°C', hi: '70°C' },
      { en: '90°C', hi: '90°C' },
      { en: '110°C', hi: '110°C' },
      { en: '150°C', hi: '150°C' },
    ],
    correct: 1,
  },
  {
    q: { en: 'Which tool is used to remove insulation from wire?', hi: 'तार से इन्सुलेशन हटाने के लिए कौन सा उपकरण उपयोग किया जाता है?' },
    options: [
      { en: 'Pliers', hi: 'प्लायर' },
      { en: 'Wire stripper', hi: 'वायर स्ट्रिपर' },
      { en: 'Screwdriver', hi: 'स्क्रूड्राइवर' },
      { en: 'Hammer', hi: 'हथौड़ा' },
    ],
    correct: 1,
  },
];

export default function WireJointsLab() {
  const { language, addXP } = useAppStore();
  const [selectedJoint, setSelectedJoint] = useState<JointType>('straight');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'joints' | 'testing' | 'quiz'>('joints');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const joint = JOINT_DATA[selectedJoint];

  const markStepComplete = (jointType: string, step: number) => {
    const key = `${jointType}-${step}`;
    if (!completedSteps.has(key)) {
      setCompletedSteps(new Set([...completedSteps, key]));
      addXP(5);
    }
  };

  const getJointProgress = (jointType: string) => {
    const steps = JOINT_DATA[jointType as JointType].steps.length;
    let done = 0;
    for (let i = 0; i < steps; i++) {
      if (completedSteps.has(`${jointType}-${i}`)) done++;
    }
    return Math.round((done / steps) * 100);
  };

  const quizScore = quizSubmitted
    ? CABLE_QUIZ.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0)
    : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-11 h-11 rounded-2xl flex-shrink-0" style={{ background: withAlpha(TH.accent, 0.15), color: TH.accent }}><Cable size={22} strokeWidth={2.2} /></span>
        <div>
          <h1 className="text-xl font-bold">{language === 'hi' ? 'वायर जोड़ एवं केबल परीक्षण' : 'Wire Joints & Cable Testing'}</h1>
          <p className="text-xs text-slate-500">{language === 'hi' ? 'विभिन्न तार जोड़ बनाना व केबल परीक्षण सीखें' : 'Make different wire joints and test cables'}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-xl">
        {([
          { key: 'joints' as const, Icon: Link2, en: 'Wire Joints', hi: 'तार जोड़' },
          { key: 'testing' as const, Icon: FlaskConical, en: 'Cable Testing', hi: 'केबल परीक्षण' },
          { key: 'quiz' as const, Icon: ClipboardList, en: 'Quiz', hi: 'क्विज़' },
        ]).map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-xs font-medium py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.key ? 'bg-white dark:bg-surface-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            style={activeTab === tab.key ? { color: TH.accent } : undefined}>
            <tab.Icon size={14} /> {language === 'hi' ? tab.hi : tab.en}
          </button>
        ))}
      </div>

      {/* Joints Tab */}
      {activeTab === 'joints' && (
        <div className="grid lg:grid-cols-[260px_1fr] gap-4">
          {/* Joint Selector */}
          <div className="space-y-2">
            {(Object.keys(JOINT_DATA) as JointType[]).map((type) => {
              const j = JOINT_DATA[type];
              const progress = getJointProgress(type);
              const JIcon = JOINT_ICONS[type];
              return (
                <button key={type} onClick={() => { setSelectedJoint(type); setCurrentStep(0); }}
                  className={`w-full text-left p-3 rounded-xl transition-all border-2 ${selectedJoint === type ? 'shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                  style={selectedJoint === type ? { borderColor: TH.accent, background: withAlpha(TH.accent, 0.08) } : undefined}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="grid place-items-center w-7 h-7 rounded-lg flex-shrink-0" style={{ background: withAlpha(TH.accent, 0.12), color: TH.accent }}><JIcon size={15} /></span>
                    <span className="font-medium text-sm">{language === 'hi' ? j.name.hi : j.name.en}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: TH.accent }} />
                    </div>
                    <span className="text-[10px] text-slate-400">{progress}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                    <span>{language === 'hi' ? 'शक्ति' : 'Strength'}</span>
                    <span className="flex gap-0.5">{Array.from({ length: 5 }, (_, k) => <span key={k} className="w-2 h-2 rounded-sm" style={{ background: k < j.strength ? TH.accent : withAlpha(TH.accent, 0.2) }} />)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Joint Detail */}
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    {(() => { const JI = JOINT_ICONS[selectedJoint]; return <JI size={18} style={{ color: TH.accent }} />; })()} {language === 'hi' ? joint.name.hi : joint.name.en}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'hi' ? joint.description.hi : joint.description.en}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mb-4 text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 inline-flex items-center gap-1.5">
                  <Target size={13} /> {language === 'hi' ? joint.use.hi : joint.use.en}
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5">
                  <BarChart3 size={13} /> {language === 'hi' ? `कठिनाई: ${joint.difficulty}/5` : `Difficulty: ${joint.difficulty}/5`}
                </div>
              </div>

              {/* Step-by-step guide */}
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <ListChecks size={15} style={{ color: TH.accent }} /> {language === 'hi' ? 'चरण-दर-चरण प्रक्रिया' : 'Step-by-Step Procedure'}
              </h3>
              <div className="space-y-2">
                {joint.steps.map((step, i) => {
                  const isComplete = completedSteps.has(`${selectedJoint}-${i}`);
                  const isCurrent = currentStep === i;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10'
                          : isComplete
                          ? 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                      onClick={() => setCurrentStep(i)}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {isComplete ? <Check size={14} /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{language === 'hi' ? step.hi : step.en}</p>
                      </div>
                      {!isComplete && isCurrent && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markStepComplete(selectedJoint, i);
                            if (i < joint.steps.length - 1) setCurrentStep(i + 1);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] px-3 py-1 rounded-lg text-white transition-colors flex-shrink-0"
                          style={{ background: TH.accent }}
                        >
                          <Check size={12} /> {language === 'hi' ? 'पूर्ण' : 'Done'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Criteria */}
            <div className="card p-4 border-l-4 border-l-amber-500">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Search size={15} className="text-amber-500" /> {language === 'hi' ? 'गुणवत्ता जांच मानदंड' : 'Quality Check Criteria'}</h3>
              <div className="space-y-1.5">
                {joint.testCriteria.map((c, i) => (
                  <p key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="text-amber-500">▸</span>
                    {language === 'hi' ? c.hi : c.en}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FlaskConical size={20} style={{ color: TH.accent }} /> {language === 'hi' ? 'केबल परीक्षण विधियां' : 'Cable Testing Methods'}</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Continuity Test */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plug size={18} style={{ color: TH.accent }} />
                  <h3 className="font-semibold text-sm">{language === 'hi' ? 'कंटिन्युइटी टेस्ट' : 'Continuity Test'}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'hi'
                    ? 'यह परीक्षण सत्यापित करता है कि तार/केबल में कोई टूट-फूट नहीं है।'
                    : 'This test verifies there are no breaks in the wire/cable.'}
                </p>
                <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-3 space-y-2 text-xs">
                  <p className="font-medium">{language === 'hi' ? 'प्रक्रिया:' : 'Procedure:'}</p>
                  <p>1. {language === 'hi' ? 'मल्टीमीटर को ओम (Ω) मोड पर सेट करें' : 'Set multimeter to Ohm (Ω) mode'}</p>
                  <p>2. {language === 'hi' ? 'केबल के एक सिरे पर प्रोब लगाएं' : 'Connect probes to cable ends'}</p>
                  <p>3. {language === 'hi' ? 'रीडिंग ~0Ω = अच्छा तार' : 'Reading ~0Ω = good wire'}</p>
                  <p>4. {language === 'hi' ? 'रीडिंग OL/∞ = टूटा हुआ तार' : 'Reading OL/∞ = broken wire'}</p>
                </div>
                <div className="mt-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-xs text-center">
                  <span className="font-mono font-bold text-green-700 dark:text-green-300">
                    {language === 'hi' ? 'अच्छा: R ≈ 0Ω | खराब: R = ∞' : 'Good: R ≈ 0Ω | Bad: R = ∞'}
                  </span>
                </div>
              </div>

              {/* Insulation Resistance Test */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} style={{ color: TH.accent }} />
                  <h3 className="font-semibold text-sm">{language === 'hi' ? 'इन्सुलेशन प्रतिरोध परीक्षण' : 'Insulation Resistance Test'}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'hi'
                    ? 'मेगर का उपयोग करके इन्सुलेशन की गुणवत्ता जांचता है।'
                    : 'Uses a megger to check insulation quality.'}
                </p>
                <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-3 space-y-2 text-xs">
                  <p className="font-medium">{language === 'hi' ? 'प्रक्रिया:' : 'Procedure:'}</p>
                  <p>1. {language === 'hi' ? 'सर्किट को डी-एनर्जाइज करें' : 'De-energize the circuit'}</p>
                  <p>2. {language === 'hi' ? 'मेगर को चालक और अर्थ के बीच जोड़ें' : 'Connect megger between conductor and earth'}</p>
                  <p>3. {language === 'hi' ? 'मेगर को 1 मिनट तक घुमाएं' : 'Crank megger for 1 minute'}</p>
                  <p>4. {language === 'hi' ? 'रीडिंग रिकॉर्ड करें' : 'Record the reading'}</p>
                </div>
                <div className="mt-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs text-center">
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                    {language === 'hi' ? 'न्यूनतम: 1 MΩ × kV रेटिंग' : 'Min: 1 MΩ × kV rating'}
                  </span>
                </div>
              </div>

              {/* Polarity Test */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex gap-0.5"><Circle size={14} fill="#ef4444" stroke="none" /><Circle size={14} fill="#3b82f6" stroke="none" /></span>
                  <h3 className="font-semibold text-sm">{language === 'hi' ? 'पोलैरिटी टेस्ट' : 'Polarity Test'}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'hi'
                    ? 'यह सुनिश्चित करता है कि स्विच फेज वायर पर लगा है, न्यूट्रल पर नहीं।'
                    : 'Ensures switches are on the phase wire, not neutral.'}
                </p>
                <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-3 text-xs">
                  <p>{language === 'hi' ? '• स्विच हमेशा फेज (लाइव) वायर पर होना चाहिए' : '• Switch must always be on phase (live) wire'}</p>
                  <p>{language === 'hi' ? '• सेंटर पिन = फेज, आउटर रिंग = न्यूट्रल (सॉकेट)' : '• Center pin = Phase, Outer ring = Neutral (socket)'}</p>
                </div>
              </div>

              {/* Earth Loop Impedance */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={18} style={{ color: TH.accent }} />
                  <h3 className="font-semibold text-sm">{language === 'hi' ? 'अर्थ लूप इम्पीडेंस' : 'Earth Loop Impedance'}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'hi'
                    ? 'फॉल्ट करंट के सही प्रवाह के लिए अर्थ पथ की जांच करता है।'
                    : 'Checks earth path is adequate for fault current flow.'}
                </p>
                <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-3 text-xs">
                  <p>{language === 'hi' ? '• कम इम्पीडेंस = फ्यूज/MCB तेजी से ट्रिप करेगा' : '• Low impedance = fuse/MCB will trip quickly'}</p>
                  <p>{language === 'hi' ? '• उच्च इम्पीडेंस = खतरनाक, MCB नहीं ट्रिप करेगा' : '• High impedance = dangerous, MCB won\'t trip'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wire Color Code Reference */}
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Palette size={15} style={{ color: TH.accent }} /> {language === 'hi' ? 'भारतीय मानक तार रंग कोड' : 'Indian Standard Wire Color Code'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { color: 'bg-red-500', wire: { en: 'Phase (L1)', hi: 'फेज (L1)' }, code: 'Red / लाल' },
                { color: 'bg-yellow-400', wire: { en: 'Phase (L2)', hi: 'फेज (L2)' }, code: 'Yellow / पीला' },
                { color: 'bg-blue-500', wire: { en: 'Phase (L3)', hi: 'फेज (L3)' }, code: 'Blue / नीला' },
                { color: 'bg-black', wire: { en: 'Neutral', hi: 'न्यूट्रल' }, code: 'Black / काला' },
              ].map((w, i) => (
                <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-center">
                  <div className={`w-8 h-8 rounded-full ${w.color} mx-auto mb-2 shadow-md`} />
                  <p className="text-xs font-medium">{language === 'hi' ? w.wire.hi : w.wire.en}</p>
                  <p className="text-[10px] text-slate-400">{w.code}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border-2 border-dashed border-green-400 p-3 text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-2 shadow-md" style={{ background: 'linear-gradient(90deg, #22c55e 50%, #eab308 50%)' }} />
              <p className="text-xs font-medium text-green-700 dark:text-green-300">{language === 'hi' ? 'अर्थ वायर' : 'Earth Wire'}</p>
              <p className="text-[10px] text-slate-400">Green-Yellow / हरा-पीला</p>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="card p-5 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><ClipboardList size={20} style={{ color: TH.accent }} /> {language === 'hi' ? 'क्विज़: तार जोड़ एवं केबल' : 'Quiz: Wire Joints & Cables'}</h2>
          {CABLE_QUIZ.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="font-medium text-sm mb-3">{qi + 1}. {language === 'hi' ? q.q.hi : q.q.en}</p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = quizAnswers[qi] === oi;
                  const isCorrect = quizSubmitted && oi === q.correct;
                  const isWrong = quizSubmitted && isSelected && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                      disabled={quizSubmitted}
                      className={`text-left text-sm px-4 py-2 rounded-lg border transition-all flex items-center ${
                        isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : isWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : isSelected ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>{language === 'hi' ? opt.hi : opt.en}
                      {isCorrect && <Check size={15} className="ml-auto text-green-600" />}{isWrong && <X size={15} className="ml-auto text-red-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!quizSubmitted ? (
            <button onClick={() => { setQuizSubmitted(true); if (quizScore >= 3) addXP(20); }} className="btn-primary inline-flex items-center gap-1.5 text-sm px-6 py-2">
              <Check size={15} /> {language === 'hi' ? 'जमा करें' : 'Submit'}
            </button>
          ) : (
            <div className={`p-4 rounded-xl text-center ${quizScore >= 3 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
              {quizScore >= 3 ? <PartyPopper className="w-7 h-7 mx-auto mb-1 text-green-500" /> : <GraduationCap className="w-7 h-7 mx-auto mb-1 text-amber-500" />}
              <p className="font-bold">{quizScore}/{CABLE_QUIZ.length} {language === 'hi' ? 'सही' : 'Correct'}</p>
              <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} className="btn-secondary inline-flex items-center gap-1.5 text-xs px-4 py-1.5 mt-2">
                <RotateCcw size={13} /> {language === 'hi' ? 'पुनः प्रयास' : 'Retry'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
