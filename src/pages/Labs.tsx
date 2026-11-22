import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/context/store';

const labs = [
  {
    id: 'circuit-simulator',
    icon: '⚡',
    path: '/labs/circuit-simulator',
    titleKey: 'labs.circuitSim',
    desc: 'Build DC circuits with batteries, resistors, lamps, switches. See real-time current flow and voltage.',
    descHi: 'बैटरी, प्रतिरोधक, लैम्प, स्विच के साथ DC सर्किट बनाएं। रियल-टाइम करंट फ्लो और वोल्टेज देखें।',
    color: 'from-amber-400 to-orange-500',
    difficulty: 'Interactive',
  },
  {
    id: 'ohms-law',
    icon: '🔬',
    path: '/labs/ohms-law',
    titleKey: 'labs.ohmsLaw',
    desc: 'Verify Ohm\'s Law (V=IR) with virtual ammeter and voltmeter. Plot V-I characteristics.',
    descHi: 'वर्चुअल एमीटर और वोल्टमीटर के साथ ओम के नियम (V=IR) को सत्यापित करें। V-I विशेषताएँ प्लॉट करें।',
    color: 'from-blue-400 to-indigo-500',
    difficulty: 'Experiment',
  },
  {
    id: 'safety',
    icon: '🛡️',
    path: '/labs/safety',
    titleKey: 'labs.safety',
    desc: 'Identify electrical hazards in a workshop scene. Learn safety protocols and first aid for electric shock.',
    descHi: 'कार्यशाला दृश्य में विद्युत खतरों की पहचान करें। बिजली के झटके के लिए सुरक्षा प्रोटोकॉल और प्राथमिक चिकित्सा सीखें।',
    color: 'from-red-400 to-rose-500',
    difficulty: 'Safety',
  },
  {
    id: 'wire-joints',
    icon: '🔗',
    path: '/labs',
    titleKey: 'labs.wireJoints',
    desc: 'Practice making different types of wire joints — straight, T-joint, Western Union, and married joints.',
    descHi: 'विभिन्न प्रकार के वायर जोड़ बनाने का अभ्यास करें — सीधा, T-जोड़, वेस्टर्न यूनियन, और मैरिड जोड़।',
    color: 'from-green-400 to-emerald-500',
    difficulty: 'Hands-on',
    comingSoon: true,
  },
  {
    id: 'measurement',
    icon: '📏',
    path: '/labs',
    titleKey: 'labs.measurement',
    desc: 'Use virtual multimeter, megger, and tong tester. Learn to measure voltage, current, resistance, and insulation.',
    descHi: 'वर्चुअल मल्टीमीटर, मेगर, और टोंग टेस्टर का उपयोग करें। वोल्टेज, करंट, प्रतिरोध और इन्सुलेशन मापना सीखें।',
    color: 'from-purple-400 to-violet-500',
    difficulty: 'Measurement',
    comingSoon: true,
  },
  {
    id: 'wiring',
    icon: '🏠',
    path: '/labs',
    titleKey: 'labs.wiring',
    desc: 'Plan and wire a room — staircase wiring, godown wiring, tube light circuits, and fan regulators.',
    descHi: 'एक कमरे की वायरिंग की योजना बनाएं — सीढ़ी वायरिंग, गोदाम वायरिंग, ट्यूब लाइट सर्किट, और पंखा रेगुलेटर।',
    color: 'from-cyan-400 to-teal-500',
    difficulty: 'Wiring',
    comingSoon: true,
  },
  {
    id: 'earthing',
    icon: '🌍',
    path: '/labs',
    titleKey: 'labs.earthing',
    desc: 'Install pipe and plate earthing systems. Measure earth resistance and understand protection principles.',
    descHi: 'पाइप और प्लेट अर्थिंग सिस्टम स्थापित करें। अर्थ प्रतिरोध मापें और सुरक्षा सिद्धांतों को समझें।',
    color: 'from-yellow-500 to-amber-600',
    difficulty: 'Installation',
    comingSoon: true,
  },
  {
    id: 'transformer',
    icon: '🔄',
    path: '/labs',
    titleKey: 'labs.transformer',
    desc: 'Explore transformer principles — open circuit test, short circuit test, turns ratio, and efficiency.',
    descHi: 'ट्रांसफार्मर सिद्धांत — ओपन सर्किट टेस्ट, शॉर्ट सर्किट टेस्ट, टर्न्स रेशियो, और दक्षता।',
    color: 'from-pink-400 to-fuchsia-500',
    difficulty: 'Advanced',
    comingSoon: true,
  },
];

export default function Labs() {
  const { t } = useTranslation();
  const { language } = useAppStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.labs')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'hi'
            ? 'इंटरैक्टिव वर्चुअल लैब्स में अभ्यास करें'
            : 'Practice in interactive virtual labs'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {labs.map((lab) => {
          const CardContent = (
            <div
              className={`card overflow-hidden transition-all ${
                lab.comingSoon ? 'opacity-60' : 'card-hover'
              }`}
            >
              <div className={`h-2 bg-gradient-to-r ${lab.color}`} />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{lab.icon}</span>
                  {lab.comingSoon ? (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                      {language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {lab.difficulty}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mt-3">{t(lab.titleKey)}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {language === 'hi' ? lab.descHi : lab.desc}
                </p>
              </div>
            </div>
          );

          return lab.comingSoon ? (
            <div key={lab.id}>{CardContent}</div>
          ) : (
            <Link key={lab.id} to={lab.path}>
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
