import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";

import {
  GeneratingAnimation,
  QuestionCard,
  SurveyResults,
  analyzeAnswers,
  surveyQuestions,
} from "@/components/survey";
import { ExtendedProjectConfig } from "@/components/builder";
import { trackBuilderAction } from "@/utils/analytics";

/**
 * Survey page that guides users through a questionnaire to recommend the perfect tech stack.
 * Collects information about experience level, project type, team size, and priorities.
 */
export function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendedStack, setRecommendedStack] = useState<ExtendedProjectConfig | null>(null);

  const currentQuestion = surveyQuestions[currentStep];
  const progress = ((currentStep + 1) / surveyQuestions.length) * 100;

  useEffect(() => {
    trackBuilderAction("survey_started");
  }, []);

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      trackBuilderAction("survey_question_answered");
    } else {
      generateRecommendation();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const generateRecommendation = () => {
    setIsGenerating(true);
    trackBuilderAction("survey_completed");

    // Simulate AI processing
    setTimeout(() => {
      const stack = analyzeAnswers(answers);
      setRecommendedStack(stack as ExtendedProjectConfig);
      setIsGenerating(false);
      setShowResults(true);
      trackBuilderAction("survey_recommendation_generated");
    }, 2000);
  };

  const handleStartOver = () => {
    setShowResults(false);
    setCurrentStep(0);
    setAnswers({});
    setRecommendedStack(null);
  };

  return (
    <div className="min-h-screen bg-comic-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <FaClipboardList className="text-5xl text-comic-purple" />
            <h1 className="text-4xl md:text-6xl font-display text-comic-black">Stack Survey</h1>
          </div>
          <p className="text-lg font-comic text-comic-black/80">
            Answer a few questions and we&apos;ll recommend the perfect stack for you!
          </p>
        </motion.div>

        {/* Progress Bar */}
        {!showResults && !isGenerating && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-comic-white/50 rounded-full h-4 border-2 border-comic-black overflow-hidden">
              <motion.div
                className="h-full bg-comic-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-center mt-2 font-comic text-comic-black">
              Question {currentStep + 1} of {surveyQuestions.length}
            </p>
          </div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!showResults && !isGenerating && (
            <QuestionCard
              question={currentQuestion}
              currentStep={currentStep}
              totalSteps={surveyQuestions.length}
              answers={answers}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {isGenerating && <GeneratingAnimation />}

          {showResults && recommendedStack && (
            <SurveyResults recommendedStack={recommendedStack} onStartOver={handleStartOver} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
