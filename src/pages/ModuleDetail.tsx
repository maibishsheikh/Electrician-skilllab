import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';
import { getModuleSimulation } from '@/components/simulations';
import { moduleContentData } from '@/data/moduleContentData';

// Detailed content for each module's 7-stage learning journey
const moduleContent: Record<number, {
  icon: string;
  color: string;
  labLink?: string;
  keyTopics: { en: string; hi: string }[];
  theory: { en: string; hi: string };
  practiceQuestions: { q: { en: string; hi: string }; options: { en: string; hi: string }[]; correct: number; explanation: { en: string; hi: string } }[];
  safetyTips: { en: string; hi: string }[];
  realWorldApplications: { en: string; hi: string }[];
  formulas: { name: { en: string; hi: string }; formula: string; description: { en: string; hi: string } }[];
}> = {
  1: {
    icon: '🛡️',
    color: 'from-red-400 to-rose-500',
    labLink: '/labs/safety',
    keyTopics: [
      { en: 'Electrical shock prevention', hi: 'बिजली के झटके से बचाव' },
      { en: 'Personal Protective Equipment (PPE)', hi: 'व्यक्तिगत सुरक्षा उपकरण (PPE)' },
      { en: 'Fire safety in electrical workshop', hi: 'विद्युत कार्यशाला में अग्नि सुरक्षा' },
      { en: 'First aid for electric shock', hi: 'बिजली के झटके के लिए प्राथमिक चिकित्सा' },
      { en: 'IE Rules and safety standards', hi: 'IE नियम और सुरक्षा मानक' },
      { en: 'Lockout/Tagout procedures', hi: 'लॉकआउट/टैगआउट प्रक्रियाएं' },
    ],
    theory: {
      en: 'Workshop safety is the foundation of all electrical work. The Indian Electricity Rules (IE Rules, 2005) mandate specific safety practices for electrical installations. Electric shock occurs when current flows through the human body — as little as 30mA can cause ventricular fibrillation. The let-go current threshold for AC is about 10-16mA. Safety starts with proper PPE: rubber gloves (Class 00 to Class 4 rated for different voltages), safety shoes with insulated soles, safety goggles, and flame-resistant clothing. The 5 Golden Rules of electrical safety are: (1) Disconnect completely, (2) Secure against reconnection, (3) Verify absence of voltage, (4) Ground and short-circuit, (5) Protect against adjacent live parts.',
      hi: 'कार्यशाला सुरक्षा सभी विद्युत कार्यों की नींव है। भारतीय विद्युत नियम (IE नियम, 2005) विद्युत इंस्टॉलेशन के लिए विशिष्ट सुरक्षा प्रथाओं को अनिवार्य करते हैं। बिजली का झटका तब होता है जब शरीर से विद्युत धारा प्रवाहित होती है — 30mA जितनी कम धारा भी वेंट्रिकुलर फिब्रिलेशन का कारण बन सकती है। AC के लिए लेट-गो करंट सीमा लगभग 10-16mA है। सुरक्षा उचित PPE से शुरू होती है: रबर के दस्ताने (विभिन्न वोल्टेज के लिए क्लास 00 से क्लास 4), इंसुलेटेड सोल वाले सुरक्षा जूते, सेफ्टी गॉगल्स, और फ्लेम-रेसिस्टेंट कपड़े। विद्युत सुरक्षा के 5 सुनहरे नियम हैं: (1) पूरी तरह डिस्कनेक्ट करें, (2) पुनः कनेक्शन के विरुद्ध सुरक्षित करें, (3) वोल्टेज की अनुपस्थिति सत्यापित करें, (4) ग्राउंड और शॉर्ट-सर्किट करें, (5) आसन्न लाइव भागों से सुरक्षा करें।',
    },
    practiceQuestions: [
      {
        q: { en: 'What is the minimum current that can cause ventricular fibrillation?', hi: 'वेंट्रिकुलर फिब्रिलेशन का कारण बनने वाली न्यूनतम धारा कितनी है?' },
        options: [
          { en: '1 mA', hi: '1 mA' },
          { en: '10 mA', hi: '10 mA' },
          { en: '30 mA', hi: '30 mA' },
          { en: '100 mA', hi: '100 mA' },
        ],
        correct: 2,
        explanation: { en: 'As little as 30mA of current flowing through the heart can cause ventricular fibrillation, which is why RCCBs are rated at 30mA.', hi: 'हृदय से प्रवाहित 30mA जितनी कम धारा भी वेंट्रिकुलर फिब्रिलेशन का कारण बन सकती है, इसीलिए RCCB 30mA पर रेटेड होते हैं।' },
      },
      {
        q: { en: 'Which is the FIRST step in the 5 Golden Rules of electrical safety?', hi: '5 सुनहरे नियमों में पहला कदम क्या है?' },
        options: [
          { en: 'Ground and short-circuit', hi: 'ग्राउंड और शॉर्ट-सर्किट' },
          { en: 'Verify absence of voltage', hi: 'वोल्टेज की अनुपस्थिति सत्यापित करें' },
          { en: 'Disconnect completely', hi: 'पूरी तरह डिस्कनेक्ट करें' },
          { en: 'Protect against adjacent live parts', hi: 'आसन्न लाइव भागों से सुरक्षा' },
        ],
        correct: 2,
        explanation: { en: 'The first golden rule is to disconnect the equipment completely from all power sources before beginning any work.', hi: 'पहला सुनहरा नियम है कि कोई भी काम शुरू करने से पहले उपकरण को सभी बिजली स्रोतों से पूरी तरह डिस्कनेक्ट करें।' },
      },
    ],
    safetyTips: [
      { en: 'Always test your voltage tester on a known live source before and after use', hi: 'उपयोग से पहले और बाद में अपने वोल्टेज टेस्टर को ज्ञात लाइव स्रोत पर हमेशा परीक्षण करें' },
      { en: 'Never work on live circuits unless absolutely necessary and with proper authorization', hi: 'जब तक बिल्कुल आवश्यक न हो और उचित अनुमति न हो, लाइव सर्किट पर कभी काम न करें' },
      { en: 'Keep one hand in pocket while testing to prevent current path through heart', hi: 'परीक्षण करते समय एक हाथ जेब में रखें ताकि हृदय से धारा का रास्ता न बने' },
    ],
    realWorldApplications: [
      { en: 'Industrial electrical maintenance', hi: 'औद्योगिक विद्युत रखरखाव' },
      { en: 'Construction site safety compliance', hi: 'निर्माण स्थल सुरक्षा अनुपालन' },
      { en: 'Domestic wiring inspection', hi: 'घरेलू वायरिंग निरीक्षण' },
    ],
    formulas: [],
  },
  2: {
    icon: '🔗',
    color: 'from-green-400 to-emerald-500',
    labLink: '/labs/wire-joints',
    keyTopics: [
      { en: 'Types of wire joints — Straight, T, Western Union, Married', hi: 'तार जोड़ के प्रकार — सीधा, T, वेस्टर्न यूनियन, मैरिड' },
      { en: 'Wire stripping and preparation', hi: 'तार की स्ट्रिपिंग और तैयारी' },
      { en: 'Soldering techniques', hi: 'सोल्डरिंग तकनीकें' },
      { en: 'Cable types — THHN, XLPE, armoured', hi: 'केबल प्रकार — THHN, XLPE, आर्मर्ड' },
      { en: 'Continuity and insulation resistance testing', hi: 'कंटिन्युइटी और इन्सुलेशन प्रतिरोध परीक्षण' },
      { en: 'Crimping and compression joints', hi: 'क्रिम्पिंग और कम्प्रेशन जोड़' },
    ],
    theory: {
      en: 'Wire joints are essential for making secure electrical connections. A good joint must have low resistance, adequate mechanical strength, and proper insulation. The Straight Joint (also called a married joint or in-line splice) is used to extend wire length. The T-Joint (tee splice) connects a branch wire at right angles to a continuous run. The Western Union Joint provides maximum mechanical strength for overhead lines. For cable testing, a continuity test verifies an unbroken electrical path (resistance should be near 0Ω), while an insulation resistance test using a megger ensures insulation integrity (minimum 1MΩ per kV of working voltage as per IE Rules).',
      hi: 'तार जोड़ सुरक्षित विद्युत कनेक्शन बनाने के लिए आवश्यक हैं। एक अच्छे जोड़ में कम प्रतिरोध, पर्याप्त यांत्रिक शक्ति और उचित इन्सुलेशन होना चाहिए। सीधा जोड़ (मैरिड जोड़ या इन-लाइन स्प्लाइस) तार की लंबाई बढ़ाने के लिए उपयोग किया जाता है। T-जोड़ (टी स्प्लाइस) एक शाखा तार को निरंतर रन से समकोण पर जोड़ता है। वेस्टर्न यूनियन जोड़ ओवरहेड लाइनों के लिए अधिकतम यांत्रिक शक्ति प्रदान करता है। केबल परीक्षण के लिए, कंटिन्युइटी टेस्ट अखंड विद्युत पथ को सत्यापित करता है (प्रतिरोध लगभग 0Ω होना चाहिए), जबकि मेगर का उपयोग करके इन्सुलेशन प्रतिरोध परीक्षण इन्सुलेशन अखंडता सुनिश्चित करता है (IE नियमों के अनुसार कार्यशील वोल्टेज के प्रति kV न्यूनतम 1MΩ)।',
    },
    practiceQuestions: [
      {
        q: { en: 'Which wire joint is best suited for overhead transmission lines?', hi: 'ओवरहेड ट्रांसमिशन लाइनों के लिए कौन सा तार जोड़ सबसे उपयुक्त है?' },
        options: [
          { en: 'Straight joint', hi: 'सीधा जोड़' },
          { en: 'T-joint', hi: 'T-जोड़' },
          { en: 'Western Union joint', hi: 'वेस्टर्न यूनियन जोड़' },
          { en: 'Married joint', hi: 'मैरिड जोड़' },
        ],
        correct: 2,
        explanation: { en: 'Western Union joint provides maximum mechanical strength, making it ideal for overhead lines where the joint must bear the weight of the wire.', hi: 'वेस्टर्न यूनियन जोड़ अधिकतम यांत्रिक शक्ति प्रदान करता है, जो इसे ओवरहेड लाइनों के लिए आदर्श बनाता है जहां जोड़ को तार का भार सहना होता है।' },
      },
    ],
    safetyTips: [
      { en: 'Always de-energize circuits before making joints', hi: 'जोड़ बनाने से पहले सर्किट को हमेशा डी-एनर्जाइज करें' },
      { en: 'Use proper insulation tape — minimum 3 layers, half-overlap', hi: 'उचित इन्सुलेशन टेप का उपयोग करें — न्यूनतम 3 परतें, आधी ओवरलैप' },
    ],
    realWorldApplications: [
      { en: 'House wiring connections', hi: 'घर की वायरिंग कनेक्शन' },
      { en: 'Underground cable joints', hi: 'भूमिगत केबल जोड़' },
      { en: 'Control panel wiring', hi: 'कंट्रोल पैनल वायरिंग' },
    ],
    formulas: [
      {
        name: { en: 'Joint Resistance', hi: 'जोड़ प्रतिरोध' },
        formula: 'R_joint < 0.1 × R_wire',
        description: { en: 'A good joint should have resistance less than 10% of the wire resistance over the same length', hi: 'एक अच्छे जोड़ का प्रतिरोध समान लंबाई पर तार के प्रतिरोध के 10% से कम होना चाहिए' },
      },
    ],
  },
  3: {
    icon: '⚡',
    color: 'from-amber-400 to-orange-500',
    labLink: '/labs/circuit-simulator',
    keyTopics: [
      { en: 'Ohm\'s Law — V = IR', hi: 'ओम का नियम — V = IR' },
      { en: 'Kirchhoff\'s Current Law (KCL)', hi: 'किर्चहॉफ का धारा नियम (KCL)' },
      { en: 'Kirchhoff\'s Voltage Law (KVL)', hi: 'किर्चहॉफ का वोल्टेज नियम (KVL)' },
      { en: 'Series and parallel circuits', hi: 'श्रेणी और समानांतर सर्किट' },
      { en: 'Magnetic circuit concepts — MMF, Flux, Reluctance', hi: 'चुंबकीय सर्किट अवधारणाएं — MMF, फ्लक्स, रिलक्टेंस' },
      { en: 'Wheatstone Bridge', hi: 'व्हीटस्टोन ब्रिज' },
    ],
    theory: {
      en: 'Electrical circuits are the backbone of all electrical systems. Ohm\'s Law (V = IR) states that the voltage across a conductor is directly proportional to the current through it. Kirchhoff\'s Current Law says the sum of currents entering a node equals the sum leaving it. Kirchhoff\'s Voltage Law states that the sum of voltage drops around any closed loop equals zero. In series circuits, current is the same through all components (R_total = R1 + R2 + ...). In parallel circuits, voltage is the same across all branches (1/R_total = 1/R1 + 1/R2 + ...). Magnetic circuits follow analogous laws: MMF = Φ × Reluctance, similar to V = I × R.',
      hi: 'विद्युत सर्किट सभी विद्युत प्रणालियों की रीढ़ हैं। ओम का नियम (V = IR) कहता है कि एक चालक के बीच वोल्टेज उसमें से प्रवाहित धारा के सीधे आनुपातिक है। किर्चहॉफ का धारा नियम कहता है कि एक नोड में प्रवेश करने वाली धाराओं का योग निकलने वाली धाराओं के योग के बराबर होता है। किर्चहॉफ का वोल्टेज नियम कहता है कि किसी भी बंद लूप के चारों ओर वोल्टेज ड्रॉप का योग शून्य होता है।',
    },
    practiceQuestions: [
      {
        q: { en: 'Three resistors of 10Ω, 20Ω, and 30Ω are connected in series with a 12V battery. What is the total current?', hi: '10Ω, 20Ω, और 30Ω के तीन प्रतिरोधक 12V बैटरी के साथ श्रेणी में जुड़े हैं। कुल धारा क्या है?' },
        options: [
          { en: '0.2 A', hi: '0.2 A' },
          { en: '0.5 A', hi: '0.5 A' },
          { en: '1.2 A', hi: '1.2 A' },
          { en: '6.0 A', hi: '6.0 A' },
        ],
        correct: 0,
        explanation: { en: 'R_total = 10 + 20 + 30 = 60Ω. I = V/R = 12/60 = 0.2A', hi: 'R_कुल = 10 + 20 + 30 = 60Ω। I = V/R = 12/60 = 0.2A' },
      },
    ],
    safetyTips: [
      { en: 'Always start with the power off when modifying circuits', hi: 'सर्किट में बदलाव करते समय हमेशा बिजली बंद करके शुरू करें' },
    ],
    realWorldApplications: [
      { en: 'Load calculation for electrical panels', hi: 'विद्युत पैनल के लिए लोड गणना' },
      { en: 'Troubleshooting faulty circuits', hi: 'दोषपूर्ण सर्किट की समस्या निवारण' },
    ],
    formulas: [
      { name: { en: 'Ohm\'s Law', hi: 'ओम का नियम' }, formula: 'V = I × R', description: { en: 'Voltage = Current × Resistance', hi: 'वोल्टेज = धारा × प्रतिरोध' } },
      { name: { en: 'Power', hi: 'शक्ति' }, formula: 'P = V × I = I²R = V²/R', description: { en: 'Electrical power in watts', hi: 'वॉट में विद्युत शक्ति' } },
      { name: { en: 'Series Resistance', hi: 'श्रेणी प्रतिरोध' }, formula: 'R_total = R₁ + R₂ + R₃...', description: { en: 'Total resistance in series', hi: 'श्रेणी में कुल प्रतिरोध' } },
      { name: { en: 'Parallel Resistance', hi: 'समानांतर प्रतिरोध' }, formula: '1/R_total = 1/R₁ + 1/R₂ + 1/R₃...', description: { en: 'Total resistance in parallel', hi: 'समानांतर में कुल प्रतिरोध' } },
    ],
  },
  5: {
    icon: '🏠',
    color: 'from-cyan-400 to-teal-500',
    labLink: '/labs/wiring',
    keyTopics: [
      { en: 'Types of wiring — Cleat, Casing-Capping, Conduit', hi: 'वायरिंग के प्रकार — क्लीट, केसिंग-कैपिंग, कंड्यूट' },
      { en: 'Staircase wiring (2-way switching)', hi: 'सीढ़ी वायरिंग (2-तरफा स्विचिंग)' },
      { en: 'Godown wiring', hi: 'गोदाम वायरिंग' },
      { en: 'Tube light and fan circuits', hi: 'ट्यूब लाइट और पंखा सर्किट' },
      { en: 'Load estimation and wire sizing', hi: 'लोड अनुमान और तार आकार' },
    ],
    theory: {
      en: 'Domestic wiring systems include cleat wiring (cheapest, temporary), casing-capping (common in older buildings), and conduit wiring (safest, most common today — both concealed and surface). Staircase wiring uses two 2-way switches to control one lamp from two locations. Godown wiring extends this to control from multiple locations. The standard wire color code in India: Red/Yellow/Blue = Phase, Black = Neutral, Green/Green-Yellow = Earth.',
      hi: 'घरेलू वायरिंग सिस्टम में क्लीट वायरिंग (सबसे सस्ती, अस्थायी), केसिंग-कैपिंग (पुरानी इमारतों में आम), और कंड्यूट वायरिंग (सबसे सुरक्षित, आज सबसे आम — छुपी और सतह दोनों) शामिल हैं। सीढ़ी वायरिंग दो 2-वे स्विच का उपयोग करके दो स्थानों से एक लैंप को नियंत्रित करती है।',
    },
    practiceQuestions: [
      {
        q: { en: 'In staircase wiring, how many 2-way switches are required?', hi: 'सीढ़ी वायरिंग में कितने 2-वे स्विच की आवश्यकता होती है?' },
        options: [{ en: '1', hi: '1' }, { en: '2', hi: '2' }, { en: '3', hi: '3' }, { en: '4', hi: '4' }],
        correct: 1,
        explanation: { en: 'Staircase wiring requires exactly 2 two-way switches to control one lamp from two positions.', hi: 'सीढ़ी वायरिंग को दो स्थानों से एक लैंप को नियंत्रित करने के लिए बिल्कुल 2 दो-तरफा स्विच की आवश्यकता होती है।' },
      },
    ],
    safetyTips: [
      { en: 'Always connect earth wire to the earth terminal — never leave it disconnected', hi: 'अर्थ वायर को हमेशा अर्थ टर्मिनल से जोड़ें — इसे कभी डिस्कनेक्ट न छोड़ें' },
    ],
    realWorldApplications: [
      { en: 'Residential building electrical layout', hi: 'आवासीय भवन विद्युत लेआउट' },
      { en: 'Industrial godown lighting', hi: 'औद्योगिक गोदाम प्रकाश व्यवस्था' },
    ],
    formulas: [
      { name: { en: 'Wire Size (Indian Standard)', hi: 'तार आकार (भारतीय मानक)' }, formula: 'I = P / V', description: { en: 'Current capacity determines wire gauge (1.5mm² for 10A, 2.5mm² for 16A, 4mm² for 25A)', hi: 'धारा क्षमता तार गेज निर्धारित करती है (10A के लिए 1.5mm², 16A के लिए 2.5mm², 25A के लिए 4mm²)' } },
    ],
  },
  6: {
    icon: '🌍',
    color: 'from-yellow-500 to-amber-600',
    labLink: '/labs/earthing',
    keyTopics: [
      { en: 'Pipe earthing installation', hi: 'पाइप अर्थिंग इंस्टॉलेशन' },
      { en: 'Plate earthing installation', hi: 'प्लेट अर्थिंग इंस्टॉलेशन' },
      { en: 'Earth resistance measurement', hi: 'अर्थ प्रतिरोध माप' },
      { en: 'Earthing components and materials', hi: 'अर्थिंग घटक और सामग्री' },
      { en: 'IE Rules for earthing', hi: 'अर्थिंग के लिए IE नियम' },
    ],
    theory: {
      en: 'Earthing (grounding) connects non-current-carrying metal parts to earth to prevent electric shock. Pipe earthing uses a GI pipe (38mm dia, 2m long) buried in a pit filled with alternate layers of charcoal and salt. Plate earthing uses a copper plate (60×60cm, 3.15mm thick) or GI plate (60×60cm, 6.3mm thick). Earth resistance should be below 1Ω for large substations and below 5Ω for domestic installations as per IE Rules.',
      hi: 'अर्थिंग (ग्राउंडिंग) गैर-धारा-वाहक धातु भागों को पृथ्वी से जोड़ता है ताकि बिजली का झटका रोका जा सके। पाइप अर्थिंग एक GI पाइप (38mm व्यास, 2m लंबा) का उपयोग करता है जो चारकोल और नमक की वैकल्पिक परतों से भरे गड्ढे में दबाया जाता है।',
    },
    practiceQuestions: [
      {
        q: { en: 'What is the maximum permissible earth resistance for domestic installations per IE Rules?', hi: 'IE नियमों के अनुसार घरेलू इंस्टॉलेशन के लिए अधिकतम अनुमेय अर्थ प्रतिरोध क्या है?' },
        options: [{ en: '1 Ω', hi: '1 Ω' }, { en: '5 Ω', hi: '5 Ω' }, { en: '10 Ω', hi: '10 Ω' }, { en: '25 Ω', hi: '25 Ω' }],
        correct: 1,
        explanation: { en: 'As per IE Rules, earth resistance should be below 5Ω for domestic installations and below 1Ω for large substations.', hi: 'IE नियमों के अनुसार, अर्थ प्रतिरोध घरेलू इंस्टॉलेशन के लिए 5Ω से नीचे और बड़े सबस्टेशनों के लिए 1Ω से नीचे होना चाहिए।' },
      },
    ],
    safetyTips: [
      { en: 'Never bypass earthing connections — they are your last line of defense against shock', hi: 'अर्थिंग कनेक्शन को कभी बायपास न करें — वे झटके के खिलाफ आपकी अंतिम रक्षा पंक्ति हैं' },
    ],
    realWorldApplications: [
      { en: 'Building electrical installation', hi: 'भवन विद्युत इंस्टॉलेशन' },
      { en: 'Substation earthing grid', hi: 'सबस्टेशन अर्थिंग ग्रिड' },
    ],
    formulas: [
      { name: { en: 'Earth Resistance (Pipe)', hi: 'अर्थ प्रतिरोध (पाइप)' }, formula: 'R = ρ / (2πL) × ln(4L/d)', description: { en: 'ρ = soil resistivity, L = pipe length, d = pipe diameter', hi: 'ρ = मृदा प्रतिरोधकता, L = पाइप लंबाई, d = पाइप व्यास' } },
    ],
  },
  8: {
    icon: '📏',
    color: 'from-purple-400 to-violet-500',
    labLink: '/labs/measurement',
    keyTopics: [
      { en: 'Multimeter — analog and digital', hi: 'मल्टीमीटर — एनालॉग और डिजिटल' },
      { en: 'Megger — insulation resistance tester', hi: 'मेगर — इन्सुलेशन प्रतिरोध परीक्षक' },
      { en: 'Tong tester / Clamp meter', hi: 'टोंग टेस्टर / क्लैंप मीटर' },
      { en: 'Wattmeter connections', hi: 'वॉटमीटर कनेक्शन' },
      { en: 'Energy meter reading', hi: 'ऊर्जा मीटर रीडिंग' },
    ],
    theory: {
      en: 'Measuring instruments are essential for every electrician. A multimeter measures voltage, current, and resistance. For voltage measurement, connect in parallel (high internal resistance). For current measurement, connect in series (low internal resistance). A megger generates high DC voltage (500V/1000V/2500V) to measure insulation resistance. A clamp meter measures current without breaking the circuit using a current transformer principle.',
      hi: 'मापक यंत्र प्रत्येक इलेक्ट्रीशियन के लिए आवश्यक हैं। मल्टीमीटर वोल्टेज, करंट और प्रतिरोध मापता है।',
    },
    practiceQuestions: [
      {
        q: { en: 'How should a voltmeter be connected in a circuit?', hi: 'वोल्टमीटर को सर्किट में कैसे जोड़ना चाहिए?' },
        options: [
          { en: 'In series', hi: 'श्रेणी में' },
          { en: 'In parallel', hi: 'समानांतर में' },
          { en: 'Either series or parallel', hi: 'श्रेणी या समानांतर दोनों' },
          { en: 'Through a transformer', hi: 'ट्रांसफॉर्मर के माध्यम से' },
        ],
        correct: 1,
        explanation: { en: 'A voltmeter has very high internal resistance and must be connected in parallel across the component to measure voltage drop.', hi: 'वोल्टमीटर का आंतरिक प्रतिरोध बहुत अधिक होता है और वोल्टेज ड्रॉप मापने के लिए इसे घटक के समानांतर जोड़ना चाहिए।' },
      },
    ],
    safetyTips: [
      { en: 'Always start with the highest range on a multimeter and work down', hi: 'मल्टीमीटर पर हमेशा उच्चतम रेंज से शुरू करें और नीचे आएं' },
    ],
    realWorldApplications: [
      { en: 'Troubleshooting electrical faults', hi: 'विद्युत दोषों का समस्या निवारण' },
      { en: 'Periodic testing of installations', hi: 'इंस्टॉलेशन का आवधिक परीक्षण' },
    ],
    formulas: [
      { name: { en: 'Insulation Resistance', hi: 'इन्सुलेशन प्रतिरोध' }, formula: 'R_min = 1 MΩ × kV_rating', description: { en: 'Minimum insulation resistance per IE Rules', hi: 'IE नियमों के अनुसार न्यूनतम इन्सुलेशन प्रतिरोध' } },
    ],
  },
  11: {
    icon: '🔄',
    color: 'from-pink-400 to-fuchsia-500',
    labLink: '/labs/transformer',
    keyTopics: [
      { en: 'Transformer construction and working principle', hi: 'ट्रांसफॉर्मर निर्माण और कार्य सिद्धांत' },
      { en: 'EMF equation', hi: 'EMF समीकरण' },
      { en: 'Open Circuit (OC) test', hi: 'ओपन सर्किट (OC) परीक्षण' },
      { en: 'Short Circuit (SC) test', hi: 'शॉर्ट सर्किट (SC) परीक्षण' },
      { en: 'Turns ratio and transformation ratio', hi: 'टर्न अनुपात और रूपांतरण अनुपात' },
      { en: 'Efficiency and regulation', hi: 'दक्षता और विनियमन' },
    ],
    theory: {
      en: 'A transformer transfers electrical energy between circuits through electromagnetic induction. It has a primary winding, secondary winding, and laminated iron core. The turns ratio (N1/N2) determines the voltage ratio (V1/V2). Open Circuit test is performed on the LV side to find core losses (iron losses). Short Circuit test is performed on the HV side to find copper losses. Transformer efficiency = Output Power / Input Power × 100%. Maximum efficiency occurs when copper losses equal iron losses.',
      hi: 'ट्रांसफॉर्मर विद्युत चुंबकीय प्रेरण के माध्यम से सर्किटों के बीच विद्युत ऊर्जा स्थानांतरित करता है।',
    },
    practiceQuestions: [
      {
        q: { en: 'When does a transformer achieve maximum efficiency?', hi: 'ट्रांसफॉर्मर अधिकतम दक्षता कब प्राप्त करता है?' },
        options: [
          { en: 'At full load', hi: 'पूर्ण भार पर' },
          { en: 'When copper loss = iron loss', hi: 'जब कॉपर लॉस = आयरन लॉस' },
          { en: 'At no load', hi: 'बिना भार पर' },
          { en: 'At half load always', hi: 'हमेशा आधे भार पर' },
        ],
        correct: 1,
        explanation: { en: 'Maximum efficiency occurs when variable (copper) losses equal constant (iron) losses.', hi: 'अधिकतम दक्षता तब होती है जब परिवर्तनशील (कॉपर) हानियां स्थिर (आयरन) हानियों के बराबर होती हैं।' },
      },
    ],
    safetyTips: [
      { en: 'Never energize a transformer with secondary terminals shorted (unless SC test)', hi: 'सेकेंडरी टर्मिनल शॉर्ट होने पर ट्रांसफॉर्मर को कभी एनर्जाइज न करें (SC परीक्षण के अलावा)' },
    ],
    realWorldApplications: [
      { en: 'Power distribution substations', hi: 'विद्युत वितरण सबस्टेशन' },
      { en: 'Voltage regulation in buildings', hi: 'भवनों में वोल्टेज विनियमन' },
    ],
    formulas: [
      { name: { en: 'Turns Ratio', hi: 'टर्न अनुपात' }, formula: 'V₁/V₂ = N₁/N₂ = I₂/I₁', description: { en: 'Voltage ratio equals turns ratio', hi: 'वोल्टेज अनुपात टर्न अनुपात के बराबर होता है' } },
      { name: { en: 'EMF Equation', hi: 'EMF समीकरण' }, formula: 'E = 4.44 × f × N × Φ_m', description: { en: 'f=frequency, N=turns, Φ_m=max flux', hi: 'f=आवृत्ति, N=टर्न, Φ_m=अधिकतम फ्लक्स' } },
      { name: { en: 'Efficiency', hi: 'दक्षता' }, formula: 'η = (V₂I₂cosφ) / (V₂I₂cosφ + P_i + P_cu) × 100%', description: { en: 'P_i = iron loss, P_cu = copper loss', hi: 'P_i = आयरन हानि, P_cu = कॉपर हानि' } },
    ],
  },
};

// Generate basic content for modules that don't have detailed entries
function getDefaultContent(outcome: { id: number; title: string; titleHi: string }) {
  const icons = ['⚡', '🔧', '🔬', '📐', '🏭', '💡', '🔌', '📏', '🛠️', '🔋', '🔄', '📊', '🧮', '⚙️', '🏗️'];
  const colors = [
    'from-blue-400 to-indigo-500', 'from-green-400 to-emerald-500', 'from-amber-400 to-orange-500',
    'from-purple-400 to-violet-500', 'from-cyan-400 to-teal-500', 'from-pink-400 to-fuchsia-500',
    'from-red-400 to-rose-500', 'from-yellow-500 to-amber-600',
  ];
  return {
    icon: icons[outcome.id % icons.length],
    color: colors[outcome.id % colors.length],
    keyTopics: [
      { en: `Core concepts of ${outcome.title}`, hi: `${outcome.titleHi} की मूल अवधारणाएं` },
      { en: 'Practical applications and hands-on training', hi: 'व्यावहारिक अनुप्रयोग और हैंड्स-ऑन प्रशिक्षण' },
      { en: 'Safety considerations and best practices', hi: 'सुरक्षा विचार और सर्वोत्तम प्रथाएं' },
      { en: 'Industry standards and IE Rules', hi: 'उद्योग मानक और IE नियम' },
    ],
    theory: {
      en: `This module covers the fundamental concepts of ${outcome.title} as prescribed by the DGT (Directorate General of Training) curriculum for ITI Electrician trade. Students will learn both theoretical principles and practical skills required for professional electrical work in this domain.`,
      hi: `यह मॉड्यूल ITI इलेक्ट्रीशियन ट्रेड के लिए DGT (प्रशिक्षण महानिदेशालय) पाठ्यक्रम द्वारा निर्धारित ${outcome.titleHi} की मौलिक अवधारणाओं को कवर करता है। छात्र इस क्षेत्र में पेशेवर विद्युत कार्य के लिए आवश्यक सैद्धांतिक सिद्धांतों और व्यावहारिक कौशल दोनों सीखेंगे।`,
    },
    practiceQuestions: [],
    safetyTips: [
      { en: 'Always follow standard operating procedures', hi: 'हमेशा मानक संचालन प्रक्रियाओं का पालन करें' },
      { en: 'Wear appropriate PPE for the task', hi: 'कार्य के लिए उचित PPE पहनें' },
    ],
    realWorldApplications: [
      { en: 'Industrial applications', hi: 'औद्योगिक अनुप्रयोग' },
      { en: 'Domestic electrical work', hi: 'घरेलू विद्युत कार्य' },
    ],
    formulas: [],
  };
}

const STAGES = [
  { key: 'watch', icon: '📺', en: 'Watch', hi: 'देखें', desc: { en: 'Video explanation of concepts', hi: 'अवधारणाओं की वीडियो व्याख्या' } },
  { key: 'read', icon: '📖', en: 'Read', hi: 'पढ़ें', desc: { en: 'Detailed theory and notes', hi: 'विस्तृत सिद्धांत और नोट्स' } },
  { key: 'practice', icon: '✏️', en: 'Practice', hi: 'अभ्यास', desc: { en: 'Solve problems and exercises', hi: 'समस्याएं और अभ्यास हल करें' } },
  { key: 'simulate', icon: '🔬', en: 'Simulate', hi: 'सिमुलेट', desc: { en: 'Virtual lab experiments', hi: 'वर्चुअल लैब प्रयोग' } },
  { key: 'quiz', icon: '📝', en: 'Quiz', hi: 'क्विज़', desc: { en: 'Test your understanding', hi: 'अपनी समझ का परीक्षण करें' } },
  { key: 'apply', icon: '🔧', en: 'Apply', hi: 'लागू करें', desc: { en: 'Real-world application scenarios', hi: 'वास्तविक दुनिया के अनुप्रयोग परिदृश्य' } },
  { key: 'review', icon: '🔍', en: 'Review', hi: 'समीक्षा', desc: { en: 'Summary and revision', hi: 'सारांश और पुनरीक्षण' } },
];

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { outcomes, language, updateOutcomeStatus, addXP, completeLesson } = useAppStore();
  const [activeStage, setActiveStage] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const outcomeId = parseInt(id || '1');
  const outcome = outcomes.find((o) => o.id === outcomeId);

  if (!outcome) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="text-xl font-bold mb-2">{language === 'hi' ? 'मॉड्यूल नहीं मिला' : 'Module Not Found'}</h2>
        <Link to="/modules" className="btn-primary text-sm px-4 py-2 mt-4 inline-block">
          ← {language === 'hi' ? 'मॉड्यूल पर वापस जाएं' : 'Back to Modules'}
        </Link>
      </div>
    );
  }

  const baseContent = moduleContent[outcomeId] || getDefaultContent(outcome);
  const extraContent = moduleContentData[outcomeId];
  const content = extraContent ? { ...baseContent, ...extraContent } : baseContent;

  const handleStartLearning = () => {
    if (outcome.status === 'available') {
      updateOutcomeStatus(outcomeId, 'in_progress');
      addXP(10);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correctCount = content.practiceQuestions.reduce((acc, q, i) => {
      return acc + (quizAnswers[i] === q.correct ? 1 : 0);
    }, 0);
    const score = content.practiceQuestions.length > 0 ? Math.round((correctCount / content.practiceQuestions.length) * 100) : 0;
    if (score >= 60) {
      addXP(25);
      completeLesson(`module_${outcomeId}_quiz`);
    }
  };

  const handleCompleteModule = () => {
    updateOutcomeStatus(outcomeId, 'completed');
    addXP(50);
    completeLesson(`module_${outcomeId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/modules" className="mt-1 text-slate-400 hover:text-brand-500 transition-colors text-lg">
          ←
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{content.icon}</span>
            <div>
              <h1 className="text-xl font-bold leading-tight">
                {language === 'hi' ? outcome.titleHi : outcome.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' ? `मॉड्यूल ${outcomeId} • DGT पाठ्यक्रम` : `Module ${outcomeId} • DGT Curriculum`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {outcome.status === 'available' && (
            <button onClick={handleStartLearning} className="btn-primary text-xs px-4 py-2">
              {language === 'hi' ? '▶ शुरू करें' : '▶ Start'}
            </button>
          )}
          {outcome.status === 'in_progress' && (
            <button onClick={handleCompleteModule} className="text-xs px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
              ✅ {language === 'hi' ? 'पूर्ण करें' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>

      {/* 7-Stage Journey Navigation */}
      <div className="card p-3">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {STAGES.map((stage, i) => (
            <button
              key={stage.key}
              onClick={() => setActiveStage(i)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeStage === i
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'bg-slate-50 dark:bg-surface-dark-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{stage.icon}</span>
              <span>{language === 'hi' ? stage.hi : stage.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Content */}
      <div className="card p-5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          {STAGES[activeStage].icon} {language === 'hi' ? STAGES[activeStage].hi : STAGES[activeStage].en}
          <span className="text-xs font-normal text-slate-400">
            — {language === 'hi' ? STAGES[activeStage].desc.hi : STAGES[activeStage].desc.en}
          </span>
        </h2>

        {/* Watch Stage */}
        {activeStage === 0 && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center">
              <div className="text-6xl mb-4">📺</div>
              <p className="text-white/80 text-sm">
                {language === 'hi' ? 'वीडियो सामग्री — इस विषय पर DGT पाठ्यक्रम के अनुसार विस्तृत वीडियो व्याख्यान' : 'Video content — Detailed video lectures aligned with DGT curriculum on this topic'}
              </p>
              <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/10 text-white/60 text-xs">
                {language === 'hi' ? '🎬 वीडियो जल्द उपलब्ध होंगे' : '🎬 Videos coming soon'}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2">
                {language === 'hi' ? '📋 इस मॉड्यूल में शामिल विषय:' : '📋 Topics covered in this module:'}
              </h3>
              <ul className="space-y-1.5">
                {content.keyTopics.map((topic, i) => (
                  <li key={i} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {language === 'hi' ? topic.hi : topic.en}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Read Stage */}
        {activeStage === 1 && (
          <div className="space-y-5">
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {language === 'hi' ? content.theory.hi : content.theory.en}
              </div>
            </div>
            {content.formulas.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  📐 {language === 'hi' ? 'महत्वपूर्ण सूत्र' : 'Key Formulas'}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {content.formulas.map((f, i) => (
                    <div key={i} className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 border border-indigo-100 dark:border-indigo-800/30">
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                        {language === 'hi' ? f.name.hi : f.name.en}
                      </p>
                      <p className="font-mono text-lg font-bold text-indigo-900 dark:text-indigo-200">{f.formula}</p>
                      <p className="text-xs text-slate-500 mt-1">{language === 'hi' ? f.description.hi : f.description.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice Stage */}
        {activeStage === 2 && (
          <div className="space-y-4">
            {content.practiceQuestions.length > 0 ? (
              content.practiceQuestions.map((q, qi) => (
                <div key={qi} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="font-medium text-sm mb-3">
                    {language === 'hi' ? `प्रश्न ${qi + 1}: ${q.q.hi}` : `Q${qi + 1}: ${q.q.en}`}
                  </p>
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
                          className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-all ${
                            isCorrect
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : isWrong
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                              : isSelected
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
                          {language === 'hi' ? opt.hi : opt.en}
                          {isCorrect && ' ✅'}
                          {isWrong && ' ❌'}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className={`mt-3 p-3 rounded-lg text-xs ${quizAnswers[qi] === q.correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
                      💡 {language === 'hi' ? q.explanation.hi : q.explanation.en}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-4xl mb-3">✏️</p>
                <p className="text-sm">{language === 'hi' ? 'अभ्यास प्रश्न जल्द जोड़े जाएंगे' : 'Practice questions coming soon'}</p>
              </div>
            )}
            {content.practiceQuestions.length > 0 && !quizSubmitted && (
              <button onClick={handleQuizSubmit} className="btn-primary text-sm px-6 py-2">
                {language === 'hi' ? '📝 उत्तर जमा करें' : '📝 Submit Answers'}
              </button>
            )}
            {quizSubmitted && (
              <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} className="btn-secondary text-sm px-6 py-2">
                🔄 {language === 'hi' ? 'पुनः प्रयास' : 'Try Again'}
              </button>
            )}
          </div>
        )}

        {/* Simulate Stage — embedded interactive simulation */}
        {activeStage === 3 && (() => {
          const Sim = getModuleSimulation(outcomeId);
          return (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'hi'
                  ? '👇 नीचे दिए गए इंटरैक्टिव सिमुलेशन में मान बदलें और परिणाम वास्तविक समय में देखें।'
                  : '👇 Change the values in the interactive simulation below and watch the results respond in real time.'}
              </p>
              {Sim ? <Sim /> : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-4xl mb-3">🔬</p>
                  <p className="text-sm">{language === 'hi' ? 'सिमुलेशन जल्द आ रहा है' : 'Simulation coming soon'}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {content.labLink && (
                  <Link to={content.labLink} className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
                    🧪 {language === 'hi' ? 'पूरी लैब खोलें' : 'Open full lab'}
                  </Link>
                )}
                <Link to="/labs" className="btn-secondary text-sm px-5 py-2.5 inline-flex items-center gap-2">
                  {language === 'hi' ? 'सभी लैब देखें' : 'View all labs'}
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Quiz Stage */}
        {activeStage === 4 && (
          <div className="text-center py-8">
            <p className="text-6xl mb-4">📝</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {language === 'hi' ? 'मूल्यांकन परीक्षा में अपनी समझ का परीक्षण करें' : 'Test your understanding with the assessment quiz'}
            </p>
            <Link to="/assessments" className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">
              📋 {language === 'hi' ? 'मूल्यांकन शुरू करें' : 'Start Assessment'}
            </Link>
          </div>
        )}

        {/* Apply Stage */}
        {activeStage === 5 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              🌍 {language === 'hi' ? 'वास्तविक दुनिया के अनुप्रयोग' : 'Real-World Applications'}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.realWorldApplications.map((app, i) => (
                <div key={i} className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 border border-emerald-100 dark:border-emerald-800/30">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {language === 'hi' ? app.hi : app.en}
                  </p>
                </div>
              ))}
            </div>
            <h3 className="font-semibold text-sm flex items-center gap-2 mt-6">
              ⚠️ {language === 'hi' ? 'सुरक्षा सुझाव' : 'Safety Tips'}
            </h3>
            <div className="space-y-2">
              {content.safetyTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-800/30">
                  <span className="text-amber-500 mt-0.5">⚠️</span>
                  <p className="text-sm text-amber-800 dark:text-amber-300">{language === 'hi' ? tip.hi : tip.en}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Stage */}
        {activeStage === 6 && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-brand-100 dark:border-brand-800/30">
              <h3 className="font-bold text-sm mb-3">{language === 'hi' ? '📋 मुख्य बिंदु सारांश' : '📋 Key Points Summary'}</h3>
              <ul className="space-y-2">
                {content.keyTopics.map((topic, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-brand-500 font-bold">{i + 1}.</span>
                    <span>{language === 'hi' ? topic.hi : topic.en}</span>
                  </li>
                ))}
              </ul>
            </div>
            {content.formulas.length > 0 && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
                <h3 className="font-bold text-sm mb-2">{language === 'hi' ? '📐 सूत्र पुनरीक्षण' : '📐 Formula Revision'}</h3>
                <div className="space-y-1">
                  {content.formulas.map((f, i) => (
                    <p key={i} className="text-sm font-mono">
                      <span className="text-indigo-600 dark:text-indigo-400">{language === 'hi' ? f.name.hi : f.name.en}:</span> {f.formula}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {outcome.status !== 'completed' && (
              <button onClick={handleCompleteModule} className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2 mx-auto">
                ✅ {language === 'hi' ? 'मॉड्यूल पूर्ण करें (+50 XP)' : 'Complete Module (+50 XP)'}
              </button>
            )}
            {outcome.status === 'completed' && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-2xl mb-1">🎉</p>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {language === 'hi' ? 'यह मॉड्यूल पूरा हो चुका है!' : 'This module is completed!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
          disabled={activeStage === 0}
          className="btn-secondary text-xs px-4 py-2 disabled:opacity-30"
        >
          ← {language === 'hi' ? 'पिछला चरण' : 'Previous Stage'}
        </button>
        <button
          onClick={() => setActiveStage(Math.min(STAGES.length - 1, activeStage + 1))}
          disabled={activeStage === STAGES.length - 1}
          className="btn-primary text-xs px-4 py-2 disabled:opacity-30"
        >
          {language === 'hi' ? 'अगला चरण' : 'Next Stage'} →
        </button>
      </div>
    </div>
  );
}
