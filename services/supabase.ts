import { createClient } from '@supabase/supabase-js';

// Supabase credentials from config.js (converted to TypeScript)
const supabaseUrl = 'https://jkrwoneaoowowxjovkol.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcndvbmVhb293b3d4am92a29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzU3MjgsImV4cCI6MjA3ODU1MTcyOH0.6mYsAw_irzTL9sGosi2gRJw2qO11sqEceewpG3g9KEM';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Registration data interface matching the database schema
export interface RegistrationData {
  email: string;
  full_name: string;
  organization?: string;
  role?: string;
  session_id: string;
  session_start_utc: string; // ISO timestamp
  session_end_utc: string;   // ISO timestamp
  tz?: string;
}

/**
 * Saves a registration to the Supabase database and sends confirmation email
 * @param data Registration data matching the database schema
 * @returns The ID of the created registration
 */
export const saveRegistration = async (data: RegistrationData) => {
  try {
    // Save registration to database
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert([data])
      .select('id')
      .single();

    if (error) {
      console.error('Error saving registration:', error);
      throw new Error(`Failed to save registration: ${error.message}`);
    }

    console.log('Registration saved successfully:', registration.id);

    // Send confirmation email via Edge Function
    try {
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke(
        'send-registration-email',
        {
          body: data
        }
      );

      if (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't throw - registration was successful even if email failed
        console.warn('Registration completed but email notification failed');
      } else {
        console.log('Confirmation email sent successfully:', emailResponse);
      }
    } catch (emailErr) {
      console.error('Unexpected email error:', emailErr);
      // Don't throw - registration was successful
    }

    return registration.id;
  } catch (err) {
    console.error('Unexpected error:', err);
    throw err;
  }
};
