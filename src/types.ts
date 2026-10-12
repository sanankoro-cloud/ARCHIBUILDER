export interface Point {
  x: number;
  y: number;
}

export interface BuildingElement {
  id: string;
  type: 'wall' | 'door' | 'window' | 'roof' | 'floor' | 'room';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  material: string;
  label: string;
}

export interface EnvironmentElement {
  id: string;
  type: 'tree' | 'bush' | 'path' | 'fence' | 'pool' | 'garden' | 'parking';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface WorkStep {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  cost: number;
  dependencies: string[];
  category: 'foundation' | 'structure' | 'roofing' | 'plumbing' | 'electrical' | 'finishing' | 'exterior';
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  description: string;
  icon: string;
}

export interface Project {
  name: string;
  description: string;
  buildingElements: BuildingElement[];
  environmentElements: EnvironmentElement[];
  workSteps: WorkStep[];
  totalArea: number;
  createdAt: string;
}
