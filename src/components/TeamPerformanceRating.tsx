
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
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

  // Always maintain original order - no sorting during rating process
  const displayMembers = useMemo(() => {
    return [...members];
  }, [members]);

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
            className={`relative ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'} select-none`}
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
                className="absolute inset-0 text-yellow-400"
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
                className="absolute inset-0 text-yellow-400 overflow-hidden"
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

  const handleSaveAndLock = (memberId: string) => {
    setLockedMembers(prev => new Set([...prev, memberId]));
    toast.success('Ratings saved and locked');
  };

  const handleImageUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success('Profile image uploaded successfully');
      // In a real app, you'd upload the file and update the member's image
    }
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
          {displayMembers.map((member) => {
            const isLocked = lockedMembers.has(member.id);
            
            return (
              <div key={member.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-semibold text-blue-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <label 
                        htmlFor={`upload-${member.id}`}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-3 w-3 text-gray-600" />
                        <input
                          id={`upload-${member.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(member.id, e)}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                      <p className="text-xs text-gray-500">ID: {member.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLocked && (
                      <Badge variant="destructive">Locked</Badge>
                    )}
                    {!isLocked && (
                      <Button
                        onClick={() => handleSaveAndLock(member.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save & Lock
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(member.ratings).map(([category, rating]) => (
                    <div key={category} className="space-y-2">
                      <label className="text-sm font-medium capitalize">
                        {category === 'overall' ? 'Overall Performance' : category}
                      </label>
                      <div className="flex items-center gap-2">
                        {getRatingStars(rating, member.id, category, isLocked)}
                        <span className="text-sm text-gray-600">({rating}%)</span>
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
