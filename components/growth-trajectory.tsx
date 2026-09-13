"use client"

import { Badge } from "@/components/ui/badge"

interface GrowthCard {
  type: "article" | "challenge" | "tutorial"
  title: string
  image?: string
}

const growthCards: GrowthCard[] = [
  {
    type: "article",
    title: "Flow State Mechanics for Seniors",
  },
  {
    type: "challenge",
    title: "Optimizing React Rendering Cycles",
  },
  {
    type: "tutorial",
    title: "Kernel-level debugging for mortals",
  },
]

const typeStyles = {
  article: "bg-accent/10 text-accent border-accent/30",
  challenge: "bg-primary/10 text-primary border-primary/30",
  tutorial: "bg-orange-500/10 text-orange-400 border-orange-500/30",
}

export function GrowthTrajectory() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Growth Trajectory</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {growthCards.map((card, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
            
            {/* Decorative code background */}
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-secondary to-card">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="font-mono text-[8px] leading-tight text-primary">
                  {`
const optimize = (data) => {
  return data.filter(x => x.valid)
    .map(x => transform(x))
    .reduce((a, b) => merge(a, b));
};
                  `.trim()}
                </div>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge variant="outline" className={typeStyles[card.type]}>
                  {card.type.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-medium text-foreground line-clamp-2">{card.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
