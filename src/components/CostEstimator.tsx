import React, { useState } from 'react';
import { BuildingElement, WorkStep } from '../types';
import { materials, categoryLabels, categoryColors } from '../data';

interface CostEstimatorProps {
  buildingElements: BuildingElement[];
  workSteps: WorkStep[];
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ buildingElements, workSteps }) => {
  const [viewMode, setViewMode] = useState<'summary' | 'detail' | 'materials'>('summary');
  const [surfaceArea, setSurfaceArea] = useState(100);
  const [floors, setFloors] = useState(1);
  const [quality, setQuality] = useState<'standard' | 'premium' | 'luxury'>('standard');

  const qualityMultiplier = {
    standard: 1,
    premium: 1.5,
    luxury: 2.2,
  };

  const calculatedArea = buildingElements
    .filter(e => e.type === 'room')
    .reduce((sum, e) => sum + (e.width * e.height) / 400, 0); // Convert px² to m² (approx)

  const effectiveArea = calculatedArea > 0 ? calculatedArea : surfaceArea;
  const totalArea = effectiveArea * floors;

  // Cost calculations
  const baseCostPerM2 = {
    standard: 1500,
    premium: 2200,
    luxury: 3500,
  };

  const constructionCost = totalArea * baseCostPerM2[quality] * qualityMultiplier[quality];
  const workStepsCost = workSteps.reduce((sum, s) => sum + s.cost, 0);
  const materialCosts = calculateMaterialCosts();

  function calculateMaterialCosts() {
    const costs: { name: string; quantity: number; unit: string; price: number; total: number; icon: string }[] = [];

    // Foundation
    const foundationVolume = totalArea * 0.3; // m³ of concrete
    costs.push({
      name: 'Béton (fondations)',
      quantity: Math.round(foundationVolume),
      unit: 'm³',
      price: 120,
      total: Math.round(foundationVolume * 120),
      icon: '🧱',
    });

    // Walls
    const wallArea = totalArea * 2.5; // approximate wall surface
    costs.push({
      name: 'Brique/Mur',
      quantity: Math.round(wallArea),
      unit: 'm²',
      price: 45,
      total: Math.round(wallArea * 45),
      icon: '🟫',
    });

    // Insulation
    costs.push({
      name: 'Isolation',
      quantity: Math.round(wallArea * 0.8),
      unit: 'm²',
      price: 25,
      total: Math.round(wallArea * 0.8 * 25),
      icon: '🧤',
    });

    // Roof
    const roofArea = totalArea * 1.2;
    costs.push({
      name: 'Tuiles',
      quantity: Math.round(roofArea),
      unit: 'm²',
      price: 55,
      total: Math.round(roofArea * 55),
      icon: '🏠',
    });

    // Windows
    const windowCount = Math.max(buildingElements.filter(e => e.type === 'window').length, Math.round(totalArea / 15));
    costs.push({
      name: 'Fenêtres (vitrage)',
      quantity: windowCount,
      unit: 'unités',
      price: 450,
      total: windowCount * 450,
      icon: '🪟',
    });

    // Doors
    const doorCount = Math.max(buildingElements.filter(e => e.type === 'door').length, Math.round(totalArea / 25) + 1);
    costs.push({
      name: 'Portes',
      quantity: doorCount,
      unit: 'unités',
      price: 350,
      total: doorCount * 350,
      icon: '🚪',
    });

    // Flooring
    costs.push({
      name: 'Carrelage/Sol',
      quantity: Math.round(totalArea),
      unit: 'm²',
      price: 40,
      total: Math.round(totalArea * 40),
      icon: '🔲',
    });

    // Paint
    const paintArea = totalArea * 3;
    costs.push({
      name: 'Peinture',
      quantity: Math.round(paintArea),
      unit: 'm²',
      price: 12,
      total: Math.round(paintArea * 12),
      icon: '🎨',
    });

    // Plumbing
    costs.push({
      name: 'Plomberie',
      quantity: Math.round(totalArea * 0.5),
      unit: 'ml',
      price: 25,
      total: Math.round(totalArea * 0.5 * 25),
      icon: '🔧',
    });

    // Electrical
    costs.push({
      name: 'Électricité',
      quantity: Math.round(totalArea * 0.8),
      unit: 'ml',
      price: 15,
      total: Math.round(totalArea * 0.8 * 15),
      icon: '⚡',
    });

    return costs;
  }

  const totalMaterialCost = materialCosts.reduce((sum, m) => sum + m.total, 0);
  const laborCost = totalMaterialCost * 0.6; // Labor is approximately 60% of material cost
  const contingency = (constructionCost + totalMaterialCost + laborCost) * 0.1; // 10% contingency
  const grandTotal = constructionCost + totalMaterialCost + laborCost + contingency;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">💰 Estimateur de coûts</h2>
        <p className="text-purple-100">Estimation détaillée pour votre projet</p>
      </div>

      {/* Parameters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-4">⚙️ Paramètres du projet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Surface au sol (m²)</label>
            <input
              type="number"
              value={Math.round(effectiveArea)}
              onChange={(e) => setSurfaceArea(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {calculatedArea > 0 && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Calculé depuis le plan : {calculatedArea.toFixed(0)} m²
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Nombre d'étages</label>
            <select
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value={1}>1 étage (RDC)</option>
              <option value={2}>2 étages</option>
              <option value={3}>3 étages</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Niveau de finition</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as typeof quality)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Coût total estimé du projet</p>
            <p className="text-4xl font-bold text-indigo-600">
              {Math.round(grandTotal).toLocaleString('fr-FR')} €
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Soit environ {Math.round(grandTotal / totalArea).toLocaleString('fr-FR')} €/m²
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'summary' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 Résumé
            </button>
            <button
              onClick={() => setViewMode('detail')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'detail' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📋 Détail
            </button>
            <button
              onClick={() => setViewMode('materials')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'materials' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🧱 Matériaux
            </button>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cost Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">📊 Répartition des coûts</h3>
            <div className="space-y-3">
              <CostBar label="Construction (base)" value={constructionCost} total={grandTotal} color="bg-blue-500" />
              <CostBar label="Matériaux" value={totalMaterialCost} total={grandTotal} color="bg-green-500" />
              <CostBar label="Main d'œuvre" value={laborCost} total={grandTotal} color="bg-orange-500" />
              <CostBar label="Imprévus (10%)" value={contingency} total={grandTotal} color="bg-red-500" />
            </div>
          </div>

          {/* By Category */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">🏷️ Coûts par catégorie</h3>
            <div className="space-y-2">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const catCost = workSteps
                  .filter(s => s.category === key)
                  .reduce((sum, s) => sum + s.cost, 0);
                if (catCost === 0) return null;
                return (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[key] }} />
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                    <span className="font-medium text-gray-800">{catCost.toLocaleString('fr-FR')} €</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'detail' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-4">📋 Détail des coûts par étape</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Étape</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Catégorie</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Durée</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Coût</th>
                </tr>
              </thead>
              <tbody>
                {workSteps.map((step, i) => (
                  <tr key={step.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className="font-medium">{i + 1}. {step.title}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-white text-xs"
                        style={{ backgroundColor: categoryColors[step.category] }}
                      >
                        {categoryLabels[step.category]}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-600">{step.duration} jours</td>
                    <td className="py-2 px-3 text-right font-medium">{step.cost.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
                <tr className="bg-indigo-50 font-bold">
                  <td className="py-3 px-3" colSpan={3}>Total des étapes</td>
                  <td className="py-3 px-3 text-right text-indigo-700">{workStepsCost.toLocaleString('fr-FR')} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'materials' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-4">🧱 Estimation des matériaux</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Matériau</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Quantité</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Prix unitaire</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {materialCosts.map((mat, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className="mr-2">{mat.icon}</span>
                      <span className="font-medium">{mat.name}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-600">{mat.quantity} {mat.unit}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{mat.price} €/{mat.unit}</td>
                    <td className="py-2 px-3 text-right font-medium">{mat.total.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
                <tr className="bg-green-50 font-bold">
                  <td className="py-3 px-3" colSpan={3}>Total matériaux</td>
                  <td className="py-3 px-3 text-right text-green-700">{totalMaterialCost.toLocaleString('fr-FR')} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-semibold text-amber-800 mb-2">💡 Conseils pour réduire les coûts</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Optez pour un plan simple et compact pour réduire les coûts de structure</li>
          <li>• Choisissez des matériaux standards plutôt que haut de gamme</li>
          <li>• Regroupez les pièces d'eau (cuisine, SDB) pour limiter la plomberie</li>
          <li>• Prévoyez 10% de budget supplémentaire pour les imprévus</li>
          <li>• Comparez les devis de plusieurs artisans</li>
        </ul>
      </div>
    </div>
  );
};

interface CostBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const CostBar: React.FC<CostBarProps> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{Math.round(value).toLocaleString('fr-FR')} € ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
