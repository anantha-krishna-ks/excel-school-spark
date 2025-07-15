import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Upload, BookOpen, Clock } from 'lucide-react';
interface SelectionPanelProps {
  board: string;
  setBoard: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
}
const SelectionPanel = ({
  board,
  setBoard,
  grade,
  setGrade,
  subject,
  setSubject
}: SelectionPanelProps) => {
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <BookOpen className="text-blue-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Basic Setup</h3>
          <p className="text-gray-600 text-sm">Configure your lesson details in just a few clicks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Board/Standard</label>
          </div>
          <Select value={board} onValueChange={setBoard}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:bg-white transition-colors">
              <SelectValue placeholder="CBSE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cbse">CBSE</SelectItem>
              <SelectItem value="icse">ICSE</SelectItem>
              <SelectItem value="state">State Board</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Grade</label>
          </div>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:bg-white transition-colors">
              <SelectValue placeholder="Grade 2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Grade 1</SelectItem>
              <SelectItem value="2">Grade 2</SelectItem>
              <SelectItem value="3">Grade 3</SelectItem>
              <SelectItem value="4">Grade 4</SelectItem>
              <SelectItem value="5">Grade 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">Subject</label>
          </div>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:bg-white transition-colors">
              <SelectValue placeholder="English" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="social">Social Studies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-blue-600" size={16} />
          <label className="text-sm font-medium text-gray-700">Duration</label>
        </div>
        <div className="flex gap-3 max-w-xs">
          <div className="flex-1">
            <Input type="number" placeholder="0" min="0" max="8" className="h-11 text-center border-gray-300 focus:border-blue-500" />
            <label className="text-xs text-gray-500 block text-center mt-1">Hours</label>
          </div>
          <div className="flex-1">
            <Input type="number" placeholder="30" min="0" max="59" step="5" className="h-11 text-center border-gray-300 focus:border-blue-500" />
            <label className="text-xs text-gray-500 block text-center mt-1">Minutes</label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-dashed border-blue-300 hover:border-blue-400 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Upload className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="text-blue-900 font-medium">Upload Lesson Content</p>
              <p className="text-blue-600 text-xs">PDFs, documents, and materials</p>
            </div>
          </div>
          <Button variant="outline" className="bg-white border-blue-300 hover:bg-blue-50 shadow-sm text-blue-700">
            Browse Files
          </Button>
        </div>
      </div>
    </div>;
};
export default SelectionPanel;