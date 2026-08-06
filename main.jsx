import { useState, useMemo, useRef, useEffect } from "react";

const JOBS = [
  {
    id: 1, title: "Staff Product Manager", tags: ["Product", "Staff"], company: "ABC co.", location: "Remote", referrals: 1, saved: false,
    salary: "$150K–$180K", type: "Full-time", posted: "3 days ago", applicants: 47,
    description: "We're looking for a Staff Product Manager to drive cross-functional collaboration and data-driven decision-making across our platform team. You'll own the product roadmap for our core infrastructure, working closely with engineering, design, and go-to-market teams to ship features that scale.",
    requirements: "6+ years product management experience, strong analytical background, prior startup experience preferred. Familiarity with platform/infrastructure products and ability to translate technical concepts for diverse stakeholders.",
    companyAgentCount: 6,
    videoUrl: "/videos/perlude_day_in_life_demo.mp4",
  },
  {
    id: 2, title: "Software Engineer", tags: ["Engineering", "Mid"], company: "DEF co.", location: "Remote", referrals: 2, saved: false,
    salary: "$120K–$150K", type: "Full-time", posted: "1 day ago", applicants: 83,
    description: "Join our backend team to build and maintain scalable microservices powering millions of daily transactions. You'll work with Go and Python, design APIs, and contribute to architecture decisions in a fast-paced environment.",
    requirements: "3+ years backend development experience, proficiency in Go or Python, experience with distributed systems and RESTful API design. Bonus: Kubernetes, PostgreSQL, event-driven architectures.",
    companyAgentCount: 8,
  },
  {
    id: 3, title: "Marketing Manager", tags: ["Marketing", "Manager"], company: "GHI co.", location: "Remote", referrals: 1, saved: false,
    salary: "$95K–$120K", type: "Full-time", posted: "5 days ago", applicants: 31,
    description: "Lead our B2B marketing efforts, from campaign strategy to execution. You'll manage a small team, own the content calendar, and partner with sales to drive pipeline growth across key verticals.",
    requirements: "4+ years B2B marketing experience, proven track record with demand gen campaigns, strong writing skills. Experience with HubSpot or Marketo and comfort with marketing analytics.",
    companyAgentCount: 4,
  },
  {
    id: 4, title: "UX Designer", tags: ["Design", "Mid"], company: "JKL co.", location: "Remote", referrals: 2, saved: false,
    salary: "$100K–$130K", type: "Full-time", posted: "2 days ago", applicants: 56,
    description: "Shape the user experience for our consumer product used by 2M+ people. You'll run user research, create wireframes and prototypes, and collaborate with engineering to deliver polished interfaces.",
    requirements: "3+ years UX design experience, strong portfolio showing end-to-end design process, proficiency in Figma. Experience with user research methods and data-informed design decisions.",
    companyAgentCount: 5,
  },
  {
    id: 5, title: "Data Analyst", tags: ["Data", "Entry-level"], company: "MNO co.", location: "Remote", referrals: 1, saved: false,
    salary: "$70K–$90K", type: "Full-time", posted: "4 days ago", applicants: 112,
    description: "Help our operations team make better decisions through data. You'll build dashboards, run ad-hoc analyses, and partner with stakeholders to define KPIs and measure what matters.",
    requirements: "1+ years experience with SQL and data visualization tools (Tableau, Looker, or similar). Strong communication skills and ability to translate data into actionable insights. Python or R a plus.",
    companyAgentCount: 3,
  },
  {
    id: 6, title: "Sales Development Rep", tags: ["Sales", "Entry-level"], company: "PQR co.", location: "Remote", referrals: 2, saved: false,
    salary: "$55K–$75K + commission", type: "Full-time", posted: "1 day ago", applicants: 67,
    description: "Be the first point of contact for prospective customers. You'll research accounts, craft personalized outreach, and qualify leads for our account executive team in a high-energy sales environment.",
    requirements: "0–2 years sales or customer-facing experience, excellent written and verbal communication, high energy and resilience. Experience with Salesforce or Outreach.io is a bonus.",
    companyAgentCount: 7,
  },
  {
    id: 7, title: "Backend Engineer", tags: ["Engineering", "Senior"], company: "STU co.", location: "Hybrid", referrals: 1, saved: false,
    salary: "$160K–$200K", type: "Full-time", posted: "6 days ago", applicants: 29,
    description: "Architect and build the next generation of our real-time data pipeline. You'll lead technical design for high-throughput systems processing billions of events daily, mentoring junior engineers along the way.",
    requirements: "5+ years backend engineering, deep experience with distributed systems, stream processing (Kafka, Flink), and cloud infrastructure (AWS/GCP). Strong system design and mentoring skills.",
    companyAgentCount: 4,
  },
  {
    id: 8, title: "Product Designer", tags: ["Design", "Senior"], company: "VWX co.", location: "On-site", referrals: 3, saved: false,
    salary: "$140K–$170K", type: "Full-time", posted: "2 days ago", applicants: 38,
    description: "Own the design vision for our enterprise platform. You'll lead design sprints, establish and maintain our design system, and work closely with PMs and engineers to deliver cohesive product experiences.",
    requirements: "5+ years product design experience, strong systems thinking, expertise in Figma and prototyping tools. Experience building and maintaining design systems at scale. Enterprise SaaS experience preferred.",
    companyAgentCount: 6,
  },
  {
    id: 9, title: "DevOps Engineer", tags: ["Engineering", "Mid"], company: "YZA co.", location: "Remote", referrals: 1, saved: false,
    salary: "$115K–$145K", type: "Full-time", posted: "3 days ago", applicants: 41,
    description: "Build and maintain our CI/CD pipelines, infrastructure-as-code, and monitoring stack. You'll work across teams to improve developer velocity and system reliability.",
    requirements: "3+ years DevOps/SRE experience, strong Terraform and Kubernetes skills, experience with monitoring tools (Datadog, Grafana). Comfortable scripting in Bash/Python.",
    companyAgentCount: 3,
  },
  {
    id: 10, title: "Content Strategist", tags: ["Marketing", "Mid"], company: "BCD co.", location: "Remote", referrals: 0, saved: false,
    salary: "$85K–$110K", type: "Full-time", posted: "7 days ago", applicants: 24,
    description: "Define and execute our content strategy across blog, social, and email channels. You'll develop editorial guidelines, manage freelance writers, and measure content performance against business goals.",
    requirements: "3+ years content strategy or content marketing experience, exceptional writing and editing skills, SEO knowledge. Experience managing editorial calendars and working with analytics tools.",
    companyAgentCount: 2,
  },
  {
    id: 11, title: "ML Engineer", tags: ["Engineering", "Senior"], company: "EFG co.", location: "Hybrid", referrals: 2, saved: false,
    salary: "$170K–$210K", type: "Full-time", posted: "1 day ago", applicants: 52,
    description: "Design and deploy production ML models that power our recommendation and search systems. You'll work on the full ML lifecycle from experimentation to serving, optimizing for latency and relevance.",
    requirements: "4+ years ML engineering experience, strong Python and PyTorch/TensorFlow skills, experience deploying models at scale. Background in NLP, recommendation systems, or information retrieval preferred.",
    companyAgentCount: 5,
  },
  {
    id: 12, title: "Junior Frontend Dev", tags: ["Engineering", "Entry-level"], company: "HIJ co.", location: "Remote", referrals: 1, saved: false,
    salary: "$65K–$85K", type: "Full-time", posted: "2 days ago", applicants: 94,
    description: "Join our frontend team to build beautiful, accessible user interfaces with React and TypeScript. You'll ship features, fix bugs, and learn from senior engineers in a supportive environment.",
    requirements: "0–2 years frontend development experience, familiarity with React and modern JavaScript/TypeScript. Understanding of HTML, CSS, and responsive design. Eagerness to learn and grow.",
    companyAgentCount: 4,
  },
];

const LEVELS = ["All levels", "Entry-level", "Mid", "Senior", "Staff", "Manager"];
const ARRANGEMENTS = ["All arrangements", "Remote", "Hybrid", "On-site"];
const INDUSTRIES = ["All industries", "Engineering", "Design", "Product", "Marketing", "Data", "Sales"];
const SORT_OPTIONS = ["Sort: newest", "Sort: oldest"];

const AVATAR_COLORS = ["#c8b8e8", "#e8d8a8", "#b8d8c8"];

function AgentIcon({ color = "#e8d8a8", size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/>
      </svg>
    </div>
  );
}

function AvatarDots({ count }) {
  if (!count) return null;
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
        <AgentIcon key={i} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} size={28} />
      ))}
    </div>
  );
}

function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        padding: "8px 16px", borderRadius: 20, border: "1px solid #ddd",
        background: value !== options[0] ? "#eee8ff" : "#fff", cursor: "pointer",
        fontSize: 14, color: "#333", display: "flex", alignItems: "center", gap: 6,
        fontFamily: "inherit", whiteSpace: "nowrap",
      }}>
        {value}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#666" strokeWidth="1.5"><path d="M3 5l3 3 3-3"/></svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100,
          background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: 180, overflow: "hidden",
        }}>
          {options.map((opt) => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "10px 16px", cursor: "pointer", fontSize: 14,
                background: opt === value ? "#f5f0ff" : "transparent",
                color: opt === value ? "#6b4ce6" : "#333",
                fontWeight: opt === value ? 600 : 400,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = opt === value ? "#f5f0ff" : "#f8f8f8"}
              onMouseLeave={(e) => e.currentTarget.style.background = opt === value ? "#f5f0ff" : "transparent"}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onToggleSave, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8",
      padding: 22, display: "flex", flexDirection: "column", gap: 12,
      transition: "box-shadow 0.15s", cursor: "pointer",
    }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3, maxWidth: "75%" }}>{job.title}</h3>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#999" }} title="History" onClick={(e) => e.stopPropagation()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleSave(job.id); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: job.saved ? "#6b4ce6" : "#999" }} title="Save">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={job.saved ? "#6b4ce6" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-4-7 4V5z"/></svg>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {job.tags.map((tag) => (
          <span key={tag} style={{
            padding: "4px 12px", borderRadius: 16, border: "1px solid #ddd",
            fontSize: 13, color: "#555", background: "#fafafa",
          }}>{tag}</span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#666" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 1v4M16 1v4M2 9h20"/></svg>
        {job.company}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#666" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          {job.location}
        </div>
        <AvatarDots count={job.referrals} />
      </div>
    </div>
  );
}

/* ───── Agent Chat Page ───── */
function AgentChat({ job, agentType, onBack }) {
  const [messages, setMessages] = useState([
    {
      from: "agent",
      text: agentType === "company"
        ? `Hi! I'm the ${job.company} agent for the ${job.title} role. I've gathered insights from ${job.companyAgentCount} employees at ${job.company} who work in this role. Ask me anything about the team, culture, day-to-day, or interview process.`
        : `Hi! I'm the generalized industry agent for ${job.tags[0]?.toLowerCase()} roles. I've aggregated insights from similar positions across the industry. Ask me about compensation benchmarks, typical career paths, skills in demand, or how this role compares to others.`,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const isCompany = agentType === "company";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SAMPLE_REPLIES = isCompany
    ? [
        `From what employees share, the team operates in 2-week sprints with a strong emphasis on async communication. Most folks work flexible hours and the culture skews collaborative over competitive.`,
        `The interview process at ${job.company} for this role typically involves a recruiter screen, a hiring manager call, a case study or take-home, and a final panel. Total timeline is usually 2-3 weeks.`,
        `Employees note that growth opportunities are strong here. Several people in this role have moved into director-level positions within 18-24 months.`,
        `Work-life balance gets high marks from the team. On-call rotations are rare for this role, and PTO usage is genuinely encouraged by leadership.`,
      ]
    : [
        `Across the industry, ${job.tags[0]?.toLowerCase()} roles at the ${job.tags[1]?.toLowerCase()} level typically see total compensation in the ${job.salary} range, with top-tier companies offering equity on top.`,
        `The most in-demand skills for this type of role right now include cross-functional leadership, data fluency, and the ability to influence without authority. Technical depth varies by company.`,
        `Career progression from this level usually follows two paths: deeper individual contributor specialization, or management. Both are well-compensated in the current market.`,
        `Compared to similar roles, this posting's requirements are fairly standard. The startup experience preference suggests a fast-paced environment where you'd wear multiple hats.`,
      ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setTimeout(() => {
      const reply = SAMPLE_REPLIES[Math.floor(Math.random() * SAMPLE_REPLIES.length)];
      setMessages((prev) => [...prev, { from: "agent", text: reply }]);
    }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 61px)" }}>
      {/* Chat header */}
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid #eee", background: "#fff",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4, color: "#555",
          display: "flex", alignItems: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <AgentIcon color={isCompany ? "#e8d8a8" : "#c8b8e8"} size={38} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>
            {isCompany ? `${job.company} Agent` : "Industry Agent"}
          </div>
          <div style={{ fontSize: 12, color: "#999" }}>
            {isCompany
              ? `Sourced from ${job.companyAgentCount} employees`
              : "Aggregated industry-wide insights"
            } · {job.title}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "24px 24px 12px",
        display: "flex", flexDirection: "column", gap: 16,
        maxWidth: 720, width: "100%", margin: "0 auto",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
            gap: 10, alignItems: "flex-start",
          }}>
            {msg.from === "agent" && (
              <AgentIcon color={isCompany ? "#e8d8a8" : "#c8b8e8"} size={32} />
            )}
            <div style={{
              maxWidth: "75%", padding: "12px 16px", borderRadius: 16,
              background: msg.from === "user" ? "#6b4ce6" : "#f4f4f5",
              color: msg.from === "user" ? "#fff" : "#333",
              fontSize: 14, lineHeight: 1.6,
              borderBottomRightRadius: msg.from === "user" ? 4 : 16,
              borderBottomLeftRadius: msg.from === "agent" ? 4 : 16,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 24px", borderTop: "1px solid #eee", background: "#fff",
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto", display: "flex", gap: 10, alignItems: "center",
          background: "#f4f4f5", borderRadius: 14, padding: "10px 16px",
        }}>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about this role..."
            style={{
              border: "none", outline: "none", flex: 1, fontSize: 14,
              fontFamily: "inherit", color: "#333", background: "transparent",
            }}
          />
          <button onClick={handleSend} style={{
            background: input.trim() ? "#6b4ce6" : "#ccc",
            border: "none", borderRadius: 10, padding: "8px 18px",
            color: "#fff", fontSize: 14, cursor: input.trim() ? "pointer" : "default",
            fontFamily: "inherit", fontWeight: 500, transition: "background 0.15s",
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}

/* ───── Video Player ───── */
function VideoPlayer({ videoUrl: initialUrl, company }) {
  const [playing, setPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState(initialUrl || null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handlePlay = () => {
    if (!videoSrc) {
      fileRef.current?.click();
      return;
    }
    setPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  };

  const handleVideoEnd = () => {
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden", marginBottom: 28,
      background: "#1a1a1a", aspectRatio: "16/9",
      position: "relative", cursor: playing ? "default" : "pointer",
    }}
      onClick={!playing ? handlePlay : undefined}
    >
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      {playing && videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          onEnded={handleVideoEnd}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            display: "block", borderRadius: 14,
          }}
        />
      ) : (
        <>
          {videoSrc && (
            <video
              src={videoSrc}
              muted
              preload="metadata"
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                position: "absolute", top: 0, left: 0, opacity: 0.5,
              }}
            />
          )}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s, background 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" stroke="none">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div style={{
            position: "absolute", bottom: 16, left: 20, right: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            zIndex: 2,
          }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              A day in the life · {company}
            </span>
            <span style={{
              fontSize: 12, color: "rgba(255,255,255,0.5)",
              background: "rgba(0,0,0,0.4)", padding: "2px 8px", borderRadius: 6,
            }}>{videoSrc ? "▶ Watch" : "📁 Load video"}</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ───── Job Detail View ───── */
function JobDetail({ job, onBack, onToggleSave, onOpenAgent }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 40px" }}>
      {/* Back */}
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
        cursor: "pointer", fontSize: 15, color: "#555", padding: "20px 0 16px",
        fontFamily: "inherit",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to jobs
      </button>

      <div style={{ borderTop: "1px solid #eee", paddingTop: 24 }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>{job.title}</h1>
          <button onClick={() => onToggleSave(job.id)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: job.saved ? "#6b4ce6" : "#bbb", flexShrink: 0, marginTop: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={job.saved ? "#6b4ce6" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-4-7 4V5z"/></svg>
          </button>
        </div>

        {/* Meta line */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#777", marginBottom: 14, flexWrap: "wrap" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 1v4M16 1v4M2 9h20"/></svg>
          {job.company}
          <span style={{ color: "#ccc" }}>·</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          {job.location}
          <span style={{ color: "#ccc" }}>·</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 2v4M18 2v4"/></svg>
          {job.type}
        </div>

        {/* Tags + salary */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {job.tags.map((tag) => (
            <span key={tag} style={{
              padding: "4px 14px", borderRadius: 16, border: "1px solid #ddd",
              fontSize: 13, color: "#555", background: "#fafafa",
            }}>{tag}</span>
          ))}
          <span style={{
            padding: "4px 14px", borderRadius: 16, border: "1px solid #ddd",
            fontSize: 13, color: "#555", background: "#fafafa",
          }}>{job.salary}</span>
        </div>

        {/* Posted + applicants */}
        <p style={{ fontSize: 13, color: "#999", margin: "0 0 28px" }}>
          Posted {job.posted} · {job.applicants} applicants
        </p>

        {/* Video section */}
        {job.videoUrl ? (
          <VideoPlayer videoUrl={job.videoUrl} company={job.company} />
        ) : (
          <div style={{
            borderRadius: 14, overflow: "hidden", marginBottom: 28,
            background: "#1a1a1a", aspectRatio: "16/9",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{ textAlign: "center" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 9l5 3-5 3V9z"/>
              </svg>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 8 }}>
                Video coming soon
              </p>
            </div>
          </div>
        )}

        {/* Agent section */}
        <div style={{
          border: "1px solid #e8e8e8", borderRadius: 14, padding: 24, marginBottom: 32,
          background: "#fff",
        }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
            Hear it from the people who'd know
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Company agent */}
            <button
              onClick={() => onOpenAgent("company")}
              style={{
                background: "#fafafa",
                border: "1px solid #e8e8e8",
                borderRadius: 12, padding: 20, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                textAlign: "center", fontFamily: "inherit", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.borderColor = "#c8b8e8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#e8e8e8"; }}
            >
              <AgentIcon color="#e8d8a8" size={42} />
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Company-specific agent</span>
              <span style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>
                Sourced from {job.companyAgentCount} {job.company} employees in this role
              </span>
            </button>

            {/* General agent */}
            <button
              onClick={() => onOpenAgent("general")}
              style={{
                background: "#fafafa",
                border: "1px solid #e8e8e8",
                borderRadius: 12, padding: 20, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                textAlign: "center", fontFamily: "inherit", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.borderColor = "#c8b8e8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#e8e8e8"; }}
            >
              <AgentIcon color="#c8b8e8" size={42} />
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Generalized agent</span>
              <span style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>
                Aggregated insight from similar roles industry-wide
              </span>
            </button>
          </div>
        </div>

        {/* About the role */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 10px" }}>About the role</h3>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.7, margin: 0 }}>{job.description}</p>
        </div>

        {/* Requirements */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 10px" }}>Requirements</h3>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.7, margin: 0 }}>{job.requirements}</p>
        </div>

        {/* Apply */}
        <button style={{
          width: "100%", padding: "14px 0", borderRadius: 12,
          border: "1px solid #ddd", background: "#fff", cursor: "pointer",
          fontSize: 16, fontWeight: 600, color: "#1a1a1a",
          fontFamily: "inherit", transition: "all 0.15s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.borderColor = "#c8b8e8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#ddd"; }}
        >
          Apply now
        </button>
      </div>
    </div>
  );
}

/* ───── Main App ───── */
export default function PreludeJobBoard() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All levels");
  const [arrangement, setArrangement] = useState("All arrangements");
  const [industry, setIndustry] = useState("All industries");
  const [sort, setSort] = useState("Sort: newest");
  const [jobs, setJobs] = useState(JOBS);
  const [activeTab, setActiveTab] = useState("Jobs");
  const [showBanner, setShowBanner] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [agentView, setAgentView] = useState(null); // null | { jobId, type: "company"|"general" }

  const toggleSave = (id) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, saved: !j.saved } : j));
  };

  const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) : null;
  const agentJob = agentView ? jobs.find((j) => j.id === agentView.jobId) : null;

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((j) =>
        j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (level !== "All levels") result = result.filter((j) => j.tags.includes(level));
    if (arrangement !== "All arrangements") result = result.filter((j) => j.location === arrangement);
    if (industry !== "All industries") result = result.filter((j) => j.tags.includes(industry));
    if (sort === "Sort: oldest") result.reverse();
    return result;
  }, [jobs, search, level, arrangement, industry, sort]);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f4f4f5", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px", background: "#fff", borderBottom: "1px solid #eee",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            onClick={() => { setSelectedJobId(null); setAgentView(null); }}
            style={{ fontSize: 22, fontWeight: 700, fontStyle: "italic", color: "#1a1a1a", letterSpacing: -0.5, cursor: "pointer" }}
          >Prelude</span>
          {!selectedJob && !agentView && (
            <div style={{
              display: "flex", alignItems: "center", background: "#f4f4f5", borderRadius: 20,
              padding: "8px 16px", gap: 8, minWidth: 180,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                type="text" placeholder="Search jobs.." value={search} onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none", background: "transparent", outline: "none",
                  fontSize: 14, color: "#333", width: "100%", fontFamily: "inherit",
                }}
              />
            </div>
          )}
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Jobs", "Agents", "For employers"].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSelectedJobId(null); setAgentView(null); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 15, color: activeTab === tab ? "#1a1a1a" : "#888",
              fontWeight: activeTab === tab ? 600 : 400, fontFamily: "inherit",
              borderBottom: activeTab === tab ? "2px solid #1a1a1a" : "2px solid transparent",
              paddingBottom: 2,
            }}>{tab}</button>
          ))}
          <button style={{
            padding: "8px 18px", borderRadius: 8, border: "1px solid #ddd",
            background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500,
            fontFamily: "inherit",
          }}>Sign in</button>
        </nav>
      </header>

      {/* Views */}
      {agentView && agentJob ? (
        <AgentChat job={agentJob} agentType={agentView.type} onBack={() => setAgentView(null)} />
      ) : selectedJob ? (
        <JobDetail job={selectedJob} onBack={() => setSelectedJobId(null)} onToggleSave={toggleSave}
          onOpenAgent={(type) => setAgentView({ jobId: selectedJob.id, type })} />
      ) : (
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "20px 24px" }}>
          {/* Sign-in Banner */}
          {showBanner && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#fff", borderRadius: 12, padding: "16px 24px",
              marginBottom: 20, border: "1px solid #e8e8e8",
            }}>
              <span style={{ fontSize: 14, color: "#555" }}>
                Sign in to see exclusive referral jobs and ask for a referral to the hiring team.
              </span>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button style={{
                  padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd",
                  background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500,
                  fontFamily: "inherit",
                }}>Sign in</button>
                <button onClick={() => setShowBanner(false)} style={{
                  background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 18, lineHeight: 1,
                }}>&times;</button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div style={{
            display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Dropdown options={LEVELS} value={level} onChange={setLevel} />
              <Dropdown options={ARRANGEMENTS} value={arrangement} onChange={setArrangement} />
              <Dropdown options={INDUSTRIES} value={industry} onChange={setIndustry} />
            </div>
            <Dropdown options={SORT_OPTIONS} value={sort} onChange={setSort} />
          </div>

          {/* Results count */}
          <p style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>
            {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Job Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 16,
            }}>
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} onToggleSave={toggleSave} onClick={() => setSelectedJobId(job.id)} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 12 }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <p style={{ fontSize: 16, fontWeight: 500 }}>No jobs match your filters</p>
              <p style={{ fontSize: 14 }}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
