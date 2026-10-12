import React from 'react';
import { Project } from '../types';

interface DashboardProps {
  project: Project;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ project, onNavigate }) => {
  const totalBuildingElements = project.buildingElements.length;
  const totalEnvironmentElements = project.environmentElements.length;
  const totalWorkSteps = project.workSteps.length;
  const completedSteps = project.workSteps.filter(s => s.status === 'completed').length;
  const totalCost = project.workSteps.reduce((sum, s) => sum + s.cost, 0);
  const progress = totalWorkSteps > 0 ? Math.round((completedSteps / totalWorkSteps) * 100) : 0;

  const totalDuration = project.workSteps.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">{project.name || 'Mon Projet'}</h1>
        <p className="text-blue-100 text-lg">{project.description || 'Décrivez votre projet en cliquant sur l\'éditeur'}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            📐 {totalArea()} m²
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            📅 {totalDuration} jours estimés
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🏗️"
          title="Éléments bâtis"
          value={totalBuildingElements.toString()}
          subtitle="murs, portes, fenêtres..."
          color="bg-blue-50 border-blue-200"
          onClick={() => onNavigate('editor')}
        />
        <StatCard
          icon="🌳"
          title="Environnement"
          value={totalEnvironmentElements.toString()}
          subtitle="arbres, allées, jardin..."
          color="bg-green-50 border-green-200"
          onClick={() => onNavigate('environment')}
        />
        <StatCard
          icon="📋"
          title="Travaux"
          value={`${completedSteps}/${totalWorkSteps}`}
          subtitle={`${progress}% complété`}
          color="bg-orange-50 border-orange-200"
          onClick={() => onNavigate('planner')}
        />
        <StatCard
          icon="💰"
          title="Budget estimé"
          value={`${totalCost.toLocaleString('fr-FR')} €`}
          subtitle="coût total estimé"
          color="bg-purple-50 border-purple-200"
          onClick={() => onNavigate('costs')}
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Progression globale du projet</h3>
          <span className="text-2xl font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {completedSteps} étape{completedSteps > 1 ? 's' : ''} terminée{completedSteps > 1 ? 's' : ''} sur {totalWorkSteps}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-700 mb-3">⚡ Actions rapides</h3>
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('editor')}
              className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
            >
              ✏️ Modifier le bâtiment
            </button>
            <button
              onClick={() => onNavigate('environment')}
              className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-700 font-medium"
            >
              🌿 Aménager l'environnement
            </button>
            <button
              onClick={() => onNavigate('planner')}
              className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-orange-700 font-medium"
            >
              📅 Planifier les travaux
            </button>
            <button
              onClick={() => onNavigate('costs')}
              className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-purple-700 font-medium"
            >
              💰 Voir l'estimation des coûts
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">💡 Conseils</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-lg">1️⃣</span>
              <p>Commencez par dessiner les pièces principales dans l'éditeur de bâtiment</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">2️⃣</span>
              <p>Ajoutez l'environnement autour de votre bâtiment (jardin, allée...)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">3️⃣</span>
              <p>Planifiez les étapes de construction dans l'ordre logique</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">4️⃣</span>
              <p>Consultez l'estimateur pour ajuster votre budget</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function totalArea() {
    return project.buildingElements
      .filter(e => e.type === 'room')
      .reduce((sum, e) => sum + (e.width * e.height) / 100, 0)
      .toFixed(0);
  }
};

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} border rounded-xl p-5 text-left hover:shadow-md transition-all hover:scale-[1.02]`}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-sm text-gray-500 font-medium">{title}</div>
    <div className="text-xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
  </button>
);
