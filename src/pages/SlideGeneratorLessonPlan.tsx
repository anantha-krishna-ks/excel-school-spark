import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Loader2, Play, Edit, Save, Download, Plus, Trash2, Eye, Type, Table, List, MessageSquare, Image as ImageIcon, BarChart3, Video, Shapes, Layout, Grid, LayoutList, Lock, User, Clock } from 'lucide-react';
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

interface SavedPresentation {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: Date;
  lastViewed: Date;
  isPrivate: boolean;
  slideCount: number;
  slides: GeneratedSlide[];
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
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    slideIndex: number;
  }>({ show: false, x: 0, y: 0, slideIndex: -1 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showFormatPanel, setShowFormatPanel] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [showDiagramPanel, setShowDiagramPanel] = useState(false);
  const [showShapePanel, setShowShapePanel] = useState(false);
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
  const [draggedElement, setDraggedElement] = useState<{ id: string; type: string; } | null>(null);
  const [slideBackgrounds, setSlideBackgrounds] = useState<{ [key: number]: string }>({});
  const [showDashboard, setShowDashboard] = useState(false);
  const [savedPresentations, setSavedPresentations] = useState<SavedPresentation[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPreview, setShowPreview] = useState(false);
  const [currentPresentationTitle, setCurrentPresentationTitle] = useState('Photosynthesis Presentation');

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

  // Context menu handlers
  const handleRightClick = (e: React.MouseEvent, slideIndex: number) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      slideIndex: slideIndex
    });
  };

  const handleCopySlide = () => {
    if (contextMenu.slideIndex >= 0) {
      const slideText = `${generatedSlides[contextMenu.slideIndex].title}\n\n${generatedSlides[contextMenu.slideIndex].content}`;
      navigator.clipboard.writeText(slideText);
      toast.success('Slide content copied to clipboard');
      setContextMenu({ show: false, x: 0, y: 0, slideIndex: -1 });
    }
  };

  const handleDuplicateSlide = () => {
    if (contextMenu.slideIndex >= 0) {
      const slideToClone = generatedSlides[contextMenu.slideIndex];
      const newSlide = {
        ...slideToClone,
        id: `${slideToClone.id}-copy-${Date.now()}`,
        title: `${slideToClone.title} (Copy)`
      };
      const updatedSlides = [...generatedSlides];
      updatedSlides.splice(contextMenu.slideIndex + 1, 0, newSlide);
      setGeneratedSlides(updatedSlides);
      toast.success('Slide duplicated');
      setContextMenu({ show: false, x: 0, y: 0, slideIndex: -1 });
    }
  };

  const handleDeleteSlide = () => {
    if (contextMenu.slideIndex >= 0 && generatedSlides.length > 1) {
      const updatedSlides = generatedSlides.filter((_, index) => index !== contextMenu.slideIndex);
      setGeneratedSlides(updatedSlides);
      
      // Adjust active slide if necessary
      if (activeSlide >= updatedSlides.length) {
        setActiveSlide(updatedSlides.length - 1);
      } else if (activeSlide > contextMenu.slideIndex) {
        setActiveSlide(activeSlide - 1);
      }
      
      toast.success('Slide deleted');
      setContextMenu({ show: false, x: 0, y: 0, slideIndex: -1 });
    } else {
      toast.error('Cannot delete the last remaining slide');
      setContextMenu({ show: false, x: 0, y: 0, slideIndex: -1 });
    }
  };

  const handleAddSlideBelow = () => {
    if (contextMenu.slideIndex >= 0) {
      const newSlide: GeneratedSlide = {
        id: `new-slide-${Date.now()}`,
        title: 'New Slide',
        content: 'Click to edit this slide content.',
        type: 'content',
        thumbnail: 'bg-gradient-to-br from-gray-400 to-gray-600'
      };
      const updatedSlides = [...generatedSlides];
      updatedSlides.splice(contextMenu.slideIndex + 1, 0, newSlide);
      setGeneratedSlides(updatedSlides);
      setActiveSlide(contextMenu.slideIndex + 1);
      toast.success('New slide added');
      setContextMenu({ show: false, x: 0, y: 0, slideIndex: -1 });
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, slideIndex: -1 });
    };

    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.show]);

  // Add interaction styles for diagrams and shapes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .diagram-container:hover, .shape-element:hover {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
      }
      
      .diagram-container:focus, .shape-element:focus {
        outline: none;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4) !important;
      }
      
      .shape-element {
        transition: all 0.2s ease;
      }
      
      .shape-element:hover {
        transform: scale(1.02);
      }
      
      .diagram-container [contenteditable="true"]:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
        background: rgba(255, 255, 255, 0.9);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Rich text editing functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateSlideContent();
  };

  const updateSlideContent = () => {
    if (contentEditableRef.current) {
      const updatedSlides = [...generatedSlides];
      updatedSlides[activeSlide] = {
        ...updatedSlides[activeSlide],
        content: contentEditableRef.current.innerHTML
      };
      setGeneratedSlides(updatedSlides);
    }
  };

  const handleElementClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const elementId = target.getAttribute('data-element-id') || target.closest('[data-element-id]')?.getAttribute('data-element-id');
    if (elementId) {
      setSelectedElement(elementId);
      setShowFormatPanel(true);
    }
  };

  const changeFontSize = (size: string) => {
    formatText('fontSize', size);
  };

  const changeFontColor = (color: string) => {
    formatText('foreColor', color);
  };

  const changeBackgroundColor = (color: string) => {
    formatText('hiliteColor', color);
  };

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

  // Smart Diagrams
  const smartDiagrams = [
    { name: 'Venn diagram', icon: '⚬', type: 'venn' },
    { name: 'Chain', icon: '🔗', type: 'chain' },
    { name: 'Bullseye', icon: '🎯', type: 'bullseye' },
    { name: 'Ribbon arrows', icon: '➰', type: 'ribbon' },
    { name: 'Ideas', icon: '💡', type: 'ideas' },
    { name: 'Circle inputs', icon: '⚬', type: 'circle_inputs' },
    { name: 'Quadrant', icon: '⊞', type: 'quadrant' },
    { name: 'Swoosh', icon: '〰', type: 'swoosh' },
    { name: 'Versus', icon: '⚔', type: 'versus' },
    { name: 'Infinity', icon: '∞', type: 'infinity' },
    { name: 'Square arrows', icon: '⬌', type: 'square_arrows' },
    { name: 'Puzzle', icon: '🧩', type: 'puzzle' }
  ];

  const shapes = [
    { name: 'Rectangle', color: '#3b82f6', type: 'rectangle' },
    { name: 'Circle', color: '#ef4444', type: 'circle' },
    { name: 'Triangle', color: '#22c55e', type: 'triangle' },
    { name: 'Arrow', color: '#f59e0b', type: 'arrow' },
    { name: 'Star', color: '#8b5cf6', type: 'star' },
    { name: 'Diamond', color: '#ec4899', type: 'diamond' }
  ];

  const backgrounds = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f8fafc' },
    { name: 'Blue Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Purple Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Green Gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Orange Gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Dark', value: '#1f2937' },
    { name: 'Custom Image', value: 'url(/api/placeholder/1920/1080)' }
  ];

  const handleAddDiagram = (diagramType: string) => {
    let diagramHtml = '';
    const elementId = `diagram-${Date.now()}`;
    
    switch (diagramType) {
      case 'venn':
        diagramHtml = `
        <div class="diagram-container" data-element-id="${elementId}" style="position: relative; width: 400px; height: 300px; margin: 20px auto; border: 2px dashed #ccc; background: #f9fafb; border-radius: 8px; cursor: move;">
          <svg width="400" height="300" style="position: absolute; top: 0; left: 0;">
            <circle cx="150" cy="150" r="80" fill="#3b82f6" fill-opacity="0.5" stroke="#3b82f6" stroke-width="2"/>
            <circle cx="250" cy="150" r="80" fill="#ef4444" fill-opacity="0.5" stroke="#ef4444" stroke-width="2"/>
            <text x="120" y="155" fill="#1f2937" font-size="14" font-weight="bold" text-anchor="middle">A</text>
            <text x="280" y="155" fill="#1f2937" font-size="14" font-weight="bold" text-anchor="middle">B</text>
            <text x="200" y="155" fill="#1f2937" font-size="14" font-weight="bold" text-anchor="middle">Both</text>
          </svg>
          <div contenteditable="true" style="position: absolute; top: 10px; left: 10px; background: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">Venn Diagram</div>
        </div>`;
        break;
      case 'quadrant':
        diagramHtml = `
        <div class="diagram-container" data-element-id="${elementId}" style="position: relative; width: 400px; height: 300px; margin: 20px auto; border: 2px dashed #ccc; background: #f9fafb; border-radius: 8px; cursor: move;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; height: 100%; gap: 2px; padding: 20px;">
            <div style="background: #fef3c7; border-radius: 4px; padding: 10px; display: flex; align-items: center; justify-content: center;">
              <span contenteditable="true" style="font-weight: bold; text-align: center;">Quadrant 1</span>
            </div>
            <div style="background: #dbeafe; border-radius: 4px; padding: 10px; display: flex; align-items: center; justify-content: center;">
              <span contenteditable="true" style="font-weight: bold; text-align: center;">Quadrant 2</span>
            </div>
            <div style="background: #fecaca; border-radius: 4px; padding: 10px; display: flex; align-items: center; justify-content: center;">
              <span contenteditable="true" style="font-weight: bold; text-align: center;">Quadrant 3</span>
            </div>
            <div style="background: #dcfce7; border-radius: 4px; padding: 10px; display: flex; align-items: center; justify-content: center;">
              <span contenteditable="true" style="font-weight: bold; text-align: center;">Quadrant 4</span>
            </div>
          </div>
        </div>`;
        break;
      case 'chain':
        diagramHtml = `
        <div class="diagram-container" data-element-id="${elementId}" style="position: relative; width: 600px; height: 150px; margin: 20px auto; border: 2px dashed #ccc; background: #f9fafb; border-radius: 8px; cursor: move;">
          <div style="display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 20px;">
            <div style="background: #3b82f6; color: white; padding: 20px; border-radius: 8px; font-weight: bold; text-align: center; min-width: 100px;">
              <span contenteditable="true">Step 1</span>
            </div>
            <div style="font-size: 24px; color: #6b7280;">→</div>
            <div style="background: #ef4444; color: white; padding: 20px; border-radius: 8px; font-weight: bold; text-align: center; min-width: 100px;">
              <span contenteditable="true">Step 2</span>
            </div>
            <div style="font-size: 24px; color: #6b7280;">→</div>
            <div style="background: #22c55e; color: white; padding: 20px; border-radius: 8px; font-weight: bold; text-align: center; min-width: 100px;">
              <span contenteditable="true">Step 3</span>
            </div>
          </div>
        </div>`;
        break;
      default:
        diagramHtml = `
        <div class="diagram-container" data-element-id="${elementId}" style="position: relative; width: 400px; height: 200px; margin: 20px auto; border: 2px dashed #3b82f6; background: #f0f9ff; border-radius: 8px; cursor: move; display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
            <div style="font-weight: bold; margin-bottom: 5px;" contenteditable="true">${diagramType.replace('_', ' ').toUpperCase()}</div>
            <div style="color: #6b7280; font-size: 14px;" contenteditable="true">Click to customize</div>
          </div>
        </div>`;
    }
    
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + diagramHtml
    };
    setGeneratedSlides(updatedSlides);
    setShowDiagramPanel(false);
    toast.success(`${diagramType.replace('_', ' ')} diagram added`);
  };

  const handleAddShape = (shapeType: string, color: string) => {
    const elementId = `shape-${Date.now()}`;
    let shapeHtml = '';
    
    switch (shapeType) {
      case 'rectangle':
        shapeHtml = `<div class="shape-element" data-element-id="${elementId}" style="position: relative; display: inline-block; width: 150px; height: 100px; background: ${color}; margin: 10px; border-radius: 4px; cursor: move; resize: both; overflow: auto; min-width: 50px; min-height: 30px;">
          <span contenteditable="true" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; text-align: center; width: 100%;">Text</span>
        </div>`;
        break;
      case 'circle':
        shapeHtml = `<div class="shape-element" data-element-id="${elementId}" style="position: relative; display: inline-block; width: 120px; height: 120px; background: ${color}; margin: 10px; border-radius: 50%; cursor: move; resize: both; overflow: auto; min-width: 50px; min-height: 50px;">
          <span contenteditable="true" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; text-align: center; width: 100%;">Text</span>
        </div>`;
        break;
      case 'triangle':
        shapeHtml = `<div class="shape-element" data-element-id="${elementId}" style="position: relative; display: inline-block; width: 0; height: 0; border-left: 50px solid transparent; border-right: 50px solid transparent; border-bottom: 80px solid ${color}; margin: 10px; cursor: move;">
        </div>`;
        break;
      case 'arrow':
        shapeHtml = `<div class="shape-element" data-element-id="${elementId}" style="position: relative; display: inline-block; width: 200px; height: 60px; background: ${color}; margin: 10px; cursor: move; clip-path: polygon(0% 20%, 75% 20%, 75% 0%, 100% 50%, 75% 100%, 75% 80%, 0% 80%);">
          <span contenteditable="true" style="position: absolute; top: 50%; left: 30%; transform: translate(-50%, -50%); color: white; font-weight: bold;">Arrow</span>
        </div>`;
        break;
      default:
        shapeHtml = `<div class="shape-element" data-element-id="${elementId}" style="position: relative; display: inline-block; width: 120px; height: 120px; background: ${color}; margin: 10px; border-radius: 4px; cursor: move; resize: both; overflow: auto;">
          <span contenteditable="true" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; text-align: center; width: 100%;">Shape</span>
        </div>`;
    }
    
    const updatedSlides = [...generatedSlides];
    updatedSlides[activeSlide] = {
      ...updatedSlides[activeSlide],
      content: updatedSlides[activeSlide].content + shapeHtml
    };
    setGeneratedSlides(updatedSlides);
    setShowShapePanel(false);
    toast.success(`${shapeType} added`);
  };

  const handleChangeBackground = (background: string) => {
    setSlideBackgrounds({
      ...slideBackgrounds,
      [activeSlide]: background
    });
    setShowBackgroundPanel(false);
    toast.success('Background updated');
  };

  const handleAddShapes = () => {
    setShowShapePanel(!showShapePanel);
  };

  const handleAddDiagrams = () => {
    setShowDiagramPanel(!showDiagramPanel);
  };

  const handleAddBackground = () => {
    setShowBackgroundPanel(!showBackgroundPanel);
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
    { icon: BarChart3, label: 'Diagrams', category: 'visual', onClick: handleAddDiagrams },
    { icon: Shapes, label: 'Shapes', category: 'visual', onClick: handleAddShapes },
    { icon: Layout, label: 'Background', category: 'design', onClick: handleAddBackground },
    { icon: Layout, label: 'Layout', category: 'design', onClick: handleChangeLayout }
  ];

  const savePresentation = () => {
    console.log('Save button clicked');
    console.log('Current slides:', generatedSlides);
    console.log('Current title:', currentPresentationTitle);
    
    const newPresentation: SavedPresentation = {
      id: `ppt-${Date.now()}`,
      title: currentPresentationTitle,
      thumbnail: generatedSlides[0]?.thumbnail || 'bg-gradient-to-br from-blue-400 to-purple-500',
      createdAt: new Date(),
      lastViewed: new Date(),
      isPrivate: true,
      slideCount: generatedSlides.length,
      slides: generatedSlides
    };
    
    console.log('New presentation:', newPresentation);
    setSavedPresentations(prev => {
      console.log('Previous presentations:', prev);
      const updated = [newPresentation, ...prev];
      console.log('Updated presentations:', updated);
      return updated;
    });
    toast.success('Presentation saved successfully!');
  };

  const previewPresentation = () => {
    console.log('Preview button clicked');
    console.log('Setting showPreview to true');
    setShowPreview(true);
  };

  const exportPresentation = () => {
    // Create a simple text export for demo purposes
    const exportData = {
      title: currentPresentationTitle,
      slides: generatedSlides.map(slide => ({
        title: slide.title,
        content: slide.content.replace(/<[^>]*>/g, '') // Strip HTML tags
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPresentationTitle}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Presentation exported successfully!');
  };

  const loadPresentation = (presentation: SavedPresentation) => {
    setGeneratedSlides(presentation.slides);
    setCurrentPresentationTitle(presentation.title);
    setActiveSlide(0);
    setIsEditorMode(true);
    setShowDashboard(false);
    
    // Update last viewed
    setSavedPresentations(prev => 
      prev.map(p => 
        p.id === presentation.id 
          ? { ...p, lastViewed: new Date() }
          : p
      )
    );
    
    toast.success(`Loaded presentation: ${presentation.title}`);
  };

  const deletePresentation = (presentationId: string) => {
    setSavedPresentations(prev => prev.filter(p => p.id !== presentationId));
    toast.success('Presentation deleted');
  };

  const duplicatePresentation = (presentation: SavedPresentation) => {
    const duplicated: SavedPresentation = {
      ...presentation,
      id: `ppt-${Date.now()}`,
      title: `${presentation.title} (Copy)`,
      createdAt: new Date(),
      lastViewed: new Date()
    };
    
    setSavedPresentations(prev => [duplicated, ...prev]);
    toast.success('Presentation duplicated');
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
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditorMode(false)}
                className="text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <input
                type="text"
                value={currentPresentationTitle}
                onChange={(e) => setCurrentPresentationTitle(e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 focus:rounded px-2 py-1 min-w-0 flex-1 max-w-md truncate"
                placeholder="Enter presentation title"
              />
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => {
                   console.log('My Presentations button clicked');
                   console.log('Current showDashboard:', showDashboard);
                   setShowDashboard(true);
                   console.log('Setting showDashboard to true');
                 }}
                 className="hidden lg:flex"
               >
                 <FileText className="w-4 h-4 mr-2" />
                 My Presentations
               </Button>
              <Button variant="outline" size="sm" onClick={savePresentation}>
                <Save className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Save</span>
              </Button>
              <Button variant="outline" size="sm" onClick={previewPresentation}>
                <Eye className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Preview</span>
              </Button>
              <Button size="sm" onClick={exportPresentation} className="bg-rose-600 hover:bg-rose-700">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>
              
              {/* Mobile Menu Button */}
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => {
                   console.log('Mobile My Presentations button clicked');
                   console.log('Current showDashboard:', showDashboard);
                   setShowDashboard(true);
                   console.log('Setting showDashboard to true');
                 }}
                 className="lg:hidden"
                 title="My Presentations"
               >
                 <FileText className="w-4 h-4" />
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
                    onContextMenu={(e) => handleRightClick(e, index)}
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

            {/* Context Menu */}
            {contextMenu.show && (
              <div
                className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[180px]"
                style={{
                  left: `${contextMenu.x}px`,
                  top: `${contextMenu.y}px`,
                }}
              >
                <button
                  onClick={handleCopySlide}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                  </div>
                  <span>Copy</span>
                  <span className="ml-auto text-xs text-gray-400">Ctrl+C</span>
                </button>

                <button
                  onClick={handleDuplicateSlide}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                    </svg>
                  </div>
                  <span>Duplicate</span>
                  <span className="ml-auto text-xs text-gray-400">Ctrl+D</span>
                </button>

                <button
                  onClick={handleAddSlideBelow}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      <path d="M12 8v8m-4-4h8"/>
                    </svg>
                  </div>
                  <span>Add card below</span>
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                <button
                  onClick={handleDeleteSlide}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2"/>
                    </svg>
                  </div>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col">
            {/* Formatting Toolbar */}
            <div className="bg-white border-b border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Format:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('bold')}
                  className="text-xs"
                >
                  <strong>B</strong>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('italic')}
                  className="text-xs"
                >
                  <em>I</em>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('underline')}
                  className="text-xs"
                >
                  <u>U</u>
                </Button>
                
                <div className="border-l border-gray-300 h-6 mx-2"></div>
                
                <select
                  onChange={(e) => changeFontSize(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="1">8pt</option>
                  <option value="2">10pt</option>
                  <option value="3" selected>12pt</option>
                  <option value="4">14pt</option>
                  <option value="5">18pt</option>
                  <option value="6">24pt</option>
                  <option value="7">36pt</option>
                </select>
                
                <input
                  type="color"
                  onChange={(e) => changeFontColor(e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Text Color"
                />
                
                <input
                  type="color"
                  onChange={(e) => changeBackgroundColor(e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Background Color"
                />
                
                <div className="border-l border-gray-300 h-6 mx-2"></div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('justifyLeft')}
                  className="text-xs"
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('justifyCenter')}
                  className="text-xs"
                >
                  ↔
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('justifyRight')}
                  className="text-xs"
                >
                  →
                </Button>
              </div>
            </div>

            {/* Element Toolbar */}
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
                <div className="absolute top-full left-3 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[400px]">
                  <h3 className="text-gray-900 font-medium mb-3">Text</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Title */}
                    <button
                      onClick={() => handleAddTextType('title')}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-gray-900 text-2xl font-bold mb-1">T</div>
                      <div className="text-gray-900 font-medium">Title</div>
                      <div className="text-gray-500 text-sm">! Title</div>
                    </button>

                    {/* Heading 1 */}
                    <button
                      onClick={() => handleAddTextType('h1')}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-gray-900 text-xl font-bold mb-1">H1</div>
                      <div className="text-gray-900 font-medium">Heading 1</div>
                      <div className="text-gray-500 text-sm"># Heading 1</div>
                    </button>

                    {/* Heading 2 */}
                    <button
                      onClick={() => handleAddTextType('h2')}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-gray-900 text-lg font-bold mb-1">H2</div>
                      <div className="text-gray-900 font-medium">Heading 2</div>
                      <div className="text-gray-500 text-sm">## Heading 2</div>
                    </button>

                    {/* Heading 3 */}
                    <button
                      onClick={() => handleAddTextType('h3')}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-gray-900 text-base font-bold mb-1">H3</div>
                      <div className="text-gray-900 font-medium">Heading 3</div>
                      <div className="text-gray-500 text-sm">### Heading 3</div>
                    </button>

                    {/* Heading 4 */}
                    <button
                      onClick={() => handleAddTextType('h4')}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-gray-900 text-sm font-bold mb-1">H4</div>
                      <div className="text-gray-900 font-medium">Heading 4</div>
                      <div className="text-gray-500 text-sm">#### Heading 4</div>
                    </button>

                    {/* Blockquote */}
                    <button
                      onClick={() => handleAddTextType('blockquote')}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="text-gray-900 text-lg mb-1">"</div>
                      <div className="text-gray-900 font-medium">Blockquote</div>
                      <div className="text-gray-500 text-sm">&gt; Quote</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Smart Diagrams Panel */}
              {showDiagramPanel && (
                <div className="absolute top-full left-3 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[500px]">
                  <h3 className="text-gray-900 font-medium mb-3">Smart Diagrams</h3>
                  <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                    {smartDiagrams.map((diagram, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddDiagram(diagram.type)}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors"
                      >
                        <div className="text-2xl mb-2">{diagram.icon}</div>
                        <div className="text-gray-900 font-medium text-sm">{diagram.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shapes Panel */}
              {showShapePanel && (
                <div className="absolute top-full left-3 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[400px]">
                  <h3 className="text-gray-900 font-medium mb-3">Shapes</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {shapes.map((shape, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddShape(shape.type, shape.color)}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-center transition-colors"
                      >
                        <div 
                          className="w-8 h-8 mx-auto mb-2" 
                          style={{ 
                            backgroundColor: shape.color,
                            borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'triangle' ? '0' : '4px',
                            clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                                     shape.type === 'arrow' ? 'polygon(0% 20%, 75% 20%, 75% 0%, 100% 50%, 75% 100%, 75% 80%, 0% 80%)' : 'none'
                          }}
                        />
                        <div className="text-gray-900 font-medium text-sm">{shape.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Background Panel */}
              {showBackgroundPanel && (
                <div className="absolute top-full left-3 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[400px]">
                  <h3 className="text-gray-900 font-medium mb-3">Slide Background</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {backgrounds.map((bg, index) => (
                      <button
                        key={index}
                        onClick={() => handleChangeBackground(bg.value)}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-center transition-colors"
                      >
                        <div 
                          className="w-full h-16 mx-auto mb-2 rounded"
                          style={{ 
                            background: bg.value.startsWith('linear-gradient') || bg.value.startsWith('url') ? bg.value : bg.value,
                            backgroundColor: bg.value.startsWith('#') ? bg.value : undefined
                          }}
                        />
                        <div className="text-gray-900 font-medium text-sm">{bg.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Canvas */}
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="rounded-lg shadow-lg relative" 
                  style={{ 
                    aspectRatio: '16/9',
                    background: slideBackgrounds[activeSlide] || '#ffffff'
                  }}
                >
                  <div className="p-8 h-full flex flex-col justify-center">
                    <h1 
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const updatedSlides = [...generatedSlides];
                        updatedSlides[activeSlide] = {
                          ...updatedSlides[activeSlide],
                          title: e.currentTarget.textContent || ''
                        };
                        setGeneratedSlides(updatedSlides);
                      }}
                      className="text-4xl font-bold mb-6 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded p-2"
                      style={{
                        color: slideBackgrounds[activeSlide]?.includes('gradient') || slideBackgrounds[activeSlide] === '#1f2937' ? 'white' : '#111827'
                      }}
                    >
                      {generatedSlides[activeSlide]?.title}
                    </h1>
                    <div 
                      ref={contentEditableRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={updateSlideContent}
                      onClick={handleElementClick}
                      className="text-xl leading-relaxed outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded p-2 min-h-[200px]"
                      style={{
                        color: slideBackgrounds[activeSlide]?.includes('gradient') || slideBackgrounds[activeSlide] === '#1f2937' ? 'white' : '#374151'
                      }}
                      dangerouslySetInnerHTML={{ __html: generatedSlides[activeSlide]?.content || '' }}
                    />
                  </div>
                  
                  {/* Element Selection Overlay */}
                  {selectedElement && (
                    <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                      <div className="flex gap-2">
                        <input
                          type="color"
                          className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                          title="Element Color"
                          onChange={(e) => {
                            const element = document.querySelector(`[data-element-id="${selectedElement}"]`) as HTMLElement;
                            if (element) {
                              element.style.backgroundColor = e.target.value;
                              updateSlideContent();
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const element = document.querySelector(`[data-element-id="${selectedElement}"]`);
                            if (element) {
                              element.remove();
                              updateSlideContent();
                            }
                            setSelectedElement(null);
                          }}
                          className="text-xs p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view for saved presentations
  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create new
                  <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">AI</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New from blank
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/slide-generator')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tools
                </Button>
                
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid className="w-4 h-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <LayoutList className="w-4 h-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Presentations</h1>
            <p className="text-gray-600">
              {savedPresentations.length} presentation{savedPresentations.length !== 1 ? 's' : ''}
            </p>
          </div>

          {savedPresentations.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No presentations yet</h3>
              <p className="text-gray-600 mb-6">Create your first presentation to get started</p>
              <Button
                onClick={() => setShowDashboard(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create new presentation
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {savedPresentations.map((presentation) => (
                <div
                  key={presentation.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div 
                        className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center cursor-pointer ${presentation.thumbnail}`}
                        onClick={() => loadPresentation(presentation)}
                      >
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                          {presentation.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Lock className="w-3 h-3" />
                          <span>Private</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-xs text-gray-600">
                          <div>Created by you</div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last viewed {presentation.lastViewed.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPresentation(presentation)}
                          className="flex-1 text-xs"
                        >
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicatePresentation(presentation)}
                          className="text-xs"
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePresentation(presentation.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div 
                        className={`w-16 h-16 rounded-lg mr-4 flex items-center justify-center cursor-pointer ${presentation.thumbnail}`}
                        onClick={() => loadPresentation(presentation)}
                      >
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {presentation.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Private</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Created by you</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Last viewed {presentation.lastViewed.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPresentation(presentation)}
                          className="text-xs"
                        >
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicatePresentation(presentation)}
                          className="text-xs"
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePresentation(presentation.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Preview Modal
  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Preview: {currentPresentationTitle}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start Slideshow
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedSlides.map((slide, index) => (
                <div key={slide.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className={`w-full h-24 rounded mb-2 flex items-center justify-center ${slide.thumbnail}`}>
                    <span className="text-white text-sm font-medium">{index + 1}</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 truncate">{slide.title}</h4>
                </div>
              ))}
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