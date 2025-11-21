import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { FoodGroupId } from '../types/FoodGuide';
import './ServingsChart.css';

interface ServingsChartProps {
  servings: Record<FoodGroupId, number>;
  title?: string;
  type?: 'pie' | 'bar';
}

const COLORS = {
  vf: '#27ae60',
  gr: '#f39c12',
  mi: '#3498db',
  me: '#e74c3c',
};

const FOOD_GROUP_LABELS: Record<FoodGroupId, string> = {
  vf: 'Vegetables & Fruits',
  gr: 'Grains',
  mi: 'Milk & Alternatives',
  me: 'Meat & Alternatives',
};

export function ServingsChart({ servings, title = 'Servings Distribution', type = 'pie' }: ServingsChartProps) {
  const totalServings = Object.values(servings).reduce((sum, val) => sum + val, 0);
  
  const data = Object.entries(servings).map(([key, value]) => ({
    name: FOOD_GROUP_LABELS[key as FoodGroupId],
    value,
    color: COLORS[key as FoodGroupId],
    percentage: totalServings > 0 ? Math.round((value / totalServings) * 100) : 0,
  }));

  if (totalServings === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <p className="chart-empty">No servings data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={{ stroke: '#888', strokeWidth: 1 }}
                label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius, x, y }) => {
                  if (percentage === 0) return null;
                  
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 20;
                  const labelX = cx + radius * Math.cos(-midAngle * RADIAN);
                  const labelY = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  return (
                    <text 
                      x={labelX} 
                      y={labelY} 
                      fill="#2c3e50" 
                      textAnchor={labelX > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="600"
                    >
                      {`${name}: ${percentage}%`}
                    </text>
                  );
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} servings`, 'Servings']} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} servings`, 'Servings']} />
              <Legend />
              <Bar dataKey="value" fill="#3498db">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Total Servings:</span>
          <span className="summary-value">{totalServings}</span>
        </div>
      </div>
    </div>
  );
}

