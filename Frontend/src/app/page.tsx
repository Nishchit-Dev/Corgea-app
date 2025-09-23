'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService} from '../lib/api'
import CodeInput from './components/CodeInputEditor'
import ResultCard from './components/ResultCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Shield } from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AuthPage from './auth/page'

export default function Home() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <AuthPage />;
    }

    return (
        <ProtectedRoute>
            <HomeContent />
        </ProtectedRoute>
    );
}

function HomeContent() {
    const [code, setCode] = useState(`app.post("/purchase", (req, res) => {
    const { userId, productId, price } = req.body;
    db.purchase(userId, productId, price); // trusting client input
    res.send("Success");
});`)
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const { user, logout } = useAuth()

    const handleScan = async () => {
        setLoading(true)
        setResult(null)
        try {
            const resp = await apiService.scanCode(code)
            setResult(resp)
        } catch (err: any) {
            setResult({ error: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header with user info and logout */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Corgea-lite AI Scanner
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Welcome back, {user?.firstName || user?.email}!
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/github">
                            <Button variant="outline" className="text-sm">
                                <Github className="h-4 w-4 mr-2" />
                                GitHub Integration
                            </Button>
                        </Link>
                        <Button 
                            onClick={logout}
                            variant="outline"
                            className="text-sm"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Code Security Scanner</CardTitle>
                        <CardDescription>
                            Analyze your code for security vulnerabilities using AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <CodeInput code={code} setCode={setCode} />
                        
                        <Button
                            onClick={handleScan}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Scanning...' : 'Scan Code'}
                        </Button>

                        {result && result.error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 font-medium">Error:</p>
                                <p className="text-red-600">{result.error}</p>
                            </div>
                        )}

                        {result && !result.error && result.vulnerabilities && (
                            <ResultCard
                                vulnerabilities={result.vulnerabilities}
                                fixes={result.fixes}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}