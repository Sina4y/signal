import { useState } from 'react';
import type { UserProfile, Gender } from '../types/FoodGuide';
import './UserProfileForm.css';

interface UserProfileFormProps {
  onAddProfile: (profile: UserProfile) => void;
  profiles: UserProfile[];
  onRemoveProfile: (id: string) => void;
}

export function UserProfileForm({
  onAddProfile,
  profiles,
  onRemoveProfile,
}: UserProfileFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ageNum = parseInt(age);
    if (!name.trim() || !age || isNaN(ageNum) || ageNum < 2 || ageNum > 120) {
      alert('Please enter a valid name and age (2-120)');
      return;
    }

    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: name.trim(),
      age: ageNum,
      gender,
    };

    onAddProfile(newProfile);
    setName('');
    setAge('');
    setGender('Male');
  };

  return (
    <div className="profile-form-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h3>Add Family Member</h3>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            min="2"
            max="120"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Add Member
        </button>
      </form>

      {profiles.length > 0 && (
        <div className="profiles-list">
          <h4>Family Members ({profiles.length})</h4>
          <ul>
            {profiles.map((profile) => (
              <li key={profile.id} className="profile-item">
                <span>
                  {profile.name}, {profile.age} years old ({profile.gender})
                </span>
                <button
                  onClick={() => onRemoveProfile(profile.id)}
                  className="btn-remove"
                  aria-label={`Remove ${profile.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

