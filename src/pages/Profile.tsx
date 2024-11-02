import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, MapPin, Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import Combobox from '../components/Combobox';
import { useProvinces } from '../hooks/useProvinces';
import Skeleton from '../components/Skeleton';

interface UserProfile {
  name: string;
  email: string;
  city: string;
  provinceId: number;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

const getRandomColor = () => {
  const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { provinces, isLoading: isLoadingProvinces, getProvinceName } = useProvinces();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: user?.username || '',
    city: '',
    provinceId: 7,
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [profileExists, setProfileExists] = useState(false);
  
  const avatarColor = useMemo(() => getRandomColor(), []);
  const firstLetter = useMemo(() => profile.name.charAt(0).toUpperCase(), [profile.name]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('name, email, city, province_id')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setProfileExists(false);
            setIsLoading(false);
            return;
          }
          throw error;
        }

        if (data) {
          setProfileExists(true);
          const userProfile = {
            name: data.name || '',
            email: data.email || profile.email,
            city: data.city || '',
            provinceId: data.province_id || profile.provinceId,
            preferences: {
              emailNotifications: true,
              smsNotifications: false,
            },
          };
          setProfile(userProfile);
          setEditedProfile(userProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const validateProfile = () => {
    if (!editedProfile.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!editedProfile.email.trim() || !/\S+@\S+\.\S+/.test(editedProfile.email)) {
      toast.error('Valid email is required');
      return false;
    }
    if (!editedProfile.city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!editedProfile.provinceId) {
      toast.error('Province is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!validateProfile()) return;

    setIsSubmitting(true);
    try {
      const profileData = {
        user_id: user.id,
        name: editedProfile.name,
        email: editedProfile.email,
        city: editedProfile.city,
        province_id: editedProfile.provinceId,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        });

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      setProfileExists(true);
      toast.success(profileExists ? 'Profile updated successfully' : 'Profile created successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
        </div>
        {!isLoading && !isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        ) : !isLoading && (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Check className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {isLoading ? (
                <Skeleton className="h-24 w-24 rounded-full" />
              ) : (
                <div className={`h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold text-white ${avatarColor}`}>
                  {firstLetter}
                </div>
              )}
            </div>
            <div className="flex-1">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your name"
                  required
                  disabled={isSubmitting}
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{profile.name || 'Add your name'}</h2>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  {isLoading ? (
                    <Skeleton className="h-6 w-48" />
                  ) : isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="email@example.com"
                      required
                      disabled={isSubmitting}
                    />
                  ) : (
                    <span className="text-gray-600">{profile.email}</span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {isLoading ? (
                      <Skeleton className="h-6 w-32" />
                    ) : isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.city}
                        onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                        placeholder="City"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        disabled={isSubmitting}
                      />
                    ) : (
                      <span className="text-gray-600">{profile.city || 'Add your city'}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 ml-8">
                    {isLoading ? (
                      <Skeleton className="h-6 w-40" />
                    ) : isEditing ? (
                      <Combobox
                        value={editedProfile.provinceId}
                        onChange={(value) => setEditedProfile({ ...editedProfile, provinceId: value })}
                        options={provinces}
                        placeholder="Select province..."
                        disabled={isLoadingProvinces}
                      />
                    ) : (
                      <span className="text-gray-600">{getProvinceName(profile.provinceId)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? editedProfile.preferences.emailNotifications : profile.preferences.emailNotifications}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          preferences: {
                            ...editedProfile.preferences,
                            emailNotifications: e.target.checked
                          }
                        })}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">SMS Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? editedProfile.preferences.smsNotifications : profile.preferences.smsNotifications}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          preferences: {
                            ...editedProfile.preferences,
                            smsNotifications: e.target.checked
                          }
                        })}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;