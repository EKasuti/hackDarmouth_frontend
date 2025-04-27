"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import StepOne from "@/app/components/steps/step-one"
import StepTwo from "@/app/components/steps/step-two"
import StepThree from "@/app/components/steps/step-three"
import StepFour from "@/app/components/steps/step-four"
import Link from "next/link"

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [tasksCompleted, setTasksCompleted] = useState(false)
  const totalSteps = 4

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne/>
      case 2:
        return <StepTwo />
      case 3:
        return <StepThree />
      case 4:
        return <StepFour onComplete={() => setTasksCompleted(true)} />
      default:
        return <StepOne />
    }
  }

  return (
    <Card className="w-full max-w-3xl shadow-md rounded-2xl overflow-hidden mx-auto">
      <div className="px-6 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-slate-500">
            {currentStep === 1
              ? "Project Overview"
              : currentStep === 2
                ? "Key Resources"
                : currentStep === 3
                  ? "Research Problem"
                  : "Initial Tasks"}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between p-6 pt-0">
        {currentStep === 1 ? (
            <Link href="/dashboard" passHref>
                <Button variant="outline" className="rounded-xl">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </Link>
        ) : (
            <Button
                variant="outline"
                onClick={goToPreviousStep}
                className="rounded-xl"
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        )}

        {currentStep === totalSteps ? (
          tasksCompleted ? (
            <Link href="/dashboard/projects" passHref>
              <Button className="rounded-xl">
                Go to Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="rounded-xl">
                Complete later <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )
        ) : (
          <Button onClick={goToNextStep} className="rounded-xl">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
