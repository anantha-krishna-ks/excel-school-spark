import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Target, Lightbulb, Link, Unlink, Eye } from 'lucide-react';

interface ObjectiveMappingProps {
  coreObjectives: string[];
  learningOutcomes: string[];
}

interface MappingRelation {
  coIndex: number;
  eloIndex: number;
}

const ObjectiveMapping = ({ coreObjectives, learningOutcomes }: ObjectiveMappingProps) => {
  const [mappings, setMappings] = useState<MappingRelation[]>([]);
  const [selectedCO, setSelectedCO] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');

  const toggleMapping = (coIndex: number, eloIndex: number) => {
    const existingMapping = mappings.find(
      m => m.coIndex === coIndex && m.eloIndex === eloIndex
    );

    if (existingMapping) {
      setMappings(mappings.filter(m => !(m.coIndex === coIndex && m.eloIndex === eloIndex)));
    } else {
      setMappings([...mappings, { coIndex, eloIndex }]);
    }
  };

  const isMapped = (coIndex: number, eloIndex: number) => {
    return mappings.some(m => m.coIndex === coIndex && m.eloIndex === eloIndex);
  };

  const getELOsForCO = (coIndex: number) => {
    return mappings.filter(m => m.coIndex === coIndex).map(m => m.eloIndex);
  };

  const getCOsForELO = (eloIndex: number) => {
    return mappings.filter(m => m.eloIndex === eloIndex).map(m => m.coIndex);
  };

  const getConnectionColor = (coIndex: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'
    ];
    return colors[coIndex % colors.length];
  };

  if (coreObjectives.length === 0 || learningOutcomes.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Map Objectives</h3>
          <p className="text-gray-500">
            Add Core Objectives and Expected Learning Outcomes to start creating meaningful connections
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
            <Link className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Objective Mapping</h3>
            <p className="text-gray-600">Create meaningful connections between objectives and outcomes</p>
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

      {/* Mapping Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mappings.length}</div>
              <div className="text-xs text-blue-700">Total Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Set(mappings.map(m => m.coIndex)).size}
              </div>
              <div className="text-xs text-green-700">COs Mapped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(mappings.map(m => m.eloIndex)).size}
              </div>
              <div className="text-xs text-purple-700">ELOs Mapped</div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'edit' ? (
        /* Edit Mode - Interactive Mapping Interface */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Core Objectives Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-blue-600" size={20} />
              <h4 className="font-semibold text-gray-900">Core Objectives ({coreObjectives.length})</h4>
            </div>
            
            {coreObjectives.map((co, coIndex) => {
              const mappedELOs = getELOsForCO(coIndex);
              const isSelected = selectedCO === coIndex;
              
              return (
                <Card 
                  key={coIndex}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  } ${mappedELOs.length > 0 ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => setSelectedCO(isSelected ? null : coIndex)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 mb-2">{co}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            CO {coIndex + 1}
                          </Badge>
                          {mappedELOs.length > 0 && (
                            <Badge className={`text-xs text-white ${getConnectionColor(coIndex)}`}>
                              {mappedELOs.length} ELO{mappedELOs.length > 1 ? 's' : ''} linked
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getConnectionColor(coIndex)}`}></div>
                    </div>
                    
                    {/* Show connected ELOs when selected */}
                    {isSelected && mappedELOs.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Connected to:</p>
                        <div className="space-y-1">
                          {mappedELOs.map(eloIndex => (
                            <div key={eloIndex} className="text-xs text-gray-700 bg-gray-100 p-2 rounded">
                              ELO {eloIndex + 1}: {learningOutcomes[eloIndex]?.substring(0, 60)}...
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Expected Learning Outcomes Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-green-600" size={20} />
              <h4 className="font-semibold text-gray-900">Expected Learning Outcomes ({learningOutcomes.length})</h4>
            </div>
            
            {learningOutcomes.map((elo, eloIndex) => {
              const mappedCOs = getCOsForELO(eloIndex);
              const isConnectedToSelected = selectedCO !== null && isMapped(selectedCO, eloIndex);
              
              return (
                <Card 
                  key={eloIndex}
                  className={`transition-all duration-200 ${
                    selectedCO !== null ? 'cursor-pointer hover:shadow-md' : ''
                  } ${isConnectedToSelected ? 'ring-2 ring-green-500 bg-green-50' : ''} 
                  ${mappedCOs.length > 0 ? 'border-l-4 border-l-green-500' : ''}`}
                  onClick={() => selectedCO !== null ? toggleMapping(selectedCO, eloIndex) : undefined}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {selectedCO !== null && (
                        <Checkbox
                          checked={isMapped(selectedCO, eloIndex)}
                          onChange={() => toggleMapping(selectedCO, eloIndex)}
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 mb-2">{elo}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            ELO {eloIndex + 1}
                          </Badge>
                          {mappedCOs.length > 0 && (
                            <Badge className="text-xs bg-green-500 text-white">
                              {mappedCOs.length} CO{mappedCOs.length > 1 ? 's' : ''} linked
                            </Badge>
                          )}
                        </div>
                        
                        {/* Show connected COs */}
                        {mappedCOs.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {mappedCOs.map(coIndex => (
                              <div
                                key={coIndex}
                                className={`w-3 h-3 rounded-full ${getConnectionColor(coIndex)}`}
                                title={`Connected to CO ${coIndex + 1}`}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* View Mode - Visual Representation */
        <div className="space-y-6">
          {coreObjectives.map((co, coIndex) => {
            const mappedELOs = getELOsForCO(coIndex);
            
            if (mappedELOs.length === 0) return null;
            
            return (
              <Card key={coIndex} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getConnectionColor(coIndex)}`}></div>
                    <CardTitle className="text-lg">CO {coIndex + 1}</CardTitle>
                  </div>
                  <p className="text-gray-700">{co}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <ArrowRight className="text-gray-400" size={20} />
                    <span className="text-sm font-medium text-gray-600">Maps to {mappedELOs.length} outcome{mappedELOs.length > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {mappedELOs.map(eloIndex => (
                      <div key={eloIndex} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Badge variant="outline" className="text-xs">ELO {eloIndex + 1}</Badge>
                        <p className="text-sm text-gray-700 flex-1">{learningOutcomes[eloIndex]}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {mappings.length === 0 && (
            <div className="text-center py-8">
              <Unlink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No mappings created yet. Switch to edit mode to start connecting objectives and outcomes.</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {selectedCO !== null && viewMode === 'edit' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Selected:</strong> CO {selectedCO + 1} - Click on Expected Learning Outcomes to create connections
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedCO(null)}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default ObjectiveMapping;