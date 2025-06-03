
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const handleStarClick = (memberId: string, category: string, starIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    
    if (lockedMembers.has(memberId)) {
      toast.error('This member\'s ratings are locked');
      return;
    }

    const clickCount = event.detail;
    let newRating: number;
    
    if (clickCount === 2) {
      // Double click - full star (20%, 40%, 60%, 80%, 100%)
      newRating = (starIndex + 1) * 20;
    } else {
      // Single click - half star (10%, 30%, 50%, 70%, 90%)
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
          {members.map((member) => {
            const isLocked = lockedMembers.has(member.id);
            
            return (
              <div key={member.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
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
