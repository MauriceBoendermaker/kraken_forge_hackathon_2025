"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

interface ValidationIssue {
  id: string
  type: "error" | "warning"
  message: string
  nodeRef?: string
  nodeLabel?: string
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  totalIssues: number
}

export default function ValidationPage() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load validation results from localStorage
    const storedResult = localStorage.getItem("validationResult")
    console.log("Stored validation result:", storedResult)

    if (storedResult) {
      try {
        const result = JSON.parse(storedResult) as ValidationResult
        console.log("Parsed validation result:", result)
        console.log("Errors count:", result.errors?.length)
        console.log("Warnings count:", result.warnings?.length)
        setValidationResult(result)
      } catch (error) {
        console.error("Failed to parse validation result:", error)
      }
    } else {
      console.warn("No validation result found in localStorage")
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading validation results...</p>
        </div>
      </div>
    )
  }

  if (!validationResult) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Validation Results</h3>
            <p className="text-muted-foreground mb-6">
              Please run validation from the editor first
            </p>
            <Link href="/editor">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Editor
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const { errors, warnings, isValid, totalIssues } = validationResult

  // Check if these are execution errors
  const hasExecutionErrors = errors.some(err => err.id.startsWith('exec-err-'))

  // Debug component to show raw data (can be removed later)
  const showDebugInfo = () => {
    console.log("Full Validation Result:", validationResult)
    alert(`Validation loaded successfully!\n\nTotal Issues: ${totalIssues}\nErrors: ${errors.length}\nWarnings: ${warnings.length}\nIs Valid: ${isValid}`)
  }

  return (
    <div className="min-h-screen bg-background">

      <Navbar/>

      {/* Execution Errors Banner */}
      {hasExecutionErrors && (
        <div className="bg-red-500/10 border-b border-red-500/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">
                <strong>Execution Errors Detected:</strong> These errors occurred when running your strategy against the Kraken API.
                Fix these issues before running again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {hasExecutionErrors ? "Execution Results" : "Strategy Validation"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {hasExecutionErrors
                  ? "Review errors from your last execution attempt"
                  : "Check your strategy for errors and warnings before executing"
                }
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${
                isValid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {isValid ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Ready to Execute
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  {errors.length} Error{errors.length !== 1 ? "s" : ""} Found
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Debug button - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <Button onClick={showDebugInfo} variant="outline" size="sm" className="mb-4">
            Debug: Show Validation Data
          </Button>
        )}

        {/* Validation Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 border border-border bg-card">
            <p className="text-xs text-muted-foreground font-medium mb-1">TOTAL ISSUES</p>
            <p className="text-2xl font-bold text-foreground">{errors.length + warnings.length}</p>
          </Card>
          <Card className="p-4 border border-red-500/30 bg-red-500/5">
            <p className="text-xs text-red-400 font-medium mb-1">ERRORS (Must Fix)</p>
            <p className="text-2xl font-bold text-red-400">{errors.length}</p>
          </Card>
          <Card className="p-4 border border-yellow-500/30 bg-yellow-500/5">
            <p className="text-xs text-yellow-400 font-medium mb-1">WARNINGS (Optional)</p>
            <p className="text-2xl font-bold text-yellow-400">{warnings.length}</p>
          </Card>
        </div>

        {/* Errors Section */}
        {errors.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-red-400">Errors ({errors.length})</h2>
            </div>
            <div className="space-y-3">
              {errors.map((issue) => (
                <Card
                  key={issue.id}
                  className="p-4 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-400">{issue.message}</p>
                      {issue.nodeRef && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-muted rounded text-foreground">Block: {issue.nodeLabel}</span>
                          <span className="text-slate-500">ID: {issue.nodeRef}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      Fix
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-yellow-400">Warnings ({warnings.length})</h2>
            </div>
            <div className="space-y-3">
              {warnings.map((issue) => (
                <Card
                  key={issue.id}
                  className="p-4 border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-400">{issue.message}</p>
                      {issue.nodeRef && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-muted rounded text-foreground">Block: {issue.nodeLabel}</span>
                          <span className="text-slate-500">ID: {issue.nodeRef}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Issues State */}
        {errors.length === 0 && warnings.length === 0 && (
          <Card className="p-12 border border-green-500/30 bg-green-500/5 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-400 mb-2">Strategy is Valid</h3>
            <p className="text-muted-foreground mb-6">
              Your strategy passed all validation checks and is ready to execute
            </p>
            <Link href="/editor">
              <Button className="gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                Return to Editor
              </Button>
            </Link>
          </Card>
        )}

        {/* Action Buttons */}
        {(errors.length > 0 || warnings.length > 0) && (
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/editor">
              <Button variant="outline" className="gap-2 bg-transparent hover:text-[#00B8E6]">
                <ArrowLeft className="w-4 h-4" />
                Return to Editor
              </Button>
            </Link>
            <Button className="gap-2 bg-[#00B8E6] hover:bg-[#00B8E6]/90 text-accent-foreground" disabled={errors.length > 0}>
              <CheckCircle2 className="w-4 h-4" />
              {errors.length > 0 ? "Fix Errors First" : "Execute Strategy"}
            </Button>
          </div>
        )}
      </div>

      <Footer/>

    </div>
  )
}
