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
  ChevronLeft,
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
  MonitorSmartphone,
  Calculator,
  Keyboard,
  Building2,
  School,
  Camera,
  CalendarDays,
  Sparkles,
  Images,
  type LucideIcon,
} from 'lucide-react';
import { NoticeTicker, type Notice } from '@/components/dashboard/notice-ticker';
import { Photo } from '@/components/site/photo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PublicChatWidget } from '@/components/chat/PublicChatWidget';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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

// Journey timeline. Each year is a clickable card that opens a story dialog
// with that year's photos. Photos drop into public/gallery/journey/<year>/
// as NN.jpg (same convention as the gallery albums); placeholders show until
// the files exist.
interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  /** 2–3 sentences shown beside the photos in the year dialog. */
  story: string;
  /** Number of photo slots at /gallery/journey/<year>/NN.jpg */
  shots: number;
  tint: Tint;
}

const milestones: Milestone[] = [
  {
    year: '2015',
    title: 'Founded',
    subtitle: 'Started in Hilsa, Bihar',
    story:
      'RTS opened its first classroom in Hilsa with a handful of machines and one batch of students. The goal from day one was simple: practical, job-ready computer education close to home.',
    shots: 4,
    tint: 'green',
  },
  {
    year: '2017',
    title: 'Expansion',
    subtitle: 'Multiple centers opened',
    story:
      'Demand quickly outgrew the first center. New campuses opened in neighbouring towns, each with the same labs, curriculum, and faculty standards as the original.',
    shots: 4,
    tint: 'ink',
  },
  {
    year: '2019',
    title: '5000+ Students',
    subtitle: 'Major milestone',
    story:
      'Five thousand students trained — celebrated with our biggest convocation yet. Alumni from the earliest batches returned as guests, many now working in the roles they trained for.',
    shots: 5,
    tint: 'gold',
  },
  {
    year: '2021',
    title: 'Digital Growth',
    subtitle: 'Online exam system',
    story:
      'RTS moved examinations online, with digital admit cards and instantly verifiable certificates. Students could now sit standardized exams at any center and check results from home.',
    shots: 4,
    tint: 'green',
  },
  {
    year: '2023',
    title: '8000+ Students',
    subtitle: 'Continued expansion',
    story:
      'Past eight thousand students and still growing — with KYP (Kushal Yuva Program) batches, new Tally Prime courses, and placement support widening what each center offers.',
    shots: 5,
    tint: 'ink',
  },
  {
    year: '2025',
    title: 'New Platform',
    subtitle: 'Modern LMS launch',
    story:
      'The modern RTS platform launched: online attendance, fee tracking, results, and study material in one place for students, faculty, and center directors.',
    shots: 4,
    tint: 'gold',
  },
];

/** Photo paths for a journey year: /gallery/journey/<year>/01.jpg … NN.jpg */
function milestonePhotos(m: Milestone): string[] {
  return Array.from(
    { length: m.shots },
    (_, i) => `/gallery/journey/${m.year}/${String(i + 1).padStart(2, '0')}.jpg`
  );
}

// Gallery albums. Each tile is a cover thumbnail; clicking it opens a lightbox
// with all photos in that album. Photos drop into public/gallery/<id>/NN.jpg
// (see public/gallery/README.md); until then every slot shows a placeholder.
type Tint = 'green' | 'gold' | 'ink';
interface Album {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
  tint: Tint;
  shots: number;
}

const galleryAlbums: Album[] = [
  { id: 'campus', label: 'Our Campuses', blurb: 'Our centers across Bihar', icon: Building2, tint: 'green', shots: 5 },
  { id: 'classrooms', label: 'Classrooms & Labs', blurb: 'Where the learning happens', icon: School, tint: 'ink', shots: 5 },
  { id: 'faculty', label: 'Faculty', blurb: 'The teachers behind every batch', icon: GraduationCap, tint: 'green', shots: 4 },
  { id: 'staff', label: 'Staff', blurb: 'The team that keeps our centers running', icon: Users, tint: 'ink', shots: 4 },
  { id: 'convocation', label: 'Convocation', blurb: 'Certificates and proud moments', icon: Award, tint: 'gold', shots: 6 },
  { id: 'events', label: 'Events', blurb: 'Competitions, celebrations, and workshops', icon: CalendarDays, tint: 'gold', shots: 6 },
  { id: 'student-life', label: 'Student Life', blurb: 'Everyday moments across our centers', icon: Sparkles, tint: 'ink', shots: 4 },
];

/** Photo paths for an album: /gallery/<id>/01.jpg … /gallery/<id>/NN.jpg */
function albumPhotos(album: Album): string[] {
  return Array.from(
    { length: album.shots },
    (_, i) => `/gallery/${album.id}/${String(i + 1).padStart(2, '0')}.jpg`
  );
}

/** Pick a subject icon for a course from its name. */
function courseIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('tally') || n.includes('account') || n.includes('financial') || n.includes('gst')) return Calculator;
  if (n.includes('typing')) return Keyboard;
  return MonitorSmartphone;
}

// Faded background images that cross-fade behind the hero headline. Add more
// files as /gallery/hero/02.jpg, 03.jpg … and list them here; the carousel
// cycles through whatever is present.
const heroImages = [
  '/gallery/hero/01.jpg',
  '/gallery/hero/02.jpg',
  '/gallery/hero/03.jpg',
];

// Notices for the always-on ribbon at the top of the page.
const homeNotices: Notice[] = [
  { tag: 'Batch', text: 'New DCA / ADCA morning batches at 8 AM & 9 AM — enrolment open at all centers.' },
  { tag: 'Batch', text: 'Tally Prime batch: sessions at 8 AM, 9 AM & 4 PM, including GST and Payroll.' },
  { tag: 'Admission', text: 'KYP (Kushal Yuva Program, Govt. of Bihar) admissions open — apply at your nearest center.' },
  { tag: 'Notice', text: 'Verifiable certificates issued for all recognized diploma and certificate courses.' },
];

const whyJoinUs = [
  { title: 'Lab Classes', description: 'Enriched theory and practical lab classes for every course.' },
  { title: 'Best Learning', description: 'Qualitative learning inputs and structured curriculum.' },
  { title: 'Recognized Certificates', description: 'Certificates with online verification and best results.' },
  { title: 'Job Guarantee', description: 'Job guarantee in selected programmes for students.' },
];

const navLinks = [
  { href: '#courses', label: 'Courses' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#about', label: 'About' },
  { href: '#milestones', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

/** True once the page has scrolled past the hero's top edge. The navbar and
 *  the notice ribbon pinned under it both key off this so they resize in
 *  lockstep. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrolled;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrolled();
  const [activeSection, setActiveSection] = useState('');

  // Track which section is in view so the nav underline follows the reader.
  // The rootMargin narrows the viewport to a band around its upper third, so
  // exactly one section "wins" at a time.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'border-line bg-paper/95 shadow-sm backdrop-blur' : 'border-transparent bg-paper'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex items-center justify-between transition-[height] duration-300',
            scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20'
          )}
        >
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

          {/* Desktop nav: tracked small-caps links; the primary-color
              underline sits under the section currently in view and shows
              faintly on hover elsewhere. */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative py-1 text-xs font-medium uppercase tracking-[0.18em] transition-colors',
                    isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded-full bg-primary transition-all duration-300',
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40'
                    )}
                  />
                </a>
              );
            })}
          </div>

          {/* Single sign-in: the role comes from the account, not a portal picker */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Link href="/login">
              <Button>
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            </Link>
          </div>

          {/* Mobile: theme toggle + menu button */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-ink"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — stays mounted so it can ease open/closed; `inert`
            keeps the collapsed links out of the tab order. */}
        <div
          inert={!isOpen}
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden',
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-line px-2 py-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-muted text-ink'
                        : 'text-ink-muted hover:bg-muted hover:text-ink'
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
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
        </div>
      </div>
    </nav>
  );
}

/**
 * Cross-fading faded backdrop for the hero. Cycles through `heroImages`,
 * showing each for `intervalMs` before dissolving to the next; a single image
 * just stays put. Pauses under prefers-reduced-motion.
 */
function HeroCarousel({ images, intervalMs = 6000 }: { images: string[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((src, i) => (
        <div
          key={src}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Photo src={src} alt="" tint="green" className="h-full w-full" imgClassName="opacity-100" />
        </div>
      ))}
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper pt-28 lg:pt-36">
      {/* Faded institute photos behind the headline, cross-fading on a loop.
          Placeholder gradients fill any slot without a file yet; paper scrims
          keep it a soft wash so the headline and stats stay crisp. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <HeroCarousel images={heroImages} />
        <div className="absolute inset-0 bg-paper/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-paper/65 to-paper" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
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

/**
 * Always-on notice ribbon. Pinned directly under the fixed navbar so the
 * institution's notices are visible the moment the page loads and stay in
 * view while the visitor scrolls. Replaces the old static "Notice board"
 * section — the notices now cycle past on their own.
 */
function NoticeRibbon() {
  const scrolled = useScrolled();
  return (
    <div
      className={cn(
        'fixed inset-x-0 z-40 border-b border-line bg-paper/95 backdrop-blur transition-[top] duration-300',
        scrolled ? 'top-14 lg:top-16' : 'top-16 lg:top-20'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <NoticeTicker notices={homeNotices} />
      </div>
    </div>
  );
}

// Filter chips: "All" plus each level, in teaching order.
const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced'];
const courseFilters = [
  'All',
  ...LEVEL_ORDER.filter((lvl) => courses.some((c) => c.level === lvl)),
];

function CoursesSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const visible =
    activeFilter === 'All' ? courses : courses.filter((c) => c.level === activeFilter);

  return (
    <section id="courses" className="border-b border-line bg-paper py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            Course catalog
          </p>
          <h2 className="font-serif text-3xl font-semibold text-ink">Programs of study</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            Structured curriculum with theory, lab practice, and examinations. Fees are payable in
            installments at your center.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {courseFilters.map((filter) => {
            const isActive = activeFilter === filter;
            const count =
              filter === 'All' ? courses.length : courses.filter((c) => c.level === filter).length;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={isActive}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-ink'
                )}
              >
                {filter}
                <span
                  className={cn(
                    'ml-1.5 font-mono text-xs tabular-nums',
                    isActive ? 'text-primary-foreground/70' : 'text-ink-muted/70'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* key on the filter so cards re-run their entrance animation when it changes */}
        <div key={activeFilter} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((course, i) => {
            const Icon = courseIcon(course.name);
            return (
              <Card
                key={course.id}
                className={cn(
                  'rts-glow-card group rounded-md border-line bg-surface shadow-sm rts-rise',
                  `rts-rise-${Math.min(i + 1, 5)}`
                )}
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-soft transition-transform duration-200 group-hover:scale-105">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {course.code}
                    </span>
                  </div>

                  <h3 className="mb-2 font-serif text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
                    {course.name}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-ink-muted">{course.description}</p>

                  <div className="mt-auto">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs text-ink-muted">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {course.duration}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-widest text-ink-muted">
                        {course.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-line pt-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-ink-muted">
                          Course fee
                        </span>
                        <span className="font-mono text-lg font-semibold tabular-nums text-ink">
                          {course.fee}
                        </span>
                      </div>
                      <Link
                        href="/login"
                        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent-soft"
                      >
                        Enquire{' '}
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

function GallerySection() {
  const [active, setActive] = useState<Album | null>(null);
  // Index of the photo open in the full-size viewer, or null when just the
  // album grid is showing. The viewer layers on top of the grid.
  const [viewer, setViewer] = useState<number | null>(null);

  const photos = active ? albumPhotos(active) : [];
  const count = photos.length;

  const closeAlbum = () => {
    setActive(null);
    setViewer(null);
  };
  const step = (dir: number) =>
    setViewer((v) => (v === null ? v : (v + dir + count) % count));

  // Arrow keys page through the viewer; Escape steps back to the grid.
  useEffect(() => {
    if (viewer === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setViewer((v) => (v === null ? v : (v - 1 + count) % count));
      else if (e.key === 'ArrowRight') setViewer((v) => (v === null ? v : (v + 1) % count));
      else if (e.key === 'Escape') setViewer(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewer, count]);

  return (
    <section id="gallery" className="border-b border-line bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
            <Camera className="h-4 w-4" />
            Life at RTS
          </p>
          <h2 className="font-serif text-3xl font-semibold text-ink">A look inside our institution</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            Explore our campuses, faculty, events, and celebrations — tap any album to see more.
          </p>
        </div>

        {/* Bento grid: the first album spans larger so campus reads as the feature. */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryAlbums.map((album, i) => {
            const feature = i === 0;
            return (
              <button
                key={album.id}
                type="button"
                onClick={() => setActive(album)}
                aria-label={`Open ${album.label} album`}
                className={cn(
                  'group relative overflow-hidden rounded-md border border-line text-left shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  feature ? 'col-span-2 row-span-2 md:col-span-2' : 'col-span-1'
                )}
              >
                <Photo
                  src={`/gallery/${album.id}/01.jpg`}
                  alt={album.label}
                  label={album.label}
                  icon={album.icon}
                  tint={album.tint}
                  className={cn('h-full w-full', feature ? 'aspect-square md:aspect-auto' : 'aspect-[4/3]')}
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />

                {/* Photo-count badge signals this tile is an album, not a single image. */}
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                  <Images className="h-3 w-3" />
                  {album.shots}
                </span>

                {/* Caption + "View album" affordance; always shown on the feature tile. */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-4 transition-opacity duration-300',
                    feature ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  <span className="block font-serif text-sm font-semibold text-white">{album.label}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80">
                    View album <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Album lightbox — grid of photos; closes on outside click / Escape / ×. */}
      <Dialog open={!!active} onOpenChange={(open) => !open && closeAlbum()}>
        <DialogContent className="max-h-[88vh] max-w-4xl overflow-hidden border-line bg-surface p-0">
          {active && (
            <>
              <DialogHeader className="border-b border-line px-6 pt-6 pb-4">
                <DialogTitle className="flex items-center gap-2 font-serif text-xl text-ink">
                  <active.icon className="h-5 w-5 text-primary" />
                  {active.label}
                </DialogTitle>
                <DialogDescription className="text-ink-muted">
                  {active.blurb} · {active.shots} photos · tap a photo to enlarge
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setViewer(i)}
                      aria-label={`Enlarge photo ${i + 1}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-md border border-line focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <Photo
                        src={src}
                        alt={`${active.label} — photo ${i + 1}`}
                        icon={active.icon}
                        tint={active.tint}
                        className="h-full w-full"
                        imgClassName="transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Full-size photo viewer — the entire photo, with prev / next / close.
          A separate dialog stacked above the album grid, so Escape or an
          outside click steps back to the grid rather than closing everything. */}
      <Dialog open={viewer !== null} onOpenChange={(open) => !open && setViewer(null)}>
        <DialogContent
          showCloseButton={false}
          className="left-0 top-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-ink/95 p-0 sm:max-w-none"
        >
          {active && viewer !== null && (
            <div
              className="relative flex h-full w-full items-center justify-center p-4 sm:p-8"
              onClick={() => setViewer(null)}
            >
              <DialogTitle className="sr-only">
                {active.label} — photo {viewer + 1} of {count}
              </DialogTitle>

              <button
                type="button"
                onClick={() => setViewer(null)}
                aria-label="Close photo"
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              {count > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <figure
                className="relative flex max-h-full flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Photo
                  src={photos[viewer]}
                  alt={`${active.label} — photo ${viewer + 1}`}
                  icon={active.icon}
                  tint={active.tint}
                  fit="contain"
                  className="h-[76vh] w-[86vw] max-w-5xl"
                />
                <figcaption className="mt-3 text-center text-sm text-white/80">
                  {active.label} · {viewer + 1} / {count}
                </figcaption>
              </figure>

              {count > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden border-b border-line bg-surface py-20">
      {/* Faded backdrop; placeholder texture until /gallery/about.jpg exists. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Photo src="/gallery/about.jpg" alt="" tint="ink" className="h-full w-full" />
        <div className="absolute inset-0 bg-surface/88" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
  const [active, setActive] = useState<Milestone | null>(null);
  // Photo currently enlarged in the year dialog; hovering (or tapping) a
  // thumbnail swaps it in, so visitors read the story and browse photos at
  // the same time.
  const [featured, setFeatured] = useState(0);

  const photos = active ? milestonePhotos(active) : [];

  const openYear = (m: Milestone) => {
    setActive(m);
    setFeatured(0);
  };

  return (
    <section id="milestones" className="border-b border-line bg-surface py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            Our journey
          </p>
          <h2 className="font-serif text-3xl font-semibold text-ink">A decade of steady growth</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            Tap any year to see the photos and the story behind it.
          </p>
        </div>

        {/* Alternating timeline: cards zigzag around a center spine on
            desktop, single column on mobile. Each card is a button that
            opens the year's story dialog. */}
        <ol className="relative">
          <div
            className="absolute left-4 top-1 h-full w-px bg-line md:left-1/2"
            aria-hidden
          />
          {milestones.map((m, idx) => {
            const onLeft = idx % 2 === 0;
            return (
              <li
                key={m.year}
                className={cn(
                  'relative pb-8 pl-12 last:pb-0 md:w-1/2 md:pl-0',
                  onLeft ? 'md:pr-10' : 'md:ml-auto md:pl-10'
                )}
              >
                {/* spine dot */}
                <span
                  className={cn(
                    'absolute left-[12px] top-7 h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface',
                    onLeft ? 'md:left-auto md:-right-[5px]' : 'md:-left-[5px]'
                  )}
                  aria-hidden
                />

                <button
                  type="button"
                  onClick={() => openYear(m)}
                  aria-label={`${m.year} — ${m.title}: view photos and story`}
                  className="rts-glow-card group w-full rounded-md border border-line bg-paper p-5 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span className="font-mono text-sm tabular-nums text-primary">{m.year}</span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-ink">{m.title}</h3>
                  <p className="text-sm text-ink-muted">{m.subtitle}</p>

                  {/* Photo fan: overlapping thumbnails that spread slightly
                      on hover, hinting the card opens an album. */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex -space-x-3">
                      {milestonePhotos(m).slice(0, 3).map((src, i) => (
                        <span
                          key={src}
                          className={cn(
                            'h-11 w-11 overflow-hidden rounded-md border-2 border-paper shadow-sm transition-transform duration-300',
                            i === 0 && 'group-hover:-translate-y-0.5 group-hover:-rotate-6',
                            i === 1 && 'group-hover:-translate-y-1',
                            i === 2 && 'group-hover:-translate-y-0.5 group-hover:rotate-6'
                          )}
                        >
                          <Photo src={src} alt="" tint={m.tint} className="h-full w-full" />
                        </span>
                      ))}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-ink-muted transition-colors group-hover:text-primary">
                      <Images className="h-3 w-3" />
                      {m.shots} photos
                      <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Year dialog: story text beside a featured photo; hovering a
          thumbnail swaps it into the big slot. */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-hidden border-line bg-surface p-0">
          {active && (
            <>
              <DialogHeader className="border-b border-line px-6 pt-6 pb-4">
                <DialogTitle className="flex items-baseline gap-3 font-serif text-xl text-ink">
                  <span className="font-mono text-base tabular-nums text-primary">
                    {active.year}
                  </span>
                  {active.title}
                </DialogTitle>
                <DialogDescription className="text-ink-muted">
                  {active.subtitle}
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
                  <div>
                    {/* Keyed by src: Photo tracks load/error state internally,
                        so remount it rather than swapping src in place. */}
                    <Photo
                      key={photos[featured]}
                      src={photos[featured]}
                      alt={`${active.year} — photo ${featured + 1} of ${photos.length}`}
                      label={`${active.year} · ${active.title}`}
                      icon={Camera}
                      tint={active.tint}
                      className="aspect-[4/3] w-full rounded-md border border-line"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((src, i) => (
                        <button
                          key={src}
                          type="button"
                          onMouseEnter={() => setFeatured(i)}
                          onFocus={() => setFeatured(i)}
                          onClick={() => setFeatured(i)}
                          aria-label={`Show photo ${i + 1}`}
                          className={cn(
                            'aspect-[4/3] w-16 overflow-hidden rounded-md border transition-all',
                            i === featured
                              ? 'border-primary ring-1 ring-primary'
                              : 'border-line opacity-70 hover:opacity-100'
                          )}
                        >
                          <Photo src={src} alt="" tint={active.tint} className="h-full w-full" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm leading-relaxed text-ink-muted">
                    <p>{active.story}</p>
                    <p className="mt-4 text-xs uppercase tracking-wider text-ink-muted/70">
                      Hover a thumbnail to view the photo
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
      <NoticeRibbon />
      <HeroSection />
      <GallerySection />
      <CoursesSection />
      <AboutSection />
      <LeadershipSection />
      <MilestonesSection />
      <CTASection />
      <Footer />
      <PublicChatWidget />
    </div>
  );
}
