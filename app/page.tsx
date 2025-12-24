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
  LogIn,
} from 'lucide-react';

// Company Data - Real data from rtseducation.in
const stats = [
  { value: '8415+', label: 'Total Students', icon: GraduationCap },
  { value: '23+', label: 'Running Courses', icon: BookOpen },
  { value: '25+', label: 'Expert Faculty', icon: Users },
  { value: '10+', label: 'Years Experience', icon: Trophy },
];

// Course Categories
const courseCategories = [
  { name: 'Diploma Courses', count: '11+ Courses', color: 'from-green-600 to-emerald-600' },
  { name: 'Certificate Courses', count: '5+ Courses', color: 'from-blue-600 to-blue-700' },
  { name: 'University Courses', count: 'Recognized', color: 'from-red-600 to-red-700' },
  { name: 'Kushal Yuva Program', count: 'Govt. Scheme', color: 'from-orange-600 to-orange-700' },
  { name: 'Competition Zone', count: 'Exam Prep', color: 'from-purple-600 to-purple-700' },
  { name: 'Internship', count: 'Job Ready', color: 'from-green-700 to-green-800' },
];

const courses = [
  {
    id: 1,
    name: 'Diploma in Computer Application (DCA)',
    description: 'Fundamentals of Computer, MS Windows, MS Office (Word, Excel, Access, PowerPoint). Complete office automation training.',
    duration: '6 Months',
    fee: '₹3,600',
    level: 'Beginner',
    popular: true,
    code: 'RC002',
  },
  {
    id: 2,
    name: 'Advanced Diploma in Computer Application (ADCA)',
    description: 'DCA + DTP + Tally. Complete package for computer proficiency with accounting skills.',
    duration: '1 Year',
    fee: '₹10,000',
    level: 'Intermediate',
    popular: true,
    code: 'RC007',
  },
  {
    id: 3,
    name: 'Tally Prime with GST',
    description: 'Financial Accounting with Tally latest version including Inventory, VAT, TDS, TCS, GST, and Payroll management.',
    duration: '3 Months',
    fee: '₹3,000',
    level: 'Beginner',
    popular: true,
    code: 'RC003',
  },
  {
    id: 4,
    name: 'Diploma in Financial Accounting (DFA)',
    description: 'DCA + CFA combination. Complete computerized accounting course with practical training.',
    duration: '9 Months',
    fee: '₹5,500',
    level: 'Intermediate',
    popular: false,
    code: 'RC004',
  },
  {
    id: 5,
    name: 'PGDCA',
    description: 'Post Graduate Diploma in Computer Application - Fundamentals, MS-Office, DBMS, Visual Basic, C++, SQL with Project.',
    duration: '18 Months',
    fee: 'Contact Us',
    level: 'Advanced',
    popular: false,
    code: 'RC018',
  },
  {
    id: 6,
    name: 'Computer Typing (Hindi & English)',
    description: 'Professional typing course covering basic typing, lessons, letters, words, and paragraph typing practice.',
    duration: '3 Months',
    fee: '₹2,200',
    level: 'Beginner',
    popular: false,
    code: 'RC016',
  },
];

const directors = [
  {
    name: 'RTS Leadership',
    role: 'Founder & Director',
    description: 'Dedicated to providing quality education to all deserving students across Bihar.',
    image: '👨‍💼',
  },
  {
    name: 'Academic Team',
    role: 'Faculty Head',
    description: 'Expert faculty providing enriched theory and practical lab classes.',
    image: '👩‍🏫',
  },
  {
    name: 'Training Team',
    role: 'Placement Coordinator',
    description: 'Job guarantee programs and placement assistance for students.',
    image: '👨‍💻',
  },
];

const milestones = [
  { year: '2015', title: 'Founded', subtitle: 'Started in Hilsa, Bihar' },
  { year: '2017', title: 'Expansion', subtitle: 'Multiple centers opened' },
  { year: '2019', title: '5000+ Students', subtitle: 'Major milestone' },
  { year: '2021', title: 'Digital Growth', subtitle: 'Online exam system' },
  { year: '2023', title: '8000+ Students', subtitle: 'Continued expansion' },
  { year: '2025', title: 'New Platform', subtitle: 'Modern LMS launch' },
];

const events = [
  { title: 'New Batch - DCA/ADCA', subtitle: 'Morning 8AM & 9AM', color: 'from-green-600 to-emerald-600' },
  { title: 'Tally Prime Batch', subtitle: '8AM, 9AM, 4PM', color: 'from-blue-600 to-blue-700' },
  { title: 'KYP Admissions Open', subtitle: 'Govt. Scheme', color: 'from-orange-600 to-orange-700' },
];

const whyJoinUs = [
  { title: 'Lab Classes', description: 'We provide enriched theory and lab classes for students.' },
  { title: 'Best Learning', description: 'We provide the better qualitative learning inputs for students.' },
  { title: 'Globally Certified', description: 'Certificates of global recognition and best results.' },
  { title: 'Job Guarantee', description: 'Job guarantee in certain programmes for students.' },
];



// Navigation with Login Dropdown
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const loginOptions = [
    { id: 'student', label: 'Student Portal', icon: GraduationCap, href: '/login?type=student', color: 'text-green-400' },
    { id: 'staff', label: 'Staff Portal', icon: Users, href: '/login?type=staff', color: 'text-blue-400' },
    { id: 'director', label: 'Director Portal', icon: Briefcase, href: '/login?type=director', color: 'text-red-400' },
    { id: 'franchise', label: 'Franchise Admin', icon: Building2, href: '/login?type=franchise', color: 'text-green-500' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setLoginDropdownOpen(false);
    if (loginDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [loginDropdownOpen]);

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

          {/* Login Dropdown - Desktop */}
          <div className="hidden lg:flex items-center gap-4 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLoginDropdownOpen(!loginDropdownOpen);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-green-600/30 transition-all"
            >
              <LogIn className="h-4 w-4" />
              Login
              <ChevronDown className={`h-4 w-4 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {loginDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Select Portal
                  </div>
                  {loginOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Link
                        key={option.id}
                        href={option.href}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
                      >
                        <Icon className={`h-5 w-5 ${option.color}`} />
                        <span className="text-white group-hover:text-green-400 transition-colors">{option.label}</span>
                      </Link>
                    );
                  })}
                  <div className="border-t border-slate-700 mt-2 pt-2 px-3 pb-2">
                    <Link href="/signup" className="text-sm text-slate-400 hover:text-green-400">
                      New student? <span className="font-medium">Register here</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
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

              {/* Mobile Login Options */}
              <div className="border-t border-slate-700 pt-4 mt-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Login Portals
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {loginOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Link
                        key={option.id}
                        href={option.href}
                        className="flex items-center gap-2 bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        <span className="text-white text-sm">{option.label}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-3 text-center">
                  <Link href="/signup" className="text-sm text-slate-400 hover:text-green-400">
                    New student? <span className="font-medium">Register here</span>
                  </Link>
                </div>
              </div>
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

// Quick Access Login Section
function QuickAccessSection() {
  const portals = [
    {
      id: 'student',
      label: 'Student Portal',
      description: 'Access courses, certificates & learning materials',
      icon: GraduationCap,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-600/10',
      borderColor: 'border-green-600/30',
      href: '/login?type=student',
    },
    {
      id: 'staff',
      label: 'Staff Portal',
      description: 'View attendance, payroll & work schedules',
      icon: Users,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/30',
      href: '/login?type=staff',
    },
    {
      id: 'director',
      label: 'Director Portal',
      description: 'Oversee multiple centers & analytics',
      icon: Briefcase,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-600/10',
      borderColor: 'border-red-600/30',
      href: '/login?type=director',
    },
    {
      id: 'franchise',
      label: 'Franchise Admin',
      description: 'Manage your franchise center operations',
      icon: Building2,
      color: 'from-green-700 to-green-800',
      bgColor: 'bg-green-700/10',
      borderColor: 'border-green-700/30',
      href: '/login?type=franchise',
    },
  ];

  return (
    <section className="py-16 bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LogIn className="h-6 w-6 text-green-400" />
            <span className="text-green-400 font-semibold text-lg">Quick Access</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Login to Your Portal
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select your role to access your dedicated portal with all the tools you need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link
                key={portal.id}
                href={portal.href}
                className={`group relative p-6 rounded-2xl bg-slate-900/50 border ${portal.borderColor} hover:border-opacity-60 transition-all duration-300 hover:shadow-xl text-center overflow-hidden`}
              >
                {/* Gradient hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {portal.label}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {portal.description}
                  </p>
                  <div className="text-green-400 text-sm font-medium flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Login Now <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-slate-500">
            New student?{' '}
            <Link href="/signup" className="text-green-400 hover:text-green-300 font-medium">
              Register here
            </Link>
          </p>
        </div>
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
            <Badge className="bg-green-600/10 text-green-400 border-green-600/30 mb-4">
              About RTS
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Empowering Students Through Education
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Welcome to RAJTECH TECHNOLOGICAL SYSTEM PRIVATE LIMITED (RTS). It is not just a company but a mission
              to provide quality education to all who deserve it. We live in an extremely competitive era today,
              and the potentiality for growth in numerous industries is unbelievable.
            </p>
            <p className="text-slate-400 mb-6 leading-relaxed">
              RTS Education is fully devoted to providing world-class education. Here we work with passion and
              believe to deliver the very best. We have embraced the most contemporary technologies enabling us
              to offer world-class education programs with quality and punctuality.
            </p>
            <p className="text-slate-400 mb-8 leading-relaxed italic border-l-4 border-green-500 pl-4">
              "We have no competition, We become competition"
            </p>

            <div className="grid grid-cols-2 gap-4">
              {whyJoinUs.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-600/10 mt-1">
                    <Award className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <span className="text-white font-medium block">{item.title}</span>
                    <span className="text-slate-500 text-sm">{item.description}</span>
                  </div>
                </div>
              ))}
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
                <div className="text-xs text-slate-400 font-medium">Globally</div>
                <div className="text-sm font-bold text-white">Certified</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 animate-bounce duration-[4000ms]">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-2xl shadow-xl shadow-green-600/20">
                <div className="text-3xl font-bold text-white">8415+</div>
                <div className="text-xs text-green-100 font-medium">Students</div>
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
              Quality computer education for all. Providing world-class training in DCA, ADCA, Tally, and more.
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
                Hilsa, Nalanda, Bihar, India
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="h-5 w-5 text-green-500" />
                +91 9931005560
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="h-5 w-5 text-green-500" />
                info@rtseducation.in
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} RAJTECH TECHNOLOGICAL SYSTEM PRIVATE LIMITED (RTS). All rights reserved.</p>
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
      <QuickAccessSection />
      <Footer />
    </div>
  );
}
