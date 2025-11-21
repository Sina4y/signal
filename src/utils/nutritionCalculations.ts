import type {
  UserProfile,
  MealItem,
  DailyMenu,
  MenuPlan,
  FamilyMenuPlan,
  FoodGroupId,
  ParsedServingRange,
} from '../types/FoodGuide';
import { foodDataService } from '../services/FoodDataService';

export function calculateRequiredServings(
  profile: UserProfile
): Record<FoodGroupId, ParsedServingRange> {
  const servings: Record<FoodGroupId, ParsedServingRange> = {
    vf: { min: 0, max: 0 },
    gr: { min: 0, max: 0 },
    mi: { min: 0, max: 0 },
    me: { min: 0, max: 0 },
  };

  const foodGroups: FoodGroupId[] = ['vf', 'gr', 'mi', 'me'];
  
  foodGroups.forEach((fgid) => {
    const requirement = foodDataService.getServingRequirement(
      fgid,
      profile.gender,
      profile.age
    );
    if (requirement) {
      servings[fgid] = requirement;
    }
  });

  return servings;
}

export function generateUserMenu(profile: UserProfile): MenuPlan {
  const requiredServings = calculateRequiredServings(profile);
  const actualServings: Record<FoodGroupId, number> = {
    vf: 0,
    gr: 0,
    mi: 0,
    me: 0,
  };

  const menu: DailyMenu = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  const vfDarkGreen = foodDataService.getFoodsByCategory('vf', 1);
  const vfOrange = foodDataService.getFoodsByCategory('vf', 2);
  const vfOther = foodDataService.getFoodsByCategory('vf', 0);

  const vfTarget = Math.floor((requiredServings.vf.min + requiredServings.vf.max) / 2);
  
  if (vfTarget > 0 && vfDarkGreen.length > 0) {
    menu.breakfast.push({
      food: vfDarkGreen[0].food,
      servingSize: vfDarkGreen[0].srvg_sz,
      foodGroup: 'Vegetables and Fruit',
      category: 'Dark green vegetable',
    });
    actualServings.vf++;
  }

  if (vfTarget > 1 && vfOrange.length > 0) {
    menu.lunch.push({
      food: vfOrange[0].food,
      servingSize: vfOrange[0].srvg_sz,
      foodGroup: 'Vegetables and Fruit',
      category: 'Orange vegetable',
    });
    actualServings.vf++;
  }

  const allVf = [...vfDarkGreen, ...vfOrange, ...vfOther];
  const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snacks'> = ['breakfast', 'lunch', 'dinner', 'snacks'];
  let mealIndex = 0;

  while (actualServings.vf < vfTarget && allVf.length > 0) {
    const randomVf = allVf[Math.floor(Math.random() * allVf.length)];
    const mealType = mealTypes[mealIndex % mealTypes.length];
    
    menu[mealType].push({
      food: randomVf.food,
      servingSize: randomVf.srvg_sz,
      foodGroup: 'Vegetables and Fruit',
      category: foodDataService.getCategoryName('vf', randomVf.fgcat_id),
    });
    actualServings.vf++;
    mealIndex++;
  }

  const grWhole = foodDataService.getFoodsByCategory('gr', 3);
  const grOther = foodDataService.getFoodsByCategory('gr', 4);
  const grTarget = Math.floor((requiredServings.gr.min + requiredServings.gr.max) / 2);
  const wholeGrainTarget = Math.ceil(grTarget / 2);

  for (let i = 0; i < wholeGrainTarget && i < grWhole.length; i++) {
    if (i === 0) {
      menu.breakfast.push({
        food: grWhole[i].food,
        servingSize: grWhole[i].srvg_sz,
        foodGroup: 'Grains',
        category: 'Whole grain',
      });
    } else {
      menu.lunch.push({
        food: grWhole[i].food,
        servingSize: grWhole[i].srvg_sz,
        foodGroup: 'Grains',
        category: 'Whole grain',
      });
    }
    actualServings.gr++;
  }

  for (let i = actualServings.gr; i < grTarget && grOther.length > 0; i++) {
    const randomGr = grOther[Math.floor(Math.random() * grOther.length)];
    menu.dinner.push({
      food: randomGr.food,
      servingSize: randomGr.srvg_sz,
      foodGroup: 'Grains',
      category: 'Non whole grain',
    });
    actualServings.gr++;
  }

  const miMilk = foodDataService.getFoodsByCategory('mi', 5);
  const miAlternatives = foodDataService.getFoodsByCategory('mi', 6);
  const miTarget = Math.floor((requiredServings.mi.min + requiredServings.mi.max) / 2);

  for (let i = 0; i < miTarget; i++) {
    const source = i === 0 && miMilk.length > 0 ? miMilk : miAlternatives;
    if (source.length > 0) {
      const randomMi = source[Math.floor(Math.random() * source.length)];
      if (i === 0) {
        menu.breakfast.push({
          food: randomMi.food,
          servingSize: randomMi.srvg_sz,
          foodGroup: 'Milk and Alternatives',
          category: foodDataService.getCategoryName('mi', randomMi.fgcat_id),
        });
      } else {
        menu.snacks.push({
          food: randomMi.food,
          servingSize: randomMi.srvg_sz,
          foodGroup: 'Milk and Alternatives',
          category: foodDataService.getCategoryName('mi', randomMi.fgcat_id),
        });
      }
      actualServings.mi++;
    }
  }

  const meAlternatives = foodDataService.getFoodsByCategory('me', 7);
  const meMeat = foodDataService.getFoodsByCategory('me', 8);
  const meTarget = Math.floor((requiredServings.me.min + requiredServings.me.max) / 2);

  for (let i = 0; i < Math.min(meTarget, meAlternatives.length); i++) {
    const randomMe = meAlternatives[Math.floor(Math.random() * meAlternatives.length)];
    menu.lunch.push({
      food: randomMe.food,
      servingSize: randomMe.srvg_sz,
      foodGroup: 'Meat and Alternatives',
      category: 'Meat Alternatives',
    });
    actualServings.me++;
  }

  for (let i = actualServings.me; i < meTarget && meMeat.length > 0; i++) {
    const randomMe = meMeat[Math.floor(Math.random() * meMeat.length)];
    menu.dinner.push({
      food: randomMe.food,
      servingSize: randomMe.srvg_sz,
      foodGroup: 'Meat and Alternatives',
      category: 'Meat, fish, poultry and shellfish',
    });
    actualServings.me++;
  }

  return {
    user: profile,
    menu,
    servings: actualServings,
  };
}

export function generateFamilyMenu(profiles: UserProfile[]): FamilyMenuPlan {
  const memberPlans = profiles.map((profile) => generateUserMenu(profile));

  const familyMenu: DailyMenu = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  const totalServings: Record<FoodGroupId, number> = {
    vf: 0,
    gr: 0,
    mi: 0,
    me: 0,
  };

  memberPlans.forEach((plan) => {
    familyMenu.breakfast.push(...plan.menu.breakfast);
    familyMenu.lunch.push(...plan.menu.lunch);
    familyMenu.dinner.push(...plan.menu.dinner);
    familyMenu.snacks.push(...plan.menu.snacks);

    Object.keys(plan.servings).forEach((key) => {
      totalServings[key as FoodGroupId] += plan.servings[key as FoodGroupId];
    });
  });

  const uniqueMeals = (meals: MealItem[]) => {
    const seen = new Set<string>();
    return meals.filter((meal) => {
      const key = `${meal.food}-${meal.servingSize}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  familyMenu.breakfast = uniqueMeals(familyMenu.breakfast);
  familyMenu.lunch = uniqueMeals(familyMenu.lunch);
  familyMenu.dinner = uniqueMeals(familyMenu.dinner);
  familyMenu.snacks = uniqueMeals(familyMenu.snacks);

  return {
    familyMenu,
    memberPlans,
    totalServings,
  };
}

