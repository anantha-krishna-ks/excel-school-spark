
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

const ExpectedLearningOutcome = () => {
  const [duration, setDuration] = useState('');
  const [activityNumber, setActivityNumber] = useState('');
  const [activityType, setActivityType] = useState('');
  const [bloomsLevel, setBloomsLevel] = useState('1,3');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Different levels of students',
    'We the core objectives',
    'Blooms/DoK',
    'MI theory based'
  ]);

  const features = [
    'Different levels of students',
    'We the core objectives', 
    'Blooms/DoK',
    'MI theory based'
  ];

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

  const handleGenerateELO = () => {
    console.log('Generating ELO with:', {
      duration,
      activityNumber,
      activityType,
      bloomsLevel,
      selectedFeatures
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Learning Outcome</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity: Duration
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="mins"
              className="w-20"
            />
            <span className="text-sm text-gray-500">mins</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No:
          </label>
          <Input
            type="number"
            value={activityNumber}
            onChange={(e) => setActivityNumber(e.target.value)}
            className="w-20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <div className="flex items-center gap-2">
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="p-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blooms/DoK
          </label>
          <Input
            value={bloomsLevel}
            onChange={(e) => setBloomsLevel(e.target.value)}
            className="w-20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {features.map((feature) => (
          <div key={feature} className="flex items-center space-x-3">
            <Checkbox
              id={feature}
              checked={selectedFeatures.includes(feature)}
              onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <label 
              htmlFor={feature} 
              className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
            >
              {feature}
            </label>
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <Button 
          onClick={handleGenerateELO}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
        >
          Generate ELO
        </Button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Generated ELO should be editable.
        </p>
      </div>
    </div>
  );
};

export default ExpectedLearningOutcome;
