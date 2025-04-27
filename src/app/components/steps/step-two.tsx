import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export default function StepTwo() {
  const resources = [
    {
      title: "Quantum Computing for Climate Science",
      authors: "Chen, S., & Johnson, P.",
      year: 2022,
      journal: "Nature Quantum Information",
      description:
        "Foundational paper establishing the theoretical framework for applying quantum algorithms to climate modeling.",
      link: "#",
    },
    {
      title: "Variational Quantum Algorithms for Atmospheric Dynamics",
      authors: "Patel, R., et al.",
      year: 2021,
      journal: "Quantum Machine Learning Journal",
      description:
        "Explores specific variational quantum algorithms that can be applied to atmospheric circulation models.",
      link: "#",
    },
    {
      title: "Quantum Advantage in Climate Data Processing",
      authors: "Martinez, L., & Wong, T.",
      year: 2023,
      journal: "Science Advances",
      description: "Demonstrates quantum speedup in processing satellite climate data compared to classical methods.",
      link: "#",
    },
    {
      title: "Introduction to Climate Modeling: Principles and Practices",
      authors: "Roberts, A.",
      year: 2020,
      journal: "Oxford University Press",
      description: "Essential textbook covering the fundamentals of climate modeling that you'll need to understand.",
      link: "#",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Here are the key papers/resources you should read first</h2>
      <p className="text-slate-500">
        These resources provide the foundation for our research. Please review them before proceeding.
      </p>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <Card key={index} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription>
                {resource.authors} ({resource.year}) • {resource.journal}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-2">{resource.description}</p>
              <a
                href={resource.link}
                className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-slate-700"
              >
                Access resource <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
