"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <main className="min-h-screen flex flex-col items-center p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="outline">
            Back to Calculator
          </Button>
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Math Tools</h1>
        
        <div className="space-y-4">
          <p className="text-lg">
            Math Tools is a versatile calculator and number conversion application that helps you with:
          </p>
          
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Basic arithmetic operations</li>
            <li>Bitwise operations (AND, OR, XOR)</li>
            <li>Bit shifting operations</li>
            <li>Number system conversions (Decimal, Binary, Hexadecimal)</li>
          </ul>

          <p className="text-lg mt-6">
            Built with Next.js and Shadcn/UI, this tool provides a clean and intuitive interface
            with support for both light and dark modes to suit your preferences.
          </p>
        </div>
      </div>
    </main>
  )
} 