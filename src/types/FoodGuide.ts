export type FoodGroupId = 'vf' | 'gr' | 'mi' | 'me';

export type Gender = 'Male' | 'Female';

export interface FoodItem {
  fgid: FoodGroupId;
  fgcat_id: number;
  srvg_sz: string;
  food: string;
}

export interface FoodGroup {
  fgid: FoodGroupId;
  foodgroup: string;
  fgcat_id: number;
  fgcat: string;
}

export interface ServingRequirement {
  fgid: FoodGroupId;
  gender: Gender;
  ages: string;
  servings: string;
}

export interface DirectionalStatement {
  fgid: FoodGroupId;
  'directional-statement': string;
}

export interface ParsedServingRange {
  min: number;
  max: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
}

export interface MealItem {
  food: string;
  servingSize: string;
  foodGroup: string;
  category: string;
}

export interface DailyMenu {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export interface MenuPlan {
  user: UserProfile;
  menu: DailyMenu;
  servings: Record<FoodGroupId, number>;
}

export interface FamilyMenuPlan {
  familyMenu: DailyMenu;
  memberPlans: MenuPlan[];
  totalServings: Record<FoodGroupId, number>;
}

