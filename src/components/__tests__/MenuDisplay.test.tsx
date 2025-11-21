import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuDisplay } from '../MenuDisplay';
import type { DailyMenu } from '../../types/FoodGuide';

describe('MenuDisplay', () => {
  const mockMenu: DailyMenu = {
    breakfast: [
      {
        food: 'Oatmeal',
        servingSize: '1 cup',
        foodGroup: 'Grains',
        category: 'Whole grain',
      },
    ],
    lunch: [
      {
        food: 'Salmon',
        servingSize: '75g',
        foodGroup: 'Meat and Alternatives',
        category: 'Meat, fish, poultry and shellfish',
      },
    ],
    dinner: [
      {
        food: 'Broccoli',
        servingSize: '125 mL',
        foodGroup: 'Vegetables and Fruit',
        category: 'Dark green vegetable',
      },
    ],
    snacks: [
      {
        food: 'Apple',
        servingSize: '1 medium',
        foodGroup: 'Vegetables and Fruit',
        category: 'Non dark green or orange vegetable',
      },
    ],
  };

  it('should render menu title', () => {
    render(<MenuDisplay menu={mockMenu} title="Test Menu" />);
    expect(screen.getByText('Test Menu')).toBeInTheDocument();
  });

  it('should render all meal sections', () => {
    render(<MenuDisplay menu={mockMenu} />);
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('Snacks')).toBeInTheDocument();
  });

  it('should display food items', () => {
    render(<MenuDisplay menu={mockMenu} />);
    expect(screen.getByText('Oatmeal')).toBeInTheDocument();
    expect(screen.getByText('Salmon')).toBeInTheDocument();
    expect(screen.getByText('Broccoli')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('should display serving sizes', () => {
    render(<MenuDisplay menu={mockMenu} />);
    expect(screen.getByText('1 cup')).toBeInTheDocument();
    expect(screen.getByText('75g')).toBeInTheDocument();
  });

  it('should not render empty meal sections', () => {
    const emptyMenu: DailyMenu = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    render(<MenuDisplay menu={emptyMenu} />);
    expect(screen.queryByText('Breakfast')).not.toBeInTheDocument();
  });
});

