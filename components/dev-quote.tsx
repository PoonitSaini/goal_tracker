"use client"

import { PenLine } from "lucide-react"

interface DevQuoteProps {
  quote?: string
  author?: string
}

const quotes = [
  { quote: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
]

export function DevQuote({ quote, author }: DevQuoteProps) {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  const displayQuote = quote || randomQuote.quote
  const displayAuthor = author || randomQuote.author

  return (
    <div className="flex items-start justify-between gap-4 text-right">
      <div className="flex-1">
        <p className="mb-2 text-sm italic text-muted-foreground">
          &ldquo;{displayQuote}&rdquo;
        </p>
        <p className="text-sm font-medium text-foreground">
          — {displayAuthor}
        </p>
      </div>
      <button className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-transform hover:scale-105">
        <PenLine className="h-5 w-5" />
      </button>
    </div>
  )
}
