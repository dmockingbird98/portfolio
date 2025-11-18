import { useEffect, useState } from "react";
import "./App.css";
import resume from "./assets/Anand_Raghunathan_Resume.pdf";
import photo from "./assets/Anand_photo_unofficial_edited.jpg";

function App() {
    const [year] = useState<number>(new Date().getFullYear());
    const [theme, setTheme] = useState<'theme-dark' | 'theme-light'>(() => {
        try {
            const saved = localStorage.getItem("theme");
            if (saved === "theme-dark" || saved === "theme-light") return saved;
            return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
                ? "theme-light"
                : "theme-dark";
        } catch {
            return "theme-dark";
        }
    });

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

        // Theme handled via React state (see separate effect below)

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
            { threshold: 0.01 }
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
                    copyEmail.textContent = "✉️ E-Mail";
                }, 1600);
            } catch { }
        });

        return () => {
            document
                .querySelectorAll('a[href^="#"]')
                .forEach(a => a.removeEventListener("click", handleLinkClick));
        };
    }, []);

    // Apply theme class to <html> whenever `theme` changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("theme-dark", "theme-light");
        root.classList.add(theme);
        try {
            localStorage.setItem("theme", theme);
        } catch { }
        return () => {
            root.classList.remove("theme-dark", "theme-light");
        };
    }, [theme]);

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
                                onClick={() => setTheme(prev => prev === 'theme-dark' ? 'theme-light' : 'theme-dark')}
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
                                <a className="btn ghost" href={resume} download>Download Résumé</a>
                            </div>
                        </div>
                        <div className="portrait tilt portrait-with-photo" aria-label="Portrait of Anand Raghunathan">
                            <img src={photo} alt="Anand Raghunathan" className="portrait-img" />
                            <div className="initials portrait-watermark" aria-hidden="true">AR</div>
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

                        <div style={{ position: "relative" }}>
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
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "8px", pointerEvents: "none" }}>
                                <div style={{ padding: "2rem", backgroundColor: "var(--card-2)", borderRadius: "8px", border: "2px solid var(--accent)", textAlign: "center" }}>
                                    <p style={{ margin: 0, fontSize: "1.3em", fontWeight: "600", color: "var(--text)" }}>🚀 More projects coming soon...</p>
                                </div>
                            </div>
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
                                <strong>Programming Analyst — The Boeing Company</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>May 2023 — Present</div>
                                <ul>
                                    <li>Implemented cross-site script injection logic using Javascript and Jquery. Reduced Code redundancy and rework of around 400%</li>
                                    <li>Played a pivotal role in managing and implementing Next-Gen features, gathering requirements and collaborating with many other cross-functional teams of over 300 members</li>
                                </ul>
                                <strong>Software Engineer — UI</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>Jun 2022 — May 2023</div>
                                <ul>
                                    <li>Developed customizable Angular & Spartacus components for e-commerce platforms, achieving 90%+ user satisfaction and generating $200M+ in revenue.</li>
                                    <li>Engineered Spartacus migration from legacy code, reducing deployment time by 50% and downtime by 70%.</li>
                                    <li>Implemented SSJS and AMPscript Salesforce forms, improving form efficiency by 50%.</li>
                                </ul>
                            </li>
                            <li className="t-item card reveal" style={{ padding: 16, listStyle: "none" }}>
                                <div className="t-dot" aria-hidden="true"></div>
                                <strong>Senior Software Engineer — Vanilla Networks</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>Dec 2020 — May 2022</div>
                                <ul>
                                    <li>Built high-performance React + TypeScript query builder application, processing 200K+ data records with interactive charts.</li>
                                    <li>Developed real-time sensor visualization POC, reducing API load and loading time from 10+ minutes to under 5 seconds.</li>
                                    <li>Created multi-step form MVP for event tracking and reporting, mitigating 7+ major incidents within launch week.</li>
                                </ul>
                            </li>
                            <li className="t-item card reveal" style={{ padding: 16, listStyle: "none" }}>
                                <div className="t-dot" aria-hidden="true"></div>
                                <strong>Software Engineer — Attinad Software Pvt. Ltd.</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>Dec 2019 — Nov 2020</div>
                                <ul>
                                    <li>Designed recursive React components for infinite hierarchy data models using React, TypeScript, Redux, and Redux Thunk.</li>
                                    <li>Optimized sophisticated chart feature for visualizing multiple datasets over extended time periods.</li>
                                </ul>
                            </li>
                            <li className="t-item card reveal" style={{ padding: 16, listStyle: "none" }}>
                                <div className="t-dot" aria-hidden="true"></div>
                                <strong>Automation Engineer (Trainee) — SMEC Automation Pvt Ltd</strong>
                                <div className="muted" style={{ color: "var(--muted)" }}>Sep 2019 — Nov 2019</div>
                                <ul>
                                    <li>Engineered automation solutions using PLCs, DCSs, SCADA, and HMIs from ABB, Schneider Electric, GE, and Yokogawa.</li>
                                    <li>Automated real-world applications including traffic lights and elevators, achieving 30%+ efficiency improvements.</li>
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
                                    <a className="btn ghost" href="mailto:anand.raghu98@gmail.com" id="copyEmail">✉️ E-Mail</a>
                                    <a className="btn ghost" href="www.linkedin.com/in/anand-raghunathan" target="_blank" rel="noopener">💼 LinkedIn</a>
                                    <a className="btn ghost" href="https://github.com/dmockingbird98" target="_blank" rel="noopener">🐙 GitHub</a>
                                </div>
                                <div className="card" style={{ padding: 12, background: "var(--card-2)", borderRadius: 12 }}>
                                    <strong>Based in:</strong> Bengaluru, India <svg style={{ display: "inline-block", width: "1.2em", height: "0.8em", marginLeft: "0.3em", verticalAlign: "middle" }} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="900" height="200" fill="#FF9933"/>
                                        <rect y="200" width="900" height="200" fill="#FFFFFF"/>
                                        <rect y="400" width="900" height="200" fill="#138808"/>
                                        <circle cx="450" cy="300" r="60" fill="#000080"/>
                                        <text x="450" y="315" textAnchor="middle" fontSize="90" fill="#000080" fontWeight="bold">☸</text>
                                    </svg> <br />
                                    <strong>Open to:</strong> Full-time • Remote • Consulting
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <div className="container">
                    © <span>{year}</span> Anand Raghunathan. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default App;
