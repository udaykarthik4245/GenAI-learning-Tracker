import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ListChecks, Search, Upload, Download, RefreshCcw, BookOpen, GraduationCap, Rocket, Layers, LineChart, Palette, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/***********************************
 * GenAI 6‑Month Planner & Tracker
 * Single‑file React component
 * - Tailwind + shadcn/ui
 * - LocalStorage persistence
 * - Export/Import JSON
 * - Search + Month filter
 * - Certificates tracker
 ***********************************/

/*****************
 * TYPES
 *****************/
interface WeekPlan {
  id: string;
  month: number; // 1..6
  title: string;
  icon: "foundation" | "decision" | "agents" | "projects" | "finetune" | "deploy" | "diffusion" | "leadership";
  concepts: string[];
  tasks: string[];
  milestone: string;
  courses?: { name: string; url: string }[];
}

interface CertificateItem {
  name: string;
  platform: string;
  url: string;
}

/*****************
 * DATA — 24 Weeks
 *****************/
const PLAN: WeekPlan[] = [
  // Month 1 — Foundations
  {
    id: "w1",
    month: 1,
    title: "Week 1 — Python + ML Refresh",
    icon: "foundation",
    concepts: [
      "Python essentials for ML (typing, venv/conda, pathlib, pytest)",
      "NumPy, Pandas, Matplotlib quick recap",
      "ML basics: bias/variance, train/val/test, metrics",
    ],
    tasks: [
      "Set up dev env; verify GPU/CUDA if available",
      "Implement linear vs logistic regression on a toy dataset",
      "Write 5 unit tests for data utilities",
    ],
    courses: [
      { name: "Great Learning — Python for ML (Free)", url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/python-for-machine-learning" },
      { name: "Udemy — Machine Learning A–Z (Paid)", url: "https://www.udemy.com/course/machinelearning/" },
    ],
    milestone: "Repo skeleton + utilities notebook committed",
  },
  {
    id: "w2",
    month: 1,
    title: "Week 2 — Deep Learning & Transformers 101",
    icon: "foundation",
    concepts: [
      "Neural nets, backprop, optimizers, regularization",
      "Attention mechanism & Transformer architecture",
      "Tokenization, embeddings, context length",
    ],
    tasks: [
      "Build a tiny Transformer block (PyTorch) on dummy data",
      "Compare BPE vs WordPiece tokenization (HF tokenizers)",
      "Write a 1‑page summary of attention (with equations)",
    ],
    courses: [
      { name: "DeepLearning.AI — Intro to GenAI (Free)", url: "https://www.deeplearning.ai/short-courses/" },
      { name: "Udemy — Transformers & Attention (Paid)", url: "https://www.udemy.com/course/transformers-and-attention/" },
    ],
    milestone: "Transformer toy demo notebook",
  },
  {
    id: "w3",
    month: 1,
    title: "Week 3 — LLMs & Prompting Basics",
    icon: "foundation",
    concepts: [
      "LLM families (GPT, Llama, Mistral, Claude)",
      "Prompt patterns: role, few‑shot, structured output",
      "Safety, ethics, evaluation basics",
    ],
    tasks: [
      "Create a prompt library (JSON) with 10 reusable patterns",
      "Design an evaluation rubric for responses",
      "Run a prompt A/B test and log outcomes",
    ],
    courses: [
      { name: "DeepLearning.AI — ChatGPT Prompt Engineering (Free)", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
    ],
    milestone: "Prompt kit + eval rubric committed",
  },
  {
    id: "w4",
    month: 1,
    title: "Week 4 — RAG Fundamentals",
    icon: "foundation",
    concepts: ["Embeddings & vector search", "Chunking strategies", "Latency/cost trade‑offs"],
    tasks: [
      "Build a minimal RAG with Chroma/FAISS on PDFs",
      "Experiment with chunk sizes 256/512/1024 and compare hit‑rate",
      "Write postmortem: retrieval quality vs speed",
    ],
    courses: [
      { name: "Pinecone — RAG 101 (Free docs)", url: "https://docs.pinecone.io/docs/intro-to-rag" },
      { name: "Cohere — RAG Cookbook (Free)", url: "https://txt.cohere.com/rag/" },
    ],
    milestone: "Minimal RAG demo",
  },

  // Month 2 — Decision‑Making & Agents
  {
    id: "w5",
    month: 2,
    title: "Week 5 — RL & Decision Basics",
    icon: "decision",
    concepts: ["MDPs, policies, value functions", "Intro to RLHF & DPO (conceptual)", "When to use RL in GenAI"],
    tasks: [
      "Implement a tiny multi‑armed bandit simulation",
      "Summarize one RLHF paper",
      "Document risks of reward hacking in agents",
    ],
    courses: [
      { name: "Spinning Up in Deep RL (Free)", url: "https://spinningup.openai.com/en/latest/" },
    ],
    milestone: "Bandit sim + notes",
  },
  {
    id: "w6",
    month: 2,
    title: "Week 6 — Agent Frameworks Overview",
    icon: "agents",
    concepts: ["LangChain vs LangGraph vs AutoGen vs CrewAI", "Tool calling, memory, planning", "Routing & guardrails"],
    tasks: [
      "Hello‑world agent with tool‑calling (search, calculator)",
      "Add short‑term memory store",
      "Write design notes: framework trade‑offs",
    ],
    courses: [
      { name: "LangChain Docs (Free)", url: "https://python.langchain.com/" },
      { name: "CrewAI Docs (Free)", url: "https://docs.crewai.com/" },
    ],
    milestone: "Agent starter repo",
  },
  {
    id: "w7",
    month: 2,
    title: "Week 7 — LangGraph Deep Dive",
    icon: "agents",
    concepts: ["Graph state machines", "Branches, retries, timeouts", "Observability hooks"],
    tasks: [
      "Build a 3‑node plan → act → reflect agent",
      "Add retries + metrics logging",
      "Record a 2‑min demo",
    ],
    courses: [
      { name: "LangGraph Docs (Free)", url: "https://langchain-ai.github.io/langgraph/" },
    ],
    milestone: "LangGraph agent v1",
  },
  {
    id: "w8",
    month: 2,
    title: "Week 8 — Multi‑Agent (AutoGen/CrewAI)",
    icon: "agents",
    concepts: ["Role‑specialized agents & coordination", "Task decomposition & handoffs", "Failure handling"],
    tasks: [
      "Build researcher ↔ writer multi‑agent system",
      "Add tool‑use: web search + RAG store",
      "Write incident runbook for stuck loops",
    ],
    courses: [
      { name: "AutoGen Docs (Free)", url: "https://microsoft.github.io/autogen/" },
      { name: "CrewAI Tutorials (Free)", url: "https://docs.crewai.com/category/tutorials" },
    ],
    milestone: "Multi‑agent demo",
  },

  // Month 3 — Real‑World Projects
  {
    id: "w9",
    month: 3,
    title: "Week 9 — Project 1: Research Assistant",
    icon: "projects",
    concepts: ["Scoping, UX, data flow", "Caching prompts", "Prompt safety"],
    tasks: [
      "Plan features + wireframe",
      "Implement core research workflow",
      "Add citations + note‑taking",
    ],
    courses: [
      { name: "OpenAI Function Calling (Free docs)", url: "https://platform.openai.com/docs/guides/function-calling" },
    ],
    milestone: "P1 core complete",
  },
  {
    id: "w10",
    month: 3,
    title: "Week 10 — P1: Quality & Eval",
    icon: "projects",
    concepts: ["Offline eval sets", "Hallucination checks", "Guardrails"],
    tasks: [
      "Create 30 eval questions",
      "Add refusal/safety checks",
      "Automate nightly eval run",
    ],
    courses: [
      { name: "Guardrails.ai (Free)", url: "https://www.guardrailsai.com/" },
    ],
    milestone: "P1 evaluated",
  },
  {
    id: "w11",
    month: 3,
    title: "Week 11 — Project 2: Code Reviewer Bot",
    icon: "projects",
    concepts: ["AST parsing", "Context windows", "Diff‑aware prompts"],
    tasks: [
      "Implement repo fetch + diff summarizer",
      "Inline comments via CLI or PR API (mock if needed)",
      "Add test fixtures",
    ],
    courses: [
      { name: "GitHub API Docs (Free)", url: "https://docs.github.com/en/rest" },
    ],
    milestone: "P2 core complete",
  },
  {
    id: "w12",
    month: 3,
    title: "Week 12 — P2: Metrics & Docs",
    icon: "projects",
    concepts: ["Latency budgeting", "Token costs", "DX docs"],
    tasks: [
      "Add simple tracing + timing",
      "Create cost dashboard (per run)",
      "Write README + demo GIFs",
    ],
    courses: [
      { name: "OpenTelemetry (Free)", url: "https://opentelemetry.io/docs/" },
    ],
    milestone: "P2 documented",
  },

  // Month 4 — Fine‑tuning & RAG+FT Apps
  {
    id: "w13",
    month: 4,
    title: "Week 13 — Fine‑tuning Basics (LoRA/QLoRA)",
    icon: "finetune",
    concepts: ["PEFT/LoRA", "Adapters", "Data quality"],
    tasks: ["Prepare domain dataset", "Train LoRA on a small model", "Log runs (W&B)"] ,
    courses: [
      { name: "Hugging Face — PEFT/LoRA (Free)", url: "https://huggingface.co/docs/peft/index" },
      { name: "W&B — Experiment Tracking (Free)", url: "https://docs.wandb.ai/" },
    ],
    milestone: "FT experiment v1",
  },
  {
    id: "w14",
    month: 4,
    title: "Week 14 — RAG + FT Integration",
    icon: "finetune",
    concepts: ["Hybrid systems", "Router prompts", "Eval"],
    tasks: ["Plug LoRA model into RAG", "Benchmark against base model", "Write eval report"],
    courses: [
      { name: "LlamaIndex — RAG (Free)", url: "https://docs.llamaindex.ai/" },
    ],
    milestone: "RAG+FT prototype",
  },
  {
    id: "w15",
    month: 4,
    title: "Week 15 — Domain Chatbot App",
    icon: "finetune",
    concepts: ["Session memory", "Feedback loops", "Cold start"],
    tasks: ["Build chatbot API (FastAPI)", "Add thumbs‑up/down feedback store", "Capture top failed queries"],
    courses: [
      { name: "FastAPI Docs (Free)", url: "https://fastapi.tiangolo.com/" },
      { name: "Udemy — FastAPI (Paid)", url: "https://www.udemy.com/course/fastapi-the-complete-course/" },
    ],
    milestone: "Domain bot MVP",
  },
  {
    id: "w16",
    month: 4,
    title: "Week 16 — Evaluation & Hardening",
    icon: "finetune",
    concepts: ["Robustness", "Prompt injection", "PII handling"],
    tasks: ["Red‑team prompts + fixes", "Pydantic schema validation", "Write SLA: latency, uptime, fallback"],
    courses: [
      { name: "OWASP LLM Top 10 (Free)", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" },
    ],
    milestone: "Bot hardened",
  },

  // Month 5 — Deploy & Diffusion
  {
    id: "w17",
    month: 5,
    title: "Week 17 — Serving & Containerization",
    icon: "deploy",
    concepts: ["Docker", "vLLM/Ollama", "GPU vs CPU"],
    tasks: ["Containerize API", "Serve model with vLLM or Ollama", "Health checks + graceful shutdown"],
    courses: [
      { name: "Docker — Getting Started (Free)", url: "https://docs.docker.com/get-started/" },
      { name: "vLLM Docs (Free)", url: "https://docs.vllm.ai/" },
    ],
    milestone: "Containerized service",
  },
  {
    id: "w18",
    month: 5,
    title: "Week 18 — CI/CD & Observability",
    icon: "deploy",
    concepts: ["GitHub Actions", "Logging/Tracing", "Cost meters"],
    tasks: ["Add CI for tests + lint", "Add tracing (OpenTelemetry)", "Simple cost monitor"],
    courses: [
      { name: "GitHub Actions (Free)", url: "https://docs.github.com/en/actions" },
      { name: "Grafana Loki/Tempo (Free)", url: "https://grafana.com/docs/" },
    ],
    milestone: "CI/CD + traces",
  },
  {
    id: "w19",
    month: 5,
    title: "Week 19 — Diffusion Models 101",
    icon: "diffusion",
    concepts: ["Forward/reverse", "UNet", "Schedulers"],
    tasks: ["Run Stable Diffusion via diffusers", "Try ControlNet & LoRA for style", "Gallery of 12 outputs"],
    courses: [
      { name: "Hugging Face — Diffusers (Free)", url: "https://huggingface.co/docs/diffusers/index" },
    ],
    milestone: "Diffusion gallery",
  },
  {
    id: "w20",
    month: 5,
    title: "Week 20 — Diffusion Mini‑App",
    icon: "diffusion",
    concepts: ["Image safety filters", "Prompt presets", "Caching"],
    tasks: ["Build image gen web UI", "Add prompt presets + queue", "Cache by seed/prompt"],
    courses: [
      { name: "Gradio (Free)", url: "https://www.gradio.app/" },
      { name: "Streamlit (Free)", url: "https://docs.streamlit.io/" },
    ],
    milestone: "Image app MVP",
  },

  // Month 6 — Leadership, Portfolio, Certs
  {
    id: "w21",
    month: 6,
    title: "Week 21 — Strategy & Ethics",
    icon: "leadership",
    concepts: ["Risk, compliance", "Model cards", "Governance"],
    tasks: ["Write a model card for your bot", "Draft governance checklist", "Add safety notes to READMEs"],
    courses: [
      { name: "Model Cards (Free)", url: "https://arxiv.org/abs/1810.03993" },
    ],
    milestone: "Governance doc",
  },
  {
    id: "w22",
    month: 6,
    title: "Week 22 — Portfolio Polish",
    icon: "leadership",
    concepts: ["DX", "Demos", "Docs"],
    tasks: ["Record short demos (≤90s)", "Revamp READMEs with screenshots", "Create a one‑page portfolio site"],
    courses: [
      { name: "Docusaurus (Free)", url: "https://docusaurus.io/" },
      { name: "Hugo (Free)", url: "https://gohugo.io/" },
    ],
    milestone: "Portfolio ready",
  },
  {
    id: "w23",
    month: 6,
    title: "Week 23 — Certifications & Interviews",
    icon: "leadership",
    concepts: ["Exam prep", "Behavioral stories", "System design"],
    tasks: ["Attempt a GenAI certificate", "Mock interviews (2 tech, 1 product)", "Write 5 STAR stories"],
    courses: [
      { name: "System Design Primer (Free)", url: "https://github.com/donnemartin/system-design-primer" },
    ],
    milestone: "Cert + prep",
  },
  {
    id: "w24",
    month: 6,
    title: "Week 24 — Capstone & Release",
    icon: "leadership",
    concepts: ["Release mgmt", "Versioning", "Changelog"],
    tasks: ["Ship v1 of your best app", "Publish blog + LinkedIn post", "Collect user feedback & roadmap v2"],
    courses: [
      { name: "Semantic Versioning (Free)", url: "https://semver.org/" },
    ],
    milestone: "Capstone shipped",
  },
];

const CERTIFICATIONS: CertificateItem[] = [
  { name: "DeepLearning.AI — Generative AI for Everyone (Free)", platform: "Coursera", url: "https://www.coursera.org/learn/generative-ai-for-everyone" },
  { name: "Google Cloud — Introduction to Generative AI (Free)", platform: "Cloud Skills Boost", url: "https://www.cloudskillsboost.google/course_templates/536" },
  { name: "IBM — Introduction to Generative AI (Free)", platform: "Coursera", url: "https://www.coursera.org/learn/introduction-to-generative-ai-ibm" },
  { name: "Great Learning — Generative AI for Beginners (Free Certificate)", platform: "Great Learning", url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/generative-ai-for-beginners" },
  { name: "Hugging Face — NLP/Transformers (Free Track)", platform: "HF Course", url: "https://huggingface.co/learn/nlp-course/" },
];

/*****************
 * STORAGE
 *****************/
const STORAGE_KEY = "genai_tracker_v1";

function loadState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveState(state: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function usePersistentChecks() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setChecks(loadState());
  }, []);
  useEffect(() => {
    saveState(checks);
  }, [checks]);
  const toggle = (key: string) => setChecks((s) => ({ ...s, [key]: !s[key] }));
  const reset = () => setChecks({});
  const importFrom = (obj: Record<string, boolean>) => setChecks(obj || {});
  return { checks, toggle, reset, importFrom };
}

/*****************
 * ICONS
 *****************/
function IconByKey({ k }: { k: WeekPlan["icon"] }) {
  const common = "w-4 h-4";
  switch (k) {
    case "foundation":
      return <BookOpen className={common} />;
    case "decision":
      return <Layers className={common} />;
    case "agents":
      return <Rocket className={common} />;
    case "projects":
      return <ListChecks className={common} />;
    case "finetune":
      return <GraduationCap className={common} />;
    case "deploy":
      return <LineChart className={common} />;
    case "diffusion":
      return <Palette className={common} />;
    case "leadership":
      return <GraduationCap className={common} />;
    default:
      return <BookOpen className={common} />;
  }
}

/*****************
 * UTILS
 *****************/
function pct(n: number) {
  if (!isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

/*****************
 * MAIN EXPORT
 *****************/
export default function GenAITracker() {
  const { checks, toggle, reset, importFrom } = usePersistentChecks();
  const [tab, setTab] = useState<'plan' | 'certs'>('plan');
  const [q, setQ] = useState("");
  const [monthFilter, setMonthFilter] = useState<number | "all">("all");

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(checks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "genai-tracker-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result));
        importFrom(obj);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">GenAI 6‑Month Planner & Tracker</h1>
            <p className="text-slate-600 mt-1">Week‑by‑week concepts, tasks, courses, and certifications. Progress is saved locally.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={reset} title="Clear all progress">
              <RefreshCcw className="w-4 h-4 mr-2" />Reset
            </Button>
            <Button variant="outline" onClick={exportJSON} title="Export progress as JSON">
              <Download className="w-4 h-4 mr-2" />Export
            </Button>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer bg-white">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importJSON(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button variant={tab === 'plan' ? 'default' : 'outline'} onClick={() => setTab('plan')}>Learning Plan</Button>
          <Button variant={tab === 'certs' ? 'default' : 'outline'} onClick={() => setTab('certs')}><Award className="w-4 h-4 mr-2"/>Certifications</Button>
        </div>

        {tab === 'plan' ? (
          <PlanView
            checks={checks}
            toggle={toggle}
            q={q}
            setQ={setQ}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
          />
        ) : (
          <CertView checks={checks} toggle={toggle} />
        )}

        <footer className="text-center text-slate-500 text-sm pt-6">
          Built for deep, hands‑on GenAI learning. Customize the plan to fit your goals.
        </footer>
      </div>
    </div>
  );
}

/*****************
 * PLAN VIEW
 *****************/
function PlanView({
  checks,
  toggle,
  q,
  setQ,
  monthFilter,
  setMonthFilter,
}: {
  checks: Record<string, boolean>;
  toggle: (k: string) => void;
  q: string;
  setQ: (s: string) => void;
  monthFilter: number | "all";
  setMonthFilter: (n: number | "all") => void;
}) {
  const { overallCompleted, overallTotal } = useMemo(() => {
    let done = 0;
    let total = 0;
    PLAN.forEach((w) => {
      w.concepts.forEach((_, i) => (total += 1, done += (checks[`${w.id}:c:${i}`] ? 1 : 0)));
      w.tasks.forEach((_, i) => (total += 1, done += (checks[`${w.id}:t:${i}`] ? 1 : 0)));
      (w.courses || []).forEach((_, i) => (total += 1, done += (checks[`${w.id}:course:${i}`] ? 1 : 0)));
    });
    return { overallCompleted: done, overallTotal: total };
  }, [checks]);

  const filtered = useMemo(() => {
    const text = q.toLowerCase();
    return PLAN.filter((w) => (monthFilter === "all" || w.month === monthFilter))
      .filter((w) => {
        if (!text) return true;
        const blob = [w.title, w.milestone, ...(w.concepts), ...(w.tasks), ...((w.courses||[]).map(c=>c.name))].join(" ").toLowerCase();
        return blob.includes(text);
      });
  }, [q, monthFilter]);

  return (
    <>
      {/* Global progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Progress value={overallTotal ? (overallCompleted / overallTotal) * 100 : 0} />
            </div>
            <Badge variant="secondary">{overallCompleted} / {overallTotal}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="Search concepts, tasks, courses, milestones…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          {["all", 1, 2, 3, 4, 5, 6].map((m) => (
            <Button key={String(m)} variant={monthFilter === m ? "default" : "outline"} onClick={() => setMonthFilter(m as any)}>
              {m === "all" ? "All" : `M${m}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Weeks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filtered.map((w) => (
          <WeekCard key={w.id} w={w} checks={checks} toggle={toggle} />
        ))}
      </div>
    </>
  );
}

/*****************
 * CERT VIEW
 *****************/
function CertView({ checks, toggle }: { checks: Record<string, boolean>; toggle: (k: string) => void }) {
  const total = CERTIFICATIONS.length;
  const done = CERTIFICATIONS.filter((_, i) => checks[`cert:${i}`]).length;
  const progress = total ? (done / total) * 100 : 0;
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Certificates Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Progress value={progress} />
            </div>
            <Badge variant="secondary">{done} / {total}</Badge>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {CERTIFICATIONS.map((c, i) => {
          const key = `cert:${i}`;
          const done = !!checks[key];
          return (
            <Card key={c.name} className={done ? "border-green-200 bg-green-50" : ""}>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" /> {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-3">
                <p><strong>Platform:</strong> {c.platform}</p>
                <a href={c.url} className="text-blue-600 underline inline-block" target="_blank" rel="noreferrer">Open Course</a>
                <div>
                  <button onClick={() => toggle(key)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border">
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />} {done ? "Completed" : "Mark complete"}
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

/*****************
 * WEEK & SECTION
 *****************/
function WeekCard({ w, checks, toggle }: { w: WeekPlan; checks: Record<string, boolean>; toggle: (k: string) => void }) {
  const total = w.concepts.length + w.tasks.length + (w.courses?.length || 0);
  const done = w.concepts.filter((_, i) => checks[`${w.id}:c:${i}`]).length
    + w.tasks.filter((_, i) => checks[`${w.id}:t:${i}`]).length
    + (w.courses?.filter((_, i) => checks[`${w.id}:course:${i}`]).length || 0);
  const progress = total ? (done / total) * 100 : 0;
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <IconByKey k={w.icon} />
          <CardTitle className="text-base font-semibold">{w.title}</CardTitle>
          <Badge className="ml-auto" variant="outline">M{w.month}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Progress value={progress} className="flex-1" />
          <span className="text-xs text-slate-600 whitespace-nowrap">{pct(done / total)}%</span>
        </div>
        <Section title="Concepts" items={w.concepts} prefix={`${w.id}:c:`} checks={checks} toggle={toggle} />
        <Section title="Tasks" items={w.tasks} prefix={`${w.id}:t:`} checks={checks} toggle={toggle} />
        {w.courses && w.courses.length > 0 && (
          <CourseSection courses={w.courses} prefix={`${w.id}:course:`} checks={checks} toggle={toggle} />
        )}
        <div className="text-sm text-slate-700"><span className="font-medium">Milestone:</span> {w.milestone}</div>
      </CardContent>
    </Card>
  );
}

function Section({ title, items, prefix, checks, toggle }: { title: string; items: string[]; prefix: string; checks: Record<string, boolean>; toggle: (k: string) => void }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{title}</div>
      <ul className="space-y-2">
        {items.map((txt, i) => {
          const key = `${prefix}${i}`;
          const done = !!checks[key];
          return (
            <li key={key} className={`flex items-start gap-2 p-2 rounded-xl border ${done ? "bg-green-50 border-green-200" : "bg-white"}`}>
              <button onClick={() => toggle(key)} className="mt-0.5">
                {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <span className={`text-sm ${done ? "line-through text-slate-500" : "text-slate-800"}`}>{txt}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CourseSection({ courses, prefix, checks, toggle }: { courses: { name: string; url: string }[]; prefix: string; checks: Record<string, boolean>; toggle: (k: string) => void }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">Courses</div>
      <ul className="space-y-2">
        {courses.map((c, i) => {
          const key = `${prefix}${i}`;
          const done = !!checks[key];
          return (
            <li key={c.name} className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${done ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(key)}>
                  {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
                <a href={c.url} target="_blank" rel="noreferrer" className="text-sm underline text-blue-700">{c.name}</a>
              </div>
              <Badge variant={done ? "default" : "outline"}>{done ? "Done" : "Open"}</Badge>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
