"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { useState } from "react"

export default function Home() {
  const [display, setDisplay] = useState("")

  // Add new state for converter
  const [number, setNumber] = useState({
    decimal: '',
    binary: '',
    hex: ''
  })

  const [activeSection, setActiveSection] = useState<'calculator' | 'converter'>('calculator')

  const handleNumber = (num: string) => {
    setDisplay(prev => prev + num)
  }

  const handleOperator = (op: string) => {
    setDisplay(prev => prev + " " + op + " ")
  }

  const calculate = () => {
    try {
      // Using Function constructor instead of eval for safer evaluation
      const result = new Function('return ' + display)()
      setDisplay(result.toString())
    } catch {
      setDisplay('Error')
    }
  }

  const clear = () => {
    setDisplay("")
  }

  const handleConversion = (value: string, base: 'decimal' | 'binary' | 'hex') => {
    let dec: number;
    
    try {
      switch (base) {
        case 'decimal':
          dec = parseInt(value)
          setNumber({
            decimal: value,
            binary: dec.toString(2),
            hex: dec.toString(16).toUpperCase()
          })
          break
        case 'binary':
          dec = parseInt(value, 2)
          setNumber({
            decimal: dec.toString(),
            binary: value,
            hex: dec.toString(16).toUpperCase()
          })
          break
        case 'hex':
          dec = parseInt(value, 16)
          setNumber({
            decimal: dec.toString(),
            binary: dec.toString(2),
            hex: value.toUpperCase()
          })
          break
      }
    } catch {
      setNumber({
        decimal: 'Error',
        binary: 'Error',
        hex: 'Error'
      })
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <h1 className="text-4xl font-bold mb-4">Math Tools</h1>
      
      <div className="flex gap-4 mb-4">
        <Button 
          variant={activeSection === 'calculator' ? 'default' : 'outline'}
          onClick={() => setActiveSection('calculator')}
        >
          Calculator
        </Button>
        <Button 
          variant={activeSection === 'converter' ? 'default' : 'outline'}
          onClick={() => setActiveSection('converter')}
        >
          Number Converter
        </Button>
      </div>

      {activeSection === 'calculator' ? (
        <div className="w-[300px] p-6 border rounded-lg shadow-lg bg-card">
          <Input 
            value={display}
            readOnly 
            className="text-right text-lg mb-4"
          />
          
          <div className="grid grid-cols-4 gap-2">
            <Button variant="destructive" onClick={clear}>Clear</Button>
            <Button variant="secondary" onClick={() => handleOperator("&")}>AND</Button>
            <Button variant="secondary" onClick={() => handleOperator("|")}>OR</Button>
            <Button variant="secondary" onClick={() => handleOperator("^")}>XOR</Button>
            
            <Button variant="outline" onClick={() => handleNumber("7")}>7</Button>
            <Button variant="outline" onClick={() => handleNumber("8")}>8</Button>
            <Button variant="outline" onClick={() => handleNumber("9")}>9</Button>
            <Button variant="secondary" onClick={() => handleOperator("+")}>+</Button>
            
            <Button variant="outline" onClick={() => handleNumber("4")}>4</Button>
            <Button variant="outline" onClick={() => handleNumber("5")}>5</Button>
            <Button variant="outline" onClick={() => handleNumber("6")}>6</Button>
            <Button variant="secondary" onClick={() => handleOperator("-")}>-</Button>
            
            <Button variant="outline" onClick={() => handleNumber("1")}>1</Button>
            <Button variant="outline" onClick={() => handleNumber("2")}>2</Button>
            <Button variant="outline" onClick={() => handleNumber("3")}>3</Button>
            <Button variant="secondary" onClick={() => handleOperator("*")}>×</Button>
            
            <Button variant="outline" onClick={() => handleNumber("0")}>0</Button>
            <Button variant="outline" onClick={() => handleNumber(".")}>.</Button>
            <Button variant="secondary" onClick={() => handleOperator(">>")}>&gt;&gt;</Button>
            <Button variant="secondary" onClick={() => handleOperator("/")}>÷</Button>
            
            <Button variant="secondary" onClick={() => handleOperator("<<")}>&lt;&lt;</Button>
            <Button variant="secondary" className="col-span-3" onClick={calculate}>=</Button>
          </div>
        </div>
      ) : (
        <div className="w-[300px] p-6 border rounded-lg shadow-lg bg-card">
          <h2 className="text-2xl font-bold mb-4">Number Converter</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Decimal:</label>
              <Input
                value={number.decimal}
                onChange={(e) => handleConversion(e.target.value, 'decimal')}
                placeholder="Enter decimal number"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Binary:</label>
              <Input
                value={number.binary}
                onChange={(e) => handleConversion(e.target.value, 'binary')}
                placeholder="Enter binary number"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hexadecimal:</label>
              <Input
                value={number.hex}
                onChange={(e) => handleConversion(e.target.value, 'hex')}
                placeholder="Enter hex number"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
