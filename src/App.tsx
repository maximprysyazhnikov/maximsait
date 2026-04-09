import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "motion/react";
import DevOpsLogo from "./components/DevOpsLogo";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Terminal,
  Container,
  Cloud,
  Database,
  ShieldCheck,
  Code2,
  Cpu,
  Globe,
  Award,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";

type Language = "uk" | "en";

const SectionTitle = ({ children, subtitle }: { children: ReactNode; subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-4">
      {children}
    </motion.h2>
    {subtitle && (
    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-zinc-400 max-w-2xl">
        {subtitle}
      </motion.p>
    )}
    <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="h-1 bg-emerald-400 mt-4 rounded-full" />
  </div>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`glass p-6 rounded-2xl hover:border-emerald-400/30 transition-all duration-300 group ${className}`}>
    {children}
  </motion.div>
);

const floatingOrbs = [
  { className: "left-[8%] top-[12%] h-72 w-72 bg-emerald-300/10 blur-[90px]", x: [0, 40, -10, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.98, 1], duration: 18 },
  { className: "right-[6%] top-[22%] h-96 w-96 bg-cyan-200/8 blur-[110px]", x: [0, -50, 30, 0], y: [0, 25, -35, 0], scale: [1, 0.95, 1.05, 1], duration: 22 },
  { className: "bottom-[8%] left-[20%] h-64 w-64 bg-teal-300/10 blur-[80px]", x: [0, 20, -30, 0], y: [0, -20, 25, 0], scale: [1, 1.04, 0.96, 1], duration: 16 },
  { className: "left-[42%] top-[14%] h-44 w-44 bg-emerald-200/8 blur-[70px]", x: [0, -18, 24, 0], y: [0, 26, -14, 0], scale: [1, 1.12, 1, 1], duration: 14 },
  { className: "left-[18%] top-[36%] h-52 w-52 bg-teal-200/8 blur-[72px]", x: [0, 28, -16, 0], y: [0, -24, 14, 0], scale: [1, 1.1, 0.94, 1], duration: 17 },
  { className: "right-[18%] top-[58%] h-56 w-56 bg-emerald-100/7 blur-[76px]", x: [0, -24, 18, 0], y: [0, 20, -18, 0], scale: [1, 1.06, 0.97, 1], duration: 19 },
  { className: "left-[58%] top-[44%] h-40 w-40 bg-cyan-100/7 blur-[62px]", x: [0, 18, -12, 0], y: [0, -16, 12, 0], scale: [1, 1.08, 1, 1], duration: 13 },
  { className: "left-[72%] top-[10%] h-32 w-32 bg-teal-100/8 blur-[58px]", x: [0, -14, 16, 0], y: [0, 14, -10, 0], scale: [1, 1.14, 0.98, 1], duration: 12 },
];

const floatingParticles = [
  { left: "12%", top: "28%", size: "h-3 w-3", color: "bg-emerald-200/65", duration: 9, x: [0, 10, -8, 0], y: [0, -14, 12, 0] },
  { left: "26%", top: "62%", size: "h-2 w-2", color: "bg-teal-200/70", duration: 11, x: [0, -12, 9, 0], y: [0, 16, -10, 0] },
  { left: "54%", top: "18%", size: "h-2.5 w-2.5", color: "bg-cyan-100/70", duration: 10, x: [0, 14, -6, 0], y: [0, -12, 18, 0] },
  { left: "68%", top: "38%", size: "h-3 w-3", color: "bg-emerald-100/60", duration: 12, x: [0, -10, 12, 0], y: [0, 18, -12, 0] },
  { left: "82%", top: "66%", size: "h-2 w-2", color: "bg-teal-100/75", duration: 8, x: [0, 8, -10, 0], y: [0, -10, 8, 0] },
  { left: "38%", top: "78%", size: "h-2.5 w-2.5", color: "bg-cyan-100/65", duration: 13, x: [0, 12, -14, 0], y: [0, -18, 12, 0] },
  { left: "8%", top: "46%", size: "h-2 w-2", color: "bg-emerald-100/70", duration: 10, x: [0, 9, -7, 0], y: [0, -16, 10, 0] },
  { left: "18%", top: "18%", size: "h-2.5 w-2.5", color: "bg-teal-100/70", duration: 12, x: [0, -8, 11, 0], y: [0, 10, -14, 0] },
  { left: "32%", top: "34%", size: "h-3 w-3", color: "bg-cyan-100/60", duration: 9, x: [0, 13, -9, 0], y: [0, -12, 15, 0] },
  { left: "44%", top: "56%", size: "h-2 w-2", color: "bg-emerald-200/70", duration: 14, x: [0, -14, 8, 0], y: [0, 15, -11, 0] },
  { left: "57%", top: "72%", size: "h-2.5 w-2.5", color: "bg-teal-200/65", duration: 11, x: [0, 10, -12, 0], y: [0, -17, 9, 0] },
  { left: "64%", top: "26%", size: "h-2 w-2", color: "bg-cyan-200/70", duration: 8, x: [0, -11, 10, 0], y: [0, 11, -9, 0] },
  { left: "74%", top: "52%", size: "h-3 w-3", color: "bg-emerald-100/60", duration: 13, x: [0, 12, -10, 0], y: [0, -13, 16, 0] },
  { left: "88%", top: "24%", size: "h-2.5 w-2.5", color: "bg-teal-100/75", duration: 10, x: [0, -9, 12, 0], y: [0, 13, -10, 0] },
  { left: "86%", top: "80%", size: "h-2 w-2", color: "bg-cyan-100/60", duration: 15, x: [0, 7, -9, 0], y: [0, -12, 8, 0] },
  { left: "48%", top: "8%", size: "h-2 w-2", color: "bg-emerald-100/75", duration: 11, x: [0, 11, -8, 0], y: [0, 14, -12, 0] },
];

const BackgroundScene = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_34%)]" />

    {floatingOrbs.map((orb) => (
      <motion.div
        key={orb.className}
        animate={{ x: orb.x, y: orb.y, scale: orb.scale }}
        transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute rounded-full ${orb.className}`}
      />
    ))}

    {floatingParticles.map((particle) => (
      <motion.div
        key={`${particle.left}-${particle.top}`}
        animate={{ x: particle.x, y: particle.y, opacity: [0.35, 0.85, 0.45, 0.35] }}
        transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute rounded-full shadow-[0_0_22px_rgba(255,255,255,0.12)] ${particle.size} ${particle.color}`}
        style={{ left: particle.left, top: particle.top }}
      />
    ))}

    <motion.div
      animate={{ y: [0, -10, 0], opacity: [0.2, 0.32, 0.2] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-x-0 top-[14%] mx-auto h-px w-[72%] bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent"
    />

    <div
      className="absolute left-1/2 top-[18%] h-[72vh] w-[160vw] -translate-x-1/2 opacity-35"
      style={{
        transform: "translateX(-50%) perspective(1200px) rotateX(72deg)",
        backgroundImage:
          "linear-gradient(rgba(110,231,183,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.14) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 78%)",
      }}
    />

    <motion.div
      animate={{ backgroundPosition: ["0px 0px", "0px 36px", "0px 0px"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-x-[10%] top-[18%] h-[40vh] opacity-[0.08]"
      style={{
        backgroundImage: "linear-gradient(rgba(110,231,183,0.4) 1px, transparent 1px)",
        backgroundSize: "100% 36px",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
      }}
    />

    <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#07110f] via-[#07110f]/75 to-transparent" />
  </div>
);

const InfinityHero = () => (
  <motion.div
    animate={{ x: [0, 16, -10, 0], y: [0, -12, 10, 0], rotate: [0, 2, -2, 0] }}
    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    className="absolute right-[6%] top-[12%] hidden xl:block"
  >
    <svg viewBox="0 0 520 240" className="h-[260px] w-[620px] overflow-visible">
      <defs>
        <linearGradient id="infinityStroke" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="rgba(110,231,183,0.12)" />
          <stop offset="50%" stopColor="rgba(94,234,212,0.32)" />
          <stop offset="100%" stopColor="rgba(165,243,252,0.14)" />
        </linearGradient>
        <filter id="infinityGlow" x="-40%" y="-60%" width="180%" height="220%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d="M65 120C95 55 160 38 212 64C244 80 269 108 290 120C312 132 338 160 370 176C424 203 482 183 501 120C482 57 424 37 370 64C338 80 312 108 290 120C269 132 244 160 212 176C160 202 95 185 65 120Z"
        animate={{ pathLength: [0.78, 1, 0.82, 0.78], opacity: [0.42, 0.72, 0.48, 0.42] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        fill="none"
        stroke="url(#infinityStroke)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#infinityGlow)"
      />

      <motion.path
        d="M82 120C108 72 160 62 203 82C231 95 256 116 290 120C324 124 349 145 377 158C420 178 461 167 478 120C461 73 420 62 377 82C349 95 324 116 290 120C256 124 231 145 203 158C160 178 108 168 82 120Z"
        animate={{ opacity: [0.12, 0.3, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        fill="none"
        stroke="rgba(236,253,245,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);

const skills = [
  { name: "Linux", icon: <Terminal className="w-4 h-4" /> },
  { name: "Docker", icon: <Container className="w-4 h-4" /> },
  { name: "Kubernetes", icon: <Globe className="w-4 h-4" /> },
  { name: "Azure", icon: <Cloud className="w-4 h-4" /> },
  { name: "Terraform", icon: <Cpu className="w-4 h-4" /> },
  { name: "CI/CD", icon: <Code2 className="w-4 h-4" /> },
  { name: "GitHub Actions", icon: <Github className="w-4 h-4" /> },
  { name: "Python", icon: <Code2 className="w-4 h-4" /> },
  { name: "MySQL", icon: <Database className="w-4 h-4" /> },
  { name: "PostgreSQL", icon: <Database className="w-4 h-4" /> },
  { name: "Liquibase", icon: <Database className="w-4 h-4" /> },
  { name: "Bash", icon: <Terminal className="w-4 h-4" /> },
  { name: "SIEM", icon: <ShieldCheck className="w-4 h-4" /> },
  { name: "IDS/IPS", icon: <ShieldCheck className="w-4 h-4" /> },
];

const copy = {
  uk: {
    title: "Maksym Prysiazhnikov | DevOps Портфоліо",
    nav: { about: "Про мене", experience: "Досвід", projects: "Проєкти", contact: "Контакти" },
    hero: {
      badge: "Відкритий до нових можливостей",
      role: "Junior DevOps Engineer & Cloud Specialist, зосереджений на побудові стійкої та автоматизованої інфраструктури.",
      contact: "Зв'язатися",
      github: "GitHub",
    },
    about: {
      title: "Про мене",
      p1: "Junior DevOps / Cloud Engineer із практичним досвідом роботи з Linux, Docker, Kubernetes і процесами хмарного розгортання.",
      p2: "Спеціалізуюся на основах інфраструктури, роботі з базами даних, автоматизації та доставці застосунків у різні середовища.",
      p3: "Закінчив інтенсивну DevOps-програму в Mate academy та маю сертифікат Google Cybersecurity. Мені близькі автоматизація, CI/CD та побудова безпечних і масштабованих середовищ.",
      country: "Україна",
      english: "Англійська (B2)",
      stack: "Технічний стек",
    },
    experience: {
      title: "Технічний досвід",
      subtitle: "Практичне застосування DevOps-підходів у реальних сценаріях.",
      volunteerTitle: "Командний проєкт — Volunteer Site",
      volunteerRole: "DevOps / Deployment Lead",
      liveDemo: "Live Demo",
      volunteerPoints: [
        "Брав участь у деплої та налаштуванні середовища для командного вебпроєкту.",
        "Працював із хмарним хостингом, конфігурацією застосунку та production-змінними середовища.",
        "Забезпечував підключення до бази даних і долучався до підготовки релізів та backend-підтримки.",
      ],
      handsOnTitle: "Практика DevOps",
      handsOnRole: "Навчання в Mate academy",
      blocks: [
        {
          title: "Kubernetes і контейнери",
          text: "Створював і підтримував навчальні проєкти з Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets і Persistent Volumes.",
        },
        {
          title: "Адміністрування баз даних",
          text: "Практикував керування користувачами MySQL, backup/restore, аналіз slow query logs, моніторинг error logs і сценарії відкату міграцій.",
        },
        {
          title: "Infrastructure as Code",
          text: "Працював із Terraform та основами Azure для provisioning інфраструктури, керування state, модулів і процесів валідації.",
        },
        {
          title: "CI/CD та автоматизація",
          text: "Реалізовував автоматизовані пайплайни доставки застосунків із фокусом на environment-based configuration та безпеку.",
        },
      ],
    },
    projects: {
      title: "Вибрані проєкти",
      subtitle: "Особисті проєкти, що демонструють автоматизацію, DevOps-підхід та інтеграцію AI.",
      items: [
        {
          title: "AI Crypto CAT Bot",
          description: "Telegram-бот на Python для аналізу крипторинку з GPT-інсайтами та звітами у форматах Markdown, HTML і PDF.",
          tags: ["Python", "GPT API", "Market Data", "Automation"],
          link: "https://github.com/maximprysyazhnikov/ccbv3.8",
        },
        {
          title: "KROK Worldbuilder Bot",
          description: "AI-асистент для всесвіту KROK з багатомовною підтримкою, переглядом лору та генерацією image prompts.",
          tags: ["AI", "Telegram Bot", "Prompt Engineering"],
          link: "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot",
        },
        {
          title: "DevOps AI Agent",
          description: "Орієнтований на автоматизацію бот, інтегрований з OpenRouter GPT API та конфігурацією через змінні середовища.",
          tags: ["DevOps", "AI", "Python", "API Integration"],
          link: "https://github.com/maximprysyazhnikov/devops_ai_agent",
        },
      ],
    },
    certs: {
      title: "Сертифікації",
      items: [
        { name: "Професійний сертифікат DevOps Engineer", issuer: "Mate academy", year: "2026", details: "462+ виконаних практичних завдань" },
        { name: "Google Cybersecurity Certificate", issuer: "Google / Coursera", year: "2024" },
        { name: "Project Management in IT", issuer: "Beetroot Academy", year: "2023" },
        { name: "Курс англійської мови (B2, Grade A)", issuer: "12 Project", year: "2024" },
      ],
    },
    education: {
      title: "Освіта",
      items: [
        { title: "Архітектура та містобудування", place: "Одеська державна академія будівництва та архітектури" },
        { title: "Навчання за напрямами, пов'язаними з програмним забезпеченням", place: "Академія зв'язку імені О. С. Попова" },
      ],
      languagesTitle: "Мови",
      languages: [
        { label: "Українська", value: "Рідна" },
        { label: "Англійська", value: "Upper-Intermediate (B2)" },
      ],
    },
    earlier: {
      title: "Попередній досвід",
      subtitle: "Фундамент у комунікації, продажах і координації проєктів.",
      items: [
        { period: "2019 – 2022", title: "Самозайнятість", text: "Онлайн-просування продуктів і генерація попиту. Використовував цифрові канали для підтримки продажів." },
        { period: "2017 – 2019", title: "Бізнес-партнерство", text: "Комунікація з оптовими покупцями, переговори та координація угод." },
        { period: "2016 – 2017", title: "Агент з нерухомості", text: "NBR Real Estate. Супровід операцій з нерухомістю та комунікація з клієнтами." },
      ],
    },
    contact: {
      title: "Контакти",
      subtitle: "Відкритий до нових проєктів, співпраці та професійних можливостей.",
      linkedin: "LinkedIn",
      github: "GitHub",
      footer: "Створено за допомогою React і Tailwind CSS.",
    },
  },
  en: {
    title: "Maksym Prysiazhnikov | DevOps Portfolio",
    nav: { about: "About", experience: "Experience", projects: "Projects", contact: "Contact" },
    hero: {
      badge: "Available for opportunities",
      role: "Junior DevOps Engineer & Cloud Specialist focused on building resilient, automated infrastructure.",
      contact: "Get in touch",
      github: "GitHub",
    },
    about: {
      title: "About Me",
      p1: "Junior DevOps / Cloud Engineer with hands-on experience in Linux, Docker, Kubernetes, and cloud deployment workflows.",
      p2: "I specialize in infrastructure fundamentals, database operations, automation, and environment-based application delivery.",
      p3: "I completed an intensive DevOps program at Mate academy and hold a Google Cybersecurity Certificate. I am passionate about automation, CI/CD pipelines, and building secure, scalable environments.",
      country: "Ukraine",
      english: "English (B2)",
      stack: "Technical Stack",
    },
    experience: {
      title: "Technical Experience",
      subtitle: "Practical application of DevOps principles in real-world scenarios.",
      volunteerTitle: "Team Project — Volunteer Site",
      volunteerRole: "DevOps / Deployment Lead",
      liveDemo: "Live Demo",
      volunteerPoints: [
        "Contributed to deployment and environment setup for a team web project.",
        "Worked with cloud hosting, application configuration, and production environment variables.",
        "Ensured database connectivity and participated in release setup and backend support.",
      ],
      handsOnTitle: "Hands-on DevOps Practice",
      handsOnRole: "Mate academy Training",
      blocks: [
        {
          title: "Kubernetes & Containers",
          text: "Built and maintained training projects covering Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets, and Persistent Volumes.",
        },
        {
          title: "Database Administration",
          text: "Practiced MySQL user management, backup and restore, slow query log analysis, error log monitoring, and migration rollback scenarios.",
        },
        {
          title: "Infrastructure as Code",
          text: "Worked with Terraform and Azure fundamentals for infrastructure provisioning, state management, modules, and validation workflows.",
        },
        {
          title: "CI/CD & Automation",
          text: "Implemented automated delivery pipelines with a focus on environment-based configuration and security.",
        },
      ],
    },
    projects: {
      title: "Featured Projects",
      subtitle: "Selected personal projects showcasing automation, DevOps thinking, and AI integration.",
      items: [
        {
          title: "AI Crypto CAT Bot",
          description: "A Python Telegram bot for crypto market analysis with GPT-powered insights and reports in Markdown, HTML, and PDF formats.",
          tags: ["Python", "GPT API", "Market Data", "Automation"],
          link: "https://github.com/maximprysyazhnikov/ccbv3.8",
        },
        {
          title: "KROK Worldbuilder Bot",
          description: "An AI assistant for the KROK universe with multilingual support, lore browsing, and image prompt generation.",
          tags: ["AI", "Telegram Bot", "Prompt Engineering"],
          link: "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot",
        },
        {
          title: "DevOps AI Agent",
          description: "An automation-oriented bot integrated with the OpenRouter GPT API and configured through environment variables.",
          tags: ["DevOps", "AI", "Python", "API Integration"],
          link: "https://github.com/maximprysyazhnikov/devops_ai_agent",
        },
      ],
    },
    certs: {
      title: "Certifications",
      items: [
        { name: "DevOps Engineer Professional Certificate", issuer: "Mate academy", year: "2026", details: "462+ hands-on tasks completed" },
        { name: "Google Cybersecurity Certificate", issuer: "Google / Coursera", year: "2024" },
        { name: "Project Management in IT", issuer: "Beetroot Academy", year: "2023" },
        { name: "English Course (B2, Grade A)", issuer: "12 Project", year: "2024" },
      ],
    },
    education: {
      title: "Education",
      items: [
        { title: "Architecture and Urban Planning", place: "Odesa State Academy of Civil Engineering and Architecture" },
        { title: "Software-related studies", place: "Popov Academy of Telecommunications" },
      ],
      languagesTitle: "Languages",
      languages: [
        { label: "Ukrainian", value: "Native" },
        { label: "English", value: "Upper-Intermediate (B2)" },
      ],
    },
    earlier: {
      title: "Earlier Experience",
      subtitle: "A foundation in communication, sales, and project coordination.",
      items: [
        { period: "2019 – 2022", title: "Self-employed", text: "Focused on online product promotion and demand generation, using digital channels to support sales." },
        { period: "2017 – 2019", title: "Business Partnership", text: "Handled communication with wholesale buyers, negotiations, and deal coordination." },
        { period: "2016 – 2017", title: "Real Estate Agent", text: "Worked at NBR Real Estate, supporting property transactions and client communication." },
      ],
    },
    contact: {
      title: "Let's Connect",
      subtitle: "I am always open to discussing new projects, collaboration, and career opportunities.",
      linkedin: "LinkedIn",
      github: "GitHub",
      footer: "Built with React & Tailwind CSS.",
    },
  },
} satisfies Record<Language, any>;

const blockIcons = [
  <Container className="w-4 h-4 text-emerald-400" key="container" />,
  <Database className="w-4 h-4 text-emerald-400" key="database" />,
  <Cpu className="w-4 h-4 text-emerald-400" key="cpu" />,
  <ShieldCheck className="w-4 h-4 text-emerald-400" key="shield" />,
];

export default function App() {
  const [language, setLanguage] = useState<Language>("uk");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.title;
  }, [language, t.title]);

  return (
    <div id="top" className="relative isolate min-h-screen overflow-hidden font-sans">
      <BackgroundScene />

      <nav className="fixed top-0 w-full z-50 glass border-b-0 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-white">
            <a href="#top" className="block">
              <DevOpsLogo />
            </a>
          </motion.div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
              <a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a>
              <a href="#experience" className="hover:text-white transition-colors">{t.nav.experience}</a>
              <a href="#projects" className="hover:text-white transition-colors">{t.nav.projects}</a>
              <a href="#contact" className="hover:text-white transition-colors">{t.nav.contact}</a>
            </div>
            <div className="flex items-center rounded-full border border-emerald-950/80 bg-[#0b1815]/85 p-1">
              {(["uk", "en"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${language === lang ? "bg-emerald-500 text-[#04100d]" : "text-zinc-400 hover:text-white"}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-20">
        <InfinityHero />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-500/18 blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-teal-400/14 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-6 border border-emerald-400/20">{t.hero.badge}</span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Maksym <span className="text-gradient">Prysiazhnikov</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed">{t.hero.role}</p>
              <div className="flex flex-wrap gap-4">
                <motion.a href="#contact" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-[#04100d] rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t.hero.contact}
                </motion.a>
                <motion.a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-8 py-4 glass hover:bg-[#162723] text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  {t.hero.github}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-[#0b1714]/45">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionTitle>{t.about.title}</SectionTitle>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">{t.about.p1}</p>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">{t.about.p2}</p>
              <p className="text-lg text-zinc-400 leading-relaxed">{t.about.p3}</p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-zinc-300">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>{t.about.country}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>{t.about.english}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                {t.about.stack}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.span key={skill.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-medium text-zinc-300 hover:text-emerald-300 hover:border-emerald-400/30 transition-all">
                    {skill.icon}
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle={t.experience.subtitle}>{t.experience.title}</SectionTitle>
          <div className="space-y-8">
            <Card className="border-l-4 border-l-emerald-400">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{t.experience.volunteerTitle}</h3>
                  <p className="text-emerald-300 font-medium">{t.experience.volunteerRole}</p>
                </div>
                <a href="https://volunteer-site-placeholder-dev.up.railway.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  {t.experience.liveDemo}
                </a>
              </div>
              <ul className="space-y-3 text-zinc-400">
                {t.experience.volunteerPoints.map((point: string) => (
                  <li key={point} className="flex gap-3">
                    <ChevronRight className="w-5 h-5 text-emerald-400 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold text-white mb-2">{t.experience.handsOnTitle}</h3>
              <p className="text-emerald-300 font-medium mb-6">{t.experience.handsOnRole}</p>
              <div className="grid md:grid-cols-2 gap-8">
                {t.experience.blocks.map((block: { title: string; text: string }, index: number) => (
                  <div key={block.title}>
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      {blockIcons[index]}
                      {block.title}
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">{block.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 bg-[#0b1714]/45">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle={t.projects.subtitle}>{t.projects.title}</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8">
            {t.projects.items.map((project: { title: string; description: string; tags: string[]; link: string }) => (
              <div key={project.title}>
                <Card className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-300">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-zinc-400 text-sm mb-6 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-[#13211d] text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionTitle>{t.certs.title}</SectionTitle>
              <div className="space-y-4">
                {t.certs.items.map((cert: { name: string; issuer: string; year: string; details?: string }) => (
                  <div key={cert.name} className="flex gap-4 p-4 rounded-xl hover:bg-[#0f1c18]/80 transition-colors group">
                    <div className="mt-1">
                      <Award className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-emerald-300 transition-colors">{cert.name}</h4>
                      <p className="text-sm text-zinc-400">{cert.issuer} • {cert.year}</p>
                      {cert.details && <p className="text-xs text-emerald-300/70 mt-1">{cert.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle>{t.education.title}</SectionTitle>
              <div className="space-y-8">
                {t.education.items.map((item: { title: string; place: string }) => (
                  <div key={item.title} className="relative pl-8 border-l border-emerald-950/70">
                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-emerald-400" />
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-sm text-zinc-400">{item.place}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  {t.education.languagesTitle}
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {t.education.languages.map((item: { label: string; value: string }) => (
                    <div key={item.label} className="px-4 py-2 rounded-lg glass">
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0b1714]/45">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle={t.earlier.subtitle}>{t.earlier.title}</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            {t.earlier.items.map((item: { period: string; title: string; text: string }) => (
              <div key={item.title}>
                <Card>
                  <div className="flex items-center gap-2 text-emerald-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">{item.period}</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-zinc-400">{item.text}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="py-20 border-t border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionTitle subtitle={t.contact.subtitle}>{t.contact.title}</SectionTitle>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a href="https://linkedin.com/in/maxim-prysyazhnikov-b46196163" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-[#04100d] transition-all duration-300">
                <Linkedin className="w-8 h-8" />
              </div>
              <span className="text-zinc-400 group-hover:text-white transition-colors">{t.contact.linkedin}</span>
            </a>
            <a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-[#04100d] transition-all duration-300">
                <Github className="w-8 h-8" />
              </div>
              <span className="text-zinc-400 group-hover:text-white transition-colors">{t.contact.github}</span>
            </a>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Maksym Prysiazhnikov. {t.contact.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}
