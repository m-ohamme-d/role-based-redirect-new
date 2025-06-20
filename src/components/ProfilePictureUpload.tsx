
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Camera } from 'lucide-react';
import { useProfilePictureUpload } from '@/hooks/useProfilePictureUpload';
import { Progress } from '@/components/ui/progress';

interface ProfilePictureUploadProps {
  userId: string;
  currentImageUrl?: string;
  userName: string;
  onImageUpdate: (newImageUrl: string | null) => void;
  disabled?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  userId,
  currentImageUrl,
  userName,
  onImageUpdate,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadProfilePicture, deleteProfilePicture, uploading, uploadProgress } = useProfilePictureUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const uploadedUrl = await uploadProfilePicture(file, userId);
    if (uploadedUrl) {
      onImageUpdate(uploadedUrl);
      setPreviewUrl(null);
    }
  };

  const handleDelete = async () => {
    if (currentImageUrl) {
      // Extract file path from URL
      const url = new URL(currentImageUrl);
      const filePath = url.pathname.split('/').slice(-2).join('/');
      
      const success = await deleteProfilePicture(filePath);
      if (success) {
        onImageUpdate(null);
      }
    }
  };

  const triggerFileInput = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const displayUrl = previewUrl || currentImageUrl;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="w-fit">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={displayUrl || undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            
            {!disabled && (
              <Button
                onClick={triggerFileInput}
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                disabled={uploading}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploading && (
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {!disabled && (
            <div className="flex gap-2">
              <Button
                onClick={triggerFileInput}
                size="sm"
                variant="outline"
                disabled={uploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              
              {currentImageUrl && (
                <Button
                  onClick={handleDelete}
                  size="sm"
                  variant="destructive"
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
