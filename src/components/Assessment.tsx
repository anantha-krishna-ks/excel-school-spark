import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileCheck } from 'lucide-react';

interface AssessmentItem {
  id: string;
  question: string;
  itemType: string;
  eloName: string;
}

interface ELOAssessment {
  id: string;
  name: string;
  items: AssessmentItem[];
  formData: {
    noOfItems: string;
    itemType: string;
    includeLOTS: boolean;
  };
}

const Assessment = () => {
  const [elos, setElos] = useState<ELOAssessment[]>([
    {
      id: '1',
      name: 'ELO 1',
      items: [],
      formData: {
        noOfItems: '',
        itemType: '',
        includeLOTS: false
      }
    }
  ]);

  const addELO = () => {
    const newELO: ELOAssessment = {
      id: Date.now().toString(),
      name: `ELO ${elos.length + 1}`,
      items: [],
      formData: {
        noOfItems: '',
        itemType: '',
        includeLOTS: false
      }
    };
    setElos([...elos, newELO]);
  };

  const updateELOFormData = (eloId: string, field: string, value: any) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { ...elo, formData: { ...elo.formData, [field]: value } }
        : elo
    ));
  };

  const generateItems = (eloId: string) => {
    const elo = elos.find(e => e.id === eloId);
    if (!elo || !elo.formData.noOfItems || !elo.formData.itemType) return;

    const numberOfItems = parseInt(elo.formData.noOfItems);
    const newItems: AssessmentItem[] = [];

    for (let i = 1; i <= numberOfItems; i++) {
      newItems.push({
        id: `${eloId}-item-${Date.now()}-${i}`,
        question: `Item Question ${i}`,
        itemType: elo.formData.itemType,
        eloName: elo.name
      });
    }

    setElos(elos.map(e => 
      e.id === eloId 
        ? { ...e, items: [...e.items, ...newItems] }
        : e
    ));
  };

  const editItem = (eloId: string, itemId: string) => {
    // Implementation for editing items
    console.log('Edit item:', itemId, 'in ELO:', eloId);
  };

  const deleteItem = (eloId: string, itemId: string) => {
    setElos(elos.map(elo => 
      elo.id === eloId 
        ? { ...elo, items: elo.items.filter(item => item.id !== itemId) }
        : elo
    ));
  };

  const itemTypes = [
    { value: 'mcq', label: 'MCQ' },
    { value: 'fill-blank', label: 'Fill in the blank' },
    { value: 'short-description', label: 'Short description' },
    { value: 'long-description', label: 'Long description' }
  ];

  return (
    <div className="space-y-8">
      {elos.map((elo) => (
        <Card key={elo.id} className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileCheck className="h-5 w-5" />
              {elo.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Assessment Form */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Assessment:</h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`items-${elo.id}`} className="text-sm font-medium">
                    Item Details:
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label htmlFor={`no-items-${elo.id}`} className="text-sm">
                      No Of Items
                    </Label>
                    <Input
                      id={`no-items-${elo.id}`}
                      type="number"
                      min="1"
                      value={elo.formData.noOfItems}
                      onChange={(e) => updateELOFormData(elo.id, 'noOfItems', e.target.value)}
                      placeholder="Enter number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-type-${elo.id}`} className="text-sm">
                      Item Type
                    </Label>
                    <Select 
                      value={elo.formData.itemType} 
                      onValueChange={(value) => updateELOFormData(elo.id, 'itemType', value)}
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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`lots-${elo.id}`}
                      checked={elo.formData.includeLOTS}
                      onCheckedChange={(checked) => updateELOFormData(elo.id, 'includeLOTS', checked)}
                    />
                    <Label htmlFor={`lots-${elo.id}`} className="text-sm font-medium">
                      Include LOTS
                    </Label>
                  </div>

                  <Button
                    onClick={() => generateItems(elo.id)}
                    disabled={!elo.formData.noOfItems || !elo.formData.itemType}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Generate Item(s)
                  </Button>
                </div>
              </div>
            </div>

            {/* Generated Items Table */}
            {elo.items.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Generated Item(s)</h4>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-6 py-3 border-b">
                    <div className="grid grid-cols-4 gap-4 font-medium text-sm">
                      <span>Item Question</span>
                      <span>Item Type</span>
                      <span>ELO Name</span>
                      <span>Actions</span>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {elo.items.map((item, index) => (
                      <div key={item.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                        <div className="grid grid-cols-4 gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{index + 1}.</span>
                            <span>{item.question}</span>
                          </div>
                          <div>
                            <Badge variant="secondary" className="capitalize">
                              {item.itemType.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div>
                            <Badge variant="outline">
                              {item.eloName}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editItem(elo.id, item.id)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteItem(elo.id, item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add More ELO Button */}
      <Button
        onClick={addELO}
        variant="outline"
        className="w-full border-dashed border-2 py-8 text-muted-foreground hover:text-primary hover:border-primary/50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add More +
      </Button>
    </div>
  );
};

export default Assessment;