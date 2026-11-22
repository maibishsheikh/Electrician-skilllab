import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

interface Hazard {
  id: string;
  x: number;
  y: number;
  radius: number;
  found: boolean;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  severity: 'high' | 'medium' | 'low';
}

const WORKSHOP_HAZARDS: Hazard[] = [
  {
    id: 'exposed_wire', x: 15, y: 25, radius: 6,
    found: false, name: 'Exposed Live Wire', nameHi: 'खुला लाइव वायर',
    description: 'Uninsulated wire carrying current — risk of electrocution. Must be insulated or disconnected.',
    descriptionHi: 'बिना इन्सुलेशन वाला करंट वाला तार — बिजली के झटके का खतरा। इन्सुलेट या डिस्कनेक्ट करना चाहिए।',
    severity: 'high',
  },
  {
    id: 'water_spill', x: 45, y: 70, radius: 8,
    found: false, name: 'Water Near Equipment', nameHi: 'उपकरण के पास पानी',
    description: 'Water conducts electricity. Spills near electrical equipment can cause short circuits and electrocution.',
    descriptionHi: 'पानी बिजली का चालक है। विद्युत उपकरण के पास पानी गिरने से शॉर्ट सर्किट और बिजली का झटका लग सकता है।',
    severity: 'high',
  },
  {
    id: 'overloaded_socket', x: 75, y: 30, radius: 5,
    found: false, name: 'Overloaded Socket', nameHi: 'ओवरलोडेड सॉकेट',
    description: 'Too many devices in one socket. This can overheat wiring and cause fire.',
    descriptionHi: 'एक सॉकेट में बहुत अधिक उपकरण। इससे वायरिंग गर्म होकर आग लग सकती है।',
    severity: 'high',
  },
  {
    id: 'missing_earth', x: 30, y: 50, radius: 5,
    found: false, name: 'No Earthing Connection', nameHi: 'अर्थिंग कनेक्शन नहीं',
    description: 'Equipment without earthing — in case of fault, the body of the equipment can become live.',
    descriptionHi: 'बिना अर्थिंग वाला उपकरण — फॉल्ट होने पर उपकरण की बॉडी में करंट आ सकता है।',
    severity: 'high',
  },
  {
    id: 'damaged_insulation', x: 60, y: 45, radius: 5,
    found: false, name: 'Damaged Insulation', nameHi: 'क्षतिग्रस्त इन्सुलेशन',
    description: 'Cracked or melted wire insulation exposes conductor. Must be replaced immediately.',
    descriptionHi: 'फटा या पिघला हुआ तार इन्सुलेशन कंडक्टर को उजागर करता है। तुरंत बदलना चाहिए।',
    severity: 'medium',
  },
  {
    id: 'no_ppe', x: 85, y: 65, radius: 6,
    found: false, name: 'Worker Without PPE', nameHi: 'बिना PPE के कर्मचारी',
    description: 'No safety gloves, goggles, or insulated shoes. PPE is mandatory when working with electricity.',
    descriptionHi: 'सुरक्षा दस्ताने, चश्मे या इन्सुलेटेड जूते नहीं। बिजली के साथ काम करते समय PPE अनिवार्य है।',
    severity: 'medium',
  },
  {
    id: 'blocked_exit', x: 50, y: 15, radius: 5,
    found: false, name: 'Blocked Emergency Exit', nameHi: 'अवरुद्ध आपातकालीन निकास',
    description: 'Emergency exit must always remain clear and accessible.',
    descriptionHi: 'आपातकालीन निकास हमेशा साफ़ और सुलभ रहना चाहिए।',
    severity: 'medium',
  },
  {
    id: 'no_fire_ext', x: 20, y: 80, radius: 5,
    found: false, name: 'Missing Fire Extinguisher', nameHi: 'अग्निशामक यंत्र नहीं',
    description: 'CO₂ or DCP type fire extinguisher must be available near electrical panels.',
    descriptionHi: 'विद्युत पैनल के पास CO₂ या DCP प्रकार का अग्निशामक यंत्र उपलब्ध होना चाहिए।',
    severity: 'low',
  },
];

const FIRST_AID_STEPS = [
  {
    step: 1,
    title: 'Disconnect Power',
    titleHi: 'बिजली बंद करें',
    desc: 'Turn off the main switch or MCB immediately. Do NOT touch the victim while they are in contact with live wire.',
    descHi: 'तुरंत मेन स्विच या MCB बंद करें। पीड़ित को तब तक न छुएं जब तक वे लाइव वायर के संपर्क में हों।',
    icon: '⚡',
  },
  {
    step: 2,
    title: 'Separate the Victim',
    titleHi: 'पीड़ित को अलग करें',
    desc: 'Use a dry wooden stick, rubber mat, or dry cloth to separate the person from the electrical source.',
    descHi: 'व्यक्ति को विद्युत स्रोत से अलग करने के लिए सूखी लकड़ी की छड़ी, रबर मैट या सूखे कपड़े का उपयोग करें।',
    icon: '🪵',
  },
  {
    step: 3,
    title: 'Check Breathing',
    titleHi: 'सांस जांचें',
    desc: 'Check if the person is breathing. If not, begin CPR (Cardiopulmonary Resuscitation) if trained.',
    descHi: 'जांचें कि व्यक्ति सांस ले रहा है या नहीं। यदि नहीं, तो CPR (कार्डियोपल्मोनरी रिससिटेशन) शुरू करें।',
    icon: '🫁',
  },
  {
    step: 4,
    title: 'Call Emergency',
    titleHi: 'आपातकालीन कॉल करें',
    desc: 'Call 112 (India Emergency) or take the person to the nearest hospital immediately.',
    descHi: '112 (भारत आपातकालीन) पर कॉल करें या व्यक्ति को तुरंत निकटतम अस्पताल ले जाएं।',
    icon: '📞',
  },
  {
    step: 5,
    title: 'Treat Burns',
    titleHi: 'जलने का उपचार करें',
    desc: 'Cool electrical burns with clean running water. Do NOT apply ice, butter or toothpaste. Cover with sterile gauze.',
    descHi: 'विद्युत जलने को साफ बहते पानी से ठंडा करें। बर्फ, मक्खन या टूथपेस्ट न लगाएं। स्टेराइल गॉज से ढकें।',
    icon: '🩹',
  },
];

export default function SafetyWorkshop() {
  const { t } = useTranslation();
  const { language, addXP, earnBadge } = useAppStore();
  const [hazards, setHazards] = useState(WORKSHOP_HAZARDS);
  const [activeTab, setActiveTab] = useState<'identify' | 'firstaid' | 'ppe'>('identify');
  const [showHint, setShowHint] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);

  const foundCount = hazards.filter((h) => h.found).length;
  const totalCount = hazards.length;

  const handleSpotClick = (x: number, y: number) => {
    // Check if click is near any unfound hazard
    const hit = hazards.find(
      (h) => !h.found && Math.sqrt((x - h.x) ** 2 + (y - h.y) ** 2) < h.radius
    );
    if (hit) {
      setHazards((prev) => prev.map((h) => (h.id === hit.id ? { ...h, found: true } : h)));
      setSelectedHazard({ ...hit, found: true });
      addXP(15);

      if (foundCount + 1 === totalCount) {
        earnBadge('safe_worker');
        addXP(50);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t('labs.safety')}</h1>
        <p className="text-xs text-slate-500">
          {language === 'hi' ? 'विद्युत सुरक्षा प्रोटोकॉल और खतरे की पहचान' : 'Electrical safety protocols and hazard identification'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-lg">
        {(['identify', 'firstaid', 'ppe'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab ? 'bg-white dark:bg-surface-dark shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'identify' && `🔍 ${language === 'hi' ? 'खतरे खोजें' : 'Spot Hazards'}`}
            {tab === 'firstaid' && `🩹 ${language === 'hi' ? 'प्राथमिक चिकित्सा' : 'First Aid'}`}
            {tab === 'ppe' && `🦺 ${language === 'hi' ? 'PPE' : 'PPE Guide'}`}
          </button>
        ))}
      </div>

      {activeTab === 'identify' && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">
                {language === 'hi' ? 'कार्यशाला दृश्य — खतरे खोजें' : 'Workshop Scene — Find Hazards'}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                  {foundCount}/{totalCount}
                </span>
                <button onClick={() => setShowHint(!showHint)} className="btn-secondary text-[10px] px-2 py-0.5">
                  💡 {language === 'hi' ? 'संकेत' : 'Hint'}
                </button>
              </div>
            </div>

            {/* Interactive workshop scene */}
            <div
              className="relative w-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden cursor-crosshair"
              style={{ paddingBottom: '60%' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                handleSpotClick(x, y);
              }}
            >
              {/* Workshop SVG scene */}
              <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                {/* Floor */}
                <rect x="0" y="45" width="100" height="15" fill="#94a3b8" opacity="0.3" />
                {/* Back wall */}
                <rect x="0" y="0" width="100" height="45" fill="#e2e8f0" opacity="0.2" />
                {/* Workbench */}
                <rect x="5" y="35" width="40" height="2" fill="#78716c" rx="0.5" />
                <rect x="7" y="37" width="2" height="8" fill="#78716c" />
                <rect x="41" y="37" width="2" height="8" fill="#78716c" />
                {/* Electrical panel */}
                <rect x="65" y="10" width="20" height="25" fill="#475569" rx="1" />
                <rect x="67" y="12" width="16" height="21" fill="#334155" rx="0.5" />
                {/* Circuit breakers */}
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={69 + i * 4} y="14" width="2" height="6" fill="#f97316" rx="0.3" />
                ))}
                {/* Door / exit */}
                <rect x="45" y="5" width="10" height="20" fill="#64748b" rx="0.5" />
                <text x="50" y="13" fontSize="2.5" textAnchor="middle" fill="white">EXIT</text>
                {/* Tools on bench */}
                <rect x="10" y="33" width="8" height="2" fill="#f59e0b" rx="0.3" />
                <circle cx="25" cy="34" r="1.5" fill="#6366f1" />
                {/* Wires */}
                <path d="M 12 25 Q 18 20, 20 28" fill="none" stroke="#ef4444" strokeWidth="0.5" />
                <path d="M 55 40 Q 62 35, 70 42" fill="none" stroke="#22c55e" strokeWidth="0.5" />
                {/* Person figure */}
                <circle cx="85" cy="38" r="2" fill="#f59e0b" />
                <line x1="85" y1="40" x2="85" y2="47" stroke="#f59e0b" strokeWidth="0.8" />
                <line x1="85" y1="42" x2="82" y2="44" stroke="#f59e0b" strokeWidth="0.6" />
                <line x1="85" y1="42" x2="88" y2="44" stroke="#f59e0b" strokeWidth="0.6" />
                {/* Water spill */}
                <ellipse cx="45" cy="42" rx="6" ry="2" fill="#60a5fa" opacity="0.4" />
              </svg>

              {/* Hazard indicators */}
              {hazards.map((h) => (
                <div
                  key={h.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                    h.found ? 'pointer-events-none' : ''
                  }`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  {h.found ? (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                      h.severity === 'high' ? 'bg-red-500' : h.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                      ✓
                    </div>
                  ) : showHint ? (
                    <div className="w-4 h-4 rounded-full border-2 border-dashed border-red-400 animate-pulse" />
                  ) : null}
                </div>
              ))}
            </div>

            {foundCount === totalCount && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  🎉 {language === 'hi' ? 'सभी खतरे मिल गए! सुरक्षा बैज अर्जित!' : 'All hazards found! Safety badge earned!'}
                </p>
              </div>
            )}
          </div>

          {/* Found hazards list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{language === 'hi' ? 'पाए गए खतरे' : 'Found Hazards'}</h3>
            {hazards.filter((h) => h.found).length === 0 && (
              <p className="text-xs text-slate-400">
                {language === 'hi' ? 'कार्यशाला में खतरों को खोजने के लिए क्लिक करें' : 'Click on the workshop to spot hazards'}
              </p>
            )}
            {hazards
              .filter((h) => h.found)
              .map((h) => (
                <div key={h.id} className="card p-3">
                  <div className="flex items-start gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      h.severity === 'high' ? 'bg-red-100 text-red-700' : h.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {h.severity === 'high' ? '⚠️ HIGH' : h.severity === 'medium' ? '⚡ MED' : 'ℹ️ LOW'}
                    </span>
                    <div>
                      <p className="text-xs font-medium">{language === 'hi' ? h.nameHi : h.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {language === 'hi' ? h.descriptionHi : h.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'firstaid' && (
        <div className="card p-5">
          <h2 className="font-semibold text-lg mb-4">
            🩹 {language === 'hi' ? 'बिजली के झटके की प्राथमिक चिकित्सा' : 'First Aid for Electric Shock'}
          </h2>
          <div className="space-y-4">
            {FIRST_AID_STEPS.map((step) => (
              <div key={step.step} className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-surface-dark-2 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm">
                    {language === 'hi' ? `चरण ${step.step}: ${step.titleHi}` : `Step ${step.step}: ${step.title}`}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {language === 'hi' ? step.descHi : step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs font-medium text-red-700 dark:text-red-300">
              ⚠️ {language === 'hi'
                ? 'याद रखें: पहले बिजली बंद करें, फिर पीड़ित को छुएं। गीले हाथों से कभी न छुएं!'
                : 'Remember: ALWAYS disconnect power first, then touch the victim. NEVER touch with wet hands!'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'ppe' && (
        <div className="card p-5">
          <h2 className="font-semibold text-lg mb-4">
            🦺 {language === 'hi' ? 'व्यक्तिगत सुरक्षा उपकरण (PPE)' : 'Personal Protective Equipment (PPE)'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🧤', name: 'Insulated Gloves', nameHi: 'इन्सुलेटेड दस्ताने', desc: 'Rubber gloves rated for working voltage. Must be tested every 6 months.', descHi: 'कार्यकारी वोल्टेज के लिए रेटेड रबर दस्ताने। हर 6 महीने में परीक्षण जरूरी।', required: true },
              { icon: '👓', name: 'Safety Goggles', nameHi: 'सुरक्षा चश्मे', desc: 'Protect eyes from sparks and arc flash. Must meet IS 5983 standard.', descHi: 'चिंगारी और आर्क फ्लैश से आंखों की रक्षा। IS 5983 मानक पूरा करना चाहिए।', required: true },
              { icon: '👟', name: 'Insulated Shoes', nameHi: 'इन्सुलेटेड जूते', desc: 'Non-conducting rubber sole shoes prevent current path through body to ground.', descHi: 'गैर-प्रवाहकीय रबर तल के जूते शरीर से जमीन तक करंट पथ रोकते हैं।', required: true },
              { icon: '⛑️', name: 'Safety Helmet', nameHi: 'सुरक्षा हेलमेट', desc: 'Non-metallic helmet for protection from falling objects and electrical contact.', descHi: 'गिरती वस्तुओं और विद्युत संपर्क से बचाव के लिए गैर-धातु हेलमेट।', required: true },
              { icon: '🔧', name: 'Insulated Tools', nameHi: 'इन्सुलेटेड टूल्स', desc: 'Tools with insulated handles rated to 1000V for LT work.', descHi: 'LT कार्य के लिए 1000V तक रेटेड इन्सुलेटेड हैंडल वाले उपकरण।', required: true },
              { icon: '🧲', name: 'Voltage Tester', nameHi: 'वोल्टेज टेस्टर', desc: 'Always test before you touch. Verify power is OFF before working.', descHi: 'छूने से पहले हमेशा परीक्षण करें। काम करने से पहले बिजली बंद सत्यापित करें।', required: true },
            ].map((item) => (
              <div key={item.name} className="p-3 bg-slate-50 dark:bg-surface-dark-2 rounded-lg flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{language === 'hi' ? item.nameHi : item.name}</p>
                    {item.required && (
                      <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded">
                        {language === 'hi' ? 'अनिवार्य' : 'Required'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{language === 'hi' ? item.descHi : item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
