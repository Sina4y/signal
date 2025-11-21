import { useState } from 'react';
import { useFoodData } from '../hooks/useFoodData';
import { generateUserMenu, generateFamilyMenu } from '../utils/nutritionCalculations';
import type { UserProfile, MenuPlan, FamilyMenuPlan } from '../types/FoodGuide';
import { UserProfileForm } from './UserProfileForm';
import { MenuDisplay } from './MenuDisplay';
import { ServingsChart } from './ServingsChart';
import { ComparisonChart } from './ComparisonChart';
import { calculateRequiredServings } from '../utils/nutritionCalculations';
import './MenuPlanner.css';

export function MenuPlanner() {
  const { loading, error, directionalStatements } = useFoodData();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [userMenu, setUserMenu] = useState<MenuPlan | null>(null);
  const [familyMenu, setFamilyMenu] = useState<FamilyMenuPlan | null>(null);
  const [viewMode, setViewMode] = useState<'user' | 'family'>('user');

  const handleAddProfile = (profile: UserProfile) => {
    setProfiles([...profiles, profile]);
  };

  const handleRemoveProfile = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  const handleGenerateUserMenu = () => {
    if (profiles.length === 0) {
      alert('Please add at least one family member');
      return;
    }
    const menu = generateUserMenu(profiles[0]);
    setUserMenu(menu);
    setViewMode('user');
  };

  const handleGenerateFamilyMenu = () => {
    if (profiles.length === 0) {
      alert('Please add at least one family member');
      return;
    }
    const menu = generateFamilyMenu(profiles);
    setFamilyMenu(menu);
    setViewMode('family');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading food guide data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <p>Please ensure the data files are available in the /data folder.</p>
      </div>
    );
  }

  return (
    <div className="menu-planner">
      <header className="app-header">
        <h1>🍽️ Canada Food Guide - Daily Menu Planner</h1>
        <p className="subtitle">
          Generate optimal daily menus based on Canada Food Guide recommendations
        </p>
      </header>

      <UserProfileForm
        onAddProfile={handleAddProfile}
        profiles={profiles}
        onRemoveProfile={handleRemoveProfile}
      />

      <div className="menu-actions">
        <button
          onClick={handleGenerateUserMenu}
          className="btn-action"
          disabled={profiles.length === 0}
        >
          Generate User Menu
        </button>
        <button
          onClick={handleGenerateFamilyMenu}
          className="btn-action"
          disabled={profiles.length === 0}
        >
          Generate Family Menu
        </button>
      </div>

      {viewMode === 'user' && userMenu && (
        <div className="menu-results">
          <MenuDisplay
            menu={userMenu.menu}
            title={`Daily Menu for ${userMenu.user.name}`}
          />
          
          <div className="charts-section">
            <ServingsChart
              servings={userMenu.servings}
              title={`Servings Distribution for ${userMenu.user.name}`}
              type="pie"
            />
            <ComparisonChart
              required={calculateRequiredServings(userMenu.user)}
              actual={userMenu.servings}
              title={`Required vs Actual Servings for ${userMenu.user.name}`}
            />
          </div>

          <div className="servings-summary">
            <h3>Servings Summary</h3>
            <div className="servings-grid">
              <div className="serving-item">
                <span className="serving-label">Vegetables & Fruits:</span>
                <span className="serving-value">{userMenu.servings.vf}</span>
              </div>
              <div className="serving-item">
                <span className="serving-label">Grains:</span>
                <span className="serving-value">{userMenu.servings.gr}</span>
              </div>
              <div className="serving-item">
                <span className="serving-label">Milk & Alternatives:</span>
                <span className="serving-value">{userMenu.servings.mi}</span>
              </div>
              <div className="serving-item">
                <span className="serving-label">Meat & Alternatives:</span>
                <span className="serving-value">{userMenu.servings.me}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'family' && familyMenu && (
        <div className="menu-results">
          <MenuDisplay menu={familyMenu.familyMenu} title="Family Daily Menu" />
          
          <div className="charts-section">
            <ServingsChart
              servings={familyMenu.totalServings}
              title="Total Family Servings Distribution"
              type="bar"
            />
          </div>

          <div className="servings-summary">
            <h3>Total Family Servings</h3>
            <div className="servings-grid">
              <div className="serving-item">
                <span className="serving-label">Vegetables & Fruits:</span>
                <span className="serving-value">{familyMenu.totalServings.vf}</span>
              </div>
              <div className="serving-item">
                <span className="serving-label">Grains:</span>
                <span className="serving-value">{familyMenu.totalServings.gr}</span>
              </div>
              <div className="serving-item">
                <span className="serving-label">Milk & Alternatives:</span>
                <span className="serving-value">{familyMenu.totalServings.mi}</span>
              </div>
              <div className="serving-item">
                <span className="serving-label">Meat & Alternatives:</span>
                <span className="serving-value">{familyMenu.totalServings.me}</span>
              </div>
            </div>
          </div>

          <div className="member-breakdown">
            <h3>Per-Member Breakdown</h3>
            {familyMenu.memberPlans.map((plan) => (
              <div key={plan.user.id} className="member-plan">
                <h4>{plan.user.name}'s Menu</h4>
                <MenuDisplay
                  menu={plan.menu}
                  title={`${plan.user.name} (${plan.user.age} years, ${plan.user.gender})`}
                />
                
                <div className="charts-section">
                  <ServingsChart
                    servings={plan.servings}
                    title={`${plan.user.name}'s Servings`}
                    type="pie"
                  />
                  <ComparisonChart
                    required={calculateRequiredServings(plan.user)}
                    actual={plan.servings}
                    title={`${plan.user.name}: Required vs Actual`}
                  />
                </div>

                <div className="servings-summary">
                  <div className="servings-grid">
                    <div className="serving-item">
                      <span className="serving-label">Vegetables & Fruits:</span>
                      <span className="serving-value">{plan.servings.vf}</span>
                    </div>
                    <div className="serving-item">
                      <span className="serving-label">Grains:</span>
                      <span className="serving-value">{plan.servings.gr}</span>
                    </div>
                    <div className="serving-item">
                      <span className="serving-label">Milk & Alternatives:</span>
                      <span className="serving-value">{plan.servings.mi}</span>
                    </div>
                    <div className="serving-item">
                      <span className="serving-label">Meat & Alternatives:</span>
                      <span className="serving-value">{plan.servings.me}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {directionalStatements.length > 0 && (
        <div className="guidelines-section">
          <h3>Nutrition Guidelines</h3>
          <ul className="guidelines-list">
            {directionalStatements.map((statement, index) => (
              <li key={index} className="guideline-item">
                <strong>{statement.fgid === 'vf' ? 'Vegetables & Fruits' : 
                         statement.fgid === 'gr' ? 'Grains' :
                         statement.fgid === 'mi' ? 'Milk & Alternatives' :
                         'Meat & Alternatives'}:</strong> {statement['directional-statement']}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

