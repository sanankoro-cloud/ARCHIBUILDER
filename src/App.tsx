import React, { useState } from 'react';
import { Project, BuildingElement, EnvironmentElement, WorkStep } from './types';
import { defaultWorkSteps } from './data';
import { Dashboard } from './components/Dashboard';
import { BuildingEditor } from './components/BuildingEditor';
import { EnvironmentManager } from './components/EnvironmentManager';
import { WorkPlanner } from './components/WorkPlanner';
import { CostEstimator } from './components/CostEstimator';

type Tab = 'dashboard' | 'editor' | 'environment' | 'planner' | 'costs';

const initialProject: Project = {
  name: 'Ma Maison de Rêve',
  description: 'Un projet de construction moderne et accessible',
  buildingElements: [],
  environmentElements: [],
  workSteps: defaultWorkSteps,
  totalArea: 0,
  createdAt: new Date().toISOString(),
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [project, setProject] = useState<Project>(initialProject);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const updateBuildingElements = (elements: BuildingElement[]) => {
    setProject(prev => ({ ...prev, buildingElements: elements }));
  };

  const updateEnvironmentElements = (elements: EnvironmentElement[]) => {
    setProject(prev => ({ ...prev, environmentElements: elements }));
  };

  const updateWorkSteps = (steps: WorkStep[]) => {
    setProject(prev => ({ ...prev, workSteps: steps }));
  };

  const tabs: { id: Tab; label: string; icon: string; shortLabel: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '🏠', shortLabel: 'Accueil' },
    { id: 'editor', label: 'Éditeur de bâtiment', icon: '✏️', shortLabel: 'Bâtiment' },
    { id: 'environment', label: 'Environnement', icon: '🌳', shortLabel: 'Terrain' },
    { id: 'planner', label: 'Plan de travaux', icon: '📋', shortLabel: 'Travaux' },
    { id: 'costs', label: 'Estimation coûts', icon: '💰', shortLabel: 'Coûts' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-white border-b shadow-sm z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏗️</span>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">ArchiBuilder</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Architecture pour tous</p>
              </div>
            </div>
          </div>

          {/* Project Name Edit */}
          <div className="hidden md:flex items-center gap-2">
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-1.5 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none"
              placeholder="Nom du projet"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">
              {project.buildingElements.length} éléments • {project.workSteps.filter(s => s.status === 'completed').length}/{project.workSteps.length} étapes
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex overflow-x-auto px-4 gap-1 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard project={project} onNavigate={(tab) => setActiveTab(tab as Tab)} />
        )}
        {activeTab === 'editor' && (
          <BuildingEditor
            elements={project.buildingElements}
            onUpdate={updateBuildingElements}
          />
        )}
        {activeTab === 'environment' && (
          <EnvironmentManager
            elements={project.environmentElements}
            onUpdate={updateEnvironmentElements}
          />
        )}
        {activeTab === 'planner' && (
          <WorkPlanner
            steps={project.workSteps}
            onUpdate={updateWorkSteps}
          />
        )}
        {activeTab === 'costs' && (
          <CostEstimator
            buildingElements={project.buildingElements}
            workSteps={project.workSteps}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t px-4 py-2 text-center">
        <p className="text-xs text-gray-400">
          🏗️ ArchiBuilder — Créez, planifiez et estimez vos projets architecturaux facilement
        </p>
      </footer>
    </div>
  );
}

export default App;
