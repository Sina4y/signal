import { useState, useEffect } from 'react';
import { foodDataService } from '../services/FoodDataService';
import type {
  FoodItem,
  FoodGroup,
  ServingRequirement,
  DirectionalStatement,
} from '../types/FoodGuide';

export interface UseFoodDataReturn {
  foods: FoodItem[];
  foodGroups: FoodGroup[];
  servingRequirements: ServingRequirement[];
  directionalStatements: DirectionalStatement[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useFoodData(): UseFoodDataReturn {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodGroups, setFoodGroups] = useState<FoodGroup[]>([]);
  const [servingRequirements, setServingRequirements] = useState<ServingRequirement[]>([]);
  const [directionalStatements, setDirectionalStatements] = useState<DirectionalStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await foodDataService.loadAllData();
      setFoods(foodDataService.getFoods());
      setFoodGroups(foodDataService.getFoodGroups());
      setServingRequirements(foodDataService.getServingRequirements());
      setDirectionalStatements(foodDataService.getDirectionalStatements());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading food data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    foods,
    foodGroups,
    servingRequirements,
    directionalStatements,
    loading,
    error,
    reload: loadData,
  };
}

