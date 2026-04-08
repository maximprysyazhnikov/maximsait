/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from "react";
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
  GraduationCap, 
  Award,
  ChevronRight,
  MapPin,
  Calendar,
  Briefcase
} from "lucide-react";

const SectionTitle = ({ children, subtitle }: { children: ReactNode; subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold text-white mb-4"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-slate-400 max-w-2xl"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 60 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="h-1 bg-blue-500 mt-4 rounded-full"
    />
  </div>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`glass p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group ${className}`}
  >
    {children}
  </motion.div>
);

export default function App() {
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

  const projects = [
    {
      title: "AI Crypto CAT Bot",
      description: "Python Telegram bot for crypto market analysis with GPT-based insights and multi-format reports (Markdown, HTML, PDF).",
      tags: ["Python", "GPT API", "Market Data", "Automation"],
      link: "https://github.com/maximprysyazhnikov/ccbv3.8"
    },
    {
      title: "KROK Worldbuilder Bot",
      description: "AI assistant for the KROK universe with multilingual support, lore browsing, and image prompt generation.",
      tags: ["AI", "Telegram Bot", "Prompt Engineering"],
      link: "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot"
    },
    {
      title: "DevOps AI Agent",
      description: "Automation-oriented bot connected to OpenRouter GPT API with environment-based configuration.",
      tags: ["DevOps", "AI", "Python", "API Integration"],
      link: "https://github.com/maximprysyazhnikov/devops_ai_agent"
    }
  ];

  const certifications = [
    {
      name: "DevOps Engineer Professional Certificate",
      issuer: "Mate academy",
      year: "2026",
      details: "462+ hands-on tasks completed"
    },
    {
      name: "Google Cybersecurity Certificate",
      issuer: "Google / Coursera",
      year: "2024"
    },
    {
      name: "Project Management in IT",
      issuer: "Beetroot Academy",
      year: "2023"
    },
    {
      name: "English Course (B2, Grade A)",
      issuer: "12 Project",
      year: "2024"
    }
  ];

  return (
    <div id="top" className="min-h-screen font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white"
          >
            <a href="#top" className="block">
              <DevOpsLogo />
            </a>
          </motion.div>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider uppercase mb-6 border border-blue-500/20">
                Available for opportunities
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Maksym <span className="text-gradient">Prysyazhnikov</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-8 leading-relaxed">
                Junior DevOps Engineer & Cloud Specialist focused on building resilient, automated infrastructure.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Get in touch
                </motion.a>
                <motion.a
                  href="https://github.com/maximprysyazhnikov"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 glass hover:bg-slate-800 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About & Skills */}
      <section id="about" className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionTitle>About Me</SectionTitle>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                Junior DevOps / Cloud Engineer with hands-on experience in Linux, Docker, Kubernetes, and cloud deployment workflows. 
                I specialize in infrastructure fundamentals, database operations, and environment-based application delivery.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                Completed a rigorous DevOps program at Mate academy and hold a Google Cybersecurity Certificate. 
                I am passionate about automation, CI/CD pipelines, and building secure, scalable environments.
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>Ukraine</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>English (B2)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                Technical Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-medium text-slate-300 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                  >
                    {skill.icon}
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Practical application of DevOps principles in real-world scenarios.">
            Technical Experience
          </SectionTitle>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Team Project — Volunteer Site</h3>
                  <p className="text-blue-400 font-medium">DevOps / Deployment Lead</p>
                </div>
                <a 
                  href="https://volunteer-site-placeholder-dev.up.railway.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </div>
              <ul className="space-y-3 text-slate-400">
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                  Contributed to deployment and environment setup for a team web project.
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                  Worked with cloud hosting, application configuration, and production environment variables.
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                  Ensured database connectivity and participated in release setup and backend support.
                </li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold text-white mb-2">Hands-on DevOps Practice</h3>
              <p className="text-blue-400 font-medium mb-6">Mate academy Training</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Container className="w-4 h-4 text-blue-500" />
                    Kubernetes & Containers
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Built and maintained training projects covering Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets, and Persistent Volumes.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    Database Administration
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Practiced MySQL user management, backup/restore, slow query logs, error log monitoring, and migration rollback scenarios.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-500" />
                    Infrastructure as Code
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Used Terraform and Azure fundamentals for infrastructure provisioning, state handling, modules, and validation workflows.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    CI/CD & Automation
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Implemented automated pipelines for application delivery, focusing on environment-based configuration and security.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Selected personal projects showcasing automation and AI integration.">
            Featured Projects
          </SectionTitle>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.title}>
                <Card className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Education */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionTitle>Certifications</SectionTitle>
              <div className="space-y-4">
                {certifications.map((cert) => (
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
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-8">
                <div className="relative pl-8 border-l border-slate-800">
                  <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-blue-500" />
                  <h4 className="text-white font-bold">Architecture and Urban Planning</h4>
                  <p className="text-sm text-slate-400">Odesa State Academy of Civil Engineering and Architecture</p>
                </div>
                <div className="relative pl-8 border-l border-slate-800">
                  <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-blue-500" />
                  <h4 className="text-white font-bold">Software-related studies</h4>
                  <p className="text-sm text-slate-400">Popov Academy of Telecommunications</p>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Languages
                </h3>
                <div className="flex gap-4">
                  <div className="px-4 py-2 rounded-lg glass">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Ukrainian</p>
                    <p className="text-white font-medium">Native</p>
                  </div>
                  <div className="px-4 py-2 rounded-lg glass">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">English</p>
                    <p className="text-white font-medium">Upper-Intermediate (B2)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earlier Experience */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Foundation in communication, sales, and project management.">
            Earlier Experience
          </SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center gap-2 text-blue-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold">2019 – 2022</span>
              </div>
              <h4 className="text-white font-bold mb-2">Self-employed</h4>
              <p className="text-sm text-slate-400">Online product promotion and demand generation. Used digital channels to support sales flow.</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-blue-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold">2017 – 2019</span>
              </div>
              <h4 className="text-white font-bold mb-2">Business Partnership</h4>
              <p className="text-sm text-slate-400">Wholesale buyers communication, negotiation, and deal coordination.</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-blue-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold">2016 – 2017</span>
              </div>
              <h4 className="text-white font-bold mb-2">Real Estate Agent</h4>
              <p className="text-sm text-slate-400">NBR Real Estate. Property transactions and client communication support.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer id="contact" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionTitle subtitle="I'm always open to discussing new projects and opportunities.">
            Let's Connect
          </SectionTitle>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a 
              href="mailto:maxisky2595@gmail.com" 
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Mail className="w-8 h-8" />
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">Email Me</span>
            </a>
            <a 
              href="https://linkedin.com/in/maxim-prysyazhnikov-b46196163" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Linkedin className="w-8 h-8" />
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">LinkedIn</span>
            </a>
            <a 
              href="https://github.com/maximprysyazhnikov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Github className="w-8 h-8" />
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">GitHub</span>
            </a>
          </div>

          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Maksym Prysyazhnikov. Built with React & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
