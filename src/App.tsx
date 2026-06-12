import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DevOpsLogo from "./components/DevOpsLogo";
import {
  ArrowLeft, ArrowUp, Award, BookOpen, Calendar, ChevronRight, ClipboardList, Cloud, Code2,
  Container, Cpu, Database, Download, ExternalLink, GitBranch, Github, Globe, Kanban, Linkedin,
  Mail, MapPin, MessageCircle, RailSymbol, Send, ShieldCheck, Terminal, Users, X,
} from "lucide-react";

type Language = "uk" | "en";
type Route = { page: "home" } | { page: "animated" } | { page: "animatedSkill"; slug: string } | { page: "skill"; slug: string } | { page: "provider"; slug: string };
type ChatMessage = { role: "user" | "assistant"; content: string };
type OfficialResource = { label: string; url: string };
type ChatPageContext = { section: string; title: string; summary?: string; description?: string; bullets?: string[]; resources?: OfficialResource[]; beginnerGuide?: string[] };
type LeadForm = { name: string; email: string; phone: string; message: string };
type SupportMessage = { id: string; role: "user" | "operator"; text: string; createdAt: string };
type Skill = {
  slug: string; name: string; icon: ReactNode; summary: Record<Language, string>;
  description: Record<Language, string>; bullets: Record<Language, string[]>;
};
type LearningProvider = {
  slug: string; title: string; url: string; category: Record<Language, string>;
  summary: Record<Language, string>; highlights: Record<Language, string[]>;
};

const COMMERCIAL_SITE_URL = "https://vidfranko.com.ua";
const VOLUNTEER_DEMO_URL = "https://volunteer-site-placeholder-dev.up.railway.app/";
const CONTACT_EMAIL = "maximprysyazhnikov@gmail.com";

const officialTechnologyResources: Record<string, OfficialResource[]> = {
  linux: [
    { label: "Linux Kernel Docs", url: "https://docs.kernel.org/" },
    { label: "Ubuntu Server Docs", url: "https://ubuntu.com/server/docs" },
  ],
  docker: [
    { label: "Docker Docs", url: "https://docs.docker.com/" },
    { label: "Docker Get Started", url: "https://docs.docker.com/get-started/" },
  ],
  kubernetes: [
    { label: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/" },
    { label: "Kubernetes Tutorials", url: "https://kubernetes.io/docs/tutorials/" },
  ],
  azure: [
    { label: "Azure Documentation", url: "https://learn.microsoft.com/en-us/azure/" },
    { label: "Microsoft Learn Azure", url: "https://learn.microsoft.com/en-us/training/azure/" },
  ],
  terraform: [
    { label: "Terraform Docs", url: "https://developer.hashicorp.com/terraform/docs" },
    { label: "Terraform Tutorials", url: "https://developer.hashicorp.com/terraform/tutorials" },
  ],
  "ci-cd": [
    { label: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" },
    { label: "GitLab CI/CD Docs", url: "https://docs.gitlab.com/ee/ci/" },
  ],
  "github-actions": [
    { label: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" },
    { label: "Learn GitHub Actions", url: "https://docs.github.com/en/actions/learn-github-actions" },
  ],
  python: [
    { label: "Python Docs", url: "https://docs.python.org/3/" },
    { label: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
  ],
  mysql: [
    { label: "MySQL Documentation", url: "https://dev.mysql.com/doc/" },
    { label: "MySQL Reference Manual", url: "https://dev.mysql.com/doc/refman/8.4/en/" },
  ],
  postgresql: [
    { label: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/" },
    { label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
  ],
  liquibase: [
    { label: "Liquibase Docs", url: "https://docs.liquibase.com/" },
    { label: "Liquibase Concepts", url: "https://docs.liquibase.com/concepts/home.html" },
  ],
  bash: [
    { label: "Bash Manual", url: "https://www.gnu.org/software/bash/manual/" },
    { label: "GNU Bash", url: "https://www.gnu.org/software/bash/" },
  ],
  git: [
    { label: "Git Documentation", url: "https://git-scm.com/doc" },
    { label: "Pro Git Book", url: "https://git-scm.com/book/en/v2" },
  ],
  railway: [
    { label: "Railway Docs", url: "https://docs.railway.com/" },
    { label: "Railway Deployments", url: "https://docs.railway.com/guides/deployments" },
  ],
  sql: [
    { label: "PostgreSQL SQL Docs", url: "https://www.postgresql.org/docs/current/sql.html" },
    { label: "MySQL SQL Statements", url: "https://dev.mysql.com/doc/refman/8.4/en/sql-statements.html" },
  ],
  jira: [
    { label: "Jira Support Docs", url: "https://support.atlassian.com/jira-software-cloud/" },
    { label: "Jira Guides", url: "https://www.atlassian.com/software/jira/guides" },
  ],
  confluence: [
    { label: "Confluence Support Docs", url: "https://support.atlassian.com/confluence-cloud/" },
    { label: "Confluence Guides", url: "https://www.atlassian.com/software/confluence/guides" },
  ],
  agile: [
    { label: "Atlassian Agile Guide", url: "https://www.atlassian.com/agile" },
    { label: "Agile Project Management", url: "https://www.atlassian.com/agile/project-management" },
  ],
  scrum: [
    { label: "Scrum Guide", url: "https://scrumguides.org/scrum-guide.html" },
    { label: "Scrum.org What Is Scrum", url: "https://www.scrum.org/resources/what-scrum-module" },
  ],
  siem: [
    { label: "Microsoft Sentinel Docs", url: "https://learn.microsoft.com/en-us/azure/sentinel/" },
    { label: "Splunk Documentation", url: "https://docs.splunk.com/Documentation/Splunk" },
  ],
  "ids-ips": [
    { label: "Snort Docs", url: "https://docs.snort.org/" },
    { label: "Suricata Docs", url: "https://docs.suricata.io/" },
  ],
};

const SectionTitle = ({ children, subtitle }: { children: ReactNode; subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-3xl font-bold text-white md:text-4xl">{children}</motion.h2>
    {subtitle && <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="max-w-2xl text-zinc-400">{subtitle}</motion.p>}
    <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-4 h-1 rounded-full bg-[#51aaca]" />
  </div>
);

const Card = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`glass rounded-2xl p-6 transition-all duration-300 group hover:border-[#51aaca]/30 ${className}`}>{children}</motion.div>
);

const OfficialResourceLinks = ({
  language,
  resources,
  compact = false,
}: {
  language: Language;
  resources: OfficialResource[];
  compact?: boolean;
}) => {
  if (resources.length === 0) return null;

  const text = language === "uk"
    ? {
      eyebrow: "Офіційні джерела",
      subtitle: "Документація та гайди від проєктів або вендорів.",
    }
    : {
      eyebrow: "Official resources",
      subtitle: "Documentation and guides from projects or vendors.",
    };

  return (
    <div className={`overflow-hidden rounded-3xl border border-[#51aaca]/24 bg-[#061a26]/70 shadow-[0_20px_55px_rgba(0,0,0,0.22),0_0_26px_rgba(81,170,202,0.08)] backdrop-blur-md ${compact ? "p-4" : "p-5"}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9ed8ea]">{text.eyebrow}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{text.subtitle}</p>
        </div>
        <span className="rounded-full border border-[#51aaca]/25 bg-[#51aaca]/10 px-3 py-1 text-[10px] font-black text-[#d8f3fb]">
          {resources.length}
        </span>
      </div>
      <div className="grid gap-3">
        {resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-[#51aaca]/18 bg-[#092231]/82 px-4 py-3 text-sm font-black text-white shadow-[0_10px_26px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#9ed8ea]/70 hover:bg-[#51aaca] hover:text-[#021014]"
          >
            <span className="min-w-0 truncate">{resource.label}</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-[#9ed8ea] transition group-hover:text-[#021014]" />
          </a>
        ))}
      </div>
    </div>
  );
};

const BeginnerToolGuide = ({
  language,
  skill,
  resources,
  compact = false,
}: {
  language: Language;
  skill: Skill;
  resources: OfficialResource[];
  compact?: boolean;
}) => {
  const firstPractice = splitBullet(skill.bullets[language][0] || skill.summary[language]);
  const docsLabel = resources[0]?.label || (language === "uk" ? "офіційну документацію" : "official documentation");
  const text = language === "uk"
    ? {
      eyebrow: "Міні-гайд для новачка",
      title: `Як почати з ${skill.name}`,
      intro: "Короткий шлях: зрозуміти роль, зробити одну практичну дію, а потім закріпити через docs або AI.",
      steps: [
        {
          label: "01",
          title: "Зрозумій роль",
          body: `${skill.name} у цьому стеку: ${skill.summary[language]}`,
        },
        {
          label: "02",
          title: "Спробуй руками",
          body: firstPractice.details
            ? `${firstPractice.title}: ${firstPractice.details}`
            : firstPractice.title,
        },
        {
          label: "03",
          title: "Закріпи без хаосу",
          body: `Відкрий ${docsLabel}, пройди перший офіційний приклад і попроси AI пояснити незрозумілий крок простими словами.`,
        },
      ],
    }
    : {
      eyebrow: "Beginner mini guide",
      title: `How to start with ${skill.name}`,
      intro: "A short path: understand the role, try one practical action, then reinforce it with docs or AI.",
      steps: [
        {
          label: "01",
          title: "Understand the role",
          body: `${skill.name} in this stack: ${skill.summary[language]}`,
        },
        {
          label: "02",
          title: "Try it hands-on",
          body: firstPractice.details
            ? `${firstPractice.title}: ${firstPractice.details}`
            : firstPractice.title,
        },
        {
          label: "03",
          title: "Reinforce it cleanly",
          body: `Open ${docsLabel}, follow the first official example, and ask the AI to explain any confusing step in simple words.`,
        },
      ],
    };

  return (
    <div className={`overflow-hidden rounded-3xl border border-[#51aaca]/24 bg-[#061a26]/76 shadow-[0_20px_55px_rgba(0,0,0,0.24),0_0_30px_rgba(81,170,202,0.09)] backdrop-blur-md ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9ed8ea]">{text.eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-white">{text.title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{text.intro}</p>
      <div className="mt-5 grid gap-3">
        {text.steps.map((step) => (
          <div key={step.label} className="group rounded-2xl border border-[#51aaca]/16 bg-[#092231]/70 p-4 transition hover:border-[#9ed8ea]/55 hover:bg-[#0b2a3a]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#51aaca]/30 bg-[#51aaca]/10 text-xs font-black text-[#d8f3fb] group-hover:bg-[#51aaca] group-hover:text-[#021014]">
                {step.label}
              </span>
              <h3 className="text-sm font-black text-white">{step.title}</h3>
            </div>
            <p className="text-sm leading-6 text-zinc-300">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const BackgroundScene = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_34%)]" />
    <motion.div animate={{ x: [0, 30, -10, 0], y: [0, -20, 15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="telegram-sensitive-effect absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[#9ed8ea]/10 blur-[90px]" />
    <motion.div animate={{ x: [0, -40, 20, 0], y: [0, 20, -25, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} className="telegram-sensitive-effect absolute right-[6%] top-[22%] h-96 w-96 rounded-full bg-cyan-200/8 blur-[110px]" />
    <motion.div animate={{ x: [0, 20, -18, 0], y: [0, -12, 20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} className="telegram-sensitive-effect absolute bottom-[8%] left-[20%] h-64 w-64 rounded-full bg-cyan-200/10 blur-[80px]" />
    <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#030b12] via-[#030b12]/75 to-transparent" />
  </div>
);

const InfinityHero = () => (
  <motion.div animate={{ x: [0, 12, -8, 0], y: [0, -10, 8, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[24%] top-[9%] hidden opacity-[0.65] xl:block">
    <svg viewBox="0 0 520 240" className="h-[210px] w-[460px] overflow-visible">
      <defs>
        <linearGradient id="infinityStroke" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="rgba(81,170,202,0.16)" />
          <stop offset="50%" stopColor="rgba(158,216,234,0.28)" />
          <stop offset="100%" stopColor="rgba(216,243,251,0.16)" />
        </linearGradient>
      </defs>
      <motion.path d="M65 120C95 55 160 38 212 64C244 80 269 108 290 120C312 132 338 160 370 176C424 203 482 183 501 120C482 57 424 37 370 64C338 80 312 108 290 120C269 132 244 160 212 176C160 202 95 185 65 120Z" animate={{ pathLength: [0.78, 1, 0.82, 0.78], opacity: [0.24, 0.48, 0.3, 0.24] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} fill="none" stroke="url(#infinityStroke)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </motion.div>
);

const StartupLoader = () => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.55, ease: "easeOut" }}
    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#02070d]"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(81,170,202,0.2),transparent_34%)]" />
    <motion.div
      initial={{ scale: 0.72, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center"
    >
      <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-[#51aaca]/20 border-t-[#51aaca] shadow-[0_0_40px_rgba(81,170,202,0.3)]"
        />
        <motion.img
          src="/logo.svg"
          alt=""
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.9, 1, 0.94, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-20 w-20 rounded-full border border-[#d8f3fb]/20 bg-[#071b2a] p-1"
        />
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 220 }}
        transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
        className="h-px bg-gradient-to-r from-transparent via-[#51aaca] to-transparent"
      />
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        className="mt-5 text-xs font-semibold uppercase tracking-[0.34em] text-[#d8f3fb]"
      >
        Maksym DevOps
      </motion.p>
    </motion.div>
  </motion.div>
);

const skills: Skill[] = [
  { slug: "linux", name: "Linux", icon: <Terminal className="h-4 w-4" />, summary: { uk: "Основа для серверів, автоматизації та адміністрування.", en: "A foundation for servers, automation, and administration." }, description: { uk: "Linux для мене є базовим середовищем для серверів, shell-автоматизації, логів, прав доступу та налаштування сервісів. Це про реальну роботу в терміналі: піднімати сервіси, перевіряти стани, оновлювати пакети, читати логи і підтримувати стабільне серверне середовище.", en: "Linux is my baseline environment for servers, shell automation, logs, permissions, and service configuration. It means real terminal work: starting services, checking status, updating packages, reading logs, and maintaining stable server environments." }, bullets: { uk: ["Робота з shell, `systemd` і пакетами: запуск сервісів, перевірка статусів, оновлення та встановлення потрібних утиліт.", "Налагодження логів, сервісів і мережі: читання `journalctl`, перевірка портів, процесів, DNS і доступності сервісів.", "Підготовка серверного середовища під деплой: права доступу, структура директорій, змінні середовища, базові скрипти обслуговування."], en: ["Working with shell, `systemd`, and packages: starting services, checking statuses, and installing or updating required utilities.", "Troubleshooting logs, services, and networking: reading `journalctl`, checking ports, processes, DNS, and service availability.", "Preparing server environments for deployment: permissions, directory layout, environment variables, and basic maintenance scripts."] } },
  { slug: "docker", name: "Docker", icon: <Container className="h-4 w-4" />, summary: { uk: "Контейнеризація для однакової роботи локально й у production.", en: "Containerization for consistent local and production behavior." }, description: { uk: "Docker пакує застосунок разом із залежностями в переносимий контейнер. Для мене це практична робота з образами, шарами, збіркою, запуском і підготовкою сервісів до деплою в контрольованому середовищі.", en: "Docker packages an application together with dependencies into a portable container. For me, that means hands-on work with images, layers, builds, container runs, and preparing services for deployment in controlled environments." }, bullets: { uk: ["Створення `Dockerfile` і multi-stage build: оптимізація образу, залежностей і фінального runtime.", "Підготовка контейнерів для CI/CD: збірка, теги, перевірка запуску і готовність до registry або деплою.", "Ізольоване середовище для сервісів: однаковий запуск локально, на staging і в production."], en: ["Creating `Dockerfile` and multi-stage builds: optimizing images, dependencies, and final runtime.", "Preparing containers for CI/CD: builds, tags, startup checks, and readiness for registry or deployment.", "Using isolated service environments so behavior stays consistent across local, staging, and production."] } },
  { slug: "kubernetes", name: "Kubernetes", icon: <Globe className="h-4 w-4" />, summary: { uk: "Оркестрація контейнерів та масштабування сервісів.", en: "Container orchestration and service scaling." }, description: { uk: "Kubernetes допомагає керувати контейнерними застосунками, їх масштабуванням, доступністю та конфігурацією. Для мене це вже не просто список сутностей, а розуміння того, як сервіс живе в кластері, як він оновлюється, де зберігає налаштування і як поводиться під навантаженням.", en: "Kubernetes helps manage containerized applications, scaling, availability, and configuration. For me, this is not just a list of objects but an understanding of how a service lives in a cluster, updates safely, stores configuration, and behaves under load." }, bullets: { uk: ["Pods, Deployments, Services, ConfigMaps: вмію зібрати базову структуру застосунку в кластері, винести конфігурацію окремо і забезпечити стабільний запуск контейнерів.", "Базове масштабування й організація кластера: розумію, як збільшувати кількість реплік, як сервіси маршрутизують трафік і як підтримувати передбачувану поведінку застосунку.", "Контроль життєвого циклу сервісів: rollout, перезапуск, оновлення конфігурації, перевірка стану подів і базове усунення проблем під час деплою."], en: ["Pods, Deployments, Services, ConfigMaps: I can build the basic application structure inside a cluster, separate configuration, and keep containers running reliably.", "Basic scaling and cluster organization: I understand how to increase replicas, how services route traffic, and how to keep application behavior predictable.", "Service lifecycle control: rollouts, restarts, config updates, pod health checks, and basic troubleshooting during deployment." ] } },
  { slug: "azure", name: "Azure", icon: <Cloud className="h-4 w-4" />, summary: { uk: "Хмарне середовище для розгортання сервісів та інфраструктури.", en: "A cloud environment for services and infrastructure." }, description: { uk: "Azure дозволяє піднімати середовища для застосунків, мережі, інфраструктурних сервісів і зв'язувати це з DevOps-процесами. Тут для мене головне — не просто створити ресурс, а зрозуміти, як він вписується в загальну інфраструктуру, мережу, доступи і майбутній деплой.", en: "Azure makes it possible to provision application environments, networks, infrastructure services, and connect them with DevOps workflows. What matters to me here is not only creating a resource, but understanding how it fits into the wider infrastructure, network, access setup, and deployment flow." }, bullets: { uk: ["Базовий provisioning ресурсів: створення середовищ під застосунки, розуміння призначення окремих сервісів і базова структура хмарного оточення.", "Налаштування мережі та хмарних середовищ: робота з логікою доступів, зв'язністю сервісів і підготовкою оточення для безпечного запуску застосунків.", "Інтеграція з IaC і pipeline-ами: підхід, де Azure-ресурси не живуть окремо, а керуються разом із кодом інфраструктури та процесом доставки."], en: ["Basic resource provisioning: creating environments for applications, understanding what each service is for, and shaping a basic cloud layout.", "Configuring networking and cloud environments: working with access logic, service connectivity, and safe application hosting.", "Integration with IaC and pipelines: an approach where Azure resources are managed together with infrastructure code and deployment workflows."] } },
  { slug: "terraform", name: "Terraform", icon: <Cpu className="h-4 w-4" />, summary: { uk: "Infrastructure as Code для відтворюваних середовищ.", en: "Infrastructure as Code for reproducible environments." }, description: { uk: "Terraform дає змогу описувати хмарні ресурси кодом, версіонувати інфраструктуру та уникати ручних дій. Тут для мене важлива передбачуваність: один і той самий код має однаково піднімати середовище знову і знову.", en: "Terraform lets me define cloud resources as code, version infrastructure, and avoid manual setup. What matters to me here is predictability: the same code should recreate the same environment again and again." }, bullets: { uk: ["Робота зі `state` і модулями: підтримка структури, повторне використання конфігурацій, контроль залежностей.", "Повторюване розгортання середовищ: одні й ті самі ресурси можна підняти без ручного кліку в панелі.", "Контроль змін інфраструктури: валідація, планування змін і розуміння, що саме буде створено або оновлено."], en: ["Working with `state` and modules: keeping structure clean, reusing configurations, and controlling dependencies.", "Reproducible environment provisioning without manual clicking through dashboards.", "Controlling infrastructure changes with validation, planning, and clear visibility into what will be created or updated."] } },
  { slug: "ci-cd", name: "CI/CD", icon: <Code2 className="h-4 w-4" />, summary: { uk: "Автоматизована доставка змін від коміту до деплою.", en: "Automated delivery of changes from commit to deployment." }, description: { uk: "CI/CD допомагає швидко й стабільно перевіряти, збирати та доставляти зміни без зайвої ручної роботи. Для мене це про дисципліну в релізах: щоб будь-яка зміна проходила однаковий зрозумілий шлях і не залежала від ручних дій у останній момент.", en: "CI/CD helps validate, build, and deliver changes quickly and reliably with less manual work. For me, this is about release discipline: every change should follow a clear, repeatable path instead of depending on last-minute manual actions." }, bullets: { uk: ["Автоматизація build, test і deploy етапів: зміни проходять перевірку в одному потоці замість ручного запуску кожного кроку окремо.", "Зменшення ручних помилок у релізах: менше шансів щось забути, не той файл викотити або пропустити важливу перевірку.", "Швидший і передбачуваніший цикл доставки: команда або я сам розумію, як код доходить від коміту до робочого середовища."], en: ["Automating build, test, and deploy stages so changes move through a single consistent pipeline instead of manual step-by-step execution.", "Reducing manual release mistakes such as forgotten steps, wrong files, or skipped checks.", "Creating a faster and more predictable delivery cycle from commit to running environment."] } },
  { slug: "github-actions", name: "GitHub Actions", icon: <Github className="h-4 w-4" />, summary: { uk: "Автоматизація перевірок, білдів і деплою.", en: "Automation for checks, builds, and deployment." }, description: { uk: "GitHub Actions допомагає запускати CI/CD прямо з репозиторію: перевірки, збирання образів, деплой і роботу зі змінними середовища. Це зручно тим, що логіка автоматизації зберігається поруч із кодом і легко відстежується у git.", en: "GitHub Actions enables CI/CD directly from the repository: checks, image builds, deploys, and environment variable handling. The advantage is that automation lives next to the code and is easy to track in git." }, bullets: { uk: ["Workflow для CI/CD: описую послідовність дій у YAML, щоб репозиторій сам запускав потрібні перевірки та збірки.", "Автозапуск на push і PR: одразу видно, чи проходить код перевірки і чи готовий він до злиття або релізу.", "Інтеграція з контейнерами: збирання образів, перевірка контейнерного запуску і підготовка артефактів до деплою."], en: ["CI/CD workflows: describing automation in YAML so the repository can run checks and builds on its own.", "Auto-runs on push and PR: giving immediate visibility into whether code is healthy and ready to merge or release.", "Integration with containers: building images, validating container startup, and preparing deployment artifacts."] } },
  { slug: "python", name: "Python", icon: <Code2 className="h-4 w-4" />, summary: { uk: "Мова для автоматизації, скриптів і інтеграцій.", en: "A language for automation, scripts, and integrations." }, description: { uk: "Python використовую для утиліт, ботів, інтеграцій з API та задач автоматизації в DevOps і AI-проєктах. Це інструмент, який дає змогу швидко перетворювати ідею або рутинну дію на робочий скрипт чи сервіс.", en: "I use Python for utilities, bots, API integrations, and automation tasks in DevOps and AI projects. It is the tool that lets me turn an idea or repetitive action into a working script or service quickly." }, bullets: { uk: ["Скрипти для автоматизації процесів: обробка даних, допоміжні утиліти, сервісні задачі та швидкі внутрішні інструменти.", "Інтеграції з API та ботами: запити до зовнішніх сервісів, обробка відповідей і побудова прикладної логіки поверх них.", "Практичне використання в pet-проєктах і сервісах: Python у мене не теоретичний, а напряму пов'язаний із реальними AI та automation-проєктами."], en: ["Process automation scripts: data handling, helper utilities, service tasks, and quick internal tools.", "API and bot integrations: calling external services, handling responses, and building practical logic on top of them.", "Practical use in pet projects and services: for me Python is tied directly to real AI and automation work, not just theory."] } },
  { slug: "mysql", name: "MySQL", icon: <Database className="h-4 w-4" />, summary: { uk: "Реляційна база даних для прикладних сервісів та адміністрування.", en: "A relational database for application services and administration." }, description: { uk: "MySQL використовую для керування користувачами, резервного копіювання, відновлення та базового операційного супроводу БД. Це про практичне розуміння того, як база підтримує сервіс не тільки на етапі розробки, а й у щоденній експлуатації.", en: "I use MySQL for user management, backup, restore, and general database operations. This is about practical understanding of how a database supports a service not only in development, but also in day-to-day operation." }, bullets: { uk: ["Керування користувачами та правами: створення доступів, базова безпека і контроль того, хто та з якими правами працює з БД.", "Backup/restore і перевірка стану БД: важливо не лише зберігати дані, а й бути впевненим, що їх реально можна відновити.", "Робота з логами та підтримкою сервісів: діагностика повільних запитів, базовий аналіз проблем і стабільність роботи застосунку."], en: ["Managing users and permissions: creating access, applying basic security, and controlling who can do what in the database.", "Backup/restore and health checks: it matters not only to save data, but to know it can actually be restored.", "Working with logs and service support: diagnosing slow queries, analyzing basic issues, and keeping the application stable."] } },
  { slug: "postgresql", name: "PostgreSQL", icon: <Database className="h-4 w-4" />, summary: { uk: "Надійна реляційна база даних для сучасних застосунків.", en: "A reliable relational database for modern applications." }, description: { uk: "PostgreSQL входить у мій стек як одна з основних БД для сервісів, де важливі стабільність, структура даних і робота в production-середовищі. Я сприймаю її як частину цілісної інфраструктури, а не окремий модуль сам по собі.", en: "PostgreSQL is part of my stack as a core database for services where stability, data structure, and production-readiness matter. I see it as part of the full infrastructure, not an isolated component." }, bullets: { uk: ["Підключення застосунків до PostgreSQL: коректна конфігурація з'єднань, середовищ і доступів для стабільної роботи сервісу.", "Базові операції адміністрування та підтримки: перевірка доступності, спостереження за станом і розуміння, де шукати причину проблем.", "Робота з конфігурацією середовищ і сервісів: PostgreSQL у моєму стеку тісно пов'язаний із контейнерами, деплоєм і змінними середовища."], en: ["Connecting applications to PostgreSQL with correct connection settings, environments, and access control for stable service behavior.", "Basic administration and support tasks: checking availability, observing health, and knowing where to look when issues appear.", "Working with environment and service configuration: in my stack PostgreSQL is closely tied to containers, deployment, and environment variables."] } },
  { slug: "liquibase", name: "Liquibase", icon: <Database className="h-4 w-4" />, summary: { uk: "Керування міграціями баз даних і контроль змін схеми.", en: "Database migration management and schema change control." }, description: { uk: "Liquibase допомагає впорядковано застосовувати зміни до БД, відстежувати міграції та робити релізи передбачуванішими. Для мене це важливо там, де база даних має розвиватися разом із застосунком, а не вручну підправлятися на кожному середовищі окремо.", en: "Liquibase helps apply database changes in a controlled way, track migrations, and make releases more predictable. This matters when the database has to evolve together with the application instead of being edited manually in each environment." }, bullets: { uk: ["Керування версіями схеми БД: зміни до таблиць, індексів чи структури мають бути зафіксовані як частина релізного процесу.", "Послідовне застосування міграцій між середовищами: dev, test і production повинні рухатись однією логікою, а не розходитись з часом.", "Зменшення ризику ручних помилок у БД: замість ручних SQL-змін є контрольований і відтворюваний процес."], en: ["Versioning database schema changes so table, index, and structure updates become part of the release flow.", "Applying migrations consistently across dev, test, and production instead of letting environments drift apart over time.", "Reducing manual database change mistakes by replacing ad hoc SQL edits with a controlled repeatable process."] } },
  { slug: "bash", name: "Bash", icon: <Terminal className="h-4 w-4" />, summary: { uk: "Shell-автоматизація для серверних і DevOps задач.", en: "Shell automation for server and DevOps tasks." }, description: { uk: "Bash використовую для командного рядка, скриптів обслуговування, деплойних команд і швидкої автоматизації рутинних операцій. Це той рівень, де багато щоденних DevOps-дій перетворюються на короткі, зрозумілі та повторювані команди.", en: "I use Bash for command-line work, maintenance scripts, deployment commands, and quick automation of repetitive tasks. This is the layer where many everyday DevOps actions become short, understandable, and repeatable commands." }, bullets: { uk: ["Написання shell-скриптів для типових операцій: перевірки, запуск, очистка, резервні дії.", "Автоматизація щоденних операцій на Linux: робота з файлами, логами, змінними середовища і сервісами.", "Швидка робота з серверами й логами без зайвих ручних кроків через UI."], en: ["Writing shell scripts for typical operations such as checks, startup, cleanup, and fallback actions.", "Automating everyday Linux operations: files, logs, environment variables, and services.", "Working quickly with servers and logs without unnecessary manual UI steps."] } },
  { slug: "git", name: "Git", icon: <GitBranch className="h-4 w-4" />, summary: { uk: "Контроль версій для коду, конфігурацій та командної роботи.", en: "Version control for code, configuration, and team collaboration." }, description: { uk: "Git використовую для відстеження змін, роботи з гілками, комітами та історією проєкту. Для DevOps це важливо не тільки в коді застосунку, а й у конфігураціях, інфраструктурі та CI/CD, де кожна зміна має бути прозорою й відтворюваною.", en: "I use Git to track changes, work with branches, commits, and project history. In DevOps this matters not only for application code, but also for configuration, infrastructure, and CI/CD, where every change should be transparent and reproducible." }, bullets: { uk: ["Робота з гілками, комітами та pull request-процесом: зміни проходять зрозумілий шлях від локальної роботи до репозиторію.", "Відстеження змін у конфігураціях і коді інфраструктури: видно, хто, що і навіщо змінив.", "Базове вирішення конфліктів і підтримка чистої історії змін для командної розробки."], en: ["Working with branches, commits, and pull request workflows so changes move clearly from local work to the repository.", "Tracking changes in configuration and infrastructure code with visibility into what changed and why.", "Basic conflict resolution and keeping project history clean for team development."] } },
  { slug: "railway", name: "Railway", icon: <RailSymbol className="h-4 w-4" />, summary: { uk: "Хмарний PaaS для швидкого деплою застосунків і сервісів.", en: "A cloud PaaS for fast deployment of applications and services." }, description: { uk: "Railway використовую як платформу для швидкого запуску pet-проєктів, демо-сервісів і backend-застосунків. Вона добре підходить для практики деплою, роботи зі змінними середовища, логами та production-подібним запуском без зайвої інфраструктурної складності.", en: "I use Railway as a platform for quickly launching pet projects, demo services, and backend applications. It is useful for deployment practice, environment variables, logs, and production-like hosting without unnecessary infrastructure overhead." }, bullets: { uk: ["Деплой застосунків із GitHub-репозиторію: код можна швидко довести до працюючого live-сервісу.", "Робота зі змінними середовища, доменами, логами та перезапуском сервісів.", "Практика production-підходу для невеликих проєктів: перевірка запуску, доступності й поведінки після релізу."], en: ["Deploying applications from a GitHub repository so code can quickly become a live service.", "Working with environment variables, domains, logs, and service restarts.", "Practicing production-minded workflows for small projects: startup checks, availability checks, and post-release behavior."] } },
  { slug: "sql", name: "SQL", icon: <Database className="h-4 w-4" />, summary: { uk: "Мова запитів для роботи з реляційними базами даних.", en: "A query language for working with relational databases." }, description: { uk: "SQL є базою для роботи з MySQL, PostgreSQL та міграціями. Для мене це практичний інструмент для перевірки даних, діагностики проблем, підготовки змін до схеми та розуміння того, як застосунок взаємодіє з базою.", en: "SQL is the foundation for working with MySQL, PostgreSQL, and database migrations. For me it is a practical tool for checking data, diagnosing issues, preparing schema changes, and understanding how an application interacts with a database." }, bullets: { uk: ["Написання базових запитів для вибірки, фільтрації, оновлення й перевірки даних.", "Розуміння таблиць, зв'язків, індексів і того, як структура БД впливає на роботу сервісу.", "Використання SQL у зв'язці з адмініструванням БД, backup/restore і міграціями."], en: ["Writing basic queries for selecting, filtering, updating, and validating data.", "Understanding tables, relationships, indexes, and how database structure affects service behavior.", "Using SQL together with database administration, backup/restore, and migrations."] } },
  { slug: "jira", name: "Jira", icon: <Kanban className="h-4 w-4" />, summary: { uk: "Керування задачами, спринтами та прозорим робочим процесом.", en: "Task, sprint, and workflow management." }, description: { uk: "Jira допомагає організовувати задачі, бачити пріоритети, статуси й відповідальність у команді. Для мене це інструмент, який робить технічну роботу керованою: видно, що потрібно зробити, що в роботі, що заблоковано і що вже готове.", en: "Jira helps organize tasks, priorities, statuses, and ownership inside a team. For me it makes technical work manageable: it is clear what needs to be done, what is in progress, what is blocked, and what is complete." }, bullets: { uk: ["Робота з backlog, sprint board і статусами задач: від ідеї або bug report до виконання.", "Пріоритезація та розбиття роботи на зрозумілі технічні кроки.", "Командна прозорість: кожен бачить стан задачі, відповідального і наступну дію."], en: ["Working with backlog, sprint boards, and task statuses from idea or bug report to completion.", "Prioritizing and breaking work into clear technical steps.", "Team transparency: everyone can see task status, ownership, and the next action."] } },
  { slug: "confluence", name: "Confluence", icon: <BookOpen className="h-4 w-4" />, summary: { uk: "Документація процесів, рішень та технічного контексту.", en: "Documentation for processes, decisions, and technical context." }, description: { uk: "Confluence використовується для збереження знань команди: інструкцій, технічних нотаток, описів процесів і рішень. Для DevOps це особливо корисно, бо деплой, доступи, середовища й troubleshooting мають бути описані так, щоб їх можна було повторити.", en: "Confluence is used to keep team knowledge: instructions, technical notes, process descriptions, and decisions. In DevOps this is especially useful because deployment, access, environments, and troubleshooting need to be documented in a repeatable way." }, bullets: { uk: ["Опис технічних процесів: деплой, налаштування середовищ, доступи й типові операційні дії.", "Фіксація рішень і контексту, щоб команда не втрачала важливі деталі після завершення задачі.", "Створення зрозумілих інструкцій для підтримки, onboarding і повторюваних процедур."], en: ["Documenting technical processes such as deployment, environment setup, access, and common operational actions.", "Capturing decisions and context so the team does not lose important details after a task is finished.", "Creating clear instructions for support, onboarding, and repeatable procedures."] } },
  { slug: "agile", name: "Agile", icon: <Users className="h-4 w-4" />, summary: { uk: "Гнучкий підхід до командної розробки та поступової доставки цінності.", en: "A flexible approach to teamwork and incremental delivery." }, description: { uk: "Agile для мене означає роботу короткими ітераціями, регулярний зворотний зв'язок і готовність адаптувати план під реальні пріоритети. У DevOps це добре поєднується з поступовими релізами, швидкими перевірками та постійним покращенням процесів.", en: "For me, Agile means working in short iterations, using regular feedback, and adapting plans to real priorities. In DevOps it fits well with incremental releases, fast validation, and continuous process improvement." }, bullets: { uk: ["Ітеративна робота: менші зміни легше перевіряти, релізити й підтримувати.", "Фокус на прозорості, зворотному зв'язку та регулярному покращенні процесів.", "Командна взаємодія між розробкою, тестуванням, DevOps і бізнес-контекстом."], en: ["Iterative work: smaller changes are easier to validate, release, and support.", "Focus on transparency, feedback, and regular process improvement.", "Team collaboration across development, testing, DevOps, and business context."] } },
  { slug: "scrum", name: "Scrum", icon: <ClipboardList className="h-4 w-4" />, summary: { uk: "Фреймворк для спринтів, планування та регулярної командної синхронізації.", en: "A framework for sprints, planning, and regular team synchronization." }, description: { uk: "Scrum допомагає структурувати командну роботу через спринти, планування, daily, review і ретроспективи. Це дає ритм, у якому технічні задачі не губляться, а прогрес і блокери регулярно стають видимими.", en: "Scrum helps structure team work through sprints, planning, daily syncs, reviews, and retrospectives. It creates a rhythm where technical tasks are not lost, and progress and blockers become visible regularly." }, bullets: { uk: ["Розуміння sprint planning, daily sync, review і retrospective як частин командного циклу.", "Вміння працювати із задачами в межах спринту, оцінювати пріоритети та повідомляти про блокери.", "Підтримка передбачуваного ритму доставки, де команда регулярно перевіряє результат і процес."], en: ["Understanding sprint planning, daily sync, review, and retrospective as parts of the team cycle.", "Working with tasks inside a sprint, assessing priorities, and communicating blockers.", "Supporting a predictable delivery rhythm where the team regularly reviews both outcomes and process."] } },
  { slug: "siem", name: "SIEM", icon: <ShieldCheck className="h-4 w-4" />, summary: { uk: "Безпековий моніторинг і кореляція подій.", en: "Security monitoring and event correlation." }, description: { uk: "SIEM додає до мого профілю розуміння безпекового моніторингу, централізації логів та аналізу підозрілих подій. Це корисний міст між інфраструктурою та кібербезпекою, де важливо не просто збирати логи, а вміти бачити в них сигнали ризику.", en: "SIEM adds security monitoring, centralized logging, and suspicious event analysis to my skill set. It acts as a bridge between infrastructure and cybersecurity, where the goal is not only to collect logs but to detect meaningful risk signals inside them." }, bullets: { uk: ["Розуміння збору та аналізу логів: централізований погляд на події допомагає бачити картину системи цілком, а не окремими фрагментами.", "Базова робота з подіями безпеки: виявлення підозрілої активності, нетипових дій або ознак інциденту.", "Зв'язок між DevOps і security-практиками: інфраструктура має бути не лише автоматизованою, а й спостережуваною з точки зору безпеки."], en: ["Understanding log collection and analysis so system behavior can be observed centrally rather than as isolated fragments.", "Basic work with security events: spotting suspicious activity, unusual behavior, or indicators of an incident.", "Connecting DevOps and security practices so infrastructure is not only automated, but also security-observable."] } },
  { slug: "ids-ips", name: "IDS/IPS", icon: <ShieldCheck className="h-4 w-4" />, summary: { uk: "Виявлення та запобігання мережевим загрозам.", en: "Detection and prevention of network threats." }, description: { uk: "IDS/IPS для мене — це частина кібербезпекового фундаменту: розуміння того, як виявляються аномалії й реагують системи захисту. Ця частина стеку підсилює загальне бачення безпечної інфраструктури, де важливо не лише розгорнути сервіс, а й розуміти, як його захищати.", en: "IDS/IPS is part of my cybersecurity foundation: understanding how anomalies are detected and how defense systems respond. This strengthens my overall view of secure infrastructure, where it is not enough to deploy a service — you also need to understand how to protect it." }, bullets: { uk: ["Базове розуміння мережевих атак і сигналів: як виглядає підозріла активність і які патерни можуть вказувати на загрозу.", "Знайомство з інструментами виявлення й захисту: що саме робить система моніторингу, а що — система превентивного блокування.", "Підсилення безпекового мислення в інфраструктурі: під час роботи з сервісами важливо думати не тільки про доступність, а й про захист."], en: ["Basic understanding of network attacks and signals: what suspicious activity looks like and which patterns may indicate a threat.", "Familiarity with detection and protection tools: understanding the difference between observing malicious behavior and blocking it proactively.", "Strengthening security thinking in infrastructure so service design includes protection, not only availability."] } },
];

const learningProviders: LearningProvider[] = [
  { slug: "p12", title: "12 Project", url: "https://p12.com.ua/", category: { uk: "Англійська мова", en: "English learning" }, summary: { uk: "Курси англійської, які посилили технічну комунікацію та читання документації.", en: "English courses that strengthened technical communication and documentation reading." }, highlights: { uk: ["Практична англійська для роботи й навчання.", "Підтримка рівня B2 для технічної комунікації."], en: ["Practical English for work and study.", "Support for B2-level technical communication."] } },
  { slug: "beetroot", title: "Beetroot Academy", url: "https://beetroot.academy/", category: { uk: "Project Management / IT", en: "Project Management / IT" }, summary: { uk: "Навчання, яке посилило розуміння командної взаємодії та керування задачами.", en: "Training that strengthened my understanding of teamwork and task coordination." }, highlights: { uk: ["Практичний підхід до роботи в IT-команді.", "Комунікація, пріоритезація й менеджмент."], en: ["A practical approach to working in an IT team.", "Communication, prioritization, and management."] } },
  { slug: "mate", title: "Mate academy", url: "https://mate.academy/", category: { uk: "DevOps", en: "DevOps" }, summary: { uk: "Ключова DevOps-програма з великою кількістю практичних завдань.", en: "A core DevOps program with a large amount of practical work." }, highlights: { uk: ["Контейнери, Kubernetes, БД, хмара, IaC.", "Практичний підхід і задачі, близькі до реальних."], en: ["Containers, Kubernetes, databases, cloud, IaC.", "A practical approach with real-world-like tasks."] } },
  { slug: "prometheus", title: "Prometheus", url: "https://prometheus.org.ua/", category: { uk: "Онлайн-освіта", en: "Online learning" }, summary: { uk: "Додаткове джерело курсів для безперервного розвитку.", en: "An additional source of courses for continuous growth." }, highlights: { uk: ["Зручний формат для самостійного навчання.", "Добір додаткових курсів під конкретні потреби."], en: ["A convenient format for self-paced learning.", "Useful complementary courses for specific needs."] } },
];

const copy = {
  uk: {
    title: "Maksym Prysiazhnikov | DevOps Портфоліо",
    nav: { about: "Про мене", experience: "Досвід", projects: "Проєкти", learning: "Навчання", contact: "Контакти" },
    hero: { badge: "Відкритий до нових можливостей", role: "DevOps Engineer & Cloud Specialist, зосереджений на побудові стійкої та автоматизованої інфраструктури.", contact: "Зв'язатися", github: "GitHub", resume: "Скачати CV", animated: "Animated version" },
    about: { title: "Про мене", p1: "DevOps / Cloud Engineer із практичним досвідом роботи з Linux, Docker, Kubernetes і процесами хмарного розгортання.", p2: "Спеціалізуюся на основах інфраструктури, роботі з базами даних, автоматизації та доставці застосунків у різні середовища.", p3: "Закінчив інтенсивну DevOps-програму в Mate academy та маю сертифікат Google Cybersecurity. Мені близькі автоматизація, CI/CD та побудова безпечних і масштабованих середовищ.", country: "Україна", english: "Англійська (B2)", stack: "Технічний стек", stackHint: "Натисни на технологію, щоб перейти на окрему сторінку з описом." },
    experience: { title: "Технічний досвід", subtitle: "Практичне застосування DevOps-підходів у реальних сценаріях.", commercialTitle: "Комерційний проєкт — Vid Franko", commercialRole: "DevOps / Deployment Support", liveSite: "Live Site", commercialPoints: ["Долучався до підтримки production-запуску комерційного вебсайту з фокусом на стабільність, доступність і передбачуваний релізний процес.", "Працював із класичними DevOps-практиками: конфігурація середовищ, production-змінні, перевірка збірки, контроль деплою та базова валідація після релізу.", "Підтримував операційний підхід до проєкту: повторювані кроки деплою, перевірка доступності сервісу, увага до логів, конфігурації та швидкого реагування на проблеми."], volunteerTitle: "Проєкт — Volunteer Site", volunteerRole: "DevOps / Deployment Lead", liveDemo: "Live Demo", volunteerPoints: ["Брав участь у деплої та налаштуванні середовища для вебпроєкту.", "Працював із хмарним хостингом, конфігурацією застосунку та production-змінними середовища.", "Забезпечував підключення до бази даних і долучався до підготовки релізів та backend-підтримки."], handsOnTitle: "DevOps Training", handsOnRole: "Mate academy", blocks: [{ title: "Kubernetes і контейнери", text: "Створював і підтримував навчальні проєкти з Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets і Persistent Volumes." }, { title: "Адміністрування баз даних", text: "Практикував керування користувачами MySQL, backup/restore, аналіз slow query logs, моніторинг error logs і сценарії відкату міграцій." }, { title: "Infrastructure as Code", text: "Працював із Terraform та основами Azure для provisioning інфраструктури, керування state, модулів і процесів валідації." }, { title: "CI/CD та автоматизація", text: "Реалізовував автоматизовані пайплайни доставки застосунків із фокусом на environment-based configuration та безпеку." }] },
    projects: { title: "Вибрані проєкти", subtitle: "Особисті проєкти, що демонструють автоматизацію, DevOps-підхід та інтеграцію AI.", items: [{ title: "Portfolio Website with AI Assistant", description: "Особистий сайт-портфоліо на React з плаваючим AI-помічником, сторінками технологій, навчальних платформ і серверною інтеграцією через OpenRouter API.", tags: ["React", "OpenRouter", "AI Chat", "Portfolio"], link: "https://github.com/maximprysyazhnikov/maximsait" }, { title: "AI Crypto CAT Bot", description: "Telegram-бот на Python для аналізу крипторинку з GPT-інсайтами та звітами у форматах Markdown, HTML і PDF.", tags: ["Python", "GPT API", "Market Data", "Automation"], link: "https://github.com/maximprysyazhnikov/ccbv4.0" }, { title: "KROK Worldbuilder Bot", description: "AI-асистент для всесвіту KROK з багатомовною підтримкою, переглядом лору та генерацією image prompts.", tags: ["AI", "Telegram Bot", "Prompt Engineering"], link: "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot" }, { title: "DevOps AI Agent", description: "Орієнтований на автоматизацію бот, інтегрований з OpenRouter API та конфігурацією через змінні середовища.", tags: ["DevOps", "AI", "Python", "API Integration"], link: "https://github.com/maximprysyazhnikov/devops_ai_agent" }] },
    certs: { title: "Сертифікації", items: [{ name: "Професійний сертифікат DevOps Engineer", issuer: "Mate academy", year: "2026", details: "462+ виконаних практичних завдань" }, { name: "Google Cybersecurity Certificate", issuer: "Google / Coursera", year: "2024" }, { name: "Project Management in IT", issuer: "Beetroot Academy", year: "2023" }, { name: "Курс англійської мови (B2, Grade A)", issuer: "12 Project", year: "2024" }] },
    education: { title: "Освіта", items: [{ title: "Архітектура та містобудування", place: "Одеська державна академія будівництва та архітектури" }, { title: "Навчання за напрямами, пов'язаними з програмним забезпеченням", place: "Академія зв'язку імені О. С. Попова" }], languagesTitle: "Мови", languages: [{ label: "Українська", value: "Рідна" }, { label: "Англійська", value: "Upper-Intermediate (B2)" }], providersTitle: "Платформи та курси", providersSubtitle: "Посилання на платформи, які пов'язані з моїм навчанням і розвитком.", visitSite: "Перейти на сайт" },
    learningPage: { back: "До головного меню", openSite: "Відкрити сайт", related: "Інші платформи" },
    techPage: { back: "До головного меню", title: "Технологія", related: "Інші технології" },
    earlier: { title: "Попередній досвід", subtitle: "Фундамент у комунікації, продажах і координації проєктів.", items: [{ period: "2022 – 2026", title: "Аутсорс та волонтерські проєкти", text: "Аутсорс-робота та ведення проєктів на волонтерській основі: координація задач, комунікація з учасниками, підтримка запусків і супровід робочих процесів." }, { period: "2019 – 2022", title: "Самозайнятість", text: "Онлайн-просування продуктів і генерація попиту. Використовував цифрові канали для підтримки продажів." }, { period: "2017 – 2019", title: "Бізнес-партнерство", text: "Комунікація з оптовими покупцями, переговори та координація угод." }, { period: "2016 – 2017", title: "Агент з нерухомості", text: "NBR Real Estate. Супровід операцій з нерухомістю та комунікація з клієнтами." }] },
    contact: { title: "Контакти", subtitle: "Відкритий до нових проєктів, співпраці та професійних можливостей.", linkedin: "LinkedIn", github: "GitHub", email: "Email", emailCopied: "Скопійовано", footer: "Designed and built with care by Maksym Prysiazhnikov." },
    chat: { title: "AI Помічник", subtitle: "Постав питання про мій досвід, стек або проєкти.", open: "AI Помічник", placeholder: "Напиши повідомлення...", send: "Надіслати", loading: "AI друкує відповідь...", welcome: "Привіт! Я AI-помічник цього портфоліо. Можу коротко розповісти про стек, досвід і навчання.", error: "Не вдалося отримати відповідь. Перевір ключ OpenRouter на сервері.", supportButton: "Зворотний звʼязок", supportTitle: "Зворотний звʼязок", supportSubtitle: "Залиш контакти або напиши повідомлення напряму.", supportPlaceholder: "Напиши повідомлення...", supportEmpty: "Почни діалог. Повідомлення прилетить мені в Telegram.", supportSent: "Повідомлення відправлено.", supportError: "Не вдалося відправити. Спробуй ще раз.", supportOffline: "Якщо ти будеш не в мережі, я побачу це в Telegram.", leadTitle: "Контакти для відповіді", leadName: "Імʼя", leadEmail: "Email", leadPhone: "Телефон", leadMessage: "Коротко про запит", leadSubmit: "Надіслати контакти", leadRequired: "Вкажи імʼя та email або телефон.", leadInvalidEmail: "Email має містити @ і крапку.", leadInvalidPhone: "Перевір формат номера телефону.", leadSuccess: "Дякую! Контакти відправлено.", leadError: "Не вдалося відправити контакти. Спробуй ще раз." },
  },
  en: {
    title: "Maksym Prysiazhnikov | DevOps Portfolio",
    nav: { about: "About", experience: "Experience", projects: "Projects", learning: "Learning", contact: "Contact" },
    hero: { badge: "Available for opportunities", role: "DevOps Engineer & Cloud Specialist focused on building resilient, automated infrastructure.", contact: "Get in touch", github: "GitHub", resume: "Download CV", animated: "Animated version" },
    about: { title: "About Me", p1: "DevOps / Cloud Engineer with practical experience in Linux, Docker, Kubernetes, and cloud deployment workflows.", p2: "I specialize in infrastructure fundamentals, database operations, automation, and environment-based application delivery.", p3: "I completed an intensive DevOps program at Mate academy and hold a Google Cybersecurity Certificate. I am passionate about automation, CI/CD pipelines, and building secure, scalable environments.", country: "Ukraine", english: "English (B2)", stack: "Technical Stack", stackHint: "Click a technology to open a separate page with a short explanation." },
    experience: { title: "Technical Experience", subtitle: "Practical application of DevOps principles in real-world scenarios.", commercialTitle: "Commercial Project — Vid Franko", commercialRole: "DevOps / Deployment Support", liveSite: "Live Site", commercialPoints: ["Contributed to production launch support for a commercial website with a focus on stability, availability, and a predictable release process.", "Applied classic DevOps practices: environment configuration, production variables, build verification, deployment control, and basic post-release validation.", "Supported an operational workflow with repeatable deployment steps, service availability checks, attention to logs and configuration, and quick issue response."], volunteerTitle: "Project — Volunteer Site", volunteerRole: "DevOps / Deployment Lead", liveDemo: "Live Demo", volunteerPoints: ["Contributed to deployment and environment setup for a web project.", "Worked with cloud hosting, application configuration, and production environment variables.", "Ensured database connectivity and participated in release setup and backend support."], handsOnTitle: "DevOps Training", handsOnRole: "Mate academy", blocks: [{ title: "Kubernetes & Containers", text: "Built and maintained training projects covering Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets, and Persistent Volumes." }, { title: "Database Administration", text: "Practiced MySQL user management, backup and restore, slow query log analysis, error log monitoring, and migration rollback scenarios." }, { title: "Infrastructure as Code", text: "Worked with Terraform and Azure fundamentals for infrastructure provisioning, state management, modules, and validation workflows." }, { title: "CI/CD & Automation", text: "Implemented automated delivery pipelines with a focus on environment-based configuration and security." }] },
    projects: { title: "Featured Projects", subtitle: "Selected personal projects showcasing automation, DevOps thinking, and AI integration.", items: [{ title: "Portfolio Website with AI Assistant", description: "A personal React portfolio website with a floating AI assistant, technology detail pages, learning platform links, and a server-side OpenRouter integration.", tags: ["React", "OpenRouter", "AI Chat", "Portfolio"], link: "https://github.com/maximprysyazhnikov/maximsait" }, { title: "AI Crypto CAT Bot", description: "A Python Telegram bot for crypto market analysis with GPT-powered insights and reports in Markdown, HTML, and PDF formats.", tags: ["Python", "GPT API", "Market Data", "Automation"], link: "https://github.com/maximprysyazhnikov/ccbv4.0" }, { title: "KROK Worldbuilder Bot", description: "An AI assistant for the KROK universe with multilingual support, lore browsing, and image prompt generation.", tags: ["AI", "Telegram Bot", "Prompt Engineering"], link: "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot" }, { title: "DevOps AI Agent", description: "An automation-oriented bot integrated with the OpenRouter API and configured through environment variables.", tags: ["DevOps", "AI", "Python", "API Integration"], link: "https://github.com/maximprysyazhnikov/devops_ai_agent" }] },
    certs: { title: "Certifications", items: [{ name: "DevOps Engineer Professional Certificate", issuer: "Mate academy", year: "2026", details: "462+ hands-on tasks completed" }, { name: "Google Cybersecurity Certificate", issuer: "Google / Coursera", year: "2024" }, { name: "Project Management in IT", issuer: "Beetroot Academy", year: "2023" }, { name: "English Course (B2, Grade A)", issuer: "12 Project", year: "2024" }] },
    education: { title: "Education", items: [{ title: "Architecture and Urban Planning", place: "Odesa State Academy of Civil Engineering and Architecture" }, { title: "Software-related studies", place: "Popov Academy of Telecommunications" }], languagesTitle: "Languages", languages: [{ label: "Ukrainian", value: "Native" }, { label: "English", value: "Upper-Intermediate (B2)" }], providersTitle: "Platforms and courses", providersSubtitle: "Links to the learning platforms connected to my growth path.", visitSite: "Visit website" },
    learningPage: { back: "Main menu", openSite: "Open website", related: "Other platforms" },
    techPage: { back: "Main menu", title: "Technology", related: "Other technologies" },
    earlier: { title: "Earlier Experience", subtitle: "A foundation in communication, sales, and project coordination.", items: [{ period: "2022 – 2026", title: "Outsourcing and Volunteer Projects", text: "Outsourcing work and project ownership on a volunteer basis: task coordination, stakeholder communication, launch support, and day-to-day workflow management." }, { period: "2019 – 2022", title: "Self-employed", text: "Focused on online product promotion and demand generation, using digital channels to support sales." }, { period: "2017 – 2019", title: "Business Partnership", text: "Handled communication with wholesale buyers, negotiations, and deal coordination." }, { period: "2016 – 2017", title: "Real Estate Agent", text: "Worked at NBR Real Estate, supporting property transactions and client communication." }] },
    contact: { title: "Let's Connect", subtitle: "I am always open to discussing new projects, collaboration, and career opportunities.", linkedin: "LinkedIn", github: "GitHub", email: "Email", emailCopied: "Copied", footer: "Designed and built with care by Maksym Prysiazhnikov." },
    chat: { title: "AI Assistant", subtitle: "Ask about my stack, experience, or projects.", open: "AI Assistant", placeholder: "Type a message...", send: "Send", loading: "AI is typing...", welcome: "Hi! I am the portfolio AI assistant. I can explain my stack, experience, and learning path.", error: "Could not get a response. Check the OpenRouter server key.", supportButton: "Contact back", supportTitle: "Contact back", supportSubtitle: "Leave your contact details or send a direct message.", supportPlaceholder: "Write a message...", supportEmpty: "Start the conversation. Your message will go to my Telegram.", supportSent: "Message sent.", supportError: "Could not send. Please try again.", supportOffline: "If you go offline, I will see that in Telegram.", leadTitle: "Contact details", leadName: "Name", leadEmail: "Email", leadPhone: "Phone", leadMessage: "Short request", leadSubmit: "Send contacts", leadRequired: "Add your name and email or phone.", leadInvalidEmail: "Email must include @ and a dot.", leadInvalidPhone: "Check the phone number format.", leadSuccess: "Thank you! Your contacts were sent.", leadError: "Could not send your contacts. Please try again." },
  },
} satisfies Record<Language, any>;

const blockIcons = [
  <Container className="h-4 w-4 text-[#51aaca]" key="container" />,
  <Database className="h-4 w-4 text-[#51aaca]" key="database" />,
  <Cpu className="h-4 w-4 text-[#51aaca]" key="cpu" />,
  <ShieldCheck className="h-4 w-4 text-[#51aaca]" key="shield" />,
];

const getRouteFromPath = (pathname: string): Route => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "animated" && parts[1] === "tech" && parts[2]) return { page: "animatedSkill", slug: parts[2] };
  if (parts[0] === "animated") return { page: "animated" };
  if (parts[0] === "tech" && parts[1]) return { page: "skill", slug: parts[1] };
  if (parts[0] === "learning" && parts[1]) return { page: "provider", slug: parts[1] };
  return { page: "home" };
};

const cleanChatText = (text: string) => text
  .replace(/\*\*(.*?)\*\*/g, "$1")
  .replace(/__(.*?)__/g, "$1")
  .replace(/\*([^*\n]+)\*/g, "$1")
  .replace(/`([^`]+)`/g, "$1")
  .replace(/^#{1,6}\s*/gm, "")
  .replace(/[ \t]+\n/g, "\n")
  .trim();

const splitBullet = (bullet: string) => {
  const separatorIndex = bullet.indexOf(":");
  if (separatorIndex === -1) {
    return { title: bullet, details: "" };
  }

  return {
    title: bullet.slice(0, separatorIndex).trim(),
    details: bullet.slice(separatorIndex + 1).trim(),
  };
};

const AnimatedResume = ({
  language,
  onBack,
  onContact,
  onCvDownload,
  onOpenSkill,
}: {
  language: Language;
  onBack: () => void;
  onContact: () => void;
  onCvDownload: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onOpenSkill: (slug: string) => void;
}) => {
  const t = copy[language];
  const [showAnimatedIntro, setShowAnimatedIntro] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAnimatedTop, setShowAnimatedTop] = useState(false);
  const [isAnimatedMobile, setIsAnimatedMobile] = useState(false);
  const story = language === "uk"
    ? {
      back: "Light version",
      label: "Animated CV",
      loading: "Loading infrastructure story",
      loadingKicker: "DEVOPS CV",
      loadingWords: ["Infrastructure", "Automation", "Delivery"],
      heroTop: "I BUILD",
      heroBottom: "RELIABLE SYSTEMS",
      intro: "DEVOPS / CLOUD ENGINEER · AUTOMATION. DEPLOYMENT. OBSERVABILITY.",
      whoTitle: "WHO I AM",
      whoLead: "Я поєдную практичний DevOps, cloud deployment, бази даних, automation та security-мислення.",
      whoText: [t.about.p1, t.about.p2, t.about.p3],
      verbs: ["AUTOMATED", "DEPLOYED", "MONITORED", "SECURED", "SCALED"],
      scroll: "ГОРТАЙ ВНИЗ",
      stats: [
        ["462+", "виконаних практичних DevOps-завдань"],
        ["B2", "англійська для технічної комунікації"],
        ["2026", "DevOps Engineer Certificate"],
      ],
      stackTitle: "A STACK FULL OF POSSIBILITIES",
      projectsTitle: "PROJECTS IN MOTION",
      learningTitle: "LEARNING PATH",
      earlierTitle: "EARLIER EXPERIENCE",
      finalTop: "JOIN",
      finalBottom: "THE WORKFLOW",
      contact: "Зв'язатися",
      nav: { home: "Hero", about: "Про мене", stack: "Стек", experience: "Досвід", projects: "Проєкти", learning: "Навчання", contact: "Контакти" },
      learnAbout: "До стеку",
      learnStack: "До досвіду",
      learnProjects: "До навчання",
      resources: "Дії",
      sitemap: "Навігація",
      social: "Соцмережі",
      backTop: "До початку",
      trainingLink: "Курс Mate",
      fullPage: "Повне пояснення",
      technologies: "Технології",
    }
    : {
      back: "Light version",
      label: "Animated CV",
      loading: "Loading infrastructure story",
      loadingKicker: "DEVOPS CV",
      loadingWords: ["Infrastructure", "Automation", "Delivery"],
      heroTop: "I BUILD",
      heroBottom: "RELIABLE SYSTEMS",
      intro: "DEVOPS / CLOUD ENGINEER · AUTOMATION. DEPLOYMENT. OBSERVABILITY.",
      whoTitle: "WHO I AM",
      whoLead: "I connect practical DevOps, cloud deployment, databases, automation, and security-minded infrastructure.",
      whoText: [t.about.p1, t.about.p2, t.about.p3],
      verbs: ["AUTOMATED", "DEPLOYED", "MONITORED", "SECURED", "SCALED"],
      scroll: "SWIPE DOWN",
      stats: [
        ["462+", "hands-on DevOps tasks completed"],
        ["B2", "English for technical communication"],
        ["2026", "DevOps Engineer Certificate"],
      ],
      stackTitle: "A STACK FULL OF POSSIBILITIES",
      projectsTitle: "PROJECTS IN MOTION",
      learningTitle: "LEARNING PATH",
      earlierTitle: "EARLIER EXPERIENCE",
      finalTop: "JOIN",
      finalBottom: "THE WORKFLOW",
      contact: "Get in touch",
      nav: { home: "Home", about: "About", stack: "Stack", experience: "Experience", projects: "Projects", learning: "Learning", contact: "Contact" },
      learnAbout: "View stack",
      learnStack: "View experience",
      learnProjects: "View learning",
      resources: "Actions",
      sitemap: "Navigation",
      social: "Social",
      backTop: "Back to Top",
      trainingLink: "Mate course",
      fullPage: "Full explanation",
      technologies: "Technologies",
  };
  const featuredStack = skills;
  const stackStarterGuide = language === "uk"
    ? [
      { step: "01", title: "Обери інструмент", text: "Натисни на технологію нижче, щоб відкрити її окрему сторінку." },
      { step: "02", title: "Пройди міні-гайд", text: "На сторінці буде короткий шлях для новачка: роль, перша дія, практика." },
      { step: "03", title: "Питай AI або docs", text: "Локальний AI пояснить простими словами, а офіційні джерела дадуть глибину." },
    ]
    : [
      { step: "01", title: "Pick a tool", text: "Click a technology below to open its focused page." },
      { step: "02", title: "Use the mini guide", text: "Each page gives a beginner path: role, first action, practice." },
      { step: "03", title: "Ask AI or docs", text: "The local AI explains simply, while official resources go deeper." },
    ];
  const experienceScenes = [
    {
      title: t.experience.commercialTitle,
      role: t.experience.commercialRole,
      points: t.experience.commercialPoints,
      visual: "PRODUCTION LAUNCH",
      link: COMMERCIAL_SITE_URL,
      linkLabel: t.experience.liveSite,
      image: "/vid-franko-preview.png",
    },
    {
      title: t.experience.volunteerTitle,
      role: t.experience.volunteerRole,
      points: t.experience.volunteerPoints,
      visual: "CLOUD DEPLOYMENT",
      link: VOLUNTEER_DEMO_URL,
      linkLabel: t.experience.liveDemo,
      image: "/volunteer-site-preview.png",
    },
    {
      title: t.experience.handsOnTitle,
      role: t.experience.handsOnRole,
      points: t.experience.blocks.map((block: { title: string; text: string }) => `${block.title}: ${block.text}`),
      visual: "DEVOPS TRAINING",
      link: "https://mate.academy/courses/devops",
      linkLabel: story.trainingLink,
      image: "/mate-academy-preview.svg",
    },
  ];
  const backgroundTextRows = [
    [
      "MAKSYM PRYSIAZHNIKOV",
      t.hero.role,
      t.about.p1,
      t.about.p2,
      t.about.p3,
    ],
    skills.map((skill) => skill.name),
    [
      t.experience.commercialTitle,
      t.experience.commercialRole,
      ...t.experience.commercialPoints,
      t.experience.volunteerTitle,
      t.experience.volunteerRole,
      ...t.experience.volunteerPoints,
    ],
    t.projects.items.flatMap((project: { title: string; description: string; tags: string[] }) => [project.title, project.description, ...project.tags]),
    [
      ...t.certs.items.map((cert: { name: string; issuer: string; year: string; details?: string }) => `${cert.name} ${cert.issuer} ${cert.year}${cert.details ? ` ${cert.details}` : ""}`),
      ...t.education.items.map((item: { title: string; place: string }) => `${item.title} ${item.place}`),
      ...t.education.languages.map((item: { label: string; value: string }) => `${item.label} ${item.value}`),
    ],
    t.earlier.items.map((item: { period: string; title: string; text: string }) => `${item.period} ${item.title} ${item.text}`),
  ];

  useEffect(() => {
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    const timer = window.setTimeout(() => setShowAnimatedIntro(false), isMobileViewport ? 1450 : 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileState = () => setIsAnimatedMobile(mediaQuery.matches);
    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);
    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
      setShowAnimatedTop(window.scrollY > 720);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const scrollToAnimatedSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const switchAnimatedLanguage = (nextLanguage: Language) => {
    window.dispatchEvent(new CustomEvent<Language>("portfolio-language", { detail: nextLanguage }));
  };

  const animatedNavItems = [
    ["animated-hero", story.nav.home],
    ["animated-about", story.nav.about],
    ["animated-stack", story.nav.stack],
    ["animated-experience", story.nav.experience],
    ["animated-projects", story.nav.projects],
    ["animated-learning", story.nav.learning],
    ["animated-contact", story.nav.contact],
  ];
  const animatedButtonBase = "inline-flex items-center justify-center gap-2 rounded-2xl border font-black transition hover:-translate-y-0.5";
  const animatedButtonPrimary = `${animatedButtonBase} border-[#d8f3fb]/55 bg-[#51aaca] text-[#021014] shadow-[0_0_0_1px_rgba(216,243,251,0.28),0_20px_48px_rgba(81,170,202,0.34)] hover:bg-[#9ed8ea] hover:shadow-[0_0_0_1px_rgba(216,243,251,0.45),0_24px_60px_rgba(81,170,202,0.46)]`;
  const animatedButtonGhost = `${animatedButtonBase} border-[#51aaca]/25 bg-[#071b2a]/82 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-md hover:border-[#51aaca]/45 hover:bg-[#0c2b3d]`;
  const animatedButtonLight = `${animatedButtonBase} border-[#51aaca]/30 bg-[#51aaca]/10 text-[#021014] shadow-[0_12px_28px_rgba(81,170,202,0.12)] hover:bg-[#51aaca]`;
  const animatedFloatingButton = "inline-flex items-center gap-3 rounded-full border border-[#51aaca]/25 bg-[#071b2a]/56 py-2 pl-4 pr-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#d8f3fb] shadow-[0_18px_38px_rgba(0,0,0,0.28)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#51aaca]/45 hover:bg-[#0c2b3d]/82 hover:text-white";
  const heroDelay = isAnimatedMobile ? 0.2 : 1.1;
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <AnimatePresence>
        {showAnimatedIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[#02070d]/48 backdrop-blur-[1px]"
          >
            <video
              aria-hidden="true"
              src="/animated-bg.mp4"
              preload="auto"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(81,170,202,0.12),transparent_34%),linear-gradient(135deg,rgba(2,7,13,0.52),rgba(6,24,39,0.34)_48%,rgba(1,3,7,0.58))]" />
            <motion.div
              animate={{ backgroundPosition: ["0px 0px", "96px 96px"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(216,243,251,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(216,243,251,0.3)_1px,transparent_1px)] [background-size:96px_96px]"
            />
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 2.65, duration: 0.45 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-[#51aaca]/20 border-t-[#51aaca] shadow-[0_0_42px_rgba(81,170,202,0.26)]"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5.8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-5 rounded-full border border-dashed border-white/18"
                />
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-[#51aaca]/25 bg-[#071b2a]/78 shadow-2xl shadow-black/35">
                  <Terminal className="h-10 w-10 text-[#d8f3fb]" />
                </div>
              </div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.46em] text-[#9ed8ea]">{story.loadingKicker}</p>
              <div className="mb-5 text-5xl font-black tracking-tight text-white md:text-7xl">DEVOPS</div>
              <div className="mb-5 flex flex-wrap justify-center gap-2">
                {story.loadingWords.map((word) => (
                  <span key={word} className="rounded-full border border-[#51aaca]/20 bg-[#51aaca]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d8f3fb]">{word}</span>
                ))}
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 260 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-5 h-px bg-gradient-to-r from-transparent via-[#51aaca] to-transparent"
              />
              <motion.p
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="text-xs font-bold uppercase tracking-[0.36em] text-zinc-400"
              >
                {story.loading}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <video
          aria-hidden="true"
          src="/animated-bg.mp4"
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.48),rgba(3,12,18,0.18)_48%,rgba(0,0,0,0.52)),radial-gradient(circle_at_50%_20%,rgba(81,170,202,0.1),transparent_32%)]" />
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "120px 120px"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(216,243,251,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(216,243,251,0.24)_1px,transparent_1px)] [background-size:120px_120px]"
        />
        <div className="absolute inset-0 overflow-hidden mix-blend-screen">
          {backgroundTextRows.map((row, index) => (
            <motion.div
              key={index}
              animate={isAnimatedMobile ? { x: index % 2 === 0 ? "-14%" : "-30%" } : { x: index % 2 === 0 ? ["0%", "-42%"] : ["-42%", "0%"] }}
              transition={isAnimatedMobile ? { duration: 0 } : { duration: 44 + index * 7, repeat: Infinity, ease: "linear" }}
              className={`absolute flex w-max items-center gap-8 whitespace-nowrap font-black uppercase leading-none tracking-tight text-white/10 ${index % 2 === 0 ? "-rotate-3" : "rotate-3"}`}
              style={{
                top: `${12 + index * 14}%`,
                fontSize: `${index % 2 === 0 ? 76 : 48}px`,
              }}
            >
              {[...row, ...row].map((text, itemIndex) => (
                <span key={`${text}-${itemIndex}`} className={itemIndex % 3 === 0 ? "text-[#d8f3fb]/14" : "text-white/8"}>
                  {text}
                </span>
              ))}
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.04)_42%,rgba(0,0,0,0.28)_100%)]" />
        <motion.div
          animate={{ x: ["-8%", "8%", "-8%"], opacity: [0.16, 0.36, 0.16] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 h-[38rem] w-[38rem] rounded-full border border-[#51aaca]/25 blur-sm"
        />
        <motion.div
          animate={{ x: ["8%", "-8%", "8%"], opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 h-[44rem] w-[44rem] rounded-full border border-white/15 blur-sm"
        />
      </div>

      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#51aaca]/18 bg-[#02070d]/72 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="h-0.5 bg-white/10">
            <motion.div className="h-full bg-[#51aaca]" style={{ width: `${scrollProgress}%` }} />
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <button type="button" onClick={onBack} aria-label={story.back} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#51aaca]/25 bg-[#071b2a]/80 px-3 text-zinc-300 shadow-[0_0_24px_rgba(81,170,202,0.08)] transition hover:bg-[#51aaca] hover:text-[#021014] sm:px-4">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden text-xs font-black uppercase tracking-[0.14em] sm:inline">{story.back}</span>
            </button>
            <button type="button" onClick={onBack} className="min-w-0 rounded-xl px-1 text-left transition hover:text-[#d8f3fb]">
              <span className="block truncate text-lg font-black leading-none tracking-tight sm:text-xl">DEVOPS</span>
              <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.22em] text-[#9ed8ea] sm:text-[10px]">Back to light version</span>
            </button>
          </div>
          <div className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 lg:flex">
            {animatedNavItems.map(([id, label]) => (
              <button key={id} type="button" onClick={() => scrollToAnimatedSection(id)} className="transition hover:text-white">
                {label}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center rounded-full border border-[#51aaca]/18 bg-[#061a26]/85 p-1">
            {(["en", "uk"] as Language[]).map((lang) => (
              <button key={lang} type="button" onClick={() => switchAnimatedLanguage(lang)} className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] transition ${language === lang ? "bg-[#51aaca] text-[#021014] shadow-[0_0_18px_rgba(81,170,202,0.32)]" : "text-zinc-400 hover:text-white"}`}>
                {lang}
              </button>
            ))}
          </div>
          </div>
        </div>
      </nav>

      <main>
        <section id="animated-hero" className="relative flex min-h-screen items-center justify-center px-5 pb-16 pt-28 text-center">
          <div className="mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: heroDelay }} className="mb-8 text-center font-bold uppercase text-[#9ed8ea]">
              <p className="text-sm tracking-[0.34em] sm:tracking-[0.5em]">Maksym Prysiazhnikov</p>
              <p className="mt-2 text-xs tracking-[0.42em]">DevOps Engineer</p>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 42 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: heroDelay + 0.12, duration: 0.55 }} className="text-[18vw] font-black leading-[0.78] tracking-tight md:text-[11vw]">
              {story.heroTop}
              <span className="block text-[#d8f3fb]">{story.heroBottom}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: heroDelay + 0.24 }} className="mx-auto mt-9 max-w-3xl text-center text-xs font-bold uppercase leading-7 tracking-[0.28em] text-[#d8f3fb] md:text-sm md:leading-8 md:tracking-[0.34em]">
              {story.intro}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: heroDelay + 0.34 }} className="mx-auto mt-10 grid max-w-[320px] grid-cols-2 gap-3 md:max-w-[930px] md:grid-cols-3 md:gap-4">
              <button type="button" onClick={onContact} className={`${animatedButtonPrimary} h-14 w-full px-5 text-sm sm:px-7 sm:text-base`}>
                <Mail className="h-5 w-5" />
                {story.contact}
              </button>
              <a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" className={`${animatedButtonGhost} h-14 w-full px-5 text-sm sm:px-7 sm:text-base`}>
                <Github className="h-5 w-5" />
                {t.hero.github}
              </a>
              <a href="/download/cv" onClick={onCvDownload} className={`${animatedButtonGhost} col-span-2 h-14 w-full px-5 text-sm md:col-span-1 sm:px-7 sm:text-base`}>
                <Download className="h-5 w-5" />
                {t.hero.resume}
              </a>
            </motion.div>
          </div>
          <motion.button
            type="button"
            onClick={() => scrollToAnimatedSection("animated-stack")}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: heroDelay + 0.5 }}
            className={`absolute bottom-5 left-1/2 z-10 -translate-x-1/2 sm:bottom-7 ${animatedFloatingButton}`}
          >
            <span>{story.learnAbout}</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#51aaca] text-[#021014] shadow-[0_0_22px_rgba(81,170,202,0.38)]"
            >
              <ArrowUp className="h-4 w-4 rotate-180" />
            </motion.span>
          </motion.button>
        </section>

        <section className="relative overflow-hidden border-y border-white/10 bg-black/20 text-white backdrop-blur-[1px]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,13,0.62),rgba(6,24,39,0.18)_48%,rgba(2,7,13,0.62))]" />
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: isAnimatedMobile ? 18 : 24, repeat: Infinity, ease: "linear" }}
            className="relative flex w-max gap-8 py-6 sm:gap-10 sm:py-8"
          >
            {[...story.verbs, ...story.verbs, ...story.verbs, ...story.verbs].map((verb, index) => (
              <span
                key={`${verb}-${index}`}
                className="text-5xl font-black uppercase tracking-tight text-[#d8f3fb]/72 drop-shadow-[0_0_24px_rgba(81,170,202,0.22)] md:text-8xl"
              >
                {verb}
              </span>
            ))}
          </motion.div>
        </section>

        <section id="animated-about" className="relative px-5 py-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-120px" }}>
              <p className="mb-6 text-sm font-bold uppercase tracking-[0.4em] text-[#9ed8ea]">{story.whoTitle}</p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">{story.whoLead}</h2>
            </motion.div>
            <div className="space-y-6">
              {story.whoText.map((text, index) => (
                <motion.p key={text} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border-t border-white/15 pt-6 text-lg leading-9 text-zinc-300">
                  {text}
                </motion.p>
              ))}
              <div className="grid gap-4 pt-6 sm:grid-cols-3">
                {story.stats.map(([value, label], index) => (
                  <motion.div key={value} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border border-white/10 bg-white/[0.05] p-5">
                    <div className="text-4xl font-black text-[#d8f3fb]">{value}</div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{label}</p>
                  </motion.div>
                ))}
              </div>
              <button type="button" onClick={() => scrollToAnimatedSection("animated-stack")} className={`${animatedButtonGhost} mt-8 px-5 py-3 text-sm uppercase tracking-[0.18em]`}>
                {story.learnAbout}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section id="animated-stack" className="relative bg-white py-24 text-black">
          <button type="button" onClick={() => scrollToAnimatedSection("animated-experience")} className={`absolute bottom-6 right-6 z-10 hidden md:inline-flex ${animatedFloatingButton} !bg-white/70 !text-[#021014] hover:!bg-white`}>
            {story.learnStack}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#51aaca] text-[#021014]"><ArrowUp className="h-4 w-4 rotate-180" /></span>
          </button>
          <div className="mx-auto max-w-7xl px-5">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.85fr_1fr]">
              <h2 className="text-5xl font-black leading-none tracking-tight md:text-7xl">{story.stackTitle}</h2>
              <div>
                <p className="text-lg leading-8 text-zinc-700">{t.about.stackHint}</p>
                <button type="button" onClick={() => scrollToAnimatedSection("animated-technologies")} className={`${animatedButtonLight} mt-6 px-5 py-4 text-left uppercase tracking-[0.18em]`}>
                  <MessageCircle className="h-5 w-5" />
                  <span>
                    <span className="block text-sm">{story.technologies}</span>
                    <span className="mt-1 block text-[10px] tracking-[0.14em] opacity-70">{language === "uk" ? "AI-помічник по технологіях" : "Technology AI helper"}</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:max-w-3xl">
                  {stackStarterGuide.map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => scrollToAnimatedSection("animated-technologies")}
                      className="group min-h-[118px] rounded-2xl border border-black/10 bg-white/70 p-4 text-left shadow-[0_16px_42px_rgba(2,7,13,0.08)] transition hover:-translate-y-0.5 hover:border-[#51aaca]/45 hover:bg-[#eaf8fc]"
                    >
                      <span className="mb-3 inline-flex rounded-full border border-[#51aaca]/25 bg-[#51aaca]/10 px-3 py-1 text-[10px] font-black text-[#073044] group-hover:bg-[#51aaca]">
                        {item.step}
                      </span>
                      <span className="block text-sm font-black text-black">{item.title}</span>
                      <span className="mt-2 block text-xs font-semibold leading-5 text-zinc-600">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div id="animated-technologies" className="border-y border-black/15 py-8 sm:py-10">
              <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-[#51aaca]/20 bg-[#061a26] p-4 text-white shadow-[0_24px_70px_rgba(2,7,13,0.16),0_0_42px_rgba(81,170,202,0.12)] sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-center gap-3 text-center sm:justify-between sm:text-left">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.3em] text-[#9ed8ea]">{story.technologies}</div>
                    <p className="mt-2 text-sm font-bold text-zinc-300">{t.about.stackHint}</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-500">{language === "uk" ? "Відкрий технологію, і на її сторінці буде окремий AI-помічник саме по ній." : "Open a technology to use a focused AI helper for that exact topic."}</p>
                  </div>
                  <span className="rounded-full border border-[#51aaca]/35 bg-[#51aaca]/14 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d8f3fb] shadow-[0_0_24px_rgba(81,170,202,0.16)]">{featuredStack.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {featuredStack.map((skill, index) => (
                    <motion.button
                      key={skill.slug}
                      type="button"
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.025 }}
                      onClick={() => onOpenSkill(skill.slug)}
                      className="group flex h-14 min-w-0 items-center justify-between gap-2 rounded-2xl border border-[#51aaca]/22 bg-[#092231] px-3 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.22),0_0_20px_rgba(81,170,202,0.08)] transition hover:-translate-y-0.5 hover:border-[#9ed8ea]/70 hover:bg-[#51aaca] hover:text-[#021014] hover:shadow-[0_18px_38px_rgba(81,170,202,0.28)] sm:px-4"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-[#d8f3fb] transition group-hover:text-[#021014]">{skill.icon}</span>
                        <span className="truncate text-xs font-black sm:text-sm">{skill.name}</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#9ed8ea] transition group-hover:text-[#021014] sm:h-4 sm:w-4" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="animated-experience" className="relative px-5 py-28">
          <button type="button" onClick={() => scrollToAnimatedSection("animated-projects")} className={`absolute bottom-6 right-6 z-10 hidden md:inline-flex ${animatedFloatingButton}`}>
            {story.nav.projects}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#51aaca] text-[#021014]"><ArrowUp className="h-4 w-4 rotate-180" /></span>
          </button>
          <div className="mx-auto max-w-7xl">
            {experienceScenes.map((scene, index) => (
              <motion.article
                key={scene.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                className="grid min-h-[82vh] items-center gap-10 border-t border-white/10 py-20 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <a
                  href={scene.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={scene.linkLabel}
                  className="group relative block min-h-[420px] overflow-hidden rounded-2xl border border-[#51aaca]/20 bg-[#061a26]/76 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-[#51aaca]/45"
                >
                  {scene.image ? (
                    <>
                      <img src={scene.image} alt={`${scene.title} preview`} className="absolute inset-0 h-full w-full object-cover object-top opacity-82 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,13,0.08),rgba(2,7,13,0.62)_58%,rgba(2,7,13,0.92))]" />
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.48, 0.28] }}
                        transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-10 rounded-full border border-[#51aaca]/40"
                      />
                      <motion.div
                        animate={{ rotate: index % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-20 rounded-full border border-dashed border-white/20"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(81,170,202,0.16),transparent_45%)]" />
                    </>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="mb-4 flex items-end justify-end">
                      <span className="rounded-full border border-[#51aaca]/20 bg-[#071b2a]/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#d8f3fb] backdrop-blur-md">{scene.visual}</span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
                      <p className="text-xl font-black text-white">{scene.title}</p>
                      <p className="mt-1 text-sm font-bold text-[#9ed8ea]">{scene.role}</p>
                    </div>
                  </div>
                </a>
                <div>
                  <h2 className="text-5xl font-black leading-none tracking-tight md:text-7xl">{scene.title}</h2>
                  <p className="mt-5 text-xl font-bold text-[#9ed8ea]">{scene.role}</p>
                  <ul className="mt-9 space-y-5">
                    {scene.points.map((point: string) => (
                      <li key={point} className="flex gap-4 border-t border-white/10 pt-5 text-base leading-8 text-zinc-300">
                        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#51aaca]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  {scene.link && (
                    <a href={scene.link} target="_blank" rel="noopener noreferrer" className={`${animatedButtonGhost} mt-8 px-5 py-3 text-sm uppercase tracking-[0.16em] text-[#d8f3fb]`}>
                      {scene.linkLabel}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="animated-projects" className="relative bg-white px-5 py-24 text-black">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="text-5xl font-black leading-none tracking-tight md:text-7xl">{story.projectsTitle}</h2>
              <div className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.22em]">
                <span>1</span>
                <span className="h-px w-16 bg-black/35" />
                <span>{t.projects.items.length}</span>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {t.projects.items.map((project: { title: string; description: string; tags: string[]; link: string }, index: number) => (
                <motion.a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden border border-black/15 bg-zinc-950 p-7 text-white transition hover:-translate-y-1">
                  <video
                    aria-hidden="true"
                    src="/animated-bg.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-24 transition duration-500 group-hover:opacity-38"
                  />
                  <motion.div
                    aria-hidden="true"
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_18%_22%,rgba(81,170,202,0.34),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(216,243,251,0.18),transparent_26%),linear-gradient(135deg,rgba(81,170,202,0.14),transparent_42%,rgba(255,255,255,0.08))] [background-size:160%_160%]"
                  />
                  <div className="absolute inset-0 bg-zinc-950/72 transition duration-500 group-hover:bg-zinc-950/62" />
                  <div className="relative z-10">
                    <div className="mb-10 flex items-center justify-between">
                      <Github className="h-6 w-6 text-[#d8f3fb]" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight">{project.title}</h3>
                    <p className="mt-5 text-base leading-8 text-zinc-300">{project.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => <span key={tag} className="border border-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300">{tag}</span>)}
                    </div>
                  </div>
                  <span className="relative z-10 mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#9ed8ea]">
                    GitHub <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </motion.a>
              ))}
            </div>
            <button type="button" onClick={() => scrollToAnimatedSection("animated-learning")} className={`${animatedButtonLight} mt-10 px-5 py-3 text-sm uppercase tracking-[0.18em]`}>
              {story.learnProjects}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section id="animated-learning" className="relative px-5 py-24">
          <button type="button" onClick={() => scrollToAnimatedSection("animated-contact")} className={`absolute bottom-6 right-6 z-10 hidden md:inline-flex ${animatedFloatingButton}`}>
            {story.nav.contact}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#51aaca] text-[#021014]"><ArrowUp className="h-4 w-4 rotate-180" /></span>
          </button>
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-10 text-5xl font-black leading-none tracking-tight md:text-7xl">{story.learningTitle}</h2>
              <div className="space-y-4">
                {t.certs.items.map((cert: { name: string; issuer: string; year: string; details?: string }, index: number) => (
                  <motion.div key={cert.name} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="border-t border-white/10 py-5">
                    <p className="text-xl font-black">{cert.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">{cert.issuer} / {cert.year}{cert.details ? ` / ${cert.details}` : ""}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {t.education.items.map((item: { title: string; place: string }, index: number) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-lg font-black">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{item.place}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-10 text-5xl font-black leading-none tracking-tight md:text-7xl">{story.earlierTitle}</h2>
              <div className="space-y-4">
                {t.earlier.items.map((item: { period: string; title: string; text: string }, index: number) => (
                  <motion.div key={item.title} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="border-t border-white/10 py-5">
                    <p className="text-xs font-bold text-[#51aaca]">{item.period}</p>
                    <p className="mt-2 text-xl font-black">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{item.text}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {t.education.languages.map((item: { label: string; value: string }) => (
                  <div key={item.label} className="border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#51aaca]">{item.label}</p>
                    <p className="mt-2 text-xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 px-5 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.85fr_1fr]">
              <h2 className="text-5xl font-black leading-none tracking-tight md:text-7xl">{t.education.providersTitle}</h2>
              <p className="text-lg leading-8 text-zinc-400">{t.education.providersSubtitle}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {learningProviders.map((provider, index) => (
                <motion.a key={provider.slug} href={provider.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="group flex min-h-[280px] flex-col justify-between border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-[#51aaca]/40">
                  <div>
                    <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-[#51aaca]">{provider.category[language]}</p>
                    <h3 className="text-2xl font-black">{provider.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-zinc-400">{provider.summary[language]}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#9ed8ea]">
                    {t.education.visitSite} <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section id="animated-contact" className="flex min-h-[74vh] items-center justify-center bg-white px-5 py-24 text-center text-black">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.45em] text-zinc-500">{story.finalTop}</p>
            <h2 className="text-[17vw] font-black leading-[0.8] tracking-tight md:text-[10vw]">{story.finalBottom}</h2>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={onContact} className={`${animatedButtonPrimary} px-8 py-4`}>
                <Mail className="h-5 w-5" />
                {story.contact}
              </button>
              <button type="button" onClick={onBack} className={`${animatedButtonLight} px-8 py-4 hover:!bg-black hover:!text-white`}>
                <ArrowLeft className="h-5 w-5" />
                {story.back}
              </button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3 text-sm font-black">
              <a href="https://linkedin.com/in/maxim-prysyazhnikov-b46196163" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black px-5 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-[#51aaca] hover:text-[#021014]"><Linkedin className="h-5 w-5" />{t.contact.linkedin}</a>
              <a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black px-5 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-[#51aaca] hover:text-[#021014]"><Github className="h-5 w-5" />{t.contact.github}</a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black px-5 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-[#51aaca] hover:text-[#021014]"><Mail className="h-5 w-5" />{CONTACT_EMAIL}</a>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-black px-5 py-12 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.85fr_1.45fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-4">
                <img
                  src="/profile-photo.jpg"
                  alt="Maksym Prysiazhnikov"
                  className="h-24 w-24 rounded-2xl border border-[#51aaca]/25 object-cover object-center opacity-95"
                />
                <button type="button" onClick={() => scrollToAnimatedSection("animated-hero")} className="text-left">
                  <span className="block text-3xl font-black leading-none tracking-tight">MAKSYM</span>
                  <span className="mt-2 block text-xs font-black uppercase tracking-[0.32em] text-[#9ed8ea]">DevOps CV</span>
                </button>
              </div>
              <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-zinc-400">
                Made for reliable systems. Cloud, automation, and delivery.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{story.resources}</h3>
              <div className="space-y-3 text-sm font-bold">
                <a href="/download/cv" onClick={onCvDownload} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 transition hover:border-[#51aaca]/35 hover:text-[#9ed8ea]">{t.hero.resume}<Download className="h-4 w-4" /></a>
                <button type="button" onClick={onBack} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left transition hover:border-[#51aaca]/35 hover:text-[#9ed8ea]">{story.back}<ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={onContact} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left transition hover:border-[#51aaca]/35 hover:text-[#9ed8ea]">{story.contact}<Mail className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2">
              <div>
                <h3 className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{story.sitemap}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm font-bold sm:grid-cols-1">
                  {animatedNavItems.map(([id, label]) => (
                    <button key={id} type="button" onClick={() => scrollToAnimatedSection(id)} className="text-left transition hover:text-[#9ed8ea]">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-zinc-500">{story.social}</h3>
                <div className="space-y-3 text-sm font-bold">
                  <a href="https://linkedin.com/in/maxim-prysyazhnikov-b46196163" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 transition hover:border-[#51aaca]/35 hover:text-[#9ed8ea]">{t.contact.linkedin}<ExternalLink className="h-4 w-4" /></a>
                  <a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 transition hover:border-[#51aaca]/35 hover:text-[#9ed8ea]">{t.contact.github}<ExternalLink className="h-4 w-4" /></a>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 transition hover:border-[#51aaca]/35 hover:text-[#9ed8ea]"><span className="truncate">{CONTACT_EMAIL}</span><Mail className="h-4 w-4 shrink-0" /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            © {new Date().getFullYear()} Maksym Prysiazhnikov
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {showAnimatedTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => scrollToAnimatedSection("animated-hero")}
            aria-label={story.backTop}
            title={story.backTop}
            className={`fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full !p-0 ${animatedButtonGhost}`}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedSkillDetail = ({
  language,
  skill,
  onBack,
  onLightVersion,
  onSelectSkill,
}: {
  language: Language;
  skill: Skill;
  onBack: () => void;
  onLightVersion: () => void;
  onSelectSkill: (slug: string) => void;
}) => {
  const t = copy[language];
  const siteSectionLabel = language === "uk" ? "До розділу сайту" : "Site section";
  const backToSectionLabel = language === "uk" ? "До розділу сайту" : "Back to site section";
  const animatedHomeLabel = language === "uk" ? "Головна animated" : "Animated main page";
  const [openBulletIndex, setOpenBulletIndex] = useState(0);
  const [techChatInput, setTechChatInput] = useState("");
  const [techChatLoading, setTechChatLoading] = useState(false);
  const [techChatMessages, setTechChatMessages] = useState<ChatMessage[]>([]);
  const officialResources = officialTechnologyResources[skill.slug] ?? [];
  const beginnerGuide = [
    skill.summary[language],
    skill.bullets[language][0],
    officialResources.map((resource) => resource.label).join(", "),
  ].filter(Boolean);
  const techPageContext: ChatPageContext = {
    section: "animated technology",
    title: skill.name,
    summary: skill.summary[language],
    description: skill.description[language],
    bullets: skill.bullets[language],
    resources: officialResources,
    beginnerGuide,
  };
  const techChatCopy = language === "uk"
    ? {
      eyebrow: "AI по технологіях",
      title: `${skill.name} AI Assistant`,
      subtitle: `Окремий помічник саме по ${skill.name}: коротко пояснить роль у DevOps і підкаже, де вчитись далі.`,
      welcome: `Я окремий AI-помічник по ${skill.name}. Питай коротко: що це, де застосовується в DevOps, або де краще вчитись далі.`,
      placeholder: `Питання про ${skill.name}...`,
      error: "Не вдалося отримати відповідь.",
    }
    : {
      eyebrow: "Technology AI",
      title: `${skill.name} AI Assistant`,
      subtitle: `A focused helper for ${skill.name}: short DevOps context and where to learn more.`,
      welcome: `I am a focused AI helper for ${skill.name}. Ask what it is, how it fits DevOps, or where to learn more.`,
      placeholder: `Ask about ${skill.name}...`,
      error: "Could not get a response.",
    };
  const switchAnimatedLanguage = (nextLanguage: Language) => {
    window.dispatchEvent(new CustomEvent<Language>("portfolio-language", { detail: nextLanguage }));
  };

  useEffect(() => {
    setOpenBulletIndex(0);
    setTechChatInput("");
    setTechChatLoading(false);
    setTechChatMessages([{ role: "assistant", content: techChatCopy.welcome }]);
  }, [skill.slug, language]);

  const sendTechChatMessage = async () => {
    const trimmed = techChatInput.trim();
    if (!trimmed || techChatLoading) return;

    const nextMessages: ChatMessage[] = [...techChatMessages, { role: "user", content: trimmed }];
    setTechChatMessages(nextMessages);
    setTechChatInput("");
    setTechChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, messages: nextMessages, pageContext: techPageContext }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "chat_failed");
      setTechChatMessages((current) => [...current, { role: "assistant", content: cleanChatText(data.reply) }]);
    } catch {
      setTechChatMessages((current) => [...current, { role: "assistant", content: techChatCopy.error }]);
    } finally {
      setTechChatLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#02070d] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <video
          aria-hidden="true"
          src="/videoplayback11.mp4"
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74),rgba(3,12,18,0.46)_48%,rgba(0,0,0,0.78)),radial-gradient(circle_at_50%_20%,rgba(81,170,202,0.14),transparent_36%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(216,243,251,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(216,243,251,0.24)_1px,transparent_1px)] [background-size:96px_96px]" />
      </div>

      <nav className="sticky top-0 z-40 px-4 pt-3">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#51aaca]/20 bg-[#02070d]/76 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="h-0.5 bg-[#51aaca]" />
          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <button type="button" onClick={onBack} className="inline-flex h-11 min-w-0 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#51aaca]/25 bg-[#071b2a]/55 px-3 text-zinc-200 shadow-[0_0_24px_rgba(81,170,202,0.08)] backdrop-blur-md transition hover:border-[#51aaca]/45 hover:bg-[#51aaca] hover:text-[#021014] sm:px-4">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden text-xs font-black uppercase tracking-[0.14em] sm:inline">{siteSectionLabel}</span>
              </button>
              <button type="button" onClick={onLightVersion} className="min-w-0 rounded-xl border border-[#51aaca]/18 bg-[#071b2a]/42 px-3 py-2 text-left shadow-[0_0_24px_rgba(81,170,202,0.06)] backdrop-blur-md transition hover:border-[#51aaca]/40 hover:bg-[#0c2b3d]/82 sm:px-4">
                <span className="block truncate text-lg font-black leading-none sm:text-xl">ANIMATED CV</span>
                <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.22em] text-[#9ed8ea] sm:text-[10px]">{animatedHomeLabel}</span>
              </button>
            </div>
            <div className="flex shrink-0 items-center rounded-full border border-[#51aaca]/18 bg-[#061a26]/85 p-1">
              {(["en", "uk"] as Language[]).map((lang) => (
                <button key={lang} type="button" onClick={() => switchAnimatedLanguage(lang)} className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] transition ${language === lang ? "bg-[#51aaca] text-[#021014]" : "text-zinc-400 hover:text-white"}`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-10">
        <section className="grid min-h-[calc(100vh-9rem)] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 space-y-5 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="relative min-h-[420px] overflow-hidden rounded-3xl border border-[#51aaca]/24 bg-[#061a26]/64 p-5 shadow-2xl shadow-black/30 backdrop-blur-md sm:min-h-[520px] sm:p-7"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(81,170,202,0.18),transparent_30%),linear-gradient(180deg,rgba(216,243,251,0.06),rgba(2,7,13,0.18))]" />
              <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(216,243,251,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(216,243,251,0.22)_1px,transparent_1px)] [background-size:72px_72px]" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#51aaca]/16"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 aspect-square w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-[42%] border border-dashed border-white/16"
              />
              <div className="relative z-10 flex min-h-[380px] flex-col items-center justify-center sm:min-h-[470px]">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-48 w-48 rounded-full border border-[#51aaca]/18 bg-[#51aaca]/5 blur-[1px] sm:h-64 sm:w-64" />
                  <div className="absolute h-32 w-32 rounded-[38%] border border-dashed border-white/16 sm:h-44 sm:w-44" />
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] border border-[#51aaca]/28 bg-[#02070d]/58 text-[#d8f3fb] shadow-[0_0_52px_rgba(81,170,202,0.18)] backdrop-blur-md sm:h-44 sm:w-44 [&_svg]:h-16 [&_svg]:w-16 sm:[&_svg]:h-20 sm:[&_svg]:w-20">
                    {skill.icon}
                  </div>
                </div>
                <span className="mt-8 w-fit rounded-full border border-[#51aaca]/30 bg-[#071b2a]/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#d8f3fb] shadow-[0_0_24px_rgba(81,170,202,0.12)]">
                  {t.techPage.title}
                </span>
                <div className="mt-4 max-w-full truncate text-center text-5xl font-black uppercase leading-none tracking-tight text-white/[0.08] sm:text-7xl">
                  {skill.name}
                </div>
              </div>
            </motion.div>
            <div className="hidden lg:block">
              <OfficialResourceLinks language={language} resources={officialResources} compact />
            </div>
            <div className="hidden lg:block">
              <BeginnerToolGuide language={language} skill={skill} resources={officialResources} compact />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative order-1 lg:order-2"
          >
            <button type="button" onClick={onBack} className="mb-7 inline-flex items-center gap-2 rounded-2xl border border-[#51aaca]/20 bg-[#071b2a]/54 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#d8f3fb] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:border-[#51aaca]/45 hover:bg-[#0c2b3d]">
              <ArrowLeft className="h-4 w-4" />
              {backToSectionLabel}
            </button>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.42em] text-[#9ed8ea]">{t.techPage.title}</p>
            <h1 className="break-words text-4xl font-black uppercase leading-[0.84] tracking-tight text-white sm:text-6xl xl:text-7xl">
              {skill.name}
            </h1>
            <p className="mt-7 max-w-3xl text-2xl font-semibold leading-10 text-[#d8f3fb]">{skill.summary[language]}</p>
            <div className="mt-9 border-y border-white/12 py-7">
              <p className="text-lg font-medium leading-9 text-zinc-200">{skill.description[language]}</p>
            </div>
            <div className="mt-7 overflow-hidden rounded-3xl border border-[#51aaca]/26 bg-[#061a26]/78 shadow-[0_24px_70px_rgba(0,0,0,0.28),0_0_36px_rgba(81,170,202,0.1)] backdrop-blur-md">
              <div className="border-b border-[#51aaca]/14 px-6 py-5">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#9ed8ea]">
                  <MessageCircle className="h-4 w-4" />
                  {techChatCopy.eyebrow}
                </div>
                <h2 className="text-xl font-black text-white">{techChatCopy.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{techChatCopy.subtitle}</p>
              </div>
              <div className="max-h-80 min-h-48 space-y-3 overflow-y-auto px-6 py-5">
                {techChatMessages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-8 bg-[#51aaca] text-[#021014]" : "mr-8 bg-[#092231] text-zinc-100"}`}>
                    {message.content}
                  </div>
                ))}
                {techChatLoading && <div className="mr-8 rounded-2xl bg-[#092231] px-4 py-3 text-sm text-zinc-400">{language === "uk" ? "AI думає..." : "AI is thinking..."}</div>}
              </div>
              <div className="flex gap-3 border-t border-[#51aaca]/14 bg-[#02070d]/38 p-5">
                <input
                  value={techChatInput}
                  onChange={(event) => setTechChatInput(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") void sendTechChatMessage(); }}
                  placeholder={techChatCopy.placeholder}
                  className="min-w-0 flex-1 rounded-2xl border border-[#51aaca]/16 bg-[#02070d]/70 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#51aaca]/45"
                />
                <button
                  type="button"
                  onClick={() => void sendTechChatMessage()}
                  disabled={techChatLoading || !techChatInput.trim()}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#51aaca] text-[#021014] transition hover:bg-[#9ed8ea] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={language === "uk" ? "Надіслати" : "Send"}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-7 lg:hidden">
              <OfficialResourceLinks language={language} resources={officialResources} />
            </div>
            <div className="mt-7 lg:hidden">
              <BeginnerToolGuide language={language} skill={skill} resources={officialResources} />
            </div>
            <div className="mt-7">
              {skill.bullets[language].map((bullet, index) => {
                const parsed = splitBullet(bullet);
                const detailText = parsed.details || skill.summary[language];
                const isOpen = openBulletIndex === index;

                return (
                  <div key={bullet} className="border-b border-white/12 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenBulletIndex(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="group flex w-full gap-5 text-left"
                    >
                      <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#51aaca]/25 transition ${isOpen ? "bg-[#51aaca]" : "bg-[#51aaca]/10 group-hover:bg-[#51aaca]"}`}>
                        <ChevronRight className={`h-4 w-4 transition ${isOpen ? "rotate-90 text-[#021014]" : "text-[#51aaca] group-hover:text-[#021014]"}`} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xl font-black leading-tight text-white">{parsed.title}</p>
                        {!isOpen && <p className="mt-2 line-clamp-1 text-sm font-medium text-zinc-400">{detailText}</p>}
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <p className="ml-14 mt-3 rounded-2xl border border-[#51aaca]/14 bg-[#061a26]/58 px-4 py-3 text-base font-medium leading-8 text-zinc-300 backdrop-blur-md">{detailText}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="mt-16 border-t border-white/12 pt-8">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-3 text-center sm:justify-between sm:text-left">
            <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#9ed8ea]">{t.techPage.related}</h2>
            <span className="rounded-full border border-[#51aaca]/25 bg-[#51aaca]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d8f3fb]">{skills.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {skills.map((item) => {
              const isActive = item.slug === skill.slug;

              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => !isActive && onSelectSkill(item.slug)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex h-14 min-w-0 items-center justify-between gap-2 rounded-2xl border px-3 text-left shadow-[0_12px_30px_rgba(0,0,0,0.22),0_0_20px_rgba(81,170,202,0.08)] transition hover:-translate-y-0.5 sm:px-4 ${
                    isActive
                      ? "border-[#9ed8ea]/70 bg-[#51aaca] text-[#021014] shadow-[0_18px_38px_rgba(81,170,202,0.28)]"
                      : "border-[#51aaca]/22 bg-[#092231]/88 text-white hover:border-[#9ed8ea]/70 hover:bg-[#51aaca] hover:text-[#021014]"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={`transition ${isActive ? "text-[#021014]" : "text-[#d8f3fb] group-hover:text-[#021014]"}`}>{item.icon}</span>
                    <span className="truncate text-xs font-black sm:text-sm">{item.name}</span>
                  </span>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition ${isActive ? "text-[#021014]" : "text-[#9ed8ea] group-hover:text-[#021014]"}`} />
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

const FocusedTechChat = ({ language, pageContext }: { language: Language; pageContext: ChatPageContext }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const copyText = language === "uk"
    ? {
      eyebrow: "AI по технологіях",
      title: `${pageContext.title} AI Assistant`,
      subtitle: `Окремий помічник саме по ${pageContext.title}: коротко пояснить роль у DevOps і підкаже, де вчитись далі.`,
      welcome: `Я окремий AI-помічник по ${pageContext.title}. Питай коротко: що це, де застосовується в DevOps, або де краще вчитись далі.`,
      placeholder: `Питання про ${pageContext.title}...`,
      thinking: "AI думає...",
      error: "Не вдалося отримати відповідь.",
      send: "Надіслати",
    }
    : {
      eyebrow: "Technology AI",
      title: `${pageContext.title} AI Assistant`,
      subtitle: `A focused helper for ${pageContext.title}: short DevOps context and where to learn more.`,
      welcome: `I am a focused AI helper for ${pageContext.title}. Ask what it is, how it fits DevOps, or where to learn more.`,
      placeholder: `Ask about ${pageContext.title}...`,
      thinking: "AI is thinking...",
      error: "Could not get a response.",
      send: "Send",
    };
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: copyText.welcome }]);

  useEffect(() => {
    setInput("");
    setLoading(false);
    setMessages([{ role: "assistant", content: copyText.welcome }]);
  }, [language, pageContext.title]);

  const sendFocusedMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, messages: nextMessages, pageContext }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "chat_failed");
      setMessages((current) => [...current, { role: "assistant", content: cleanChatText(data.reply) }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: copyText.error }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#51aaca]/26 bg-[#061a26]/78 shadow-[0_24px_70px_rgba(0,0,0,0.28),0_0_36px_rgba(81,170,202,0.1)] backdrop-blur-md">
      <div className="border-b border-[#51aaca]/14 px-6 py-5">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#9ed8ea]">
          <MessageCircle className="h-4 w-4" />
          {copyText.eyebrow}
        </div>
        <h2 className="text-xl font-black text-white">{copyText.title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{copyText.subtitle}</p>
      </div>
      <div className="max-h-80 min-h-48 space-y-3 overflow-y-auto px-6 py-5">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-8 bg-[#51aaca] text-[#021014]" : "mr-8 bg-[#092231] text-zinc-100"}`}>
            {message.content}
          </div>
        ))}
        {loading && <div className="mr-8 rounded-2xl bg-[#092231] px-4 py-3 text-sm text-zinc-400">{copyText.thinking}</div>}
      </div>
      <div className="flex gap-3 border-t border-[#51aaca]/14 bg-[#02070d]/38 p-5">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") void sendFocusedMessage(); }}
          placeholder={copyText.placeholder}
          className="min-w-0 flex-1 rounded-2xl border border-[#51aaca]/16 bg-[#02070d]/70 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#51aaca]/45"
        />
        <button
          type="button"
          onClick={() => void sendFocusedMessage()}
          disabled={loading || !input.trim()}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#51aaca] text-[#021014] transition hover:bg-[#9ed8ea] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={copyText.send}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const AIChatWidget = ({ language, pageContext }: { language: Language; pageContext?: ChatPageContext }) => {
  const t = copy[language].chat;
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "support">("ai");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [supportInput, setSupportInput] = useState("");
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportStatus, setSupportStatus] = useState<"idle" | "sent" | "error">("idle");
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: "", email: "", phone: "", message: "" });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "success" | "error" | "required" | "invalidEmail" | "invalidPhone">("idle");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: t.welcome }]);
  const [supportSessionId] = useState(() => {
    const key = "portfolio-support-session-id";
    const existing = window.localStorage.getItem(key);

    if (existing) return existing;

    const created = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(key, created);
    return created;
  });

  useEffect(() => {
    const storageKey = `portfolio-ai-chat-messages-${language}`;
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      setMessages([{ role: "assistant", content: t.welcome }]);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as ChatMessage[];
      setMessages(Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ role: "assistant", content: t.welcome }]);
    } catch {
      setMessages([{ role: "assistant", content: t.welcome }]);
    }
  }, [language, t.welcome]);

  useEffect(() => {
    window.localStorage.setItem(`portfolio-ai-chat-messages-${language}`, JSON.stringify(messages.slice(-30)));
  }, [language, messages]);

  useEffect(() => {
    if (!isOpen || mode !== "support") return;

    let cancelled = false;

    const syncSupport = async () => {
      try {
        await fetch("/api/support/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: supportSessionId, language }),
        });

        const response = await fetch(`/api/support/messages?sessionId=${encodeURIComponent(supportSessionId)}`);
        const data = await response.json();

        if (!cancelled && response.ok && Array.isArray(data.messages)) {
          setSupportMessages(data.messages);
        }
      } catch {
        if (!cancelled) setSupportStatus("error");
      }
    };

    void syncSupport();
    const interval = window.setInterval(() => void syncSupport(), 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isOpen, language, mode, supportSessionId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, messages: nextMessages, pageContext }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "chat_failed");
      setMessages((current) => [...current, { role: "assistant", content: cleanChatText(data.reply) }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: t.error }]);
    } finally {
      setLoading(false);
    }
  };

  const sendSupportMessage = async () => {
    const trimmed = supportInput.trim();
    if (!trimmed || supportLoading) return;

    setSupportInput("");
    setSupportLoading(true);
    setSupportStatus("idle");

    try {
      const response = await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: supportSessionId, text: trimmed, language }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error("support_failed");
      if (Array.isArray(data.messages)) setSupportMessages(data.messages);
      setSupportStatus("sent");
    } catch {
      setSupportStatus("error");
    } finally {
      setSupportLoading(false);
    }
  };

  const updateLeadForm = (field: keyof LeadForm, value: string) => {
    setLeadStatus("idle");

    if (field !== "phone") {
      setLeadForm((current) => ({ ...current, [field]: value }));
      return;
    }

    const normalized = `${value.trim().startsWith("+") ? "+" : ""}${value.replace(/\D/g, "")}`;

    setLeadForm((current) => ({ ...current, phone: normalized }));

    void import("libphonenumber-js/min").then(({ AsYouType }) => {
      const formatted = new AsYouType("UA").input(normalized);
      setLeadForm((current) => current.phone === normalized ? { ...current, phone: formatted } : current);
    }).catch(() => undefined);
  };

  const isValidPhone = async (phone: string) => {
    if (!phone) return true;

    try {
      const { parsePhoneNumberFromString } = await import("libphonenumber-js/min");
      return parsePhoneNumberFromString(phone, "UA")?.isPossible() ?? false;
    } catch {
      return /^\+?[\d\s().-]{7,24}$/.test(phone);
    }
  };

  const submitLead = async () => {
    const payload = {
      sessionId: supportSessionId,
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      message: leadForm.message.trim(),
      language,
    };

    if (!payload.name || (!payload.email && !payload.phone)) {
      setLeadStatus("required");
      return;
    }

    if (payload.email && (!payload.email.includes("@") || !payload.email.includes("."))) {
      setLeadStatus("invalidEmail");
      return;
    }

    if (payload.phone && !await isValidPhone(payload.phone)) {
      setLeadStatus("invalidPhone");
      return;
    }

    setLeadLoading(true);
    setLeadStatus("idle");

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("lead_failed");
      setLeadForm({ name: "", email: "", phone: "", message: "" });
      setLeadStatus("success");
      setShowLeadForm(false);
    } catch {
      setLeadStatus("error");
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/35 sm:hidden" onClick={() => setIsOpen(false)} />}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="glass w-[min(92vw,380px)] overflow-hidden rounded-3xl border border-[#51aaca]/20 shadow-2xl shadow-black/35">
            <div className="flex items-start justify-between gap-3 border-b border-cyan-950/70 bg-[#051421]/90 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">{mode === "support" ? t.supportTitle : t.title}</p>
                <p className="text-xs text-zinc-400">{mode === "support" ? t.supportSubtitle : t.subtitle}</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-zinc-400 transition hover:bg-[#0a2635] hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
              {mode === "ai" ? (
                <>
                  {messages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto bg-[#51aaca] text-[#021014]" : "bg-[#0a2635] text-zinc-200"}`}>{message.content}</div>
                  ))}
                  {loading && <div className="max-w-[88%] rounded-2xl bg-[#0a2635] px-4 py-3 text-sm text-zinc-400">{t.loading}</div>}
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-[#51aaca]/20 bg-[#061a26]/92 p-4">
                    <button
                      type="button"
                      onClick={() => setShowLeadForm((current) => !current)}
                      aria-expanded={showLeadForm}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#51aaca]/15 bg-[#071b2a]/82 px-4 py-3 text-left transition hover:border-[#51aaca]/35 hover:bg-[#0c2b3d]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{t.leadTitle}</p>
                        <p className="mt-1 text-xs text-zinc-400">{showLeadForm ? t.supportSubtitle : t.leadSubmit}</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 shrink-0 text-[#9ed8ea] transition-transform ${showLeadForm ? "rotate-90" : "rotate-0"}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {showLeadForm && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-2 pt-3">
                            <input value={leadForm.name} onChange={(event) => updateLeadForm("name", event.target.value)} placeholder={t.leadName} className="rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                            <div className="grid gap-2 sm:grid-cols-2">
                              <input value={leadForm.email} onChange={(event) => updateLeadForm("email", event.target.value)} placeholder={t.leadEmail} type="email" className="rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                              <input value={leadForm.phone} onChange={(event) => updateLeadForm("phone", event.target.value)} placeholder={t.leadPhone} inputMode="tel" autoComplete="tel" className="rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                            </div>
                            <textarea value={leadForm.message} onChange={(event) => updateLeadForm("message", event.target.value)} placeholder={t.leadMessage} rows={2} className="resize-none rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                            <button type="button" onClick={() => void submitLead()} disabled={leadLoading} className="mt-1 rounded-xl bg-[#51aaca] px-4 py-2.5 text-sm font-semibold text-[#021014] transition hover:bg-[#9ed8ea] disabled:cursor-not-allowed disabled:opacity-60">{leadLoading ? t.loading : t.leadSubmit}</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {leadStatus !== "idle" && <p className={`mt-3 text-xs ${leadStatus === "success" ? "text-[#9ed8ea]" : "text-red-100"}`}>{leadStatus === "success" ? t.leadSuccess : leadStatus === "required" ? t.leadRequired : leadStatus === "invalidEmail" ? t.leadInvalidEmail : leadStatus === "invalidPhone" ? t.leadInvalidPhone : t.leadError}</p>}
                  </div>
                  {supportMessages.length === 0 && <div className="max-w-[88%] rounded-2xl bg-[#0a2635] px-4 py-3 text-sm leading-relaxed text-zinc-300">{t.supportEmpty}<br /><span className="mt-2 block text-xs text-zinc-500">{t.supportOffline}</span></div>}
                  {supportMessages.map((message) => (
                    <div key={message.id} className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto bg-[#51aaca] text-[#021014]" : "bg-[#0a2635] text-zinc-200"}`}>{message.text}</div>
                  ))}
                  {supportStatus === "sent" && <div className="max-w-[88%] rounded-2xl bg-[#0a2635] px-4 py-3 text-sm text-[#9ed8ea]">{t.supportSent}</div>}
                  {supportStatus === "error" && <div className="max-w-[88%] rounded-2xl bg-red-950/50 px-4 py-3 text-sm text-red-100">{t.supportError}</div>}
                </>
              )}
            </div>
            <div className="border-t border-cyan-950/70 p-4">
              <div className="flex items-center gap-2 rounded-2xl bg-[#04141f] p-2">
                <input value={mode === "support" ? supportInput : input} onChange={(event) => mode === "support" ? setSupportInput(event.target.value) : setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void (mode === "support" ? sendSupportMessage() : sendMessage()); }} placeholder={mode === "support" ? t.supportPlaceholder : t.placeholder} className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500" />
                <button type="button" onClick={() => void (mode === "support" ? sendSupportMessage() : sendMessage())} disabled={mode === "support" ? supportLoading || !supportInput.trim() : loading || !input.trim()} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#51aaca] text-[#021014] transition hover:bg-[#9ed8ea] disabled:cursor-not-allowed disabled:opacity-50" aria-label={t.send}><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => { setIsOpen((current) => mode === "support" ? !current : true); setMode("support"); }} aria-label={t.supportButton} title={t.supportButton} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#51aaca]/25 bg-[#071b2a]/92 font-semibold text-[#d8f3fb] shadow-lg shadow-black/20 transition hover:border-[#51aaca]/45 hover:bg-[#0c2b3d] sm:h-auto sm:w-auto sm:gap-3 sm:px-5 sm:py-3">
            <Mail className="h-5 w-5" />
            <span className="hidden sm:inline">{t.supportButton}</span>
          </button>
          <button type="button" onClick={() => { setIsOpen((current) => mode === "ai" ? !current : true); setMode("ai"); }} aria-label={t.open} title={t.open} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#51aaca] font-bold text-[#021014] shadow-lg shadow-[#51aaca]/25 transition hover:bg-[#9ed8ea] sm:h-auto sm:w-auto sm:gap-3 sm:px-5 sm:py-3 sm:font-semibold">
            <MessageCircle className="hidden h-5 w-5 sm:block" />
            <span className="text-sm sm:hidden">AI</span>
            <span className="hidden sm:inline">{t.open}</span>
          </button>
        </div>
      </div>
    </>
  );
};

const DetailLayout = ({
  language, backLabel, onBack, eyebrow, title, summary, description, bullets, asideTitle, asideContent, pageContext, beginnerGuideContent,
}: {
  language: Language; backLabel: string; onBack: () => void; eyebrow: string; title: string;
  summary: string; description: string; bullets: string[]; asideTitle: string; asideContent: ReactNode;
  pageContext?: ChatPageContext; beginnerGuideContent?: ReactNode;
}) => {
  const [openBulletIndex, setOpenBulletIndex] = useState<number | null>(0);

  return (
    <div className="relative isolate min-h-screen overflow-hidden font-sans">
      <BackgroundScene />
      <nav className="fixed top-0 z-50 w-full glass border-b-0 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-cyan-900/70 bg-[#092231] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-[#51aaca]/30 hover:text-white"><ArrowLeft className="h-4 w-4" />{backLabel}</button>
          <div className="flex items-center rounded-full border border-cyan-950/80 bg-[#061a26]/85 p-1">
            {(["en", "uk"] as Language[]).map((lang) => (
              <button key={lang} type="button" onClick={() => window.dispatchEvent(new CustomEvent("portfolio-language", { detail: lang }))} className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${language === lang ? "bg-[#51aaca] text-[#021014]" : "text-zinc-400 hover:text-white"}`}>{lang}</button>
            ))}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#9ed8ea]">{eyebrow}</p>
            <h1 className="mb-5 text-4xl font-bold text-white md:text-6xl">{title}</h1>
            <p className="mb-6 max-w-3xl text-xl leading-relaxed text-zinc-300">{summary}</p>
            <Card className="mb-8 bg-[#071b2a]/76"><p className="text-base leading-8 text-zinc-300">{description}</p></Card>
            {pageContext && <div className="mb-8"><FocusedTechChat language={language} pageContext={pageContext} /></div>}
            {pageContext?.resources && pageContext.resources.length > 0 && (
              <div className="mb-8">
                <OfficialResourceLinks language={language} resources={pageContext.resources} />
              </div>
            )}
            {beginnerGuideContent && <div className="mb-8">{beginnerGuideContent}</div>}
            <div className="grid gap-4">
              {bullets.map((bullet, index) => {
                const parsed = splitBullet(bullet);
                const detailText = parsed.details || summary;
                const isOpen = openBulletIndex === index;

                return (
                  <div key={bullet} className="overflow-hidden rounded-3xl border border-cyan-950/70 bg-[#071c29]/90">
                    <button
                      type="button"
                      onClick={() => setOpenBulletIndex(isOpen ? null : index)}
                      className="flex w-full items-start gap-4 px-6 py-5 text-left transition hover:bg-[#0b2838]"
                    >
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#51aaca]/15 bg-[#51aaca]/5">
                        <ChevronRight className={`h-4 w-4 text-[#51aaca] transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-lg font-medium text-zinc-100">{parsed.title}</p>
                        {!isOpen && <p className="mt-2 line-clamp-1 text-sm text-zinc-500">{detailText}</p>}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-cyan-950/70 px-6 pb-6 pt-4">
                        <div className="pl-12 text-base leading-8 text-zinc-300">
                          {detailText}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <aside>
            <Card className="sticky top-28 bg-[#051421]/82"><h2 className="mb-5 text-lg font-semibold text-white">{asideTitle}</h2>{asideContent}</Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

const VersionChoiceScreen = ({
  language,
  onLight,
  onAnimated,
  onLanguage,
}: {
  language: Language;
  onLight: () => void;
  onAnimated: () => void;
  onLanguage: (language: Language) => void;
}) => {
  const text = language === "uk"
    ? {
      eyebrow: "ОБЕРИ ВЕРСІЮ",
      title: "ЯК ВІДКРИТИ CV?",
      subtitle: "Light версія для швидкого перегляду резюме. Animated версія для повної кінематографічної презентації зі стеком і AI-помічниками по технологіях.",
      light: "Light portfolio",
      lightText: "Класична версія",
      animated: "Animated CV",
      animatedText: "Анімована версія",
    }
    : {
      eyebrow: "CHOOSE VERSION",
      title: "HOW SHOULD THE CV OPEN?",
      subtitle: "Light version for a fast resume scan. Animated version for the full cinematic experience with stack pages and focused technology AI helpers.",
      light: "Light portfolio",
      lightText: "Classic version",
      animated: "Animated CV",
      animatedText: "Animated version",
    };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#02070d] px-5 text-white">
      <video aria-hidden="true" src="/animated-bg.mp4" preload="auto" autoPlay muted loop playsInline className="absolute inset-0 -z-20 h-full w-full object-cover opacity-42" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.72),rgba(3,12,18,0.42)_48%,rgba(0,0,0,0.78)),radial-gradient(circle_at_center,rgba(81,170,202,0.16),transparent_36%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(rgba(216,243,251,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(216,243,251,0.24)_1px,transparent_1px)] [background-size:100px_100px]" />
      <div className="absolute right-5 top-5 z-10 flex items-center rounded-full border border-[#51aaca]/18 bg-[#061a26]/85 p-1">
        {(["en", "uk"] as Language[]).map((lang) => (
          <button key={lang} type="button" onClick={() => onLanguage(lang)} className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] transition ${language === lang ? "bg-[#51aaca] text-[#021014]" : "text-zinc-400 hover:text-white"}`}>
            {lang}
          </button>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl text-center">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.44em] text-[#9ed8ea]">{text.eyebrow}</p>
        <h1 className="mx-auto max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">{text.title}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{text.subtitle}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <button type="button" onClick={onLight} className="group rounded-3xl border border-[#51aaca]/20 bg-[#071b2a]/78 p-6 text-left shadow-2xl shadow-black/25 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#9ed8ea]/60 hover:bg-[#d8f3fb] hover:text-[#021014]">
            <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#51aaca]/22 bg-[#02070d]/60 text-[#d8f3fb] transition group-hover:bg-[#51aaca] group-hover:text-[#021014]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="text-3xl font-black">{text.light}</div>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.22em] text-[#9ed8ea] transition group-hover:text-[#021014]/70">{text.lightText}</p>
          </button>
          <button type="button" onClick={onAnimated} className="group rounded-3xl border border-[#51aaca]/35 bg-[#51aaca]/16 p-6 text-left shadow-[0_24px_70px_rgba(81,170,202,0.14)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#9ed8ea]/70 hover:bg-[#51aaca] hover:text-[#021014]">
            <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#51aaca]/30 bg-[#02070d]/60 text-[#d8f3fb] transition group-hover:bg-[#021014] group-hover:text-[#d8f3fb]">
              <Terminal className="h-6 w-6" />
            </div>
            <div className="text-3xl font-black">{text.animated}</div>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.22em] text-[#9ed8ea] transition group-hover:text-[#021014]/70">{text.animatedText}</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [route, setRoute] = useState<Route>(() => getRouteFromPath(window.location.pathname));
  const [showStartupLoader, setShowStartupLoader] = useState(true);
  const [showVersionChoice, setShowVersionChoice] = useState(() => getRouteFromPath(window.location.pathname).page === "home");
  const [emailCopied, setEmailCopied] = useState(false);
  const t = copy[language];

  useEffect(() => {
    const isTelegramWebView = /telegram|tgweb|telegrambot/i.test(window.navigator.userAgent);
    document.documentElement.classList.toggle("telegram-webview", isTelegramWebView);

    return () => document.documentElement.classList.remove("telegram-webview");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowStartupLoader(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteFromPath(window.location.pathname));
    const handleLanguage = (event: Event) => {
      const nextLanguage = (event as CustomEvent<Language>).detail;
      if (nextLanguage === "uk" || nextLanguage === "en") setLanguage(nextLanguage);
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("portfolio-language", handleLanguage as EventListener);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("portfolio-language", handleLanguage as EventListener);
    };
  }, []);

  const navigate = (nextRoute: Route) => {
    const pathname = nextRoute.page === "home"
      ? "/"
      : nextRoute.page === "animated"
        ? "/animated"
        : nextRoute.page === "animatedSkill"
          ? `/animated/tech/${nextRoute.slug}`
          : nextRoute.page === "skill"
            ? `/tech/${nextRoute.slug}`
            : `/learning/${nextRoute.slug}`;
    window.history.pushState({}, "", pathname);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateAnimatedTechnologies = () => {
    window.history.pushState({}, "", "/animated#animated-technologies");
    setRoute({ page: "animated" });
    window.setTimeout(() => {
      document.getElementById("animated-technologies")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleCvDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const downloadId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const payload = {
      downloadId,
      siteLanguage: language,
      language: window.navigator.language,
      languages: Array.from(window.navigator.languages || []),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: window.navigator.platform,
      userAgent: window.navigator.userAgent,
      pageUrl: window.location.href,
      referrer: document.referrer,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
    const body = JSON.stringify(payload);
    const downloadUrl = `/download/cv?downloadId=${encodeURIComponent(downloadId)}`;

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/cv-download-context", blob);
      window.location.href = downloadUrl;
      return;
    }

    fetch("/api/cv-download-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).finally(() => {
      window.location.href = downloadUrl;
    });
  };

  const handleEmailContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`;
    const composeWindow = window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");

    if (!composeWindow) {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
        setEmailCopied(true);
        window.setTimeout(() => setEmailCopied(false), 2200);
      }).catch(() => {
        setEmailCopied(false);
      });
    }
  };

  const activeSkill = useMemo(() => route.page === "skill" ? skills.find((item) => item.slug === route.slug) : undefined, [route]);
  const activeAnimatedSkill = useMemo(() => route.page === "animatedSkill" ? skills.find((item) => item.slug === route.slug) : undefined, [route]);
  const activeProvider = useMemo(() => route.page === "provider" ? learningProviders.find((item) => item.slug === route.slug) : undefined, [route]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = route.page === "animatedSkill" && activeAnimatedSkill
      ? `${activeAnimatedSkill.name} | Animated CV`
      : route.page === "animated"
        ? `Animated CV | ${t.title}`
        : route.page === "skill" && activeSkill
          ? `${activeSkill.name} | ${t.title}`
          : route.page === "provider" && activeProvider
            ? `${activeProvider.title} | ${t.title}`
            : t.title;
  }, [activeAnimatedSkill, activeProvider, activeSkill, language, route.page, t.title]);

  useEffect(() => {
    if (route.page !== "animated" || window.location.hash !== "#animated-technologies") return;

    const timer = window.setTimeout(() => {
      document.getElementById("animated-technologies")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);

    return () => window.clearTimeout(timer);
  }, [route.page]);

  useEffect(() => {
    if (route.page !== "home") setShowVersionChoice(false);
  }, [route.page]);

  if (route.page === "animated") {
    return (
      <>
        <AnimatedResume
          language={language}
          onBack={() => navigate({ page: "home" })}
          onContact={() => document.getElementById("animated-contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onCvDownload={handleCvDownload}
          onOpenSkill={(slug) => navigate({ page: "animatedSkill", slug })}
        />
        <AIChatWidget language={language} />
      </>
    );
  }

  if (route.page === "animatedSkill" && activeAnimatedSkill) {
    return (
      <>
        <AnimatedSkillDetail
          language={language}
          skill={activeAnimatedSkill}
          onBack={navigateAnimatedTechnologies}
          onLightVersion={() => navigate({ page: "animated" })}
          onSelectSkill={(slug) => navigate({ page: "animatedSkill", slug })}
        />
        <AIChatWidget language={language} />
      </>
    );
  }

  if (route.page === "skill" && activeSkill) {
    const officialResources = officialTechnologyResources[activeSkill.slug] ?? [];
    const beginnerGuide = [
      activeSkill.summary[language],
      activeSkill.bullets[language][0],
      officialResources.map((resource) => resource.label).join(", "),
    ].filter(Boolean);

    return <>
      <DetailLayout
        language={language}
        backLabel={t.techPage.back}
        onBack={() => navigate({ page: "home" })}
        eyebrow={t.techPage.title}
        title={activeSkill.name}
        summary={activeSkill.summary[language]}
        description={activeSkill.description[language]}
        bullets={activeSkill.bullets[language]}
        asideTitle={t.techPage.related}
        pageContext={{
          section: "technology",
          title: activeSkill.name,
          summary: activeSkill.summary[language],
          description: activeSkill.description[language],
          bullets: activeSkill.bullets[language],
          resources: officialResources,
          beginnerGuide,
        }}
        beginnerGuideContent={<BeginnerToolGuide language={language} skill={activeSkill} resources={officialResources} />}
        asideContent={<div className="space-y-3">{skills.map((item) => {
          const isActive = item.slug === activeSkill.slug;
          return <button key={item.slug} type="button" onClick={() => !isActive && navigate({ page: "skill", slug: item.slug })} aria-current={isActive ? "page" : undefined} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${isActive ? "border-[#51aaca]/45 bg-[#51aaca]/12 text-white shadow-[0_0_0_1px_rgba(81,170,202,0.1)]" : "cursor-pointer border-cyan-950/70 bg-[#092231] text-zinc-300 hover:border-[#51aaca]/30 hover:text-white"}`}><span className="flex items-center gap-2">{item.icon}{item.name}</span><ChevronRight className={`h-4 w-4 ${isActive ? "text-[#d8f3fb]" : "text-[#9ed8ea]"}`} /></button>;
        })}</div>}
      />
      <AIChatWidget language={language} />
    </>;
  }

  if (route.page === "provider" && activeProvider) {
    return <>
      <DetailLayout
        language={language}
        backLabel={t.learningPage.back}
        onBack={() => navigate({ page: "home" })}
        eyebrow={activeProvider.category[language]}
        title={activeProvider.title}
        summary={activeProvider.summary[language]}
        description={activeProvider.summary[language]}
        bullets={activeProvider.highlights[language]}
        asideTitle={t.learningPage.related}
        asideContent={<div className="space-y-3"><a href={activeProvider.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-[#51aaca]/20 bg-[#51aaca]/10 px-4 py-3 text-sm font-semibold text-[#d8f3fb] transition hover:bg-[#51aaca]/15">{t.learningPage.openSite}<ExternalLink className="h-4 w-4" /></a>{learningProviders.map((item) => {
          const isActive = item.slug === activeProvider.slug;
          return <button key={item.slug} type="button" onClick={() => !isActive && navigate({ page: "provider", slug: item.slug })} aria-current={isActive ? "page" : undefined} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${isActive ? "border-[#51aaca]/45 bg-[#51aaca]/12 text-white shadow-[0_0_0_1px_rgba(81,170,202,0.1)]" : "cursor-pointer border-cyan-950/70 bg-[#092231] text-zinc-300 hover:border-[#51aaca]/30 hover:text-white"}`}><span>{item.title}</span><ChevronRight className={`h-4 w-4 ${isActive ? "text-[#d8f3fb]" : "text-[#9ed8ea]"}`} /></button>;
        })}</div>}
      />
      <AIChatWidget language={language} />
    </>;
  }

  if (route.page === "home" && showVersionChoice) {
    return (
      <>
        <AnimatePresence>{showStartupLoader && <StartupLoader />}</AnimatePresence>
        {!showStartupLoader && (
          <VersionChoiceScreen
            language={language}
            onLanguage={setLanguage}
            onLight={() => setShowVersionChoice(false)}
            onAnimated={() => {
              setShowVersionChoice(false);
              navigate({ page: "animated" });
            }}
          />
        )}
      </>
    );
  }

  return (
    <div id="top" className="relative isolate min-h-screen overflow-hidden font-sans">
      <AnimatePresence>{showStartupLoader && <StartupLoader />}</AnimatePresence>
      <BackgroundScene />
      <nav className="fixed top-0 z-50 w-full glass border-b-0 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex min-w-0 items-center overflow-hidden rounded-2xl border border-[#51aaca]/18 bg-[#02070d]/62 p-1 text-white shadow-2xl shadow-black/20 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => navigate({ page: "animated" })}
              aria-label={t.hero.animated}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#51aaca]/25 bg-[#071b2a]/80 px-3 text-[#d8f3fb] transition hover:bg-[#51aaca] hover:text-[#021014] sm:px-4"
            >
              <Terminal className="h-4 w-4" />
              <span className="hidden text-xs font-black uppercase tracking-[0.14em] sm:inline">{t.hero.animated}</span>
            </button>
            <button type="button" onClick={() => navigate({ page: "animated" })} className="min-w-0 px-4 text-left transition hover:text-[#d8f3fb] sm:min-w-[220px]">
              <span className="block truncate text-lg font-black leading-none tracking-tight sm:text-xl">DEVOPS</span>
              <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.22em] text-[#9ed8ea] sm:text-[10px]">Open animated CV</span>
            </button>
          </motion.div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden gap-6 text-sm font-medium text-zinc-400 md:flex">
              <a href="#about" className="transition-colors hover:text-white">{t.nav.about}</a>
              <a href="#experience" className="transition-colors hover:text-white">{t.nav.experience}</a>
              <a href="#projects" className="transition-colors hover:text-white">{t.nav.projects}</a>
              <a href="#learning" className="transition-colors hover:text-white">{t.nav.learning}</a>
              <a href="#contact" className="transition-colors hover:text-white">{t.nav.contact}</a>
            </div>
            <div className="flex items-center rounded-full border border-cyan-950/80 bg-[#061a26]/85 p-1">
              {(["en", "uk"] as Language[]).map((lang) => <button key={lang} type="button" onClick={() => setLanguage(lang)} className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${language === lang ? "bg-[#51aaca] text-[#021014]" : "text-zinc-400 hover:text-white"}`}>{lang}</button>)}
            </div>
          </div>
        </div>
      </nav>
      <section className="relative overflow-hidden pb-20 pt-32">
        <InfinityHero />
        <div className="absolute left-1/2 top-0 -z-10 h-full w-full max-w-7xl -translate-x-1/2">
          <div className="telegram-sensitive-effect absolute left-10 top-20 h-72 w-72 rounded-full bg-[#51aaca]/18 blur-[120px]" />
          <div className="telegram-sensitive-effect absolute bottom-20 right-10 h-72 w-72 rounded-full bg-cyan-300/14 blur-[120px]" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="mb-6 inline-block rounded-full border border-[#51aaca]/20 bg-[#51aaca]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#9ed8ea]">{t.hero.badge}</span>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">Maksym <span className="text-gradient">Prysiazhnikov</span></h1>
              <p className="mb-8 text-xl leading-relaxed text-zinc-400 md:text-2xl">{t.hero.role}</p>
              <div className="flex flex-wrap gap-4">
                <motion.a href="#contact" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-[#51aaca] px-8 py-4 font-semibold text-[#021014] shadow-lg shadow-[#51aaca]/20 transition-all hover:bg-[#9ed8ea]"><Mail className="h-5 w-5" />{t.hero.contact}</motion.a>
                <motion.button type="button" onClick={() => navigate({ page: "animated" })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-[#d8f3fb] px-8 py-4 font-semibold text-[#021014] shadow-lg shadow-[#d8f3fb]/10 transition-all hover:bg-white"><Terminal className="h-5 w-5" />{t.hero.animated}</motion.button>
                <motion.a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass flex items-center gap-2 rounded-xl px-8 py-4 font-semibold text-white transition-all hover:bg-[#0c2b3d]"><Github className="h-5 w-5" />{t.hero.github}</motion.a>
                <motion.a href="/download/cv" onClick={handleCvDownload} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass flex items-center gap-2 rounded-xl border border-[#51aaca]/25 px-8 py-4 font-semibold text-[#effaff] transition-all hover:bg-[#0c2b3d] hover:text-white"><Download className="h-5 w-5" />{t.hero.resume}</motion.a>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            data-profile-photo
            className="relative mx-auto mt-4 w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:mt-0 lg:max-w-[400px]"
          >
            <div className="absolute inset-4 rounded-[2rem] bg-[#51aaca]/18 blur-3xl" />
            <div className="profile-photo-frame relative overflow-hidden rounded-[2rem] border border-[#51aaca]/20 bg-[#061a26]/80 shadow-2xl shadow-black/35">
              <img
                src="/profile-photo.jpg"
                alt="Maksym Prysiazhnikov"
                onError={(event) => event.currentTarget.closest("[data-profile-photo]")?.classList.add("hidden")}
                className="aspect-[4/5] w-full object-cover object-center saturate-[0.92]"
              />
            </div>
          </motion.div>
        </div>
      </section>
      <section id="about" className="bg-[#051421]/45 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionTitle>{t.about.title}</SectionTitle>
              <p className="mb-6 text-lg leading-relaxed text-zinc-400">{t.about.p1}</p>
              <p className="mb-6 text-lg leading-relaxed text-zinc-400">{t.about.p2}</p>
              <p className="text-lg leading-relaxed text-zinc-400">{t.about.p3}</p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-zinc-300"><MapPin className="h-5 w-5 text-[#51aaca]" /><span>{t.about.country}</span></div>
                <div className="flex items-center gap-3 text-zinc-300"><Globe className="h-5 w-5 text-[#51aaca]" /><span>{t.about.english}</span></div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white"><Cpu className="h-5 w-5 text-[#51aaca]" />{t.about.stack}</h3>
              <p className="mb-6 text-sm text-zinc-500">{t.about.stackHint}</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.button key={skill.slug} type="button" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} onClick={() => navigate({ page: "skill", slug: skill.slug })} className="cursor-pointer flex items-center justify-between gap-2 rounded-xl border border-[#51aaca]/28 bg-[#51aaca]/10 px-4 py-3 text-left text-sm font-semibold text-[#d8f3fb] shadow-[0_10px_28px_rgba(81,170,202,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#51aaca]/45 hover:bg-[#51aaca]/14 hover:text-white sm:border-cyan-950/70 sm:bg-[#092231] sm:text-zinc-100 sm:shadow-none">
                    <span className="flex min-w-0 items-center gap-2">{skill.icon}<span className="truncate">{skill.name}</span></span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#9ed8ea] sm:hidden" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="experience" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle subtitle={t.experience.subtitle}>{t.experience.title}</SectionTitle>
          <div className="space-y-8">
            <Card className="border-l-4 border-l-[#51aaca]">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white">{t.experience.commercialTitle}</h3>
                    <p className="font-medium text-[#9ed8ea]">{t.experience.commercialRole}</p>
                  </div>
                  <ul className="space-y-3 text-zinc-400">{t.experience.commercialPoints.map((point: string) => <li key={point} className="flex gap-3"><ChevronRight className="h-5 w-5 shrink-0 text-[#51aaca]" />{point}</li>)}</ul>
                </div>
                <a href={COMMERCIAL_SITE_URL} target="_blank" rel="noopener noreferrer" aria-label={`${t.experience.liveSite}: ${t.experience.commercialTitle}`} className="group block overflow-hidden rounded-2xl border border-[#51aaca]/20 bg-[#061a26]/80 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-[#51aaca]/45 hover:shadow-[0_22px_60px_rgba(81,170,202,0.12)]">
                  <img src="/vid-franko-preview.png" alt="Vid Franko website homepage preview" className="aspect-video w-full object-cover object-top opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100" />
                  <span className="flex items-center justify-between border-t border-cyan-950/70 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#d8f3fb]">
                    {t.experience.liveSite}
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </Card>
            <Card className="border-l-4 border-l-[#51aaca]">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white">{t.experience.volunteerTitle}</h3>
                    <p className="font-medium text-[#9ed8ea]">{t.experience.volunteerRole}</p>
                  </div>
                  <ul className="space-y-3 text-zinc-400">{t.experience.volunteerPoints.map((point: string) => <li key={point} className="flex gap-3"><ChevronRight className="h-5 w-5 shrink-0 text-[#51aaca]" />{point}</li>)}</ul>
                </div>
                <a href={VOLUNTEER_DEMO_URL} target="_blank" rel="noopener noreferrer" aria-label={`${t.experience.liveDemo}: ${t.experience.volunteerTitle}`} className="group block overflow-hidden rounded-2xl border border-[#51aaca]/20 bg-[#061a26]/80 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-[#51aaca]/45 hover:shadow-[0_22px_60px_rgba(81,170,202,0.12)]">
                  <img src="/volunteer-site-preview.png" alt="Volunteer Site homepage preview" className="aspect-video w-full object-cover object-top opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100" />
                  <span className="flex items-center justify-between border-t border-cyan-950/70 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#d8f3fb]">
                    {t.experience.liveDemo}
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </Card>
            <Card>
              <h3 className="mb-2 text-2xl font-bold text-white">{t.experience.handsOnTitle}</h3>
              <p className="mb-6 font-medium text-[#9ed8ea]">{t.experience.handsOnRole}</p>
              <div className="grid gap-8 md:grid-cols-2">
                {t.experience.blocks.map((block: { title: string; text: string }, index: number) => <div key={block.title}><h4 className="mb-4 flex items-center gap-2 font-semibold text-white">{blockIcons[index]}{block.title}</h4><p className="text-sm leading-relaxed text-zinc-400">{block.text}</p></div>)}
              </div>
            </Card>
          </div>
        </div>
      </section>
      <section id="projects" className="bg-[#051421]/45 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle subtitle={t.projects.subtitle}>{t.projects.title}</SectionTitle>
          <div className="grid gap-8 md:grid-cols-3">
            {t.projects.items.map((project: { title: string; description: string; tags: string[]; link: string }) => <div key={project.title}><Card className="flex h-full flex-col"><div className="mb-4 flex items-start justify-between"><div className="rounded-xl bg-[#51aaca]/10 p-3 text-[#9ed8ea]"><Code2 className="h-6 w-6" /></div><a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} on GitHub`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#51aaca]/20 bg-[#51aaca]/10 text-[#d8f3fb] transition hover:border-[#51aaca]/45 hover:bg-[#51aaca]/15 hover:text-white"><Github className="h-5 w-5" /></a></div><h3 className="mb-3 text-xl font-bold text-white">{project.title}</h3><p className="mb-6 flex-grow text-sm text-zinc-400">{project.description}</p><div className="mb-6 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-md bg-[#0a2635] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{tag}</span>)}</div><a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#51aaca]/25 bg-[#51aaca]/10 px-4 py-2.5 text-sm font-semibold text-[#d8f3fb] transition hover:border-[#51aaca]/45 hover:bg-[#51aaca]/15 hover:text-white"><Github className="h-4 w-4" />GitHub</a></Card></div>)}
          </div>
        </div>
      </section>
      <section id="learning" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionTitle>{t.certs.title}</SectionTitle>
              <div className="space-y-4">{t.certs.items.map((cert: { name: string; issuer: string; year: string; details?: string }) => <div key={cert.name} className="group flex gap-4 rounded-xl p-4 transition-colors hover:bg-[#071d29]/80"><div className="mt-1"><Award className="h-6 w-6 text-[#51aaca]" /></div><div><h4 className="font-bold text-white transition-colors group-hover:text-[#9ed8ea]">{cert.name}</h4><p className="text-sm text-zinc-400">{cert.issuer} • {cert.year}</p>{cert.details && <p className="mt-1 text-xs text-[#9ed8ea]/70">{cert.details}</p>}</div></div>)}</div>
            </div>
            <div>
              <SectionTitle>{t.education.title}</SectionTitle>
              <div className="space-y-8">{t.education.items.map((item: { title: string; place: string }) => <div key={item.title} className="relative border-l border-cyan-950/70 pl-8"><div className="absolute left-[-5px] top-0 h-[9px] w-[9px] rounded-full bg-[#51aaca]" /><h4 className="font-bold text-white">{item.title}</h4><p className="text-sm text-zinc-400">{item.place}</p></div>)}</div>
              <div className="mt-12">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-white"><Globe className="h-5 w-5 text-[#51aaca]" />{t.education.languagesTitle}</h3>
                <div className="flex flex-wrap gap-4">{t.education.languages.map((item: { label: string; value: string }) => <div key={item.label} className="glass rounded-lg px-4 py-2"><p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">{item.label}</p><p className="font-medium text-white">{item.value}</p></div>)}</div>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <SectionTitle subtitle={t.education.providersSubtitle}>{t.education.providersTitle}</SectionTitle>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {learningProviders.map((provider) => (
                <Card key={provider.slug} className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex rounded-full border border-[#51aaca]/15 bg-[#51aaca]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8f3fb]">{provider.category[language]}</div>
                    <h3 className="mb-3 text-xl font-bold text-white">{provider.title}</h3>
                    <p className="mb-6 text-sm leading-7 text-zinc-400">{provider.summary[language]}</p>
                  </div>
                  <div className="mt-auto flex flex-col gap-3">
                    <a href={provider.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl bg-[#51aaca] px-4 py-3 text-sm font-semibold text-[#021014] transition hover:bg-[#9ed8ea]">{t.education.visitSite}<ExternalLink className="h-4 w-4" /></a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#051421]/45 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle subtitle={t.earlier.subtitle}>{t.earlier.title}</SectionTitle>
          <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">{t.earlier.items.map((item: { period: string; title: string; text: string }) => <div key={item.title} className="h-full"><Card className="h-full"><div className="mb-3 flex items-center gap-2 text-[#51aaca]"><Calendar className="h-4 w-4" /><span className="text-xs font-bold">{item.period}</span></div><h4 className="mb-2 font-bold text-white">{item.title}</h4><p className="text-sm text-zinc-400">{item.text}</p></Card></div>)}</div>
        </div>
      </section>
      <footer id="contact" className="border-t border-cyan-950/60 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <SectionTitle subtitle={t.contact.subtitle}>{t.contact.title}</SectionTitle>
          <div className="mb-12 flex flex-wrap justify-center gap-8">
            <a href="https://linkedin.com/in/maxim-prysyazhnikov-b46196163" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4"><div className="glass flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-[#51aaca] group-hover:text-[#021014]"><Linkedin className="h-8 w-8" /></div><span className="text-zinc-400 transition-colors group-hover:text-white">{t.contact.linkedin}</span></a>
            <a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4"><div className="glass flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-[#51aaca] group-hover:text-[#021014]"><Github className="h-8 w-8" /></div><span className="text-zinc-400 transition-colors group-hover:text-white">{t.contact.github}</span></a>
            <a href={`mailto:${CONTACT_EMAIL}`} onClick={handleEmailContact} aria-label={`Email ${CONTACT_EMAIL}`} className="group flex flex-col items-center gap-4"><div className="glass flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-[#51aaca] group-hover:text-[#021014]"><Mail className="h-8 w-8" /></div><span className="text-zinc-400 transition-colors group-hover:text-white">{emailCopied ? t.contact.emailCopied : t.contact.email}</span></a>
          </div>
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} {t.contact.footer}</p>
        </div>
      </footer>
      <AIChatWidget language={language} />
    </div>
  );
}
