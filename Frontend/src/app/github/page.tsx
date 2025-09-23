'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AuthPage from '../auth/page';
import { apiConfig } from '@/lib/api-config';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Github, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function GitHubPage() {
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
            <GitHubPageContent />
        </ProtectedRoute>
    );
}

function GitHubPageContent() {
    const [githubConnected, setGithubConnected] = useState(false);
    const [githubAccount, setGithubAccount] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        checkGitHubConnection();
    }, [token]);

    const checkGitHubConnection = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const account = await apiService.get('/api/github/account');
            
            setGithubAccount(account);
            setGithubConnected(true);
        } catch (err: any) {
            if (err.status === 404) {
                // GitHub account not connected
                setGithubAccount(null);
                setGithubConnected(false);
            } else {
                setError('Failed to check GitHub connection');
                setGithubConnected(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubConnect = () => {
        // Redirect to GitHub OAuth
        window.location.href = apiConfig.endpoints.github.auth;
    };

    const handleGitHubDisconnect = async () => {
        try {
            setLoading(true);
            await apiService.post('/api/github/disconnect', { method: 'POST' });
            
            setGithubAccount(null);
            setGithubConnected(false);
        } catch (err: any) {
            setError('Failed to disconnect GitHub account');
        } finally {
            setLoading(false);
        }
    };

    const handleScanRepository = (repoId: number) => {
        // TODO: Navigate to scan results or show scan progress
        console.log('Scanning repository:', repoId);
    };

    const handleRefreshRepositories = () => {
        // TODO: Refresh repository list
        console.log('Refreshing repositories...');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Scanner
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Github className="h-8 w-8" />
                                GitHub Integration
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Connect your GitHub account to scan repositories for security vulnerabilities
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Welcome to GitHub Integration
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* GitHub Connection Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Github className="h-5 w-5" />
                                    Connect GitHub
                                </CardTitle>
                                <CardDescription>
                                    Connect your GitHub account to scan repositories
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {loading ? (
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Checking GitHub connection...</p>
                                    </div>
                                ) : githubConnected ? (
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <p className="font-medium text-green-900 mb-2">GitHub Connected!</p>
                                        {githubAccount && (
                                            <div className="text-sm text-gray-600 mb-3">
                                                <p>@{githubAccount.username}</p>
                                                <p className="text-xs text-gray-500">
                                                    Connected on {new Date(githubAccount.connectedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        <Button 
                                            variant="outline" 
                                            onClick={handleGitHubDisconnect}
                                            className="w-full"
                                            disabled={loading}
                                        >
                                            Disconnect
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Github className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Connect your GitHub account to get started
                                        </p>
                                        <Button 
                                            onClick={handleGitHubConnect}
                                            className="w-full"
                                            disabled={loading}
                                        >
                                            <Github className="h-4 w-4 mr-2" />
                                            Connect GitHub Account
                                        </Button>
                                        <p className="text-xs text-gray-400 mt-2">
                                            You'll be redirected to GitHub to authorize the connection
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Repository List */}
                    <div className="lg:col-span-2">
                        {githubConnected ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Repositories</CardTitle>
                                    <CardDescription>
                                        Select a repository to scan for security vulnerabilities
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No Repositories Found
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            This is a simplified version. Real repositories will appear here.
                                        </p>
                                        <Button 
                                            variant="outline"
                                            onClick={handleRefreshRepositories}
                                        >
                                            Refresh Repositories
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Connect GitHub to Get Started
                                    </h3>
                                    <p className="text-gray-500">
                                        Connect your GitHub account to see your repositories and start scanning for security vulnerabilities.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>GitHub Security Scanning Features</CardTitle>
                            <CardDescription>
                                Powerful security analysis for your entire codebase
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Github className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Repository Access</h3>
                                    <p className="text-sm text-gray-600">
                                        Scan both private and public repositories with secure OAuth integration
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Shield className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                                    <p className="text-sm text-gray-600">
                                        Advanced AI detects vulnerabilities across multiple programming languages
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Shield className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Detailed Reports</h3>
                                    <p className="text-sm text-gray-600">
                                        Get comprehensive security reports with fix suggestions and best practices
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
