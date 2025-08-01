import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, Edit, Trash2, CheckCircle2, Clock, BookOpen, Target, 
  BarChart3, PieChart, Save, Filter, X, Sparkles, Image, Upload 
} from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedItem {
  id: string;
  question: string;
  itemType: string;
  bloomsLevel: string;
  difficulty: string;
  marks: number;
  eloId: string;
  eloTitle: string;
  isSelected: boolean;
  options?: string[];
  correctAnswer?: string;
  rubric?: string;
  hasImage?: boolean;
  imageUrl?: string;
}

interface AssessmentItemGenerationProps {
  assessmentData: any;
  updateAssessmentData: (data: any) => void;
}

const AssessmentItemGeneration = ({ assessmentData, updateAssessmentData }: AssessmentItemGenerationProps) => {
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<GeneratedItem | null>(null);
  const [previewItem, setPreviewItem] = useState<GeneratedItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [historicalQuestions] = useState<GeneratedItem[]>([
    {
      id: 'hist1',
      question: 'Explain the process of photosynthesis in detail.',
      itemType: 'Long Answer',
      bloomsLevel: 'Understand',
      difficulty: 'Medium',
      marks: 10,
      eloId: 'elo1',
      eloTitle: 'Understanding Plant Biology',
      isSelected: false
    },
    {
      id: 'hist2',
      question: 'What is the primary function of chloroplasts?',
      itemType: 'Multiple Choice',
      bloomsLevel: 'Remember',
      difficulty: 'Easy',
      marks: 2,
      eloId: 'elo1',
      eloTitle: 'Understanding Plant Biology',
      isSelected: false,
      options: ['Energy storage', 'Photosynthesis', 'Water absorption', 'Cell division'],
      correctAnswer: 'Photosynthesis'
    }
  ]);

  useEffect(() => {
    generateItems();
  }, []);

  const generateItems = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockItems: GeneratedItem[] = [];
      let itemId = 1;
      
      assessmentData.itemConfiguration?.forEach((config: any) => {
        for (let i = 0; i < config.noOfItems; i++) {
          assessmentData.selectedELOs?.forEach((elo: any) => {
            mockItems.push({
              id: `item-${itemId++}`,
              question: generateMockQuestion(config.itemType, config.bloomsLevel, elo.title),
              itemType: config.itemType,
              bloomsLevel: config.bloomsLevel,
              difficulty: config.difficulty,
              marks: config.marksPerItem,
              eloId: elo.id,
              eloTitle: elo.title,
              isSelected: false,
              ...(config.itemType === 'Multiple Choice' && {
                options: generateMockOptions(),
                correctAnswer: generateMockOptions()[0]
              })
            });
          });
        }
      });
      
      setGeneratedItems(mockItems);
      toast.success(`Generated ${mockItems.length} assessment items successfully!`);
    } catch (error) {
      toast.error('Failed to generate items. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockQuestion = (type: string, bloomsLevel: string, eloTitle: string) => {
    const questions = {
      'Multiple Choice': [
        `Which of the following best describes ${eloTitle.toLowerCase()}?`,
        `In the context of ${eloTitle.toLowerCase()}, what is the most accurate statement?`,
        `According to ${eloTitle.toLowerCase()}, which option is correct?`
      ],
      'Long Answer': [
        `Critically analyze the key concepts in ${eloTitle.toLowerCase()} and discuss their implications.`,
        `Explain the fundamental principles of ${eloTitle.toLowerCase()} with relevant examples.`,
        `Evaluate the importance of ${eloTitle.toLowerCase()} in the broader context of the subject.`
      ],
      'Short Answer': [
        `Define ${eloTitle.toLowerCase()} and explain its significance.`,
        `List the main components of ${eloTitle.toLowerCase()}.`,
        `Briefly describe the process involved in ${eloTitle.toLowerCase()}.`
      ]
    };
    
    const typeQuestions = questions[type as keyof typeof questions] || questions['Short Answer'];
    return typeQuestions[Math.floor(Math.random() * typeQuestions.length)];
  };

  const generateMockOptions = () => {
    return [
      'Primary metabolic process',
      'Secondary cellular function', 
      'Tertiary biochemical reaction',
      'Quaternary molecular structure'
    ];
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    
    setGeneratedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  const deleteItem = (itemId: string) => {
    setGeneratedItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    toast.success('Item deleted successfully');
  };

  const updateItem = (updatedItem: GeneratedItem) => {
    setGeneratedItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
    toast.success('Item updated successfully');
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        hasImage: false,
        imageUrl: undefined
      });
    }
  };

  const saveItemWithImage = () => {
    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        hasImage: !!imagePreview || !!editingItem.imageUrl,
        imageUrl: imagePreview || editingItem.imageUrl
      };
      updateItem(updatedItem);
    }
  };

  const getItemsByType = (type: string) => {
    if (type === 'all') return generatedItems;
    return generatedItems.filter(item => item.itemType === type);
  };

  const getSelectedItems = () => {
    return generatedItems.filter(item => item.isSelected);
  };

  const calculateBloomsTaxonomyDistribution = () => {
    const selectedItems = getSelectedItems();
    const distribution: { [key: string]: number } = {};
    
    selectedItems.forEach(item => {
      distribution[item.bloomsLevel] = (distribution[item.bloomsLevel] || 0) + 1;
    });
    
    return distribution;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Multiple Choice': 'bg-blue-100 text-blue-700',
      'True/False': 'bg-green-100 text-green-700',
      'Short Answer': 'bg-yellow-100 text-yellow-700',
      'Long Answer': 'bg-purple-100 text-purple-700',
      'Problem Solving': 'bg-orange-100 text-orange-700',
      'Case Study': 'bg-pink-100 text-pink-700',
      'Essay': 'bg-indigo-100 text-indigo-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getBadgeColor = (level: string) => {
    const colors = {
      'Remember': 'bg-red-100 text-red-700',
      'Understand': 'bg-orange-100 text-orange-700',
      'Apply': 'bg-yellow-100 text-yellow-700',
      'Analyze': 'bg-green-100 text-green-700',
      'Evaluate': 'bg-blue-100 text-blue-700',
      'Create': 'bg-purple-100 text-purple-700'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const itemTypes = [...new Set(generatedItems.map(item => item.itemType))];
  const selectedItemsData = getSelectedItems();
  const totalSelectedMarks = selectedItemsData.reduce((sum, item) => sum + item.marks, 0);
  const bloomsDistribution = calculateBloomsTaxonomyDistribution();

  if (isGenerating) {
    return (
      <div className="space-y-8">
        <Card className="border border-border/50 bg-white">
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <Sparkles className="h-16 w-16 text-green-600 mx-auto animate-spin" />
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Generating Assessment Items</h3>
                <p className="text-muted-foreground">Please wait while we create your customized questions...</p>
              </div>
              <Progress value={66} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Generation Results Header */}
      <Card className="border border-border/50 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Assessment Items Generated</h3>
              <p className="text-muted-foreground">Review, edit, and select items for your final assessment</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{generatedItems.length}</div>
              <div className="text-sm text-muted-foreground">Total items generated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Items ({generatedItems.length})</TabsTrigger>
          <TabsTrigger value="selected">Selected ({selectedItems.length})</TabsTrigger>
          <TabsTrigger value="historical">Historical Questions</TabsTrigger>
        </TabsList>

        {/* All Items Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              {itemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Items Grid */}
          <div className="grid gap-4">
            {getItemsByType(filterType).map((item, index) => (
              <Card key={item.id} className={`border border-border/50 ${item.isSelected ? 'ring-2 ring-green-500 bg-green-50/50' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      checked={item.isSelected}
                      onCheckedChange={() => toggleItemSelection(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <Badge className={getTypeColor(item.itemType)}>{item.itemType}</Badge>
                            <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                            <Badge variant="outline">{item.marks} marks</Badge>
                            {item.hasImage && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                <Image className="h-3 w-3 mr-1" />
                                Image
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground font-medium">{item.question}</p>
                          <p className="text-sm text-muted-foreground">ELO: {item.eloTitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setPreviewItem(item)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Preview Question</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <Badge className={getTypeColor(item.itemType)}>{item.itemType}</Badge>
                                  <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                                  <Badge variant="outline">{item.marks} marks</Badge>
                                </div>
                                <p className="text-lg font-medium">{item.question}</p>
                                {item.options && (
                                  <div className="space-y-2">
                                    <p className="font-medium">Options:</p>
                                    {item.options.map((option, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm">
                                          {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span>{option}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Edit Question</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Question Text</label>
                                  <Textarea 
                                    value={editingItem?.question || ''} 
                                    onChange={(e) => setEditingItem(prev => prev ? {...prev, question: e.target.value} : null)}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                
                                <div className="space-y-4">
                                  <label className="text-sm font-medium">Image (Optional)</label>
                                  {(imagePreview || editingItem?.imageUrl) ? (
                                    <div className="space-y-3">
                                      <div className="relative border border-border rounded-lg p-4">
                                        <img 
                                          src={imagePreview || editingItem?.imageUrl} 
                                          alt="Question image" 
                                          className="max-w-full h-auto max-h-64 rounded-md"
                                        />
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={removeImage}
                                          className="absolute top-2 right-2 bg-red-100 hover:bg-red-200"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                      <p className="text-sm text-muted-foreground mb-2">Upload an image for this question</p>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                        className="hidden"
                                        id="image-upload"
                                      />
                                      <label 
                                        htmlFor="image-upload"
                                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer"
                                      >
                                        Choose File
                                      </label>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button onClick={saveItemWithImage}>
                                    Save Changes
                                  </Button>
                                  <Button variant="outline" onClick={() => {
                                    setEditingItem(null);
                                    setImageFile(null);
                                    setImagePreview(null);
                                  }}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Selected Items Tab */}
        <TabsContent value="selected" className="space-y-6">
          <Card className="border border-border/50 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Finalized Assessment Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedItemsData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items selected yet. Go to "All Items" tab to select questions.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group by type */}
                  {itemTypes.map(type => {
                    const typeItems = selectedItemsData.filter(item => item.itemType === type);
                    if (typeItems.length === 0) return null;
                    
                    return (
                      <div key={type} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">{type}</h4>
                          <Badge variant="outline">{typeItems.length} questions</Badge>
                          <Badge variant="outline">{typeItems.reduce((sum, item) => sum + item.marks, 0)} marks</Badge>
                        </div>
                        <div className="grid gap-3">
                          {typeItems.map((item, index) => (
                            <Card key={item.id} className="border border-green-200 bg-green-50/50">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium">Q{index + 1}</span>
                                  <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                                  <Badge variant="outline">{item.marks} marks</Badge>
                                </div>
                                <p className="text-foreground">{item.question}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <Separator />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historical Questions Tab */}
        <TabsContent value="historical" className="space-y-6">
          <Card className="border border-border/50 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Previously Asked Questions
              </CardTitle>
              <p className="text-muted-foreground">Review questions from previous assessments to avoid repetition</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {historicalQuestions.map((item, index) => (
                <Card key={item.id} className="border border-blue-200 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(item.itemType)}>{item.itemType}</Badge>
                          <Badge className={getBadgeColor(item.bloomsLevel)}>{item.bloomsLevel}</Badge>
                          <Badge variant="outline">{item.marks} marks</Badge>
                        </div>
                        <p className="text-foreground">{item.question}</p>
                        <p className="text-sm text-muted-foreground">From: PA1 (Previous Assessment)</p>
                      </div>
                      <Badge variant="outline" className="text-blue-600">Historical</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Review & Create Assessment Section */}
      {selectedItems.length > 0 && (
        <Card className="border border-border/50 bg-gradient-to-br from-orange-50/50 to-white">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-orange-600 to-red-800 bg-clip-text text-transparent">
              <BarChart3 className="h-6 w-6 text-orange-600" />
              Review & Create Assessment
            </CardTitle>
            <p className="text-muted-foreground">Review your assessment overview and finalize the creation</p>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Chapters</div>
                <div className="text-2xl font-bold text-blue-700">{assessmentData.selectedChapters?.length || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">ELOs Addressed</div>
                <div className="text-2xl font-bold text-green-700">{assessmentData.selectedELOs?.length || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Selected Items</div>
                <div className="text-2xl font-bold text-purple-700">{selectedItems.length}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Marks</div>
                <div className="text-2xl font-bold text-orange-700">{totalSelectedMarks}</div>
              </div>
            </div>

            {/* Bloom's Taxonomy Distribution */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Bloom's Taxonomy Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(bloomsDistribution).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{level}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getBadgeColor(level).split(' ')[0]}`}
                          style={{ width: `${selectedItems.length > 0 ? (count / selectedItems.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Assessment Button */}
            <div className="text-center pt-6">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-12 py-4 text-lg rounded-xl hover:scale-105 transition-all duration-300 transform"
                onClick={() => {
                  updateAssessmentData({ 
                    finalizedItems: selectedItemsData,
                    assessmentOverview: {
                      totalChapters: assessmentData.selectedChapters?.length || 0,
                      totalELOs: assessmentData.selectedELOs?.length || 0,
                      totalItems: selectedItems.length,
                      totalMarks: totalSelectedMarks,
                      bloomsDistribution
                    }
                  });
                  toast.success('Assessment saved successfully!');
                }}
              >
                <Save className="h-5 w-5 mr-2" />
                Save Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssessmentItemGeneration;