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

type ScanResult = {
    id?: number
    file_path: string
    severity?: string
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

                        {data?.scanJob.status === 'completed' && (
                            <div>
                                <h3 className="font-semibold mb-2">Results</h3>
                                {data.results.length === 0 ? (
                                    <div className="text-sm text-gray-500">No vulnerabilities found.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.results.map((r, idx) => (
                                            <div key={idx} className="border rounded p-3 flex items-center gap-3">
                                                <ShieldAlert className="h-4 w-4 text-orange-600" />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{r.file_path}</div>
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


