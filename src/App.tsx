import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { ToolsListPage } from './pages/ToolsListPage';
import { HistoryPage } from './pages/HistoryPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { EditorPage } from './pages/EditorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsListPage />} />
          <Route path="/tools/:slug" element={<ToolPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
