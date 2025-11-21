import type {
  FoodItem,
  FoodGroup,
  ServingRequirement,
  DirectionalStatement,
  ParsedServingRange,
} from '../types/FoodGuide';
import { parseCSV } from '../utils/csvParser';

const DATA_BASE_PATH = '/data';

export class FoodDataService {
  private foods: FoodItem[] = [];
  private foodGroups: FoodGroup[] = [];
  private servingRequirements: ServingRequirement[] = [];
  private directionalStatements: DirectionalStatement[] = [];

  async loadAllData(): Promise<void> {
    try {
      const [foodsData, groupsData, servingsData, statementsData] = await Promise.all([
        fetch(`${DATA_BASE_PATH}/foods-en_ONPP_rev.csv`).then(async (r) => {
          const arrayBuffer = await r.arrayBuffer();
          try {
            const decoder = new TextDecoder('windows-1252');
            return decoder.decode(arrayBuffer);
          } catch {
            return new TextDecoder('utf-8').decode(arrayBuffer);
          }
        }),
        fetch(`${DATA_BASE_PATH}/foodgroups-en_ONPP.csv`).then(async (r) => {
          const arrayBuffer = await r.arrayBuffer();
          try {
            const decoder = new TextDecoder('windows-1252');
            return decoder.decode(arrayBuffer);
          } catch {
            return new TextDecoder('utf-8').decode(arrayBuffer);
          }
        }),
        fetch(`${DATA_BASE_PATH}/servings_per_day-en_ONPP.csv`).then(async (r) => {
          const arrayBuffer = await r.arrayBuffer();
          try {
            const decoder = new TextDecoder('windows-1252');
            return decoder.decode(arrayBuffer);
          } catch {
            return new TextDecoder('utf-8').decode(arrayBuffer);
          }
        }),
        fetch(`${DATA_BASE_PATH}/fg_directional_satements-en_ONPP.csv`).then(async (r) => {
          const arrayBuffer = await r.arrayBuffer();
          try {
            const decoder = new TextDecoder('windows-1252');
            return decoder.decode(arrayBuffer);
          } catch {
            return new TextDecoder('utf-8').decode(arrayBuffer);
          }
        }),
      ]);

      this.foods = parseCSV<FoodItem>(foodsData, ['fgid', 'fgcat_id', 'srvg_sz', 'food']);
      this.foodGroups = parseCSV<FoodGroup>(groupsData, ['fgid', 'foodgroup', 'fgcat_id', 'fgcat']);
      this.servingRequirements = parseCSV<ServingRequirement>(
        servingsData,
        ['fgid', 'gender', 'ages', 'servings']
      );
      this.directionalStatements = parseCSV<DirectionalStatement>(
        statementsData,
        ['fgid', 'directional-statement']
      );

      this.foods = this.foods
        .filter((f) => f.food && f.fgid)
        .map((f) => ({
          ...f,
          food: this.fixEncoding(f.food),
          srvg_sz: this.fixEncoding(f.srvg_sz),
          fgcat_id: parseInt(String(f.fgcat_id).trim()) || 0,
        }));

      this.foodGroups = this.foodGroups
        .filter((g) => g.fgid && g.foodgroup)
        .map((g) => ({
          ...g,
          foodgroup: this.fixEncoding(g.foodgroup),
          fgcat: this.fixEncoding(g.fgcat),
          fgcat_id: parseInt(String(g.fgcat_id).trim()) || 0,
        }));
    } catch (error) {
      console.error('Error loading food data:', error);
      throw new Error('Failed to load food guide data');
    }
  }

  getFoods(): FoodItem[] {
    return this.foods;
  }

  getFoodGroups(): FoodGroup[] {
    return this.foodGroups;
  }

  getServingRequirements(): ServingRequirement[] {
    return this.servingRequirements;
  }

  getDirectionalStatements(): DirectionalStatement[] {
    return this.directionalStatements;
  }

  getFoodsByGroup(fgid: string): FoodItem[] {
    return this.foods.filter((f) => f.fgid === fgid);
  }

  getFoodsByCategory(fgid: string, fgcat_id: number): FoodItem[] {
    return this.foods.filter((f) => f.fgid === fgid && f.fgcat_id === fgcat_id);
  }

  getFoodGroupName(fgid: string): string {
    const group = this.foodGroups.find((g) => g.fgid === fgid);
    return group?.foodgroup || fgid;
  }

  getCategoryName(fgid: string, fgcat_id: number): string {
    const category = this.foodGroups.find(
      (g) => g.fgid === fgid && g.fgcat_id === fgcat_id
    );
    return category?.fgcat || '';
  }

  parseServingRange(servings: string): ParsedServingRange {
    const trimmed = servings.trim();
    const rangeMatch = trimmed.match(/(\d+)\s+to\s+(\d+)/);
    
    if (rangeMatch) {
      return {
        min: parseInt(rangeMatch[1]),
        max: parseInt(rangeMatch[2]),
      };
    }
    
    const single = parseInt(trimmed);
    return {
      min: single,
      max: single,
    };
  }

  getServingRequirement(
    fgid: string,
    gender: string,
    age: number
  ): ParsedServingRange | null {
    const ageGroup = this.getAgeGroup(age);
    const requirement = this.servingRequirements.find(
      (r) => r.fgid === fgid && r.gender === gender && r.ages === ageGroup
    );

    if (!requirement) return null;

    return this.parseServingRange(requirement.servings);
  }

  private getAgeGroup(age: number): string {
    if (age >= 2 && age <= 3) return '2 to 3';
    if (age >= 4 && age <= 8) return '4 to 8';
    if (age >= 9 && age <= 13) return '9 to 13';
    if (age >= 14 && age <= 18) return '14 to 18';
    if (age >= 19 && age <= 30) return '19 to 30';
    if (age >= 31 && age <= 50) return '31 to 50';
    if (age >= 51 && age <= 70) return '51 to 70';
    return '71+';
  }

  private fixEncoding(text: string): string {
    if (!text) return text;
    
    let fixed = text;
    const replacements = [
      { pattern: /\uFFFD\s*cup/gi, replacement: '½ cup' },
      { pattern: /\uFFFD\s*bagel/gi, replacement: '½ bagel' },
      { pattern: /\uFFFD\s*pita/gi, replacement: '½ pita' },
      { pattern: /\uFFFD\s*piece/gi, replacement: '½ piece' },
      { pattern: /\uFFFD\s*muffin/gi, replacement: '½ muffin' },
      { pattern: /\uFFFD\s*naan/gi, replacement: '½ naan' },
      { pattern: /\uFFFD\s*fruit/gi, replacement: '½ fruit' },
      { pattern: /\uFFFD\s*medium/gi, replacement: '½ medium' },
      { pattern: /\uFFFD\s*pod/gi, replacement: '½ pod' },
      { pattern: /\uFFFD\s*leek/gi, replacement: '½ leek' },
      { pattern: /\uFFFD\s*slice/gi, replacement: '½ slice' },
      { pattern: /\uFFFD\s*ear/gi, replacement: '½ ear' },
      { pattern: /\uFFFD\s*oz/gi, replacement: '½ oz' },
      { pattern: /\uFFFD/g, replacement: '½' },
    ];

    replacements.forEach(({ pattern, replacement }) => {
      fixed = fixed.replace(pattern, replacement);
    });

    return fixed;
  }
}

export const foodDataService = new FoodDataService();

