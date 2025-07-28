import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Edit, Trash2, FileCheck, Minus } from 'lucide-react';
import QuestionCard from './QuestionCard';

interface AssessmentItemRow {
  id: string;
  noOfItems: string;
  itemType: string;
  includeLOTS: boolean;
}

interface GeneratedItem {
  id: string;
  question: string;
  itemType: string;
  eloName: string;
}

interface ELOAssessment {
  id: string;
  name: string;
  assessmentRows: AssessmentItemRow[];
  generatedItems: GeneratedItem[];
}

const Assessment = () => {
  const [elos, setElos] = useState<ELOAssessment[]>([
    {
      id: '1',
      name: 'ELO 1',
      assessmentRows: [{
        id: '1-row-1',
        noOfItems: '',
        itemType: '',
        includeLOTS: false
      }],
      generatedItems: []
    },
    {
      id: '2',
      name: 'ELO 2',
      assessmentRows: [{
        id: '2-row-1',
        noOfItems: '',
        itemType: '',
        includeLOTS: false
      }],
      generatedItems: []
    },
    {
      id: '3',
      name: 'ELO 3',
      assessmentRows: [{
        id: '3-row-1',
        noOfItems: '',
        itemType: '',
        includeLOTS: false
      }],
      generatedItems: []
    }
  ]);

  const addELO = () => {
    const newELO: ELOAssessment = {
      id: Date.now().toString(),
      name: `ELO ${elos.length + 1}`,
      assessmentRows: [{
        id: `${Date.now()}-row-1`,
        noOfItems: '',
        itemType: '',
        includeLOTS: false
      }],
      generatedItems: []
    };
    setElos([...elos, newELO]);
  };

  const addAssessmentRow = (eloId: string) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { 
            ...elo, 
            assessmentRows: [...elo.assessmentRows, {
              id: `${eloId}-row-${Date.now()}`,
              noOfItems: '',
              itemType: '',
              includeLOTS: false
            }]
          }
        : elo
    ));
  };

  const removeAssessmentRow = (eloId: string, rowId: string) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { 
            ...elo, 
            assessmentRows: elo.assessmentRows.filter(row => row.id !== rowId)
          }
        : elo
    ));
  };

  const updateAssessmentRow = (eloId: string, rowId: string, field: keyof AssessmentItemRow, value: any) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { 
            ...elo, 
            assessmentRows: elo.assessmentRows.map(row => 
              row.id === rowId 
                ? { ...row, [field]: value }
                : row
            )
          }
        : elo
    ));
  };

  const generateItems = (eloId: string) => {
    const elo = elos.find(e => e.id === eloId);
    if (!elo) return;

    const newItems: GeneratedItem[] = [];
    
    elo.assessmentRows.forEach((row) => {
      if (row.noOfItems && row.itemType) {
        const numberOfItems = parseInt(row.noOfItems);
        for (let i = 1; i <= numberOfItems; i++) {
          newItems.push({
            id: `${eloId}-item-${Date.now()}-${i}`,
            question: `Item Question ${i}`,
            itemType: row.itemType,
            eloName: elo.name
          });
        }
      }
    });

    setElos(elos.map(e => 
      e.id === eloId 
        ? { ...e, generatedItems: [...e.generatedItems, ...newItems] }
        : e
    ));
  };

  const editItem = (eloId: string, itemId: string) => {
    console.log('Edit item:', itemId, 'in ELO:', eloId);
  };

  const deleteItem = (eloId: string, itemId: string) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { ...elo, generatedItems: elo.generatedItems.filter(item => item.id !== itemId) }
        : elo
    ));
  };

  const itemTypes = [
    { value: 'mcq', label: 'MCQ' },
    { value: 'fill-blank', label: 'Fill in the blank' },
    { value: 'short-description', label: 'Short description' },
    { value: 'long-description', label: 'Long description' },
    { value: 'open-ended', label: 'Open Ended' },
    { value: 'case-study', label: 'Case Study' }
  ];

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="space-y-4">
        {elos.map((elo) => (
          <AccordionItem key={elo.id} value={elo.id} className="border border-primary/20 rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">{elo.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {elo.assessmentRows.length} rows
                </Badge>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Assessment Rows */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">Assessment Items:</h4>
                    <Button
                      onClick={() => addAssessmentRow(elo.id)}
                      variant="outline"
                      size="sm"
                      className="text-primary hover:text-primary"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Row
                    </Button>
                  </div>

                  {elo.assessmentRows.map((row, index) => (
                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 bg-muted/30 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">No Of Items</Label>
                        <Input
                          type="number"
                          min="1"
                          value={row.noOfItems}
                          onChange={(e) => updateAssessmentRow(elo.id, row.id, 'noOfItems', e.target.value)}
                          placeholder="Enter number"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Item Type</Label>
                        <Select 
                          value={row.itemType} 
                          onValueChange={(value) => updateAssessmentRow(elo.id, row.id, 'itemType', value)}
                        >
                          <SelectTrigger className="mt-1">
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

                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          checked={row.includeLOTS}
                          onCheckedChange={(checked) => updateAssessmentRow(elo.id, row.id, 'includeLOTS', checked)}
                        />
                        <Label className="text-sm font-medium">Include LOTS</Label>
                      </div>

                      <div className="pt-6">
                        <span className="text-sm text-muted-foreground">Row {index + 1}</span>
                      </div>

                      <div className="flex gap-2 pt-6">
                        {elo.assessmentRows.length > 1 && (
                          <Button
                            onClick={() => removeAssessmentRow(elo.id, row.id)}
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => generateItems(elo.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Generate All Items
                  </Button>
                </div>

                {/* Generated Items Cards */}
                {elo.generatedItems.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Generated Items ({elo.generatedItems.length})</h4>
                    
                    <div className="space-y-3">
                      {elo.generatedItems.map((item, index) => (
                        <QuestionCard
                          key={item.id}
                          item={item}
                          index={index}
                          eloId={elo.id}
                          onEdit={editItem}
                          onDelete={deleteItem}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

    </div>
  );
};

export default Assessment;