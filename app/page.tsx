'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Clock,
  Trophy,
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
  BellRing,
} from 'lucide-react';

// Institution data (rtseducation.in). F-19: move the stats to a public
// cached API endpoint once one exists.
const stats = [
  { value: '8,415+', label: 'Students taught', icon: GraduationCap },
  { value: '23+', label: 'Running courses', icon: BookOpen },
  { value: '25+', label: 'Expert faculty', icon: Users },
  { value: '10+', label: 'Years of service', icon: Trophy },
];

const courses = [
  {
    id: 1,
    name: 'Diploma in Computer Application (DCA)',
    description:
      'Fundamentals of Computer, MS Windows, MS Office (Word, Excel, Access, PowerPoint). Complete office automation training.',
    duration: '6 Months',
    fee: '₹3,600',
    level: 'Beginner',
    code: 'RC002',
  },
  {
    id: 2,
    name: 'Advanced Diploma in Computer Application (ADCA)',
    description: 'DCA + DTP + Tally. Complete package for computer proficiency with accounting skills.',
    duration: '1 Year',
    fee: '₹10,000',
    level: 'Intermediate',
    code: 'RC007',
  },
  {
    id: 3,
    name: 'Tally Prime with GST',
    description:
      'Financial Accounting with Tally latest version including Inventory, VAT, TDS, TCS, GST, and Payroll management.',
    duration: '3 Months',
    fee: '₹3,000',
    level: 'Beginner',
    code: 'RC003',
  },
  {
    id: 4,
    name: 'Diploma in Financial Accounting (DFA)',
    description: 'DCA + CFA combination. Complete computerized accounting course with practical training.',
    duration: '9 Months',
    fee: '₹5,500',
    level: 'Intermediate',
    code: 'RC004',
  },
  {
    id: 5,
    name: 'PGDCA',
    description:
      'Post Graduate Diploma in Computer Application — Fundamentals, MS-Office, DBMS, Visual Basic, C++, SQL with Project.',
    duration: '18 Months',
    fee: 'Contact Us',
    level: 'Advanced',
    code: 'RC018',
  },
  {
    id: 6,
    name: 'Computer Typing (Hindi & English)',
    description:
      'Professional typing course covering basic typing, lessons, letters, words, and paragraph typing practice.',
    duration: '3 Months',
    fee: '₹2,200',
    level: 'Beginner',
    code: 'RC016',
  },
];

const leadership = [
  {
    name: 'RTS Leadership',
    role: 'Founder & Director',
    description: 'Dedicated to providing quality education to all deserving students across Bihar.',
  },
  {
    name: 'Academic Team',
    role: 'Faculty Head',
    description: 'Expert faculty providing enriched theory and practical lab classes.',
  },
  {
    name: 'Training Team',
    role: 'Placement Coordinator',
    description: 'Job guarantee programs and placement assistance for students.',
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

const notices = [
  { title: 'New Batch — DCA / ADCA', detail: 'Morning batches at 8 AM and 9 AM. Enrolment open at all centers.' },
  { title: 'Tally Prime Batch', detail: 'Sessions at 8 AM, 9 AM and 4 PM. Includes GST and Payroll.' },
  { title: 'KYP Admissions Open', detail: 'Kushal Yuva Program (Government of Bihar scheme) — apply at your nearest center.' },
];

const whyJoinUs = [
  { title: 'Lab Classes', description: 'Enriched theory and practical lab classes for every course.' },
  { title: 'Best Learning', description: 'Qualitative learning inputs and structured curriculum.' },
  { title: 'Recognized Certificates', description: 'Certificates with online verification and best results.' },
  { title: 'Job Guarantee', description: 'Job guarantee in selected programmes for students.' },
];

const navLinks = [
  { href: '#courses', label: 'Courses' },
  { href: '#about', label: 'About' },
  { href: '#notices', label: 'Notices' },
  { href: '#milestones', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'border-line bg-paper/95 shadow-sm backdrop-blur' : 'border-transparent bg-paper'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Crest + wordmark */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-v2.png"
              alt="RTS crest"
              width={44}
              height={44}
              className="h-10 w-auto object-contain"
            />
            <span className="hidden sm:block">
              <span className="block font-serif text-base font-semibold leading-tight text-ink">
                Rajtech Technological Systems
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-ink-muted">
                Computer Education
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Single sign-in: the role comes from the account, not a portal picker */}
          <div className="hidden lg:block">
            <Link href="/login">
              <Button>
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="p-2 text-ink lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="border-t border-line py-4 lg:hidden">
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-2 py-2 text-ink-muted hover:bg-muted hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
              <Link href="/login" className="mt-2 px-2">
                <Button className="w-full">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Button>
              </Link>
              <p className="mt-3 px-2 text-center text-sm text-ink-muted">
                New student? Contact your nearest RTS center to get registered.
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="border-b border-line bg-paper pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
            Rajtech Technological Systems Pvt. Ltd. — Est. 2015, Bihar
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Computer education with the rigor of an institution
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Recognized diploma and certificate courses in computer applications, accounting, and
            typing — taught in classrooms and labs across our franchise network, with verifiable
            certificates.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#courses">
              <Button size="lg" className="w-full sm:w-auto">
                Browse the course catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <LogIn className="h-4 w-4" />
                Sign in to your portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats — ledger row */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 divide-line rounded-md border border-line bg-surface shadow-sm sm:divide-x lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-6 text-center">
                <Icon className="mx-auto mb-3 h-5 w-5 text-primary" />
                <div className="font-mono text-2xl font-semibold tabular-nums text-ink">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NoticesSection() {
  return (
    <section id="notices" className="border-b border-line bg-surface py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-2xl font-semibold text-ink">Notice board</h2>
        </div>
        <div className="divide-y divide-line rounded-md border border-line">
          {notices.map((notice, idx) => (
            <div key={idx} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-widest text-primary">
                Admission
              </span>
              <div>
                <p className="font-medium text-ink">{notice.title}</p>
                <p className="text-sm text-ink-muted">{notice.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section id="courses" className="border-b border-line bg-paper py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            Course catalog
          </p>
          <h2 className="font-serif text-3xl font-semibold text-ink">Programs of study</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            Structured curriculum with theory, lab practice, and examinations. Fees are payable in
            installments at your center.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group rounded-md border-line bg-surface shadow-sm transition-colors hover:border-primary/40"
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
                    {course.name}
                  </h3>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    {course.code}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-ink-muted">{course.description}</p>

                <div className="mt-auto">
                  <div className="mb-4 flex flex-wrap gap-4 text-sm text-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {course.duration}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-widest">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-4">
                    <span className="font-mono text-lg font-semibold tabular-nums text-ink">
                      {course.fee}
                    </span>
                    <Link
                      href="/login"
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                      Enquire <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink-muted">
          Admissions are handled at your nearest RTS center. Existing students can{' '}
          <Link href="/login" className="text-primary hover:underline underline-offset-4">
            sign in
          </Link>{' '}
          to track progress, payments, and certificates.
        </p>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="border-b border-line bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
              About RTS
            </p>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-ink">
              A mission to provide quality education to all who deserve it
            </h2>
            <p className="mb-4 leading-relaxed text-ink-muted">
              Rajtech Technological System Private Limited (RTS) is fully devoted to providing
              world-class computer education. We work with passion and believe in delivering the
              very best, using contemporary technologies to offer programs with quality and
              punctuality.
            </p>
            <blockquote className="mb-8 border-l-2 border-primary pl-4 font-serif text-lg italic text-ink">
              “We have no competition, we become competition.”
            </blockquote>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {whyJoinUs.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-accent-soft p-2">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="block font-medium text-ink">{item.title}</span>
                    <span className="text-sm text-ink-muted">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-md border border-line bg-paper p-10 shadow-sm">
              <Image
                src="/logo-v2.png"
                alt="RTS crest"
                width={280}
                height={280}
                className="h-64 w-auto object-contain"
              />
              <p className="mt-6 text-center font-serif text-sm text-ink">
                Rajtech Technological Systems
              </p>
              <p className="text-center text-[10px] uppercase tracking-widest text-ink-muted">
                Hilsa · Nalanda · Bihar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  return (
    <section id="directors" className="border-b border-line bg-paper py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            Leadership
          </p>
          <h2 className="font-serif text-3xl font-semibold text-ink">The people behind RTS</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {leadership.map((person, idx) => (
            <Card key={idx} className="rounded-md border-line bg-surface text-center shadow-sm">
              <CardContent className="p-8">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-accent-soft font-serif text-xl font-semibold text-primary">
                  {person.name.charAt(0)}
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink">{person.name}</h3>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-primary">
                  {person.role}
                </p>
                <p className="text-sm text-ink-muted">{person.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function MilestonesSection() {
  return (
    <section id="milestones" className="border-b border-line bg-surface py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            Our journey
          </p>
          <h2 className="font-serif text-3xl font-semibold text-ink">A decade of steady growth</h2>
        </div>

        <ol className="relative border-l border-line pl-8">
          {milestones.map((milestone, idx) => (
            <li key={idx} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[37px] top-1 h-2.5 w-2.5 rounded-full border border-primary bg-surface" />
              <span className="font-mono text-sm tabular-nums text-primary">{milestone.year}</span>
              <h3 className="mt-1 font-serif text-lg font-semibold text-ink">{milestone.title}</h3>
              <p className="text-sm text-ink-muted">{milestone.subtitle}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="border-b border-line bg-accent-soft py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-semibold text-ink">
          Ready to begin your course of study?
        </h2>
        <p className="mt-3 text-ink-muted">
          Visit your nearest RTS center for admission, or sign in if you already have an account.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          </Link>
          <a href="#contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Contact a center
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <Image
                src="/logo-v2.png"
                alt="RTS crest"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span>
                <span className="block font-serif text-base font-semibold leading-tight text-ink">
                  Rajtech Technological Systems
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-ink-muted">
                  Computer Education
                </span>
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-ink-muted">
              Quality computer education for all — world-class training in DCA, ADCA, Tally, and
              more, across our franchise network.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="rounded-md border border-line p-2 text-ink-muted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink">
              Quick links
            </h3>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-ink-muted transition-colors hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink">
              Portal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/login" className="text-ink-muted transition-colors hover:text-primary">
                  Sign in
                </Link>
              </li>
              <li className="text-ink-muted">
                Students, staff, directors, and franchise admins all sign in with the account issued
                by their institution.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                Hilsa, Nalanda, Bihar, India
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +91 9931005560
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                info@rtseducation.in
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8 text-center text-sm text-ink-muted">
          <p>
            &copy; {new Date().getFullYear()} Rajtech Technological System Private Limited (RTS).
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <HeroSection />
      <NoticesSection />
      <CoursesSection />
      <AboutSection />
      <LeadershipSection />
      <MilestonesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
