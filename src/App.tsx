import { useEffect } from "react";
import "./App.css";

function App() {
    useEffect(() => {
        // Smooth Scroll
        const handleLinkClick = (e: Event) => {
            const a = e.currentTarget as HTMLAnchorElement;
            const id = a.getAttribute("href");
            if (id && id.startsWith("#") && id.length > 1) {
                e.preventDefault();
                document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
            }
        };
        document.querySelectorAll('a[href^="#"]').forEach(a =>
            a.addEventListener("click", handleLinkClick)
        );

        // Theme Toggle
        const root = document.documentElement;
        const toggle = document.getElementById("themeToggle");
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) root.classList.add(savedTheme);
        toggle?.addEventListener("click", () => {
            const dark = root.classList.toggle("theme-dark");
            root.classList.toggle("theme-light", !dark);
            localStorage.setItem("theme", dark ? "theme-dark" : "theme-light");
        });

        // Scroll Progress
        const progress = document.querySelector(".progress") as HTMLElement;
        const setProgress = () => {
            const h = document.documentElement;
            const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
            progress.style.width = scrolled * 100 + "%";
        };
        document.addEventListener("scroll", setProgress, { passive: true });
        setProgress();

        // Reveal on Scroll
        const revealEls = document.querySelectorAll(".reveal");
        const io = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealEls.forEach(el => io.observe(el));

        // Skill Bars
        const bars = document.querySelectorAll(".bar");
        const barIO = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target as HTMLElement;
                        const pct = bar.getAttribute("data-pct");
                        bar.animate(
                            [{ width: "0%" }, { width: pct + "%" }],
                            {
                                duration: 900,
                                easing: "cubic-bezier(.3,.7,.4,1)",
                                fill: "forwards",
                            }
                        );
                        barIO.unobserve(bar);
                    }
                });
            },
            { threshold: 0.4 }
        );
        bars.forEach(b => barIO.observe(b));

        // 3D Tilt
        const tilts = document.querySelectorAll(".tilt");
        const maxTilt = 10;
        function handleMove(this: HTMLElement, e: MouseEvent) {
            const r = this.getBoundingClientRect();
            const cx = r.left + r.width / 2,
                cy = r.top + r.height / 2;
            const dx = (e.clientX - cx) / (r.width / 2);
            const dy = (e.clientY - cy) / (r.height / 2);
            this.style.transform = `rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt
                }deg)`;
        }
        function resetTilt(this: HTMLElement) {
            this.style.transform = "rotateY(0) rotateX(0)";
        }
        tilts.forEach(t => {
            t.addEventListener("mousemove", handleMove as any);
            t.addEventListener("mouseleave", resetTilt as any);
        });

        // Contact form
        const form = document.getElementById("contactForm") as HTMLFormElement;
        const statusEl = document.getElementById("formStatus") as HTMLElement;
        form?.addEventListener("submit", e => {
            e.preventDefault();
            statusEl.style.display = "inline-flex";
            statusEl.textContent = "Sending…";
            setTimeout(() => {
                statusEl.textContent = "Thanks! I’ll get back to you shortly.";
            }, 800);
        });

        // Copy Email
        const copyEmail = document.getElementById("copyEmail");
        copyEmail?.addEventListener("click", async e => {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText("anand@example.com");
                copyEmail.textContent = "📋 Copied email to clipboard!";
                setTimeout(() => {
                    copyEmail.textContent = "📧 anand@example.com";
                }, 1600);
            } catch { }
        });

        // Footer Year
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

        return () => {
            document
                .querySelectorAll('a[href^="#"]')
                .forEach(a => a.removeEventListener("click", handleLinkClick));
        };
    }, []);

    return (
        <div>
            <div className="progress" aria-hidden="true"></div>
            <header>
                <div className="container">
                    <nav>
                        <div className="brand">
                            <div className="logo" aria-hidden="true"></div>
                            <span>AR • Software Engineer</span>
                        </div>
                        <div className="nav-links" role="navigation" aria-label="Primary">
                            <a href="#about">About</a>
                            <a href="#skills">Skills</a>
                            <a href="#projects">Projects</a>
                            <a href="#experience">Experience</a>
                            <a href="#contact">Contact</a>
                            <button
                                className="theme-toggle"
                                id="themeToggle"
                                aria-label="Toggle theme"
                            >
                                🌓
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section className="hero container" id="home">
                    <div className="hero-grid">
                        <div>
                            <h1 className="title reveal">Hi, I'm <span className="grad">Anand Raghunathan</span>.</h1>
                            <p className="subtitle reveal">Senior Software Engineer crafting fast, accessible web apps with delightful UX. I turn complex requirements into elegant, production-grade solutions.</p>
                            <div className="hero-cta reveal" style={{ animationDelay: ".08s" }}>
                                <a className="btn" href="#projects">View Projects</a>
                                <a className="btn ghost" href="#contact">Contact Me</a>
                                <a className="btn ghost" href="resume.pdf" download>⬇️ Download Résumé</a>
                            </div>
                        </div>
                        <div className="portrait tilt" aria-label="Abstract portrait placeholder">
                            <div className="initials" aria-hidden="true">AR</div>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section id="about">
                    <div className="container">
                        <h2>About</h2>
                        <div className="card reveal" style={{ padding: 18 }}>
                            <p className="lead">I build modern frontends and resilient backends. My specialities include <strong>React</strong>, <strong>TypeScript</strong>, <strong>Node</strong>, <strong>GraphQL</strong>, and <strong>cloud</strong>.
                                I care deeply about performance, accessibility, and developer experience.
                            </p>
                            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: 12 }}>
                                <span className="tag">TypeScript</span>
                                <span className="tag">React</span>
                                <span className="tag">Node.js</span>
                                <span className="tag">Next.js</span>
                                <span className="tag">GraphQL</span>
                                <span className="tag">Postgres</span>
                                <span className="tag">AWS</span>
                                <span className="tag">CI/CD</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section id="skills">
                    <div className="container">
                        <h2>Skills</h2>
                        <div className="skills">
                            <div className="skill card reveal">
                                <div className="row"><strong>TypeScript</strong><span aria-label="proficiency">90%</span></div>
                                <div className="meter"><div className="bar" data-pct="90"></div></div>
                            </div>
                            <div className="skill card reveal">
                                <div className="row"><strong>React</strong><span>90%</span></div>
                                <div className="meter"><div className="bar" data-pct="90"></div></div>
                            </div>
                            <div className="skill card reveal">
                                <div className="row"><strong>Node.js</strong><span>85%</span></div>
                                <div className="meter"><div className="bar" data-pct="85"></div></div>
                            </div>
                            <div className="skill card reveal">
                                <div className="row"><strong>GraphQL</strong><span>80%</span></div>
                                <div className="meter"><div className="bar" data-pct="80"></div></div>
                            </div>
                            <div className="skill card reveal">
                                <div className="row"><strong>Performance</strong><span>88%</span></div>
                                <div className="meter"><div className="bar" data-pct="88"></div></div>
                            </div>
                            <div className="skill card reveal">
                                <div className="row"><strong>Cloud & CI/CD</strong><span>82%</span></div>
                                <div className="meter"><div className="bar" data-pct="82"></div></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section id="projects">
                    <div className="container">
                        <h2>Featured Projects</h2>
                        <p className="lead">A few things I've shipped recently. Hover for a 3D tilt and click to learn more.</p>

                        <div className="grid" role="list">
                            <article className="project card tilt reveal" role="listitem" tabIndex={0}>
                                <div className="thumb">Realtime Dashboard</div>
                                <div className="content">
                                    <h3>Telemetry Control Center</h3>
                                    <p>Low-latency charts and alerts for IoT fleets using WebSockets and React Server Components.</p>
                                    <div className="links">
                                        <a className="btn ghost" href="#" aria-label="Live demo for Telemetry Control Center">Live</a>
                                        <a className="btn ghost" href="#" aria-label="Source code for Telemetry Control Center">Code</a>
                                    </div>
                                </div>
                            </article>

                            <article className="project card tilt reveal" role="listitem" tabIndex={0}>
                                <div className="thumb">AI Docs Q&A</div>
                                <div className="content">
                                    <h3>DocsGPT</h3>
                                    <p>RAG-powered knowledge base with embeddings, semantic search, and chat UX.</p>
                                    <div className="links">
                                        <a className="btn ghost" href="#">Live</a>
                                        <a className="btn ghost" href="#">Code</a>
                                    </div>
                                </div>
                            </article>

                            <article className="project card tilt reveal" role="listitem" tabIndex={0}>
                                <div className="thumb">Payments Platform</div>
                                <div className="content">
                                    <h3>Checkout Engine</h3>
                                    <p>Full-stack payments with PCI-safe tokenization, webhooks, and fraud signals.</p>
                                    <div className="links">
                                        <a className="btn ghost" href="#">Live</a>
                                        <a className="btn ghost" href="#">Code</a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Experience */}
                <section id="experience">
                    <div className="container">
                        <h2>Experience</h2>
                        <ol className="timeline" aria-label="Career timeline">
                            <li className="t-item card reveal" style={{ padding: 16, listStyle: "none" }}>
                                <div className="t-dot" aria-hidden="true"></div>
                                <strong>Senior Software Engineer — Acme Corp</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>2022 — Present</div>
                                <ul>
                                    <li>Led migration to TypeScript and improved CI/CD, cutting defects by 30% and deploy time by 50%.</li>
                                    <li>Built micro-frontend architecture enabling independent deployments across 6 teams.</li>
                                </ul>
                            </li>
                            <li className="t-item card reveal" style={{ padding: 16, listStyle: "none" }}>
                                <div className="t-dot" aria-hidden="true"></div>
                                <strong>Software Engineer — Beta Systems</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>2019 — 2022</div>
                                <ul>
                                    <li>Shipped React + GraphQL platform serving 1M+ monthly users at sub-200ms p95.</li>
                                    <li>Introduced bundle splitting & SSR, reducing TTI by 42%.</li>
                                </ul>
                            </li>
                            <li className="t-item card reveal" style={{ padding: 16, listStyle: "none" }}>
                                <div className="t-dot" aria-hidden="true"></div>
                                <strong>Intern — Gamma Labs</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>2018 — 2019</div>
                                <ul>
                                    <li>Built internal tooling and developer dashboards; automated releases with GitHub Actions.</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact">
                    <div className="container">
                        <h2>Contact</h2>
                        <div className="contact">
                            <div className="card reveal">
                                <form id="contactForm" aria-label="Contact form" noValidate>
                                    <div className="field">
                                        <label htmlFor="name">Name</label>
                                        <input id="name" name="name" placeholder="Your name" required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" name="email" type="email" placeholder="you@example.com" required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="msg">Message</label>
                                        <textarea id="msg" name="message" rows={5} placeholder="Tell me about your project…" required></textarea>
                                    </div>
                                    <div style={{ display: "flex", gap: ".6rem", alignItems: "center", marginTop: 8 }}>
                                        <button className="btn" type="submit">Send Message</button>
                                        <span id="formStatus" className="tag" role="status" aria-live="polite" style={{ display: "none" }}></span>
                                    </div>
                                </form>
                            </div>

                            <div className="card reveal">
                                <h3 style={{ marginTop: 0 }}>Elsewhere</h3>
                                <p className="lead">I'm active on the platforms below. For the fastest reply, email me.</p>
                                <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", margin: ".6rem 0 1rem" }}>
                                    <a className="btn ghost" href="mailto:anand@example.com" id="copyEmail">📧 anand@example.com</a>
                                    <a className="btn ghost" href="https://www.linkedin.com/in/your-handle/" target="_blank" rel="noopener">LinkedIn</a>
                                    <a className="btn ghost" href="https://github.com/your-handle" target="_blank" rel="noopener">GitHub</a>
                                    <a className="btn ghost" href="#">Twitter/X</a>
                                </div>
                                <div className="card" style={{ padding: 12, background: "var(--card-2)", borderRadius: 12 }}>
                                    <strong>Based in:</strong> Bengaluru, India 🇮🇳<br />
                                    <strong>Open to:</strong> Full-time • Remote • Consulting
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <div className="container">
                    © <span id="year"></span> Anand Raghunathan. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default App;
