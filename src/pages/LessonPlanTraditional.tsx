import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Save, Edit } from 'lucide-react';
import Header from '@/components/Header';

const LessonPlanTraditional = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const lessonData = location.state?.lessonData || {
    grade: '8',
    subject: 'Science',
    lessonName: 'Understanding Climate Change'
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={() => navigate('/lesson-plan-options', { state: { lessonData } })}
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Format Options
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Traditional Lesson Plan Format */}
        <Card className="max-w-5xl mx-auto bg-card border-border shadow-lg print:shadow-none print:border-none">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="text-primary-foreground font-bold text-xl">EXCEL</div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">Excel Public School, Mysuru</h1>
                    <h2 className="text-xl font-semibold text-primary tracking-wide">UNIT PLAN</h2>
                  </div>
                </div>
                <div className="text-right text-muted-foreground">
                  <div className="text-sm">Academic Year</div>
                  <div className="font-semibold">2024-25</div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="p-8 bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Class & Section</span>
                    <span className="text-lg font-semibold text-foreground">{lessonData.grade} A & B</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Subject</span>
                    <span className="text-lg font-semibold text-foreground">{lessonData.subject}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Topic</span>
                    <span className="text-lg font-semibold text-foreground">Unit 8 – {lessonData.lessonName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Teacher's Name</span>
                    <span className="text-lg font-semibold text-foreground">Dr. Sriman S Kamath</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Planned Date</span>
                    <span className="text-lg font-semibold text-foreground">28/05/2025</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Execution Period</span>
                    <span className="text-lg font-semibold text-foreground">03/06/2025 to 31/07/2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Objectives */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Core Objectives</h3>
                <p className="text-muted-foreground text-sm">Reference to daily life, long lasting values, and skills</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        <span className="font-semibold text-primary">The CARBON</span> - which forms the basic element in organic chemistry by its roots is linked to every living organism on earth. There cannot be a better objective to know about this chapter as this let us know better about ourselves. In a way, this is our routes to the root. The chapter can be started with this basic question of how did life come into existence?
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Value</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        As a teacher, I believe on the fact that <span className="font-semibold text-primary">"in the permanent customer of only mother nature and nothing else"</span> and considering the fact that it is the time when our children are becoming the structure of organic compounds, its properties and its availability in the natural forms.
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Value</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        <span className="font-semibold text-primary">To apply the knowledge obtained in selecting different substances around us for daily usage</span> as per one's body nature (For instance one can find and use a natural compound containing milk acid by knowing its properties instead of artificial substances.)
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Skill</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">4</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        To understand the give and take nature of electrons (nucleophile and electrophiles) and take lifetime values out of it that humility and forming a helping hand are the best ways of achieving great results in life.
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Value</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">5</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        <span className="font-semibold text-primary">To connect the sustainability of an intermediate (negatively charged carbon)</span> with real-world examples where stability is achieved through electron distribution and bonding patterns.
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Learning</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">6</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        <span className="font-semibold text-primary">To grasp hyperconjugation of the protons connected to the carbon bonding</span> towards the positive center and understand stability through electron delocalization.
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Learning</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">7</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        To understand the basics of forming life which is so important. For instance in life majority of the things we find are symmetry. Thinking beyond symmetry and understanding life is high relative to optical carbons of optical isomerism which can be taken as an activity.
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Skill</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">8</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        <span className="font-semibold text-primary">The word "WATER" is called in different ways in a country like India (when we think globally we will have many more words)</span>. IUPAC rules of nomenclature becomes an important here as we need a streamlined names for particular molecules or structures which is uniform in all parts of the globe.
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Skill</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Learning Outcomes */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Expected Learning Outcomes</h3>
                <p className="text-muted-foreground text-sm">Please refer to the LO mentioned in the Curriculum document</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <p className="font-semibold text-foreground mb-4">Students should be able to:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">interpret the structure of molecules in different ways</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">classify and give the nomenclature of organic compounds in trivial and IUPAC system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">explain about different types of isomerism exhibited by organic compounds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">bring out the effect of electronic displacements on structure and reactivity of organic compounds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">understand the methods of purification of organic compounds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">explain in detail the qualitative and quantitative aspects of organic compounds</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Learning Progression */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Learning Progression</h3>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Write IUPAC of basic structures, its names and bond length diagram.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Name a structure or draw a structure with two functional groups.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Identify different isomers. Describe types of fission with examples, intermediates, electron movement.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">4</span>
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Write the resonance structures. Identify the types of reactions with examples.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">5</span>
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Analyze the influence of different substituents on each other with proper reasoning.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Assessment</h3>
                <p className="text-muted-foreground text-sm">Formative or Summative, with tools, techniques or test items, aligning well with the LO's mentioned above</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm"><span className="font-semibold text-primary">Stimulus:</span> A student observes that he gets the same result for LCMS analysis of two given compounds. But differs when he has NMR analysis.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm"><span className="font-semibold text-primary">STEM:</span> Why were the results same in LCMS and different in NMR?</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="p-4 border border-border rounded-lg">
                      <span className="font-semibold text-primary">1.</span> Which of the two: O₂NCH₂CH₂O⁻ or CH₃CH₂O⁻ is expected to be more stable and why?
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <span className="font-semibold text-primary">2.</span> Write the correct IUPAC name for the compound: (a) 2,2-Dimethylpentane or 2-Dimethylpentane (b) 2,4,6-Trimethyloctane or 2,5,7-Trimethyloctane (c) 2-Chloro-4-methylpentane or 4-Chloro-2-methylpentane or 2-methyl-4-chloropentane
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Assignments</h3>
                <p className="text-muted-foreground text-sm">During or/and after the completion of the Unit/Lesson</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <p className="text-sm text-foreground">List out the organic compounds around us and their chemical property with structure.</p>
              </div>
            </div>

            {/* Learning Experiences */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Learning Experiences</h3>
                <p className="text-muted-foreground text-sm">3E Model/Experiential Learning/Art-Sports Integrated/Inter-Cross Disciplinary etc. with clear mention of digital tools and resources used</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h5 className="font-semibold text-primary mb-3">5E Model - Tools used:</h5>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">Activity 1: Introduction of nomenclature with an activity of asking the word used for water.</p>
                    <p className="text-sm text-muted-foreground">Observe the difficulty and understand the requirement of uniformity in the names of chemical structure, Introduce the nomenclature then.</p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground">Activity 2: Placing carbon inside me and carbon around me</p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground">Activity 3: Resonance and reaction intermediates by storytelling</p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">Activity 4: Experience the following using ball and stick models.</p>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>1. Structures</li>
                      <li>2. Free rotation in alkanes</li>
                      <li>3. Restricted rotation in alkenes and alkynes</li>
                      <li>4. Structures of different functional groups like nitriles, carbonyl compounds.</li>
                    </ol>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground">Animated videos on purification techniques and understand the principle of it.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reflections */}
            <div className="p-8 bg-muted/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Reflections</h3>
                <p className="text-muted-foreground text-sm">Post completion of the Unit/Lesson, to help the Teacher plan for better and more effective transaction next time</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="h-32 bg-muted/30 rounded border-dashed border-2 border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Teacher's reflection notes...</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanTraditional;