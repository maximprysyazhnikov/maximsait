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
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-slate-400 max-w-2xl">
        {subtitle}
      </motion.p>
    )}
    <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="h-1 bg-blue-500 mt-4 rounded-full" />
  </div>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`glass p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group ${className}`}>
    {children}
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
      email: "Написати на пошту",
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
      email: "Email Me",
      linkedin: "LinkedIn",
      github: "GitHub",
      footer: "Built with React & Tailwind CSS.",
    },
  },
} satisfies Record<Language, any>;

const blockIcons = [
  <Container className="w-4 h-4 text-blue-500" key="container" />,
  <Database className="w-4 h-4 text-blue-500" key="database" />,
  <Cpu className="w-4 h-4 text-blue-500" key="cpu" />,
  <ShieldCheck className="w-4 h-4 text-blue-500" key="shield" />,
];

export default function App() {
  const [language, setLanguage] = useState<Language>("uk");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.title;
  }, [language, t.title]);

  return (
    <div id="top" className="min-h-screen font-sans">
      <nav className="fixed top-0 w-full z-50 glass border-b-0 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-white">
            <a href="#top" className="block">
              <DevOpsLogo />
            </a>
          </motion.div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
              <a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a>
              <a href="#experience" className="hover:text-white transition-colors">{t.nav.experience}</a>
              <a href="#projects" className="hover:text-white transition-colors">{t.nav.projects}</a>
              <a href="#contact" className="hover:text-white transition-colors">{t.nav.contact}</a>
            </div>
            <div className="flex items-center rounded-full border border-slate-700/80 bg-slate-900/70 p-1">
              {(["uk", "en"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${language === lang ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-indigo-600/20 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider uppercase mb-6 border border-blue-500/20">{t.hero.badge}</span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Maksym <span className="text-gradient">Prysiazhnikov</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-8 leading-relaxed">{t.hero.role}</p>
              <div className="flex flex-wrap gap-4">
                <motion.a href="#contact" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t.hero.contact}
                </motion.a>
                <motion.a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-8 py-4 glass hover:bg-slate-800 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  {t.hero.github}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionTitle>{t.about.title}</SectionTitle>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">{t.about.p1}</p>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">{t.about.p2}</p>
              <p className="text-lg text-slate-400 leading-relaxed">{t.about.p3}</p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>{t.about.country}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>{t.about.english}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                {t.about.stack}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.span key={skill.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-medium text-slate-300 hover:text-blue-400 hover:border-blue-500/30 transition-all">
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
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{t.experience.volunteerTitle}</h3>
                  <p className="text-blue-400 font-medium">{t.experience.volunteerRole}</p>
                </div>
                <a href="https://volunteer-site-placeholder-dev.up.railway.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  {t.experience.liveDemo}
                </a>
              </div>
              <ul className="space-y-3 text-slate-400">
                {t.experience.volunteerPoints.map((point: string) => (
                  <li key={point} className="flex gap-3">
                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold text-white mb-2">{t.experience.handsOnTitle}</h3>
              <p className="text-blue-400 font-medium mb-6">{t.experience.handsOnRole}</p>
              <div className="grid md:grid-cols-2 gap-8">
                {t.experience.blocks.map((block: { title: string; text: string }, index: number) => (
                  <div key={block.title}>
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      {blockIcons[index]}
                      {block.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{block.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle={t.projects.subtitle}>{t.projects.title}</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8">
            {t.projects.items.map((project: { title: string; description: string; tags: string[]; link: string }) => (
              <div key={project.title}>
                <Card className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tag}</span>
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
                  <div key={cert.name} className="flex gap-4 p-4 rounded-xl hover:bg-slate-900/50 transition-colors group">
                    <div className="mt-1">
                      <Award className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{cert.name}</h4>
                      <p className="text-sm text-slate-400">{cert.issuer} • {cert.year}</p>
                      {cert.details && <p className="text-xs text-blue-500/70 mt-1">{cert.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle>{t.education.title}</SectionTitle>
              <div className="space-y-8">
                {t.education.items.map((item: { title: string; place: string }) => (
                  <div key={item.title} className="relative pl-8 border-l border-slate-800">
                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-blue-500" />
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.place}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  {t.education.languagesTitle}
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {t.education.languages.map((item: { label: string; value: string }) => (
                    <div key={item.label} className="px-4 py-2 rounded-lg glass">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle={t.earlier.subtitle}>{t.earlier.title}</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            {t.earlier.items.map((item: { period: string; title: string; text: string }) => (
              <div key={item.title}>
                <Card>
                  <div className="flex items-center gap-2 text-blue-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">{item.period}</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.text}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionTitle subtitle={t.contact.subtitle}>{t.contact.title}</SectionTitle>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a href="mailto:maxisky2595@gmail.com" className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Mail className="w-8 h-8" />
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">{t.contact.email}</span>
            </a>
            <a href="https://linkedin.com/in/maxim-prysyazhnikov-b46196163" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Linkedin className="w-8 h-8" />
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">{t.contact.linkedin}</span>
            </a>
            <a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Github className="w-8 h-8" />
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">{t.contact.github}</span>
            </a>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Maksym Prysiazhnikov. {t.contact.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}
