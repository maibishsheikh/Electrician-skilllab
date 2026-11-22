import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './context/store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Labs from './pages/Labs';
import CircuitSimulator from './pages/CircuitSimulator';
import OhmsLawLab from './pages/OhmsLawLab';
import SafetyWorkshop from './pages/SafetyWorkshop';
import WireJointsLab from './pages/WireJointsLab';
import MeasurementLab from './pages/MeasurementLab';
import WiringLab from './pages/WiringLab';
import EarthingLab from './pages/EarthingLab';
import TransformerLab from './pages/TransformerLab';
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
        <Route path="/modules/:id" element={<ModuleDetail />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/circuit-simulator" element={<CircuitSimulator />} />
        <Route path="/labs/ohms-law" element={<OhmsLawLab />} />
        <Route path="/labs/safety" element={<SafetyWorkshop />} />
        <Route path="/labs/wire-joints" element={<WireJointsLab />} />
        <Route path="/labs/measurement" element={<MeasurementLab />} />
        <Route path="/labs/wiring" element={<WiringLab />} />
        <Route path="/labs/earthing" element={<EarthingLab />} />
        <Route path="/labs/transformer" element={<TransformerLab />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/glossary" element={<Glossary />} />
      </Routes>
    </Layout>
  );
}

export default App;
