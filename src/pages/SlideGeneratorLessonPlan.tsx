import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  const [showTextOptions, setShowTextOptions] = useState(false);
  const textButtonRef = useRef<HTMLButtonElement>(null);

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

  // Text options handlers
  const handleAddTextType = (type: 'title' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote') => {
    let textHtml = '';
    
    switch (type) {
      case 'title':
        textHtml = '<h1 style="font-size: 2.5rem; font-weight: bold; margin: 20px 0; color: #111;">! Title</h1>';
        break;
      case 'h1':
        textHtml = '<h1 style="font-size: 2rem; font-weight: bold; margin: 16px 0; color: #333;"># Heading 1</h1>';
        break;
      case 'h2':
        textHtml = '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 14px 0; color: #333;">## Heading 2</h2>';
        break;
      case 'h3':
        textHtml = '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 12px 0; color: #333;">### Heading 3</h3>';
        break;
      case 'h4':
        textHtml = '<h4 style="font-size: 1.125rem; font-weight: bold; margin: 10px 0; color: #333;">#### Heading 4</h4>';
        break;
      case 'blockquote':
        textHtml = '<blockquote style="border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 16px 0; font-style: italic; color: #64748b;">&gt; Quote</blockquote>';
        break;
    }
    
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + textHtml
    };
    setGeneratedSlides(updatedSlides);
    setShowTextOptions(false);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added`);
  };

  const handleAddText = () => {
    setShowTextOptions(!showTextOptions);
  };

  // Close text options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textButtonRef.current && !textButtonRef.current.contains(event.target as Node)) {
        setShowTextOptions(false);
      }
    };

    if (showTextOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTextOptions]);

  const handleAddTable = () => {
    const tableHtml = `
    <table border="1" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>
      <tr><td>Row 1, Col 1</td><td>Row 1, Col 2</td><td>Row 1, Col 3</td></tr>
      <tr><td>Row 2, Col 1</td><td>Row 2, Col 2</td><td>Row 2, Col 3</td></tr>
    </table>`;
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + tableHtml
    };
    setGeneratedSlides(updatedSlides);
    toast.success('Table added');
  };

  const handleAddList = () => {
    const listHtml = `
    <ul style="margin: 20px 0; padding-left: 20px;">
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ul>`;
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + listHtml
    };
    setGeneratedSlides(updatedSlides);
    toast.success('List added');
  };

  const handleAddCallout = () => {
    const calloutHtml = `
    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <strong>💡 Important:</strong> This is a callout box. Edit this text to add your important note.
    </div>`;
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + calloutHtml
    };
    setGeneratedSlides(updatedSlides);
    toast.success('Callout added');
  };

  const handleAddImage = () => {
    // Create a file input for image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageSrc = e.target?.result;
          const imageHtml = `<img src="${imageSrc}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px;" />`;
          const updatedSlides = [...generatedSlides];
          updatedSlides[activeSlide] = {
            ...updatedSlides[activeSlide],
            content: updatedSlides[activeSlide].content + imageHtml
          };
          setGeneratedSlides(updatedSlides);
          toast.success('Image added');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddVideo = () => {
    const videoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.):');
    if (videoUrl) {
      const videoHtml = `
      <div style="margin: 20px 0;">
        <iframe width="100%" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
      </div>`;
      const updatedSlides = [...generatedSlides];
      updatedSlides[activeSlide] = {
        ...updatedSlides[activeSlide],
        content: updatedSlides[activeSlide].content + videoHtml
      };
      setGeneratedSlides(updatedSlides);
      toast.success('Video added');
    }
  };

  const handleAddChart = () => {
    const chartHtml = `
    <div style="margin: 20px 0; padding: 20px; border: 2px dashed #ccc; text-align: center;">
      <h4>📊 Chart Placeholder</h4>
      <p>Chart will be rendered here. You can integrate with chart libraries like Chart.js or D3.</p>
    </div>`;
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + chartHtml
    };
    setGeneratedSlides(updatedSlides);
    toast.success('Chart placeholder added');
  };

  const handleAddShapes = () => {
    const shapesHtml = `
    <div style="margin: 20px 0; display: flex; gap: 10px; align-items: center;">
      <div style="width: 50px; height: 50px; background: #3b82f6; border-radius: 50%;"></div>
      <div style="width: 50px; height: 50px; background: #ef4444;"></div>
      <div style="width: 50px; height: 30px; background: #22c55e; clip-path: polygon(50% 0%, 0% 100%, 100% 100%);"></div>
    </div>`;
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + shapesHtml
    };
    setGeneratedSlides(updatedSlides);
    toast.success('Shapes added');
  };

  const handleChangeLayout = () => {
    const layouts = [
      'Title + Content',
      'Two Columns',
      'Three Columns',
      'Content + Image',
      'Full Image Background'
    ];
    const selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
    toast.success(`Layout changed to: ${selectedLayout}`);
  };

  const editorTools = [
    { icon: Type, label: 'Text', category: 'blocks', onClick: handleAddText },
    { icon: Table, label: 'Table', category: 'blocks', onClick: handleAddTable },
    { icon: List, label: 'List', category: 'blocks', onClick: handleAddList },
    { icon: MessageSquare, label: 'Callout', category: 'blocks', onClick: handleAddCallout },
    { icon: ImageIcon, label: 'Image', category: 'media', onClick: handleAddImage },
    { icon: Video, label: 'Video', category: 'media', onClick: handleAddVideo },
    { icon: BarChart3, label: 'Chart', category: 'visual', onClick: handleAddChart },
    { icon: Shapes, label: 'Shapes', category: 'visual', onClick: handleAddShapes },
    { icon: Layout, label: 'Layout', category: 'design', onClick: handleChangeLayout }
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
            <div className="bg-white border-b border-gray-200 p-3 relative">
              <div className="flex flex-wrap gap-2">
                {editorTools.map((tool, index) => {
                  const IconComponent = tool.icon;
                  return (
                    <Button 
                      key={index} 
                      ref={tool.label === 'Text' ? textButtonRef : undefined}
                      variant="outline" 
                      size="sm" 
                      className={`text-xs ${tool.label === 'Text' && showTextOptions ? 'bg-gray-100' : ''}`}
                      onClick={tool.onClick}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {tool.label}
                    </Button>
                  );
                })}
              </div>

              {/* Text Options Panel */}
              {showTextOptions && (
                <div className="absolute top-full left-3 mt-1 bg-gray-800 rounded-lg shadow-lg p-4 z-50 min-w-[400px]">
                  <h3 className="text-white font-medium mb-3">Text</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Title */}
                    <button
                      onClick={() => handleAddTextType('title')}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-white text-2xl font-bold mb-1">T</div>
                      <div className="text-white font-medium">Title</div>
                      <div className="text-gray-400 text-sm">! Title</div>
                    </button>

                    {/* Heading 1 */}
                    <button
                      onClick={() => handleAddTextType('h1')}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-white text-xl font-bold mb-1">H1</div>
                      <div className="text-white font-medium">Heading 1</div>
                      <div className="text-gray-400 text-sm"># Heading 1</div>
                    </button>

                    {/* Heading 2 */}
                    <button
                      onClick={() => handleAddTextType('h2')}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-white text-lg font-bold mb-1">H2</div>
                      <div className="text-white font-medium">Heading 2</div>
                      <div className="text-gray-400 text-sm">## Heading 2</div>
                    </button>

                    {/* Heading 3 */}
                    <button
                      onClick={() => handleAddTextType('h3')}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-white text-base font-bold mb-1">H3</div>
                      <div className="text-white font-medium">Heading 3</div>
                      <div className="text-gray-400 text-sm">### Heading 3</div>
                    </button>

                    {/* Heading 4 */}
                    <button
                      onClick={() => handleAddTextType('h4')}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-white text-sm font-bold mb-1">H4</div>
                      <div className="text-white font-medium">Heading 4</div>
                      <div className="text-gray-400 text-sm">#### Heading 4</div>
                    </button>

                    {/* Blockquote */}
                    <button
                      onClick={() => handleAddTextType('blockquote')}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-white text-lg mb-1">"</div>
                      <div className="text-white font-medium">Blockquote</div>
                      <div className="text-gray-400 text-sm">&gt; Quote</div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas */}
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg" style={{ aspectRatio: '16/9' }}>
                  <div className="p-8 h-full flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                      {generatedSlides[activeSlide]?.title}
                    </h1>
                    <div 
                      className="text-xl text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: generatedSlides[activeSlide]?.content || '' }}
                    />
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