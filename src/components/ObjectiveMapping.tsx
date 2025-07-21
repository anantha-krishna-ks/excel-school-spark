import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Brain, Users, Heart, Link, ArrowRight, Eye, Lightbulb } from 'lucide-react';

interface ObjectiveMappingProps {
  coreObjectives?: string[];
  learningOutcomes?: string[];
}

// Dummy data structure as specified
const dummyMappingData = [
  {
    id: 1,
    coreObjective: "CO 1: Students will identify primary colors.",
    learningOutcomes: [
      "ELO 1.1: Recognize red, blue, yellow.",
      "ELO 1.2: Differentiate primary from secondary."
    ],
    bloomsTaxonomy: "Knowledge",
    skills: ["Observation", "Identification"]
  },
  {
    id: 2,
    coreObjective: "CO 2: Students will analyze a simple poem.",
    learningOutcomes: [
      "ELO 2.1: Explain metaphors.",
      "ELO 2.2: Summarize the poem's theme."
    ],
    bloomsTaxonomy: "Analysis",
    skills: ["Critical Thinking", "Interpretation", "Deduction"]
  },
  {
    id: 3,
    coreObjective: "CO 3: Students will create a short story with a moral.",
    learningOutcomes: [
      "ELO 3.1: Develop compelling characters.",
      "ELO 3.2: Incorporate a clear moral lesson."
    ],
    bloomsTaxonomy: "Creation",
    skills: ["Creative Writing", "Problem-Solving", "Imagination"]
  }
];

const ObjectiveMapping = ({ coreObjectives = [], learningOutcomes = [] }: ObjectiveMappingProps) => {
  const [selectedMappings, setSelectedMappings] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('view');

  const toggleMapping = (id: number) => {
    setSelectedMappings(prev => 
      prev.includes(id) 
        ? prev.filter(mappingId => mappingId !== id)
        : [...prev, id]
    );
  };

  const getBloomsTaxonomyIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'knowledge': return '📚';
      case 'analysis': return '🔍';
      case 'creation': return '🎨';
      default: return '🧠';
    }
  };

  const getBloomsTaxonomyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'knowledge': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'analysis': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'creation': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
            <Link className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Objective Mapping</h3>
            <p className="text-gray-600">Beautiful grid view for mapping Core Objectives to ELOs, Bloom's Taxonomy, and Skills</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('edit')}
          >
            <Link size={16} className="mr-1" />
            Edit
          </Button>
          <Button
            variant={viewMode === 'view' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('view')}
          >
            <Eye size={16} className="mr-1" />
            View
          </Button>
        </div>
      </div>

      {/* Beautiful Grid Overview with Dummy Data */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Target className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-600">{dummyMappingData.length}</div>
            <div className="text-sm text-blue-700">Core Objectives</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Lightbulb className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {dummyMappingData.reduce((total, item) => total + item.learningOutcomes.length, 0)}
            </div>
            <div className="text-sm text-green-700">Learning Outcomes</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Brain className="text-purple-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-purple-700">Bloom's Levels</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Users className="text-orange-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {new Set(dummyMappingData.flatMap(item => item.skills)).size}
            </div>
            <div className="text-sm text-orange-700">Unique Skills</div>
          </div>
        </div>
      </div>

      {/* Grid View with Dummy Data */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Target className="text-blue-600" size={20} />
          Mapping Overview
        </h4>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
              <div className="p-4 font-semibold text-gray-900 border-r border-gray-200">
                Core Objective (CO)
              </div>
              <div className="p-4 font-semibold text-gray-900 border-r border-gray-200">
                Expected Learning Outcomes (ELOs)
              </div>
              <div className="p-4 font-semibold text-gray-900 border-r border-gray-200">
                Bloom's Taxonomy
              </div>
              <div className="p-4 font-semibold text-gray-900">
                Skills
              </div>
            </div>

            {/* Table Body */}
            {dummyMappingData.map((mapping) => (
              <div key={mapping.id} className="grid grid-cols-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {/* Core Objective Column */}
                <div className="p-4 border-r border-gray-200">
                  <div className="flex items-start gap-3">
                    {viewMode === 'edit' && (
                      <Checkbox
                        checked={selectedMappings.includes(mapping.id)}
                        onCheckedChange={() => toggleMapping(mapping.id)}
                        className="mt-1"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-2">
                        {mapping.coreObjective}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {mapping.learningOutcomes.length} ELO{mapping.learningOutcomes.length > 1 ? 's' : ''} linked
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Expected Learning Outcomes Column */}
                <div className="p-4 border-r border-gray-200">
                  <div className="space-y-2">
                    {mapping.learningOutcomes.map((elo, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{elo}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloom's Taxonomy Column */}
                <div className="p-4 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getBloomsTaxonomyIcon(mapping.bloomsTaxonomy)}</span>
                    <Badge className={`${getBloomsTaxonomyColor(mapping.bloomsTaxonomy)} border`}>
                      {mapping.bloomsTaxonomy}
                    </Badge>
                  </div>
                </div>

                {/* Skills Column */}
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {mapping.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dummyMappingData.length}</div>
              <p className="text-xs text-gray-500">Core objectives mapped</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Learning Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {dummyMappingData.reduce((total, item) => total + item.learningOutcomes.length, 0)}
              </div>
              <p className="text-xs text-gray-500">Total ELOs defined</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <p className="text-xs text-gray-500">Objectives covered</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {viewMode === 'edit' && selectedMappings.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>{selectedMappings.length}</strong> mapping{selectedMappings.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedMappings([])}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Clear Selection
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Mappings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectiveMapping;