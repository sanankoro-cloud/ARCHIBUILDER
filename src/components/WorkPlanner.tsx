import React, { useState } from 'react';
import { WorkStep } from '../types';
import { defaultWorkSteps, categoryLabels, categoryColors } from '../data';

interface WorkPlannerProps {
  steps: WorkStep[];
  onUpdate: (steps: WorkStep[]) => void;
}

export const WorkPlanner: React.FC<WorkPlannerProps> = ({ steps, onUpdate }) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    duration: 5,
    cost: 1000,
    category: 'structure' as WorkStep['category'],
  });

  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const totalCost = steps.reduce((sum, s) => sum + s.cost, 0);
  const completedCount = steps.filter(s => s.status === 'completed').length;

  const updateStep = (id: string, updates: Partial<WorkStep>) => {
    onUpdate(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStep = (id: string) => {
    onUpdate(steps.filter(s => s.id !== id));
    setSelectedStep(null);
  };

  const addStep = () => {
    if (!newStep.title) return;
    const step: WorkStep = {
      id: `step-${Date.now()}`,
      title: newStep.title,
      description: newStep.description,
      duration: newStep.duration,
      startDate: '',
      endDate: '',
      status: 'pending',
      cost: newStep.cost,
      dependencies: [],
      category: newStep.category,
    };
    onUpdate([...steps, step]);
    setShowAddModal(false);
    setNewStep({ title: '', description: '', duration: 5, cost: 1000, category: 'structure' });
  };

  const resetToDefaults = () => {
    onUpdate(defaultWorkSteps);
  };

  const filteredSteps = filterCategory === 'all'
    ? steps
    : steps.filter(s => s.category === filterCategory);

  const getStatusColor = (status: WorkStep['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: WorkStep['status']) => {
    switch (status) {
      case 'completed': return '✅ Terminé';
      case 'in-progress': return '🔄 En cours';
      case 'blocked': return '⛔ Bloqué';
      default: return '⏳ En attente';
    }
  };

  const selectedStepData = steps.find(s => s.id === selectedStep);

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Panel */}
      <div className="lg:w-72 flex-shrink-0 space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">📊 Résumé</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Durée totale</span>
              <span className="font-bold text-indigo-600">{totalDuration} jours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Budget total</span>
              <span className="font-bold text-green-600">{totalCost.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Progression</span>
              <span className="font-bold text-orange-600">{completedCount}/{steps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${steps.length > 0 ? (completedCount / steps.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">🏷️ Filtrer par catégorie</h3>
          <div className="space-y-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filterCategory === 'all' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50'
              }`}
            >
              Toutes les étapes ({steps.length})
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => {
              const count = steps.filter(s => s.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setFilterCategory(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    filterCategory === key ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[key] }} />
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border space-y-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            ➕ Ajouter une étape
          </button>
          <button
            onClick={resetToDefaults}
            className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            🔄 Réinitialiser le plan type
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-700">📋 Plan de travaux</h2>
          <span className="text-sm text-gray-400">{filteredSteps.length} étape{filteredSteps.length > 1 ? 's' : ''}</span>
        </div>

        {filteredSteps.map((step, index) => (
          <div
            key={step.id}
            onClick={() => setSelectedStep(step.id)}
            className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
              selectedStep === step.id ? 'ring-2 ring-indigo-400' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: categoryColors[step.category] }}
                >
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{step.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(step.status)}`}>
                {getStatusLabel(step.status)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>📅 {step.duration} jours</span>
              <span>💰 {step.cost.toLocaleString('fr-FR')} €</span>
              <span
                className="px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: categoryColors[step.category], fontSize: '10px' }}
              >
                {categoryLabels[step.category]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel - Step Details */}
      <div className="lg:w-72 flex-shrink-0">
        {selectedStepData ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4 sticky top-4">
            <h3 className="font-semibold text-gray-700">📝 Détails de l'étape</h3>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Titre</label>
              <input
                type="text"
                value={selectedStepData.title}
                onChange={(e) => updateStep(selectedStepData.id, { title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Description</label>
              <textarea
                value={selectedStepData.description}
                onChange={(e) => updateStep(selectedStepData.id, { description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Durée (jours)</label>
                <input
                  type="number"
                  value={selectedStepData.duration}
                  onChange={(e) => updateStep(selectedStepData.id, { duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Coût (€)</label>
                <input
                  type="number"
                  value={selectedStepData.cost}
                  onChange={(e) => updateStep(selectedStepData.id, { cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Statut</label>
              <select
                value={selectedStepData.status}
                onChange={(e) => updateStep(selectedStepData.id, { status: e.target.value as WorkStep['status'] })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="pending">⏳ En attente</option>
                <option value="in-progress">🔄 En cours</option>
                <option value="completed">✅ Terminé</option>
                <option value="blocked">⛔ Bloqué</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Catégorie</label>
              <select
                value={selectedStepData.category}
                onChange={(e) => updateStep(selectedStepData.id, { category: e.target.value as WorkStep['category'] })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => deleteStep(selectedStepData.id)}
              className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              🗑️ Supprimer cette étape
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-2">ℹ️ Aide</h3>
            <div className="text-sm text-gray-500 space-y-2">
              <p>• Cliquez sur une étape pour la modifier</p>
              <p>• Changez le statut pour suivre l'avancement</p>
              <p>• Ajustez la durée et le coût selon votre projet</p>
              <p>• Utilisez les filtres pour organiser les étapes</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Step Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-gray-800">➕ Nouvelle étape</h3>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Titre *</label>
              <input
                type="text"
                value={newStep.title}
                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Ex: Installation électrique"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Description</label>
              <textarea
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
                placeholder="Décrivez cette étape..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Durée (jours)</label>
                <input
                  type="number"
                  value={newStep.duration}
                  onChange={(e) => setNewStep({ ...newStep, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Coût (€)</label>
                <input
                  type="number"
                  value={newStep.cost}
                  onChange={(e) => setNewStep({ ...newStep, cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Catégorie</label>
              <select
                value={newStep.category}
                onChange={(e) => setNewStep({ ...newStep, category: e.target.value as WorkStep['category'] })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={addStep}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
