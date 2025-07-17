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
        <Card className="max-w-4xl mx-auto bg-white border print:shadow-none print:border-none">
          <CardContent className="p-12">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-primary font-bold text-lg">EXCEL</div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Excel Public School, Mysuru</h1>
                  <h2 className="text-lg font-semibold text-primary">UNIT PLAN</h2>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="mb-3">
                  <span className="font-semibold">Class & Section:</span> {lessonData.grade} A & B
                </div>
                <div className="mb-3">
                  <span className="font-semibold">Topic:</span> Unit 8 – {lessonData.lessonName}
                </div>
                <div className="mb-3">
                  <span className="font-semibold">Teacher's Name:</span> Dr. Sriman S Kamath
                </div>
                <div className="mb-3">
                  <span className="font-semibold">Planned Date:</span> 28/05/2025
                </div>
                <div className="mb-3">
                  <span className="font-semibold">Execution Date:</span> 1 03/06/2025 to* 31/07/2025
                </div>
              </div>
            </div>

            {/* Core Objectives */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Core Objectives: (reference to daily life/long lasting values/skills)</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">1.</span> <span className="font-semibold">The CARBON</span> - which forms the basic element in organic chemistry by its roots is linked to every living organism on earth. There cannot be a better objective to know about this chapter as this let us know better about ourselves. In a way, this is our routes to the root. The chapter can be started with this basic question of how did life come into existence? (Value)
                </div>
                <div>
                  <span className="font-semibold">2.</span> As a teacher, I believe on the fact that <span className="font-semibold">"in the permanent customer of only mother nature and nothing else"</span> and considering the fact that it is the time when our children are becoming the structure of organic compounds, its properties and its availability in the natural forms. (Value)
                </div>
                <div>
                  <span className="font-semibold">3.</span> <span className="font-semibold">To apply the knowledge obtained in selecting different substances around us for daily usage</span> as per one's body nature (For instance one can find and use a natural compound containing milk acid by knowing its properties instead of artificial substances.) (Skill)
                </div>
                <div>
                  <span className="font-semibold">4.</span> To understand the give and take nature of electrons) nucleophile and electrophiles and take lifetime values out of it that humility and forming a helping hand are the best ways of achieving great results in life. (Value)
                </div>
                <div>
                  <span className="font-semibold">5.</span> <span className="font-semibold">To connect the sustainability of an intermediate (negatively charged carbon) with a manipurri seller</span> where just like his phones shifted on the plane with our mouths already filled, the carbon ion has extra elections and the three carbons are ready to shift them in it. (Learning)
                </div>
                <div>
                  <span className="font-semibold">6.</span> <span className="font-semibold">To grasp hyperconjugation of the protons connected to the carbon bonding towards the positive center (the the crowd the the bus again a the door to peep at the accident happened outside.</span> (Learning)
                </div>
                <div>
                  <span className="font-semibold">7.</span> To understand the basics of forming life which is so important. For instance in life majority of the things we find are symmetry. Thinking beyond symmetry and understanding life is high relative to optical carbons of optical isomerism which can be taken as an activity. (Skill)
                </div>
                <div>
                  <span className="font-semibold">8.</span> <span className="font-semibold">The word "WATER" is called in different ways in a country like India (when we think globally we will have many more words)</span>. IUPAC rules of nomenclature becomes an important here as we need a streamlined names for particular molecules or structures which is uniform in all parts of the globe. (Skill)
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-6">
              {/* Expected Learning Outcomes */}
              <div className="col-span-2">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Expected Learning Outcomes: (Please refer to the LO mentioned in the Curriculum document also)</h3>
                <p className="text-sm mb-3"><span className="font-semibold">Students should be able to:</span></p>
                
                <ul className="text-sm space-y-2 mb-6">
                  <li>• interpret the structure of molecules in different ways</li>
                  <li>• classify and give the nomenclature of organic compounds in trivial and IUPAC system</li>
                  <li>• explain about different types of isomerism exhibited by organic compounds</li>
                  <li>• bring out the effect of electronic displacements on structure and reactivity of organic compounds</li>
                  <li>• understand the methods of purification of organic compounds</li>
                  <li>• explain in detail the qualitative and quantitative aspects of organic compounds</li>
                </ul>

                <h4 className="font-semibold mb-3">Assessment: (Formative or Summative, with tools, techniques or test items, aligning well with the LO's mentioned above)</h4>
                
                <p className="text-sm mb-3"><span className="font-semibold">Stimulus:</span> A student observes that he gets the same result for LCMS analysis of two given compounds. But differs when he has NMR analysis.</p>
                
                <p className="text-sm mb-3"><span className="font-semibold">STEM:</span> Why were the results same in LCMS and different in NMR?</p>
                
                <div className="text-sm space-y-2 mb-6">
                  <p><span className="font-semibold">1.</span> Which of the two: O₂NCH₂CH₂O⁻ or CH₃CH₂O⁻ is expected to be more stable and why?</p>
                  <p><span className="font-semibold">2.</span> Write the correct IUPAC name for the compound: (a) 2,2-Dimethylpentane or 2-Dimethylpentane (b) 2,4,6-Trimethyloctane or 2,5,7-Trimethyloctane (c) 2-Chloro-4-methylpentane or 4-Chloro-2-methylpentane or 2-methyl-4-chloropentane</p>
                </div>

                <h4 className="font-semibold mb-3">Learning Experiences: (3 E Model/Experiential Learning/Art-Sports Integrated/Inter-Cross Disciplinary etc. with clear mention of digital tools and resources used)</h4>
                
                <h4 className="font-semibold mb-3">5E Model</h4>
                
                <h4 className="font-semibold mb-3">Tools used:</h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">• Activity 1: Introduction of nomenclature with an activity of asking the word used for water.</p>
                    <p className="text-sm">Observe the difficulty and understand the requirement of uniformity in the names of chemical structure, Introduce the nomenclature then.</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">• Activity 2: Placing carbon inside me and carbon around me</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">• Activity 3: Resonance and reaction intermediates by storytelling</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">• Activity 4: Experience the following using ball and stick models.</p>
                    <ol className="text-sm mt-2 space-y-1">
                      <li>1. Structures</li>
                      <li>2. Free rotation in alkanes</li>
                      <li>3. Restricted rotation in alkenes and alkynes</li>
                      <li>4. Structures of different functional groups like nitriles, carbonyl compounds.</li>
                    </ol>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">• Animated videos on purification techniques and understand the principle of it.</p>
                  </div>
                </div>
              </div>

              {/* Learning Progression */}
              <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Learning Progression:</h3>
                <div className="text-sm space-y-3">
                  <div>
                    <span className="font-semibold">Level 1.</span> Write IUPAC of basic structures, its names and bond length diagram.
                  </div>
                  <div>
                    <span className="font-semibold">Level 2.</span> Name a structure or draw a structure with two functional groups.
                  </div>
                  <div>
                    <span className="font-semibold">Level 3.</span> Identify different isomers. Describe types of fission with examples, intermediates, electron movement.
                  </div>
                  <div>
                    <span className="font-semibold">Level 4.</span> Write the resonance structures. Identify the types of reactions with examples.
                  </div>
                  <div>
                    <span className="font-semibold">Level 5.</span> Analyze the influence of different substituents on each other with proper reasoning.
                  </div>
                </div>
                
                <h4 className="font-semibold mt-6 mb-3 border-b pb-2">Assignments: (During or/and after the completion of the Unit/Lesson)</h4>
                <p className="text-sm">List out the organic compounds around us and their chemical property with structure.</p>
                
                <h4 className="font-semibold mt-6 mb-3 border-b pb-2">Reflections: (Post completion of the Unit/Lesson, to help the Teacher plan for better and more effective transaction next time)</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanTraditional;