import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LinkIcon from '@mui/icons-material/Link';
import axios from 'axios';
import config from '@/config';
import Header from '@/components/Header';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Link,
  Divider,
  TextField,
  IconButton,
  Button as MuiButton,
  Chip,
  Alert,
  Collapse,
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogContentText,
  DialogActions as MuiDialogActions,
  CircularProgress as MuiCircularProgress,
  CardMedia,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  PlayArrow as PlayArrowIcon 
} from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Clock, 
  Users, 
  Video, 
  Globe, 
  FileText, 
  Brain, 
  CheckCircle2, 
  Lightbulb, 
  MessageSquare, 
  TrendingUp,
  Home,
  Edit3,
  Calendar,
  GraduationCap,
  Image,
  Play,
  Activity,
  HelpCircle,
  ChevronRight,
  ExternalLink,

} from 'lucide-react';
import { Session } from 'inspector/promises';

function EditableField({ value, onChange, multiline = false, placeholder = '', isSaved }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(value);

  const handleSave = () => {
    onChange(currentValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <TextField
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          multiline={multiline}
          fullWidth
          variant="outlined"
          size="small"
          placeholder={placeholder}
        />
        <IconButton onClick={handleSave} color="primary">
          <SaveIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1 }}>{value || placeholder}</Box>
      {!isSaved && (
        <IconButton size="small" onClick={() => setIsEditing(true)}>
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

function EditableList({ items, onUpdate, placeholder = 'No items', isSaved }) {
  const [currentItems, setCurrentItems] = React.useState([...items]);
  const [newItem, setNewItem] = React.useState('');
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [editValue, setEditValue] = React.useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      const updatedItems = [...currentItems, newItem.trim()];
      setCurrentItems(updatedItems);
      onUpdate(updatedItems);
      setNewItem('');
    }
  };

  const handleUpdate = (index) => {
    if (editValue.trim()) {
      const updatedItems = [...currentItems];
      updatedItems[index] = editValue.trim();
      setCurrentItems(updatedItems);
      onUpdate(updatedItems);
      setEditingIndex(-1);
    }
  };

  const handleDelete = (index) => {
    const updatedItems = currentItems.filter((_, i) => i !== index);
    setCurrentItems(updatedItems);
    onUpdate(updatedItems);
  };

  if (currentItems.length === 0) {
    return (
      <Box>
        <Typography color="text.secondary">{placeholder}</Typography>
        {!isSaved && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              size="small"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new item"
            />
            <Button onClick={handleAdd} startIcon={<AddIcon />} variant="outlined" size="small">
              Add
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
        {currentItems.map((item, index) => (
          <li key={index} style={{ marginBottom: '0.5rem' }}>
            {editingIndex === index ? (
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  fullWidth
                />
                <Tooltip title="Save changes">
                  <IconButton onClick={() => handleUpdate(index)} size="small" color="primary">
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item}</span>
                <Box>
                  {!isSaved && (
                    <>
                      <Tooltip title="Edit item">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setEditingIndex(index);
                            setEditValue(item);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete item">
                        <IconButton size="small" onClick={() => handleDelete(index)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </li>
        ))}
      </Box>
      {!isSaved && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField
            size="small"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
          />
          <Button onClick={handleAdd} startIcon={<AddIcon />} variant="outlined" size="small">
            Add
          </Button>
        </Box>
      )}
    </Box>
  );
}

function EditableSection({ title, emoji, children, onEdit, onSave, onCancel, isEditing }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <span style={{ fontSize: '1.3em' }}>{emoji}</span> {title}
        </Typography>
        <Box>
          {isEditing ? (
            <>
              <Tooltip title="Save changes">
                <IconButton onClick={onSave} color="primary">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel editing">
                <IconButton onClick={onCancel} color="default">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            onEdit && (
              <Tooltip title="Edit section">
                <IconButton onClick={onEdit} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )
          )}
        </Box>
      </Box>
      {children}
    </Box>
  );
}

const formatGrade = (grade) => {
  if (!grade) return '';

  // First try to convert to uppercase (for lowercase roman numerals)
  const normalizedGrade = grade.toUpperCase();

  // Check if it's a number (only if it starts with a digit)
  if (grade.match(/^\d/)) {
    const num = parseInt(grade);
    if (!isNaN(num)) {
      return num.toString(); // Convert number to string
    }
  }

  // If it's not a number or doesn't start with a digit, return the normalized version
  // This will preserve Roman numerals (both upper and lowercase) and other strings
  return normalizedGrade;
};

const SessionPlanOutput = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const {
    lessonPlanData,
    originalTopic,
    onSaveSuccess,
    UnitId,
    Grade
  } = location.state || {};
  const getInitialData = React.useCallback(() => {
    console.log('Raw lessonPlanData:', lessonPlanData);
    const data = lessonPlanData.structuredData || {};
    
    const assessment = data.assessment || {};
    const differentiation = data.differentiation || {};
    
    const mappedAssessment = {
      description: assessment.description || '',
      successCriteria: [...(assessment.successCriteria || [])]
    };
    console.log('Mapped Assessment:', mappedAssessment);

    const mappedDifferentiation = {
      support: differentiation.support || ''
    };
    console.log('Mapped Differentiation:', mappedDifferentiation);

    // Ensure resources are properly initialized from either resources or educationalDocuments
    const resources = data.resources?.length ? data.resources : (data.educationalDocuments || []);

    const initialData = {
      ...data,
      assessment: mappedAssessment,
      differentiation: mappedDifferentiation,
      learningObjectives: [...(data.learningObjectives || [])],
      materials: [...(data.materials || [])],
      keyVocabulary: [...(data.keyVocabulary || [])],
      discussionQuestions: [...(data.discussionQuestions || [])],
      currentAffairs: [...(data.currentAffairs || [])],
      educationalVideos: [...(data.educationalVideos || [])],
      realWorldExamples: [...(data.realWorldExamples || [])],
      resources: [...resources], // Ensure resources are included
      educationalDocuments: [...resources], // Keep both for backward compatibility
      lessonFlow: { ...(data.lessonFlow || {}) },
      metadata: { 
        ...(data.metadata || {}),
        grade: Grade // Format grade when initializing
      }
    };

    return JSON.parse(JSON.stringify(initialData));
  }, [lessonPlanData.structuredData]);

  const [editableData, setEditableData] = React.useState(getInitialData);
  const [savedData, setSavedData] = React.useState(getInitialData);
  const [editingSection, setEditingSection] = React.useState(null);
  
  // Keep resources state separate to prevent it from being lost
  const [resourcesState, setResourcesState] = React.useState(() => {
    const data = getInitialData();
    return data.resources || [];
  });
  
  const [editingTitle, setEditingTitle] = React.useState('');
  const [isSaved, setIsSaved] = React.useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [bottomNotification, setBottomNotification] = React.useState({ open: false, message: '', severity: 'info' });
  const [errors, setErrors] = React.useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());


  const handleSaveAll = async (source = 'top') => {
    setIsSaving(true);
    console.log("Saving lesson plan:", editableData);
    editableData["visualAids"] = images;
    try {
      const payload = {
        appcode: 'AP01',
        custcode: 'CU01',
        orgcode: 'OR01',
        usercode: 'UO01',
        classname: Grade || '',
        subjectname: editableData.metadata?.subject || '',
        lessonplanname: editableData.title || '',
        ailessonplan_json: JSON.stringify(lessonPlanData.ailessonplan || editableData),
        modifiedlessonplan_json: JSON.stringify(editableData),
        inputtoken: lessonPlanData.inputtoken || 0,
        responsetoken: lessonPlanData.responsetoken || 0,
        unitplanid: UnitId || 0,
      };

      console.log("Sending payload:", payload);
      const response = await axios.post(config.ENDPOINTS.SAVE_LESSON_PLAN, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Server response:", response.data);

      // On successful save, show modern alert and update state
      setSuccessDialogOpen(true);

      setSavedData(editableData);
      setEditingSection(null);
      //setEditingTitle(false);
      setIsSaved(true);
      setIsSaving(false);
      
      // Notify parent component about successful save
      if (onSaveSuccess) {
        onSaveSuccess();
      }

    } catch (error) {
      console.error('Failed to save lesson plan:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || 'An unexpected error occurred. Please try again.';
      // if (source === 'bottom') {
      //   setBottomNotification({ open: true, message: `Save failed: ${errorMessage}`, severity: 'error' });
      // } else {
      //   setNotification({ open: true, message: `Save failed: ${errorMessage}`, severity: 'error' });
      // }
      setIsSaving(false);
    }
  };

  const validateSection = (section) => {
    const newErrors = {};
    const data = editableData;
    const requiredMsg = "This field cannot be empty.";

    switch (section) {
      case 'title':
        if (!editingTitle) newErrors['title'] = requiredMsg;
        break;

      case 'discussionQuestions':
        const questionErrors = [];
        data.discussionQuestions?.forEach((q, index) => {
            const itemErrors = {};
            if (!q.question?.trim()) itemErrors['question'] = requiredMsg;
            if (!q.purpose?.trim()) itemErrors['purpose'] = requiredMsg;
            
            if (Object.keys(itemErrors).length > 0) {
                questionErrors[index] = itemErrors;
            }
        });
        if (questionErrors.some(e => e)) { // Check if any error object was actually pushed
            newErrors['discussionQuestions'] = questionErrors;
        }
        break;

      case 'realWorldExamples':
        const exampleErrors = [];
        data.realWorldExamples?.forEach((ex, idx) => {
          const itemErrors = {};
          if (!ex.example?.trim()) itemErrors['example'] = requiredMsg;
          if (!ex.explanation?.trim()) itemErrors['explanation'] = requiredMsg;
          if (Object.keys(itemErrors).length > 0) {
            exampleErrors[idx] = itemErrors;
          }
        });
        if (exampleErrors.some(e => e)) {
          newErrors['realWorldExamples'] = exampleErrors;
        }
        break;

      case 'learningObjectives':
        const loErrors = [];
        data.learningObjectives?.forEach((obj, index) => {
          if (!obj.trim()) {
            loErrors[index] = requiredMsg;
          }
        });
        if (loErrors.some(e => e)) {
          newErrors['learningObjectives'] = loErrors;
        }
        break;

      case 'materials':
        const materialErrors = [];
        data.materials?.forEach((mat, index) => {
          const itemErrors = {};
          if (!mat.name?.trim()) itemErrors['name'] = requiredMsg;
          if (!mat.quantity?.trim()) itemErrors['quantity'] = requiredMsg;

          if (Object.keys(itemErrors).length > 0) {
            materialErrors[index] = itemErrors;
          }
        });
        if (materialErrors.some(e => e)) {
          newErrors['materials'] = materialErrors;
        }
        break;

      case 'keyVocabulary':
        const vocabErrors = [];
        data.keyVocabulary?.forEach((word, index) => {
          const itemErrors = {};
          if (!word.term?.trim()) itemErrors['term'] = requiredMsg;
          if (!word.definition?.trim()) itemErrors['definition'] = requiredMsg;

          if (Object.keys(itemErrors).length > 0) {
            vocabErrors[index] = itemErrors;
          }
        });
        if (vocabErrors.some(e => e)) {
          newErrors['keyVocabulary'] = vocabErrors;
        }
        break;

      case 'assessment':
        const assessmentErrors = {};
        const successCriteriaErrors = [];
        if (!data.assessment?.description?.trim()) {
          assessmentErrors['description'] = requiredMsg;
        }
        data.assessment?.successCriteria?.forEach((criterion, index) => {
          if (!criterion.trim()) {
            successCriteriaErrors[index] = requiredMsg;
          }
        });
        if (successCriteriaErrors.some(e => e)) {
          assessmentErrors['successCriteria'] = successCriteriaErrors;
        }
        if (Object.keys(assessmentErrors).length > 0) {
          newErrors['assessment'] = assessmentErrors;
        }
        break;

      case 'differentiation':
        if (!data.differentiation?.support?.trim()) {
          newErrors['differentiation'] = { support: requiredMsg };
        }
        break;

      case 'resources':
        const resourceErrors = [];
        data.resources?.forEach((res, index) => {
          const itemErrors = {};
          if (!res.title?.trim()) itemErrors['title'] = requiredMsg;
          if (!res.url?.trim()) itemErrors['url'] = requiredMsg;
          if (Object.keys(itemErrors).length > 0) {
            resourceErrors[index] = itemErrors;
          }
        });
        if (resourceErrors.some(e => e)) {
          newErrors['resources'] = resourceErrors;
        }
        break;

      case 'currentAffairs':
        const affairErrors = [];
        data.currentAffairs?.forEach((item, index) => {
          const itemErrors = {};
          if (!item.title?.trim()) itemErrors['title'] = requiredMsg;
          if (!item.url?.trim()) itemErrors['url'] = requiredMsg;
          if (Object.keys(itemErrors).length > 0) {
            affairErrors[index] = itemErrors;
          }
        });
        if (affairErrors.some(e => e)) {
          newErrors['currentAffairs'] = affairErrors;
        }
        break;

      case 'educationalVideos':
        const videoErrors = [];
        data.educationalVideos?.forEach((video, index) => {
          const itemErrors = {};
          if (!video.title?.trim()) itemErrors['title'] = requiredMsg;
          if (!video.url?.trim()) itemErrors['url'] = requiredMsg;
          if (Object.keys(itemErrors).length > 0) {
            videoErrors[index] = itemErrors;
          }
        });
        if (videoErrors.some(e => e)) {
          newErrors['educationalVideos'] = videoErrors;
        }
        break;

      case 'lessonFlow_introduction':
        const introErrors = {};
        const introData = data.lessonFlow?.introduction;
        if (!introData?.hookActivity?.trim()) introErrors['hookActivity'] = requiredMsg;
        if (!introData?.priorKnowledgeConnection?.trim()) introErrors['priorKnowledgeConnection'] = requiredMsg;
        if (!String(introData?.duration || '').trim()) introErrors['duration'] = requiredMsg;
        if (Object.keys(introErrors).length > 0) {
          newErrors['lessonFlow_introduction'] = introErrors;
        }
        break;

      case 'lessonFlow_activities':
        const activityErrors = [];
        data.lessonFlow?.activities?.forEach((act, index) => {
          const itemErrors = {};
          if (!act.title?.trim()) itemErrors['title'] = requiredMsg;
          if (!act.objective?.trim()) itemErrors['objective'] = requiredMsg;
          if (!String(act.duration || '').trim()) itemErrors['duration'] = requiredMsg;

          const stepErrors = [];
          act.steps?.forEach((step, stepIndex) => {
            if (!String(step || '').trim()) {
              stepErrors[stepIndex] = requiredMsg;
            }
          });

          if (stepErrors.some(e => e)) {
            itemErrors['steps'] = stepErrors;
          }

          if (Object.keys(itemErrors).length > 0) {
            activityErrors[index] = itemErrors;
          }
        });
        if (activityErrors.some(e => e)) {
          newErrors['lessonFlow_activities'] = activityErrors;
        }
        break;

      default:
        break;
    }
    return newErrors;
  };

  const handleEdit = (section) => {
    if (section === 'title') {
      setEditingTitle(editableData.title);
    }
    
    // When editing resources, ensure we have the latest resources
    if (section === 'resources') {
      const currentResources = resourcesState?.length > 0 
        ? resourcesState 
        : (editableData.resources || []);
      
      setEditableData(prev => ({
        ...prev,
        resources: [...currentResources],
        educationalDocuments: [...currentResources]
      }));
    }
    
    setErrors({}); // Clear errors when starting to edit
    setEditingSection(section);
  };

  const handleSave = (section) => {
    // Validate the section if needed
    const validationErrors = validateSection(section);
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (section === 'title') {
          editableData.title= editingTitle;
    }
    // Always use the most up-to-date resources from editableData
    const currentResources = [...(editableData.resources || [])];
    
    // Create a deep copy of the current state to avoid reference issues

    const newSavedData = JSON.parse(JSON.stringify({
      ...savedData,
      [section]: editableData[section],
      resources: currentResources,
      educationalDocuments: currentResources
    }));

    // Update both saved data and editable data
    setSavedData(newSavedData);
    
    setEditableData(prev => ({
      ...prev,
      [section]: editableData[section],
      resources: currentResources,
      educationalDocuments: currentResources
    }));
    
    // Update resources state to match
    setResourcesState(currentResources);
    
    setEditingSection(null);
    setErrors({});
  };
 
  const handleCancel = () => {
    const fallback = editableData.resources?.length > 0
      ? editableData.resources
      : resourcesState?.length > 0
        ? resourcesState
        : savedData.resources || [];
  
    const restored = JSON.parse(JSON.stringify(savedData || {}));
    restored.resources = [...fallback];
    restored.educationalDocuments = [...fallback];
  
    setEditableData(restored);
    setResourcesState([...fallback]);
    setEditingSection(null);
    setErrors({});
  };
  

  const handleChange = (section, field, value) => {
    // Clear specific error when user starts typing
    const errorKey = `${section}_${field}`;
    if (errors[errorKey]) {
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[errorKey];
            return newErrors;
        });
    }

    setEditableData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    // Clear error for this specific field in an array
    if (errors[section] && errors[section][index] && errors[section][index][field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        const newSectionErrors = [...newErrors[section]];
        const newItemErrors = { ...newSectionErrors[index] };
        delete newItemErrors[field];
        if (Object.keys(newItemErrors).length === 0) {
          newSectionErrors[index] = undefined;
        }
        if (newSectionErrors.every(e => e === undefined)) {
          delete newErrors[section];
        } else {
          newErrors[section] = newSectionErrors;
        }
        return newErrors;
      });
    }

    setEditableData(prev => {
      const newArray = JSON.parse(JSON.stringify(prev[section] || [])); // Deep copy with fallback to empty array
      if (!newArray[index]) return prev; // Safety check
      
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      
      // If we're updating resources, also update educationalDocuments
      if (section === 'resources') {
        return {
          ...prev,
          [section]: newArray,
          educationalDocuments: JSON.parse(JSON.stringify(newArray)) // Deep copy to avoid reference issues
        };
      }
      
      return {
        ...prev,
        [section]: newArray
      };
    });
    
    // Update resourcesState if we're editing resources
    if (section === 'resources') {
      setResourcesState(prev => {
        const newResources = JSON.parse(JSON.stringify(editableData.resources || []));
        if (!newResources[index]) return prev;
        newResources[index] = {
          ...newResources[index],
          [field]: value
        };
        return newResources;
      });
    }
  };

  const handleActivityChange = (index, field, value) => {
    setEditableData(prev => {
      const newLessonFlow = JSON.parse(JSON.stringify(prev.lessonFlow));
      newLessonFlow.activities[index][field] = value;
      return { ...prev, lessonFlow: newLessonFlow };
    });
  };

  const addActivity = () => {
    setEditableData(prev => {
      const newLessonFlow = JSON.parse(JSON.stringify(prev.lessonFlow));
      if (!newLessonFlow.activities) {
        newLessonFlow.activities = [];
      }
      newLessonFlow.activities.push({ title: '', duration: '', objective: '', steps: [] });
      return { ...prev, lessonFlow: newLessonFlow };
    });
  };

  const removeActivity = (index) => {
    setEditableData(prev => {
      const newLessonFlow = JSON.parse(JSON.stringify(prev.lessonFlow));
      newLessonFlow.activities.splice(index, 1);
      return { ...prev, lessonFlow: newLessonFlow };
    });
  };

  const handleAddItem = (section, newItem) => {
    setEditableData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const handleRemoveItem = (section, index) => {
    setEditableData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleNestedArrayChange = (section, objectKey, index, field, value) => {
    setEditableData(prev => {
      // Ensure the top-level section (e.g., lessonFlow) exists
      const newSection = { ...(prev[section] || {}) }; 
      
      // Ensure the nested array (e.g., activities) exists and is a copy
      const newOuterArray = [...(newSection[objectKey] || [])];
      
      // Ensure the object within the array exists
      newOuterArray[index] = { ...(newOuterArray[index] || {}) };
      
      // Set the value
      newOuterArray[index][field] = value;

      return {
        ...prev,
        [section]: {
          ...newSection,
          [objectKey]: newOuterArray
        }
      };
    });
  };

  const handleActivityFieldChange = (activityIndex, field, value) => {
    setEditableData(prev => {
      const newActivities = [...prev.lessonFlow.activities];
      newActivities[activityIndex] = { ...newActivities[activityIndex], [field]: value };
      return { ...prev, lessonFlow: { ...prev.lessonFlow, activities: newActivities } };
    });

    if (errors['lessonFlow_activities']?.[activityIndex]?.[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        const newActivityErrors = [...(newErrors['lessonFlow_activities'] || [])];
        const newItemErrors = { ...newActivityErrors[activityIndex] };
        delete newItemErrors[field];
        newActivityErrors[activityIndex] = Object.keys(newItemErrors).length > 0 ? newItemErrors : undefined;
        
        if (newActivityErrors.every(e => e === undefined)) {
            delete newErrors['lessonFlow_activities'];
        } else {
            newErrors['lessonFlow_activities'] = newActivityErrors;
        }
        return newErrors;
      });
    }
  };

  const handleActivityStepChange = (activityIndex, stepIndex, value) => {
    setEditableData(prev => {
      const newActivities = [...prev.lessonFlow.activities];
      const newSteps = [...newActivities[activityIndex].steps];
      newSteps[stepIndex] = value;
      newActivities[activityIndex] = { ...newActivities[activityIndex], steps: newSteps };
      return { ...prev, lessonFlow: { ...prev.lessonFlow, activities: newActivities } };
    });

    if (errors['lessonFlow_activities']?.[activityIndex]?.steps?.[stepIndex]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        const newActivityErrors = [...newErrors['lessonFlow_activities']];
        const newItemErrors = { ...newActivityErrors[activityIndex] };
        const newStepErrors = [...(newItemErrors.steps || [])];
        newStepErrors[stepIndex] = undefined;

        if (newStepErrors.every(e => e === undefined)) {
          delete newItemErrors.steps;
        } else {
          newItemErrors.steps = newStepErrors;
        }

        newActivityErrors[activityIndex] = Object.keys(newItemErrors).length > 0 ? newItemErrors : undefined;
        
        if (newActivityErrors.every(e => e === undefined)) {
            delete newErrors['lessonFlow_activities'];
        } else {
            newErrors['lessonFlow_activities'] = newActivityErrors;
        }
        return newErrors;
      });
    }
  };

  const handleAddActivity = () => {
    const newActivity = { 
      title: '', 
      objective: '', 
      duration: '', 
      steps: [''],
      materials: [], // Add this
      grouping: '', // Add this
      teacherNotes: '' // Add this
    };
    setEditableData(prev => ({
      ...prev,
      lessonFlow: {
        ...prev.lessonFlow,
        activities: [...(prev.lessonFlow?.activities || []), newActivity]
      }
    }));
  };

  const handleRemoveActivity = (indexToRemove) => {
    setEditableData(prev => ({
      ...prev,
      lessonFlow: {
        ...prev.lessonFlow,
        activities: prev.lessonFlow.activities.filter((_, index) => index !== indexToRemove)
      }
    }));
  };

  const handleAddActivityStep = (activityIndex) => {
    setEditableData(prev => {
      const newActivities = [...prev.lessonFlow.activities];
      newActivities[activityIndex] = {
        ...newActivities[activityIndex],
        steps: [...(newActivities[activityIndex].steps || []), '']
      };
      return { ...prev, lessonFlow: { ...prev.lessonFlow, activities: newActivities } };
    });
  };

  const handleRemoveActivityStep = (activityIndex, stepIndexToRemove) => {
    setEditableData(prev => {
      const newActivities = [...prev.lessonFlow.activities];
      newActivities[activityIndex] = {
        ...newActivities[activityIndex],
        steps: newActivities[activityIndex].steps.filter((_, i) => i !== stepIndexToRemove)
      };
      return { ...prev, lessonFlow: { ...prev.lessonFlow, activities: newActivities } };
    });
  };

  const handleIntroductionChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      lessonFlow: {
        ...prev.lessonFlow,
        introduction: {
          ...(prev.lessonFlow?.introduction || {}),
          [field]: field === 'duration' ? Number(value) : value
        }
      }
    }));

    if (errors['lessonFlow_introduction']?.[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        const newIntroErrors = { ...newErrors['lessonFlow_introduction'] };
        delete newIntroErrors[field];
        if (Object.keys(newIntroErrors).length === 0) {
          delete newErrors['lessonFlow_introduction'];
        } else {
          newErrors['lessonFlow_introduction'] = newIntroErrors;
        }
        return newErrors;
      });
    }
  };

  const handleUpdate = (section, value) => {
    setEditableData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleMetadataUpdate = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  // Destructure from editableData instead of lessonPlanData.structuredData
  const {
    title,
    metadata = {},
    learningObjectives = [],
    materials = [],
    keyVocabulary = [],
    lessonFlow = {},
    assessment = {},
    differentiation = {},
    discussionQuestions = [],
    resources = [],
    currentAffairs = []
  } = editableData;
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = React.useState(false);
  const [imageError, setImageError] = React.useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

 

  useEffect(() => {
    if (editingSection !== null || !editableData?.metadata) return;
  
    const newResources = getTopicResources(editableData.metadata);
    if (
      editableData.resources?.length === 0 &&
      JSON.stringify(newResources) !== JSON.stringify(editableData.resources)
    ) {
      setEditableData(prev => ({
        ...prev,
        resources: newResources,
        educationalDocuments: newResources
      }));
      setResourcesState(newResources);
    }
  }, [editableData.metadata, editingSection]);
  
  const fetchImages = React.useCallback(async () => {
    if (!editableData.title || !editableData.metadata?.subject) {
      setLoadingImages(false);
      setImageError('Title or subject is missing');
      return;
    }
    
    setLoadingImages(true);
    setImageError(null);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await axios.get(config.ENDPOINTS.SEARCH_IMAGES, {
        params: { 
          topic: editableData.title,
          subject: editableData.metadata.subject,
          max_results: 6,
          grade: editableData.metadata?.grade ? editableData.metadata.grade : undefined
        },
        timeout: 10000 // 10 second timeout
      });
      
      if (response.data.status === 'success' && response.data.results?.length > 0) {
        const newImages = response.data.results.map(img => ({
          url: img.url,
          title: img.title || 'Educational Image',
          source: img.source || 'DuckDuckGo',
          width: img.width || 300,
          height: img.height || 200
        }));
        
        setImages(newImages);
        // Update editableData with the new images
        setEditableData(prev => ({
          ...prev,
          educationalImages: newImages
        }));
      } else {
        setImageError('No images found for this topic');
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImageError('Failed to load images. Please try again later.');
      setImages([]);
    } finally {
      setLoadingImages(false);
    }
  }, [editableData.title, editableData.metadata?.subject]);

  // Fetch images when component mounts or when title/subject changes
  React.useEffect(() => {
    // fetchImages is now defined outside the effect using useCallback

    // Only fetch images if we don't already have them
    if (editableData.title && editableData.metadata?.subject && (!editableData.educationalImages || editableData.educationalImages.length === 0)) {
      const timer = setTimeout(() => {
        fetchImages();
      }, 500);

      return () => clearTimeout(timer);
    } else if (editableData.educationalImages?.length > 0) {
      setImages(editableData.educationalImages);
      setLoadingImages(false);
    } else {
      setLoadingImages(false);
    }
  }, [editableData.title, editableData.metadata?.subject]);
  
  



  // Fetch educational documents from backend
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [documentsError, setDocumentsError] = useState(null);
  
  // Get topic resources (placeholder function)
  const getTopicResources = (metadata = {}) => {
    // Return an empty array as we're now fetching resources from the backend
    return [];
  };


  const fetchVideos = async (topicobj, subjectobj, gradeobj) => {
        try {
      const topic = topicobj || '';
      const subject = subjectobj || '';
      const grade = gradeobj ? parseInt(gradeobj) : null;
          
          if (topic) {
            const response = await axios.get(config.ENDPOINTS.SEARCH_VIDEOS, {
              params: { 
                topic: topic,
                subject: subject,
                grade: grade,
                language: 'en',  // Only English videos
                max_results: 5   // Request 5 videos
              },
              timeout: 15000 // 15 second timeout
            });
            
            if (response.data.status === 'success') {
              const videoResults = response.data.results || [];
              console.log(`Fetched ${videoResults.length} videos:`, videoResults);
          // Set educationalVideos to all fetched videos (up to 5)
              setEditableData(prev => ({
                ...prev,
            educationalVideos: videoResults.slice(0, 5).map(video => ({
                  title: video.title || 'Educational Video',
                  url: video.url,
                  video_id: video.video_id,
                  thumbnail: video.thumbnail || (video.video_id ? `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg` : '')
                }))
              }));
              console.log('Set editableData.educationalVideos:', videoResults.slice(0, 8));
            }
          }
        } catch (error) {
          console.error('Error fetching educational videos:', error);
          // Show error to user if needed
    }
  };

  // State to control when the videos section is shown
  const [showVideosSection, setShowVideosSection] = useState(true);

  // Clean and format the topic for search
  const getMainTopic = (topic) => {
    if (!topic) return '';
    
    // Clean the topic
    let cleanTopic = topic
      .trim()
      // Remove any trailing punctuation
      .replace(/[.,;:!?]+$/, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ');
    
    console.log('Searching for topic:', cleanTopic);
    return cleanTopic;
  };

  // Fetch OER Commons resources when topic changes
  const topic = getMainTopic(originalTopic || editableData?.metadata?.topic || editableData?.lessontitle || '');
  const grade = editableData?.metadata?.grade;
  const subject = editableData?.metadata?.subject;
  
  
  useEffect(() => {
    if (lessonPlanData && lessonPlanData.structuredData) {
      const structuredData = lessonPlanData.structuredData;
      const metadata = structuredData.metadata || {};
      const generatedResources = getTopicResources(metadata);
      setEditableData({
        ...structuredData,
        metadata: { ...(structuredData.metadata || {}) },
        learningObjectives: [...(structuredData.learningObjectives || [])],
        materials: [...(structuredData.materials || [])],
        keyVocabulary: [...(structuredData.keyVocabulary || [])],
        lessonFlow: { ...(structuredData.lessonFlow || {}) },
        assessment: { summative: '', formative: '', ...(structuredData.assessment || {}) },
        differentiation: { support: '', challenge: '', extension: '', ...(structuredData.differentiation || {}) },
        discussionQuestions: [...(structuredData.discussionQuestions || [])],
        realWorldExamples: [...(structuredData.realWorldExamples || [])],
        resources: [...((structuredData.additionalSections?.resources) || [])],
        educationalDocuments: [...(structuredData.educationalDocuments || [])], 
        currentAffairs: [...(structuredData.currentAffairs || [])],
        educationalVideos: [...(structuredData.educationalVideos || [])]
      });
    }
  }, [lessonPlanData]); // Reruns when a new lesson plan is loaded.
        
  const getEmojiForSubject = (subject) => {
    if (!subject) return '📚';
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('math')) return '🧮';
    if (subjectLower.includes('science')) return '🔬';
    if (subjectLower.includes('english')) return '📖';
    if (subjectLower.includes('history')) return '🏛️';
    if (subjectLower.includes('geography')) return '🌍';
    if (subjectLower.includes('art') || subjectLower.includes('music')) return '🎨';
    if (subjectLower.includes('computer')) return '💻';
    if (subjectLower.includes('physical')) return '🏃‍♂️';
    return '📚';
  };

  const renderList = (items, type = 'body1') => (
    <Box component="ul" sx={{ 
      pl: 3, 
      mt: 1, 
      mb: 2,
      '& li': {
        mb: 1.5,
        lineHeight: 1.6
      }
    }}>
      {items.map((item, idx) => (
        <li key={idx}>
          <Typography 
            sx={{ 
              fontSize: type === 'body1' ? '1.05rem' : '1rem',
              lineHeight: 1.7
            }}
          >
            {item}
          </Typography>
        </li>
      ))}
    </Box>
  );

  const handleVideoClick = (video) => {
    setSelectedVideo(selectedVideo?.url === video.url ? null : video);
  };

  const closeVideo = (e) => {
    e?.stopPropagation();
    setSelectedVideo(null);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Home className="h-4 w-4 mr-1 inline" />
            Home
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate('/lesson-plan-assistant')}
            className="text-blue-600 hover:text-blue-800"
          >
            Lesson Plan Repository
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate('/session/1/VII/General%20Science')}
            className="text-blue-600 hover:text-blue-800"
          >
            Sessions
          </button>
          <span>/</span>
          <span className="text-foreground">Session Plan Output</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/lesson-plan-assistant')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lesson Plan Repository
          </button>
        </div>
    <div className="max-w-7xl mx-auto space-y-6">
    <Container maxWidth="lg" sx={{ py: 4, width: '100%', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
      <Collapse in={notification.open}>
        <Alert
          // severity={notification.severity}
          onClose={() => {
            setNotification({ ...notification, open: false });
          }}
          sx={{ mb: 2 }}
        >
          {notification.message}
        </Alert>
      </Collapse>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, gap: 2 }}>
        {!isSaved && <Button variant="contained" onClick={() => handleSaveAll('top')} startIcon={<SaveIcon />} disabled={isSaving}>Save Lesson Plan</Button>}
      </Box>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 6, backgroundColor: '#ffffff' }}>
        <EditableSection
          title={editableData.title || ''}
          emoji={getEmojiForSubject(editableData.metadata?.subject)}
          isEditing={editingSection === 'title'}
          onEdit={!isSaved ? () => handleEdit('title') : undefined}
          onSave={() => handleSave('title')}
          onCancel={handleCancel}
        >
          <Box sx={{ mb: 4 }}>
            {editingSection === 'title' && (
              <TextField
                fullWidth
                value={editingTitle}
                onChange={(e) => {
                  setEditingTitle(e.target.value);
                  if (errors['title']) {
                    setErrors(prev => ({ ...prev, title: undefined }));
                  }
                }}
                variant="outlined"
                sx={{ mb: 2 }}
                error={!!errors['title']}
                helperText={errors['title'] || ''}
              />
            )}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', '& .MuiTypography-root': { display: 'inline' } }}>
              <Typography component="span" color="text.secondary">
                <span>Grade: </span>
                <Box component="span" color="text.primary" fontWeight={600}>
                  {editableData.metadata?.grade || 'Not specified'}
                </Box>
              </Typography>
              
              <Typography component="span" color="text.secondary">
                <span>Duration: </span>
                <Box component="span" color="text.primary" fontWeight={600}>
                  {editableData.metadata?.duration || 'Not specified'}
                </Box>
              </Typography>
              
              <Typography component="span" color="text.secondary">
                <span>Subject: </span>
                <Box component="span" color="text.primary" fontWeight={600}>
                  {editableData.metadata?.subject || 'Not specified'}
                </Box>
              </Typography>
            </Box>
          </Box>
        </EditableSection>

        <EditableSection
          title="Learning Objectives"
          emoji="🎯"
          isEditing={editingSection === 'learningObjectives'}
          onEdit={!isSaved ? () => handleEdit('learningObjectives') : undefined}
          onSave={() => handleSave('learningObjectives')}
          onCancel={handleCancel}
        >
          {editingSection === 'learningObjectives' ? (
            <Box>
              {editableData.learningObjectives.map((obj, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    value={obj}
                    onChange={(e) => {
                      const newObjectives = [...editableData.learningObjectives];
                      newObjectives[index] = e.target.value;
                      setEditableData(prev => ({ ...prev, learningObjectives: newObjectives }));

                      if (errors['learningObjectives']?.[index]) {
                        setErrors(prev => {
                          const newLearningObjectivesErrors = [...prev['learningObjectives']];
                          newLearningObjectivesErrors[index] = undefined;
                          // if (newLearningObjectivesErrors.every(e => !e)) {
                          //   const { learningObjectives, ...rest } = prev;
                          //   return rest;
                          // }
                          return { ...prev, learningObjectives: newLearningObjectivesErrors };
                        });
                      }
                    }}
                    variant="outlined"
                    size="small"
                    multiline
                    error={!!errors['learningObjectives']?.[index]}
                    helperText={errors['learningObjectives']?.[index] || ''}
                    disabled={isSaved}
                  />
                  {!isSaved && (
                    <IconButton 
                      onClick={() => {
                        const newObjectives = editableData.learningObjectives.filter((_, i) => i !== index);
                        setEditableData(prev => ({
                          ...prev,
                          learningObjectives: newObjectives
                        }));
                      }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              {!isSaved && (
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setEditableData(prev => ({
                      ...prev,
                      learningObjectives: [...prev.learningObjectives, '']
                    }));
                  }}
                  sx={{ mt: 1 }}
                >
                  Add Objective
                </Button>
              )}
            </Box>
          ) : (
            <Box component="ul" sx={{ 
              pl: 3, 
              mt: 1, 
              mb: 2,
              '& li': {
                mb: 1.5,
                lineHeight: 1.6
              }
            }}>
              {editableData.learningObjectives.length > 0 ? (
                editableData.learningObjectives.map((obj, idx) => (
                  <li key={idx}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '1.05rem',
                        lineHeight: 1.7
                      }}
                    >
                      {obj}
                    </Typography>
                  </li>
                ))
              ) : (
                <Typography color="text.secondary">No learning objectives available</Typography>
              )}
            </Box>
          )}
        </EditableSection>

        <EditableSection
          title="Materials(For Lab Purpose)"
          emoji="🧪"
          isEditing={editingSection === 'materials'}
          onEdit={!isSaved ? () => handleEdit('materials') : undefined}
          onSave={() => handleSave('materials')}
          onCancel={handleCancel}
        >
          {editingSection === 'materials' ? (
            <Box>
              {editableData.materials.map((mat, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                      label="Name"
                      value={mat.name || ''}
                      onChange={(e) => handleArrayChange('materials', index, 'name', e.target.value)}
                      size="small"
                      fullWidth
                      error={!!errors['materials']?.[index]?.name}
                      helperText={errors['materials']?.[index]?.name || ''}
                      disabled={isSaved}
                    />
                    <TextField
                      label="Quantity"
                      value={mat.quantity || ''}
                      onChange={(e) => handleArrayChange('materials', index, 'quantity', e.target.value)}
                      size="small"
                      sx={{ width: '120px' }}
                      error={!!errors['materials']?.[index]?.quantity}
                      helperText={errors['materials']?.[index]?.quantity || ''}
                      disabled={isSaved}
                    />
                    {!isSaved && (
                      <IconButton 
                        onClick={() => handleRemoveItem('materials', index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <TextField
                    label="Notes"
                    value={mat.notes || ''}
                    onChange={(e) => handleArrayChange('materials', index, 'notes', e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    disabled={isSaved}
                  />
                </Box>
              ))}
              {!isSaved && (
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleAddItem('materials', { name: '', quantity: '', notes: '' })}
                  sx={{ mt: 1 }}
                >
                  Add Material
                </Button>
              )}
            </Box>
          ) : (
            <Box component="ul" sx={{ pl: 3 }}>
              {editableData.materials.length > 0 ? (
                editableData.materials.map((mat, idx) => (
                  <li key={idx} style={{ marginBottom: '1.5rem' }}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      <strong>{mat.name || 'Unnamed Material'}</strong>
                      {mat.quantity && ` (${mat.quantity})`}
                    </Typography>
                    {mat.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                        {mat.notes}
                      </Typography>
                    )}
                  </li>
                ))
              ) : (
                <Typography color="text.secondary">No materials added yet</Typography>
              )}
            </Box>
          )}
        </EditableSection>

        <EditableSection
          title="Key Vocabulary"
          emoji="🗣️"
          isEditing={editingSection === 'keyVocabulary'}
          onEdit={!isSaved ? () => handleEdit('keyVocabulary') : undefined}
          onSave={() => handleSave('keyVocabulary')}
          onCancel={handleCancel}
        >
          {editingSection === 'keyVocabulary' ? (
            <Box>
              {editableData.keyVocabulary.map((word, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">Term {index + 1}</Typography>
                    {!isSaved && (
                      <IconButton onClick={() => handleRemoveItem('keyVocabulary', index)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  
                  <TextField
                    label="Term"
                    value={word.term || ''}
                    onChange={(e) => handleArrayChange('keyVocabulary', index, 'term', e.target.value)}
                    size="small"
                    fullWidth
                    margin="dense"
                    error={!!errors['keyVocabulary']?.[index]?.term}
                    helperText={errors['keyVocabulary']?.[index]?.term || ''}
                    disabled={isSaved}
                  />
                  
                  <TextField
                    label="Definition"
                    value={word.definition || ''}
                    onChange={(e) => handleArrayChange('keyVocabulary', index, 'definition', e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    error={!!errors['keyVocabulary']?.[index]?.definition}
                    helperText={errors['keyVocabulary']?.[index]?.definition || ''}
                    disabled={isSaved}
                  />
                  
                  <TextField
                    label="Example (Optional)"
                    value={word.example || ''}
                    onChange={(e) => handleArrayChange('keyVocabulary', index, 'example', e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    disabled={isSaved}
                  />
                </Box>
              ))}
              
              {!isSaved && (
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleAddItem('keyVocabulary', { term: '', definition: '', example: '' })}
                  sx={{ mt: 1 }}
                >
                  Add Term
                </Button>
              )}
            </Box>
          ) : (
            <Box component="ul" sx={{ pl: 3 }}>
              {editableData.keyVocabulary.length > 0 ? (
                editableData.keyVocabulary.map((word, idx) => (
                  <li key={idx} style={{ marginBottom: '1.5rem' }}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      <strong>{word.term || 'Untitled Term'}</strong>
                      {word.definition && `: ${word.definition}`}
                    </Typography>
                    {word.example && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                        <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>Example: </Box>
                        {word.example}
                      </Typography>
                    )}
                  </li>
                ))
              ) : (
                <Typography color="text.secondary">No vocabulary terms added yet</Typography>
              )}
            </Box>
          )}
        </EditableSection>



        <EditableSection
            title="Assessment"
            emoji="📝"
            isEditing={editingSection === 'assessment'}
            onEdit={!isSaved ? () => handleEdit('assessment') : undefined}
            onSave={() => handleSave('assessment')}
            onCancel={handleCancel}
          >
            {editingSection === 'assessment' ? (
              <Box>
              <TextField
                label="Assessment Description"
                value={editableData.assessment?.description || ''}
                onChange={(e) => {
                  handleChange('assessment', 'description', e.target.value);
                  if (errors['assessment']?.description) {
                    setErrors(prev => {
                      const newAssessmentErrors = { ...prev['assessment'] };
                      delete newAssessmentErrors.description;
                      return { ...prev, assessment: newAssessmentErrors };
                    });
                  }
                }}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                variant="outlined"
                placeholder="Enter assessment description"
                error={!!errors['assessment']?.description}
                helperText={errors['assessment']?.description || ''}
                disabled={isSaved}
              />
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Success Criteria</Typography>
              {editableData.assessment?.successCriteria?.map((criterion, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    value={criterion}
                    onChange={(e) => {
                      const newCriteria = [...editableData.assessment.successCriteria];
                      newCriteria[index] = e.target.value;
                      handleChange('assessment', 'successCriteria', newCriteria);
                      if (errors['assessment']?.successCriteria?.[index]) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          const newSuccessCriteriaErrors = [...newErrors['assessment'].successCriteria];
                          newSuccessCriteriaErrors[index] = undefined;
                          if (newSuccessCriteriaErrors.every(e => !e)) {
                            delete newErrors['assessment'].successCriteria;
                          }
                          return { ...prev, assessment: { ...prev['assessment'], successCriteria: newSuccessCriteriaErrors } };
                        });
                      }
                    }}
                    fullWidth
                    multiline
                    margin="dense"
                    error={!!errors['assessment']?.successCriteria?.[index]}
                    helperText={errors['assessment']?.successCriteria?.[index] || ''}
                  />
                  <IconButton onClick={() => {
                    const newCriteria = [...editableData.assessment.successCriteria];
                    newCriteria.splice(index, 1);
                    handleChange('assessment', 'successCriteria', newCriteria);
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              {!isSaved && (
                <Button 
                  onClick={() => {
                    const newCriteria = [...(editableData.assessment?.successCriteria || []), ''];
                    handleChange('assessment', 'successCriteria', newCriteria);
                  }}
                >
                  Add Criterion
                </Button>
              )}
            </Box>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {editableData.assessment?.description || 'No assessment description provided'}
                </Typography>
                {editableData.assessment?.successCriteria?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Success Criteria:</Typography>
                    <Box component="ul" sx={{ pl: 3, m: 0, listStyle: 'disc' }}>
                      {editableData.assessment.successCriteria.map((criteria, index) => (
                        <Box component="li" key={index} sx={{ mb: 0.5 }}>
                          <Typography variant="body2">{criteria}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </EditableSection>

        <EditableSection
            title="Differentiation"
            emoji="♿"
            isEditing={editingSection === 'differentiation'}
            onEdit={!isSaved ? () => handleEdit('differentiation') : undefined}
            onSave={() => handleSave('differentiation')}
            onCancel={handleCancel}
          >
            {editingSection === 'differentiation' ? (
              <Box>
                <TextField
                  label="Support Strategies"
                  value={editableData.differentiation?.support || ''}
                  onChange={(e) => {
                    handleChange('differentiation', 'support', e.target.value);
                    if (errors['differentiation']?.support) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors['differentiation'];
                        return newErrors;
                      });
                    }
                  }}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  variant="outlined"
                  placeholder="e.g., Provide sentence starters..."
                  error={!!errors['differentiation']?.support}
                  helperText={errors['differentiation']?.support || ''}
                />
              </Box>
            ) : (
              <Box>
                <Typography variant="body1">
                  {editableData.differentiation?.support || 'No support strategies defined'}
                </Typography>
              </Box>
            )}
          </EditableSection>

        <EditableSection
          title="Introduction"
          emoji="🚀"
          isEditing={editingSection === 'lessonFlow_introduction'}
          onEdit={!isSaved ? () => handleEdit('lessonFlow_introduction') : undefined}
          onSave={() => handleSave('lessonFlow_introduction')}
          onCancel={handleCancel}
        >
          {editingSection === 'lessonFlow_introduction' ? (
            <Box>
              <TextField
                label="Hook Activity"
                fullWidth
                multiline
                rows={3}
                value={editableData.lessonFlow?.introduction?.hookActivity || ''}
                onChange={(e) => handleIntroductionChange('hookActivity', e.target.value)}
                variant="outlined"
                margin="dense"
                error={!!errors['lessonFlow_introduction']?.hookActivity}
                helperText={errors['lessonFlow_introduction']?.hookActivity || ''}
                disabled={isSaved}
              />
              <TextField
                label="Prior Knowledge Connection"
                fullWidth
                multiline
                rows={3}
                value={editableData.lessonFlow?.introduction?.priorKnowledgeConnection || ''}
                onChange={(e) => handleIntroductionChange('priorKnowledgeConnection', e.target.value)}
                variant="outlined"
                margin="dense"
                error={!!errors['lessonFlow_introduction']?.priorKnowledgeConnection}
                helperText={errors['lessonFlow_introduction']?.priorKnowledgeConnection || ''}
                disabled={isSaved}
              />
              <TextField
                label="Duration (minutes)"
                type="number"
                fullWidth
                value={editableData.lessonFlow?.introduction?.duration ?? ''}
                onChange={(e) => handleIntroductionChange('duration', e.target.value)}
                variant="outlined"
                margin="dense"
                error={!!errors['lessonFlow_introduction']?.duration}
                helperText={errors['lessonFlow_introduction']?.duration || ''}
                disabled={isSaved}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Hook:</strong> {editableData.lessonFlow?.introduction?.hookActivity}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Prior Knowledge:</strong> {editableData.lessonFlow?.introduction?.priorKnowledgeConnection}</Typography>
              <Typography variant="body1"><strong>Duration:</strong> {editableData.lessonFlow?.introduction?.duration ? `${String(editableData.lessonFlow.introduction.duration).replace(/\D/g, '')} minutes` : 'Not specified'}</Typography>
            </Box>
          )}
        </EditableSection>

        <EditableSection
  title="Activities"
  emoji="🧩"
  isEditing={editingSection === 'lessonFlow_activities'}
  onEdit={!isSaved ? () => handleEdit('lessonFlow_activities') : undefined}
  onSave={() => handleSave('lessonFlow_activities')}
  onCancel={handleCancel}
>
  {editingSection === 'lessonFlow_activities' ? (
    <Box>
      {editableData.lessonFlow?.activities?.map((act, index) => (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Activity {index + 1}</Typography>
            {!isSaved && (
              <Tooltip title="Delete activity">
                <IconButton onClick={() => handleRemoveActivity(index)} color="error" sx={{ position: 'absolute', top: 8, right: 8 }} size="small">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <TextField
            label="Activity Title"
            value={act.title || ''}
            onChange={(e) => handleActivityFieldChange(index, 'title', e.target.value)}
            fullWidth
            margin="dense"
            error={!!errors['lessonFlow_activities']?.[index]?.title}
            helperText={errors['lessonFlow_activities']?.[index]?.title || ''}
            disabled={isSaved}
          />
          
          <TextField
            label="Duration (minutes)"
            type="number"
            value={act.duration || ''}
            onChange={(e) => handleActivityFieldChange(index, 'duration', e.target.value)}
            fullWidth
            margin="dense"
            error={!!errors['lessonFlow_activities']?.[index]?.duration}
            helperText={errors['lessonFlow_activities']?.[index]?.duration || ''}
            disabled={isSaved}
          />
          
          <TextField
            label="Grouping (Individual/Pairs/Group)"
            value={act.grouping || ''}
            onChange={(e) => handleActivityFieldChange(index, 'grouping', e.target.value)}
            fullWidth
            margin="dense"
            error={!!errors['lessonFlow_activities']?.[index]?.grouping}
            helperText={errors['lessonFlow_activities']?.[index]?.grouping || ''}
            disabled={isSaved}
          />
          
          <TextField
            label="Materials (comma separated)"
            value={Array.isArray(act.materials) ? act.materials.join(', ') : (act.materials || '')}
            onChange={(e) => handleActivityFieldChange(index, 'materials', e.target.value.split(',').map(m => m.trim()))}
            fullWidth
            margin="dense"
            error={!!errors['lessonFlow_activities']?.[index]?.materials}
            helperText={errors['lessonFlow_activities']?.[index]?.materials || ''}
            disabled={isSaved}
          />
          
          <TextField
            label="Objective"
            value={act.objective || ''}
            onChange={(e) => handleActivityFieldChange(index, 'objective', e.target.value)}
            fullWidth
            margin="dense"
            error={!!errors['lessonFlow_activities']?.[index]?.objective}
            helperText={errors['lessonFlow_activities']?.[index]?.objective || ''}
            disabled={isSaved}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
            <Typography variant="subtitle2">Steps:</Typography>
            {!isSaved && (
              <Button 
                onClick={() => handleAddActivityStep(index)} 
                size="small" 
                startIcon={<AddIcon />}
                sx={{ ml: 2 }}
              >
                Add Step
              </Button>
            )}
          </Box>
          {act.steps?.map((step, stepIndex) => (
            <Box key={stepIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                value={step}
                onChange={(e) => handleActivityStepChange(index, stepIndex, e.target.value)}
                fullWidth
                margin="dense"
                error={!!errors['lessonFlow_activities']?.[index]?.steps?.[stepIndex]}
                helperText={errors['lessonFlow_activities']?.[index]?.steps?.[stepIndex] || ''}
                disabled={isSaved}
              />
              {!isSaved && (
                <Tooltip title="Delete step">
                  <IconButton onClick={() => handleRemoveActivityStep(index, stepIndex)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
          
          <TextField
            label="Teacher Notes"
            value={act.teacherNotes || ''}
            onChange={(e) => handleActivityFieldChange(index, 'teacherNotes', e.target.value)}
            fullWidth
            multiline
            rows={2}
            margin="dense"
            error={!!errors['lessonFlow_activities']?.[index]?.teacherNotes}
            helperText={errors['lessonFlow_activities']?.[index]?.teacherNotes || ''}
            disabled={isSaved}
          />
        </Box>
      ))}
      {!isSaved && (
        <Button onClick={handleAddActivity} startIcon={<AddIcon />} variant="outlined" sx={{ mt: 2 }}>
          Add Activity
        </Button>
      )}
    </Box>
  ) : (
    <Box>
      {editableData.lessonFlow?.activities?.map((act, index) => (
        <Box key={index} sx={{ mb: 3, pl: 2, borderLeft: '4px solid #eee', backgroundColor: '#fafafa', borderRadius: 1, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
            {act.title || `Activity ${index + 1}`}
          </Typography>

          {act.duration && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>Duration:</strong> {String(act.duration).replace(' minutes', '')} minutes
            </Typography>
          )}

          {act.grouping && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>Grouping:</strong> {act.grouping}
            </Typography>
          )}

          {act.materials && Array.isArray(act.materials) && act.materials.length > 0 && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Materials:</strong> {act.materials.join(', ')}
            </Typography>
          )}

          {act.objective && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Objective:</strong> {act.objective}
            </Typography>
          )}

          {act.steps && Array.isArray(act.steps) && act.steps.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Steps:
              </Typography>
              <Box component="ol" sx={{ 
                pl: 2.5, 
                mt: 0.5,
                '& li': {
                  '&::marker': {
                    fontSize: '0.9rem',
                    color: 'text.secondary',
                    fontWeight: 600
                  },
                  paddingLeft: '0.5rem',
                  marginBottom: '4px',
                  '& > *': {
                    display: 'inline',
                    verticalAlign: 'top'
                  }
                }
              }}>
                {act.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>
                    <Typography variant="body2" component="span">{step}</Typography>
                  </li>
                ))}
              </Box>
            </Box>
          )}

          {act.teacherNotes && act.teacherNotes.trim() !== '' && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                fontStyle: 'italic',
                backgroundColor: '#fff3cd',
                p: 1.5,
                borderRadius: 1,
                border: '1px solid #ffeaa7'
              }}
            >
              <strong>📝 Teacher Notes:</strong> {act.teacherNotes}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  )}
</EditableSection>



        <EditableSection
          title="Real World Examples"
          emoji="🌍"
          isEditing={editingSection === 'realWorldExamples'}
          onEdit={!isSaved ? () => handleEdit('realWorldExamples') : undefined}
          onSave={() => handleSave('realWorldExamples')}
          onCancel={handleCancel}
        >
          {editingSection === 'realWorldExamples' ? (
            <Box>
              {editableData.realWorldExamples?.map((example, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">Example {index + 1}</Typography>
                    {!isSaved && (
                      <IconButton onClick={() => handleRemoveItem('realWorldExamples', index)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <TextField
                    label="Example"
                    value={example.example || ''}
                    onChange={(e) => handleArrayChange('realWorldExamples', index, 'example', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    error={!!errors['realWorldExamples']?.[index]?.example}
                    helperText={errors['realWorldExamples']?.[index]?.example || ''}
                    disabled={isSaved}
                  />
                  <TextField
                    label="Explanation"
                    value={example.explanation || ''}
                    onChange={(e) => handleArrayChange('realWorldExamples', index, 'explanation', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    error={!!errors['realWorldExamples']?.[index]?.explanation}
                    helperText={errors['realWorldExamples']?.[index]?.explanation || ''}
                    disabled={isSaved}
                  />
                </Box>
              ))}
              {!isSaved && (
                <Button 
                  onClick={() => handleAddItem('realWorldExamples', { example: '', explanation: '' })} 
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                >
                  Add Example
                </Button>
              )}
            </Box>
          ) : (
            <Box component="ul" sx={{ pl: 3, listStyle: 'none' }}>
              {editableData.realWorldExamples?.map((example, idx) => (
                <Box 
                  key={idx} 
                  component="li" 
                  sx={{ 
                    mb: 2.5,
                    p: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)', 
                    borderRadius: 2,
                    borderLeft: '3px solid',
                    borderColor: 'success.light'
                  }}
                >
                  <Typography variant="body1" sx={{ 
                    fontSize: '1.05rem', 
                    lineHeight: 1.6, 
                    mb: 1,
                    fontWeight: 500
                  }}>
                    {example.example}
                  </Typography>
                  {example.explanation && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        color: 'text.secondary',
                        pl: 1.5,
                        borderLeft: '2px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {example.explanation}
                    </Typography>
                  )}
                </Box>
              )) || <Typography color="text.secondary">No real world examples added yet</Typography>}
            </Box>
          )}
        </EditableSection>

        <EditableSection
          title="Discussion Questions"
          emoji="💬"
          isEditing={editingSection === 'discussionQuestions'}
          onEdit={!isSaved ? () => handleEdit('discussionQuestions') : undefined}
          onSave={() => handleSave('discussionQuestions')}
          onCancel={handleCancel}
        >
          {editingSection === 'discussionQuestions' ? (
            <Box>
              {editableData.discussionQuestions?.map((q, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">Question {index + 1}</Typography>
                    {!isSaved && <IconButton onClick={() => handleRemoveItem('discussionQuestions', index)}><DeleteIcon /></IconButton>}
                  </Box>
                  <TextField
                    label="Question"
                    value={q.question || ''}
                    onChange={(e) => handleArrayChange('discussionQuestions', index, 'question', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    error={!!errors['discussionQuestions']?.[index]?.question}
                    helperText={errors['discussionQuestions']?.[index]?.question || ''}
                    disabled={isSaved}
                  />
                  <TextField
                    label="Purpose"
                    value={q.purpose || ''}
                    onChange={(e) => handleArrayChange('discussionQuestions', index, 'purpose', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    error={!!errors['discussionQuestions']?.[index]?.purpose}
                    helperText={errors['discussionQuestions']?.[index]?.purpose || ''}
                    disabled={isSaved}
                  />
                </Box>
              ))}
              {!isSaved && (
                <Button onClick={() => handleAddItem('discussionQuestions', { question: '', purpose: '' })}>Add Question</Button>
              )}
            </Box>
          ) : (
            <Box component="ul" sx={{ pl: 3, listStyle: 'none' }}>
              {editableData.discussionQuestions?.map((q, idx) => (
                <Box 
                  key={idx} 
                  component="li" 
                  sx={{ 
                    mb: 2.5,
                    p: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 2,
                    borderLeft: '3px solid',
                    borderColor: 'primary.light'
                  }}
                >
                  <Typography variant="body1" sx={{ 
                    fontSize: '1.05rem', 
                    lineHeight: 1.6, 
                    mb: 1,
                    fontWeight: 500
                  }}>
                    {q.question}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      pl: 1.5,
                      borderLeft: '2px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {q.purpose}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </EditableSection>

         



        <EditableSection
          title="Current Affairs"
          emoji="📰"
          isEditing={editingSection === 'currentAffairs'}
          onEdit={!isSaved ? () => handleEdit('currentAffairs') : undefined}
          onSave={() => handleSave('currentAffairs')}
          onCancel={handleCancel}
        >
          {editingSection === 'currentAffairs' ? (
            <Box>
              {editableData.currentAffairs?.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <TextField
                    label="Title"
                    value={item.title || ''}
                    onChange={(e) => handleArrayChange('currentAffairs', index, 'title', e.target.value)}
                    fullWidth
                    margin="dense"
                    error={!!errors['currentAffairs']?.[index]?.title}
                    helperText={errors['currentAffairs']?.[index]?.title || ''}
                  />
                  <TextField
                    label="URL"
                    value={item.url || ''}
                    onChange={(e) => handleArrayChange('currentAffairs', index, 'url', e.target.value)}
                    fullWidth
                    margin="dense"
                    error={!!errors['currentAffairs']?.[index]?.url}
                    helperText={errors['currentAffairs']?.[index]?.url || ''}
                  />
                  <TextField
                    label="Snippet"
                    value={item.snippet || ''}
                    onChange={(e) => handleArrayChange('currentAffairs', index, 'snippet', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                  />
                  <TextField
                    label="Date"
                    value={item.date || ''}
                    onChange={(e) => handleArrayChange('currentAffairs', index, 'date', e.target.value)}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Summary"
                    value={item.summary || ''}
                    onChange={(e) => handleArrayChange('currentAffairs', index, 'summary', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    placeholder="Add a 2-3 line summary explaining the relevance to the lesson"
                  />
                  <IconButton onClick={() => handleRemoveItem('currentAffairs', index)}><DeleteIcon /></IconButton>
                </Box>
              ))}
              <Button onClick={() => handleAddItem('currentAffairs', { title: '', url: '', snippet: '', date: '', summary: '' })}>Add Current Affair</Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {editableData.currentAffairs?.map((item) => (
                <Grid  key={item.url}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                    <Link href={item.url} target="_blank" rel="noopener noreferrer" underline="hover">
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    </Link>
                    <Typography variant="body2" sx={{ mt: 1 }}>{item.snippet}</Typography>
                    {item.summary && (
                      <Box sx={{ 
                        mt: 1, 
                        p: 1.5, 
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 1,
                        borderLeft: '3px solid',
                        borderColor: 'primary.light'
                      }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{item.summary}</Typography>
                      </Box>
                    )}
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>{item.date}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </EditableSection>

        <EditableSection
          title="Educational Videos"
          emoji="🎬"
          isEditing={editingSection === 'educationalVideos'}
          onEdit={!isSaved ? () => handleEdit('educationalVideos') : undefined}
          onSave={() => handleSave('educationalVideos')}
          onCancel={handleCancel}
        >
          <Box sx={{ width: '100%' }}>
            {editableData.educationalVideos?.length > 0 ? (
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '100%',
                maxWidth: '1000px',
                mx: 'auto',
                px: 2
              }}>
                {editableData.educationalVideos.map((video, index) => (
                  <Box 
                    key={video.url ? `${video.url}-${index}` : index}
                    sx={{
                      mb: 4,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'center', sm: 'flex-start' },
                      gap: 4,
                      border: 'none',
                      p: { xs: 1, sm: 3 },
                      borderRadius: 3,
                      boxShadow: 4,
                      background: '#fff',
                      transition: 'box-shadow 0.2s',
                      width: '100%',
                      minHeight: 215,
                      '&:hover': {
                        boxShadow: 8,
                        background: '#f4f7fd',
                      },
                    }}
                  >
                    <Box sx={{ 
                      flexShrink: 0, 
                      width: { xs: '100%', sm: 380 },
                      height: { xs: 260, sm: 215 },
                      position: 'relative',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: 3,
                      background: '#f9f9fb',
                      '&:hover': {
                        '& .play-button': {
                          transform: 'translate(-50%, -50%) scale(1.15)'
                        }
                      }
                    }}>
                      <CardMedia
                        component="img"
                        image={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '215px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease'
                         
                        }}
                        onClick={() => handleVideoClick(video)}
                      />
                      {selectedVideo?.url === video.url && (
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 2,
                          zIndex: 2
                        }}>
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              closeVideo(e);
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: 'white',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                              }
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                          <Box sx={{
                            width: '100%',
                            maxWidth: '800px',
                            aspectRatio: '16/9',
                            position: 'relative'
                          }}>
                            {video.url.includes('youtube.com') || video.url.includes('youtu.be') ? (
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <video 
                                controls 
                                autoPlay 
                                style={{ width: '100%', height: '100%' }}
                              >
                                <source src={video.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </Box>
                          <Typography variant="h6" color="white" sx={{ mt: 2, textAlign: 'center' }}>
                            {video.title}
                          </Typography>
                        </Box>
                      )}              </Box>
                    <Box sx={{ 
                      flex: 1, 
                      minWidth: 0,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%',
                      pl: { sm: 2 },
                    }}>
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <Typography 
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: 'primary.main',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.3
                          }}
                        >
                          {video.title}
                        </Typography>
                      </a>
                      <Typography 
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        Source: {video.source || 'Unknown source'}
                      </Typography>
                    </Box>
                    {editingSection === 'educationalVideos' && !isSaved && (
                      <Box>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem('educationalVideos', index);
                          }}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.light',
                              color: 'error.contrastText'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mb: 2 }}>
                  No educational videos found
                </Typography>
                {editingSection === 'educationalVideos' && !isSaved && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      const newVideo = {
                        title: 'New Video',
                        url: '',
                        thumbnail: '',
                        video_id: ''
                      };
                      handleAddItem('educationalVideos', newVideo);
                    }}
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                      py: 1
                    }}
                  >
                    Add Video
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </EditableSection>
        {images.filter(img => img.url && !failedImages.has(img.url)).length > 0 && (
  <Box className="section-block" sx={{ mb: 4 }}>
    <Typography variant="h5" sx={{ 
      fontWeight: 600, 
      mb: 3, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      color: 'black',
      '& span': {
        fontSize: '1.5rem',
        lineHeight: 1
      }
    }}>
      <span>🖼️</span>
      Visual Aids
    </Typography>
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
      gap: '24px',
      width: '100%',
      '& > *': {
        width: '100% !important',
        maxWidth: '100% !important',
        margin: '0 !important'
      }
    }}>
      {images
        .filter(img => img.url && !failedImages.has(img.url))
        .slice(0, 6)
        .map((img, index) => (
          <Box key={img.id || index} sx={{
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            },
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <a 
              href={img.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                display: 'block',
                width: '100%',
                height: '280px',
                cursor: 'pointer'
              }}
            >
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
                '&:hover': {
                  opacity: 0.9
                }
              }}>
                <img
                  src={img.url}
                  alt={img.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    padding: '8px',
                    pointerEvents: 'none'
                  }}
                  onError={(e) => {
                    setFailedImages(prev => new Set(prev).add(img.url));
                  }}
                />
              </Box>
            </a>
            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}>
              <Typography 
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                  minHeight: '2.6em',
                  color: 'text.primary'
                }}
              >
                {img.title || 'Untitled Image'}
              </Typography>
              {img.source && (
                <Typography 
                  variant="caption" 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    mt: 0.5
                  }}
                >
                  <span style={{ opacity: 0.7 }}>Source:</span>
                  <Box component="span" sx={{ 
                    fontWeight: 500,
                    color: 'primary.main',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}>
                    {img.source}
                  </Box>
                </Typography>
              )}
            </Box>
          </Box>
      ))}
    </Box>
  </Box>
)}

<EditableSection
  title="Educational Documents"
  emoji="📚"
  isEditing={editingSection === 'resources'}
  onEdit={!isSaved ? () => handleEdit('resources') : undefined}
  onSave={() => handleSave('resources')}
  onCancel={handleCancel}
>
  {editingSection === 'resources' ? (
    <Box>
      {(editableData.resources || []).map((res, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Resource {index + 1}</Typography>
            {!isSaved && (
              <IconButton onClick={() => handleRemoveItem('resources', index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
          <TextField
            label="Title"
            value={res.title || ''}
            onChange={(e) => handleArrayChange('resources', index, 'title', e.target.value)}
            fullWidth
            margin="dense"
            error={!!errors['resources']?.[index]?.title}
            helperText={errors['resources']?.[index]?.title || ''}
            disabled={isSaved}
          />
          <TextField
            label="URL"
            value={res.url || ''}
            onChange={(e) => handleArrayChange('resources', index, 'url', e.target.value)}
            fullWidth
            margin="dense"
            error={!!errors['resources']?.[index]?.url}
            helperText={errors['resources']?.[index]?.url || ''}
            disabled={isSaved}
          />
          <TextField
            label="Type"
            value={res.type || ''}
            onChange={(e) => handleArrayChange('resources', index, 'type', e.target.value)}
            fullWidth
            margin="dense"
            disabled={isSaved}
          />
          <TextField
            label="Description"
            value={res.description || ''}
            onChange={(e) => handleArrayChange('resources', index, 'description', e.target.value)}
            fullWidth
            multiline
            rows={2}
            margin="dense"
            disabled={isSaved}
          />
        </Box>
      ))}
      {!isSaved && (
        <Button
          variant="outlined"
          onClick={() =>
            handleAddItem('resources', { title: '', url: '', type: '', description: '' })
          }
        >
          Add Resource
        </Button>
      )}
    </Box>
  ) : (
    <Box>
      {(resourcesState?.length > 0 || editableData.resources?.length > 0) ? (
        <Grid container spacing={3}>
          {(resourcesState?.length > 0 ? resourcesState : editableData.resources || []).map((resource, index) => (
            <Grid key={index}>
              <Box
                component="a"
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                    borderColor: 'primary.light'
                  }
                }}
              >
                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    {resource.is_pdf ? (
                      <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
                    ) : (
                      <LinkIcon color="primary" sx={{ mr: 1 }} />
                    )}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: resource.is_pdf ? '#d32f2f' : 'primary.main',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        backgroundColor: resource.is_pdf ? 'rgba(211, 47, 47, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                        px: 1,
                        py: 0.3,
                        borderRadius: 1
                      }}
                    >
                      {resource.is_pdf ? 'PDF Document' : 'Online Resource'}
                    </Typography>
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {resource.title || 'Untitled Resource'}
                  </Typography>

                  {resource.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.875rem',
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {resource.description}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      mt: 'auto',
                      pt: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      fontSize: '0.75rem',
                      color: 'text.secondary'
                    }}
                  >
                    <span>{resource.source || 'Source'}</span>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        color: 'text.secondary',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.06)'
                        }
                      }}
                    >
                      View Document
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          No resources found
        </Typography>
      )}
    </Box>
  )}
</EditableSection>
      
        <Divider sx={{ mt: 6, mb: 4 }} />
        <Typography 
          variant="body2" 
          align="center" 
          display="block" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.95rem',
            letterSpacing: '0.5px'
          }}
        >
          
        </Typography>
      </Paper>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
        {!isSaved && (
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => handleSaveAll('bottom')} 
            startIcon={<SaveIcon />}
          >
            Save Lesson Plan
          </Button>
        )}
        {bottomNotification.open && (
          <Typography 
            color={bottomNotification.severity === 'success' ? 'success.main' : 'error.main'} 
            sx={{ mt: 2, fontWeight: 500 }}
          >
            {bottomNotification.message}
          </Typography>
        )}
     <Dialog
  open={successDialogOpen}
  onClose={() => setSuccessDialogOpen(false)}
  PaperProps={{ sx: { borderRadius: 3, px: 3, py: 2, textAlign: 'center' } }}
>
  <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
    ✅ Lesson Plan Saved
  </DialogTitle>
  <DialogActions sx={{ justifyContent: 'center' }}>
    <Button variant="contained" onClick={() => setSuccessDialogOpen(false)}>
      OK
    </Button>
  </DialogActions>
</Dialog>


      </Box>
    </Container>
    </div>
     </div>
      </div>
  );
}
export default SessionPlanOutput;
