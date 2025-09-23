'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiService } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, ShieldAlert, XCircle, Code, FileText, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

type ScanJob = {
    id: number
    status: 'pending' | 'running' | 'completed' | 'failed'
    scanType: string
    targetBranch: string
    startedAt: string
    completedAt?: string | null
    errorMessage?: string | null
    repository: { name: string; fullName: string }
}

type Vulnerability = {
    title: string
    description: string
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
    category: string
    lineNumber?: number | null
    codeSnippet?: string
    cweId?: string | null
    owaspCategory?: string | null
}

type ScanResult = {
    id?: number
    file_path: string
    file_content_hash?: string | null
    vulnerabilities?: Vulnerability[]
    // flattened single row (fallback)
    title?: string
    description?: string
    severity?: Vulnerability['severity']
    category?: string
    line_number?: number | null
    code_snippet?: string
    cwe_id?: string | null
    owasp_category?: string | null
}

type ScanResponse = {
    scanJob: ScanJob
    results: ScanResult[]
}

export default function ScanJobPage() {
    const params = useParams<{ scanJobId: string }>()
    const router = useRouter()
    const scanJobId = useMemo(() => params?.scanJobId, [params])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<ScanResponse | null>(null)

    useEffect(() => {
        if (!scanJobId) return
        let cancelled = false

        const poll = async () => {
            try {
                const resp = await apiService.get<ScanResponse>(
                    `/api/github/scan/${scanJobId}`
                )
                if (cancelled) return
                setData(resp)
                setError(null)
                setLoading(false)

                if (resp.scanJob.status === 'pending' || resp.scanJob.status === 'running') {
                    setTimeout(poll, 2000)
                }
            } catch (err: any) {
                if (cancelled) return
                setError(err.message || 'Failed to fetch scan status')
                setLoading(false)
                setTimeout(poll, 3000)
            }
        }

        setLoading(true)
        poll()
        return () => {
            cancelled = true
        }
    }, [scanJobId])

    const renderStatusIcon = (status: ScanJob['status']) => {
        if (status === 'running' || status === 'pending') {
            return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        }
        if (status === 'completed') {
            return <CheckCircle className="h-5 w-5 text-green-600" />
        }
        return <XCircle className="h-5 w-5 text-red-600" />
    }

    const grouped = useMemo(() => {
        if (!data?.results) return [] as Array<{ file: string; vulns: Vulnerability[] }>
        const map = new Map<string, Vulnerability[]>()
        for (const r of data.results) {
            const file = r.file_path
            let vulns: Vulnerability[] = []
            if (Array.isArray(r.vulnerabilities) && r.vulnerabilities.length) {
                vulns = r.vulnerabilities.map(v => ({
                    title: v.title,
                    description: v.description,
                    severity: v.severity as Vulnerability['severity'],
                    category: v.category,
                    lineNumber: v.lineNumber ?? null,
                    codeSnippet: v.codeSnippet,
                    cweId: v.cweId ?? null,
                    owaspCategory: v.owaspCategory ?? null,
                }))
            } else if (r.title && r.severity) {
                vulns = [{
                    title: r.title,
                    description: r.description || '',
                    severity: r.severity,
                    category: r.category || 'general',
                    lineNumber: r.line_number ?? null,
                    codeSnippet: r.code_snippet,
                    cweId: r.cwe_id ?? null,
                    owaspCategory: r.owasp_category ?? null,
                }]
            }
            if (!map.has(file)) map.set(file, [])
            map.get(file)!.push(...vulns)
        }
        return Array.from(map.entries()).map(([file, vulns]) => ({ file, vulns }))
    }, [data])

    const severityClass = (s: Vulnerability['severity']) => {
        switch (s) {
            case 'critical':
                return 'bg-red-600 text-white'
            case 'high':
                return 'bg-orange-500 text-white'
            case 'medium':
                return 'bg-yellow-400 text-black'
            case 'low':
                return 'bg-blue-200 text-blue-900'
            default:
                return 'bg-gray-200 text-gray-800'
        }
    }

    const severityIcon = (s: Vulnerability['severity']) => {
        switch (s) {
            case 'critical':
                return <XCircle className="h-4 w-4 text-red-600" />
            case 'high':
                return <AlertTriangle className="h-4 w-4 text-orange-500" />
            case 'medium':
                return <ShieldAlert className="h-4 w-4 text-yellow-500" />
            case 'low':
                return <AlertTriangle className="h-4 w-4 text-blue-500" />
            default:
                return <ShieldAlert className="h-4 w-4 text-gray-500" />
        }
    }

    const renderCodeWithHighlight = (vulnerability: Vulnerability) => {
        const [snippet, setSnippet] = useState<string | null>(vulnerability.codeSnippet || null)

        useEffect(() => {
            let cancelled = false
            const maybeFetch = async () => {
                if (snippet || !data?.scanJob || vulnerability.codeSnippet) return
                try {
                    // We don't know the file path at this layer; the parent maps group by file, so this is safe to skip here.
                } catch {}
            }
            maybeFetch()
            return () => { cancelled = true }
        }, [snippet, data?.scanJob, vulnerability.codeSnippet])

        const allLines = (snippet || '').split('\n')
        const targetLine = vulnerability.lineNumber || null
        const startLine = targetLine ? Math.max(1, targetLine - 8) : 1
        const endLine = targetLine ? Math.min(allLines.length, targetLine + 8) : Math.min(allLines.length, 16)
        const lines = allLines.slice(startLine - 1, endLine)

        return (
            <div className="mt-3 border rounded-lg overflow-hidden">
                <div className="text-gray-800 bg-gray-200 px-4 py-2 text-sm font-medium flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Code Snippet
                    {targetLine && (
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                            Line {targetLine}
                        </span>
                    )}
                </div>
                <div className="text-gray-800 bg-gray-200 font-mono text-sm overflow-x-auto">
                    {lines.map((line, index) => {
                        const lineNum = (startLine + index)
                        const isHighlighted = !!(targetLine && lineNum === targetLine)
                        
                        return (
                            <div
                                key={index}
                                className={`flex ${
                                    isHighlighted 
                                        ? 'bg-red-900/30 border-l-4 border-red-500' 
                                        : 'hover:bg-gray-200/50'
                                }`}
                            >
                                <div className="w-12 px-3 py-1 text-xs bg-gray-200 text-gray-800 border-r border-gray-700 select-none">
                                    {lineNum}
                                </div>
                                <div className="flex-1 px-3 py-1 whitespace-pre-wrap">
                                    {line}
                                </div>
                                {isHighlighted && (
                                    <div className="w-2 bg-red-500"></div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {renderStatusIcon(data?.scanJob.status || 'pending')}
                                    Scan {scanJobId}
                                </CardTitle>
                                <CardDescription>
                                    {data?.scanJob.repository
                                        ? `${data.scanJob.repository.fullName} • ${data.scanJob.status}`
                                        : 'Checking scan status...'}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/github">
                                    <Button variant="outline">Back to GitHub</Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Scanning in progress...</span>
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {data?.scanJob && (
                            <div className="mb-6 p-4 bg-white rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Repository:</span>
                                        <div className="font-medium text-gray-900">{data.scanJob.repository.fullName}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Status:</span>
                                        <div className="flex items-center gap-2">
                                            {data.scanJob.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                            {data.scanJob.status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                                            {data.scanJob.status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                                            <span className="font-medium capitalize">{data.scanJob.status}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Scan Type:</span>
                                        <div className="font-medium">{data.scanJob.scanType} • {data.scanJob.targetBranch}</div>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm text-gray-600">
                                    <div>Started: {new Date(data.scanJob.startedAt).toLocaleString()}</div>
                                    {data.scanJob.completedAt && (
                                        <div>Completed: {new Date(data.scanJob.completedAt).toLocaleString()}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {data?.scanJob.status === 'completed' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Vulnerability Analysis
                                </h3>
                                {grouped.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <div className="text-lg font-medium">No vulnerabilities found</div>
                                        <div className="text-sm">Your code appears to be secure!</div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {grouped.map(({ file, vulns }) => (
                                            <Card key={file} className="overflow-hidden">
                                                <CardHeader className="bg-gray-50 border-b">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-gray-600" />
                                                            <CardTitle className="text-lg">{file}</CardTitle>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {vulns.length} finding{vulns.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-0">
                                                    <div className="space-y-4 p-6">
                                                        {vulns.map((v, i) => (
                                                            <div key={i} className="border rounded-lg p-4 bg-white">
                                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                                    <div className="flex items-start gap-3 flex-1">
                                                                        {severityIcon(v.severity)}
                                                                        <div className="flex-1">
                                                                            <div className="font-medium text-gray-900 mb-1">
                                                                                {v.title}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                                                    {v.category}
                                                                                </span>
                                                                                {v.cweId && (
                                                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                                                        {v.cweId}
                                                                                    </span>
                                                                                )}
                                                                                {v.owaspCategory && (
                                                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                                                                        {v.owaspCategory}
                                                                                    </span>
                                                                                )}
                                                                                {v.lineNumber && (
                                                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                                                        Line {v.lineNumber}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${severityClass(v.severity)}`}>
                                                                        {v.severity.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                
                                                                {v.description && (
                                                                    <div className="mb-4">
                                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                                            {v.description}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* If snippet missing, fetch it from backend using scan id and file path */}
                                                                {v.codeSnippet ? (
                                                                    renderCodeWithHighlight(v)
                                                                ) : (
                                                                    <CodeFetcher
                                                                        scanJobId={String(data.scanJob.id)}
                                                                        filePath={file}
                                                                        lineNumber={v.lineNumber || undefined}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {data?.scanJob.status === 'failed' && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {data.scanJob.errorMessage || 'Scan failed.'}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


function CodeFetcher({ scanJobId, filePath, lineNumber }: { scanJobId: string; filePath: string; lineNumber?: number }) {
    const [snippet, setSnippet] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        const fetchCode = async () => {
            try {
                const resp = await apiService.get<{ content: string }>(`/api/github/scan/${scanJobId}/file?path=${encodeURIComponent(filePath)}`)
                if (cancelled) return
                setSnippet(resp.content)
            } catch (err: any) {
                if (cancelled) return
                setError(err?.message || 'Failed to load code')
            }
        }
        fetchCode()
        return () => { cancelled = true }
    }, [scanJobId, filePath])

    if (error) {
        return (
            <div className="mt-3 text-xs text-red-600">{error}</div>
        )
    }

    if (!snippet) {
        return (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading code…</span>
            </div>
        )
    }

    // Compute window around target line
    const allLines = snippet.split('\n')
    const target = lineNumber || null
    const start = target ? Math.max(1, target - 8) : 1
    const end = target ? Math.min(allLines.length, target + 8) : Math.min(allLines.length, 16)
    const lines = allLines.slice(start - 1, end)

    return (
        <div className="mt-3 border rounded-lg overflow-hidden">
            <div className="text-gray-800 bg-gray-200 px-4 py-2 text-sm font-medium flex items-center gap-2">
                <Code className="h-4 w-4" />
                Code Snippet
                {target && (
                    <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">Line {target}</span>
                )}
            </div>
            <div className=" font-mono text-sm overflow-x-auto">
                {lines.map((line, index) => {
                    const lineNum = start + index
                    const isHighlighted = !!(target && lineNum === target)
                    return (
                        <div key={index} className={`flex ${isHighlighted ? 'bg-red-900/30 border-l-4 border-red-500' : 'hover:bg-gray-800/50'}`}>
                            <div className="w-12 px-3 py-1 text-xs text-gray-500 bg-gray-800 border-r border-gray-700 select-none">{lineNum}</div>
                            <div className="flex-1 px-3 py-1 whitespace-pre-wrap">{line}</div>
                            {isHighlighted && (<div className="w-2 bg-red-500/40"></div>)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


