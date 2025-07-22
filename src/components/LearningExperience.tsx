import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BookOpen, Clock, Users } from 'lucide-react';

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  materials: string[];
}

const LearningExperience = () => {
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [newActivity, setNewActivity] = useState<Omit<LearningActivity, 'id'>>({
    title: '',
    description: '',
    duration: '',
    type: '',
    materials: []
  });

  const activityTypes = [
    { value: 'introduction', label: 'Introduction' },
    { value: 'direct-instruction', label: 'Direct Instruction' },
    { value: 'guided-practice', label: 'Guided Practice' },
    { value: 'independent-practice', label: 'Independent Practice' },
    { value: 'group-work', label: 'Group Work' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'closure', label: 'Closure' }
  ];

  const addActivity = () => {
    if (!newActivity.title || !newActivity.type) return;

    const activity: LearningActivity = {
      id: Date.now().toString(),
      ...newActivity
    };

    setActivities([...activities, activity]);
    setNewActivity({
      title: '',
      description: '',
      duration: '',
      type: '',
      materials: []
    });
  };

  const editActivity = (id: string) => {
    // Implementation for editing activities
    console.log('Edit activity:', id);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const updateNewActivity = (field: string, value: any) => {
    setNewActivity(prev => ({ ...prev, [field]: value }));
  };

  const addMaterial = (material: string) => {
    if (material.trim()) {
      setNewActivity(prev => ({
        ...prev,
        materials: [...prev.materials, material.trim()]
      }));
    }
  };

  const removeMaterial = (index: number) => {
    setNewActivity(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const getTotalDuration = () => {
    return activities.reduce((total, activity) => {
      const duration = parseInt(activity.duration) || 0;
      return total + duration;
    }, 0);
  };

  return (
    <div className="space-y-8">
      {/* Add New Activity Form */}
      <Card className="border-2 border-dashed border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Plus className="h-5 w-5" />
            Add Learning Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="activity-title">Activity Title *</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => updateNewActivity('title', e.target.value)}
                placeholder="Enter activity title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="activity-type">Activity Type *</Label>
              <Select 
                value={newActivity.type} 
                onValueChange={(value) => updateNewActivity('type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="activity-duration">Duration (minutes)</Label>
            <Input
              id="activity-duration"
              type="number"
              min="1"
              value={newActivity.duration}
              onChange={(e) => updateNewActivity('duration', e.target.value)}
              placeholder="Enter duration in minutes"
              className="mt-1 max-w-xs"
            />
          </div>

          <div>
            <Label htmlFor="activity-description">Description</Label>
            <Textarea
              id="activity-description"
              value={newActivity.description}
              onChange={(e) => updateNewActivity('description', e.target.value)}
              placeholder="Describe the learning activity..."
              className="mt-1 min-h-20"
            />
          </div>

          <div>
            <Label>Materials Needed</Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add material..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addMaterial((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addMaterial(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              
              {newActivity.materials.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newActivity.materials.map((material, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeMaterial(index)}>
                      {material} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={addActivity}
            disabled={!newActivity.title || !newActivity.type}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>

      {/* Activities Summary */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Activities Overview
              <Badge variant="outline" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                Total: {getTotalDuration()} minutes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <Card key={activity.id} className="border border-muted">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{activity.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="capitalize">
                                {activity.type.replace('-', ' ')}
                              </Badge>
                            </div>
                            {activity.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration} min
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editActivity(activity.id)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteActivity(activity.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {activity.description && (
                      <p className="text-muted-foreground mb-3 leading-relaxed">
                        {activity.description}
                      </p>
                    )}

                    {activity.materials.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Materials:</h5>
                        <div className="flex flex-wrap gap-2">
                          {activity.materials.map((material, materialIndex) => (
                            <Badge key={materialIndex} variant="secondary">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activities.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Learning Activities Added
            </h3>
            <p className="text-muted-foreground">
              Start by adding your first learning activity using the form above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningExperience;