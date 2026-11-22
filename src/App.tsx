import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './context/store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import Labs from './pages/Labs';
import CircuitSimulator from './pages/CircuitSimulator';
import OhmsLawLab from './pages/OhmsLawLab';
import SafetyWorkshop from './pages/SafetyWorkshop';
import Assessments from './pages/Assessments';
import Progress from './pages/Progress';
import Missions from './pages/Missions';
import Glossary from './pages/Glossary';

function App() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/circuit-simulator" element={<CircuitSimulator />} />
        <Route path="/labs/ohms-law" element={<OhmsLawLab />} />
        <Route path="/labs/safety" element={<SafetyWorkshop />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/glossary" element={<Glossary />} />
      </Routes>
    </Layout>
  );
}

export default App;
