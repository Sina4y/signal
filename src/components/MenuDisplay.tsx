import type { DailyMenu, MealItem } from '../types/FoodGuide';
import './MenuDisplay.css';

interface MenuDisplayProps {
  menu: DailyMenu;
  title?: string;
}

export function MenuDisplay({ menu, title = 'Daily Menu' }: MenuDisplayProps) {
  const MealSection = ({ 
    mealName, 
    items 
  }: { 
    mealName: string; 
    items: MealItem[] 
  }) => {
    if (items.length === 0) return null;

    return (
      <div className="meal-section">
        <h3 className="meal-title">{mealName}</h3>
        <ul className="meal-items">
          {items.map((item, index) => (
            <li key={index} className="meal-item">
              <span className="food-name">{item.food}</span>
              <span className="serving-size">{item.servingSize}</span>
              <span className="category-badge">{item.category}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="menu-display">
      <h2 className="menu-title">{title}</h2>
      <div className="meals-container">
        <MealSection mealName="Breakfast" items={menu.breakfast} />
        <MealSection mealName="Lunch" items={menu.lunch} />
        <MealSection mealName="Dinner" items={menu.dinner} />
        <MealSection mealName="Snacks" items={menu.snacks} />
      </div>
    </div>
  );
}

