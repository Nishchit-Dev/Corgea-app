'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Github, 
    Shield, 
    Zap, 
    Eye, 
    Code, 
    ArrowRight, 
    CheckCircle, 
    Star,
    Users,
    Lock,
    Search,
    FileText,
    AlertTriangle,
    ExternalLink
} from 'lucide-react'
import Link from 'next/link'
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

    return <LandingPage />;
}

function LandingPage() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Corgea</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/github">
                                <Button variant="outline" size="sm">
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub Integration
                                </Button>
                            </Link>
                            <Button onClick={logout} variant="ghost" size="sm">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <Badge variant="secondary" className="mb-4 px-3 py-1">
                            <Zap className="h-3 w-3 mr-1" />
                            AI-Powered Security Scanning
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Secure Your Code with
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                {' '}AI Intelligence
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Automatically detect vulnerabilities, security flaws, and code issues across your entire GitHub repository with advanced AI analysis.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/github">
                                <Button size="lg" className="w-full sm:w-auto">
                                    <Github className="h-5 w-5 mr-2" />
                                    Connect GitHub Repository
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <Eye className="h-5 w-5 mr-2" />
                                View Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Corgea?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Advanced security scanning powered by cutting-edge AI technology
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield className="h-8 w-8" />}
                            title="Comprehensive Security Analysis"
                            description="Detect SQL injection, XSS, authentication bypasses, and hundreds of other security vulnerabilities automatically."
                        />
                        <FeatureCard
                            icon={<Code className="h-8 w-8" />}
                            title="Multi-Language Support"
                            description="Scan JavaScript, TypeScript, Python, Java, C#, and more with intelligent code analysis."
                        />
                        <FeatureCard
                            icon={<Zap className="h-8 w-8" />}
                            title="Real-Time Scanning"
                            description="Get instant results with our high-performance AI engine that scans entire repositories in seconds."
                        />
                        <FeatureCard
                            icon={<Eye className="h-8 w-8" />}
                            title="Detailed Code Highlighting"
                            description="See exactly where vulnerabilities exist with precise line-by-line highlighting and context."
                        />
                        <FeatureCard
                            icon={<FileText className="h-8 w-8" />}
                            title="Actionable Fix Suggestions"
                            description="Get specific, detailed recommendations on how to fix each vulnerability with code examples."
                        />
                        <FeatureCard
                            icon={<Lock className="h-8 w-8" />}
                            title="Secure & Private"
                            description="Your code stays secure. We use encrypted connections and never store your source code permanently."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in minutes with our simple 3-step process
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StepCard
                            step="1"
                            icon={<Github className="h-8 w-8" />}
                            title="Connect Your Repository"
                            description="Securely connect your GitHub account and select the repositories you want to scan."
                        />
                        <StepCard
                            step="2"
                            icon={<Search className="h-8 w-8" />}
                            title="AI Analysis"
                            description="Our advanced AI engine analyzes your code for security vulnerabilities and potential issues."
                        />
                        <StepCard
                            step="3"
                            icon={<AlertTriangle className="h-8 w-8" />}
                            title="Review & Fix"
                            description="Review detailed reports with highlighted vulnerabilities and actionable fix suggestions."
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
                        <StatCard
                            icon={<Shield className="h-8 w-8" />}
                            number="1000+"
                            label="Vulnerabilities Detected"
                        />
                        <StatCard
                            icon={<Users className="h-8 w-8" />}
                            number="500+"
                            label="Developers Protected"
                        />
                        <StatCard
                            icon={<Code className="h-8 w-8" />}
                            number="50+"
                            label="Languages Supported"
                        />
                        <StatCard
                            icon={<Star className="h-8 w-8" />}
                            number="99.9%"
                            label="Accuracy Rate"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Ready to Secure Your Code?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of developers who trust Corgea to keep their code secure.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/github">
                            <Button size="lg" className="w-full sm:w-auto">
                                <Github className="h-5 w-5 mr-2" />
                                Start Scanning Now
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            <ExternalLink className="h-5 w-5 mr-2" />
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Shield className="h-6 w-6 text-blue-400" />
                            <span className="text-lg font-bold">Corgea</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2024 Corgea. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
                <div className="text-blue-600 mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </CardContent>
        </Card>
    )
}

function StepCard({ step, icon, title, description }: { step: string; icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="relative">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    {icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step}
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

function StatCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
    return (
        <div>
            <div className="text-blue-200 mb-2">{icon}</div>
            <div className="text-3xl font-bold mb-1">{number}</div>
            <div className="text-blue-200">{label}</div>
        </div>
    )
}