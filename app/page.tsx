'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Building2,
  ChevronRight,
  ChevronDown,
  Play,
  Star,
  Clock,
  IndianRupee,
  Trophy,
  Target,
  Briefcase,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
} from 'lucide-react';

// Company Data
const stats = [
  { value: '50+', label: 'Franchise Centers', icon: Building2 },
  { value: '10,000+', label: 'Students Trained', icon: GraduationCap },
  { value: '200+', label: 'Expert Faculty', icon: Users },
  { value: '15+', label: 'Years Experience', icon: Trophy },
];

const courses = [
  {
    id: 1,
    name: 'Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React & Node.js. Build real-world projects.',
    duration: '6 months',
    fee: '₹45,000',
    level: 'Beginner to Advanced',
    popular: true,
  },
  {
    id: 2,
    name: 'Python & Data Science',
    description: 'Learn Python, Machine Learning, AI, and Data Analytics from scratch.',
    duration: '6 months',
    fee: '₹55,000',
    level: 'Beginner to Advanced',
    popular: true,
  },
  {
    id: 3,
    name: 'Mobile App Development',
    description: 'Build iOS & Android apps with React Native and Flutter.',
    duration: '4 months',
    fee: '₹40,000',
    level: 'Intermediate',
    popular: false,
  },
  {
    id: 4,
    name: 'UI/UX Design Mastery',
    description: 'Design beautiful interfaces with Figma, Adobe XD, and design thinking.',
    duration: '3 months',
    fee: '₹30,000',
    level: 'Beginner',
    popular: false,
  },
  {
    id: 5,
    name: 'Digital Marketing Pro',
    description: 'SEO, Social Media, Google Ads, Email Marketing & Analytics.',
    duration: '3 months',
    fee: '₹25,000',
    level: 'Beginner',
    popular: false,
  },
  {
    id: 6,
    name: 'Cloud & DevOps',
    description: 'AWS, Azure, Docker, Kubernetes, CI/CD pipelines and more.',
    duration: '4 months',
    fee: '₹50,000',
    level: 'Advanced',
    popular: true,
  },
];

const directors = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Founder & CEO',
    description: '20+ years in IT education. Former professor at IIT Delhi.',
    image: '👨‍💼',
  },
  {
    name: 'Priya Sharma',
    role: 'Director of Operations',
    description: 'MBA from IIM Ahmedabad. Expert in franchise management.',
    image: '👩‍💼',
  },
  {
    name: 'Amit Patel',
    role: 'Chief Technology Officer',
    description: 'Ex-Google engineer. 15 years in software development.',
    image: '👨‍💻',
  },
];

const milestones = [
  { year: '2009', title: 'Founded', subtitle: 'Started with 1 center in Mumbai' },
  { year: '2012', title: '10 Centers', subtitle: 'Expanded across Maharashtra' },
  { year: '2015', title: '1000 Students', subtitle: 'Milestone celebration' },
  { year: '2018', title: 'Pan India', subtitle: 'Centers in 10 states' },
  { year: '2021', title: '5000 Students', subtitle: 'Digital transformation' },
  { year: '2024', title: '50+ Centers', subtitle: 'Continuing to grow' },
];

const events = [
  { title: 'Annual Tech Fest 2024', subtitle: '500+ participants', color: 'from-green-600 to-emerald-600' },
  { title: 'Placement Drive', subtitle: '200+ companies', color: 'from-red-600 to-rose-600' },
  { title: 'Hackathon Championship', subtitle: 'National Level', color: 'from-green-700 to-green-600' },
];

// Navigation
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full group-hover:bg-green-400/30 transition-all duration-500" />
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-white/10 p-2 rounded-xl shadow-2xl shadow-green-900/20">
                <Image
                  src="/logo-v2.png"
                  alt="RTS Logo"
                  width={48}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white leading-tight block tracking-wide">
                RAJTECH
              </span>
              <span className="text-[10px] text-green-400 font-medium tracking-widest uppercase">
                Technological Systems
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#courses" className="text-slate-300 hover:text-white transition-colors">Courses</a>
            <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
            <a href="#directors" className="text-slate-300 hover:text-white transition-colors">Leadership</a>
            <a href="#milestones" className="text-slate-300 hover:text-white transition-colors">Journey</a>
            <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
          </div>

          {/* Login Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-600/30">
                Login / Register
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 py-4">
            <div className="flex flex-col gap-4 px-4">
              <a href="#courses" className="text-slate-300 hover:text-white py-2">Courses</a>
              <a href="#about" className="text-slate-300 hover:text-white py-2">About</a>
              <a href="#directors" className="text-slate-300 hover:text-white py-2">Leadership</a>
              <a href="#milestones" className="text-slate-300 hover:text-white py-2">Journey</a>
              <a href="#contact" className="text-slate-300 hover:text-white py-2">Contact</a>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white">
                  Login / Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Badge className="bg-green-600/10 text-green-400 border-green-600/30 mb-6 px-4 py-2">
          🎓 Rajtech Technological Systems - Trusted by 10,000+ Students
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Your Career with
          <span className="block bg-gradient-to-r from-green-400 via-white to-red-400 bg-clip-text text-transparent">
            Industry-Ready Skills
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10">
          Join Rajtech Technological Systems - India's leading computer education franchise network.
          Learn from industry experts, get certified, and launch your dream career in technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#courses">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-600/30 px-8 py-6 text-lg">
              Explore Courses
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </a>
          <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 px-8 py-6 text-lg">
            <Play className="h-5 w-5 mr-2" />
            Watch Video
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <Icon className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer animate-bounce">
        <span className="text-xs font-medium text-slate-400 tracking-widest uppercase">Scroll Down</span>
        <ChevronDown className="h-6 w-6 text-green-400" />
      </div>
    </section>
  );
}

// Events Section
function EventsSection() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Recent Events & Highlights</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Experience the vibrant learning culture at RTS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl aspect-video cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-80 group-hover:opacity-90 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <Play className="h-16 w-16 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-center">{event.title}</h3>
                <p className="text-white/80">{event.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Courses Section
function CoursesSection() {
  return (
    <section id="courses" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-green-600/10 text-green-400 border-green-600/30 mb-4">
            Our Programs
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Industry-Relevant Courses</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose from our comprehensive curriculum designed by industry experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="bg-slate-900/50 border-slate-800 hover:border-green-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/10 group overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-600/10 to-green-700/10 border border-green-600/20">
                    <BookOpen className="h-6 w-6 text-green-500" />
                  </div>
                  {course.popular && (
                    <Badge className="bg-red-600/10 text-red-400 border-red-600/30">
                      <Star className="h-3 w-3 mr-1" /> Popular
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {course.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm text-slate-300">
                    <Clock className="h-4 w-4 text-green-500" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-300">
                    <Target className="h-4 w-4 text-red-400" />
                    {course.level}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center text-green-400 font-bold text-lg">
                    <IndianRupee className="h-5 w-5" />
                    {course.fee.replace('₹', '')}
                  </div>
                  <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-600/30">
              Enroll Now - Get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-red-600/10 text-red-400 border-red-600/30 mb-4">
              About RTS
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Empowering Students Since 2009
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Rajtech Technological Systems (RTS) is India's premier computer education franchise network,
              dedicated to bridging the gap between traditional education and industry requirements. Our mission
              is to create skilled professionals who can thrive in the digital economy.
            </p>
            <p className="text-slate-400 mb-8 leading-relaxed">
              With 50+ centers across India, we have trained over 10,000 students who are now
              working at top companies like Google, Microsoft, Amazon, and leading startups.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-600/10">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-white">ISO Certified</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-600/10">
                  <Briefcase className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-white">Placement Assistance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-600/10">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-white">Expert Faculty</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-600/10">
                  <Trophy className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-white">Industry Recognition</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-red-600/10 to-green-600/30 blur-3xl rounded-full group-hover:blur-[60px] transition-all duration-700" />
            <div className="relative aspect-square rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shadow-green-900/20 ring-1 ring-white/10 group-hover:ring-green-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-red-500/5 opacity-50" />
              <Image
                src="/logo-v2.png"
                alt="RTS Logo"
                width={300}
                height={300}
                className="w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Floating badges */}
            <div className="absolute -top-6 -right-6 animate-bounce duration-[3000ms]">
              <div className="bg-slate-900/90 backdrop-blur-md border border-green-500/30 p-4 rounded-2xl shadow-xl shadow-green-900/20">
                <Award className="h-8 w-8 text-green-400 mb-1" />
                <div className="text-xs text-slate-400 font-medium">Certified</div>
                <div className="text-sm font-bold text-white">Excellence</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 animate-bounce duration-[4000ms]">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-2xl shadow-xl shadow-green-600/20">
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-xs text-green-100 font-medium">Years Strong</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Directors Section
function DirectorsSection() {
  return (
    <section id="directors" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-green-600/10 text-green-400 border-green-600/30 mb-4">
            Our Leaders
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Meet Our Leadership</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Visionary leaders driving innovation in education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {directors.map((director, idx) => (
            <Card key={idx} className="bg-slate-900/50 border-slate-800 hover:border-green-600/50 transition-all text-center group">
              <CardContent className="p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center mx-auto mb-6 text-5xl group-hover:scale-110 transition-transform shadow-lg shadow-green-600/30">
                  {director.image}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{director.name}</h3>
                <p className="text-green-400 mb-4">{director.role}</p>
                <p className="text-slate-400 text-sm">{director.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Milestones Section
function MilestonesSection() {
  return (
    <section id="milestones" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-red-600/10 text-red-400 border-red-600/30 mb-4">
            Our Journey
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Milestones & Achievements</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            15 years of transforming education across India
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-600 via-white to-red-600 hidden lg:block" />

          <div className="space-y-8 lg:space-y-0">
            {milestones.map((milestone, idx) => (
              <div key={idx} className={`lg:flex items-center gap-8 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                <div className={`lg:w-1/2 ${idx % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                  <Card className="bg-slate-900/50 border-slate-800 inline-block hover:border-green-600/50 transition-all">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-green-400 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-white mb-1">{milestone.title}</h3>
                      <p className="text-slate-400">{milestone.subtitle}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-green-600 to-green-700 border-4 border-slate-900" style={{ top: `${idx * 16.67}%` }} />
                <div className="lg:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-700 via-green-600 to-green-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-green-100 text-lg mb-8">
          Join thousands of students who have transformed their careers with RTS
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 px-8 py-6 text-lg font-semibold">
              Student Login
              <GraduationCap className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Link href="/login?type=franchise">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              Franchise Login
              <Building2 className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative p-2 bg-slate-900 rounded-xl border border-white/10 shadow-lg shadow-green-900/10 group-hover:border-green-500/30 transition-colors">
                <Image
                  src="/logo-v2.png"
                  alt="RTS Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white block tracking-wide">RAJTECH</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-green-400 transition-colors">Technological Systems</span>
              </div>
            </Link>
            <p className="text-slate-400 mb-6">
              India's leading computer education franchise network. Transforming careers since 2009.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-green-600/20">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-green-600/20">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-green-600/20">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-green-600/20">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#courses" className="text-slate-400 hover:text-green-400 transition-colors">Courses</a></li>
              <li><a href="#about" className="text-slate-400 hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="#directors" className="text-slate-400 hover:text-green-400 transition-colors">Leadership</a></li>
              <li><a href="#milestones" className="text-slate-400 hover:text-green-400 transition-colors">Our Journey</a></li>
              <li><Link href="/login" className="text-slate-400 hover:text-green-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Login Options */}
          <div>
            <h3 className="text-white font-semibold mb-4">Portal Login</h3>
            <ul className="space-y-3">
              <li><Link href="/login?type=franchise" className="text-slate-400 hover:text-green-400 transition-colors">Franchise Admin</Link></li>
              <li><Link href="/login?type=director" className="text-slate-400 hover:text-green-400 transition-colors">Director Login</Link></li>
              <li><Link href="/login?type=student" className="text-slate-400 hover:text-green-400 transition-colors">Student Login</Link></li>
              <li><Link href="/login?type=staff" className="text-slate-400 hover:text-green-400 transition-colors">Staff Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-5 w-5 text-green-500" />
                Mumbai, Maharashtra, India
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="h-5 w-5 text-green-500" />
                +91 22 1234 5678
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="h-5 w-5 text-green-500" />
                info@techedu.in
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Rajtech Technological Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <EventsSection />
      <CoursesSection />
      <AboutSection />
      <DirectorsSection />
      <MilestonesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
