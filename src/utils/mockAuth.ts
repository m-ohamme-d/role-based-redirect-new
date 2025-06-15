
import { supabase } from '@/integrations/supabase/client';

export const createMockTeamLead = async () => {
  try {
    // First, check if we already have a mock user
    const { data: existingProfile } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('email', 'teamlead@example.com')
      .single();

    if (existingProfile) {
      console.log('Mock team lead already exists:', existingProfile);
      return existingProfile;
    }

    // Create a mock profile for testing
    const mockProfile = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Sarah Team Lead',
      email: 'teamlead@example.com',
      role: 'teamlead' as const
    };

    const { data: profile, error } = await (supabase as any)
      .from('profiles')
      .insert(mockProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating mock profile:', error);
      return null;
    }

    // Now assign this team lead to the IT department
    await (supabase as any)
      .from('departments')
      .update({ team_lead_id: profile.id })
      .eq('name', 'IT');

    console.log('Created mock team lead:', profile);
    return profile;
  } catch (error) {
    console.error('Error in createMockTeamLead:', error);
    return null;
  }
};

export const setMockSession = (profile: any) => {
  // Store mock session in localStorage for development
  localStorage.setItem('mockProfile', JSON.stringify(profile));
};

export const getMockSession = () => {
  const stored = localStorage.getItem('mockProfile');
  return stored ? JSON.parse(stored) : null;
};
