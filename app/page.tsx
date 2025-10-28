"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  Compass,
  Globe,
  Map,
  MapPin,
  Play,
  Star,
  Target,
  Trophy,
  Users,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 scroll-smooth">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                GeoGuess
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors scroll-smooth"
              >
                Features
              </a>
              <a
                href="#how-to-play"
                className="text-gray-600 hover:text-gray-900 transition-colors scroll-smooth"
              >
                How to Play
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors scroll-smooth"
              >
                About
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 border-gray-300 hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-9 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-full shadow-2xl">
                <Globe className="w-16 h-16 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                GeoGuess
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Test your geography knowledge by guessing iconic locations from
                around the world using Street View imagery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold border-2 hover:bg-gray-50"
              >
                <Compass className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Trophy className="w-4 h-4 mr-2" />
                Competitive
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-2" />
                Multiplayer
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Fast-Paced
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why choose GeoGuess?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A unique gaming experience that combines geography, exploration,
              and fun.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Real Locations</CardTitle>
                <CardDescription className="text-base">
                  Explore authentic places around the world using real Street
                  View imagery.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Geographic Accuracy</CardTitle>
                <CardDescription className="text-base">
                  Demonstrate your geographic knowledge with a distance-based
                  scoring system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Scoring System</CardTitle>
                <CardDescription className="text-base">
                  Compete against yourself and other players to achieve the
                  highest score.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Map className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Multiple Difficulties</CardTitle>
                <CardDescription className="text-base">
                  From beginner to expert, find the perfect level for your
                  skill.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Star className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Smart Hints</CardTitle>
                <CardDescription className="text-base">
                  Use strategic hints to help you identify the correct location.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Social Experience</CardTitle>
                <CardDescription className="text-base">
                  Share your results and compete with friends in this geographic
                  adventure.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section id="how-to-play" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How to Play?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              It's simple, fun, and educational. Follow these steps to start
              your geographic adventure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Observe the Image
              </h3>
              <p className="text-gray-600">
                Look at the Street View image and analyze the details to
                identify geographic clues.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Select the Location
              </h3>
              <p className="text-gray-600">
                Click on the interactive map to mark where you think the
                location is.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Get Points
              </h3>
              <p className="text-gray-600">
                Receive points based on how close your answer is to the actual
                location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Ready for the adventure?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of players who are already exploring the world with
              GeoGuess.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-16 px-12 mt-3 text-xl font-semibold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Game
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-white py-12 scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">GeoGuess</h3>
            <p className="text-gray-400">
              Explore the world, one location at a time.
            </p>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                © 2024 GeoGuess. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
