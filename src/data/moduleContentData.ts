/* ============================================================
   Detailed, DGT-syllabus-aligned content for the modules that
   previously fell back to generic text. Merged over the default
   content in ModuleDetail (keeps the default icon/colour).
   Each entry mirrors the real ITI Electrician sub-topics.
   ============================================================ */

type Bi = { en: string; hi: string };
export interface ModuleExtra {
  keyTopics?: Bi[];
  theory?: Bi;
  practiceQuestions?: { q: Bi; options: Bi[]; correct: number; explanation: Bi }[];
  safetyTips?: Bi[];
  realWorldApplications?: Bi[];
  formulas?: { name: Bi; formula: string; description: Bi }[];
}

export const moduleContentData: Record<number, ModuleExtra> = {
  /* ---------- MODULE 4 — Batteries & Solar Cells ---------- */
  4: {
    keyTopics: [
      { en: 'Primary vs secondary cells', hi: 'प्राथमिक बनाम द्वितीयक सेल' },
      { en: 'Lead-acid cell: construction, charging & maintenance', hi: 'लेड-एसिड सेल: संरचना, चार्जिंग व रखरखाव' },
      { en: 'Ampere-hour capacity & efficiency', hi: 'एम्पीयर-घंटा क्षमता व दक्षता' },
      { en: 'Series/parallel grouping of cells', hi: 'सेलों का श्रेणी/समानांतर समूहन' },
      { en: 'Specific gravity & hydrometer testing', hi: 'विशिष्ट घनत्व व हाइड्रोमीटर परीक्षण' },
      { en: 'Solar PV cell — working & I-V curve', hi: 'सोलर PV सेल — कार्य व I-V वक्र' },
    ],
    theory: {
      en: 'A cell converts chemical energy into electrical energy. Primary cells (dry cell) are used once; secondary cells (lead-acid, Li-ion) are rechargeable. A lead-acid cell gives about 2 V; six in series make a 12 V battery. Capacity is measured in ampere-hours (Ah) — a 100 Ah battery can deliver 5 A for 20 hours. Cells in series add voltage; cells in parallel add capacity. State of charge is checked with a hydrometer: a fully charged lead-acid cell reads about 1.25–1.28 specific gravity. A solar photovoltaic cell is a large p-n junction that produces current when light frees electron-hole pairs.',
      hi: 'सेल रासायनिक ऊर्जा को विद्युत ऊर्जा में बदलता है। प्राथमिक सेल (ड्राई सेल) एक बार प्रयोग होते हैं; द्वितीयक सेल (लेड-एसिड, Li-ion) पुनः चार्ज होते हैं। लेड-एसिड सेल लगभग 2 V देता है; छह श्रेणी में 12 V बैटरी बनाते हैं। क्षमता एम्पीयर-घंटा (Ah) में मापी जाती है — 100 Ah बैटरी 5 A, 20 घंटे दे सकती है। श्रेणी में सेल वोल्टेज बढ़ाते हैं; समानांतर में क्षमता। चार्ज स्तर हाइड्रोमीटर से जांचते हैं: पूर्ण चार्ज लेड-एसिड सेल लगभग 1.25–1.28 विशिष्ट घनत्व दिखाता है। सोलर PV सेल एक बड़ा p-n संधि है जो प्रकाश से धारा बनाता है।',
    },
    formulas: [
      { name: { en: 'Capacity', hi: 'क्षमता' }, formula: 'Ah = I × t', description: { en: 'Current × discharge hours', hi: 'धारा × डिस्चार्ज घंटे' } },
      { name: { en: 'Ah efficiency', hi: 'Ah दक्षता' }, formula: 'η = Ah_out / Ah_in', description: { en: 'Typically 90–95% for lead-acid', hi: 'लेड-एसिड हेतु प्रायः 90–95%' } },
      { name: { en: 'Series voltage', hi: 'श्रेणी वोल्टेज' }, formula: 'V = n × 2V', description: { en: 'n lead-acid cells in series', hi: 'श्रेणी में n लेड-एसिड सेल' } },
    ],
    practiceQuestions: [
      { q: { en: 'How many lead-acid cells are needed for a 12 V battery?', hi: '12 V बैटरी हेतु कितने लेड-एसिड सेल चाहिए?' },
        options: [{ en: '3', hi: '3' }, { en: '6', hi: '6' }, { en: '12', hi: '12' }, { en: '24', hi: '24' }], correct: 1,
        explanation: { en: 'Each lead-acid cell is 2 V, so 12 ÷ 2 = 6 cells in series.', hi: 'प्रत्येक लेड-एसिड सेल 2 V, अतः 12 ÷ 2 = 6 सेल श्रेणी में।' } },
      { q: { en: 'Connecting two 100 Ah batteries in parallel gives what capacity?', hi: 'दो 100 Ah बैटरी समानांतर में जोड़ने पर क्षमता?' },
        options: [{ en: '50 Ah', hi: '50 Ah' }, { en: '100 Ah', hi: '100 Ah' }, { en: '200 Ah', hi: '200 Ah' }, { en: '400 Ah', hi: '400 Ah' }], correct: 2,
        explanation: { en: 'Parallel adds capacity: 100 + 100 = 200 Ah at the same voltage.', hi: 'समानांतर क्षमता जोड़ता है: 100 + 100 = 200 Ah समान वोल्टेज पर।' } },
    ],
    safetyTips: [
      { en: 'Charge batteries in a ventilated area — hydrogen gas is explosive', hi: 'बैटरी हवादार जगह चार्ज करें — हाइड्रोजन गैस विस्फोटक है' },
      { en: 'Wear acid-proof gloves and goggles when handling electrolyte', hi: 'इलेक्ट्रोलाइट संभालते समय एसिड-प्रूफ दस्ताने व गॉगल्स पहनें' },
    ],
    realWorldApplications: [
      { en: 'Inverter and UPS battery banks', hi: 'इन्वर्टर व UPS बैटरी बैंक' },
      { en: 'Solar home lighting systems', hi: 'सोलर होम लाइटिंग सिस्टम' },
    ],
  },

  /* ---------- MODULE 7 — Electrical Illumination ---------- */
  7: {
    keyTopics: [
      { en: 'Terms: luminous flux, intensity, illuminance', hi: 'शब्द: ज्योति फ्लक्स, तीव्रता, प्रदीप्ति' },
      { en: 'Laws of illumination — inverse square & cosine', hi: 'प्रकाश के नियम — व्युत्क्रम वर्ग व कोसाइन' },
      { en: 'Lamp types: incandescent, fluorescent, CFL, LED, vapour', hi: 'लैंप प्रकार: इनकैंडसेंट, फ्लोरोसेंट, CFL, LED, वेपर' },
      { en: 'Luminous efficacy (lm/W)', hi: 'ज्योति दक्षता (lm/W)' },
      { en: 'Tube-light circuit: choke & starter', hi: 'ट्यूब-लाइट सर्किट: चोक व स्टार्टर' },
      { en: 'Lighting schemes & recommended lux levels', hi: 'प्रकाश योजनाएं व अनुशंसित लक्स स्तर' },
    ],
    theory: {
      en: 'Illumination deals with producing and distributing light. Luminous flux (lumen) is the total light output; luminous intensity (candela) is light in a direction; illuminance (lux) is lumens falling per square metre. The inverse-square law states illuminance falls as 1/d² from a point source, and the cosine law accounts for the angle of incidence. Lamp efficacy (lumens per watt) rises sharply from incandescent (~12 lm/W) to CFL (~60) to LED (~100+). A fluorescent tube needs a choke (ballast) to limit current and a starter to strike the arc.',
      hi: 'प्रकाश व्यवस्था प्रकाश उत्पन्न व वितरित करने से संबंधित है। ज्योति फ्लक्स (ल्यूमेन) कुल प्रकाश है; ज्योति तीव्रता (कैंडेला) एक दिशा में; प्रदीप्ति (लक्स) प्रति वर्ग मीटर ल्यूमेन। व्युत्क्रम वर्ग नियम: प्रदीप्ति बिंदु स्रोत से 1/d² घटती है, और कोसाइन नियम आपतन कोण का ध्यान रखता है। लैंप दक्षता (ल्यूमेन प्रति वाट) इनकैंडसेंट (~12) से CFL (~60) से LED (~100+) तक बढ़ती है। फ्लोरोसेंट ट्यूब को धारा सीमित करने हेतु चोक व आर्क शुरू करने हेतु स्टार्टर चाहिए।',
    },
    formulas: [
      { name: { en: 'Inverse square law', hi: 'व्युत्क्रम वर्ग नियम' }, formula: 'E = I / d²', description: { en: 'Illuminance from intensity & distance', hi: 'तीव्रता व दूरी से प्रदीप्ति' } },
      { name: { en: 'Cosine law', hi: 'कोसाइन नियम' }, formula: 'E = (I / d²)·cosθ', description: { en: 'Light hitting a tilted surface', hi: 'झुकी सतह पर प्रकाश' } },
      { name: { en: 'Efficacy', hi: 'दक्षता' }, formula: 'η = lumens / watts', description: { en: 'Higher is more efficient', hi: 'अधिक अर्थात अधिक दक्ष' } },
    ],
    practiceQuestions: [
      { q: { en: 'If distance from a lamp doubles, illuminance becomes:', hi: 'लैंप से दूरी दोगुनी होने पर प्रदीप्ति:' },
        options: [{ en: 'Double', hi: 'दोगुनी' }, { en: 'Half', hi: 'आधी' }, { en: 'One-fourth', hi: 'एक-चौथाई' }, { en: 'Same', hi: 'समान' }], correct: 2,
        explanation: { en: 'By the inverse-square law E ∝ 1/d²; doubling d gives 1/4 the light.', hi: 'व्युत्क्रम वर्ग नियम से E ∝ 1/d²; d दोगुनी पर 1/4 प्रकाश।' } },
      { q: { en: 'Which lamp has the highest luminous efficacy?', hi: 'किस लैंप की ज्योति दक्षता सबसे अधिक है?' },
        options: [{ en: 'Incandescent', hi: 'इनकैंडसेंट' }, { en: 'CFL', hi: 'CFL' }, { en: 'LED', hi: 'LED' }, { en: 'Halogen', hi: 'हैलोजन' }], correct: 2,
        explanation: { en: 'LEDs give 100+ lm/W, far more than incandescent (~12) or CFL (~60).', hi: 'LED 100+ lm/W देते हैं, इनकैंडसेंट (~12) व CFL (~60) से बहुत अधिक।' } },
    ],
    safetyTips: [
      { en: 'Switch off and discharge before replacing a tube choke', hi: 'ट्यूब चोक बदलने से पहले बंद कर डिस्चार्ज करें' },
      { en: 'Dispose CFLs carefully — they contain mercury', hi: 'CFL सावधानी से निपटाएं — इनमें पारा होता है' },
    ],
    realWorldApplications: [
      { en: 'Street lighting design', hi: 'सड़क प्रकाश डिज़ाइन' },
      { en: 'Factory and office lux planning', hi: 'कारखाना व कार्यालय लक्स योजना' },
    ],
  },

  /* ---------- MODULE 9 — Instrument Calibration ---------- */
  9: {
    keyTopics: [
      { en: 'Types of error — absolute, relative, percentage', hi: 'त्रुटि प्रकार — निरपेक्ष, सापेक्ष, प्रतिशत' },
      { en: 'PMMC and moving-iron instruments', hi: 'PMMC व मूविंग-आयरन यंत्र' },
      { en: 'Range extension — shunt & multiplier', hi: 'रेंज विस्तार — शंट व मल्टीप्लायर' },
      { en: 'Calibration against a standard', hi: 'मानक के विरुद्ध अंशांकन' },
      { en: 'Wheatstone & Kelvin bridge', hi: 'व्हीटस्टोन व केल्विन ब्रिज' },
    ],
    theory: {
      en: 'Calibration compares an instrument against a known standard and corrects its error. Absolute error is the difference between measured and true value; percentage error is that difference expressed per cent of true value. An ammeter range is extended with a low-value shunt in parallel; a voltmeter range is extended with a high-value multiplier in series. A PMMC movement reads DC and is linear; moving-iron meters read both AC and DC. Unknown resistances are measured by balancing a Wheatstone bridge until the galvanometer reads zero.',
      hi: 'अंशांकन यंत्र की तुलना ज्ञात मानक से कर त्रुटि सुधारता है। निरपेक्ष त्रुटि मापित व वास्तविक मान का अंतर है; प्रतिशत त्रुटि वह अंतर वास्तविक मान के प्रतिशत में। एमीटर रेंज समानांतर कम-मान शंट से बढ़ती है; वोल्टमीटर रेंज श्रेणी में उच्च-मान मल्टीप्लायर से। PMMC DC पढ़ता है व रैखिक है; मूविंग-आयरन AC व DC दोनों। अज्ञात प्रतिरोध व्हीटस्टोन ब्रिज संतुलित कर मापे जाते हैं जब गैल्वेनोमीटर शून्य हो।',
    },
    formulas: [
      { name: { en: 'Shunt', hi: 'शंट' }, formula: 'Rsh = Rm·Im/(I−Im)', description: { en: 'Extends ammeter range', hi: 'एमीटर रेंज बढ़ाता है' } },
      { name: { en: 'Multiplier', hi: 'मल्टीप्लायर' }, formula: 'Rse = V/Im − Rm', description: { en: 'Extends voltmeter range', hi: 'वोल्टमीटर रेंज बढ़ाता है' } },
      { name: { en: '% error', hi: '% त्रुटि' }, formula: '%e = (Am−True)/True ×100', description: { en: 'Measured vs true', hi: 'मापित बनाम वास्तविक' } },
    ],
    practiceQuestions: [
      { q: { en: 'To convert a galvanometer into an ammeter you connect a:', hi: 'गैल्वेनोमीटर को एमीटर बनाने हेतु जोड़ते हैं:' },
        options: [{ en: 'High resistance in series', hi: 'श्रेणी में उच्च प्रतिरोध' }, { en: 'Low resistance (shunt) in parallel', hi: 'समानांतर कम प्रतिरोध (शंट)' }, { en: 'Capacitor', hi: 'कैपेसिटर' }, { en: 'Diode', hi: 'डायोड' }], correct: 1,
        explanation: { en: 'A low shunt in parallel diverts most current, extending the range.', hi: 'समानांतर कम शंट अधिकांश धारा मोड़ता है, रेंज बढ़ाता है।' } },
      { q: { en: 'A Wheatstone bridge is balanced when the galvanometer reads:', hi: 'व्हीटस्टोन ब्रिज संतुलित तब जब गैल्वेनोमीटर पढ़े:' },
        options: [{ en: 'Maximum', hi: 'अधिकतम' }, { en: 'Zero', hi: 'शून्य' }, { en: 'Half', hi: 'आधा' }, { en: 'Negative', hi: 'ऋणात्मक' }], correct: 1,
        explanation: { en: 'At balance no current flows through the galvanometer, so it reads zero.', hi: 'संतुलन पर गैल्वेनोमीटर से धारा नहीं बहती, अतः शून्य।' } },
    ],
    safetyTips: [
      { en: 'Always start on the highest range and step down', hi: 'हमेशा उच्चतम रेंज से शुरू कर नीचे आएं' },
      { en: 'Never connect an ammeter across a voltage source', hi: 'एमीटर को वोल्टेज स्रोत के आर-पार कभी न जोड़ें' },
    ],
    realWorldApplications: [
      { en: 'Meter testing labs', hi: 'मीटर परीक्षण प्रयोगशाला' },
      { en: 'Energy-meter accuracy checks', hi: 'ऊर्जा-मीटर सटीकता जांच' },
    ],
  },

  /* ---------- MODULE 10 — Domestic Appliances ---------- */
  10: {
    keyTopics: [
      { en: 'Heating appliances — iron, heater, geyser (nichrome element)', hi: 'हीटिंग उपकरण — इस्त्री, हीटर, गीजर (नाइक्रोम एलिमेंट)' },
      { en: 'Motor appliances — fan, mixer, washing machine', hi: 'मोटर उपकरण — पंखा, मिक्सर, वॉशिंग मशीन' },
      { en: 'Earthing of metal-body appliances', hi: 'धातु-बॉडी उपकरणों की अर्थिंग' },
      { en: 'Common faults & fault finding', hi: 'सामान्य दोष व दोष खोज' },
      { en: 'Energy consumption & star rating', hi: 'ऊर्जा खपत व स्टार रेटिंग' },
    ],
    theory: {
      en: 'Domestic appliances are either heating or motor types. Heating appliances use a nichrome element whose high resistance produces heat by I²R; a thermostat controls temperature. Motor appliances use single-phase motors (fan, mixer). Every metal-body appliance must be earthed through the third pin so a fault current trips protection instead of shocking the user. Common faults include open elements, worn carbon brushes, faulty switches and weak capacitors. Energy use in units (kWh) is power in kW multiplied by hours of use.',
      hi: 'घरेलू उपकरण हीटिंग या मोटर प्रकार के होते हैं। हीटिंग उपकरण नाइक्रोम एलिमेंट प्रयोग करते हैं जिसका उच्च प्रतिरोध I²R से ऊष्मा देता है; थर्मोस्टैट तापमान नियंत्रित करता है। मोटर उपकरण सिंगल-फेज मोटर (पंखा, मिक्सर) प्रयोग करते हैं। हर धातु-बॉडी उपकरण तीसरी पिन से अर्थ होना चाहिए ताकि फॉल्ट धारा उपयोगकर्ता को झटका देने के बजाय सुरक्षा ट्रिप करे। सामान्य दोष: खुला एलिमेंट, घिसे ब्रश, खराब स्विच, कमजोर कैपेसिटर। यूनिट (kWh) में ऊर्जा = kW में शक्ति × उपयोग घंटे।',
    },
    formulas: [
      { name: { en: 'Heat produced', hi: 'उत्पन्न ऊष्मा' }, formula: 'H = I²Rt', description: { en: "Joule's law of heating", hi: 'जूल का तापन नियम' } },
      { name: { en: 'Energy', hi: 'ऊर्जा' }, formula: 'kWh = kW × hours', description: { en: 'Billing units', hi: 'बिलिंग यूनिट' } },
    ],
    practiceQuestions: [
      { q: { en: 'The heating element of an electric iron is made of:', hi: 'विद्युत इस्त्री का हीटिंग एलिमेंट बना होता है:' },
        options: [{ en: 'Copper', hi: 'तांबा' }, { en: 'Nichrome', hi: 'नाइक्रोम' }, { en: 'Aluminium', hi: 'एल्युमिनियम' }, { en: 'Silver', hi: 'चांदी' }], correct: 1,
        explanation: { en: 'Nichrome has high resistivity and withstands high temperature without oxidising.', hi: 'नाइक्रोम का प्रतिरोधकता उच्च है व उच्च तापमान पर बिना ऑक्सीकरण सहता है।' } },
      { q: { en: 'Why is the metal body of a geyser earthed?', hi: 'गीजर की धातु बॉडी अर्थ क्यों की जाती है?' },
        options: [{ en: 'To save energy', hi: 'ऊर्जा बचाने' }, { en: 'To prevent shock on fault', hi: 'फॉल्ट पर झटका रोकने' }, { en: 'To heat faster', hi: 'तेज गरम करने' }, { en: 'To reduce noise', hi: 'शोर घटाने' }], correct: 1,
        explanation: { en: 'Earthing gives fault current a safe path so protection trips instead of the user getting a shock.', hi: 'अर्थिंग फॉल्ट धारा को सुरक्षित रास्ता देती है ताकि सुरक्षा ट्रिप हो, उपयोगकर्ता को झटका नहीं।' } },
    ],
    safetyTips: [
      { en: 'Unplug before opening any appliance', hi: 'कोई उपकरण खोलने से पहले प्लग निकालें' },
      { en: 'Check earth continuity after every repair', hi: 'हर मरम्मत के बाद अर्थ कंटिन्युइटी जांचें' },
    ],
    realWorldApplications: [
      { en: 'Appliance repair workshops', hi: 'उपकरण मरम्मत कार्यशाला' },
      { en: 'After-sales service centres', hi: 'बिक्री-पश्चात सेवा केंद्र' },
    ],
  },

  /* ---------- MODULE 12 — Engineering Drawing ---------- */
  12: {
    keyTopics: [
      { en: 'Drawing instruments & their use', hi: 'ड्राइंग उपकरण व उनका उपयोग' },
      { en: 'Types of lines & lettering', hi: 'रेखा प्रकार व अक्षरांकन' },
      { en: 'Standard electrical symbols', hi: 'मानक विद्युत प्रतीक' },
      { en: 'Wiring & circuit diagrams', hi: 'वायरिंग व सर्किट आरेख' },
      { en: 'Scales and dimensioning', hi: 'स्केल व आयाम' },
    ],
    theory: {
      en: 'Engineering drawing is the universal language of the workshop. An electrician must read wiring diagrams, circuit diagrams and layout drawings. Standardised symbols represent each component — a resistor, switch, lamp, fuse, earth, transformer and so on — so any technician can interpret the drawing. Different line types carry meaning: thick solid for main outlines, thin for dimensions, dashed for hidden parts, and chain lines for centres. Scales let a large installation be drawn to fit on paper while keeping proportions.',
      hi: 'इंजीनियरिंग ड्राइंग कार्यशाला की सार्वभौमिक भाषा है। इलेक्ट्रीशियन को वायरिंग आरेख, सर्किट आरेख व लेआउट पढ़ने आना चाहिए। मानक प्रतीक प्रत्येक घटक को दर्शाते हैं — प्रतिरोधक, स्विच, लैंप, फ्यूज, अर्थ, ट्रांसफॉर्मर आदि — ताकि कोई भी तकनीशियन आरेख समझ सके। विभिन्न रेखा प्रकार अर्थ रखते हैं: मुख्य रूपरेखा हेतु मोटी, आयाम हेतु पतली, छिपे भाग हेतु धराशायी, केंद्र हेतु चेन रेखा। स्केल से बड़ा इंस्टॉलेशन अनुपात बनाए रखते हुए कागज पर बनता है।',
    },
    formulas: [
      { name: { en: 'Scale', hi: 'स्केल' }, formula: 'Scale = drawing size / actual size', description: { en: 'e.g. 1:100', hi: 'जैसे 1:100' } },
    ],
    practiceQuestions: [
      { q: { en: 'Hidden edges in a drawing are shown by:', hi: 'आरेख में छिपे किनारे दर्शाए जाते हैं:' },
        options: [{ en: 'Thick solid line', hi: 'मोटी ठोस रेखा' }, { en: 'Dashed line', hi: 'धराशायी रेखा' }, { en: 'Chain line', hi: 'चेन रेखा' }, { en: 'Wavy line', hi: 'लहरदार रेखा' }], correct: 1,
        explanation: { en: 'Short dashes represent hidden/invisible edges behind the visible surface.', hi: 'छोटी धराशायी रेखाएं दृश्य सतह के पीछे छिपे किनारे दर्शाती हैं।' } },
      { q: { en: 'A scale of 1:50 means the drawing is:', hi: '1:50 स्केल का अर्थ आरेख है:' },
        options: [{ en: '50 times larger', hi: '50 गुना बड़ा' }, { en: '50 times smaller', hi: '50 गुना छोटा' }, { en: 'Same size', hi: 'समान आकार' }, { en: 'Twice the size', hi: 'दोगुना' }], correct: 1,
        explanation: { en: '1:50 means 1 unit on paper equals 50 actual units — a reduction.', hi: '1:50 अर्थात कागज पर 1 इकाई = 50 वास्तविक इकाई — कमी।' } },
    ],
    safetyTips: [
      { en: 'Keep drawings updated as "as-built" after any change', hi: 'किसी बदलाव के बाद आरेख "एज-बिल्ट" अद्यतन रखें' },
    ],
    realWorldApplications: [
      { en: 'Panel wiring layouts', hi: 'पैनल वायरिंग लेआउट' },
      { en: 'Building electrical plans', hi: 'भवन विद्युत योजना' },
    ],
  },

  /* ---------- MODULE 13 — Workshop Calculation & Science ---------- */
  13: {
    keyTopics: [
      { en: 'Units, fractions, ratio & percentage', hi: 'इकाई, भिन्न, अनुपात व प्रतिशत' },
      { en: 'Mensuration — area & volume', hi: 'क्षेत्रमिति — क्षेत्रफल व आयतन' },
      { en: 'Mass, weight, density', hi: 'द्रव्यमान, भार, घनत्व' },
      { en: 'Work, power, energy', hi: 'कार्य, शक्ति, ऊर्जा' },
      { en: 'Heat & temperature', hi: 'ऊष्मा व तापमान' },
    ],
    theory: {
      en: 'Workshop science gives the electrician the everyday maths and physics behind the trade. Ratios and percentages are used for efficiency and loss calculations. Mensuration finds conductor cross-section and tank volumes. Work is force times distance, power is work per unit time, and energy is power times time — the same kilowatt-hour that appears on an electricity bill. Heat raises temperature according to the material\'s specific heat, which matters when sizing heating elements.',
      hi: 'कार्यशाला विज्ञान इलेक्ट्रीशियन को ट्रेड के पीछे की रोजमर्रा गणित व भौतिकी देता है। अनुपात व प्रतिशत दक्षता व हानि गणना हेतु प्रयुक्त होते हैं। क्षेत्रमिति से चालक अनुप्रस्थ-काट व टंकी आयतन निकलते हैं। कार्य = बल × दूरी, शक्ति = कार्य प्रति समय, ऊर्जा = शक्ति × समय — वही किलोवाट-घंटा जो बिजली बिल पर आता है। ऊष्मा पदार्थ की विशिष्ट ऊष्मा अनुसार तापमान बढ़ाती है, जो हीटिंग एलिमेंट आकार हेतु महत्वपूर्ण है।',
    },
    formulas: [
      { name: { en: 'Power', hi: 'शक्ति' }, formula: 'P = W / t', description: { en: 'Work per unit time', hi: 'कार्य प्रति समय' } },
      { name: { en: 'Density', hi: 'घनत्व' }, formula: 'ρ = m / V', description: { en: 'Mass per unit volume', hi: 'द्रव्यमान प्रति आयतन' } },
      { name: { en: 'Heat', hi: 'ऊष्मा' }, formula: 'Q = m·c·ΔT', description: { en: 'Specific-heat heating', hi: 'विशिष्ट-ऊष्मा तापन' } },
    ],
    practiceQuestions: [
      { q: { en: '1 kilowatt-hour equals how many joules?', hi: '1 किलोवाट-घंटा कितने जूल के बराबर है?' },
        options: [{ en: '3,600 J', hi: '3,600 J' }, { en: '36,000 J', hi: '36,000 J' }, { en: '3.6 million J', hi: '36 लाख J' }, { en: '1,000 J', hi: '1,000 J' }], correct: 2,
        explanation: { en: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ joules.', hi: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ जूल।' } },
      { q: { en: 'Efficiency of a machine is:', hi: 'मशीन की दक्षता है:' },
        options: [{ en: 'Input/Output', hi: 'इनपुट/आउटपुट' }, { en: 'Output/Input ×100', hi: 'आउटपुट/इनपुट ×100' }, { en: 'Input×Output', hi: 'इनपुट×आउटपुट' }, { en: 'Output−Input', hi: 'आउटपुट−इनपुट' }], correct: 1,
        explanation: { en: 'Efficiency = (useful output ÷ input) × 100%, always less than 100%.', hi: 'दक्षता = (उपयोगी आउटपुट ÷ इनपुट) × 100%, सदैव 100% से कम।' } },
    ],
    safetyTips: [
      { en: 'Double-check unit conversions before sizing cables', hi: 'केबल आकार से पहले इकाई रूपांतरण दोबारा जांचें' },
    ],
    realWorldApplications: [
      { en: 'Load and cable-size estimation', hi: 'लोड व केबल-आकार अनुमान' },
      { en: 'Material costing', hi: 'सामग्री लागत' },
    ],
  },

  /* ---------- MODULE 14 — DC Machine Commissioning ---------- */
  14: {
    keyTopics: [
      { en: 'DC generator construction & parts', hi: 'DC जनरेटर संरचना व भाग' },
      { en: 'EMF equation of a generator', hi: 'जनरेटर का EMF समीकरण' },
      { en: 'Types — series, shunt, compound', hi: 'प्रकार — सीरीज, शंट, कंपाउंड' },
      { en: 'Characteristics & voltage build-up', hi: 'विशेषताएं व वोल्टेज बिल्ड-अप' },
      { en: 'Commissioning tests', hi: 'कमीशनिंग परीक्षण' },
    ],
    theory: {
      en: 'A DC generator converts mechanical energy into DC electrical energy using electromagnetic induction. Its main parts are the yoke, field poles, armature, commutator and brushes. The commutator rectifies the alternating EMF induced in the armature into DC at the brushes. Generators are classed by how the field is excited: separately excited, shunt (field across armature), series (field in line with load) and compound (both). Self-excited shunt generators build up voltage from residual magnetism.',
      hi: 'DC जनरेटर विद्युतचुंबकीय प्रेरण से यांत्रिक ऊर्जा को DC विद्युत ऊर्जा में बदलता है। मुख्य भाग: योक, फील्ड पोल, आर्मेचर, कम्यूटेटर व ब्रश। कम्यूटेटर आर्मेचर में प्रेरित प्रत्यावर्ती EMF को ब्रश पर DC में बदलता है। जनरेटर फील्ड उत्तेजन अनुसार वर्गीकृत: पृथक उत्तेजित, शंट (फील्ड आर्मेचर के आर-पार), सीरीज (फील्ड लोड के साथ), कंपाउंड (दोनों)। स्व-उत्तेजित शंट जनरेटर अवशिष्ट चुंबकत्व से वोल्टेज बनाते हैं।',
    },
    formulas: [
      { name: { en: 'EMF equation', hi: 'EMF समीकरण' }, formula: 'E = PΦZN / 60A', description: { en: 'P poles, Φ flux, Z conductors, N rpm, A paths', hi: 'P ध्रुव, Φ फ्लक्स, Z चालक, N rpm, A पथ' } },
    ],
    practiceQuestions: [
      { q: { en: 'The device that converts AC to DC in a DC machine is the:', hi: 'DC मशीन में AC को DC में बदलने वाला उपकरण है:' },
        options: [{ en: 'Slip ring', hi: 'स्लिप रिंग' }, { en: 'Commutator', hi: 'कम्यूटेटर' }, { en: 'Yoke', hi: 'योक' }, { en: 'Bearing', hi: 'बियरिंग' }], correct: 1,
        explanation: { en: 'The commutator with brushes rectifies the armature AC into DC output.', hi: 'ब्रश सहित कम्यूटेटर आर्मेचर AC को DC आउटपुट में बदलता है।' } },
      { q: { en: 'A shunt generator builds up voltage due to:', hi: 'शंट जनरेटर वोल्टेज बनाता है:' },
        options: [{ en: 'Residual magnetism', hi: 'अवशिष्ट चुंबकत्व' }, { en: 'Battery', hi: 'बैटरी' }, { en: 'Capacitor', hi: 'कैपेसिटर' }, { en: 'Load', hi: 'लोड' }], correct: 0,
        explanation: { en: 'Residual magnetism in the poles starts the self-excitation process.', hi: 'ध्रुवों का अवशिष्ट चुंबकत्व स्व-उत्तेजन शुरू करता है।' } },
    ],
    safetyTips: [
      { en: 'Never open the field circuit of a running shunt generator abruptly', hi: 'चालू शंट जनरेटर का फील्ड सर्किट अचानक न खोलें' },
    ],
    realWorldApplications: [
      { en: 'Battery charging plants', hi: 'बैटरी चार्जिंग प्लांट' },
      { en: 'DC welding generators', hi: 'DC वेल्डिंग जनरेटर' },
    ],
  },

  /* ---------- MODULE 15 — DC Machine Maintenance ---------- */
  15: {
    keyTopics: [
      { en: 'DC motor types & back-EMF', hi: 'DC मोटर प्रकार व बैक-EMF' },
      { en: 'Torque and speed relations', hi: 'बलाघूर्ण व गति संबंध' },
      { en: 'Speed control — armature & field', hi: 'गति नियंत्रण — आर्मेचर व फील्ड' },
      { en: 'Starters — 3-point & 4-point', hi: 'स्टार्टर — 3-पॉइंट व 4-पॉइंट' },
      { en: 'Brush & commutator maintenance', hi: 'ब्रश व कम्यूटेटर रखरखाव' },
    ],
    theory: {
      en: 'A DC motor converts DC electrical energy into mechanical rotation. As it turns, the armature generates a back-EMF that opposes the supply, so V = Eb + Ia·Ra. Torque is proportional to flux and armature current (T ∝ ΦIa) while speed is proportional to back-EMF over flux (N ∝ Eb/Φ). Speed is controlled by varying armature voltage (below base speed) or field flux (above base speed). A starter limits the heavy starting current because at standstill back-EMF is zero. Routine maintenance means checking brush wear, spring tension and a clean, concentric commutator.',
      hi: 'DC मोटर DC विद्युत ऊर्जा को यांत्रिक घूर्णन में बदलती है। घूमते समय आर्मेचर बैक-EMF बनाता है जो आपूर्ति का विरोध करता है, अतः V = Eb + Ia·Ra। बलाघूर्ण फ्लक्स व आर्मेचर धारा के समानुपाती (T ∝ ΦIa) व गति बैक-EMF/फ्लक्स के समानुपाती (N ∝ Eb/Φ)। गति आर्मेचर वोल्टेज (आधार गति से नीचे) या फील्ड फ्लक्स (ऊपर) बदलकर नियंत्रित होती है। स्टार्टर भारी प्रारंभिक धारा सीमित करता है क्योंकि स्थिर अवस्था में बैक-EMF शून्य है। नियमित रखरखाव: ब्रश घिसाव, स्प्रिंग तनाव व साफ कम्यूटेटर जांच।',
    },
    formulas: [
      { name: { en: 'Back-EMF', hi: 'बैक-EMF' }, formula: 'Eb = V − Ia·Ra', description: { en: 'Opposes supply voltage', hi: 'आपूर्ति वोल्टेज का विरोध' } },
      { name: { en: 'Torque', hi: 'बलाघूर्ण' }, formula: 'T ∝ Φ·Ia', description: { en: 'Flux × armature current', hi: 'फ्लक्स × आर्मेचर धारा' } },
    ],
    practiceQuestions: [
      { q: { en: 'Why does a DC motor draw heavy current at starting?', hi: 'DC मोटर प्रारंभ में भारी धारा क्यों लेती है?' },
        options: [{ en: 'High back-EMF', hi: 'उच्च बैक-EMF' }, { en: 'Back-EMF is zero', hi: 'बैक-EMF शून्य है' }, { en: 'High resistance', hi: 'उच्च प्रतिरोध' }, { en: 'Low voltage', hi: 'कम वोल्टेज' }], correct: 1,
        explanation: { en: 'At standstill Eb = 0, so Ia = V/Ra is very large — hence a starter is used.', hi: 'स्थिर अवस्था में Eb = 0, अतः Ia = V/Ra बहुत बड़ा — इसलिए स्टार्टर प्रयोग होता है।' } },
      { q: { en: 'Above base speed, a DC motor speed is increased by:', hi: 'आधार गति से ऊपर DC मोटर गति बढ़ाई जाती है:' },
        options: [{ en: 'Increasing field flux', hi: 'फील्ड फ्लक्स बढ़ाकर' }, { en: 'Weakening field flux', hi: 'फील्ड फ्लक्स घटाकर' }, { en: 'Adding load', hi: 'लोड जोड़कर' }, { en: 'Lowering voltage', hi: 'वोल्टेज घटाकर' }], correct: 1,
        explanation: { en: 'Since N ∝ 1/Φ, weakening the field raises speed above base (field control).', hi: 'क्योंकि N ∝ 1/Φ, फील्ड घटाने से गति आधार से ऊपर बढ़ती है (फील्ड नियंत्रण)।' } },
    ],
    safetyTips: [
      { en: 'Use the starter every time — never switch a DC motor direct-on-line', hi: 'हर बार स्टार्टर प्रयोग करें — DC मोटर सीधे लाइन पर न चलाएं' },
    ],
    realWorldApplications: [
      { en: 'Traction and cranes', hi: 'ट्रैक्शन व क्रेन' },
      { en: 'Rolling mills', hi: 'रोलिंग मिल' },
    ],
  },

  /* ---------- MODULE 16 — AC Motor Performance ---------- */
  16: {
    keyTopics: [
      { en: '3-phase induction motor construction', hi: '3-फेज प्रेरण मोटर संरचना' },
      { en: 'Rotating magnetic field & synchronous speed', hi: 'घूर्णन चुंबकीय क्षेत्र व तुल्यकाली गति' },
      { en: 'Slip & its effect', hi: 'स्लिप व उसका प्रभाव' },
      { en: 'Torque-slip characteristic', hi: 'बलाघूर्ण-स्लिप विशेषता' },
      { en: 'Squirrel-cage vs slip-ring rotor', hi: 'स्क्विरल-केज बनाम स्लिप-रिंग रोटर' },
    ],
    theory: {
      en: 'A three-phase induction motor is the workhorse of industry. Balanced three-phase currents in the stator produce a rotating magnetic field that turns at synchronous speed Ns = 120f/P. The rotor always runs a little slower; the difference, expressed as a fraction, is the slip. Without slip there would be no induced rotor current and no torque, so the motor can never reach synchronous speed. The squirrel-cage rotor is rugged and maintenance-free; the slip-ring rotor allows external resistance for high starting torque.',
      hi: 'तीन-फेज प्रेरण मोटर उद्योग की कार्यशक्ति है। स्टेटर में संतुलित तीन-फेज धाराएं घूर्णन चुंबकीय क्षेत्र बनाती हैं जो तुल्यकाली गति Ns = 120f/P पर घूमता है। रोटर सदैव थोड़ा धीमा चलता है; अंतर, भिन्न रूप में, स्लिप है। स्लिप बिना रोटर धारा व बलाघूर्ण नहीं होगा, अतः मोटर कभी तुल्यकाली गति तक नहीं पहुंचती। स्क्विरल-केज रोटर मजबूत व रखरखाव-मुक्त; स्लिप-रिंग रोटर उच्च प्रारंभिक बलाघूर्ण हेतु बाहरी प्रतिरोध की अनुमति देता है।',
    },
    formulas: [
      { name: { en: 'Synchronous speed', hi: 'तुल्यकाली गति' }, formula: 'Ns = 120f / P', description: { en: 'f frequency, P poles', hi: 'f आवृत्ति, P ध्रुव' } },
      { name: { en: 'Slip', hi: 'स्लिप' }, formula: 's = (Ns − Nr) / Ns', description: { en: 'Usually 2–5% at full load', hi: 'पूर्ण लोड पर प्रायः 2–5%' } },
    ],
    practiceQuestions: [
      { q: { en: 'A 4-pole motor on 50 Hz has a synchronous speed of:', hi: '50 Hz पर 4-ध्रुव मोटर की तुल्यकाली गति:' },
        options: [{ en: '1000 rpm', hi: '1000 rpm' }, { en: '1500 rpm', hi: '1500 rpm' }, { en: '3000 rpm', hi: '3000 rpm' }, { en: '750 rpm', hi: '750 rpm' }], correct: 1,
        explanation: { en: 'Ns = 120×50/4 = 1500 rpm.', hi: 'Ns = 120×50/4 = 1500 rpm।' } },
      { q: { en: 'An induction motor can never run at synchronous speed because:', hi: 'प्रेरण मोटर तुल्यकाली गति पर कभी नहीं चलती क्योंकि:' },
        options: [{ en: 'Friction', hi: 'घर्षण' }, { en: 'Then slip and rotor current would be zero', hi: 'तब स्लिप व रोटर धारा शून्य होगी' }, { en: 'Low voltage', hi: 'कम वोल्टेज' }, { en: 'High load', hi: 'उच्च लोड' }], correct: 1,
        explanation: { en: 'At synchronous speed slip = 0, so no EMF is induced and torque vanishes.', hi: 'तुल्यकाली गति पर स्लिप = 0, अतः कोई EMF नहीं व बलाघूर्ण समाप्त।' } },
    ],
    safetyTips: [
      { en: 'Check winding insulation resistance with a megger before start-up', hi: 'चालू करने से पहले वाइंडिंग इन्सुलेशन प्रतिरोध मेगर से जांचें' },
    ],
    realWorldApplications: [
      { en: 'Pumps, fans and compressors', hi: 'पंप, पंखे व कंप्रेसर' },
      { en: 'Conveyor and machine-tool drives', hi: 'कन्वेयर व मशीन-टूल ड्राइव' },
    ],
  },

  /* ---------- MODULE 17 — AC Motor Maintenance ---------- */
  17: {
    keyTopics: [
      { en: 'Starters — DOL, star-delta, auto-transformer', hi: 'स्टार्टर — DOL, स्टार-डेल्टा, ऑटो-ट्रांसफॉर्मर' },
      { en: 'Rotor-resistance starter (slip-ring)', hi: 'रोटर-प्रतिरोध स्टार्टर (स्लिप-रिंग)' },
      { en: 'Single-phase motors — split-phase, capacitor-start', hi: 'सिंगल-फेज मोटर — स्प्लिट-फेज, कैपेसिटर-स्टार्ट' },
      { en: 'Fault finding & bearing maintenance', hi: 'दोष खोज व बियरिंग रखरखाव' },
      { en: 'Reversing direction of rotation', hi: 'घूर्णन दिशा उलटना' },
    ],
    theory: {
      en: 'Induction motors draw 5–7 times full-load current at start, so starters are used. A DOL starter connects the motor directly and suits small motors up to ~5 HP. A star-delta starter begins in star (reducing starting current and torque to one-third) then switches to delta for running. Single-phase motors need an auxiliary winding — split-phase or capacitor-start — to create the rotating field and self-start. Swapping any two supply leads reverses a three-phase motor. Good maintenance keeps bearings greased and terminals tight.',
      hi: 'प्रेरण मोटर प्रारंभ में पूर्ण-लोड धारा का 5–7 गुना लेती है, अतः स्टार्टर प्रयोग होते हैं। DOL स्टार्टर मोटर को सीधे जोड़ता है व ~5 HP तक छोटी मोटरों हेतु उपयुक्त है। स्टार-डेल्टा स्टार्टर स्टार में शुरू (प्रारंभिक धारा व बलाघूर्ण एक-तिहाई) फिर चलने हेतु डेल्टा में बदलता है। सिंगल-फेज मोटर को घूर्णन क्षेत्र व स्व-प्रारंभ हेतु सहायक वाइंडिंग — स्प्लिट-फेज या कैपेसिटर-स्टार्ट — चाहिए। कोई दो आपूर्ति लीड बदलने से तीन-फेज मोटर उलटती है। अच्छा रखरखाव बियरिंग ग्रीस व टर्मिनल टाइट रखता है।',
    },
    formulas: [
      { name: { en: 'Star-delta current', hi: 'स्टार-डेल्टा धारा' }, formula: 'I_star = I_delta / 3', description: { en: 'Starting current cut to ⅓', hi: 'प्रारंभिक धारा ⅓' } },
    ],
    practiceQuestions: [
      { q: { en: 'A star-delta starter reduces the starting current to about:', hi: 'स्टार-डेल्टा स्टार्टर प्रारंभिक धारा घटाता है लगभग:' },
        options: [{ en: '1/2', hi: '1/2' }, { en: '1/3', hi: '1/3' }, { en: '1/√3', hi: '1/√3' }, { en: 'Same', hi: 'समान' }], correct: 1,
        explanation: { en: 'Starting in star cuts both line current and torque to one-third of DOL values.', hi: 'स्टार में प्रारंभ धारा व बलाघूर्ण दोनों DOL का एक-तिहाई करता है।' } },
      { q: { en: 'How do you reverse a 3-phase induction motor?', hi: '3-फेज प्रेरण मोटर कैसे उलटें?' },
        options: [{ en: 'Swap any two supply leads', hi: 'कोई दो आपूर्ति लीड बदलें' }, { en: 'Add a capacitor', hi: 'कैपेसिटर जोड़ें' }, { en: 'Increase voltage', hi: 'वोल्टेज बढ़ाएं' }, { en: 'Reverse neutral', hi: 'न्यूट्रल उलटें' }], correct: 0,
        explanation: { en: 'Interchanging any two of the three phases reverses the rotating field.', hi: 'तीन में से कोई दो फेज बदलने से घूर्णन क्षेत्र उलटता है।' } },
    ],
    safetyTips: [
      { en: 'Confirm the motor is isolated before swapping leads', hi: 'लीड बदलने से पहले मोटर आइसोलेट सुनिश्चित करें' },
    ],
    realWorldApplications: [
      { en: 'Industrial motor panels', hi: 'औद्योगिक मोटर पैनल' },
      { en: 'Agricultural pump sets', hi: 'कृषि पंप सेट' },
    ],
  },

  /* ---------- MODULE 18 — Alternator & MG Set ---------- */
  18: {
    keyTopics: [
      { en: 'Alternator construction & working', hi: 'अल्टरनेटर संरचना व कार्य' },
      { en: 'EMF equation & frequency', hi: 'EMF समीकरण व आवृत्ति' },
      { en: 'Voltage regulation', hi: 'वोल्टेज विनियमन' },
      { en: 'Motor-generator (MG) set', hi: 'मोटर-जनरेटर (MG) सेट' },
      { en: 'Exciter and AVR', hi: 'एक्साइटर व AVR' },
    ],
    theory: {
      en: 'An alternator (synchronous generator) produces AC. Usually the field rotates and the armature is stationary, so high-voltage output is taken from fixed terminals. The output frequency depends on poles and speed: f = PN/120, so a 4-pole alternator must run at 1500 rpm for 50 Hz. Voltage regulation is the rise in terminal voltage from full load to no load. An MG set couples a motor to a generator to convert one supply form to another, and an AVR holds the output voltage steady as load changes.',
      hi: 'अल्टरनेटर (तुल्यकाली जनरेटर) AC बनाता है। प्रायः फील्ड घूमता है व आर्मेचर स्थिर, अतः उच्च-वोल्टेज आउटपुट स्थिर टर्मिनल से लिया जाता है। आउटपुट आवृत्ति ध्रुव व गति पर निर्भर: f = PN/120, अतः 4-ध्रुव अल्टरनेटर 50 Hz हेतु 1500 rpm पर चले। वोल्टेज विनियमन पूर्ण लोड से नो लोड तक टर्मिनल वोल्टेज वृद्धि है। MG सेट मोटर को जनरेटर से जोड़कर एक आपूर्ति रूप को दूसरे में बदलता है, व AVR लोड बदलने पर आउटपुट वोल्टेज स्थिर रखता है।',
    },
    formulas: [
      { name: { en: 'Frequency', hi: 'आवृत्ति' }, formula: 'f = P·N / 120', description: { en: 'P poles, N rpm', hi: 'P ध्रुव, N rpm' } },
      { name: { en: 'EMF', hi: 'EMF' }, formula: 'E = 4.44 f Φ T', description: { en: 'Per phase (× winding factors)', hi: 'प्रति फेज (× वाइंडिंग गुणक)' } },
    ],
    practiceQuestions: [
      { q: { en: 'A 6-pole alternator for 50 Hz must run at:', hi: '50 Hz हेतु 6-ध्रुव अल्टरनेटर चले:' },
        options: [{ en: '1500 rpm', hi: '1500 rpm' }, { en: '1000 rpm', hi: '1000 rpm' }, { en: '3000 rpm', hi: '3000 rpm' }, { en: '600 rpm', hi: '600 rpm' }], correct: 1,
        explanation: { en: 'N = 120f/P = 120×50/6 = 1000 rpm.', hi: 'N = 120f/P = 120×50/6 = 1000 rpm।' } },
      { q: { en: 'In most alternators the rotating part is the:', hi: 'अधिकांश अल्टरनेटर में घूमने वाला भाग है:' },
        options: [{ en: 'Armature', hi: 'आर्मेचर' }, { en: 'Field', hi: 'फील्ड' }, { en: 'Stator core', hi: 'स्टेटर कोर' }, { en: 'Terminals', hi: 'टर्मिनल' }], correct: 1,
        explanation: { en: 'The field rotates so high-voltage armature output is taken from the stationary stator.', hi: 'फील्ड घूमता है ताकि उच्च-वोल्टेज आउटपुट स्थिर स्टेटर से लिया जाए।' } },
    ],
    safetyTips: [
      { en: 'Never touch alternator terminals until the exciter is fully de-energised', hi: 'एक्साइटर पूर्ण डी-एनर्जाइज होने तक अल्टरनेटर टर्मिनल न छुएं' },
    ],
    realWorldApplications: [
      { en: 'Diesel generator sets', hi: 'डीजल जनरेटर सेट' },
      { en: 'Power-house generation', hi: 'पावर-हाउस उत्पादन' },
    ],
  },

  /* ---------- MODULE 19 — Parallel Operation ---------- */
  19: {
    keyTopics: [
      { en: 'Need for parallel operation', hi: 'समानांतर संचालन की आवश्यकता' },
      { en: 'Conditions for synchronising', hi: 'सिंक्रोनाइज़िंग की शर्तें' },
      { en: 'Lamp methods — dark & bright', hi: 'लैंप विधियां — डार्क व ब्राइट' },
      { en: 'Synchroscope', hi: 'सिंक्रोस्कोप' },
      { en: 'Load sharing between alternators', hi: 'अल्टरनेटरों के बीच लोड साझाकरण' },
    ],
    theory: {
      en: 'Large stations run several alternators in parallel to share load and allow maintenance without a shutdown. Before connecting a machine to the bus, four conditions must match: the same voltage, the same frequency, the same phase sequence and the correct phase angle. Synchronising is checked with three lamps (dark or bright-lamp method) or a synchroscope that shows when the incoming machine is in step. Once synchronised, load is shared by adjusting the prime-mover governor and the excitation.',
      hi: 'बड़े स्टेशन कई अल्टरनेटर समानांतर में चलाते हैं ताकि लोड साझा हो व बिना बंद किए रखरखाव हो। मशीन को बस से जोड़ने से पहले चार शर्तें मिलें: समान वोल्टेज, समान आवृत्ति, समान फेज क्रम व सही फेज कोण। सिंक्रोनाइज़िंग तीन लैंप (डार्क या ब्राइट-लैंप विधि) या सिंक्रोस्कोप से जांचते हैं जो दिखाता है कि आने वाली मशीन कब तालमेल में है। सिंक्रोनाइज़ होने पर लोड प्राइम-मूवर गवर्नर व उत्तेजन समायोजित कर साझा होता है।',
    },
    formulas: [],
    practiceQuestions: [
      { q: { en: 'Which is NOT required for synchronising alternators?', hi: 'अल्टरनेटर सिंक्रोनाइज़ करने हेतु किसकी आवश्यकता नहीं?' },
        options: [{ en: 'Same voltage', hi: 'समान वोल्टेज' }, { en: 'Same frequency', hi: 'समान आवृत्ति' }, { en: 'Same phase sequence', hi: 'समान फेज क्रम' }, { en: 'Same kVA rating', hi: 'समान kVA रेटिंग' }], correct: 3,
        explanation: { en: 'Ratings may differ; voltage, frequency and phase sequence must match.', hi: 'रेटिंग भिन्न हो सकती है; वोल्टेज, आवृत्ति व फेज क्रम मिलना चाहिए।' } },
      { q: { en: 'A synchroscope is used to check:', hi: 'सिंक्रोस्कोप किसकी जांच हेतु है:' },
        options: [{ en: 'Insulation', hi: 'इन्सुलेशन' }, { en: 'When machines are in phase', hi: 'मशीनें कब फेज में हैं' }, { en: 'Earth resistance', hi: 'अर्थ प्रतिरोध' }, { en: 'Power factor only', hi: 'केवल पावर फैक्टर' }], correct: 1,
        explanation: { en: 'It indicates the phase difference so the breaker is closed at the right instant.', hi: 'यह फेज अंतर दिखाता है ताकि ब्रेकर सही क्षण पर बंद हो।' } },
    ],
    safetyTips: [
      { en: 'Close the breaker only at the exact in-phase instant', hi: 'ब्रेकर केवल सटीक इन-फेज क्षण पर बंद करें' },
    ],
    realWorldApplications: [
      { en: 'Grid-connected generation', hi: 'ग्रिड-जुड़ा उत्पादन' },
      { en: 'Captive power plants', hi: 'कैप्टिव पावर प्लांट' },
    ],
  },

  /* ---------- MODULE 20 — Motor Winding ---------- */
  20: {
    keyTopics: [
      { en: 'Lap and wave windings', hi: 'लैप व वेव वाइंडिंग' },
      { en: 'Concentric & distributed windings', hi: 'कंसेंट्रिक व वितरित वाइंडिंग' },
      { en: 'Coil pitch, slot & pole pitch', hi: 'कॉइल पिच, स्लॉट व पोल पिच' },
      { en: 'Rewinding procedure', hi: 'रीवाइंडिंग प्रक्रिया' },
      { en: 'Insulation classes & varnishing', hi: 'इन्सुलेशन वर्ग व वार्निशिंग' },
    ],
    theory: {
      en: 'Motor winding is the skilled job of placing coils in the stator or armature slots in the right pattern. Pole pitch is the number of slots per pole; coil pitch is how many slots a coil spans. Distributed windings spread each phase over several slots to give a smoother field. Rewinding a burnt motor means recording the old data, removing the old coils, cleaning slots, winding new coils to the same turns and gauge, insulating, connecting, testing and varnishing. Insulation is graded by class (A, E, B, F, H) for its maximum temperature.',
      hi: 'मोटर वाइंडिंग एक कुशल कार्य है जिसमें कॉइल को स्टेटर या आर्मेचर स्लॉट में सही पैटर्न में रखा जाता है। पोल पिच प्रति ध्रुव स्लॉट संख्या है; कॉइल पिच बताती है कॉइल कितने स्लॉट घेरती है। वितरित वाइंडिंग प्रत्येक फेज को कई स्लॉट में फैलाकर चिकना क्षेत्र देती है। जली मोटर रीवाइंड करना अर्थात पुराना डेटा दर्ज करना, पुरानी कॉइल हटाना, स्लॉट साफ करना, समान टर्न व गेज की नई कॉइल बनाना, इन्सुलेट, कनेक्ट, परीक्षण व वार्निश। इन्सुलेशन अधिकतम तापमान हेतु वर्ग (A, E, B, F, H) में श्रेणीबद्ध है।',
    },
    formulas: [
      { name: { en: 'Pole pitch', hi: 'पोल पिच' }, formula: 'Pole pitch = slots / poles', description: { en: 'Slots spanned per pole', hi: 'प्रति ध्रुव स्लॉट' } },
    ],
    practiceQuestions: [
      { q: { en: 'Pole pitch of a 24-slot, 4-pole stator is:', hi: '24-स्लॉट, 4-ध्रुव स्टेटर की पोल पिच:' },
        options: [{ en: '4', hi: '4' }, { en: '6', hi: '6' }, { en: '8', hi: '8' }, { en: '12', hi: '12' }], correct: 1,
        explanation: { en: 'Pole pitch = 24/4 = 6 slots.', hi: 'पोल पिच = 24/4 = 6 स्लॉट।' } },
      { q: { en: 'Class F insulation withstands up to:', hi: 'क्लास F इन्सुलेशन सहता है:' },
        options: [{ en: '105 °C', hi: '105 °C' }, { en: '130 °C', hi: '130 °C' }, { en: '155 °C', hi: '155 °C' }, { en: '180 °C', hi: '180 °C' }], correct: 2,
        explanation: { en: 'Class F insulation is rated for 155 °C maximum temperature.', hi: 'क्लास F इन्सुलेशन 155 °C अधिकतम तापमान हेतु रेटेड है।' } },
    ],
    safetyTips: [
      { en: 'Record winding data before removing old coils', hi: 'पुरानी कॉइल हटाने से पहले वाइंडिंग डेटा दर्ज करें' },
    ],
    realWorldApplications: [
      { en: 'Motor rewinding workshops', hi: 'मोटर रीवाइंडिंग कार्यशाला' },
      { en: 'Pump and fan repair', hi: 'पंप व पंखा मरम्मत' },
    ],
  },

  /* ---------- MODULE 21 — Electronics ---------- */
  21: {
    keyTopics: [
      { en: 'Semiconductors & the p-n junction diode', hi: 'अर्धचालक व p-n संधि डायोड' },
      { en: 'Rectifiers & filters', hi: 'रेक्टिफायर व फिल्टर' },
      { en: 'Zener diode as regulator', hi: 'जेनर डायोड विनियामक' },
      { en: 'Transistor (NPN/PNP) & configurations', hi: 'ट्रांजिस्टर (NPN/PNP) व विन्यास' },
      { en: 'SCR, TRIAC & DIAC', hi: 'SCR, TRIAC व DIAC' },
    ],
    theory: {
      en: 'Electronics controls current with semiconductor devices. A diode conducts in one direction only and is the basis of rectifiers that turn AC into DC; a capacitor filter then smooths the output. A Zener diode works in reverse breakdown to hold a steady voltage. A transistor is a current-controlled switch and amplifier with three terminals — base, collector, emitter — used in common-emitter, base or collector configurations. Thyristors (SCR, TRIAC, DIAC) are latching power-control devices used in dimmers, speed controls and inverters.',
      hi: 'इलेक्ट्रॉनिक्स अर्धचालक उपकरणों से धारा नियंत्रित करता है। डायोड केवल एक दिशा में चालन करता है व रेक्टिफायर का आधार है जो AC को DC बनाता है; कैपेसिटर फिल्टर आउटपुट चिकना करता है। जेनर डायोड रिवर्स ब्रेकडाउन में स्थिर वोल्टेज रखता है। ट्रांजिस्टर एक धारा-नियंत्रित स्विच व प्रवर्धक है जिसमें तीन टर्मिनल — बेस, कलेक्टर, एमिटर — कॉमन-एमिटर, बेस या कलेक्टर विन्यास में प्रयुक्त। थायरिस्टर (SCR, TRIAC, DIAC) लैचिंग पावर-नियंत्रण उपकरण हैं जो डिमर, गति नियंत्रण व इन्वर्टर में प्रयुक्त होते हैं।',
    },
    formulas: [
      { name: { en: 'Half-wave Vdc', hi: 'हाफ-वेव Vdc' }, formula: 'Vdc = Vm / π', description: { en: 'One diode output', hi: 'एक डायोड आउटपुट' } },
      { name: { en: 'Full-wave Vdc', hi: 'फुल-वेव Vdc' }, formula: 'Vdc = 2Vm / π', description: { en: 'Both half-cycles used', hi: 'दोनों अर्ध-चक्र प्रयुक्त' } },
    ],
    practiceQuestions: [
      { q: { en: 'A device that conducts current in only one direction is a:', hi: 'केवल एक दिशा में धारा चलाने वाला उपकरण है:' },
        options: [{ en: 'Resistor', hi: 'प्रतिरोधक' }, { en: 'Diode', hi: 'डायोड' }, { en: 'Capacitor', hi: 'कैपेसिटर' }, { en: 'Inductor', hi: 'प्रेरक' }], correct: 1,
        explanation: { en: 'A diode conducts only when forward-biased, blocking reverse current.', hi: 'डायोड केवल अग्र-अभिनत होने पर चालन करता है, रिवर्स धारा रोकता है।' } },
      { q: { en: 'A Zener diode in a regulator is operated in:', hi: 'विनियामक में जेनर डायोड चलाया जाता है:' },
        options: [{ en: 'Forward bias', hi: 'अग्र अभिनति' }, { en: 'Reverse breakdown', hi: 'रिवर्स ब्रेकडाउन' }, { en: 'No bias', hi: 'बिना अभिनति' }, { en: 'Saturation', hi: 'संतृप्ति' }], correct: 1,
        explanation: { en: 'In reverse breakdown it holds a nearly constant voltage, giving regulation.', hi: 'रिवर्स ब्रेकडाउन में यह लगभग स्थिर वोल्टेज रखता है, विनियमन देता है।' } },
    ],
    safetyTips: [
      { en: 'Discharge filter capacitors before touching a power-supply board', hi: 'पावर-सप्लाई बोर्ड छूने से पहले फिल्टर कैपेसिटर डिस्चार्ज करें' },
    ],
    realWorldApplications: [
      { en: 'Power supplies & chargers', hi: 'पावर सप्लाई व चार्जर' },
      { en: 'LED drivers and dimmers', hi: 'LED ड्राइवर व डिमर' },
    ],
  },

  /* ---------- MODULE 22 — Control Cabinets ---------- */
  22: {
    keyTopics: [
      { en: 'Contactors, relays & timers', hi: 'कॉन्टैक्टर, रिले व टाइमर' },
      { en: 'Overload relay & protection', hi: 'ओवरलोड रिले व सुरक्षा' },
      { en: 'Control vs power circuit', hi: 'कंट्रोल बनाम पावर सर्किट' },
      { en: 'Push buttons & indicator lamps', hi: 'पुश बटन व संकेतक लैंप' },
      { en: 'Panel assembly & interlocking', hi: 'पैनल असेंबली व इंटरलॉकिंग' },
    ],
    theory: {
      en: 'A control cabinet houses the devices that start, stop and protect machines. A contactor is an electromagnetically operated switch that carries the heavy power circuit, while a low-current control circuit of push buttons and an auxiliary contact decides when its coil is energised. The classic start/stop "hold-on" circuit latches the contactor through its own auxiliary contact so the motor keeps running after the start button is released. An overload relay opens the control circuit if current stays too high. Interlocking stops two conflicting contactors (e.g. forward and reverse) from closing together.',
      hi: 'कंट्रोल कैबिनेट उन उपकरणों को रखता है जो मशीनें शुरू, बंद व सुरक्षित करते हैं। कॉन्टैक्टर एक विद्युतचुंबकीय स्विच है जो भारी पावर सर्किट वहन करता है, जबकि पुश बटन व सहायक संपर्क का कम-धारा कंट्रोल सर्किट तय करता है कि कॉइल कब एनर्जाइज हो। क्लासिक स्टार्ट/स्टॉप "होल्ड-ऑन" सर्किट कॉन्टैक्टर को अपने सहायक संपर्क से लैच करता है ताकि स्टार्ट बटन छोड़ने पर भी मोटर चलती रहे। ओवरलोड रिले धारा अधिक रहने पर कंट्रोल सर्किट खोलता है। इंटरलॉकिंग दो विरोधी कॉन्टैक्टर (जैसे आगे व पीछे) को एक साथ बंद होने से रोकता है।',
    },
    formulas: [],
    practiceQuestions: [
      { q: { en: 'In a DOL starter, the motor keeps running after releasing START because of:', hi: 'DOL स्टार्टर में START छोड़ने पर मोटर चलती रहती है:' },
        options: [{ en: 'A timer', hi: 'टाइमर' }, { en: 'The hold-on auxiliary contact', hi: 'होल्ड-ऑन सहायक संपर्क' }, { en: 'The fuse', hi: 'फ्यूज' }, { en: 'The overload', hi: 'ओवरलोड' }], correct: 1,
        explanation: { en: "The contactor's auxiliary NO contact bypasses the START button and holds the coil on.", hi: 'कॉन्टैक्टर का सहायक NO संपर्क START बटन को बायपास कर कॉइल ऑन रखता है।' } },
      { q: { en: 'The purpose of an overload relay is to:', hi: 'ओवरलोड रिले का उद्देश्य है:' },
        options: [{ en: 'Start the motor', hi: 'मोटर शुरू करना' }, { en: 'Protect against sustained overcurrent', hi: 'सतत अधिक-धारा से सुरक्षा' }, { en: 'Increase speed', hi: 'गति बढ़ाना' }, { en: 'Reverse rotation', hi: 'घूर्णन उलटना' }], correct: 1,
        explanation: { en: 'It trips the control circuit when current stays above the set value, saving the windings.', hi: 'यह धारा निर्धारित मान से ऊपर रहने पर कंट्रोल सर्किट ट्रिप करता है, वाइंडिंग बचाता है।' } },
    ],
    safetyTips: [
      { en: 'Isolate and verify dead before wiring inside a live panel', hi: 'लाइव पैनल में वायरिंग से पहले आइसोलेट कर मृत सत्यापित करें' },
    ],
    realWorldApplications: [
      { en: 'Motor control centres (MCC)', hi: 'मोटर कंट्रोल सेंटर (MCC)' },
      { en: 'Automation control panels', hi: 'ऑटोमेशन कंट्रोल पैनल' },
    ],
  },

  /* ---------- MODULE 23 — AC/DC Speed Control ---------- */
  23: {
    keyTopics: [
      { en: 'Why solid-state speed control', hi: 'सॉलिड-स्टेट गति नियंत्रण क्यों' },
      { en: 'DC drives — SCR & chopper (PWM)', hi: 'DC ड्राइव — SCR व चॉपर (PWM)' },
      { en: 'AC drives — VFD / VVVF (V/f control)', hi: 'AC ड्राइव — VFD / VVVF (V/f नियंत्रण)' },
      { en: 'Soft starters', hi: 'सॉफ्ट स्टार्टर' },
      { en: 'Duty cycle & average voltage', hi: 'ड्यूटी साइकिल व औसत वोल्टेज' },
    ],
    theory: {
      en: 'Solid-state drives control motor speed smoothly and efficiently. A DC chopper switches the supply on and off very fast (PWM); the average voltage, and so the speed, is set by the duty cycle. An AC variable-frequency drive (VFD) rectifies the mains to DC and then inverts it to a variable frequency; keeping the voltage-to-frequency (V/f) ratio constant maintains torque at all speeds. A soft starter ramps voltage up to limit inrush current during starting. These methods replace older, lossy resistance control.',
      hi: 'सॉलिड-स्टेट ड्राइव मोटर गति को सहजता व दक्षता से नियंत्रित करते हैं। DC चॉपर आपूर्ति को बहुत तेजी से ऑन/ऑफ करता है (PWM); औसत वोल्टेज, अतः गति, ड्यूटी साइकिल से तय होती है। AC वेरिएबल-फ्रीक्वेंसी ड्राइव (VFD) मेन्स को DC में बदल फिर परिवर्तनीय आवृत्ति में इन्वर्ट करता है; वोल्टेज-से-आवृत्ति (V/f) अनुपात स्थिर रखने से सभी गति पर बलाघूर्ण बना रहता है। सॉफ्ट स्टार्टर प्रारंभ में इनरश धारा सीमित करने हेतु वोल्टेज क्रमिक बढ़ाता है। ये विधियां पुराने, हानिकारक प्रतिरोध नियंत्रण की जगह लेती हैं।',
    },
    formulas: [
      { name: { en: 'PWM average', hi: 'PWM औसत' }, formula: 'Vavg = D × Vdc', description: { en: 'D = duty cycle', hi: 'D = ड्यूटी साइकिल' } },
      { name: { en: 'V/f ratio', hi: 'V/f अनुपात' }, formula: 'V / f = constant', description: { en: 'Keeps flux & torque steady', hi: 'फ्लक्स व बलाघूर्ण स्थिर रखता है' } },
    ],
    practiceQuestions: [
      { q: { en: 'In a VFD, constant torque is maintained by keeping constant:', hi: 'VFD में स्थिर बलाघूर्ण किसे स्थिर रख बनाए रखा जाता है:' },
        options: [{ en: 'Voltage only', hi: 'केवल वोल्टेज' }, { en: 'Frequency only', hi: 'केवल आवृत्ति' }, { en: 'V/f ratio', hi: 'V/f अनुपात' }, { en: 'Current', hi: 'धारा' }], correct: 2,
        explanation: { en: 'Holding V/f constant keeps the air-gap flux and hence torque constant across speeds.', hi: 'V/f स्थिर रखने से एयर-गैप फ्लक्स व बलाघूर्ण सभी गति पर स्थिर रहता है।' } },
      { q: { en: 'At 40% duty cycle on a 24 V chopper, average output is:', hi: '24 V चॉपर पर 40% ड्यूटी पर औसत आउटपुट:' },
        options: [{ en: '24 V', hi: '24 V' }, { en: '9.6 V', hi: '9.6 V' }, { en: '14.4 V', hi: '14.4 V' }, { en: '4.8 V', hi: '4.8 V' }], correct: 1,
        explanation: { en: 'Vavg = 0.40 × 24 = 9.6 V.', hi: 'Vavg = 0.40 × 24 = 9.6 V।' } },
    ],
    safetyTips: [
      { en: 'VFD DC-bus capacitors stay charged — wait for discharge before servicing', hi: 'VFD DC-बस कैपेसिटर चार्ज रहते हैं — सर्विस से पहले डिस्चार्ज की प्रतीक्षा करें' },
    ],
    realWorldApplications: [
      { en: 'Conveyor and pump speed control', hi: 'कन्वेयर व पंप गति नियंत्रण' },
      { en: 'HVAC fan drives', hi: 'HVAC पंखा ड्राइव' },
    ],
  },

  /* ---------- MODULE 24 — Inverter, UPS & Charger ---------- */
  24: {
    keyTopics: [
      { en: 'Inverter working & waveform types', hi: 'इन्वर्टर कार्य व तरंगरूप प्रकार' },
      { en: 'UPS — offline, line-interactive, online', hi: 'UPS — ऑफलाइन, लाइन-इंटरैक्टिव, ऑनलाइन' },
      { en: 'Battery charger circuits', hi: 'बैटरी चार्जर सर्किट' },
      { en: 'Voltage stabiliser', hi: 'वोल्टेज स्टेबलाइज़र' },
      { en: 'Emergency light', hi: 'इमरजेंसी लाइट' },
    ],
    theory: {
      en: 'An inverter converts DC from a battery into AC for appliances. Output may be square wave, modified sine or pure sine; pure sine is cleanest and safest for motors and electronics. A UPS gives backup during a mains failure: an offline UPS switches over in a few milliseconds, while an online (double-conversion) UPS supplies the load through the inverter continuously with zero transfer time. A charger refills the battery, and a stabiliser corrects high or low mains voltage for sensitive loads.',
      hi: 'इन्वर्टर बैटरी के DC को उपकरणों हेतु AC में बदलता है। आउटपुट स्क्वायर वेव, मॉडिफाइड साइन या प्योर साइन हो सकता है; प्योर साइन मोटर व इलेक्ट्रॉनिक्स हेतु सबसे साफ व सुरक्षित है। UPS मेन्स विफलता पर बैकअप देता है: ऑफलाइन UPS कुछ मिलीसेकंड में स्विच करता है, जबकि ऑनलाइन (डबल-कन्वर्जन) UPS लोड को इन्वर्टर से निरंतर शून्य ट्रांसफर समय के साथ आपूर्ति करता है। चार्जर बैटरी भरता है, व स्टेबलाइज़र संवेदनशील लोड हेतु उच्च/निम्न मेन्स वोल्टेज सुधारता है।',
    },
    formulas: [],
    practiceQuestions: [
      { q: { en: 'Which inverter output is best for sensitive electronics?', hi: 'संवेदनशील इलेक्ट्रॉनिक्स हेतु कौन सा इन्वर्टर आउटपुट सर्वोत्तम?' },
        options: [{ en: 'Square wave', hi: 'स्क्वायर वेव' }, { en: 'Modified sine', hi: 'मॉडिफाइड साइन' }, { en: 'Pure sine', hi: 'प्योर साइन' }, { en: 'DC', hi: 'DC' }], correct: 2,
        explanation: { en: 'Pure sine wave has the least harmonic distortion, so it is safest for electronics and motors.', hi: 'प्योर साइन वेव में सबसे कम हार्मोनिक विकृति होती है, अतः इलेक्ट्रॉनिक्स व मोटर हेतु सुरक्षित।' } },
      { q: { en: 'An online UPS has a transfer time of:', hi: 'ऑनलाइन UPS का ट्रांसफर समय है:' },
        options: [{ en: 'About 10 ms', hi: 'लगभग 10 ms' }, { en: 'Zero', hi: 'शून्य' }, { en: '1 second', hi: '1 सेकंड' }, { en: '5 seconds', hi: '5 सेकंड' }], correct: 1,
        explanation: { en: 'The load is always fed through the inverter, so there is no switchover gap.', hi: 'लोड हमेशा इन्वर्टर से मिलता है, अतः कोई स्विचओवर अंतराल नहीं।' } },
    ],
    safetyTips: [
      { en: 'Inverter output is live even during a power cut — treat it as mains', hi: 'बिजली कटौती में भी इन्वर्टर आउटपुट लाइव है — इसे मेन्स मानें' },
    ],
    realWorldApplications: [
      { en: 'Home and office power backup', hi: 'घर व कार्यालय पावर बैकअप' },
      { en: 'Data-centre UPS systems', hi: 'डेटा-सेंटर UPS सिस्टम' },
    ],
  },

  /* ---------- MODULE 25 — Solar Installation ---------- */
  25: {
    keyTopics: [
      { en: 'PV module, string & array', hi: 'PV मॉड्यूल, स्ट्रिंग व ऐरे' },
      { en: 'Charge controller — PWM vs MPPT', hi: 'चार्ज कंट्रोलर — PWM बनाम MPPT' },
      { en: 'Battery bank & inverter', hi: 'बैटरी बैंक व इन्वर्टर' },
      { en: 'On-grid, off-grid & hybrid systems', hi: 'ऑन-ग्रिड, ऑफ-ग्रिड व हाइब्रिड सिस्टम' },
      { en: 'System sizing & mounting', hi: 'सिस्टम आकार व माउंटिंग' },
    ],
    theory: {
      en: 'A solar PV system turns sunlight into usable electricity. Modules are joined in series (strings) to raise voltage and in parallel to raise current, forming an array. A charge controller protects the battery; an MPPT controller continuously operates the array at its maximum power point and harvests more energy than a simple PWM type. Off-grid systems store energy in batteries, on-grid systems feed surplus back to the utility through a grid-tie inverter, and hybrid systems do both. Correct sizing matches panel wattage, battery capacity and inverter rating to the daily load.',
      hi: 'सोलर PV सिस्टम सूर्य प्रकाश को उपयोगी बिजली में बदलता है। मॉड्यूल श्रेणी (स्ट्रिंग) में जुड़कर वोल्टेज व समानांतर में धारा बढ़ाते हैं, ऐरे बनाते हैं। चार्ज कंट्रोलर बैटरी सुरक्षित करता है; MPPT कंट्रोलर ऐरे को उसके अधिकतम पावर बिंदु पर निरंतर चलाकर साधारण PWM से अधिक ऊर्जा संचित करता है। ऑफ-ग्रिड सिस्टम ऊर्जा बैटरी में रखते हैं, ऑन-ग्रिड सिस्टम अधिशेष ग्रिड-टाई इन्वर्टर से उपयोगिता को देते हैं, व हाइब्रिड दोनों। सही आकार पैनल वाट, बैटरी क्षमता व इन्वर्टर रेटिंग को दैनिक लोड से मिलाता है।',
    },
    formulas: [
      { name: { en: 'Array power', hi: 'ऐरे शक्ति' }, formula: 'P = modules × Wp', description: { en: 'Total peak watts', hi: 'कुल शिखर वाट' } },
    ],
    practiceQuestions: [
      { q: { en: 'An MPPT charge controller is better than PWM because it:', hi: 'MPPT चार्ज कंट्रोलर PWM से बेहतर क्योंकि:' },
        options: [{ en: 'Is cheaper', hi: 'सस्ता है' }, { en: 'Harvests maximum power from the panel', hi: 'पैनल से अधिकतम शक्ति लेता है' }, { en: 'Needs no battery', hi: 'बैटरी की आवश्यकता नहीं' }, { en: 'Works at night', hi: 'रात में काम करता है' }], correct: 1,
        explanation: { en: 'MPPT tracks the maximum power point, extracting more energy especially in cold/low light.', hi: 'MPPT अधिकतम पावर बिंदु ट्रैक करता है, विशेषकर ठंड/कम प्रकाश में अधिक ऊर्जा निकालता है।' } },
      { q: { en: 'To increase the voltage of a PV array, modules are connected in:', hi: 'PV ऐरे का वोल्टेज बढ़ाने हेतु मॉड्यूल जोड़ते हैं:' },
        options: [{ en: 'Parallel', hi: 'समानांतर' }, { en: 'Series', hi: 'श्रेणी' }, { en: 'Star', hi: 'स्टार' }, { en: 'Delta', hi: 'डेल्टा' }], correct: 1,
        explanation: { en: 'Series connection adds module voltages, like cells in a battery.', hi: 'श्रेणी कनेक्शन मॉड्यूल वोल्टेज जोड़ता है, बैटरी के सेल की तरह।' } },
    ],
    safetyTips: [
      { en: 'PV modules are live in daylight — cover them before wiring', hi: 'PV मॉड्यूल दिन में लाइव हैं — वायरिंग से पहले ढकें' },
    ],
    realWorldApplications: [
      { en: 'Rooftop solar plants', hi: 'रूफटॉप सोलर प्लांट' },
      { en: 'Solar water pumping', hi: 'सोलर जल पंपिंग' },
    ],
  },

  /* ---------- MODULE 26 — Power Distribution ---------- */
  26: {
    keyTopics: [
      { en: 'Generation → transmission → distribution', hi: 'उत्पादन → पारेषण → वितरण' },
      { en: 'Overhead vs underground lines', hi: 'ओवरहेड बनाम भूमिगत लाइन' },
      { en: 'Distribution transformer & service line', hi: 'वितरण ट्रांसफॉर्मर व सेवा लाइन' },
      { en: 'Substations', hi: 'सबस्टेशन' },
      { en: 'Smart grid & its components', hi: 'स्मार्ट ग्रिड व उसके घटक' },
    ],
    theory: {
      en: 'Electricity is generated at power stations, stepped up for long-distance transmission to cut I²R loss, then stepped down in stages for distribution to consumers. High transmission voltage means lower current and thinner, cheaper conductors. Overhead lines are cheap and easy to maintain; underground cables are safer and used in cities. A distribution transformer brings 11 kV down to 400/230 V for the service line to homes. A smart grid adds metering, sensors and two-way communication so supply and demand can be balanced and faults located quickly.',
      hi: 'बिजली पावर स्टेशन पर उत्पन्न होती है, लंबी दूरी पारेषण हेतु I²R हानि घटाने को स्टेप-अप, फिर उपभोक्ताओं तक वितरण हेतु चरणों में स्टेप-डाउन होती है। उच्च पारेषण वोल्टेज अर्थात कम धारा व पतले, सस्ते चालक। ओवरहेड लाइन सस्ती व रखरखाव आसान; भूमिगत केबल सुरक्षित व शहरों में प्रयुक्त। वितरण ट्रांसफॉर्मर 11 kV को घरों की सेवा लाइन हेतु 400/230 V में लाता है। स्मार्ट ग्रिड मीटरिंग, सेंसर व दो-तरफा संचार जोड़ता है ताकि आपूर्ति-मांग संतुलित व दोष शीघ्र पता हों।',
    },
    formulas: [
      { name: { en: 'Line loss', hi: 'लाइन हानि' }, formula: 'P_loss = I²R', description: { en: 'Falls sharply as current drops', hi: 'धारा घटने पर तेजी से घटती है' } },
    ],
    practiceQuestions: [
      { q: { en: 'Why is power transmitted at high voltage?', hi: 'बिजली उच्च वोल्टेज पर क्यों पारेषित होती है?' },
        options: [{ en: 'To reduce I²R losses', hi: 'I²R हानि घटाने' }, { en: 'To increase current', hi: 'धारा बढ़ाने' }, { en: 'For safety only', hi: 'केवल सुरक्षा हेतु' }, { en: 'To use thick wires', hi: 'मोटे तार हेतु' }], correct: 0,
        explanation: { en: 'Higher voltage means lower current, so I²R line losses fall dramatically.', hi: 'उच्च वोल्टेज अर्थात कम धारा, अतः I²R लाइन हानि बहुत घटती है।' } },
      { q: { en: 'A distribution transformer typically steps 11 kV down to:', hi: 'वितरण ट्रांसफॉर्मर प्रायः 11 kV को घटाता है:' },
        options: [{ en: '230/400 V', hi: '230/400 V' }, { en: '66 kV', hi: '66 kV' }, { en: '1.1 kV', hi: '1.1 kV' }, { en: '33 kV', hi: '33 kV' }], correct: 0,
        explanation: { en: 'It supplies the consumer service line at 400 V (3-phase) / 230 V (1-phase).', hi: 'यह उपभोक्ता सेवा लाइन को 400 V (3-फेज)/230 V (1-फेज) देता है।' } },
    ],
    safetyTips: [
      { en: 'Treat every overhead line as live; maintain statutory clearances', hi: 'हर ओवरहेड लाइन को लाइव मानें; वैधानिक दूरी बनाए रखें' },
    ],
    realWorldApplications: [
      { en: 'Line and service connections', hi: 'लाइन व सेवा कनेक्शन' },
      { en: 'Substation operation', hi: 'सबस्टेशन संचालन' },
    ],
  },

  /* ---------- MODULE 27 — Relays & Circuit Breakers ---------- */
  27: {
    keyTopics: [
      { en: 'Fuses & their ratings', hi: 'फ्यूज व उनकी रेटिंग' },
      { en: 'MCB, MCCB, ELCB/RCCB', hi: 'MCB, MCCB, ELCB/RCCB' },
      { en: 'Protective relays (thermal, magnetic)', hi: 'सुरक्षात्मक रिले (तापीय, चुंबकीय)' },
      { en: 'Circuit breakers — ACB, VCB, SF6, oil', hi: 'सर्किट ब्रेकर — ACB, VCB, SF6, ऑयल' },
      { en: 'Trip curves (Type B, C, D)', hi: 'ट्रिप वक्र (टाइप B, C, D)' },
    ],
    theory: {
      en: 'Protective devices disconnect a circuit during overload, short-circuit or earth fault. A fuse is the simplest — a wire that melts on overcurrent. An MCB combines a thermal element (slow overloads) and a magnetic element (instant short-circuit) and is reusable. An RCCB/ELCB detects the small leakage current of an earth fault and trips to prevent shock. MCBs are classed B, C and D by how many times rated current triggers instant tripping (3–5×, 5–10×, 10–20×), chosen to ride through a load\'s inrush. Large breakers (ACB, VCB, SF6) protect high-power circuits.',
      hi: 'सुरक्षात्मक उपकरण ओवरलोड, शॉर्ट-सर्किट या अर्थ फॉल्ट पर सर्किट काटते हैं। फ्यूज सबसे सरल है — अधिक-धारा पर पिघलने वाला तार। MCB तापीय तत्व (धीमे ओवरलोड) व चुंबकीय तत्व (तुरंत शॉर्ट-सर्किट) जोड़ता है व पुनः प्रयोग योग्य है। RCCB/ELCB अर्थ फॉल्ट की छोटी लीकेज धारा पहचान झटका रोकने हेतु ट्रिप करता है। MCB को B, C, D में वर्गीकृत किया जाता है कि रेटेड धारा के कितने गुना पर तुरंत ट्रिप हो (3–5×, 5–10×, 10–20×), लोड इनरश सहने हेतु चुने। बड़े ब्रेकर (ACB, VCB, SF6) उच्च-शक्ति सर्किट सुरक्षित करते हैं।',
    },
    formulas: [],
    practiceQuestions: [
      { q: { en: 'An RCCB mainly protects against:', hi: 'RCCB मुख्यतः किससे सुरक्षा देता है:' },
        options: [{ en: 'Overvoltage', hi: 'ओवरवोल्टेज' }, { en: 'Earth-leakage / shock', hi: 'अर्थ-लीकेज / झटका' }, { en: 'Low frequency', hi: 'कम आवृत्ति' }, { en: 'Harmonics', hi: 'हार्मोनिक्स' }], correct: 1,
        explanation: { en: 'It senses imbalance between live and neutral (leakage) and trips to prevent electric shock.', hi: 'यह लाइव व न्यूट्रल के असंतुलन (लीकेज) को पहचान झटका रोकने हेतु ट्रिप करता है।' } },
      { q: { en: 'A Type C MCB trips instantly between:', hi: 'टाइप C MCB तुरंत ट्रिप करता है:' },
        options: [{ en: '3–5× In', hi: '3–5× In' }, { en: '5–10× In', hi: '5–10× In' }, { en: '10–20× In', hi: '10–20× In' }, { en: '1–2× In', hi: '1–2× In' }], correct: 1,
        explanation: { en: 'Type C is 5–10× rated current — suited to moderately inductive loads.', hi: 'टाइप C रेटेड धारा का 5–10× — मध्यम प्रेरकीय लोड हेतु उपयुक्त।' } },
    ],
    safetyTips: [
      { en: 'Never replace a fuse with a higher rating or a wire', hi: 'फ्यूज को उच्च रेटिंग या तार से कभी न बदलें' },
      { en: 'Test the RCCB trip button periodically', hi: 'RCCB ट्रिप बटन समय-समय पर जांचें' },
    ],
    realWorldApplications: [
      { en: 'Domestic & industrial distribution boards', hi: 'घरेलू व औद्योगिक वितरण बोर्ड' },
      { en: 'Substation protection', hi: 'सबस्टेशन सुरक्षा' },
    ],
  },

  /* ---------- MODULE 28 — EV Charging Stations ---------- */
  28: {
    keyTopics: [
      { en: 'EV types — BEV, PHEV, HEV', hi: 'EV प्रकार — BEV, PHEV, HEV' },
      { en: 'Charging levels — AC (1/2) & DC fast', hi: 'चार्जिंग स्तर — AC (1/2) व DC फास्ट' },
      { en: 'Connectors — Type 2, CCS, CHAdeMO, Bharat', hi: 'कनेक्टर — टाइप 2, CCS, CHAdeMO, भारत' },
      { en: 'Charging station components', hi: 'चार्जिंग स्टेशन घटक' },
      { en: 'Safety, earthing & standards', hi: 'सुरक्षा, अर्थिंग व मानक' },
    ],
    theory: {
      en: 'Electric-vehicle charging transfers energy from the grid to the battery. AC charging uses the car\'s onboard charger and is slower (Level 1 ~3 kW, Level 2 ~7–22 kW); DC fast charging bypasses the onboard charger to feed the battery directly at 25–350 kW, filling 20–80% in minutes. Different connectors (Type 2, CCS2, CHAdeMO, Bharat AC/DC) suit different vehicles. A charging station needs protection, earthing, an energy meter and communication. Charge time is simply the energy required divided by the charger power.',
      hi: 'इलेक्ट्रिक-वाहन चार्जिंग ग्रिड से बैटरी तक ऊर्जा स्थानांतरित करती है। AC चार्जिंग कार के ऑनबोर्ड चार्जर का उपयोग करती है व धीमी है (लेवल 1 ~3 kW, लेवल 2 ~7–22 kW); DC फास्ट चार्जिंग ऑनबोर्ड चार्जर को बायपास कर बैटरी को सीधे 25–350 kW पर देती है, 20–80% मिनटों में भरती है। विभिन्न कनेक्टर (टाइप 2, CCS2, CHAdeMO, भारत AC/DC) विभिन्न वाहनों हेतु। चार्जिंग स्टेशन को सुरक्षा, अर्थिंग, ऊर्जा मीटर व संचार चाहिए। चार्ज समय = आवश्यक ऊर्जा ÷ चार्जर शक्ति।',
    },
    formulas: [
      { name: { en: 'Charge time', hi: 'चार्ज समय' }, formula: 't = energy(kWh) / power(kW)', description: { en: 'Approx, ignoring losses', hi: 'लगभग, हानि को छोड़कर' } },
    ],
    practiceQuestions: [
      { q: { en: 'DC fast charging is faster than AC because it:', hi: 'DC फास्ट चार्जिंग AC से तेज क्योंकि यह:' },
        options: [{ en: 'Uses the onboard charger', hi: 'ऑनबोर्ड चार्जर प्रयोग करती है' }, { en: 'Bypasses the onboard charger', hi: 'ऑनबोर्ड चार्जर बायपास करती है' }, { en: 'Uses lower power', hi: 'कम शक्ति प्रयोग करती है' }, { en: 'Needs no connector', hi: 'कनेक्टर की आवश्यकता नहीं' }], correct: 1,
        explanation: { en: 'DC charging feeds the battery directly at high power, skipping the limited onboard AC charger.', hi: 'DC चार्जिंग बैटरी को सीधे उच्च शक्ति पर देती है, सीमित ऑनबोर्ड AC चार्जर छोड़कर।' } },
      { q: { en: 'Charging a 40 kWh battery (20→80%) on a 24 kW charger takes about:', hi: '24 kW चार्जर पर 40 kWh बैटरी (20→80%) चार्ज में लगभग:' },
        options: [{ en: '15 min', hi: '15 मिनट' }, { en: '1 hour', hi: '1 घंटा' }, { en: '2 hours', hi: '2 घंटे' }, { en: '10 min', hi: '10 मिनट' }], correct: 1,
        explanation: { en: 'Energy = 40×0.6 = 24 kWh; time = 24/24 = 1 hour.', hi: 'ऊर्जा = 40×0.6 = 24 kWh; समय = 24/24 = 1 घंटा।' } },
    ],
    safetyTips: [
      { en: 'Ensure robust earthing and RCD protection at every charge point', hi: 'हर चार्ज पॉइंट पर मजबूत अर्थिंग व RCD सुरक्षा सुनिश्चित करें' },
    ],
    realWorldApplications: [
      { en: 'Public EV charging stations', hi: 'सार्वजनिक EV चार्जिंग स्टेशन' },
      { en: 'Home AC wall-box chargers', hi: 'होम AC वॉल-बॉक्स चार्जर' },
    ],
  },

  /* ---------- MODULE 29 — Engineering Drawing (Year 2) ---------- */
  29: {
    keyTopics: [
      { en: 'Machine winding diagrams', hi: 'मशीन वाइंडिंग आरेख' },
      { en: 'Control & power circuit diagrams', hi: 'कंट्रोल व पावर सर्किट आरेख' },
      { en: 'Panel layout drawings', hi: 'पैनल लेआउट आरेख' },
      { en: 'As-built & schematic standards', hi: 'एज-बिल्ट व योजनाबद्ध मानक' },
      { en: 'Reading cable schedules', hi: 'केबल शेड्यूल पढ़ना' },
    ],
    theory: {
      en: 'Second-year drawing moves from basic symbols to full machine and control documentation. A winding diagram shows how coils sit in slots and interconnect; a control diagram shows the logic of contactors, relays and push buttons separately from the power diagram that carries motor current. Panel layout drawings fix the physical position of every device for assembly. Being able to read and update these as-built drawings and cable schedules is essential for wiring, commissioning and fault finding on real installations.',
      hi: 'द्वितीय-वर्ष ड्राइंग मूल प्रतीकों से पूर्ण मशीन व कंट्रोल दस्तावेज़ीकरण तक जाती है। वाइंडिंग आरेख दिखाता है कॉइल स्लॉट में कैसे बैठते व जुड़ते हैं; कंट्रोल आरेख कॉन्टैक्टर, रिले व पुश बटन का तर्क पावर आरेख (मोटर धारा) से अलग दिखाता है। पैनल लेआउट आरेख असेंबली हेतु हर उपकरण की भौतिक स्थिति तय करते हैं। इन एज-बिल्ट आरेख व केबल शेड्यूल को पढ़ना व अद्यतन करना वास्तविक इंस्टॉलेशन की वायरिंग, कमीशनिंग व दोष खोज हेतु आवश्यक है।',
    },
    formulas: [],
    practiceQuestions: [
      { q: { en: 'A control diagram is kept separate from the power diagram to:', hi: 'कंट्रोल आरेख पावर आरेख से अलग रखा जाता है ताकि:' },
        options: [{ en: 'Save paper', hi: 'कागज बचे' }, { en: 'Show the logic clearly', hi: 'तर्क स्पष्ट दिखे' }, { en: 'Hide wiring', hi: 'वायरिंग छिपे' }, { en: 'Reduce cost', hi: 'लागत घटे' }], correct: 1,
        explanation: { en: 'Separating low-current control logic from high-current power makes the circuit easy to read and fault-find.', hi: 'कम-धारा कंट्रोल तर्क को उच्च-धारा पावर से अलग करने से सर्किट पढ़ना व दोष खोज आसान होती है।' } },
      { q: { en: 'A cable schedule lists:', hi: 'केबल शेड्यूल सूचीबद्ध करता है:' },
        options: [{ en: 'Only prices', hi: 'केवल मूल्य' }, { en: 'Cable sizes, routes & terminations', hi: 'केबल आकार, मार्ग व टर्मिनेशन' }, { en: 'Motor speeds', hi: 'मोटर गति' }, { en: 'Lamp types', hi: 'लैंप प्रकार' }], correct: 1,
        explanation: { en: 'It documents each cable\'s size, from-to route and terminations for installation.', hi: 'यह इंस्टॉलेशन हेतु प्रत्येक केबल का आकार, मार्ग व टर्मिनेशन दर्ज करता है।' } },
    ],
    safetyTips: [
      { en: 'Always work to the latest revision of a drawing', hi: 'हमेशा आरेख के नवीनतम संशोधन पर काम करें' },
    ],
    realWorldApplications: [
      { en: 'Panel manufacturing', hi: 'पैनल निर्माण' },
      { en: 'Industrial commissioning', hi: 'औद्योगिक कमीशनिंग' },
    ],
  },

  /* ---------- MODULE 30 — Workshop Calc & Science (Year 2) ---------- */
  30: {
    keyTopics: [
      { en: 'Power factor & its improvement', hi: 'पावर फैक्टर व उसका सुधार' },
      { en: 'Transformer & motor efficiency', hi: 'ट्रांसफॉर्मर व मोटर दक्षता' },
      { en: 'Three-phase power calculations', hi: 'तीन-फेज शक्ति गणना' },
      { en: 'Estimation & costing', hi: 'अनुमान व लागत' },
      { en: 'Trigonometry for AC', hi: 'AC हेतु त्रिकोणमिति' },
    ],
    theory: {
      en: 'Second-year calculation applies maths to machines and installations. In AC, real power P = √3·VL·IL·cosφ for three-phase loads, where cosφ is the power factor. A low power factor draws extra current and is improved with capacitors. Efficiency compares output to input and is always below 100% because of copper and iron losses. Estimation and costing turn a drawing into a bill of materials and labour so a job can be quoted. Trigonometry links the voltage, resistance and reactance of an AC circuit through the impedance triangle.',
      hi: 'द्वितीय-वर्ष गणना गणित को मशीनों व इंस्टॉलेशन पर लागू करती है। AC में तीन-फेज लोड हेतु वास्तविक शक्ति P = √3·VL·IL·cosφ, जहां cosφ पावर फैक्टर है। कम पावर फैक्टर अतिरिक्त धारा लेता है व कैपेसिटर से सुधरता है। दक्षता आउटपुट की इनपुट से तुलना करती है व तांबा व लोहा हानि के कारण सदैव 100% से कम है। अनुमान व लागत आरेख को सामग्री व श्रम के बिल में बदलते हैं ताकि कार्य का मूल्य तय हो। त्रिकोणमिति AC सर्किट के वोल्टेज, प्रतिरोध व प्रतिघात को प्रतिबाधा त्रिभुज से जोड़ती है।',
    },
    formulas: [
      { name: { en: '3-phase power', hi: '3-फेज शक्ति' }, formula: 'P = √3·VL·IL·cosφ', description: { en: 'Real power in watts', hi: 'वास्तविक शक्ति वाट में' } },
      { name: { en: 'Power factor', hi: 'पावर फैक्टर' }, formula: 'cosφ = P / (VA)', description: { en: 'Real ÷ apparent power', hi: 'वास्तविक ÷ आभासी शक्ति' } },
      { name: { en: 'Efficiency', hi: 'दक्षता' }, formula: 'η = (Pout / Pin) × 100', description: { en: 'Always below 100%', hi: 'सदैव 100% से कम' } },
    ],
    practiceQuestions: [
      { q: { en: 'Power factor of a circuit is the ratio of:', hi: 'सर्किट का पावर फैक्टर अनुपात है:' },
        options: [{ en: 'Apparent/real power', hi: 'आभासी/वास्तविक शक्ति' }, { en: 'Real/apparent power', hi: 'वास्तविक/आभासी शक्ति' }, { en: 'Voltage/current', hi: 'वोल्टेज/धारा' }, { en: 'Current/voltage', hi: 'धारा/वोल्टेज' }], correct: 1,
        explanation: { en: 'PF = cosφ = real power (W) ÷ apparent power (VA).', hi: 'PF = cosφ = वास्तविक शक्ति (W) ÷ आभासी शक्ति (VA)।' } },
      { q: { en: 'Low power factor is usually corrected by connecting:', hi: 'कम पावर फैक्टर प्रायः सुधारा जाता है जोड़कर:' },
        options: [{ en: 'Inductors', hi: 'प्रेरक' }, { en: 'Capacitors', hi: 'कैपेसिटर' }, { en: 'Resistors', hi: 'प्रतिरोधक' }, { en: 'Diodes', hi: 'डायोड' }], correct: 1,
        explanation: { en: 'Shunt capacitors supply leading reactive power, raising a lagging power factor.', hi: 'शंट कैपेसिटर अग्रगामी प्रतिघाती शक्ति देते हैं, पिछड़े पावर फैक्टर को बढ़ाते हैं।' } },
    ],
    safetyTips: [
      { en: 'Discharge power-factor capacitors before handling', hi: 'पावर-फैक्टर कैपेसिटर संभालने से पहले डिस्चार्ज करें' },
    ],
    realWorldApplications: [
      { en: 'Load estimation & tendering', hi: 'लोड अनुमान व टेंडरिंग' },
      { en: 'Power-factor correction panels', hi: 'पावर-फैक्टर सुधार पैनल' },
    ],
  },
};
