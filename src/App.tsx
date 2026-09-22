import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { ToolsListPage } from './pages/ToolsListPage';
import { HistoryPage } from './pages/HistoryPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { EditorPage } from './pages/EditorPage';
import { ViewerPage } from './pages/ViewerPage';
import { ComparePage } from './pages/ComparePage';
import { InspectPage } from './pages/InspectPage';
import { SettingsPage } from './pages/SettingsPage';
import { PresetsPage } from './pages/PresetsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsListPage />} />
          <Route path="/tools/:slug" element={<ToolPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/viewer" element={<ViewerPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/inspect" element={<InspectPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/presets" element={<PresetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
