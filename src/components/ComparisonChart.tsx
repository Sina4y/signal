import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { FoodGroupId, ParsedServingRange } from '../types/FoodGuide';
import './ComparisonChart.css';

interface ComparisonChartProps {
  required: Record<FoodGroupId, ParsedServingRange>;
  actual: Record<FoodGroupId, number>;
  title?: string;
}

const COLORS = {
  vf: '#27ae60',
  gr: '#f39c12',
  mi: '#3498db',
  me: '#e74c3c',
};

const FOOD_GROUP_LABELS: Record<FoodGroupId, string> = {
  vf: 'Veg & Fruit',
  gr: 'Grains',
  mi: 'Milk',
  me: 'Meat',
};

export function ComparisonChart({ required, actual, title = 'Required vs Actual Servings' }: ComparisonChartProps) {
  const data = Object.keys(required).map((key) => {
    const fgid = key as FoodGroupId;
    const req = required[fgid];
    return {
      name: FOOD_GROUP_LABELS[fgid],
      requiredMin: req.min,
      requiredMax: req.max,
      actual: actual[fgid] || 0,
      color: COLORS[fgid],
    };
  });

  return (
    <div className="comparison-chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'requiredMin' || name === 'requiredMax') {
                  return [`${value} servings`, name === 'requiredMin' ? 'Required (Min)' : 'Required (Max)'];
                }
                return [`${value} servings`, 'Actual'];
              }}
            />
            <Legend
              formatter={(value) => {
                if (value === 'requiredMin') return 'Required (Min)';
                if (value === 'requiredMax') return 'Required (Max)';
                if (value === 'actual') return 'Actual';
                return value;
              }}
            />
            <Bar dataKey="requiredMin" fill="#bdc3c7" name="requiredMin" radius={[4, 4, 0, 0]} />
            <Bar dataKey="requiredMax" fill="#95a5a6" name="requiredMax" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="actual" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#bdc3c7' }}></span>
          <span>Required (Min)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#95a5a6' }}></span>
          <span>Required (Max)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#3498db', border: '2px solid #2c3e50' }}></span>
          <span>Actual Servings</span>
        </div>
      </div>
    </div>
  );
}

