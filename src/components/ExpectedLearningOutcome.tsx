
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Clock, Hash, Users, Brain, Lightbulb } from 'lucide-react';

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
    { id: 'levels', label: 'Different levels of students', icon: '👥', description: 'Accommodate diverse learning abilities' },
    { id: 'objectives', label: 'We the core objectives', icon: '🎯', description: 'Align with selected core objectives' },
    { id: 'blooms', label: 'Blooms/DoK', icon: '🧠', description: 'Depth of Knowledge taxonomy' },
    { id: 'mi', label: 'MI theory based', icon: '🌟', description: 'Multiple Intelligence theory' }
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
          <Lightbulb className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Expected Learning Outcome</h3>
          <p className="text-gray-600 text-sm">Define activity parameters and learning frameworks</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock size={16} className="text-blue-500" />
            Duration
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="45"
              className="w-20 h-10 text-center border-gray-300 focus:border-blue-500"
            />
            <span className="text-sm text-gray-500 font-medium">mins</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Hash size={16} className="text-purple-500" />
            Activity No.
          </label>
          <Input
            type="number"
            value={activityNumber}
            onChange={(e) => setActivityNumber(e.target.value)}
            placeholder="1"
            className="w-20 h-10 text-center border-gray-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users size={16} className="text-orange-500" />
            Type
          </label>
          <div className="flex items-center gap-2">
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-32 h-10 border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="p-2 border-gray-300 hover:border-blue-400">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Brain size={16} className="text-pink-500" />
            Blooms/DoK
          </label>
          <Input
            value={bloomsLevel}
            onChange={(e) => setBloomsLevel(e.target.value)}
            placeholder="1,3"
            className="w-24 h-10 text-center border-gray-300 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Learning Framework Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                selectedFeatures.includes(feature.label) 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <Checkbox
                id={feature.id}
                checked={selectedFeatures.includes(feature.label)}
                onCheckedChange={(checked) => handleFeatureChange(feature.label, !!checked)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{feature.icon}</span>
                  <label 
                    htmlFor={feature.id} 
                    className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                  >
                    {feature.label}
                  </label>
                </div>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerateELO}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Lightbulb className="mr-2" size={18} />
          Generate Learning Outcomes
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Based on {selectedFeatures.length} selected framework{selectedFeatures.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Lightbulb size={12} className="text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900">Generated Learning Outcomes</h4>
        </div>
        <p className="text-sm text-gray-600">
          Your expected learning outcomes will be generated here and will be fully editable to match your specific needs.
        </p>
      </div>
    </div>
  );
};

export default ExpectedLearningOutcome;
