import { DigitalTwinChat } from "@/components/digital-twin-chat";

export default function Home() {
  const coreCapabilities = [
    "Machine Learning & Deep Learning",
    "Computer Vision & Applied AI",
    "Python, SQL, Java, FastAPI, Flask",
    "MLOps with Docker and AWS",
    "LLM Pipelines and NLP Systems",
    "Data Mining, SHAP, and Analytics",
  ];

  const journey = [
    {
      role: "AI and Control System Developer",
      company: "Australian Wildlife Conservancy",
      period: "Aug 2024 - Dec 2024",
      impact:
        "Designed and implemented a smart-gate ecosystem for wildlife conservation with real-time control software and AI-assisted species recognition.",
      highlights: [
        "Co-developed IoT signal reception circuitry for reliable field data intake.",
        "Deployed CNN-based classification for automated species monitoring.",
        "Built Python control logic for configurable monitoring and gate behavior.",
      ],
    },
    {
      role: "Software Developer / Machine Learning Intern",
      company: "Neorise",
      period: "Sep 2023 - Feb 2024",
      impact:
        "Helped create an emotion-aware AI stack that combined audio understanding with LLM steering for more natural user interactions.",
      highlights: [
        "Implemented an emotion classifier leveraging transformer-based Wave2Vec.",
        "Developed an LLM training pipeline inspired by NVIDIA SteerLM methods.",
        "Containerized microservices with Docker and deployed to AWS.",
      ],
    },
    {
      role: "Sessional Academic",
      company: "Curtin University",
      period: "Feb 2022 - Present",
      impact:
        "Mentored students across programming, algorithms, machine learning, and machine perception while sharpening practical AI delivery skills.",
      highlights: [
        "Taught Python, PyTorch, and algorithmic problem-solving at scale.",
        "Led tutorials spanning data structures, neural networks, and vision.",
        "Supported exam invigilation and technical assessment workflows.",
      ],
    },
  ];

  const featuredWork = [
    {
      title: "Reinforcement Learning Stock Agent",
      detail:
        "Built and evaluated a Deep-Q trading system against randomized baselines in dynamic market simulations.",
      stack: "Python, PyTorch, OpenAI Gym",
    },
    {
      title: "Multi-Task BLEVE Prediction",
      detail:
        "Predicted multiple explosion-related targets with tree ensembles and neural models, then interpreted results using SHAP.",
      stack: "Scikit-Learn, PyTorch, SHAP",
    },
    {
      title: "Wildlife Intruder Detection",
      detail:
        "Created and deployed a CNN system for real-time classification on edge hardware for conservation use cases.",
      stack: "TensorFlow, Jetson Nano, Raspberry Pi",
    },
  ];

  const portfolioRoadmap = [
    "AI products and end-to-end deployments",
    "MLOps architecture case studies",
    "Interactive data science and analytics demos",
  ];

  const snapshotStats = [
    { label: "Years in Academic Mentoring", value: "5+" },
    { label: "AI/ML Domains Delivered", value: "6+" },
    { label: "Cloud and Deployment Focus", value: "AWS + Docker" },
  ];

  const credentials = [
    "Master of Predictive Analytics - Curtin University",
    "Bachelor of Mechanical Engineering (Honours) - Curtin University",
    "Machine Learning, Deep Learning, and Generative AI certifications",
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.18),transparent_24%),radial-gradient(circle_at_50%_75%,rgba(15,23,42,0.95),transparent_60%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-4 md:px-10">
          <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300">
            TAN BUI
          </p>
          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <a className="transition hover:text-cyan-300" href="#about">
              About
            </a>
            <a className="transition hover:text-cyan-300" href="#journey">
              Journey
            </a>
            <a className="transition hover:text-cyan-300" href="#work">
              Work
            </a>
            <a className="transition hover:text-cyan-300" href="#credentials">
              Credentials
            </a>
            <a className="transition hover:text-cyan-300" href="#digital-twin">
              Digital Twin
            </a>
            <a className="transition hover:text-cyan-300" href="#portfolio">
              Portfolio
            </a>
          </nav>
          </div>
          <nav className="mt-3 flex items-center gap-4 overflow-x-auto pb-1 text-xs text-slate-300 md:hidden">
            <a className="whitespace-nowrap transition hover:text-cyan-300" href="#about">
              About
            </a>
            <a className="whitespace-nowrap transition hover:text-cyan-300" href="#journey">
              Journey
            </a>
            <a className="whitespace-nowrap transition hover:text-cyan-300" href="#work">
              Work
            </a>
            <a className="whitespace-nowrap transition hover:text-cyan-300" href="#credentials">
              Credentials
            </a>
            <a className="whitespace-nowrap transition hover:text-cyan-300" href="#digital-twin">
              Digital Twin
            </a>
            <a className="whitespace-nowrap transition hover:text-cyan-300" href="#portfolio">
              Portfolio
            </a>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 pb-18 pt-14 md:px-10 md:pt-20">
        <section className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            <p className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-1 text-xs font-medium tracking-wider text-cyan-200">
              MACHINE LEARNING ENGINEER | AI DEVELOPER
            </p>
            <h1 className="max-w-2xl text-4xl leading-tight font-bold text-white md:text-6xl">
              Enterprise-grade AI thinking with an edgy, product-first mindset.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
              I am Tan Bui, a Master of Predictive Analytics graduate and
              software developer building practical AI systems that perform in
              real environments. I connect deep technical work with business
              outcomes across machine learning, computer vision, and modern
              cloud deployments.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-full border border-cyan-300/45 bg-cyan-300/15 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/25"
                href="mailto:minhtanbuinguyen@gmail.com"
              >
                Contact Me
              </a>
              <a
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:text-cyan-200"
                href="https://www.linkedin.com/in/tanbui1302/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:text-cyan-200"
                href="https://github.com/TanSento"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:text-cyan-200"
                href="/TanBui_Resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {snapshotStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3"
                >
                  <p className="text-xl font-semibold text-cyan-200">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/14 to-white/6 p-6 shadow-2xl shadow-cyan-950/45 backdrop-blur">
            <p className="text-sm font-semibold text-cyan-200">
              Core Capabilities
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {coreCapabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-cyan-100/20 bg-slate-900/80 px-3 py-1 text-xs text-slate-200"
                >
                  {capability}
                </span>
              ))}
            </div>
            <dl className="mt-7 space-y-5">
              <div>
                <dt className="text-xs tracking-widest text-slate-400 uppercase">
                  Base
                </dt>
                <dd className="mt-1 text-sm text-slate-100">
                  Greater Perth, Western Australia
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-widest text-slate-400 uppercase">
                  Languages
                </dt>
                <dd className="mt-1 text-sm text-slate-100">
                  English (professional), Vietnamese (native)
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-widest text-slate-400 uppercase">
                  Contact
                </dt>
                <dd className="mt-1 text-sm text-slate-100">
                  +61 424 473 234
                  <br />
                  minhtanbuinguyen@gmail.com
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        <section id="about" className="rounded-3xl border border-white/12 bg-white/[0.04] p-7 backdrop-blur md:p-10">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            About Me
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-slate-300 md:text-lg">
            My career focus sits at the intersection of AI research, engineering
            delivery, and real-world impact. From deep learning systems for
            wildlife protection to emotion-aware AI product pipelines, I enjoy
            turning complex ideas into dependable software. I bring strong
            foundations in machine learning, computer vision, and data science,
            together with clear communication developed through years of
            teaching and collaboration in multidisciplinary teams.
          </p>
        </section>

        <section id="journey">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Career Journey
          </h2>
          <div className="mt-6 space-y-5 border-l border-cyan-300/30 pl-6">
            {journey.map((item) => (
              <article
                key={`${item.company}-${item.role}`}
                className="relative rounded-2xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur"
              >
                <span className="absolute -left-[35px] top-8 h-3 w-3 rounded-full border border-cyan-200 bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.9)]" />
                <p className="text-xs font-medium tracking-wide text-cyan-200 uppercase">
                  {item.period}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {item.role}
                </h3>
                <p className="text-sm text-slate-300">{item.company}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-200">
                  {item.impact}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="work">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Selected Projects
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredWork.map((project) => (
              <article
                key={project.title}
                className="rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <h3 className="text-lg font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {project.detail}
                </p>
                <p className="mt-5 text-xs tracking-wider text-cyan-200 uppercase">
                  {project.stack}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="credentials" className="rounded-3xl border border-white/12 bg-white/[0.04] p-7 md:p-10">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Education and Credentials
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {credentials.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-white/12 bg-slate-900/60 p-5 text-sm text-slate-200"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section
          id="digital-twin"
          className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.08] to-violet-400/[0.08] p-7 md:p-10"
        >
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Ask My Digital Twin
          </h2>
          <p className="mt-4 max-w-3xl text-slate-200">
            Have a live AI conversation about my experience, technical strengths,
            and project history. This chat is purpose-built as a professional
            career copilot for recruiters, hiring managers, and collaborators.
          </p>
          <div className="mt-6">
            <DigitalTwinChat />
          </div>
        </section>

        <section
          id="portfolio"
          className="rounded-3xl border border-cyan-300/20 bg-cyan-500/[0.06] p-7 md:p-10"
        >
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Portfolio Hub (Launching Soon)
          </h2>
          <p className="mt-4 max-w-3xl text-slate-200">
            This space is reserved for deep case studies, architecture
            breakdowns, and deployable product demos. The next iteration will
            include end-to-end build narratives and measurable outcomes.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {portfolioRoadmap.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-cyan-100/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-10">
          <p>Tan Bui - Machine Learning Enthusiast and AI Developer</p>
          <p>
            Built with Next.js. Designed for a modern, enterprise-ready personal
            brand.
          </p>
        </div>
      </footer>
    </div>
  );
}
