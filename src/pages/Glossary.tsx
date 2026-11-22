import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

interface GlossaryTerm {
  id: string;
  term: string;
  termHi: string;
  definition: string;
  definitionHi: string;
  category: string;
  symbol?: string;
  unit?: string;
  formula?: string;
}

const GLOSSARY: GlossaryTerm[] = [
  { id: 'g01', term: 'Voltage', termHi: 'वोल्टेज (विभवांतर)', definition: 'The electrical potential difference between two points, measured in Volts (V). It is the "pressure" that pushes current through a circuit.', definitionHi: 'दो बिंदुओं के बीच विद्युत विभवांतर, वोल्ट (V) में मापा जाता है। यह वह "दबाव" है जो परिपथ में धारा को प्रवाहित करता है।', category: 'Basic', symbol: 'V', unit: 'Volt (V)' },
  { id: 'g02', term: 'Current', termHi: 'धारा (करंट)', definition: 'The flow of electric charge through a conductor, measured in Amperes (A). Conventional current flows from positive to negative.', definitionHi: 'एक चालक के माध्यम से विद्युत आवेश का प्रवाह, एम्पियर (A) में मापा जाता है। पारंपरिक धारा धनात्मक से ऋणात्मक की ओर बहती है।', category: 'Basic', symbol: 'I', unit: 'Ampere (A)' },
  { id: 'g03', term: 'Resistance', termHi: 'प्रतिरोध', definition: 'Opposition to the flow of current in a circuit, measured in Ohms (Ω). Higher resistance means less current flows.', definitionHi: 'परिपथ में धारा के प्रवाह का विरोध, ओम (Ω) में मापा जाता है। अधिक प्रतिरोध का मतलब कम धारा बहती है।', category: 'Basic', symbol: 'R', unit: 'Ohm (Ω)' },
  { id: 'g04', term: "Ohm's Law", termHi: 'ओम का नियम', definition: 'V = IR. The voltage across a conductor is directly proportional to the current flowing through it, with resistance as the constant.', definitionHi: 'V = IR। किसी चालक के सिरों पर वोल्टेज उसमें बहने वाली धारा के सीधे समानुपाती होता है, प्रतिरोध स्थिरांक है।', category: 'Laws', formula: 'V = I × R' },
  { id: 'g05', term: "Kirchhoff's Current Law (KCL)", termHi: 'किरचॉफ का धारा नियम', definition: 'The total current entering a junction equals the total current leaving it. Sum of currents at any node = 0.', definitionHi: 'किसी जंक्शन में प्रवेश करने वाली कुल धारा उससे निकलने वाली कुल धारा के बराबर होती है।', category: 'Laws', formula: 'ΣI = 0' },
  { id: 'g06', term: "Kirchhoff's Voltage Law (KVL)", termHi: 'किरचॉफ का वोल्टेज नियम', definition: 'The sum of all voltages around any closed loop in a circuit is zero.', definitionHi: 'किसी परिपथ में किसी भी बंद लूप के चारों ओर सभी वोल्टेज का योग शून्य होता है।', category: 'Laws', formula: 'ΣV = 0' },
  { id: 'g07', term: 'Series Circuit', termHi: 'श्रेणी परिपथ', definition: 'Components connected end-to-end so the same current flows through all. Total R = R₁ + R₂ + R₃...', definitionHi: 'घटक एक के बाद एक जुड़े होते हैं ताकि सभी में समान धारा बहे। कुल R = R₁ + R₂ + R₃...', category: 'Circuits', formula: 'R_total = R₁ + R₂ + ...' },
  { id: 'g08', term: 'Parallel Circuit', termHi: 'समानांतर परिपथ', definition: 'Components connected across the same two nodes. Same voltage across all; total current is the sum of branch currents.', definitionHi: 'घटक समान दो नोड्स के बीच जुड़े होते हैं। सभी पर समान वोल्टेज; कुल धारा शाखा धाराओं का योग है।', category: 'Circuits', formula: '1/R_total = 1/R₁ + 1/R₂ + ...' },
  { id: 'g09', term: 'Earthing', termHi: 'अर्थिंग (भू-संपर्क)', definition: 'Connecting the metal body of electrical equipment to the earth for safety. If a fault occurs, current flows to earth instead of through the user.', definitionHi: 'सुरक्षा के लिए विद्युत उपकरण के धातु शरीर को पृथ्वी से जोड़ना। फॉल्ट होने पर धारा उपयोगकर्ता के बजाय पृथ्वी में बहती है।', category: 'Safety' },
  { id: 'g10', term: 'MCB', termHi: 'MCB (लघु सर्किट ब्रेकर)', definition: 'Miniature Circuit Breaker — an automatic switch that opens (trips) when current exceeds its rated value, protecting the circuit from overcurrent.', definitionHi: 'लघु सर्किट ब्रेकर — एक स्वचालित स्विच जो धारा निर्धारित मूल्य से अधिक होने पर खुल (ट्रिप) जाता है।', category: 'Components' },
  { id: 'g11', term: 'ELCB / RCCB', termHi: 'ELCB / RCCB', definition: 'Earth Leakage Circuit Breaker / Residual Current Circuit Breaker — detects earth leakage current and disconnects the circuit to prevent electrocution.', definitionHi: 'अर्थ लीकेज सर्किट ब्रेकर — अर्थ लीकेज धारा का पता लगाता है और बिजली के झटके से बचाने के लिए सर्किट डिस्कनेक्ट करता है।', category: 'Components' },
  { id: 'g12', term: 'Transformer', termHi: 'ट्रांसफार्मर (परिणामित्र)', definition: 'A device that transfers electrical energy between circuits using electromagnetic induction. Changes voltage level (step-up or step-down).', definitionHi: 'एक उपकरण जो विद्युत चुम्बकीय प्रेरण का उपयोग करके परिपथों के बीच विद्युत ऊर्जा स्थानांतरित करता है। वोल्टेज स्तर बदलता है।', category: 'Components', formula: 'V₁/V₂ = N₁/N₂' },
  { id: 'g13', term: 'Power', termHi: 'शक्ति (विद्युत शक्ति)', definition: 'The rate of electrical energy consumption or production, measured in Watts (W). P = V × I = I²R = V²/R.', definitionHi: 'विद्युत ऊर्जा की खपत या उत्पादन की दर, वाट (W) में मापी जाती है। P = V × I = I²R = V²/R।', category: 'Basic', symbol: 'P', unit: 'Watt (W)', formula: 'P = V × I' },
  { id: 'g14', term: 'Fuse', termHi: 'फ्यूज', definition: 'A safety device with a thin wire that melts and breaks the circuit when current exceeds its rated value.', definitionHi: 'एक सुरक्षा उपकरण जिसमें पतला तार होता है जो धारा निर्धारित मूल्य से अधिक होने पर पिघलकर सर्किट तोड़ देता है।', category: 'Components' },
  { id: 'g15', term: 'Insulation Resistance', termHi: 'इन्सुलेशन प्रतिरोध', definition: 'Resistance of insulating material to current leakage. Measured with a megger. Must be above minimum values per IS standards.', definitionHi: 'इन्सुलेटिंग सामग्री का धारा रिसाव के प्रति प्रतिरोध। मेगर से मापा जाता है। IS मानकों के अनुसार न्यूनतम मूल्यों से ऊपर होना चाहिए।', category: 'Measurement' },
  { id: 'g16', term: 'Multimeter', termHi: 'मल्टीमीटर', definition: 'An instrument that measures voltage, current, and resistance. Can be analog or digital (DMM).', definitionHi: 'एक उपकरण जो वोल्टेज, धारा और प्रतिरोध मापता है। एनालॉग या डिजिटल (DMM) हो सकता है।', category: 'Measurement' },
  { id: 'g17', term: 'AC (Alternating Current)', termHi: 'AC (प्रत्यावर्ती धारा)', definition: 'Electric current that periodically reverses direction. India uses 230V, 50Hz single-phase AC for domestic supply.', definitionHi: 'विद्युत धारा जो समय-समय पर दिशा बदलती है। भारत में घरेलू आपूर्ति के लिए 230V, 50Hz सिंगल-फेज AC का उपयोग होता है।', category: 'Basic' },
  { id: 'g18', term: 'DC (Direct Current)', termHi: 'DC (दिष्ट धारा)', definition: 'Electric current that flows in one direction only. Batteries produce DC. Solar panels produce DC.', definitionHi: 'विद्युत धारा जो केवल एक दिशा में बहती है। बैटरियां DC उत्पन्न करती हैं। सौर पैनल DC उत्पन्न करते हैं।', category: 'Basic' },
];

const CATEGORIES = ['All', 'Basic', 'Laws', 'Circuits', 'Components', 'Safety', 'Measurement'];

export default function Glossary() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return GLOSSARY.filter((term) => {
      const matchCategory = category === 'All' || term.category === category;
      const matchSearch =
        !search ||
        term.term.toLowerCase().includes(search.toLowerCase()) ||
        term.termHi.includes(search) ||
        term.definition.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.glossary')}</h1>
        <p className="text-sm text-slate-500">
          {language === 'hi' ? 'विद्युत शब्दावली — हिंदी और अंग्रेज़ी में' : 'Electrical terminology — bilingual Hindi & English'}
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'hi' ? '🔍 शब्द खोजें...' : '🔍 Search terms...'}
          className="input-field flex-1"
        />
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                category === cat ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">{filtered.length} {language === 'hi' ? 'शब्द' : 'terms'}</p>

      {/* Terms grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((term) => (
          <div key={term.id} className="card p-4 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">{term.term}</h3>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5">{term.termHi}</p>
              </div>
              <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {term.category}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {language === 'hi' ? term.definitionHi : term.definition}
            </p>
            {(term.symbol || term.unit || term.formula) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {term.symbol && (
                  <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    {language === 'hi' ? 'प्रतीक' : 'Symbol'}: {term.symbol}
                  </span>
                )}
                {term.unit && (
                  <span className="text-[10px] font-mono bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                    {language === 'hi' ? 'इकाई' : 'Unit'}: {term.unit}
                  </span>
                )}
                {term.formula && (
                  <span className="text-[10px] font-mono bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
                    {term.formula}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
