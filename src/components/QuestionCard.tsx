import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Eye, Expand } from 'lucide-react';

interface GeneratedItem {
  id: string;
  question: string;
  itemType: string;
  eloName: string;
}

interface QuestionCardProps {
  item: GeneratedItem;
  index: number;
  eloId: string;
  onEdit: (eloId: string, itemId: string) => void;
  onDelete: (eloId: string, itemId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ item, index, eloId, onEdit, onDelete }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(item.question);

  // Generate sample Bloom's taxonomy level
  const getBloomsTaxonomy = () => {
    const taxonomies = ['Knowledge', 'Understanding', 'Application', 'Analysis', 'Synthesis', 'Evaluation'];
    return taxonomies[Math.floor(Math.random() * taxonomies.length)];
  };

  const bloomsLevel = getBloomsTaxonomy();

  const getTypeColor = (type: string) => {
    const colors = {
      'mcq': 'bg-blue-100 text-blue-800 border-blue-200',
      'fill-blank': 'bg-green-100 text-green-800 border-green-200',
      'short-description': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'long-description': 'bg-purple-100 text-purple-800 border-purple-200',
      'open-ended': 'bg-pink-100 text-pink-800 border-pink-200',
      'case-study': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderPreviewContent = () => {
    const getMCQOptions = (question: string) => {
      if (question.includes('chemical symbol for water')) {
        return ['A) H2O', 'B) CO2', 'C) NaCl', 'D) O2'];
      } else if (question.includes('closest to the sun')) {
        return ['A) Mercury', 'B) Venus', 'C) Earth', 'D) Mars'];
      } else if (question.includes('capital of France')) {
        return ['A) London', 'B) Berlin', 'C) Paris', 'D) Madrid'];
      } else {
        return ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'];
      }
    };

    const getCaseStudyContext = (question: string) => {
      if (question.includes('EcoFresh')) {
        return 'EcoFresh Ltd. is a startup company that produces biodegradable cleaning products. The company was founded in 2022 and has seen moderate growth in local markets. Recently, EcoFresh received investor funding to expand nationwide. However, the company is now facing challenges such as increased competition from established brands, supply chain delays for raw materials, and the need to hire skilled marketing professionals. The CEO is considering whether to invest in digital marketing, form partnerships with eco-friendly retailers, or diversify the product line.';
      } else if (question.includes('marketing strategy failures')) {
        return 'TechnoGadget Inc. launched their revolutionary smartphone with advanced AI features. Despite heavy investment in development and initial hype, the product failed to gain significant market share. The company overlooked key market research, priced the product too high for the target demographic, and failed to communicate the unique value proposition effectively to consumers.';
      } else {
        return 'This is a case study scenario that provides background context and relevant information for analyzing the situation and answering the associated questions.';
      }
    };

    const getFillBlankAnswer = (question: string) => {
      if (question.includes('group of stars')) {
        return 'constellation';
      } else if (question.includes('plants make their own food')) {
        return 'photosynthesis';
      } else if (question.includes('largest mammal')) {
        return 'blue whale';
      } else {
        return 'answer';
      }
    };

    switch (item.itemType) {
      case 'mcq':
        const options = getMCQOptions(item.question);
        return (
          <div className="space-y-4">
            <div className="font-medium">{item.question}</div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="radio" name="option" className="h-4 w-4" />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'fill-blank':
        const answer = getFillBlankAnswer(item.question);
        return (
          <div className="space-y-4">
            <div className="font-medium">{item.question}</div>
            <div className="border-b-2 border-gray-300 inline-block min-w-[200px] pb-1">
              <span className="text-transparent">{answer}</span>
            </div>
          </div>
        );
      case 'case-study':
        const context = getCaseStudyContext(item.question);
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Case Study</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {context}
              </p>
            </div>
            <div className="font-medium">{item.question}</div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="font-medium">{item.question}</div>
            <div className="border rounded-lg p-4 bg-muted/30">
              <span className="text-muted-foreground text-sm">Answer space</span>
            </div>
          </div>
        );
    }
  };

  const handleSaveEdit = () => {
    // Update the question content and trigger parent component update
    onEdit(eloId, item.id);
    setIsEditOpen(false);
  };

  return (
    <>
      <Card className={`border-l-4 transition-all duration-200 hover:shadow-md ${isSelected ? 'border-l-primary bg-primary/5' : 'border-l-muted'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => setIsSelected(checked === true)}
              className="mt-1"
            />
            
            {/* Question Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTypeColor(item.itemType)}`}
                    >
                      {item.itemType.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                      {bloomsLevel}
                    </Badge>
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-3">
                    {item.question}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.eloName}
                    </Badge>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Question Preview</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        {renderPreviewContent()}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div>
                          <Label htmlFor="question">Question</Label>
                          <Textarea
                            id="question"
                            value={editedQuestion}
                            onChange={(e) => setEditedQuestion(e.target.value)}
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                        
                         {item.itemType === 'mcq' && (
                           <div className="space-y-3">
                             <Label>Options</Label>
                             {item.question.includes('chemical symbol for water') ? (
                               <>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">A:</span>
                                   <Input defaultValue="H2O" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">B:</span>
                                   <Input defaultValue="CO2" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">C:</span>
                                   <Input defaultValue="NaCl" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">D:</span>
                                   <Input defaultValue="O2" />
                                 </div>
                               </>
                             ) : item.question.includes('closest to the sun') ? (
                               <>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">A:</span>
                                   <Input defaultValue="Mercury" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">B:</span>
                                   <Input defaultValue="Venus" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">C:</span>
                                   <Input defaultValue="Earth" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">D:</span>
                                   <Input defaultValue="Mars" />
                                 </div>
                               </>
                             ) : item.question.includes('capital of France') ? (
                               <>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">A:</span>
                                   <Input defaultValue="London" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">B:</span>
                                   <Input defaultValue="Berlin" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">C:</span>
                                   <Input defaultValue="Paris" />
                                 </div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">D:</span>
                                   <Input defaultValue="Madrid" />
                                 </div>
                               </>
                             ) : (
                               ['A', 'B', 'C', 'D'].map((option) => (
                                 <div key={option} className="flex items-center gap-2">
                                   <span className="text-sm font-medium w-6">{option}:</span>
                                   <Input placeholder={`Option ${option}`} />
                                 </div>
                               ))
                             )}
                           </div>
                         )}
                        
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => onDelete(eloId, item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionCard;