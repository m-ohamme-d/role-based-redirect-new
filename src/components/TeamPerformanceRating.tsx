import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar_url?: string;
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
  const [memberOrder, setMemberOrder] = useState<string[]>([]);
  const [memberAvatars, setMemberAvatars] = useState<Record<string, string>>({});

  // Initialize member order on first render and maintain it
  const displayMembers = useMemo(() => {
    if (memberOrder.length === 0) {
      const initialOrder = members.map(member => member.id);
      setMemberOrder(initialOrder);
      return members;
    }
    
    // Sort members based on the fixed order, new members go to the end
    const sortedMembers = [...members].sort((a, b) => {
      const indexA = memberOrder.indexOf(a.id);
      const indexB = memberOrder.indexOf(b.id);
      
      // If both members are in the order, use that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one member is in the order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the order, sort by id for consistency
      return a.id.localeCompare(b.id);
    });
    
    // Update order to include any new members
    const currentIds = members.map(m => m.id);
    const newOrder = [
      ...memberOrder.filter(id => currentIds.includes(id)),
      ...currentIds.filter(id => !memberOrder.includes(id))
    ];
    
    if (newOrder.length !== memberOrder.length) {
      setMemberOrder(newOrder);
    }
    
    return sortedMembers;
  }, [members, memberOrder]);

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

  const handleImageUpdate = (memberId: string, newImageUrl: string | null) => {
    if (newImageUrl) {
      setMemberAvatars(prev => ({ ...prev, [memberId]: newImageUrl }));
    } else {
      setMemberAvatars(prev => {
        const updated = { ...prev };
        delete updated[memberId];
        return updated;
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Ratings</CardTitle>
          <p className="text-sm text-gray-600">
            Rate team members across multiple criteria. Single click for half star, double click for full star.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {displayMembers.map((member) => {
            const isLocked = lockedMembers.has(member.id);
            const avatarUrl = memberAvatars[member.id] || member.avatar_url;
            
            return (
              <div key={member.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="text-sm font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {!isLocked && (
                        <div className="text-center">
                          <ProfilePictureUpload
                            userId={member.id}
                            currentImageUrl={avatarUrl}
                            userName={member.name}
                            onImageUpdate={(url) => handleImageUpdate(member.id, url)}
                          />
                        </div>
                      )}
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
