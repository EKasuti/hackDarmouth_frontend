import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StepOne() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Here&apos;s your project overview</h2>
      <p className="text-slate-500">
        Welcome to the research project. Below you&apos;ll find key information to get you started.
      </p>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Quantum Machine Learning for Climate Prediction</CardTitle>
          <CardDescription>Project ID: QML-2023-045</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-slate-500">Abstract</h3>
              <p className="mt-1">
                This research explores the application of quantum computing algorithms to enhance climate prediction
                models, potentially offering exponential speedups for complex atmospheric simulations.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-slate-500">Description</h3>
              <p className="mt-1">
                Climate prediction requires processing vast amounts of data and running complex simulations. Traditional
                computing approaches face limitations in computational power and efficiency. This project investigates
                how quantum algorithms can be applied to climate modeling to improve accuracy and reduce computational
                time, potentially leading to breakthroughs in our understanding of climate patterns and more effective
                climate change mitigation strategies.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h3 className="font-medium text-sm text-slate-500">Principal Investigator</h3>
                <p className="mt-1">Dr. Sarah Chen</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-slate-500">Timeline</h3>
                <p className="mt-1">Jan 2023 - Present</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
