import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Loader2, Play, Edit, Save, Download, Plus, Trash2, Eye, Type, Table, List, MessageSquare, Image as ImageIcon, BarChart3, Video, Shapes, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';

interface GeneratedSlide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'image' | 'chart';
  thumbnail: string;
}

const SlideGeneratorLessonPlan = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedSlide[]>([]);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isEditorMode, setIsEditorMode] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }, 1500);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setIsUploading(true);
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success('File uploaded successfully!');
      }, 1500);
    }
  }, []);

  const generatePPT = () => {
    if (!file) {
      toast.error('Please upload a lesson plan first');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockSlides: GeneratedSlide[] = [
        {
          id: '1',
          title: 'Introduction to Photosynthesis',
          content: 'Welcome to our lesson on photosynthesis - the process by which plants make their own food.',
          type: 'title',
          thumbnail: 'bg-gradient-to-br from-green-400 to-blue-500'
        },
        {
          id: '2',
          title: 'What is Photosynthesis?',
          content: 'Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.',
          type: 'content',
          thumbnail: 'bg-gradient-to-br from-blue-400 to-purple-500'
        },
        {
          id: '3',
          title: 'The Photosynthesis Equation',
          content: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂',
          type: 'content',
          thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-500'
        },
        {
          id: '4',
          title: 'Chloroplast Structure',
          content: 'Interactive diagram showing the internal structure of a chloroplast.',
          type: 'image',
          thumbnail: 'bg-gradient-to-br from-pink-400 to-red-500'
        },
        {
          id: '5',
          title: 'Factors Affecting Photosynthesis',
          content: 'Light intensity, temperature, and CO₂ concentration all affect the rate of photosynthesis.',
          type: 'chart',
          thumbnail: 'bg-gradient-to-br from-red-400 to-orange-500'
        }
      ];
      
      setGeneratedSlides(mockSlides);
      setIsGenerating(false);
      setIsEditorMode(true);
      toast.success('Presentation generated successfully!');
    }, 3000);
  };

  const editorTools = [
    { icon: Type, label: 'Text', category: 'blocks' },
    { icon: Table, label: 'Table', category: 'blocks' },
    { icon: List, label: 'List', category: 'blocks' },
    { icon: MessageSquare, label: 'Callout', category: 'blocks' },
    { icon: ImageIcon, label: 'Image', category: 'media' },
    { icon: Video, label: 'Video', category: 'media' },
    { icon: BarChart3, label: 'Chart', category: 'visual' },
    { icon: Shapes, label: 'Shapes', category: 'visual' },
    { icon: Layout, label: 'Layout', category: 'design' }
  ];

  const savePresentation = () => {
    toast.success('Presentation saved successfully!');
  };

  const exportPresentation = () => {
    toast.success('Presentation exported as PowerPoint!');
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" text="Generating your presentation..." />
          <div className="mt-8 max-w-md">
            <div className="text-sm text-gray-600 mb-2">AI is analyzing your lesson plan...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-rose-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditorMode && generatedSlides.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Editor Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditorMode(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">Photosynthesis Presentation</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={savePresentation}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm" onClick={exportPresentation} className="bg-rose-600 hover:bg-rose-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Sidebar with slides */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Slides</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {generatedSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    onClick={() => setActiveSlide(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeSlide === index ? 'bg-rose-100 border-rose-300' : 'bg-gray-50 hover:bg-gray-100'
                    } border`}
                  >
                    <div className={`w-full h-20 rounded ${slide.thumbnail} mb-2 flex items-center justify-center`}>
                      <span className="text-white text-xs font-medium">{index + 1}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-900 truncate">{slide.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 p-3">
              <div className="flex flex-wrap gap-2">
                {editorTools.map((tool, index) => {
                  const IconComponent = tool.icon;
                  return (
                    <Button key={index} variant="outline" size="sm" className="text-xs">
                      <IconComponent className="w-3 h-3 mr-1" />
                      {tool.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg" style={{ aspectRatio: '16/9' }}>
                  <div className="p-8 h-full flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                      {generatedSlides[activeSlide]?.title}
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {generatedSlides[activeSlide]?.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/slide-generator')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Slide Generator
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create from Lesson Plan</h1>
                <p className="text-sm text-gray-500">Upload and convert to presentation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Lesson Plan
            </CardTitle>
            <CardDescription>
              Upload your lesson plan or session plan document (PDF, DOC, DOCX)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600">Uploading file...</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-green-500 mb-4" />
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                    Ready to convert
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, DOC, DOCX files up to 10MB
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Convert Button */}
        {file && (
          <div className="text-center mb-8">
            <Button
              onClick={generatePPT}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              Convert to PPT
            </Button>
          </div>
        )}

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Type className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Content Analysis</h3>
              <p className="text-sm text-gray-600">AI analyzes your lesson plan and extracts key points for slides</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layout className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Layouts</h3>
              <p className="text-sm text-gray-600">Automatically applies appropriate layouts for different content types</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Edit className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rich Editor</h3>
              <p className="text-sm text-gray-600">Comprehensive editing tools for customizing your presentation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SlideGeneratorLessonPlan;