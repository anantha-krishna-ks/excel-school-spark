import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, FileCheck, ChevronDown, ChevronRight, X } from 'lucide-react';

interface AssessmentItemRow {
  id: string;
  noOfItems: string;
  itemType: string;
  includeLOTS: boolean;
}

interface ELOAssessment {
  id: string;
  name: string;
  assessmentRows: AssessmentItemRow[];
  isExpanded: boolean;
}

interface BloomsTaxonomy {
  level: string;
  numberOfELOs: string;
}

const Assessment = () => {
  const [elos, setElos] = useState<ELOAssessment[]>([
    {
      id: '1',
      name: 'ELO 1: Students will understand the basic concepts',
      assessmentRows: [],
      isExpanded: false
    },
    {
      id: '2',
      name: 'ELO 2: Students will be able to apply knowledge',
      assessmentRows: [],
      isExpanded: false
    },
    {
      id: '3',
      name: 'ELO 3: Students will analyze complex problems',
      assessmentRows: [],
      isExpanded: false
    }
  ]);

  const [bloomsTaxonomy, setBloomsTaxonomy] = useState<BloomsTaxonomy[]>([
    { level: 'Remember', numberOfELOs: '' },
    { level: 'Understand', numberOfELOs: '' },
    { level: 'Apply', numberOfELOs: '' },
    { level: 'Analyze', numberOfELOs: '' },
    { level: 'Evaluate', numberOfELOs: '' },
    { level: 'Create', numberOfELOs: '' }
  ]);

  const itemTypes = [
    { value: 'mcq', label: 'MCQ' },
    { value: 'fill-blank', label: 'Fill in the blank' },
    { value: 'short-description', label: 'Short description' },
    { value: 'long-description', label: 'Long description' }
  ];

  const toggleELOExpansion = (eloId: string) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { ...elo, isExpanded: !elo.isExpanded }
        : elo
    ));
  };

  const addAssessmentRow = (eloId: string) => {
    const newRow: AssessmentItemRow = {
      id: Date.now().toString(),
      noOfItems: '',
      itemType: '',
      includeLOTS: false
    };

    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { ...elo, assessmentRows: [...elo.assessmentRows, newRow] }
        : elo
    ));
  };

  const removeAssessmentRow = (eloId: string, rowId: string) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { ...elo, assessmentRows: elo.assessmentRows.filter(row => row.id !== rowId) }
        : elo
    ));
  };

  const updateAssessmentRow = (eloId: string, rowId: string, field: keyof AssessmentItemRow, value: any) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? {
            ...elo,
            assessmentRows: elo.assessmentRows.map(row =>
              row.id === rowId ? { ...row, [field]: value } : row
            )
          }
        : elo
    ));
  };

  const updateBloomsTaxonomy = (level: string, numberOfELOs: string) => {
    setBloomsTaxonomy(prev => 
      prev.map(item => 
        item.level === level ? { ...item, numberOfELOs } : item
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Bloom's Taxonomy Section */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileCheck className="h-5 w-5" />
            Bloom's Taxonomy - Higher Order Thinking Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bloomsTaxonomy.map((item) => (
              <div key={item.level} className="space-y-2">
                <Label className="text-sm font-medium">{item.level}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Number of ELOs"
                    value={item.numberOfELOs}
                    onChange={(e) => updateBloomsTaxonomy(item.level, e.target.value)}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-xs">
                    ELOs
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ELOs Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Expected Learning Outcomes (ELOs)</h3>
        
        {elos.map((elo) => (
          <Collapsible
            key={elo.id}
            open={elo.isExpanded}
            onOpenChange={() => toggleELOExpansion(elo.id)}
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer hover:from-primary/10 hover:to-primary/15 transition-colors">
                  <CardTitle className="flex items-center justify-between text-primary">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      {elo.name}
                    </div>
                    {elo.isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">Assessment Items</h4>
                    <Button
                      onClick={() => addAssessmentRow(elo.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Item Row
                    </Button>
                  </div>

                  {elo.assessmentRows.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No assessment items added yet.</p>
                      <p className="text-sm">Click "Add Item Row" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Header Row */}
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 rounded-lg font-medium text-sm">
                        <div className="col-span-3">No Of Items</div>
                        <div className="col-span-4">Item Type</div>
                        <div className="col-span-3">Include LOTS</div>
                        <div className="col-span-2">Actions</div>
                      </div>

                      {/* Assessment Rows */}
                      {elo.assessmentRows.map((row) => (
                        <div key={row.id} className="grid grid-cols-12 gap-4 px-4 py-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="col-span-3">
                            <Input
                              type="number"
                              min="1"
                              placeholder="Enter number"
                              value={row.noOfItems}
                              onChange={(e) => updateAssessmentRow(elo.id, row.id, 'noOfItems', e.target.value)}
                            />
                          </div>
                          
                          <div className="col-span-4">
                            <Select 
                              value={row.itemType} 
                              onValueChange={(value) => updateAssessmentRow(elo.id, row.id, 'itemType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {itemTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3 flex items-center">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`lots-${row.id}`}
                                checked={row.includeLOTS}
                                onCheckedChange={(checked) => updateAssessmentRow(elo.id, row.id, 'includeLOTS', checked)}
                              />
                              <Label htmlFor={`lots-${row.id}`} className="text-sm">
                                Include LOTS
                              </Label>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAssessmentRow(elo.id, row.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default Assessment;