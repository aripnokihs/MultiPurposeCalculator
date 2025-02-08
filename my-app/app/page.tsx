"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function Home() {
  const [display, setDisplay] = useState("")

  // Add new state for converter
  const [number, setNumber] = useState({
    decimal: '',
    binary: '',
    hex: ''
  })

  const [activeSection, setActiveSection] = useState<'calculator' | 'converter'>('calculator')

  const [isResult, setIsResult] = useState(false)

  const [lastOperation, setLastOperation] = useState<string>('')  // Store the last operation

  const handleNumber = (num: string) => {
    if (isResult) {
      setDisplay(num)
      setIsResult(false)
    } else {
      setDisplay(prev => prev + num)
    }
  }

  const handleOperator = (op: string) => {
    setIsResult(false)
    setLastOperation('')  // Clear the last operation when starting a new one
    setDisplay(prev => prev + " " + op + " ")
  }

  const formatResult = (num: number | bigint): string => {
    // Convert BigInt to number for comparison and formatting
    const numValue = typeof num === 'bigint' ? Number(num) : num
    
    if (Math.abs(numValue) >= 1e20) {
      return numValue.toExponential(5).replace(/\.?0+e/, 'e')
    }
    if (Number.isInteger(numValue)) {
      return num.toString()
    }
    return numValue.toFixed(5).replace(/\.?0+$/, '')
  }

  const calculate = () => {
    try {
      // If there's a result and user presses '=' again, repeat the last operation
      if (isResult && lastOperation) {
        const newDisplay = display + lastOperation
        // Check if the expression contains left shift
        if (newDisplay.includes('<<')) {
          const [left, right] = newDisplay.split('<<').map(part => part.trim())
          const result = BigInt(new Function('return ' + left)()) << BigInt(new Function('return ' + right)())
          setDisplay(formatResult(result))
        } else {
          const result = new Function('return ' + newDisplay)()
          setDisplay(formatResult(result))
        }
      } else {
        // Store the second half of the operation for repeat functionality
        const matches = display.match(/[-+*/&|^]|\s<<\s|\s>>\s/g)
        if (matches) {
          const lastMatch = matches[matches.length - 1]
          const parts = display.split(lastMatch)
          setLastOperation(lastMatch + parts[parts.length - 1])
        }

        // Regular calculation
        if (display.includes('<<')) {
          const [left, right] = display.split('<<').map(part => part.trim())
          const result = BigInt(new Function('return ' + left)()) << BigInt(new Function('return ' + right)())
          setDisplay(formatResult(result))
        } else {
          const result = new Function('return ' + display)()
          setDisplay(formatResult(result))
        }
      }
      setIsResult(true)
    } catch {
      setDisplay('Error')
      setIsResult(true)
    }
  }

  const clear = () => {
    setDisplay("")
    setIsResult(false)
    setLastOperation('')  // Clear the last operation when clearing the display
  }

  const formatBinary = (binary: string, addPadding: boolean = false): string => {
    // Remove any existing spaces
    const cleanBinary = binary.replace(/\s/g, '')
    if (addPadding) {
      // Add padding only when converting from other formats
      const paddedBinary = cleanBinary.padStart(Math.ceil(cleanBinary.length / 4) * 4, '0')
      return paddedBinary.match(/.{1,4}/g)?.join(' ') || cleanBinary
    }
    // Just add spaces for direct binary input
    return cleanBinary.match(/.{1,4}/g)?.join(' ') || cleanBinary
  }

  const formatHex = (hex: string, addPadding: boolean = false): string => {
    // Remove spaces and convert to uppercase
    const cleanHex = hex.replace(/\s/g, '').toUpperCase()
    if (addPadding) {
      // Add padding only when converting from other formats
      const paddedHex = cleanHex.padStart(Math.ceil(cleanHex.length / 2) * 2, '0')
      return paddedHex.match(/.{1,2}/g)?.join(' ') || cleanHex
    }
    // Just add spaces for direct hex input
    return cleanHex.match(/.{1,2}/g)?.join(' ') || cleanHex
  }

  const handleConversion = (value: string, base: 'decimal' | 'binary' | 'hex') => {
    // Clear spaces first
    const cleanValue = value.replace(/\s/g, '')
    
    // Check for valid characters based on the number system
    const isValidDecimal = /^[0-9]*$/.test(cleanValue)
    const isValidBinary = /^[01]*$/.test(cleanValue)
    const isValidHex = /^[0-9A-Fa-f]*$/.test(cleanValue)
    
    try {
      switch (base) {
        case 'decimal':
          if (!isValidDecimal || cleanValue === '') {
            setNumber({
              decimal: value,  // Keep the invalid input in the current field
              binary: 'NaN',
              hex: 'NaN'
            })
            return
          }
          const dec = parseInt(cleanValue)
          setNumber({
            decimal: value,
            binary: formatBinary(dec.toString(2), true),
            hex: formatHex(dec.toString(16), true)
          })
          break

        case 'binary':
          if (!isValidBinary || cleanValue === '') {
            setNumber({
              decimal: 'NaN',
              binary: value,  // Keep the invalid input in the current field
              hex: 'NaN'
            })
            return
          }
          const binDec = parseInt(cleanValue, 2)
          setNumber({
            decimal: binDec.toString(),
            binary: formatBinary(value),
            hex: formatHex(binDec.toString(16), true)
          })
          break

        case 'hex':
          if (!isValidHex || cleanValue === '') {
            setNumber({
              decimal: 'NaN',
              hex: value,  // Keep the invalid input in the current field
              binary: 'NaN'
            })
            return
          }
          const hexDec = parseInt(cleanValue, 16)
          setNumber({
            decimal: hexDec.toString(),
            binary: formatBinary(hexDec.toString(2), true),
            hex: formatHex(value)
          })
          break
      }
    } catch {
      setNumber({
        decimal: base === 'decimal' ? value : 'NaN',
        binary: base === 'binary' ? value : 'NaN',
        hex: base === 'hex' ? value : 'NaN'
      })
    }
  }

  const handleFocus = (field: 'decimal' | 'binary' | 'hex') => {
    if (number[field] === 'NaN') {
      setNumber(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4">
        <Link href="/about">
          <Button variant="outline">
            About Math Tools
          </Button>
        </Link>
      </div>
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
                onFocus={() => handleFocus('decimal')}
                placeholder="Enter decimal number"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Binary:</label>
              <Input
                value={number.binary}
                onChange={(e) => handleConversion(e.target.value, 'binary')}
                onFocus={() => handleFocus('binary')}
                placeholder="Enter binary number"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hexadecimal:</label>
              <Input
                value={number.hex}
                onChange={(e) => handleConversion(e.target.value, 'hex')}
                onFocus={() => handleFocus('hex')}
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
