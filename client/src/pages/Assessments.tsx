import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

interface Question {
  id: string;
  text: string;
  textHi: string;
  type: 'mcq' | 'multi' | 'numeric';
  options?: { id: string; text: string; textHi: string }[];
  correct: string | string[] | number;
  explanation: string;
  explanationHi: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

const QUESTION_BANK: Question[] = [
  {
    id: 'q1', topic: 'Ohms Law',
    text: "According to Ohm's Law, if voltage is 12V and resistance is 4Ω, the current is:",
    textHi: 'ओम के नियम के अनुसार, यदि वोल्टेज 12V और प्रतिरोध 4Ω है, तो धारा है:',
    type: 'mcq',
    options: [
      { id: 'a', text: '3 A', textHi: '3 A' },
      { id: 'b', text: '48 A', textHi: '48 A' },
      { id: 'c', text: '8 A', textHi: '8 A' },
      { id: 'd', text: '0.33 A', textHi: '0.33 A' },
    ],
    correct: 'a',
    explanation: 'V = IR → I = V/R = 12/4 = 3 A',
    explanationHi: 'V = IR → I = V/R = 12/4 = 3 A',
    difficulty: 'easy',
  },
  {
    id: 'q2', topic: 'Safety',
    text: 'What should you do FIRST when someone gets an electric shock?',
    textHi: 'जब किसी को बिजली का झटका लगे तो सबसे पहले क्या करना चाहिए?',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Pour water on them', textHi: 'उन पर पानी डालें' },
      { id: 'b', text: 'Touch them to pull away', textHi: 'उन्हें छूकर खींचें' },
      { id: 'c', text: 'Disconnect the power supply', textHi: 'बिजली की आपूर्ति बंद करें' },
      { id: 'd', text: 'Call the hospital', textHi: 'अस्पताल को फोन करें' },
    ],
    correct: 'c',
    explanation: 'Always disconnect power first. Never touch the victim while they are in contact with the live source.',
    explanationHi: 'हमेशा पहले बिजली बंद करें। जब तक पीड़ित लाइव स्रोत के संपर्क में है, उन्हें न छुएं।',
    difficulty: 'easy',
  },
  {
    id: 'q3', topic: 'Components',
    text: 'What is the color code for a 470Ω ±5% resistor?',
    textHi: '470Ω ±5% प्रतिरोधक का रंग कोड क्या है?',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Yellow-Violet-Brown-Gold', textHi: 'पीला-बैंगनी-भूरा-सोना' },
      { id: 'b', text: 'Yellow-Violet-Red-Gold', textHi: 'पीला-बैंगनी-लाल-सोना' },
      { id: 'c', text: 'Orange-Violet-Brown-Gold', textHi: 'नारंगी-बैंगनी-भूरा-सोना' },
      { id: 'd', text: 'Yellow-Green-Brown-Gold', textHi: 'पीला-हरा-भूरा-सोना' },
    ],
    correct: 'a',
    explanation: '4=Yellow, 7=Violet, ×10¹=Brown, ±5%=Gold → 47×10 = 470Ω',
    explanationHi: '4=पीला, 7=बैंगनी, ×10¹=भूरा, ±5%=सोना → 47×10 = 470Ω',
    difficulty: 'medium',
  },
  {
    id: 'q4', topic: 'Circuits',
    text: 'Three resistors of 10Ω, 20Ω, and 30Ω are connected in series. Total resistance is:',
    textHi: '10Ω, 20Ω, और 30Ω के तीन प्रतिरोधक श्रेणी में जुड़े हैं। कुल प्रतिरोध है:',
    type: 'numeric',
    correct: 60,
    explanation: 'In series: R_total = R1 + R2 + R3 = 10 + 20 + 30 = 60Ω',
    explanationHi: 'श्रेणी में: R_total = R1 + R2 + R3 = 10 + 20 + 30 = 60Ω',
    difficulty: 'easy',
  },
  {
    id: 'q5', topic: 'Earthing',
    text: 'Which type of earthing is most commonly used for domestic installations in India?',
    textHi: 'भारत में घरेलू इंस्टॉलेशन के लिए सबसे अधिक किस प्रकार की अर्थिंग का उपयोग किया जाता है?',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Rod earthing', textHi: 'रॉड अर्थिंग' },
      { id: 'b', text: 'Plate earthing', textHi: 'प्लेट अर्थिंग' },
      { id: 'c', text: 'Pipe earthing', textHi: 'पाइप अर्थिंग' },
      { id: 'd', text: 'Strip earthing', textHi: 'स्ट्रिप अर्थिंग' },
    ],
    correct: 'c',
    explanation: 'Pipe earthing is the most common for domestic installations as it is economical and easy to maintain.',
    explanationHi: 'पाइप अर्थिंग घरेलू इंस्टॉलेशन के लिए सबसे आम है क्योंकि यह किफायती और रखरखाव में आसान है।',
    difficulty: 'medium',
  },
  {
    id: 'q6', topic: 'Wiring',
    text: 'In a staircase wiring circuit, how many two-way switches are used?',
    textHi: 'सीढ़ी वायरिंग सर्किट में कितने टू-वे स्विच उपयोग होते हैं?',
    type: 'numeric',
    correct: 2,
    explanation: 'Staircase wiring uses exactly 2 two-way switches — one at the bottom and one at the top of the staircase.',
    explanationHi: 'सीढ़ी वायरिंग में ठीक 2 टू-वे स्विच होते हैं — एक सीढ़ी के नीचे और एक ऊपर।',
    difficulty: 'easy',
  },
  {
    id: 'q7', topic: 'Transformer',
    text: 'A transformer has 500 primary turns and 100 secondary turns. If input is 230V, output voltage is:',
    textHi: 'एक ट्रांसफार्मर में 500 प्राथमिक टर्न और 100 द्वितीयक टर्न हैं। यदि इनपुट 230V है, तो आउटपुट वोल्टेज है:',
    type: 'numeric',
    correct: 46,
    explanation: 'V₂/V₁ = N₂/N₁ → V₂ = 230 × (100/500) = 46V. This is a step-down transformer.',
    explanationHi: 'V₂/V₁ = N₂/N₁ → V₂ = 230 × (100/500) = 46V। यह एक स्टेप-डाउन ट्रांसफार्मर है।',
    difficulty: 'medium',
  },
  {
    id: 'q8', topic: 'Safety',
    text: 'Which type of fire extinguisher is used for electrical fires?',
    textHi: 'विद्युत आग के लिए किस प्रकार के अग्निशामक यंत्र का उपयोग किया जाता है?',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Water type', textHi: 'पानी प्रकार' },
      { id: 'b', text: 'Foam type', textHi: 'फोम प्रकार' },
      { id: 'c', text: 'CO₂ or DCP type', textHi: 'CO₂ या DCP प्रकार' },
      { id: 'd', text: 'Soda acid type', textHi: 'सोडा एसिड प्रकार' },
    ],
    correct: 'c',
    explanation: 'CO₂ and DCP (Dry Chemical Powder) extinguishers are used for electrical fires as they are non-conducting.',
    explanationHi: 'CO₂ और DCP (ड्राई केमिकल पाउडर) अग्निशामक विद्युत आग के लिए उपयोग होते हैं क्योंकि ये गैर-प्रवाहकीय हैं।',
    difficulty: 'easy',
  },
];

export default function Assessments() {
  const { t } = useTranslation();
  const { language, addXP, earnBadge } = useAppStore();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [numericInput, setNumericInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredQuestions = selectedDifficulty === 'all'
    ? QUESTION_BANK
    : QUESTION_BANK.filter((q) => q.difficulty === selectedDifficulty);

  const question = filteredQuestions[currentQ];
  const isCorrect = question
    ? question.type === 'numeric'
      ? Number(answers[question.id]) === question.correct
      : answers[question.id] === question.correct
    : false;

  const score = filteredQuestions.filter((q) => {
    const ans = answers[q.id];
    if (q.type === 'numeric') return Number(ans) === q.correct;
    return ans === q.correct;
  }).length;

  const handleAnswer = (value: string | number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQ < filteredQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setQuizComplete(true);
      addXP(score * 20);
      if (score === filteredQuestions.length) {
        earnBadge('quiz_champion');
      }
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQ(0);
    setAnswers({});
    setShowExplanation(false);
    setQuizComplete(false);
    setNumericInput('');
  };

  if (!quizStarted) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.quiz')}</h1>
          <p className="text-sm text-slate-500">{language === 'hi' ? 'अपने ज्ञान का परीक्षण करें' : 'Test your knowledge'}</p>
        </div>

        <div className="card p-6 max-w-lg mx-auto text-center">
          <span className="text-5xl">📝</span>
          <h2 className="text-xl font-bold mt-4">{language === 'hi' ? 'क्विज़ शुरू करें' : 'Start Quiz'}</h2>
          <p className="text-sm text-slate-500 mt-2">
            {language === 'hi' ? `${QUESTION_BANK.length} प्रश्न उपलब्ध` : `${QUESTION_BANK.length} questions available`}
          </p>

          <div className="flex gap-2 justify-center mt-4">
            {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedDifficulty === d ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                }`}
              >
                {d === 'all' ? (language === 'hi' ? 'सभी' : 'All') :
                 d === 'easy' ? (language === 'hi' ? 'आसान' : 'Easy') :
                 d === 'medium' ? (language === 'hi' ? 'मध्यम' : 'Medium') :
                 (language === 'hi' ? 'कठिन' : 'Hard')}
              </button>
            ))}
          </div>

          <button onClick={() => setQuizStarted(true)} className="btn-primary mt-6 px-8 py-3">
            ▶ {language === 'hi' ? 'शुरू करें' : 'Begin'}
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percent = Math.round((score / filteredQuestions.length) * 100);
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="card p-8 max-w-lg mx-auto text-center">
          <span className="text-5xl">{percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚'}</span>
          <h2 className="text-2xl font-bold mt-4">{language === 'hi' ? 'क्विज़ पूरा!' : 'Quiz Complete!'}</h2>
          <p className="text-4xl font-bold mt-3 text-brand-600">{score}/{filteredQuestions.length}</p>
          <p className="text-sm text-slate-500 mt-1">{percent}% {language === 'hi' ? 'सही' : 'correct'}</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-4">
            <div
              className={`h-3 rounded-full transition-all ${percent >= 80 ? 'bg-green-500' : percent >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm mt-3 text-slate-600 dark:text-slate-400">
            +{score * 20} XP {language === 'hi' ? 'अर्जित' : 'earned'}
          </p>
          <button onClick={restartQuiz} className="btn-primary mt-6 px-8 py-2">
            🔄 {language === 'hi' ? 'फिर से' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-mono">{currentQ + 1}/{filteredQuestions.length}</span>
        <div className="flex-1 progress-bar">
          <div className="progress-fill" style={{ width: `${((currentQ + 1) / filteredQuestions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-slate-500">
          {language === 'hi' ? `स्कोर: ${score}` : `Score: ${score}`}
        </span>
      </div>

      <div className="card p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          }`}>
            {question.difficulty}
          </span>
          <span className="text-[10px] text-slate-400">{question.topic}</span>
        </div>

        <h2 className="text-lg font-semibold mb-6">{language === 'hi' ? question.textHi : question.text}</h2>

        {question.type === 'mcq' && question.options && (
          <div className="space-y-2">
            {question.options.map((opt) => {
              const isSelected = answers[question.id] === opt.id;
              const isRight = opt.id === question.correct;
              return (
                <button
                  key={opt.id}
                  onClick={() => !showExplanation && handleAnswer(opt.id)}
                  disabled={showExplanation}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${
                    showExplanation
                      ? isRight
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                        : isSelected
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'border-slate-200 dark:border-slate-700 opacity-50'
                      : isSelected
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                  }`}
                >
                  <span className="font-medium mr-2">{opt.id.toUpperCase()}.</span>
                  {language === 'hi' ? opt.textHi : opt.text}
                  {showExplanation && isRight && ' ✅'}
                  {showExplanation && isSelected && !isRight && ' ❌'}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'numeric' && (
          <div className="flex gap-2">
            <input
              type="number"
              value={numericInput}
              onChange={(e) => setNumericInput(e.target.value)}
              disabled={showExplanation}
              placeholder={language === 'hi' ? 'उत्तर दर्ज करें...' : 'Enter your answer...'}
              className="input-field flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && numericInput && !showExplanation) {
                  handleAnswer(Number(numericInput));
                }
              }}
            />
            {!showExplanation && (
              <button
                onClick={() => handleAnswer(Number(numericInput))}
                disabled={!numericInput}
                className="btn-primary px-4"
              >
                {language === 'hi' ? 'जमा करें' : 'Submit'}
              </button>
            )}
          </div>
        )}

        {showExplanation && (
          <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/10 border border-green-200' : 'bg-red-50 dark:bg-red-900/10 border border-red-200'}`}>
            <p className="text-sm font-medium mb-1">
              {isCorrect ? '✅ ' : '❌ '}
              {isCorrect
                ? (language === 'hi' ? 'सही!' : 'Correct!')
                : (language === 'hi' ? 'गलत' : 'Incorrect')
              }
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'hi' ? question.explanationHi : question.explanation}
            </p>
          </div>
        )}

        {showExplanation && (
          <button onClick={nextQuestion} className="btn-primary mt-4 w-full py-2">
            {currentQ < filteredQuestions.length - 1
              ? (language === 'hi' ? 'अगला प्रश्न →' : 'Next Question →')
              : (language === 'hi' ? 'परिणाम देखें' : 'See Results')
            }
          </button>
        )}
      </div>
    </div>
  );
}
