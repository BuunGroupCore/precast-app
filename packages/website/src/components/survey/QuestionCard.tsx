import { motion } from "framer-motion";
import React from "react";
import { FaCheckCircle, FaArrowLeft, FaArrowRight, FaMagic } from "react-icons/fa";

import type { SurveyQuestion } from "./surveyQuestions";

interface QuestionCardProps {
  question: SurveyQuestion;
  currentStep: number;
  totalSteps: number;
  answers: Record<string, string | string[]>;
  onAnswer: (value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function QuestionCard({
  question,
  currentStep,
  totalSteps,
  answers,
  onAnswer,
  onNext,
  onPrev,
}: QuestionCardProps) {
  const isAnswered = () => {
    const answer = answers[question.id];
    if (question.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const toggleMultipleChoice = (value: string) => {
    const current = (answers[question.id] as string[]) || [];
    const maxSelections = question.id === "priorities" ? 3 : undefined;

    if (current.includes(value)) {
      onAnswer(current.filter((v) => v !== value));
    } else if (!maxSelections || current.length < maxSelections) {
      onAnswer([...current, value]);
    }
  };

  return (
    <motion.div
      key={currentStep}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-comic-white rounded-2xl border-4 border-comic-black comic-shadow p-8">
        <h2 className="text-2xl md:text-3xl font-display text-comic-black mb-2">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-comic-black/60 font-comic mb-6">{question.subtitle}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => {
            const isSelected =
              question.type === "multiple"
                ? (answers[question.id] as string[])?.includes(option.value)
                : answers[question.id] === option.value;

            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (question.type === "multiple") {
                    toggleMultipleChoice(option.value);
                  } else {
                    onAnswer(option.value);
                  }
                }}
                className={`p-4 rounded-xl border-3 border-comic-black transition-all ${
                  isSelected
                    ? "bg-comic-green text-comic-black comic-shadow"
                    : "bg-comic-white hover:bg-comic-yellow/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {option.icon && (
                    <div className="text-2xl">{React.createElement(option.icon)}</div>
                  )}
                  <div className="text-left flex-1">
                    <div className="font-bold font-comic">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-comic-black/60 mt-1">{option.description}</div>
                    )}
                  </div>
                  {isSelected && <FaCheckCircle className="text-comic-black text-xl" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg border-3 border-comic-black font-comic font-bold transition-all flex items-center gap-2 ${
              currentStep === 0
                ? "bg-comic-gray text-comic-black/30 cursor-not-allowed"
                : "bg-comic-white hover:bg-comic-yellow comic-shadow-sm"
            }`}
          >
            <FaArrowLeft /> Previous
          </button>

          <button
            onClick={onNext}
            disabled={!isAnswered()}
            className={`px-6 py-3 rounded-lg border-3 border-comic-black font-comic font-bold transition-all flex items-center gap-2 ${
              !isAnswered()
                ? "bg-comic-gray text-comic-black/30 cursor-not-allowed"
                : "bg-comic-blue text-comic-white hover:bg-comic-dark-blue comic-shadow"
            }`}
          >
            {currentStep === totalSteps - 1 ? (
              <>
                Generate Stack <FaMagic />
              </>
            ) : (
              <>
                Next <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
