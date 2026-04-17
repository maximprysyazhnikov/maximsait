from pathlib import Path

from html import escape

from PIL import Image, ImageDraw, ImageEnhance, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image as PdfImage,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "CV" / "Maksym_Prysiazhnikov_CV.pdf"
PHOTO = ROOT / "public" / "profile-photo.jpg"

PAGE_W, PAGE_H = A4
INK = colors.HexColor("#effaff")
MUTED = colors.HexColor("#9ca3af")
TEAL = colors.HexColor("#51aaca")
TEAL_LIGHT = colors.HexColor("#9ed8ea")
PAPER = colors.HexColor("#030b12")
CARD = colors.HexColor("#071b2a")
SOFT_BLUE = colors.HexColor("#092231")
LINE = colors.HexColor("#164055")
CONTENT_WIDTH = 170 * mm
HEADER_PHOTO_WIDTH = 54 * mm
HEADER_TEXT_WIDTH = CONTENT_WIDTH - HEADER_PHOTO_WIDTH

CONTACTS = [
    "Ukraine",
    "maxisky2595@gmail.com",
    "+380 66 012 1932",
    "linkedin.com/in/maxim-prysyazhnikov-b46196163",
    "github.com/maximprysyazhnikov",
]


def read_app_url() -> str:
    for env_path in (ROOT / ".env", ROOT / ".env.example"):
        if not env_path.exists():
            continue
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if line.startswith("APP_URL="):
                return line.split("=", 1)[1].strip().strip("\"'")
    return "http://localhost:3000"


SITE_URL = read_app_url()
VOLUNTEER_DEMO_URL = "https://volunteer-site-placeholder-dev.up.railway.app/"
LINKEDIN_URL = "https://linkedin.com/in/maxim-prysyazhnikov-b46196163"
GITHUB_URL = "https://github.com/maximprysyazhnikov"
LEARNING_LINKS = [
    ("12 Project", "https://p12.com.ua/"),
    ("Beetroot Academy", "https://beetroot.academy/"),
    ("Mate academy", "https://mate.academy/"),
    ("Prometheus", "https://prometheus.org.ua/"),
]

SKILLS = [
    "Linux",
    "Docker",
    "Kubernetes",
    "Azure",
    "Terraform",
    "CI/CD",
    "GitHub Actions",
    "Python",
    "MySQL",
    "PostgreSQL",
    "Liquibase",
    "Bash",
    "SIEM",
    "IDS/IPS",
    "AI Integration",
    "API Integration",
]

PROJECTS = [
    {
        "title": "Portfolio Website with AI Assistant",
        "tags": "React, OpenRouter, AI Chat, Portfolio",
        "text": "Built a personal React portfolio with a floating AI assistant, technology pages, learning platform sections, and server-side OpenRouter API integration.",
        "link": "https://github.com/maximprysyazhnikov/maximsait",
        "extra": [("Portfolio Website", SITE_URL)],
    },
    {
        "title": "AI Crypto CAT Bot",
        "tags": "Python, GPT API, Market Data, Automation",
        "text": "Built a Telegram bot for crypto market analysis with GPT-powered insights and reports in Markdown, HTML, and PDF formats.",
        "link": "https://github.com/maximprysyazhnikov/ccbv3.8",
        "extra": [],
    },
    {
        "title": "KROK Worldbuilder Bot",
        "tags": "AI, Telegram Bot, Prompt Engineering",
        "text": "Created an AI assistant for the KROK universe with multilingual support, lore browsing, and image prompt generation.",
        "link": "https://github.com/maximprysyazhnikov/krok-worldbuilder-bot",
        "extra": [],
    },
    {
        "title": "DevOps AI Agent",
        "tags": "DevOps, AI, Python, API Integration",
        "text": "Created an automation-oriented bot integrated with the OpenRouter API and configured through environment variables.",
        "link": "https://github.com/maximprysyazhnikov/devops_ai_agent",
        "extra": [],
    },
]


def register_fonts() -> tuple[str, str]:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")

    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("ResumeRegular", str(regular)))
        pdfmetrics.registerFont(TTFont("ResumeBold", str(bold)))
        return "ResumeRegular", "ResumeBold"

    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def make_styles():
    styles = getSampleStyleSheet()

    return {
        "name": ParagraphStyle(
            "Name",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=25,
            leading=28,
            textColor=INK,
            spaceAfter=3,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=11.6,
            leading=14.2,
            textColor=TEAL_LIGHT,
            spaceAfter=6,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=styles["Normal"],
            fontName=FONT,
            fontSize=8.4,
            leading=11.8,
            textColor=colors.HexColor("#d8f3fb"),
        ),
        "lead": ParagraphStyle(
            "Lead",
            parent=styles["Normal"],
            fontName=FONT,
            fontSize=9.1,
            leading=13.1,
            textColor=colors.HexColor("#e5edf2"),
            spaceAfter=3,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=10.2,
            leading=12.4,
            textColor=colors.HexColor("#f8fdff"),
            spaceBefore=9,
            spaceAfter=6,
            borderPadding=(0, 0, 4, 0),
            borderColor=TEAL,
            borderWidth=0,
            borderBottomWidth=1,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName=FONT,
            fontSize=8.8,
            leading=12.8,
            textColor=colors.HexColor("#d1d5db"),
            alignment=TA_LEFT,
            spaceAfter=2,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=styles["Normal"],
            fontName=FONT,
            fontSize=8,
            leading=11.2,
            textColor=MUTED,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=styles["Normal"],
            fontName=FONT,
            fontSize=7.9,
            leading=10.8,
            textColor=TEAL_LIGHT,
            spaceAfter=3,
        ),
        "item_title": ParagraphStyle(
            "ItemTitle",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=9.4,
            leading=12.6,
            textColor=colors.HexColor("#ffffff"),
            spaceBefore=4,
            spaceAfter=1,
        ),
        "chip": ParagraphStyle(
            "Chip",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=7.5,
            leading=9.4,
            textColor=colors.HexColor("#d8f3fb"),
            alignment=TA_CENTER,
        ),
        "sidebar_heading": ParagraphStyle(
            "SidebarHeading",
            parent=styles["Normal"],
            fontName=FONT_BOLD,
            fontSize=8.9,
            leading=11.4,
            textColor=INK,
            spaceBefore=7,
            spaceAfter=4,
        ),
    }


S = make_styles()


def para(text: str, style="body") -> Paragraph:
    return Paragraph(escape(text), S[style])


def rich_para(markup: str, style="body") -> Paragraph:
    return Paragraph(markup, S[style])


def link(url: str, label: str) -> str:
    return f'<a href="{escape(url, quote=True)}" color="#9ed8ea">{escape(label)}</a>'


def bullets(items: list[str]) -> Table:
    rows = [[Paragraph("•", S["small"]), para(item)] for item in items]
    table = Table(rows, colWidths=[5 * mm, None], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TEXTCOLOR", (0, 0), (0, -1), TEAL),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, -1), 2),
                ("RIGHTPADDING", (1, 0), (1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 1.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return table


def soft_panel(flowables: list, width=CONTENT_WIDTH) -> Table:
    table = Table([[flowables]], colWidths=[width], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#071b2a")),
                ("BOX", (0, 0), (-1, -1), 0.45, colors.HexColor("#1a465b")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def section(title: str):
    return para(title.upper(), "section")


def make_chip_table(items: list[str], columns=4, width=CONTENT_WIDTH):
    rows = []
    for index in range(0, len(items), columns):
        row = [Paragraph(item, S["chip"]) for item in items[index:index + columns]]
        while len(row) < columns:
            row.append("")
        rows.append(row)

    table = Table(rows, colWidths=[width / columns] * columns, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#092231")),
                ("BOX", (0, 0), (-1, -1), 0.45, colors.HexColor("#23566b")),
                ("INNERGRID", (0, 0), (-1, -1), 3, PAPER),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    return table


def resized_photo() -> PdfImage | None:
    if not PHOTO.exists():
        return None

    with Image.open(PHOTO) as image:
        image = image.convert("RGB")
        image = ImageOps.fit(image, (520, 620), method=Image.Resampling.LANCZOS, centering=(0.48, 0.32))
        image = ImageEnhance.Color(image).enhance(0.92)
        image = ImageEnhance.Contrast(image).enhance(1.08)
        image = ImageEnhance.Brightness(image).enhance(1.03)

        radius = 34
        mask = Image.new("L", image.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)

        framed = Image.new("RGB", (image.width + 18, image.height + 18), "#d8f3fb")
        framed_mask = Image.new("L", framed.size, 0)
        mask_draw = ImageDraw.Draw(framed_mask)
        mask_draw.rounded_rectangle((0, 0, framed.width, framed.height), radius=radius + 10, fill=255)
        framed.paste(image, (9, 9), mask)

        temp = OUTPUT.with_suffix(".photo.jpg")
        framed.save(temp, "JPEG", quality=92)

    pdf_image = PdfImage(str(temp), width=38 * mm, height=46 * mm)
    return pdf_image


def build_header():
    left = [
        para("Maksym Prysiazhnikov", "name"),
        para("Junior DevOps Engineer & Cloud Specialist", "role"),
        para("Open to Junior DevOps, Cloud, Infrastructure, CI/CD, and automation roles.", "lead"),
        Spacer(1, 4),
        rich_para(
            "Ukraine | "
            f"{link('mailto:maxisky2595@gmail.com', 'Email')} | "
            f"{link('tel:+380660121932', 'Phone')} | "
            f"{link(SITE_URL, 'Portfolio Website')}",
            "contact",
        ),
        rich_para(
            f"{link(LINKEDIN_URL, 'LinkedIn')} | "
            f"{link(GITHUB_URL, 'GitHub')}",
            "contact",
        ),
    ]

    photo = resized_photo()
    if not photo:
        return left

    table = Table([[left, photo]], colWidths=[HEADER_TEXT_WIDTH, HEADER_PHOTO_WIDTH], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#071b2a")),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#23566b")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return [table]


def sidebar_block():
    return [
        para("Highlights", "sidebar_heading"),
        bullets(
            [
                "462+ practical DevOps tasks completed.",
                "Deployment lead experience on a team web project.",
                "Cloud, containers, databases, automation, and security fundamentals.",
            ]
        ),
        para("Certifications", "sidebar_heading"),
        para("DevOps Engineer Professional Certificate - Mate academy, 2026.", "small"),
        para("Google Cybersecurity Certificate - Google / Coursera, 2024.", "small"),
        para("Project Management in IT - Beetroot Academy, 2023.", "small"),
        para("English Course - 12 Project, B2 Grade A, 2024.", "small"),
        para("Languages", "sidebar_heading"),
        para("Ukrainian: Native<br/>English: Upper-Intermediate (B2)", "small"),
    ]


def main_content():
    story = []

    story.append(section("Profile"))
    story.append(soft_panel([
        para(
            "Junior DevOps / Cloud Engineer focused on resilient infrastructure, predictable releases, "
            "and automation that reduces manual operational work.",
            "lead",
        ),
        bullets(
            [
                "Hands-on with Linux, Docker, Kubernetes, cloud deployment workflows, databases, and CI/CD.",
                "Comfortable connecting infrastructure, application configuration, and release readiness.",
                "Interested in systems that are secure, observable, repeatable, and easy for teams to maintain.",
            ]
        ),
    ]))

    story.append(section("Core Skills"))
    story.append(make_chip_table(SKILLS, columns=4, width=CONTENT_WIDTH))
    story.append(Spacer(1, 3))

    story.append(section("Technical Experience"))
    story.append(soft_panel([
        para("Team Project - Volunteer Site", "item_title"),
        para("DevOps / Deployment Lead", "meta"),
        bullets(
            [
                "Contributed to deployment and environment setup for a production-oriented team web project.",
                "Worked with cloud hosting, application configuration, production variables, and release preparation.",
                "Supported database connectivity and backend readiness during launch and iteration.",
            ]
        ),
        rich_para(f"Links: {link(VOLUNTEER_DEMO_URL, 'Live Demo')}", "small"),
    ]))
    story.append(Spacer(1, 5))
    story.append(soft_panel([
        para("Hands-on DevOps Practice", "item_title"),
        para("Mate academy training", "meta"),
        bullets(
            [
                "Built Kubernetes practice projects with Pods, Services, Deployments, HPA, DaemonSets, CronJobs, ConfigMaps, Secrets, and Persistent Volumes.",
                "Practiced MySQL administration: users, backup and restore, slow query logs, error logs, and migration rollback scenarios.",
                "Worked with Terraform and Azure fundamentals for infrastructure provisioning, state, modules, and validation workflows.",
                "Implemented CI/CD delivery workflows with environment-based configuration and security in mind.",
            ]
        ),
    ]))

    story.append(PageBreak())
    story.append(Spacer(1, 11 * mm))
    story.append(section("Featured Projects"))
    for project in PROJECTS:
        project_links = [(label, url) for label, url in project.get("extra", [])]
        project_links.append(("Repository", project["link"]))
        link_line = "Links: " + " | ".join(link(url, label) for label, url in project_links)

        story.append(
            KeepTogether(
                [
                    soft_panel([
                        para(project["title"], "item_title"),
                        para(project["tags"], "meta"),
                        para(project["text"], "body"),
                        rich_para(link_line, "small"),
                    ], width=CONTENT_WIDTH),
                    Spacer(1, 5),
                ]
            )
        )

    story.append(section("Education"))
    story.append(
        soft_panel(
            [
                bullets(
                    [
                        "Architecture and Urban Planning - Odesa State Academy of Civil Engineering and Architecture.",
                        "Software-related studies - Popov Academy of Telecommunications.",
                    ]
                )
            ]
        )
    )

    return story


def build_story():
    story = []
    story.extend(build_header())
    story.append(Spacer(1, 8))

    highlights = Table(
        [[para("462+ practical DevOps tasks completed", "chip"), para("Deployment lead on a team web project", "chip"), para("Cloud, containers, automation, and security", "chip")]],
        colWidths=[CONTENT_WIDTH / 3, CONTENT_WIDTH / 3, CONTENT_WIDTH / 3],
        hAlign="LEFT",
    )
    highlights.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#092231")),
                ("BOX", (0, 0), (-1, -1), 0.55, colors.HexColor("#23566b")),
                ("INNERGRID", (0, 0), (-1, -1), 3, PAPER),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(highlights)
    story.append(Spacer(1, 3))
    story.extend(main_content())

    story.append(section("Certifications"))
    story.append(soft_panel([
        bullets(
            [
                "DevOps Engineer Professional Certificate - Mate academy, 2026, 462+ hands-on tasks completed.",
                "Google Cybersecurity Certificate - Google / Coursera, 2024.",
                "Project Management in IT - Beetroot Academy, 2023.",
                "English Course - 12 Project, B2 Grade A, 2024.",
            ]
        )
    ]))

    story.append(section("Learning Links"))
    story.append(
        soft_panel(
            [
                rich_para(
                    "Platforms: " + " | ".join(link(url, label) for label, url in LEARNING_LINKS),
                    "lead",
                )
            ]
        )
    )

    story.append(section("Languages"))
    story.append(soft_panel([para("Ukrainian: Native. English: Upper-Intermediate (B2).", "lead")]))

    story.append(PageBreak())
    story.append(Spacer(1, 11 * mm))
    story.append(section("Earlier Experience"))
    story.append(soft_panel([
        bullets(
            [
                "2022-2026: Outsourcing work and volunteer project ownership: task coordination, stakeholder communication, launch support, and daily workflow management.",
                "2019-2022: Self-employed: online product promotion and demand generation using digital channels to support sales.",
                "2017-2019: Business partnership: communication with wholesale buyers, negotiations, and deal coordination.",
                "2016-2017: Real Estate Agent at NBR Real Estate: supported property transactions and client communication.",
            ]
        )
    ]))

    story.append(section("About Me"))
    story.append(soft_panel([
        para(
            "I am a Junior DevOps Engineer focused on practical infrastructure work: clear deployment flow, stable environments, "
            "automation, and reliable handoff between development and operations. I learn through building and troubleshooting, "
            "so I pay attention to logs, configuration, repeatable steps, and the small details that make systems easier to maintain.",
            "lead",
        ),
        para(
            "My background includes project coordination, communication with stakeholders, and responsibility for delivery, which helps me "
            "stay organized under pressure and connect technical work with real project needs. Through DevOps, cybersecurity, project "
            "management, and English courses, I built a structured way of learning and working: defining goals, breaking work into steps, "
            "creating roadmaps, tracking progress, and adjusting the plan when new information appears. This helps me approach tasks with "
            "a clear plan instead of guessing, while still staying flexible during troubleshooting.",
            "body",
        ),
        para(
            "I am looking for a team where I can grow through hands-on DevOps tasks, contribute to infrastructure quality, and keep improving "
            "my cloud, CI/CD, automation, and operational thinking.",
            "body",
        ),
    ]))

    story.append(section("ATS Keywords"))
    story.append(soft_panel([
        para(
            "Junior DevOps Engineer, Cloud Engineer, Infrastructure as Code, containerization, Kubernetes, Docker, Linux administration, "
            "Azure, Terraform, CI/CD, GitHub Actions, Python automation, Bash scripting, MySQL, PostgreSQL, Liquibase, monitoring, security fundamentals, SIEM, IDS/IPS.",
            "small",
        )
    ]))

    return story


def draw_page_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#061827"))
    canvas.rect(0, PAGE_H - 22 * mm, PAGE_W, 22 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#051421"))
    canvas.rect(0, 0, 7 * mm, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(TEAL)
    canvas.rect(0, PAGE_H - 22 * mm, PAGE_W, 2.1 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#0a2635"))
    canvas.circle(PAGE_W - 14 * mm, PAGE_H - 12 * mm, 31 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#0d3347"))
    canvas.circle(10 * mm, 18 * mm, 34 * mm, stroke=0, fill=1)
    canvas.setFillColor(MUTED)
    canvas.setFont(FONT, 7)
    canvas.drawRightString(PAGE_W - 15 * mm, 9 * mm, f"Maksym Prysiazhnikov CV | Page {doc.page}")
    canvas.restoreState()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
        title="Maksym Prysiazhnikov CV",
        author="Maksym Prysiazhnikov",
        subject="Junior DevOps Engineer and Cloud Specialist resume",
        keywords=", ".join(["DevOps", "Cloud", *SKILLS]),
    )
    doc.build(build_story(), onFirstPage=draw_page_background, onLaterPages=draw_page_background)

    temp_photo = OUTPUT.with_suffix(".photo.jpg")
    if temp_photo.exists():
        temp_photo.unlink()

    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    main()
