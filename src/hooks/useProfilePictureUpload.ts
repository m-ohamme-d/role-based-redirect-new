
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfilePictureUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return null;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('Uploading file:', filePath);

      // First, try to create the bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars');
      
      if (!avatarsBucket) {
        const { error: bucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (bucketError) {
          console.log('Bucket creation error (may already exist):', bucketError);
        }
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload profile picture: ' + error.message);
        return null;
      }

      setUploadProgress(100);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Upload successful:', urlData.publicUrl);
      toast.success('Profile picture uploaded successfully!');
      
      return urlData.publicUrl;

    } catch (error) {
      console.error('Unexpected upload error:', error);
      toast.error('An unexpected error occurred during upload');
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteProfilePicture = async (filePath: string): Promise<boolean> => {
    try {
      // Extract the path without the bucket URL prefix
      const pathOnly = filePath.split('/').slice(-2).join('/');
      
      const { error } = await supabase.storage
        .from('avatars')
        .remove([pathOnly]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete profile picture: ' + error.message);
        return false;
      }

      toast.success('Profile picture deleted successfully!');
      return true;
    } catch (error) {
      console.error('Unexpected delete error:', error);
      toast.error('An unexpected error occurred during deletion');
      return false;
    }
  };

  return {
    uploadProfilePicture,
    deleteProfilePicture,
    uploading,
    uploadProgress
  };
};
