import React, { useState, useRef } from 'react';
import { EnvironmentElement } from '../types';
import { environmentPresets } from '../data';

interface EnvironmentManagerProps {
  elements: EnvironmentElement[];
  onUpdate: (elements: EnvironmentElement[]) => void;
}

export const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({ elements, onUpdate }) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  const getSVGPoint = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const addElement = (preset: typeof environmentPresets[0]) => {
    const newElement: EnvironmentElement = {
      id: `env-${Date.now()}`,
      type: preset.type,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
      width: preset.width,
      height: preset.height,
      label: preset.label,
    };
    onUpdate([...elements, newElement]);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElement(elementId);
    const el = elements.find(el => el.id === elementId);
    if (el) {
      const point = getSVGPoint(e);
      setDragOffset({ x: point.x - el.x, y: point.y - el.y });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement) {
      const point = getSVGPoint(e);
      onUpdate(
        elements.map(el =>
          el.id === selectedElement
            ? { ...el, x: Math.max(0, point.x - dragOffset.x), y: Math.max(0, point.y - dragOffset.y) }
            : el
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const deleteElement = (id: string) => {
    onUpdate(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const updateElement = (id: string, updates: Partial<EnvironmentElement>) => {
    onUpdate(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const getEmoji = (type: string) => {
    const preset = environmentPresets.find(p => p.type === type);
    return preset?.emoji || '📦';
  };

  const getElementColor = (type: string) => {
    const colors: Record<string, string> = {
      tree: '#166534',
      bush: '#15803d',
      path: '#a8a29e',
      fence: '#78716c',
      pool: '#0ea5e9',
      garden: '#65a30d',
      parking: '#525252',
    };
    return colors[type] || '#6b7280';
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Panel */}
      <div className="lg:w-64 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">🌿 Ajouter au terrain</h3>
          <div className="space-y-2">
            {environmentPresets.map(preset => (
              <button
                key={preset.type}
                onClick={() => addElement(preset)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border hover:shadow-sm transition-all text-left hover:bg-gray-50"
              >
                <span className="text-2xl">{preset.emoji}</span>
                <div>
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-gray-400">Cliquez pour ajouter</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-2">📊 Statistiques</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Éléments total</span>
              <span className="font-medium">{elements.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">🌳 Arbres</span>
              <span className="font-medium">{elements.filter(e => e.type === 'tree').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">🌿 Arbustes</span>
              <span className="font-medium">{elements.filter(e => e.type === 'bush').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">🏊 Piscine</span>
              <span className="font-medium">{elements.filter(e => e.type === 'pool').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            🌍 Vue du terrain — Placez les éléments autour du bâtiment
          </span>
          <span className="text-xs text-gray-400">{elements.length} élément{elements.length > 1 ? 's' : ''}</span>
        </div>
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="bg-gradient-to-b from-green-50 to-green-100"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
          onClick={() => setSelectedElement(null)}
        >
          {/* Grass texture */}
          <defs>
            <pattern id="grass" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#dcfce7" />
              <circle cx="5" cy="5" r="1" fill="#bbf7d0" />
              <circle cx="15" cy="15" r="1" fill="#bbf7d0" />
              <circle cx="10" cy="10" r="0.5" fill="#86efac" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grass)" />

          {/* Building placeholder */}
          <rect
            x={CANVAS_WIDTH / 2 - 80}
            y={CANVAS_HEIGHT / 2 - 60}
            width={160}
            height={120}
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="8,4"
            rx={4}
          />
          <text
            x={CANVAS_WIDTH / 2}
            y={CANVAS_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-400"
            fontSize="12"
          >
            🏠 Bâtiment
          </text>

          {/* Environment elements */}
          {elements.map(el => (
            <g
              key={el.id}
              onMouseDown={(e) => handleMouseDown(e, el.id)}
              className="cursor-move"
            >
              {el.type === 'tree' ? (
                <>
                  <circle cx={el.x + el.width / 2} cy={el.y + el.height / 2} r={el.width / 2} fill="#166534" opacity={0.3} />
                  <circle cx={el.x + el.width / 2} cy={el.y + el.height / 2} r={el.width / 2 - 4} fill="#22c55e" opacity={0.6} />
                  <text x={el.x + el.width / 2} y={el.y + el.height / 2 + 5} textAnchor="middle" fontSize="20">🌳</text>
                </>
              ) : el.type === 'pool' ? (
                <>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill="#0ea5e9"
                    opacity={0.4}
                    rx={8}
                    stroke={selectedElement === el.id ? '#3b82f6' : '#0284c7'}
                    strokeWidth={selectedElement === el.id ? 3 : 1.5}
                  />
                  <text x={el.x + el.width / 2} y={el.y + el.height / 2 + 5} textAnchor="middle" fontSize="16">🏊</text>
                </>
              ) : el.type === 'path' ? (
                <rect
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  fill="#a8a29e"
                  rx={4}
                  stroke={selectedElement === el.id ? '#3b82f6' : '#78716c'}
                  strokeWidth={selectedElement === el.id ? 3 : 1.5}
                />
              ) : el.type === 'fence' ? (
                <>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill="#d6d3d1"
                    rx={2}
                    stroke={selectedElement === el.id ? '#3b82f6' : '#78716c'}
                    strokeWidth={selectedElement === el.id ? 3 : 1.5}
                  />
                  {Array.from({ length: Math.floor(el.width / 12) }).map((_, i) => (
                    <line
                      key={i}
                      x1={el.x + i * 12 + 6}
                      y1={el.y}
                      x2={el.x + i * 12 + 6}
                      y2={el.y + el.height}
                      stroke="#78716c"
                      strokeWidth={1.5}
                    />
                  ))}
                </>
              ) : el.type === 'garden' ? (
                <>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill="#65a30d"
                    opacity={0.3}
                    rx={8}
                    stroke={selectedElement === el.id ? '#3b82f6' : '#4d7c0f'}
                    strokeWidth={selectedElement === el.id ? 3 : 1.5}
                    strokeDasharray="4,2"
                  />
                  <text x={el.x + el.width / 2} y={el.y + el.height / 2 + 5} textAnchor="middle" fontSize="16">🌻</text>
                </>
              ) : el.type === 'parking' ? (
                <>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill="#525252"
                    opacity={0.5}
                    rx={4}
                    stroke={selectedElement === el.id ? '#3b82f6' : '#404040'}
                    strokeWidth={selectedElement === el.id ? 3 : 1.5}
                  />
                  <text x={el.x + el.width / 2} y={el.y + el.height / 2 + 5} textAnchor="middle" fontSize="14">🅿️</text>
                </>
              ) : (
                <>
                  <circle cx={el.x + el.width / 2} cy={el.y + el.height / 2} r={el.width / 2} fill={getElementColor(el.type)} opacity={0.5}
                    stroke={selectedElement === el.id ? '#3b82f6' : getElementColor(el.type)}
                    strokeWidth={selectedElement === el.id ? 3 : 1}
                  />
                  <text x={el.x + el.width / 2} y={el.y + el.height / 2 + 5} textAnchor="middle" fontSize="14">{getEmoji(el.type)}</text>
                </>
              )}
              {selectedElement === el.id && (
                <rect
                  x={el.x - 3}
                  y={el.y - 3}
                  width={el.width + 6}
                  height={el.height + 6}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="4,3"
                  rx={4}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Right Panel - Properties */}
      <div className="lg:w-64 flex-shrink-0">
        {selectedEl ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
            <h3 className="font-semibold text-gray-700">📝 Propriétés</h3>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Type</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium">
                {getEmoji(selectedEl.type)} {selectedEl.label}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nom personnalisé</label>
              <input
                type="text"
                value={selectedEl.label}
                onChange={(e) => updateElement(selectedEl.id, { label: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Largeur</label>
                <input
                  type="number"
                  value={selectedEl.width}
                  onChange={(e) => updateElement(selectedEl.id, { width: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Hauteur</label>
                <input
                  type="number"
                  value={selectedEl.height}
                  onChange={(e) => updateElement(selectedEl.id, { height: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600">
                📍 Position : ({Math.round(selectedEl.x)}, {Math.round(selectedEl.y)})
              </p>
            </div>
            <button
              onClick={() => deleteElement(selectedEl.id)}
              className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              🗑️ Supprimer
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-2">ℹ️ Aide</h3>
            <div className="text-sm text-gray-500 space-y-2">
              <p>• Cliquez sur un élément à gauche pour l'ajouter au terrain</p>
              <p>• <strong>Glissez</strong> les éléments pour les déplacer</p>
              <p>• Cliquez sur un élément pour voir ses propriétés</p>
              <p>• Le bâtiment (pointillé) représente votre construction</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
