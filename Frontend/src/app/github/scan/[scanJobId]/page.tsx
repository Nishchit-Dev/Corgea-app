'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiService } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, ShieldAlert, XCircle } from 'lucide-react'
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

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
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
                            <div className="mb-4 text-sm text-gray-600">
                                <div>
                                    Repo: <span className="font-medium text-gray-900">{data.scanJob.repository.fullName}</span>
                                </div>
                                <div>
                                    Status: <span className="font-medium">{data.scanJob.status}</span> • Type: {data.scanJob.scanType} • Branch: {data.scanJob.targetBranch}
                                </div>
                                <div>
                                    Started: {new Date(data.scanJob.startedAt).toLocaleString()} {data.scanJob.completedAt ? `• Completed: ${new Date(data.scanJob.completedAt).toLocaleString()}` : ''}
                                </div>
                            </div>
                        )}

                        {data?.scanJob.status === 'completed' && (
                            <div>
                                <h3 className="font-semibold mb-3">Results</h3>
                                {grouped.length === 0 ? (
                                    <div className="text-sm text-gray-500">No vulnerabilities found.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {grouped.map(({ file, vulns }) => (
                                            <div key={file} className="border rounded p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-medium text-gray-900 truncate">{file}</div>
                                                    <div className="text-xs text-gray-500">{vulns.length} finding(s)</div>
                                                </div>
                                                <div className="space-y-3">
                                                    {vulns.map((v, i) => (
                                                        <div key={i} className="rounded border p-3">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="text-sm font-medium truncate">{v.title}</div>
                                                                <span className={`text-xs px-2 py-1 rounded ${severityClass(v.severity)}`}>{v.severity}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1">{v.category}{v.cweId ? ` • ${v.cweId}` : ''}{v.owaspCategory ? ` • ${v.owaspCategory}` : ''}{v.lineNumber ? ` • line ${v.lineNumber}` : ''}</div>
                                                            {v.description && (
                                                                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{v.description}</p>
                                                            )}
                                                            {v.codeSnippet && (
                                                                <pre className="mt-2 bg-gray-900 text-gray-100 text-xs rounded p-2 overflow-auto"><code>{v.codeSnippet}</code></pre>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
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


