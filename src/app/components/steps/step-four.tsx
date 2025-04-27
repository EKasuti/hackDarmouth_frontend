"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

type StepFourProps = {
  onComplete?: () => void
}
export default function StepFour({ onComplete }: StepFourProps) {
  const [tasks, setTasks] = useState([
    { id: 1, description: "Review all provided research papers and resources", completed: false },
    { id: 2, description: "Complete the quantum computing fundamentals course", completed: false },
    { id: 3, description: "Set up the development environment with Qiskit and climate data tools", completed: false },
    { id: 4, description: "Reproduce results from the Chen & Johnson paper", completed: false },
    { id: 5, description: "Schedule an introductory meeting with your research mentor", completed: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100
  const allDone = completedTasks === totalTasks

  useEffect(() => {
    if (allDone) onComplete?.()
  }, [allDone, onComplete])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Here are your first tasks</h2>
      <p className="text-slate-500">Complete these initial tasks to get started with the research project.</p>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-slate-700 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <p className="text-sm text-slate-500 text-center">
              {completedTasks} of {totalTasks} tasks completed
            </p>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor={`task-${task.id}`}
                      className={`text-base font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}
                    >
                      {task.description}
                    </Label>
                    {task.id === 1 && (
                      <p className="text-sm text-slate-500">Pay special attention to the methodology sections</p>
                    )}
                    {task.id === 3 && (
                      <p className="text-sm text-slate-500">Installation instructions are in the project wiki</p>
                    )}
                    {task.id === 5 && (
                      <p className="text-sm text-slate-500">Use the calendar link in your welcome email</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
