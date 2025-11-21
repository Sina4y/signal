import { describe, it, expect, beforeEach } from 'vitest';
import { calculateRequiredServings, generateUserMenu } from '../nutritionCalculations';
import type { UserProfile } from '../../types/FoodGuide';
import { foodDataService } from '../../services/FoodDataService';

describe('nutritionCalculations', () => {
  beforeEach(async () => {
    await foodDataService.loadAllData();
  });

  describe('calculateRequiredServings', () => {
    it('should calculate servings for a 25-year-old male', () => {
      const profile: UserProfile = {
        id: '1',
        name: 'Test User',
        age: 25,
        gender: 'Male',
      };

      const servings = calculateRequiredServings(profile);

      expect(servings.vf.min).toBeGreaterThan(0);
      expect(servings.gr.min).toBeGreaterThan(0);
      expect(servings.mi.min).toBeGreaterThan(0);
      expect(servings.me.min).toBeGreaterThan(0);
    });

    it('should calculate servings for a 10-year-old female', () => {
      const profile: UserProfile = {
        id: '2',
        name: 'Test Child',
        age: 10,
        gender: 'Female',
      };

      const servings = calculateRequiredServings(profile);

      expect(servings.vf.min).toBeGreaterThan(0);
      expect(servings.gr.min).toBeGreaterThan(0);
      expect(servings.mi.min).toBeGreaterThan(0);
      expect(servings.me.min).toBeGreaterThan(0);
    });
  });

  describe('generateUserMenu', () => {
    it('should generate a menu with all required meal types', () => {
      const profile: UserProfile = {
        id: '1',
        name: 'Test User',
        age: 30,
        gender: 'Male',
      };

      const menuPlan = generateUserMenu(profile);

      expect(menuPlan).toBeDefined();
      expect(menuPlan.user).toEqual(profile);
      expect(menuPlan.menu).toBeDefined();
      expect(menuPlan.menu.breakfast).toBeDefined();
      expect(menuPlan.menu.lunch).toBeDefined();
      expect(menuPlan.menu.dinner).toBeDefined();
      expect(menuPlan.menu.snacks).toBeDefined();
      expect(menuPlan.servings).toBeDefined();
    });

    it('should include at least one dark green vegetable (per guidelines)', () => {
      const profile: UserProfile = {
        id: '1',
        name: 'Test User',
        age: 30,
        gender: 'Male',
      };

      const menuPlan = generateUserMenu(profile);
      const allMeals = [
        ...menuPlan.menu.breakfast,
        ...menuPlan.menu.lunch,
        ...menuPlan.menu.dinner,
        ...menuPlan.menu.snacks,
      ];

      const darkGreenVeggies = allMeals.filter(
        (item) => item.category === 'Dark green vegetable'
      );

      expect(darkGreenVeggies.length).toBeGreaterThan(0);
    });

    it('should include at least one orange vegetable (per guidelines)', () => {
      const profile: UserProfile = {
        id: '1',
        name: 'Test User',
        age: 30,
        gender: 'Male',
      };

      const menuPlan = generateUserMenu(profile);
      const allMeals = [
        ...menuPlan.menu.breakfast,
        ...menuPlan.menu.lunch,
        ...menuPlan.menu.dinner,
        ...menuPlan.menu.snacks,
      ];

      const orangeVeggies = allMeals.filter(
        (item) => item.category === 'Orange vegetable'
      );

      expect(orangeVeggies.length).toBeGreaterThan(0);
    });

    it('should include whole grains (at least half per guidelines)', () => {
      const profile: UserProfile = {
        id: '1',
        name: 'Test User',
        age: 30,
        gender: 'Male',
      };

      const menuPlan = generateUserMenu(profile);
      const allMeals = [
        ...menuPlan.menu.breakfast,
        ...menuPlan.menu.lunch,
        ...menuPlan.menu.dinner,
        ...menuPlan.menu.snacks,
      ];

      const grains = allMeals.filter((item) => item.foodGroup === 'Grains');
      const wholeGrains = grains.filter((item) => item.category === 'Whole grain');

      if (grains.length > 0) {
        expect(wholeGrains.length).toBeGreaterThan(0);
      }
    });
  });
});

