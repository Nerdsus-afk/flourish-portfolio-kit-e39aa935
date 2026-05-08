import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Building2, ChevronLeft, ChevronRight, ExternalLink, Briefcase, GraduationCap, Globe, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import bofaLogo from "@/assets/logos/bofa.png";
import accentureLogo from "@/assets/logos/accenture.png";
import infosysLogo from "@/assets/logos/infosys.png";
import cognizantLogo from "@/assets/logos/cognizant.png";

const skills = [
  { label: "Java & OOP", value: 88 },
  { label: "Python & ML / NLP", value: 84 },
  { label: "DSA & Problem Solving", value: 86 },
  { label: "SQL & Databases", value: 82 },
];

type Offer = {
  company: string;
  role: string;
  ctc: string;
  chosen: boolean;
  logo: string;
  category: "Banking & FinTech" | "IT Services & Consulting";
  tech: string[];
  location: string;
  highlights: string[];
  description: string;
  links: { label: string; url: string; type: "job" | "internship" | "company" }[];
};

const offers: Offer[] = [
  {
    company: "Bank of America",
    role: "Apprentice Software Engineer",
    ctc: "6.45 LPA",
    chosen: true,
    logo: bofaLogo,
    category: "Banking & FinTech",
    tech: ["Java", "Spring", "SQL", "Microservices"],
    location: "Chennai",
    description:
      "Joining BofA's Global Technology org as an Apprentice Software Engineer, contributing to enterprise banking platforms used by millions worldwide.",
    highlights: [
      "Engineering at scale across global banking systems",
      "Mentorship from senior engineers in the apprenticeship track",
      "Exposure to Java, Spring, distributed systems and SRE practices",
    ],
    links: [
      { label: "Careers", url: "https://careers.bankofamerica.com/", type: "job" },
      { label: "Company site", url: "https://www.bankofamerica.com/", type: "company" },
    ],
  },
  {
    company: "Accenture",
    role: "Advanced Engineering (AEH)",
    ctc: "11 LPA",
    chosen: false,
    logo: accentureLogo,
    category: "IT Services & Consulting",
    tech: ["Cloud", "AI/ML", "Full-Stack", "DevOps"],
    location: "PAN India",
    description:
      "Advanced Engineering Hub role focused on building modern cloud-native and AI-driven solutions for Fortune 500 clients.",
    highlights: [
      "Highest CTC offered among my placements",
      "Cross-domain client work across cloud and AI",
      "Structured tech-track with continuous certifications",
    ],
    links: [
      { label: "Careers", url: "https://www.accenture.com/in-en/careers", type: "job" },
      { label: "Company site", url: "https://www.accenture.com/", type: "company" },
    ],
  },
  {
    company: "Infosys",
    role: "Digital Specialist Engineer",
    ctc: "7 LPA",
    chosen: false,
    logo: infosysLogo,
    category: "IT Services & Consulting",
    tech: ["Java", "Cloud", "Full-Stack", "System Design"],
    location: "Mysuru / Bengaluru",
    description:
      "Digital Specialist Engineer track at Infosys, focused on advanced engineering specialisations after the Mysuru DSE foundation program.",
    highlights: [
      "Specialist track after a rigorous selection test",
      "Deep training at the Infosys Global Education Center",
      "Choice of specialisations across cloud, full-stack and data",
    ],
    links: [
      { label: "Careers", url: "https://www.infosys.com/careers/", type: "job" },
      { label: "Company site", url: "https://www.infosys.com/", type: "company" },
    ],
  },
  {
    company: "Cognizant",
    role: "GenC",
    ctc: "4 LPA",
    chosen: false,
    logo: cognizantLogo,
    category: "IT Services & Consulting",
    tech: ["Java", "Web", "Databases"],
    location: "Chennai",
    description:
      "GenC entry-level engineering role at Cognizant focused on application development for global enterprise clients.",
    highlights: [
      "First placement offer of the season",
      "Broad project allocation across domains",
      "Foundation training in modern application stacks",
    ],
    links: [
      { label: "Careers", url: "https://careers.cognizant.com/global/en", type: "job" },
      { label: "Company site", url: "https://www.cognizant.com/", type: "company" },
    ],
  },
];

const ALL = "All";

export const About = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeY = (y: number) =>
    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y };
  const show = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [detailsCompany, setDetailsCompany] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
  

  const open = lightboxIndex !== null;
  const current = open ? offers[lightboxIndex!] : null;
  const details = useMemo(
    () => offers.find((o) => o.company === detailsCompany) ?? null,
    [detailsCompany]
  );

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(offers.map((o) => o.category)))],
    []
  );
  const filteredOffers = useMemo(
    () =>
      offers.filter(
        (o) => categoryFilter === ALL || o.category === categoryFilter
      ),
    [categoryFilter]
  );

  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % offers.length)),
    []
  );
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + offers.length) % offers.length)),
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  return (
  <section id="about" className="py-32 relative scroll-mt-24">
    <div className="container grid lg:grid-cols-12 gap-16">
      <motion.div
        initial={fadeY(40)}
        whileInView={show}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-7"
      >
        <motion.p
          initial={fadeY(12)}
          whileInView={show}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs uppercase tracking-[0.3em] text-amber mb-6"
        >
          About
        </motion.p>
        <motion.h2
          initial={fadeY(24)}
          whileInView={show}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-display tracking-tighter text-gradient mb-8 text-balance max-w-[18ch] text-[clamp(1.875rem,5.2vw,3.75rem)] leading-[1.08] md:leading-[1.05]"
        >
          Trying to merge my ambitions <span className="italic text-amber-gradient">before the deadline.</span>
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12, delayChildren: prefersReducedMotion ? 0 : 0.15 } },
          }}
          className="space-y-6 text-muted-foreground text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.75] max-w-[65ch] text-pretty md:text-justify [hyphens:none] [word-break:normal] [overflow-wrap:normal]"
        >
          {[
            <>
              I'm a final-year Computer Science and Engineering student at{" "}
              <span className="relative text-foreground">
                SRM Institute of Science and Technology
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-gradient-amber opacity-60" aria-hidden />
              </span>
              , graduating in 2026 with a CGPA of{" "}
              <span className="text-amber-gradient font-medium">9.12</span>. I enjoy
              writing clean Java and Python, exploring machine learning, and turning
              ideas into working software.
            </>,
            <>
              I've been fortunate to receive offers from four great companies during
              campus placements, and I've chosen to begin my career at{" "}
              <span className="relative text-foreground">
                Bank of America
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-gradient-amber opacity-60" aria-hidden />
              </span>{" "}
              as an Apprentice Software Engineer —
              excited to grow in a place where engineering meets impact at scale.
            </>,
            <>
              Most recently I interned at{" "}
              <span className="relative text-foreground">
                Opportive
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-gradient-amber opacity-60" aria-hidden />
              </span>{" "}
              as a Web Development Intern, contributing to a Learning Management System and
              a real-time chat module with Socket.IO. Outside coursework I tinker with
              NLP, sharpen my DSA, and daily-drive Arch Linux with Hyprland.
            </>,
          ].map((content, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
                show: prefersReducedMotion
                  ? { opacity: 1, transition: { duration: 0.01 } }
                  : { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {content}
            </motion.p>
          ))}
        </motion.div>

        {/* Offers */}
        <div className="mt-12">
          <p className="text-xs uppercase tracking-[0.3em] text-amber mb-5 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> Placement offers
          </p>

          {/* Filters */}
          <div className="mb-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mr-1">
                <Filter className="w-3 h-3" /> Category
              </span>
              {categories.map((c) => {
                const active = categoryFilter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategoryFilter(c)}
                    aria-pressed={active}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-amber border-amber text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-amber/60 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
            {filteredOffers.map((o, idx) => (
              <motion.div
                key={o.company}
                layout
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
                onClick={() => setDetailsCompany(o.company)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailsCompany(o.company);
                  }
                }}
                aria-label={`View details for ${o.company} placement offer`}
                className={`group/card relative p-5 rounded-2xl border overflow-hidden transition-[box-shadow,border-color,background-color] duration-500 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                  o.chosen
                    ? "border-amber bg-card shadow-glow hover:shadow-[0_20px_60px_-15px_hsl(var(--amber)/0.55)]"
                    : "border-border bg-card/60 hover:border-amber/60 hover:bg-card hover:shadow-[0_20px_50px_-20px_hsl(var(--amber)/0.35)]"
                }`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-amber opacity-0 group-hover/card:opacity-[0.06] transition-opacity duration-500"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-amber/0 group-hover/card:ring-amber/30 transition-[box-shadow] duration-500"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-1/2 -left-1/2 w-[60%] h-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-120%] group-hover/card:translate-x-[260%] transition-transform duration-[1100ms] ease-out"
                />
                {o.chosen && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-amber font-medium z-10">
                    <CheckCircle2 className="w-3 h-3" /> Chosen
                  </span>
                )}
                <div className="flex items-center justify-between gap-4 min-h-[110px]">
                  <div className="flex-1 min-w-0">
                    <p className={`font-display text-lg leading-tight ${o.chosen ? "text-amber-gradient" : "text-foreground"}`}>
                      {o.company}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{o.role}</p>
                    <p className="text-sm font-medium mt-2 text-foreground">{o.ctc}</p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(offers.indexOf(o));
                    }}
                    aria-label={`Open larger view of ${o.company} logo`}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }}
                    whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                    className="relative w-24 h-24 aspect-square rounded-xl bg-white flex items-center justify-center p-2.5 shrink-0 border border-border overflow-hidden cursor-zoom-in transition-shadow duration-500 group-hover/card:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    <span aria-hidden className="absolute inset-0 bg-gradient-amber opacity-0 group-hover/card:opacity-10 transition-opacity duration-500" />
                    <img
                      src={o.logo}
                      srcSet={`${o.logo} 1x, ${o.logo} 2x`}
                      sizes="96px"
                      alt={`${o.company} company logo — placement offer for ${o.role}`}
                      width={96}
                      height={96}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      draggable={false}
                      style={{ imageRendering: "auto" }}
                      className="relative w-full h-full max-w-full max-h-full [image-rendering:auto] [-webkit-backface-visibility:hidden] [transform:translateZ(0)] object-contain transition-transform duration-500 ease-out group-hover/logo:scale-110"
                    />
                  </motion.button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
          {filteredOffers.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              No offers match these filters.{" "}
              <button
                type="button"
                className="text-amber underline-offset-4 hover:underline"
                onClick={() => {
                  setCategoryFilter(ALL);
                }}
              >
                Reset filters
              </button>
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="lg:col-span-5 space-y-6"
      >
        {skills.map((s, i) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{s.label}</span>
              <span className="text-amber font-display">{s.value}</span>
            </div>
            <div className="h-px w-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-amber"
              />
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4 pt-8">
          {[
            { k: "9.12", v: "CGPA at SRM" },
            { k: "4", v: "Placement offers" },
            { k: "BofA", v: "Joining 2026" },
            { k: "1", v: "Industry internship" },
          ].map((s) => (
            <div key={s.v} className="p-5 rounded-2xl bg-card border border-border">
              <p className="font-display text-3xl text-amber-gradient">{s.k}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.v}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Logo lightbox */}
    <Dialog open={open} onOpenChange={(v) => !v && setLightboxIndex(null)}>
      <DialogContent className="max-w-3xl border-border bg-background/95 backdrop-blur p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.company}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <DialogTitle className="sr-only">{current.company} logo</DialogTitle>
              <div className="aspect-[4/3] sm:aspect-[16/10] w-full bg-white flex items-center justify-center p-10 sm:p-16">
                <img
                  src={current.logo}
                  alt={`${current.company} company logo, enlarged view`}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-border bg-card">
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight text-foreground truncate">
                    {current.company}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {current.role} · {current.ctc}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground tabular-nums mr-1">
                    {(lightboxIndex ?? 0) + 1} / {offers.length}
                  </span>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous logo"
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-amber hover:border-amber hover:text-primary-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next logo"
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-amber hover:border-amber hover:text-primary-foreground transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>

    {/* Details modal */}
    <Dialog open={!!details} onOpenChange={(v) => !v && setDetailsCompany(null)}>
      <DialogContent className="max-w-2xl border-border bg-background/95 backdrop-blur p-0 overflow-hidden">
        {details && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 p-6 border-b border-border">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2 border border-border shrink-0">
                <img
                  src={details.logo}
                  alt={`${details.company} logo`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
              <div className="min-w-0">
                <DialogTitle className="font-display text-xl text-foreground truncate">
                  {details.company}
                  {details.chosen && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-amber align-middle">
                      <CheckCircle2 className="w-3 h-3" /> Chosen
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1 truncate">
                  {details.role} · {details.ctc} · {details.location}
                </DialogDescription>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{details.description}</p>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber mb-2">Category</p>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs border border-amber/40 text-foreground">
                  {details.category}
                </span>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber mb-2">Tech & focus</p>
                <div className="flex flex-wrap gap-1.5">
                  {details.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[11px] border border-border text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber mb-2">Role highlights</p>
                <ul className="space-y-2">
                  {details.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber mb-2">Links</p>
                <div className="flex flex-wrap gap-2">
                  {details.links.map((l) => {
                    const Icon =
                      l.type === "internship" ? GraduationCap : l.type === "company" ? Globe : Briefcase;
                    return (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-foreground hover:border-amber hover:text-amber transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {l.label}
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  </section>
  );
};
