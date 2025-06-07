
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Camera } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  profileImage?: string;
  originalOrder: number; // Add this to maintain stable ordering
  ratings: {
    productivity: number;
    collaboration: number;
    timeliness: number;
    overall: number;
  };
}

interface TeamPerformanceRatingProps {
  members: TeamMember[];
  onRatingUpdate: (memberId: string, category: string, rating: number) => void;
}

const TeamPerformanceRating: React.FC<TeamPerformanceRatingProps> = ({ 
  members, 
  onRatingUpdate 
}) => {
  const [lockedMembers, setLockedMembers] = useState<Set<string>>(new Set());
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

  // Sort by original order to prevent shuffling during rating updates
  const sortedMembers = [...members].sort((a, b) => a.originalOrder - b.originalOrder);

  const handleStarClick = (memberId: string, category: string, starIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    
    if (lockedMembers.has(memberId)) {
      toast.error('This member\'s ratings are locked');
      return;
    }

    const clickCount = event.detail;
    let newRating: number;
    
    if (clickCount === 2) {
      newRating = (starIndex + 1) * 20;
    } else {
      newRating = (starIndex * 20) + 10;
    }
    
    onRatingUpdate(memberId, category, newRating);
  };

  const getRatingStars = (rating: number, memberId: string, category: string, isLocked: boolean = false) => {
    const fullStars = Math.floor(rating / 20);
    const hasHalfStar = (rating % 20) >= 10;
    
    return (
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((starIndex) => (
          <div
            key={starIndex}
            className={`relative ${!isLocked ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-not-allowed'} select-none`}
            onClick={!isLocked ? (e) => handleStarClick(memberId, category, starIndex, e) : undefined}
            title={!isLocked ? "Single click for half star, double click for full star" : "Ratings locked"}
            style={{ 
              position: 'relative',
              display: 'inline-block',
              fontSize: '1.125rem',
              lineHeight: 1
            }}
          >
            <span className="text-gray-300">★</span>
            {starIndex < fullStars && (
              <span 
                className="absolute inset-0 text-yellow-400 transition-colors duration-200"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  overflow: 'hidden'
                }}
              >
                ★
              </span>
            )}
            {starIndex === fullStars && hasHalfStar && (
              <span 
                className="absolute inset-0 text-yellow-400 overflow-hidden transition-colors duration-200"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  overflow: 'hidden'
                }}
              >
                ★
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handlePhotoUpload = async (memberId: string, file: File) => {
    setUploadingPhoto(memberId);
    
    // Simulate upload with smooth transition
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would typically update the member's profile image
    console.log('Photo uploaded for member:', memberId, file);
    
    setUploadingPhoto(null);
    toast.success('Profile picture updated successfully');
  };

  const handleSaveAndLock = (memberId: string) => {
    setLockedMembers(prev => new Set([...prev, memberId]));
    toast.success('Ratings saved and locked');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Ratings</CardTitle>
          <p className="text-sm text-gray-600">
            Rate team members across multiple criteria. Once saved, ratings are locked and can only be edited by administrators.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedMembers.map((member) => {
            const isLocked = lockedMembers.has(member.id);
            
            return (
              <div key={member.id} className="border rounded-lg p-6 space-y-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <Avatar className="w-16 h-16 border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200">
                        {uploadingPhoto === member.id ? (
                          <div className="flex items-center justify-center w-full h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        ) : (
                          <>
                            <AvatarImage 
                              src={member.profileImage || `https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face`} 
                              alt={member.name}
                              className="object-cover transition-opacity duration-200"
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-full flex items-center justify-center">
                          <Upload className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('Image must be smaller than 5MB');
                              return;
                            }
                            if (!file.type.startsWith('image/')) {
                              toast.error('Please select a valid image file');
                              return;
                            }
                            handlePhotoUpload(member.id, file);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploadingPhoto === member.id}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                      <p className="text-xs text-gray-500">ID: {member.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLocked && (
                      <Badge variant="destructive" className="animate-pulse">Locked</Badge>
                    )}
                    {!isLocked && (
                      <Button
                        onClick={() => handleSaveAndLock(member.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      >
                        Save & Lock
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(member.ratings).map(([category, rating]) => (
                    <div key={category} className="space-y-3 p-3 bg-gray-50 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                      <label className="text-sm font-medium capitalize block">
                        {category === 'overall' ? 'Overall Performance' : category}
                      </label>
                      <div className="flex items-center gap-2">
                        {getRatingStars(rating, member.id, category, isLocked)}
                        <span className="text-sm text-gray-600 font-medium">({rating}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPerformanceRating;
