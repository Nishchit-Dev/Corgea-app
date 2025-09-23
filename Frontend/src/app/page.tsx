'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
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

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const fadeInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 }
    }

    const fadeInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 }
    }

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 }
    }

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
                    <motion.div 
                        className="text-center"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge variant="secondary" className="mb-4 px-3 py-1">
                                <Zap className="h-3 w-3 mr-1" />
                                AI-Powered Security Scanning
                            </Badge>
                        </motion.div>
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                            variants={fadeInUp}
                        >
                            Secure Your Code with
                            <motion.span 
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                {' '}AI Intelligence
                            </motion.span>
                        </motion.h1>
                        <motion.p 
                            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                            variants={fadeInUp}
                        >
                            Automatically detect vulnerabilities, security flaws, and code issues across your entire GitHub repository with advanced AI analysis.
                        </motion.p>
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            variants={fadeInUp}
                        >
                            <Link href="/github">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button size="lg" className="w-full sm:w-auto">
                                        <Github className="h-5 w-5 mr-2" />
                                        Connect GitHub Repository
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    <Eye className="h-5 w-5 mr-2" />
                                    View Demo
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Corgea?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Advanced security scanning powered by cutting-edge AI technology
                        </p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <FeatureCard
                                icon={<Shield className="h-8 w-8" />}
                                title="Comprehensive Security Analysis"
                                description="Detect SQL injection, XSS, authentication bypasses, and hundreds of other security vulnerabilities automatically."
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <FeatureCard
                                icon={<Code className="h-8 w-8" />}
                                title="Multi-Language Support"
                                description="Scan JavaScript, TypeScript, Python, Java, C#, and more with intelligent code analysis."
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <FeatureCard
                                icon={<Zap className="h-8 w-8" />}
                                title="Real-Time Scanning"
                                description="Get instant results with our high-performance AI engine that scans entire repositories in seconds."
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <FeatureCard
                                icon={<Eye className="h-8 w-8" />}
                                title="Detailed Code Highlighting"
                                description="See exactly where vulnerabilities exist with precise line-by-line highlighting and context."
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <FeatureCard
                                icon={<FileText className="h-8 w-8" />}
                                title="Actionable Fix Suggestions"
                                description="Get specific, detailed recommendations on how to fix each vulnerability with code examples."
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <FeatureCard
                                icon={<Lock className="h-8 w-8" />}
                                title="Secure & Private"
                                description="Your code stays secure. We use encrypted connections and never store your source code permanently."
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in minutes with our simple 3-step process
                        </p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInLeft}>
                            <StepCard
                                step="1"
                                icon={<Github className="h-8 w-8" />}
                                title="Connect Your Repository"
                                description="Securely connect your GitHub account and select the repositories you want to scan."
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <StepCard
                                step="2"
                                icon={<Search className="h-8 w-8" />}
                                title="AI Analysis"
                                description="Our advanced AI engine analyzes your code for security vulnerabilities and potential issues."
                            />
                        </motion.div>
                        <motion.div variants={fadeInRight}>
                            <StepCard
                                step="3"
                                icon={<AlertTriangle className="h-8 w-8" />}
                                title="Review & Fix"
                                description="Review detailed reports with highlighted vulnerabilities and actionable fix suggestions."
                            />
                        </motion.div>
                    </motion.div>
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
        <motion.div
            whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                    <motion.div 
                        className="text-blue-600 mb-4"
                        whileHover={{ 
                            scale: 1.1,
                            rotate: 5,
                            transition: { duration: 0.2 }
                        }}
                    >
                        {icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                    </CardContent>
                </Card>
        </motion.div>
    )
}

function StepCard({ step, icon, title, description }: { step: string; icon: React.ReactNode; title: string; description: string }) {
    return (
        <motion.div 
            className="text-center"
            whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
        >
            <div className="relative">
                <motion.div 
                    className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                        transition: { duration: 0.6 }
                    }}
                >
                    {icon}
                </motion.div>
                <motion.div 
                    className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                    {step}
                </motion.div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
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