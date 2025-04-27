import { Card, CardContent } from "@/components/ui/card"

export default function StepThree() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Here&apos;s the main problem we&apos;re solving</h2>
      <p className="text-slate-500">
        Understanding the research question and challenges is crucial for your contribution to the project.
      </p>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Research Question</h3>
              <p className="mt-2 text-slate-700">
                How can quantum computing algorithms be effectively applied to climate prediction models to improve
                accuracy and computational efficiency compared to classical approaches?
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Current Challenges</h3>
              <ul className="mt-2 space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                  </span>
                  <span>
                    <strong>Computational Complexity:</strong> Climate models involve processing petabytes of data and
                    solving complex differential equations that push the limits of classical computing.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                  </span>
                  <span>
                    <strong>Quantum-Classical Interface:</strong> Developing efficient methods to translate climate data
                    between classical and quantum systems.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                  </span>
                  <span>
                    <strong>Quantum Hardware Limitations:</strong> Current quantum computers have limited qubits and
                    high error rates, requiring novel approaches to work within these constraints.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                  </span>
                  <span>
                    <strong>Algorithm Development:</strong> Creating quantum algorithms specifically optimized for
                    climate prediction that can demonstrate quantum advantage.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Potential Impact</h3>
              <p className="mt-2 text-slate-700">
                Successfully addressing these challenges could revolutionize climate science by enabling more accurate
                predictions, faster simulations, and better understanding of complex climate phenomena. This could
                directly contribute to more effective climate change mitigation and adaptation strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
