import Link from "next/link"
import Image from "next/image"
import { ArrowRight, House, Shield, BarChart3, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <House className="h-6 w-6 text-green-600" />
                        <span className="font-bold text-xl">Haven</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#mission" className="text-sm font-medium hover:text-green-600 transition-colors">
                            Our Mission
                        </Link>
                        <Link href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">
                            Features
                        </Link>
                        <Link href="#impact" className="text-sm font-medium hover:text-green-600 transition-colors">
                            Impact
                        </Link>
                    </nav>
                    <Link href="/app">
                        <Button className="bg-green-600 hover:bg-green-700">Launch App</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(120,190,140,0.2),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(100,220,140,0.2),transparent_50%)]"></div>
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Building Climate Resilience for Australia's Future
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-md">
                            Empowering communities with data-driven insights to adapt and thrive in a changing climate.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/app">
                                <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                                    Explore Our Platform <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="#mission">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-2xl">
                        <Image
                            src="/graph.png"
                            alt="Climate data visualization"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-600">
                            At Haven, we're dedicated to providing actionable climate data for Local Government Areas across
                            Australia. Our platform transforms complex climate predictions into accessible insights, helping
                            communities prepare for and adapt to climate change.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Resilience Planning</h3>
                            <p className="text-gray-600">
                                Equip local governments with the tools to develop effective climate adaptation strategies based on
                                precise data.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <BarChart3 className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Data-Driven Decisions</h3>
                            <p className="text-gray-600">
                                Transform complex climate models into clear, actionable insights for policy makers and community
                                leaders.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Globe className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community Empowerment</h3>
                            <p className="text-gray-600">
                                Enable communities to understand local climate risks and take proactive measures to protect their
                                future.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Platform Features</h2>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                            <div className="space-y-8">
                                <div className="flex gap-2">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="font-bold text-green-600">1</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Suburb-Specific Climate Predictions</h3>
                                        <p className="text-gray-600">
                                            Access detailed climate projections tailored to specific suburbs across Australia.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="font-bold text-green-600">2</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Interactive Visualization Tools</h3>
                                        <p className="text-gray-600">
                                            Explore climate data through intuitive maps, charts, and graphs that make complex information
                                            accessible.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="font-bold text-green-600">3</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Adaptation Strategy Builder</h3>
                                        <p className="text-gray-600">
                                            Generate customized adaptation plans based on your area's specific climate risks and
                                            vulnerabilities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[300px]">
                            <div className="order-1 md:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src="/chart.png"
                                    alt="Platform interface"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section id="impact" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                        We're helping communities across Australia prepare for climate change with actionable data and insights.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">15k+</div>
                            <p className="text-gray-600">Suburb Supported</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">50M+</div>
                            <p className="text-gray-600">Data Points Analyzed</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
                            <p className="text-gray-600">Adaptation Plans Created</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">5M+</div>
                            <p className="text-gray-600">Australians Impacted</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Climate Resilience?</h2>
                    <p className="text-xl max-w-2xl mx-auto mb-8">
                        Access our platform to get started with climate data predictions for your suburb.
                    </p>
                    <Link href="/app">
                        <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                            Launch Application <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 px-8">
                <div className=" flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">© {new Date().getFullYear()} Haven. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="text-sm hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
