import React, { useState, useRef, useCallback } from 'react';
import { BuildingElement } from '../types';
import { roomPresets } from '../data';

interface BuildingEditorProps {
  elements: BuildingElement[];
  onUpdate: (elements: BuildingElement[]) => void;
}

export const BuildingEditor: React.FC<BuildingEditorProps> = ({ elements, onUpdate }) => {
  const [selectedTool, setSelectedTool] = useState<string>('room');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const getSVGPoint = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, elementId?: string) => {
    if (elementId) {
      setSelectedElement(elementId);
      const el = elements.find(el => el.id === elementId);
      if (el) {
        const point = getSVGPoint(e);
        setDragOffset({ x: point.x - el.x, y: point.y - el.y });
        setIsDragging(true);
      }
    } else {
      setSelectedElement(null);
      const point = getSVGPoint(e);
      setDragStart({ x: snapToGrid(point.x), y: snapToGrid(point.y) });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement) {
      const point = getSVGPoint(e);
      const newX = snapToGrid(point.x - dragOffset.x);
      const newY = snapToGrid(point.y - dragOffset.y);
      onUpdate(
        elements.map(el =>
          el.id === selectedElement ? { ...el, x: newX, y: newY } : el
        )
      );
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (dragStart && selectedTool) {
      const point = getSVGPoint(e);
      const endX = snapToGrid(point.x);
      const endY = snapToGrid(point.y);
      const width = Math.abs(endX - dragStart.x);
      const height = Math.abs(endY - dragStart.y);

      if (width > 20 && height > 20) {
        const preset = roomPresets.find(p => p.name === selectedTool);
        const newElement: BuildingElement = {
          id: `el-${Date.now()}`,
          type: selectedTool === 'room' ? 'room' : selectedTool as BuildingElement['type'],
          x: Math.min(dragStart.x, endX),
          y: Math.min(dragStart.y, endY),
          width: Math.max(width, 40),
          height: Math.max(height, 40),
          rotation: 0,
          color: preset?.color || '#e5e7eb',
          material: '',
          label: preset?.name || selectedTool,
        };
        onUpdate([...elements, newElement]);
      }
    }
    setDragStart(null);
  };

  const addPresetRoom = (preset: typeof roomPresets[0]) => {
    const newElement: BuildingElement = {
      id: `el-${Date.now()}`,
      type: 'room',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: preset.defaultWidth * GRID_SIZE,
      height: preset.defaultHeight * GRID_SIZE,
      rotation: 0,
      color: preset.color,
      material: '',
      label: preset.name,
    };
    onUpdate([...elements, newElement]);
  };

  const addElement = (type: BuildingElement['type']) => {
    const sizes: Record<string, { w: number; h: number }> = {
      wall: { w: 120, h: 20 },
      door: { w: 40, h: 60 },
      window: { w: 60, h: 40 },
      roof: { w: 100, h: 60 },
      floor: { w: 100, h: 100 },
    };
    const size = sizes[type] || { w: 60, h: 60 };
    const newElement: BuildingElement = {
      id: `el-${Date.now()}`,
      type,
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 100,
      width: size.w,
      height: size.h,
      rotation: 0,
      color: type === 'door' ? '#92400e' : type === 'window' ? '#bfdbfe' : type === 'wall' ? '#6b7280' : '#d1d5db',
      material: '',
      label: type === 'wall' ? 'Mur' : type === 'door' ? 'Porte' : type === 'window' ? 'Fenêtre' : type === 'roof' ? 'Toit' : 'Sol',
    };
    onUpdate([...elements, newElement]);
  };

  const deleteElement = (id: string) => {
    onUpdate(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const updateElement = (id: string, updates: Partial<BuildingElement>) => {
    onUpdate(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Panel - Tools */}
      <div className="lg:w-64 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">🏠 Pièces rapides</h3>
          <div className="grid grid-cols-2 gap-2">
            {roomPresets.map(preset => (
              <button
                key={preset.name}
                onClick={() => addPresetRoom(preset)}
                className="px-3 py-2 text-xs font-medium rounded-lg border hover:shadow-sm transition-all"
                style={{ backgroundColor: preset.color + '40', borderColor: preset.color }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">🔧 Éléments</h3>
          <div className="space-y-2">
            {[
              { type: 'wall' as const, label: '🧱 Mur', desc: 'Dessinez sur le canvas' },
              { type: 'door' as const, label: '🚪 Porte', desc: 'Cliquez pour ajouter' },
              { type: 'window' as const, label: '🪟 Fenêtre', desc: 'Cliquez pour ajouter' },
              { type: 'roof' as const, label: '🏠 Toit', desc: 'Cliquez pour ajouter' },
            ].map(item => (
              <button
                key={item.type}
                onClick={() => {
                  if (item.type === 'wall') {
                    setSelectedTool('room');
                  } else {
                    addElement(item.type);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-all text-sm ${
                  selectedTool === item.type ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            💡 Dessinez sur le canvas pour créer des pièces, ou cliquez sur un élément pour l'ajouter.
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            📐 Plan du bâtiment — Glissez pour créer des pièces, déplacez les éléments
          </span>
          <span className="text-xs text-gray-400">{elements.length} élément{elements.length > 1 ? 's' : ''}</span>
        </div>
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="bg-[#f8fafc] cursor-crosshair"
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { setDragStart(null); setIsDragging(false); }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Elements */}
          {elements.map(el => (
            <g
              key={el.id}
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, el.id); }}
              className="cursor-move"
            >
              {el.type === 'room' ? (
                <>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill={el.color}
                    stroke={selectedElement === el.id ? '#3b82f6' : '#94a3b8'}
                    strokeWidth={selectedElement === el.id ? 3 : 1.5}
                    rx={4}
                    strokeDasharray={selectedElement === el.id ? '5,5' : 'none'}
                  />
                  <text
                    x={el.x + el.width / 2}
                    y={el.y + el.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-gray-600 pointer-events-none"
                    fontSize="11"
                  >
                    {el.label}
                  </text>
                  <text
                    x={el.x + el.width / 2}
                    y={el.y + el.height / 2 + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-400 pointer-events-none"
                    fontSize="9"
                  >
                    {((el.width * el.height) / (GRID_SIZE * GRID_SIZE)).toFixed(1)} m²
                  </text>
                </>
              ) : el.type === 'door' ? (
                <>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill={el.color}
                    stroke={selectedElement === el.id ? '#3b82f6' : '#78350f'}
                    strokeWidth={selectedElement === el.id ? 3 : 1.5}
                    rx={3}
                  />
                  <text x={el.x + el.width / 2} y={el.y + el.height / 2} textAnchor="middle" dominantBaseline="middle" fontSize="14">🚪</text>
                </>
              ) : el.type === 'window' ? (
                <>
                  <rect
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill={el.color}
                    stroke={selectedElement === el.id ? '#3b82f6' : '#1e40af'}
                    strokeWidth={selectedElement === el.id ? 3 : 1.5}
                    rx={2}
                  />
                  <line x1={el.x + 4} y1={el.y + el.height / 2} x2={el.x + el.width - 4} y2={el.y + el.height / 2} stroke="#1e40af" strokeWidth="1" />
                  <line x1={el.x + el.width / 2} y1={el.y + 4} x2={el.x + el.width / 2} y2={el.y + el.height - 4} stroke="#1e40af" strokeWidth="1" />
                </>
              ) : el.type === 'wall' ? (
                <rect
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  fill={el.color}
                  stroke={selectedElement === el.id ? '#3b82f6' : '#374151'}
                  strokeWidth={selectedElement === el.id ? 3 : 1.5}
                  rx={1}
                />
              ) : el.type === 'roof' ? (
                <polygon
                  points={`${el.x},${el.y + el.height} ${el.x + el.width / 2},${el.y} ${el.x + el.width},${el.y + el.height}`}
                  fill={el.color || '#991b1b'}
                  stroke={selectedElement === el.id ? '#3b82f6' : '#7f1d1d'}
                  strokeWidth={selectedElement === el.id ? 3 : 1.5}
                />
              ) : (
                <rect
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  fill={el.color}
                  stroke={selectedElement === el.id ? '#3b82f6' : '#6b7280'}
                  strokeWidth={selectedElement === el.id ? 3 : 1.5}
                  rx={2}
                />
              )}
            </g>
          ))}

          {/* Drawing preview */}
          {dragStart && !isDragging && (
            <rect
              x={dragStart.x}
              y={dragStart.y}
              width={0}
              height={0}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="5,5"
            />
          )}
        </svg>
      </div>

      {/* Right Panel - Properties */}
      <div className="lg:w-64 flex-shrink-0">
        {selectedEl ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
            <h3 className="font-semibold text-gray-700">📝 Propriétés</h3>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nom</label>
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
            <div>
              <label className="text-xs text-gray-500 block mb-1">Couleur</label>
              <input
                type="color"
                value={selectedEl.color}
                onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                className="w-full h-10 border rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Matériau</label>
              <select
                value={selectedEl.material}
                onChange={(e) => updateElement(selectedEl.id, { material: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Aucun</option>
                <option value="concrete">Béton</option>
                <option value="brick">Brique</option>
                <option value="wood">Bois</option>
                <option value="steel">Acier</option>
                <option value="glass">Verre</option>
              </select>
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
              <p>• <strong>Glissez</strong> sur le canvas pour créer une pièce</p>
              <p>• <strong>Cliquez</strong> sur un élément pour le sélectionner</p>
              <p>• <strong>Déplacez</strong> les éléments en les faisant glisser</p>
              <p>• Utilisez le panneau de gauche pour ajouter des éléments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
