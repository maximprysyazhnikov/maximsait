import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DevOpsLogo from "./components/DevOpsLogo";
import {
  ArrowLeft, ArrowUp, Award, Calendar, ChevronRight, Cloud, Code2, Container, Cpu, Database,
  Download, ExternalLink, Github, Globe, Linkedin, Mail, MapPin, MessageCircle, Send, ShieldCheck,
  Terminal, X,
} from "lucide-react";

type Language = "uk" | "en";
type Route = { page: "home" } | { page: "skill"; slug: string } | { page: "provider"; slug: string };
type ChatMessage = { role: "user" | "assistant"; content: string };
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

const VOLUNTEER_DEMO_URL = "https://volunteer-site-placeholder-dev.up.railway.app/";

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

const BackgroundScene = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_34%)]" />
    <motion.div animate={{ x: [0, 30, -10, 0], y: [0, -20, 15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[#9ed8ea]/10 blur-[90px]" />
    <motion.div animate={{ x: [0, -40, 20, 0], y: [0, 20, -25, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[6%] top-[22%] h-96 w-96 rounded-full bg-cyan-200/8 blur-[110px]" />
    <motion.div animate={{ x: [0, 20, -18, 0], y: [0, -12, 20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[8%] left-[20%] h-64 w-64 rounded-full bg-cyan-200/10 blur-[80px]" />
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
    exit={{ opacity: 0, filter: "blur(10px)" }}
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
  { slug: "siem", name: "SIEM", icon: <ShieldCheck className="h-4 w-4" />, summary: { uk: "Безпековий моніторинг і кореляція подій.", en: "Security monitoring and event correlation." }, description: { uk: "SIEM додає до мого профілю розуміння безпекового моніторингу, централізації логів та аналізу підозрілих подій. Це корисний міст між інфраструктурою та кібербезпекою, де важливо не просто збирати логи, а вміти бачити в них сигнали ризику.", en: "SIEM adds security monitoring, centralized logging, and suspicious event analysis to my skill set. It acts as a bridge between infrastructure and cybersecurity, where the goal is not only to collect logs but to detect meaningful risk signals inside them." }, bullets: { uk: ["Розуміння збору та аналізу логів: централізований погляд на події допомагає бачити картину системи цілком, а не окремими фрагментами.", "Базова робота з подіями безпеки: виявлення підозрілої активності, нетипових дій або ознак інциденту.", "Зв'язок між DevOps і security-практиками: інфраструктура має бути не лише автоматизованою, а й спостережуваною з точки зору безпеки."], en: ["Understanding log collection and analysis so system behavior can be observed centrally rather than as isolated fragments.", "Basic work with security events: spotting suspicious activity, unusual behavior, or indicators of an incident.", "Connecting DevOps and security practices so infrastructure is not only automated, but also security-observable."] } },
  { slug: "ids-ips", name: "IDS/IPS", icon: <ShieldCheck className="h-4 w-4" />, summary: { uk: "Виявлення та запобігання мережевим загрозам.", en: "Detection and prevention of network threats." }, description: { uk: "IDS/IPS для мене — це частина кібербезпекового фундаменту: розуміння того, як виявляються аномалії й реагують системи захисту. Ця частина стеку підсилює загальне бачення безпечної інфраструктури, де важливо не лише розгорнути сервіс, а й розуміти, як його захищати.", en: "IDS/IPS is part of my cybersecurity foundation: understanding how anomalies are detected and how defense systems respond. This strengthens my overall view of secure infrastructure, where it is not enough to deploy a service — you also need to understand how to protect it." }, bullets: { uk: ["Базове розуміння мережевих атак і сигналів: як виглядає підозріла активність і які патерни можуть вказувати на загрозу.", "Знайомство з інструментами виявлення й захисту: що саме робить система моніторингу, а що — система превентивного блокування.", "Підсилення безпекового мислення в інфраструктурі: під час роботи з сервісами важливо думати не тільки про доступність, а й про захист."], en: ["Basic understanding of network attacks and signals: what suspicious activity looks like and which patterns may indicate a threat.", "Familiarity with detection and protection tools: understanding the difference between observing malicious behavior and blocking it proactively.", "Strengthening security thinking in infrastructure so service design includes protection, not only availability."] } },
];

const learningProviders: LearningProvider[] = [
  { slug: "p12", title: "12 Project", url: "https://p12.com.ua/", category: { uk: "Англійська мова", en: "English learning" }, summary: { uk: "Курси англійської, які посилили технічну комунікацію та читання документації.", en: "English courses that strengthened technical communication and documentation reading." }, highlights: { uk: ["Практична англійська для роботи й навчання.", "Підтримка рівня B2 для технічної комунікації."], en: ["Practical English for work and study.", "Support for B2-level technical communication."] } },
  { slug: "beetroot", title: "Beetroot Academy", url: "https://beetroot.academy/", category: { uk: "Project Management / IT", en: "Project Management / IT" }, summary: { uk: "Навчання, яке посилило розуміння командної взаємодії та керування задачами.", en: "Training that strengthened my understanding of teamwork and task coordination." }, highlights: { uk: ["Практичний підхід до роботи в IT-команді.", "Комунікація, пріоритезація й менеджмент."], en: ["A practical approach to working in an IT team.", "Communication, prioritization, and management."] } },
  { slug: "mate", title: "Mate academy", url: "https://mate.academy/", category: { uk: "DevOps", en: "DevOps" }, summary: { uk: "Ключова DevOps-програма з великою кількістю практичних завдань.", en: "A core DevOps program with a large amount of practical work." }, highlights: { uk: ["Контейнери, Kubernetes, БД, хмара, IaC.", "Hands-on підхід і задачі, близькі до реальних."], en: ["Containers, Kubernetes, databases, cloud, IaC.", "A hands-on approach with real-world-like tasks."] } },
  { slug: "prometheus", title: "Prometheus", url: "https://prometheus.org.ua/", category: { uk: "Онлайн-освіта", en: "Online learning" }, summary: { uk: "Додаткове джерело курсів для безперервного розвитку.", en: "An additional source of courses for continuous growth." }, highlights: { uk: ["Зручний формат для самостійного навчання.", "Добір додаткових курсів під конкретні потреби."], en: ["A convenient format for self-paced learning.", "Useful complementary courses for specific needs."] } },
];

const copy = {
  uk: {
    title: "Maksym Prysiazhnikov | DevOps Портфоліо",
    nav: { about: "Про мене", experience: "Досвід", projects: "Проєкти", learning: "Навчання", contact: "Контакти" },
    hero: { badge: "Відкритий до нових можливостей", role: "Junior DevOps Engineer & Cloud Specialist, зосереджений на побудові стійкої та автоматизованої інфраструктури.", contact: "Зв'язатися", github: "GitHub", resume: "Скачати CV" },
    about: { title: "Про мене", p1: "Junior DevOps / Cloud Engineer із практичним досвідом роботи з Linux, Docker, Kubernetes і процесами хмарного розгортання.", p2: "Спеціалізуюся на основах інфраструктури, роботі з базами даних, автоматизації та доставці застосунків у різні середовища.", p3: "Закінчив інтенсивну DevOps-програму в Mate academy та маю сертифікат Google Cybersecurity. Мені близькі автоматизація, CI/CD та побудова безпечних і масштабованих середовищ.", country: "Україна", english: "Англійська (B2)", stack: "Технічний стек", stackHint: "Натисни на технологію, щоб перейти на окрему сторінку з описом." },
    experience: { title: "Технічний досвід", subtitle: "Практичне застосування DevOps-підходів у реальних сценаріях.", volunteerTitle: "Командний проєкт — Volunteer Site", volunteerRole: "DevOps / Deployment Lead", liveDemo: "Live Demo", volunteerPoints: ["Брав участь у деплої та налаштуванні середовища для командного вебпроєкту.", "Працював із хмарним хостингом, конфігурацією застосунку та production-змінними середовища.", "Забезпечував підключення до бази даних і долучався до підготовки релізів та backend-підтримки."], handsOnTitle: "Практика DevOps", handsOnRole: "Навчання в Mate academy", blocks: [{ title: "Kubernetes і контейнери", text: "Створював і підтримував навчальні проєкти з Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets і Persistent Volumes." }, { title: "Адміністрування баз даних", text: "Практикував керування користувачами MySQL, backup/restore, аналіз slow query logs, моніторинг error logs і сценарії відкату міграцій." }, { title: "Infrastructure as Code", text: "Працював із Terraform та основами Azure для provisioning інфраструктури, керування state, модулів і процесів валідації." }, { title: "CI/CD та автоматизація", text: "Реалізовував автоматизовані пайплайни доставки застосунків із фокусом на environment-based configuration та безпеку." }] },
    projects: { title: "Вибрані проєкти", subtitle: "Особисті проєкти, що демонструють автоматизацію, DevOps-підхід та інтеграцію AI.", items: [{ title: "Portfolio Website with AI Assistant", description: "Особистий сайт-портфоліо на React з плаваючим AI-помічником, сторінками технологій, навчальних платформ і серверною інтеграцією через OpenRouter API.", tags: ["React", "OpenRouter", "AI Chat", "Portfolio"], link: "https://github.com/maximprysyazhnikov/maximsait" }, { title: "AI Crypto CAT Bot", description: "Telegram-бот на Python для аналізу крипторинку з GPT-інсайтами та звітами у форматах Markdown, HTML і PDF.", tags: ["Python", "GPT API", "Market Data", "Automation"], link: "https://github.com/maximprysyazhnikov/ccbv3.8" }, { title: "KROK Worldbuilder Bot", description: "AI-асистент для всесвіту KROK з багатомовною підтримкою, переглядом лору та генерацією image prompts.", tags: ["AI", "Telegram Bot", "Prompt Engineering"], link: "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot" }, { title: "DevOps AI Agent", description: "Орієнтований на автоматизацію бот, інтегрований з OpenRouter API та конфігурацією через змінні середовища.", tags: ["DevOps", "AI", "Python", "API Integration"], link: "https://github.com/maximprysyazhnikov/devops_ai_agent" }] },
    certs: { title: "Сертифікації", items: [{ name: "Професійний сертифікат DevOps Engineer", issuer: "Mate academy", year: "2026", details: "462+ виконаних практичних завдань" }, { name: "Google Cybersecurity Certificate", issuer: "Google / Coursera", year: "2024" }, { name: "Project Management in IT", issuer: "Beetroot Academy", year: "2023" }, { name: "Курс англійської мови (B2, Grade A)", issuer: "12 Project", year: "2024" }] },
    education: { title: "Освіта", items: [{ title: "Архітектура та містобудування", place: "Одеська державна академія будівництва та архітектури" }, { title: "Навчання за напрямами, пов'язаними з програмним забезпеченням", place: "Академія зв'язку імені О. С. Попова" }], languagesTitle: "Мови", languages: [{ label: "Українська", value: "Рідна" }, { label: "Англійська", value: "Upper-Intermediate (B2)" }], providersTitle: "Платформи та курси", providersSubtitle: "Посилання на платформи, які пов'язані з моїм навчанням і розвитком.", visitSite: "Перейти на сайт" },
    learningPage: { back: "До головного меню", openSite: "Відкрити сайт", related: "Інші платформи" },
    techPage: { back: "До головного меню", title: "Технологія", related: "Інші технології" },
    earlier: { title: "Попередній досвід", subtitle: "Фундамент у комунікації, продажах і координації проєктів.", items: [{ period: "2022 – 2026", title: "Аутсорс та волонтерські проєкти", text: "Аутсорс-робота та ведення проєктів на волонтерській основі: координація задач, комунікація з учасниками, підтримка запусків і супровід робочих процесів." }, { period: "2019 – 2022", title: "Самозайнятість", text: "Онлайн-просування продуктів і генерація попиту. Використовував цифрові канали для підтримки продажів." }, { period: "2017 – 2019", title: "Бізнес-партнерство", text: "Комунікація з оптовими покупцями, переговори та координація угод." }, { period: "2016 – 2017", title: "Агент з нерухомості", text: "NBR Real Estate. Супровід операцій з нерухомістю та комунікація з клієнтами." }] },
    contact: { title: "Контакти", subtitle: "Відкритий до нових проєктів, співпраці та професійних можливостей.", linkedin: "LinkedIn", github: "GitHub", footer: "Створено за допомогою React і Tailwind CSS." },
    chat: { title: "AI Помічник", subtitle: "Постав питання про мій досвід, стек або проєкти.", open: "AI Помічник", placeholder: "Напиши повідомлення...", send: "Надіслати", loading: "AI друкує відповідь...", welcome: "Привіт! Я AI-помічник цього портфоліо. Можу коротко розповісти про стек, досвід і навчання.", error: "Не вдалося отримати відповідь. Перевір ключ OpenRouter на сервері.", supportButton: "Зворотний звʼязок", supportTitle: "Зворотний звʼязок", supportSubtitle: "Залиш контакти або напиши повідомлення напряму.", supportPlaceholder: "Напиши повідомлення...", supportEmpty: "Почни діалог. Повідомлення прилетить мені в Telegram.", supportSent: "Повідомлення відправлено.", supportError: "Не вдалося відправити. Спробуй ще раз.", supportOffline: "Якщо ти будеш не в мережі, я побачу це в Telegram.", leadTitle: "Контакти для відповіді", leadName: "Імʼя", leadEmail: "Email", leadPhone: "Телефон", leadMessage: "Коротко про запит", leadSubmit: "Надіслати контакти", leadRequired: "Вкажи імʼя та email або телефон.", leadInvalidEmail: "Email має містити @ і крапку.", leadInvalidPhone: "Перевір формат номера телефону.", leadSuccess: "Дякую! Контакти відправлено.", leadError: "Не вдалося відправити контакти. Спробуй ще раз." },
  },
  en: {
    title: "Maksym Prysiazhnikov | DevOps Portfolio",
    nav: { about: "About", experience: "Experience", projects: "Projects", learning: "Learning", contact: "Contact" },
    hero: { badge: "Available for opportunities", role: "Junior DevOps Engineer & Cloud Specialist focused on building resilient, automated infrastructure.", contact: "Get in touch", github: "GitHub", resume: "Download CV" },
    about: { title: "About Me", p1: "Junior DevOps / Cloud Engineer with hands-on experience in Linux, Docker, Kubernetes, and cloud deployment workflows.", p2: "I specialize in infrastructure fundamentals, database operations, automation, and environment-based application delivery.", p3: "I completed an intensive DevOps program at Mate academy and hold a Google Cybersecurity Certificate. I am passionate about automation, CI/CD pipelines, and building secure, scalable environments.", country: "Ukraine", english: "English (B2)", stack: "Technical Stack", stackHint: "Click a technology to open a separate page with a short explanation." },
    experience: { title: "Technical Experience", subtitle: "Practical application of DevOps principles in real-world scenarios.", volunteerTitle: "Team Project — Volunteer Site", volunteerRole: "DevOps / Deployment Lead", liveDemo: "Live Demo", volunteerPoints: ["Contributed to deployment and environment setup for a team web project.", "Worked with cloud hosting, application configuration, and production environment variables.", "Ensured database connectivity and participated in release setup and backend support."], handsOnTitle: "Hands-on DevOps Practice", handsOnRole: "Mate academy Training", blocks: [{ title: "Kubernetes & Containers", text: "Built and maintained training projects covering Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets, and Persistent Volumes." }, { title: "Database Administration", text: "Practiced MySQL user management, backup and restore, slow query log analysis, error log monitoring, and migration rollback scenarios." }, { title: "Infrastructure as Code", text: "Worked with Terraform and Azure fundamentals for infrastructure provisioning, state management, modules, and validation workflows." }, { title: "CI/CD & Automation", text: "Implemented automated delivery pipelines with a focus on environment-based configuration and security." }] },
    projects: { title: "Featured Projects", subtitle: "Selected personal projects showcasing automation, DevOps thinking, and AI integration.", items: [{ title: "Portfolio Website with AI Assistant", description: "A personal React portfolio website with a floating AI assistant, technology detail pages, learning platform links, and a server-side OpenRouter integration.", tags: ["React", "OpenRouter", "AI Chat", "Portfolio"], link: "https://github.com/maximprysyazhnikov/maximsait" }, { title: "AI Crypto CAT Bot", description: "A Python Telegram bot for crypto market analysis with GPT-powered insights and reports in Markdown, HTML, and PDF formats.", tags: ["Python", "GPT API", "Market Data", "Automation"], link: "https://github.com/maximprysyazhnikov/ccbv3.8" }, { title: "KROK Worldbuilder Bot", description: "An AI assistant for the KROK universe with multilingual support, lore browsing, and image prompt generation.", tags: ["AI", "Telegram Bot", "Prompt Engineering"], link: "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot" }, { title: "DevOps AI Agent", description: "An automation-oriented bot integrated with the OpenRouter API and configured through environment variables.", tags: ["DevOps", "AI", "Python", "API Integration"], link: "https://github.com/maximprysyazhnikov/devops_ai_agent" }] },
    certs: { title: "Certifications", items: [{ name: "DevOps Engineer Professional Certificate", issuer: "Mate academy", year: "2026", details: "462+ hands-on tasks completed" }, { name: "Google Cybersecurity Certificate", issuer: "Google / Coursera", year: "2024" }, { name: "Project Management in IT", issuer: "Beetroot Academy", year: "2023" }, { name: "English Course (B2, Grade A)", issuer: "12 Project", year: "2024" }] },
    education: { title: "Education", items: [{ title: "Architecture and Urban Planning", place: "Odesa State Academy of Civil Engineering and Architecture" }, { title: "Software-related studies", place: "Popov Academy of Telecommunications" }], languagesTitle: "Languages", languages: [{ label: "Ukrainian", value: "Native" }, { label: "English", value: "Upper-Intermediate (B2)" }], providersTitle: "Platforms and courses", providersSubtitle: "Links to the learning platforms connected to my growth path.", visitSite: "Visit website" },
    learningPage: { back: "Main menu", openSite: "Open website", related: "Other platforms" },
    techPage: { back: "Main menu", title: "Technology", related: "Other technologies" },
    earlier: { title: "Earlier Experience", subtitle: "A foundation in communication, sales, and project coordination.", items: [{ period: "2022 – 2026", title: "Outsourcing and Volunteer Projects", text: "Outsourcing work and project ownership on a volunteer basis: task coordination, stakeholder communication, launch support, and day-to-day workflow management." }, { period: "2019 – 2022", title: "Self-employed", text: "Focused on online product promotion and demand generation, using digital channels to support sales." }, { period: "2017 – 2019", title: "Business Partnership", text: "Handled communication with wholesale buyers, negotiations, and deal coordination." }, { period: "2016 – 2017", title: "Real Estate Agent", text: "Worked at NBR Real Estate, supporting property transactions and client communication." }] },
    contact: { title: "Let's Connect", subtitle: "I am always open to discussing new projects, collaboration, and career opportunities.", linkedin: "LinkedIn", github: "GitHub", footer: "Built with React & Tailwind CSS." },
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

const AIChatWidget = ({ language }: { language: Language }) => {
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
  const [showScrollTop, setShowScrollTop] = useState(false);
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
    const updateScrollTopVisibility = () => {
      setShowScrollTop(window.scrollY > 260);
    };

    updateScrollTopVisibility();
    window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollTopVisibility);
  }, []);

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
        body: JSON.stringify({ language, messages: nextMessages }),
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
    } catch {
      setLeadStatus("error");
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/35 sm:hidden" onClick={() => setIsOpen(false)} />}
      {showScrollTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="До гори" title="До гори" className="fixed bottom-5 left-1/2 z-50 inline-flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-[#51aaca]/18 bg-[#071b2a]/45 text-[#d8f3fb]/90 shadow-lg shadow-black/10 backdrop-blur-md transition hover:border-[#51aaca]/40 hover:bg-[#0c2b3d]/70 hover:text-white">
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
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
                    <p className="mb-3 text-sm font-semibold text-white">{t.leadTitle}</p>
                    <div className="grid gap-2">
                      <input value={leadForm.name} onChange={(event) => updateLeadForm("name", event.target.value)} placeholder={t.leadName} className="rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input value={leadForm.email} onChange={(event) => updateLeadForm("email", event.target.value)} placeholder={t.leadEmail} type="email" className="rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                        <input value={leadForm.phone} onChange={(event) => updateLeadForm("phone", event.target.value)} placeholder={t.leadPhone} inputMode="tel" autoComplete="tel" className="rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                      </div>
                      <textarea value={leadForm.message} onChange={(event) => updateLeadForm("message", event.target.value)} placeholder={t.leadMessage} rows={2} className="resize-none rounded-xl border border-cyan-950/70 bg-[#04141f] px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#51aaca]/50" />
                      {leadStatus !== "idle" && <p className={`text-xs ${leadStatus === "success" ? "text-[#9ed8ea]" : "text-red-100"}`}>{leadStatus === "success" ? t.leadSuccess : leadStatus === "required" ? t.leadRequired : leadStatus === "invalidEmail" ? t.leadInvalidEmail : leadStatus === "invalidPhone" ? t.leadInvalidPhone : t.leadError}</p>}
                      <button type="button" onClick={() => void submitLead()} disabled={leadLoading} className="mt-1 rounded-xl bg-[#51aaca] px-4 py-2.5 text-sm font-semibold text-[#021014] transition hover:bg-[#9ed8ea] disabled:cursor-not-allowed disabled:opacity-60">{leadLoading ? t.loading : t.leadSubmit}</button>
                    </div>
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
  language, backLabel, onBack, eyebrow, title, summary, description, bullets, asideTitle, asideContent,
}: {
  language: Language; backLabel: string; onBack: () => void; eyebrow: string; title: string;
  summary: string; description: string; bullets: string[]; asideTitle: string; asideContent: ReactNode;
}) => {
  const [openBulletIndex, setOpenBulletIndex] = useState<number | null>(0);

  return (
    <div className="relative isolate min-h-screen overflow-hidden font-sans">
      <BackgroundScene />
      <nav className="fixed top-0 z-50 w-full glass border-b-0 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-cyan-900/70 bg-[#092231] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-[#51aaca]/30 hover:text-white"><ArrowLeft className="h-4 w-4" />{backLabel}</button>
          <div className="flex items-center rounded-full border border-cyan-950/80 bg-[#061a26]/85 p-1">
            {(["uk", "en"] as Language[]).map((lang) => (
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
            <div className="grid gap-4">
              {bullets.map((bullet, index) => {
                const parsed = splitBullet(bullet);
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
                      </div>
                    </button>

                    {isOpen && parsed.details && (
                      <div className="border-t border-cyan-950/70 px-6 pb-6 pt-4">
                        <div className="pl-12 text-base leading-8 text-zinc-300">
                          {parsed.details}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <aside><Card className="sticky top-28 bg-[#051421]/82"><h2 className="mb-5 text-lg font-semibold text-white">{asideTitle}</h2>{asideContent}</Card></aside>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [language, setLanguage] = useState<Language>("uk");
  const [route, setRoute] = useState<Route>(() => getRouteFromPath(window.location.pathname));
  const [showStartupLoader, setShowStartupLoader] = useState(true);
  const t = copy[language];

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
    const pathname = nextRoute.page === "home" ? "/" : nextRoute.page === "skill" ? `/tech/${nextRoute.slug}` : `/learning/${nextRoute.slug}`;
    window.history.pushState({}, "", pathname);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeSkill = useMemo(() => route.page === "skill" ? skills.find((item) => item.slug === route.slug) : undefined, [route]);
  const activeProvider = useMemo(() => route.page === "provider" ? learningProviders.find((item) => item.slug === route.slug) : undefined, [route]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = route.page === "skill" && activeSkill ? `${activeSkill.name} | ${t.title}` : route.page === "provider" && activeProvider ? `${activeProvider.title} | ${t.title}` : t.title;
  }, [activeProvider, activeSkill, language, route.page, t.title]);

  if (route.page === "skill" && activeSkill) {
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

  return (
    <div id="top" className="relative isolate min-h-screen overflow-hidden font-sans">
      <AnimatePresence>{showStartupLoader && <StartupLoader />}</AnimatePresence>
      <BackgroundScene />
      <nav className="fixed top-0 z-50 w-full glass border-b-0 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-white"><button type="button" onClick={() => navigate({ page: "home" })} className="block"><DevOpsLogo /></button></motion.div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden gap-6 text-sm font-medium text-zinc-400 md:flex">
              <a href="#about" className="transition-colors hover:text-white">{t.nav.about}</a>
              <a href="#experience" className="transition-colors hover:text-white">{t.nav.experience}</a>
              <a href="#projects" className="transition-colors hover:text-white">{t.nav.projects}</a>
              <a href="#learning" className="transition-colors hover:text-white">{t.nav.learning}</a>
              <a href="#contact" className="transition-colors hover:text-white">{t.nav.contact}</a>
            </div>
            <div className="flex items-center rounded-full border border-cyan-950/80 bg-[#061a26]/85 p-1">
              {(["uk", "en"] as Language[]).map((lang) => <button key={lang} type="button" onClick={() => setLanguage(lang)} className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${language === lang ? "bg-[#51aaca] text-[#021014]" : "text-zinc-400 hover:text-white"}`}>{lang}</button>)}
            </div>
          </div>
        </div>
      </nav>
      <section className="relative overflow-hidden pb-20 pt-32">
        <InfinityHero />
        <div className="absolute left-1/2 top-0 -z-10 h-full w-full max-w-7xl -translate-x-1/2">
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-[#51aaca]/18 blur-[120px]" />
          <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-cyan-300/14 blur-[120px]" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="mb-6 inline-block rounded-full border border-[#51aaca]/20 bg-[#51aaca]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#9ed8ea]">{t.hero.badge}</span>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">Maksym <span className="text-gradient">Prysiazhnikov</span></h1>
              <p className="mb-8 text-xl leading-relaxed text-zinc-400 md:text-2xl">{t.hero.role}</p>
              <div className="flex flex-wrap gap-4">
                <motion.a href="#contact" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 rounded-xl bg-[#51aaca] px-8 py-4 font-semibold text-[#021014] shadow-lg shadow-[#51aaca]/20 transition-all hover:bg-[#9ed8ea]"><Mail className="h-5 w-5" />{t.hero.contact}</motion.a>
                <motion.a href="https://github.com/maximprysyazhnikov" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass flex items-center gap-2 rounded-xl px-8 py-4 font-semibold text-white transition-all hover:bg-[#0c2b3d]"><Github className="h-5 w-5" />{t.hero.github}</motion.a>
                <motion.a href="/download/cv" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass flex items-center gap-2 rounded-xl border border-[#51aaca]/25 px-8 py-4 font-semibold text-[#effaff] transition-all hover:bg-[#0c2b3d] hover:text-white"><Download className="h-5 w-5" />{t.hero.resume}</motion.a>
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
          </div>
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} Maksym Prysiazhnikov. {t.contact.footer}</p>
        </div>
      </footer>
      <AIChatWidget language={language} />
    </div>
  );
}
