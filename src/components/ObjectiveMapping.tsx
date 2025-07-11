
import React from 'react';
import { ArrowRight, Target, Lightbulb } from 'lucide-react';

interface ObjectiveMappingProps {
  coreObjectives: string[];
  learningOutcomes: string[];
}

const ObjectiveMapping = ({ coreObjectives, learningOutcomes }: ObjectiveMappingProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-6 border border-indigo-200 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
          <ArrowRight size={12} className="text-indigo-600" />
        </div>
        <h4 className="font-medium text-indigo-900">Objective Mapping</h4>
        <p className="text-sm text-indigo-600">How your learning outcomes connect to core objectives</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Objectives */}
        <div className="bg-white rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-purple-600" size={16} />
            <h5 className="font-medium text-gray-800">Core Objectives</h5>
          </div>
          <div className="space-y-2">
            {coreObjectives.length > 0 ? (
              coreObjectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-md">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{objective}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No core objectives selected yet</p>
            )}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-green-600" size={16} />
            <h5 className="font-medium text-gray-800">Learning Outcomes</h5>
          </div>
          <div className="space-y-2">
            {learningOutcomes.length > 0 ? (
              learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{outcome}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No learning outcomes defined yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Connection Lines Visual */}
      {coreObjectives.length > 0 && learningOutcomes.length > 0 && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <ArrowRight size={16} />
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Objectives mapped to outcomes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectiveMapping;
