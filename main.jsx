import { useState, useMemo, useRef, useEffect } from "react";

const JOBS = [
  {
    id: 1, title: "Project Manager", tags: ["Manager"], company: "ABC co.", location: "Remote", referrals: 1, saved: false,
    salary: "$150K–$180K", type: "Full-time", posted: "3 days ago", applicants: 47,
    description: "We're looking for a Project Manager to drive cross-functional collaboration and data-driven decision-making across our platform team. You'll own the project roadmap for our core infrastructure, working closely with engineering, design, and go-to-market teams to ship features that scale.",
    requirements: "3+ years project management experience, strong analytical background, prior startup experience preferred. Familiarity with platform/infrastructure products and ability to translate technical concepts for diverse stakeholders.",
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
 
/* ───── Agents Page ───── */
function AgentsPage({ jobs, onOpenAgent }) {
  const [searchQ, setSearchQ] = useState("");
  const [filterType, setFilterType] = useState("All");
 
  // Build agent list from jobs — each job has a company + generalized agent
  const agents = useMemo(() => {
    const list = [];
    jobs.forEach((job) => {
      list.push({
        id: `company-${job.id}`,
        type: "company",
        name: `${job.company} Agent`,
        subtitle: job.title,
        description: `Sourced from ${job.companyAgentCount} ${job.company} employees in the ${job.title} role. Ask about team culture, interview process, day-to-day work, and growth opportunities.`,
        color: "#e8d8a8",
        sources: job.companyAgentCount,
        tags: [...job.tags, job.company.replace(" co.", "")],
        jobId: job.id,
        agentType: "company",
      });
      list.push({
        id: `general-${job.id}`,
        type: "general",
        name: "Industry Agent",
        subtitle: job.title,
        description: `Aggregated insights from similar ${job.tags[0]?.toLowerCase()} roles across the industry. Ask about compensation benchmarks, career paths, skills in demand, and market trends.`,
        color: "#c8b8e8",
        sources: Math.floor(Math.random() * 40) + 20,
        tags: [...job.tags, "Industry-wide"],
        jobId: job.id,
        agentType: "general",
      });
    });
    return list;
  }, [jobs]);
 
  const filtered = useMemo(() => {
    let result = agents;
    if (filterType === "Company") result = result.filter((a) => a.type === "company");
    if (filterType === "Industry") result = result.filter((a) => a.type === "general");
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [agents, filterType, searchQ]);
 
  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "20px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>Agents</h1>
        <p style={{ margin: 0, fontSize: 15, color: "#777", lineHeight: 1.5 }}>
          AI-powered agents that give you real insight into roles and companies. Each agent is trained on data from actual employees or aggregated industry knowledge.
        </p>
      </div>
 
      {/* Search + filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", background: "#fff", borderRadius: 20,
          padding: "8px 16px", gap: 8, minWidth: 240, border: "1px solid #e0e0e0", flex: 1, maxWidth: 400,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            type="text" placeholder="Search agents..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#333", width: "100%", fontFamily: "inherit" }}
          />
        </div>
        {["All", "Company", "Industry"].map((f) => (
          <button key={f} onClick={() => setFilterType(f)} style={{
            padding: "8px 18px", borderRadius: 20, border: "1px solid #ddd",
            background: filterType === f ? "#eee8ff" : "#fff",
            color: filterType === f ? "#6b4ce6" : "#555",
            fontWeight: filterType === f ? 600 : 400,
            cursor: "pointer", fontSize: 14, fontFamily: "inherit",
          }}>{f}</button>
        ))}
      </div>
 
      {/* Agent count */}
      <p style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>
        {filtered.length} agent{filtered.length !== 1 ? "s" : ""} available
      </p>
 
      {/* Agent grid */}
      {filtered.length > 0 ? (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 16,
        }}>
          {filtered.map((agent) => (
            <div key={agent.id}
              onClick={() => onOpenAgent(agent.jobId, agent.agentType)}
              style={{
                background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8",
                padding: 24, cursor: "pointer", transition: "box-shadow 0.15s",
                display: "flex", flexDirection: "column", gap: 14,
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              {/* Top row: icon + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <AgentIcon color={agent.color} size={44} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>{agent.name}</div>
                  <div style={{ fontSize: 13, color: "#999" }}>{agent.subtitle}</div>
                </div>
              </div>
 
              {/* Description */}
              <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                {agent.description}
              </p>
 
              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {agent.tags.map((tag) => (
                  <span key={tag} style={{
                    padding: "3px 10px", borderRadius: 12, border: "1px solid #e8e8e8",
                    fontSize: 12, color: "#777", background: "#fafafa",
                  }}>{tag}</span>
                ))}
              </div>
 
              {/* Footer */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingTop: 10, borderTop: "1px solid #f0f0f0",
              }}>
                <span style={{ fontSize: 12, color: "#aaa" }}>
                  {agent.type === "company" ? `${agent.sources} employee sources` : `${agent.sources}+ data points`}
                </span>
                <span style={{
                  fontSize: 13, color: "#6b4ce6", fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  Chat
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
          <p style={{ fontSize: 16, fontWeight: 500 }}>No agents match your search</p>
          <p style={{ fontSize: 14 }}>Try a different keyword or filter</p>
        </div>
      )}
    </div>
  );
}
 
/* ───── Simple Bar Chart ───── */
function BarChart({ data, colors }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 140, paddingTop: 20 }}>
      {data.map((d, i) => (
        <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{d.value}</span>
          <div style={{
            width: "100%", maxWidth: 50,
            height: `${Math.max((d.value / max) * 100, 8)}%`,
            background: colors[i % colors.length],
            borderRadius: "6px 6px 0 0", transition: "height 0.3s",
          }} />
          <span style={{ fontSize: 11, color: "#999", textAlign: "center", lineHeight: 1.2 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
 
/* ───── Form Input Helper ───── */
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd",
  fontSize: 14, fontFamily: "inherit", color: "#333", outline: "none", boxSizing: "border-box",
};
const textareaStyle = { ...inputStyle, minHeight: 100, resize: "vertical" };
 
/* ───── Employer Dashboard ───── */
function EmployerDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarSection, setSidebarSection] = useState("Job posting");
  const [expandedSections, setExpandedSections] = useState({ "Job posting": true });
 
  // Posted jobs state
  const [postedJobs, setPostedJobs] = useState([
    { id: 1, title: "Staff Product Manager", department: "Product", level: "Staff", location: "Remote", salary: "$150K–$180K", type: "Full-time", status: "active", posted: "Jul 28, 2026", views: 117, applicants: 18, description: "Drive cross-functional collaboration across our platform team.", requirements: "6+ years PM experience, strong analytical background." },
    { id: 2, title: "Software Engineer", department: "Engineering", level: "Mid", location: "Remote", salary: "$120K–$150K", type: "Full-time", status: "active", posted: "Aug 1, 2026", views: 142, applicants: 21, description: "Build scalable microservices powering millions of transactions.", requirements: "3+ years backend, Go or Python, distributed systems." },
    { id: 3, title: "UX Designer", department: "Design", level: "Mid", location: "Remote", salary: "$100K–$130K", type: "Full-time", status: "active", posted: "Aug 3, 2026", views: 53, applicants: 8, description: "Shape the user experience for our consumer product.", requirements: "3+ years UX, strong portfolio, Figma proficiency." },
  ]);
 
  // Applicants state
  const [applicants] = useState([
    { id: 1, name: "Sarah Chen", role: "Staff Product Manager", stage: "Interview", applied: "Aug 1", rating: 4 },
    { id: 2, name: "James Wilson", role: "Software Engineer", stage: "Screening", applied: "Aug 3", rating: 3 },
    { id: 3, name: "Maya Patel", role: "Software Engineer", stage: "Skill check", applied: "Aug 2", rating: 5 },
    { id: 4, name: "Alex Kim", role: "UX Designer", stage: "Screening", applied: "Aug 4", rating: 3 },
    { id: 5, name: "Jordan Lee", role: "Staff Product Manager", stage: "Selected", applied: "Jul 30", rating: 5 },
    { id: 6, name: "Emma Davis", role: "Software Engineer", stage: "Interview", applied: "Aug 1", rating: 4 },
    { id: 7, name: "Ryan Moore", role: "UX Designer", stage: "Declined", applied: "Aug 2", rating: 2 },
    { id: 8, name: "Priya Sharma", role: "Staff Product Manager", stage: "Screening", applied: "Aug 5", rating: 3 },
    { id: 9, name: "Liam O'Brien", role: "Software Engineer", stage: "Joined", applied: "Jul 28", rating: 5 },
    { id: 10, name: "Sofia Martinez", role: "Software Engineer", stage: "Screening", applied: "Aug 4", rating: 4 },
  ]);
 
  // Post job form state
  const [form, setForm] = useState({ title: "", department: "Engineering", level: "Mid", location: "Remote", salary: "", type: "Full-time", description: "", requirements: "" });
  const [editingJobId, setEditingJobId] = useState(null);
 
  const handlePostJob = () => {
    if (!form.title.trim()) return;
    if (editingJobId) {
      setPostedJobs((prev) => prev.map((j) => j.id === editingJobId ? { ...j, ...form } : j));
      setEditingJobId(null);
    } else {
      setPostedJobs((prev) => [...prev, {
        id: Date.now(), ...form, status: "active", posted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        views: 0, applicants: 0,
      }]);
    }
    setForm({ title: "", department: "Engineering", level: "Mid", location: "Remote", salary: "", type: "Full-time", description: "", requirements: "" });
    setActiveView("list");
  };
 
  const handleEditJob = (job) => {
    setForm({ title: job.title, department: job.department, level: job.level, location: job.location, salary: job.salary, type: job.type, description: job.description, requirements: job.requirements });
    setEditingJobId(job.id);
    setActiveView("post");
  };
 
  const handleDeleteJob = (id) => {
    setPostedJobs((prev) => prev.filter((j) => j.id !== id));
  };
 
  const handleToggleStatus = (id) => {
    setPostedJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: j.status === "active" ? "expired" : "active" } : j));
  };
 
  const toggleSection = (s) => {
    setExpandedSections((prev) => ({ ...prev, [s]: !prev[s] }));
    setSidebarSection(s);
  };
 
  const handleSubClick = (sub) => {
    if (sub === "Post a job") setActiveView("post");
    else if (sub === "List of jobs") setActiveView("list");
    else if (sub.startsWith("Active")) setActiveView("active");
    else if (sub === "Expired jobs") setActiveView("expired");
  };
 
  const handleSidebarClick = (name) => {
    toggleSection(name);
    if (name === "Search resumes") setActiveView("resumes");
    else if (name === "Applicant tracking") setActiveView("tracking");
    else if (name === "My account") setActiveView("account");
    else if (name === "Analytics") setActiveView("analytics");
    else if (name === "Settings") setActiveView("settings");
    else if (name === "Job posting") setActiveView("dashboard");
  };
 
  const totalApplicants = postedJobs.reduce((s, j) => s + j.applicants, 0);
  const totalViews = postedJobs.reduce((s, j) => s + j.views, 0);
  const activeJobs = postedJobs.filter((j) => j.status === "active");
 
  const STATS = [
    { label: "Jobs", value: postedJobs.length, icon: "briefcase", color: "#dbeafe" },
    { label: "Applicants", value: totalApplicants, icon: "users", color: "#dcfce7" },
    { label: "Selected", value: applicants.filter((a) => a.stage === "Selected" || a.stage === "Joined").length, icon: "check", color: "#ede9fe" },
    { label: "Total views", value: totalViews, icon: "eye", color: "#fee2e2" },
  ];
 
  const statIcons = {
    briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 11l2 2 4-4"/></svg>,
    eye: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  };
 
  const SIDEBAR_ITEMS = [
    { name: "Job posting", sub: ["Post a job", "List of jobs", `Active jobs (${activeJobs.length})`, "Expired jobs"] },
    { name: "Search resumes", sub: [] },
    { name: "Applicant tracking", sub: [] },
    { name: "My account", sub: [] },
    { name: "Analytics", sub: [] },
    { name: "Settings", sub: [] },
  ];
 
  const PIPELINE_STAGES = ["Screening", "Interview", "Skill check", "Selected", "Joined", "Declined"];
  const stageColors = { Screening: "#93c5fd", Interview: "#a78bfa", "Skill check": "#fbbf24", Selected: "#4ade80", Joined: "#34d399", Declined: "#f87171" };
 
  /* ── Render main content area ── */
  const renderContent = () => {
    switch (activeView) {
 
      /* ── Post a Job Form ── */
      case "post":
        return (
          <div style={{ maxWidth: 640 }}>
            <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
              {editingJobId ? "Edit job" : "Post a new job"}
            </h2>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 28 }}>
              <FormField label="Job title *">
                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Software Engineer" />
              </FormField>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Department">
                  <select style={inputStyle} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    {["Engineering", "Design", "Product", "Marketing", "Data", "Sales"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </FormField>
                <FormField label="Level">
                  <select style={inputStyle} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    {["Entry-level", "Mid", "Senior", "Staff", "Manager"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </FormField>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Location">
                  <select style={inputStyle} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                    {["Remote", "Hybrid", "On-site"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </FormField>
                <FormField label="Job type">
                  <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Salary range">
                <input style={inputStyle} value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g. $120K–$150K" />
              </FormField>
              <FormField label="Job description">
                <textarea style={textareaStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role, responsibilities, and what a typical day looks like..." />
              </FormField>
              <FormField label="Requirements">
                <textarea style={textareaStyle} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="List required skills, experience, and qualifications..." />
              </FormField>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button onClick={handlePostJob} style={{
                  padding: "12px 28px", borderRadius: 10, border: "none", background: "#6b4ce6",
                  color: "#fff", fontSize: 14, fontWeight: 600, cursor: form.title.trim() ? "pointer" : "not-allowed",
                  fontFamily: "inherit", opacity: form.title.trim() ? 1 : 0.5,
                }}>{editingJobId ? "Save changes" : "Post job"}</button>
                <button onClick={() => { setActiveView("dashboard"); setEditingJobId(null); setForm({ title: "", department: "Engineering", level: "Mid", location: "Remote", salary: "", type: "Full-time", description: "", requirements: "" }); }}
                  style={{ padding: "12px 28px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", color: "#555", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
 
      /* ── Job List Views ── */
      case "list":
      case "active":
      case "expired": {
        const jobsToShow = activeView === "active" ? postedJobs.filter((j) => j.status === "active")
          : activeView === "expired" ? postedJobs.filter((j) => j.status === "expired") : postedJobs;
        const viewTitle = activeView === "active" ? "Active jobs" : activeView === "expired" ? "Expired jobs" : "All jobs";
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{viewTitle}</h2>
              <button onClick={() => setActiveView("post")} style={{
                padding: "10px 20px", borderRadius: 10, border: "none", background: "#6b4ce6",
                color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Post a job
              </button>
            </div>
            {jobsToShow.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
                <p style={{ fontSize: 16, fontWeight: 500 }}>No {activeView} jobs</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {jobsToShow.map((job) => (
                  <div key={job.id} style={{
                    background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8",
                    padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>{job.title}</span>
                        <span style={{
                          padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                          background: job.status === "active" ? "#dcfce7" : "#fee2e2",
                          color: job.status === "active" ? "#166534" : "#991b1b",
                        }}>{job.status}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#999", display: "flex", gap: 16 }}>
                        <span>{job.department} · {job.level}</span>
                        <span>{job.location}</span>
                        <span>{job.salary}</span>
                        <span>Posted {job.posted}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#777", marginTop: 6, display: "flex", gap: 20 }}>
                        <span>{job.views} views</span>
                        <span>{job.applicants} applicants</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleEditJob(job)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: "#555" }}>Edit</button>
                      <button onClick={() => handleToggleStatus(job.id)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: job.status === "active" ? "#dc2626" : "#16a34a" }}>
                        {job.status === "active" ? "Deactivate" : "Reactivate"}
                      </button>
                      <button onClick={() => handleDeleteJob(job.id)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: "#dc2626" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
 
      /* ── Applicant Tracking ── */
      case "tracking":
        return (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>Applicant Tracking</h2>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 16 }}>
              {PIPELINE_STAGES.map((stage) => {
                const stageApplicants = applicants.filter((a) => a.stage === stage);
                return (
                  <div key={stage} style={{
                    minWidth: 220, background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8",
                    padding: 16, flexShrink: 0,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: stageColors[stage] }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{stage}</span>
                      </div>
                      <span style={{ fontSize: 12, color: "#999", background: "#f4f4f5", padding: "2px 8px", borderRadius: 8 }}>{stageApplicants.length}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {stageApplicants.map((a) => (
                        <div key={a.id} style={{
                          padding: 12, borderRadius: 10, background: "#f9f9fb", border: "1px solid #f0f0f0",
                        }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{a.role}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: "#bbb" }}>Applied {a.applied}</span>
                            <div style={{ display: "flex", gap: 2 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= a.rating ? "#fbbf24" : "#e5e7eb"} stroke="none">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {stageApplicants.length === 0 && (
                        <div style={{ padding: 16, textAlign: "center", color: "#ccc", fontSize: 13 }}>No applicants</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
 
      /* ── Search Resumes ── */
      case "resumes":
        return (
          <div style={{ maxWidth: 700 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>Search Resumes</h2>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 28 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Search by skill, title, or keyword..." />
                <button style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#6b4ce6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Search</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                <select style={inputStyle}><option>All departments</option><option>Engineering</option><option>Design</option><option>Product</option><option>Marketing</option></select>
                <select style={inputStyle}><option>All levels</option><option>Entry-level</option><option>Mid</option><option>Senior</option><option>Staff</option></select>
                <select style={inputStyle}><option>All locations</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select>
              </div>
              {/* Sample results */}
              {[
                { name: "Alice Zhang", title: "Frontend Engineer", skills: ["React", "TypeScript", "Figma"], exp: "4 years", location: "Remote" },
                { name: "Marcus Johnson", title: "Product Manager", skills: ["Agile", "SQL", "Roadmapping"], exp: "6 years", location: "Hybrid" },
                { name: "Fatima Al-Rashid", title: "UX Researcher", skills: ["User Interviews", "Figma", "Analytics"], exp: "3 years", location: "Remote" },
              ].map((r) => (
                <div key={r.name} style={{
                  padding: 18, borderRadius: 12, border: "1px solid #f0f0f0", marginBottom: 12,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>{r.title} · {r.exp} · {r.location}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {r.skills.map((s) => (
                        <span key={s} style={{ padding: "3px 10px", borderRadius: 10, background: "#f4f4f5", fontSize: 12, color: "#666" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <button style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit", color: "#6b4ce6", fontWeight: 500 }}>View CV</button>
                </div>
              ))}
            </div>
          </div>
        );
 
      /* ── Account / Analytics / Settings placeholder ── */
      case "account":
      case "analytics":
      case "settings": {
        const titles = { account: "My Account", analytics: "Analytics", settings: "Settings" };
        return (
          <div style={{ textAlign: "center", padding: 80, color: "#999" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 12 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#555", marginBottom: 8 }}>{titles[activeView]}</h2>
            <p style={{ fontSize: 14 }}>Coming soon</p>
          </div>
        );
      }
 
      /* ── Dashboard (default) ── */
      default:
        return (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>Dashboard</h1>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setActiveView("resumes")} style={{
                  padding: "10px 20px", borderRadius: 10, border: "1px solid #ddd",
                  background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 8, color: "#555",
                }}>
                  Search resumes
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                </button>
                <button onClick={() => setActiveView("post")} style={{
                  padding: "10px 20px", borderRadius: 10, border: "none",
                  background: "#6b4ce6", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
                  color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                }}>
                  Post a job
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                  {STATS.map((s) => (
                    <div key={s.label} style={{
                      background: "#fff", borderRadius: 12, border: "1px solid #e8e8e8",
                      padding: "18px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer",
                    }}
                      onClick={() => { if (s.label === "Jobs") setActiveView("list"); if (s.label === "Applicants") setActiveView("tracking"); }}
                    >
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>{s.value}</div>
                        <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{s.label}</div>
                      </div>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {statIcons[s.icon]}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 24, marginBottom: 24 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>Jobs status</h3>
                  <BarChart data={[
                    { label: "Jobs", value: postedJobs.length },
                    { label: "Active", value: activeJobs.length },
                    { label: "Applicants", value: totalApplicants },
                    { label: "Selected", value: applicants.filter((a) => a.stage === "Selected").length },
                  ]} colors={["#93c5fd", "#bef264", "#4ade80", "#a3e635"]} />
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 24 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>Applicant Pipeline</h3>
                  <BarChart data={PIPELINE_STAGES.map((s) => ({ label: s, value: applicants.filter((a) => a.stage === s).length }))}
                    colors={["#93c5fd", "#a78bfa", "#fbbf24", "#4ade80", "#34d399", "#f87171"]} />
                </div>
              </div>
              <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 20 }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Job posting</h4>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 14 }}>From: Jul 23, 2026 &nbsp;To: Aug 22, 2026</div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: 13, color: "#666" }}>Total jobs allocated:</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>11</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: 13, color: "#666" }}>Total jobs posted:</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{postedJobs.length}</span>
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 20 }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Resume</h4>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 14 }}>From: Jul 23, 2026 &nbsp;To: Aug 22, 2026</div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: 13, color: "#666" }}>CV search allocated:</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Unlimited</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: 13, color: "#666" }}>Total CVs searched:</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>24</span>
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", padding: 20 }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Subscription plan</h4>
                  <p style={{ margin: "0 0 14px", fontSize: 13, color: "#777", lineHeight: 1.4 }}>Starter plan — Post jobs, access resumes, and track applicants.</p>
                  <button style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", color: "#555" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.borderColor = "#c8b8e8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#ddd"; }}
                  >Upgrade plan</button>
                </div>
                <button onClick={() => setActiveView("tracking")} style={{
                  padding: "14px 0", borderRadius: 12, border: "1px solid #e8e8e8", background: "#fff",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", color: "#1a1a1a",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.borderColor = "#c8b8e8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e8e8e8"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
                  Start applicant tracking
                </button>
              </div>
            </div>
          </>
        );
    }
  };
 
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 61px)" }}>
      <aside style={{ width: 240, background: "#fff", borderRight: "1px solid #eee", padding: "24px 0", flexShrink: 0 }}>
        <div style={{ textAlign: "center", padding: "0 20px 24px", borderBottom: "1px solid #f0f0f0", marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#6b4ce6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 22, fontWeight: 700, color: "#fff" }}>P</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Welcome, Employer</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>ABC co.</div>
        </div>
        {SIDEBAR_ITEMS.map((item) => (
          <div key={item.name}>
            <button onClick={() => handleSidebarClick(item.name)} style={{
              width: "100%", padding: "10px 20px", background: sidebarSection === item.name ? "#f5f0ff" : "transparent",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "space-between", fontFamily: "inherit",
              fontSize: 14, color: sidebarSection === item.name ? "#6b4ce6" : "#555",
              fontWeight: sidebarSection === item.name ? 600 : 400,
            }}>
              <span>{item.name}</span>
              {item.sub.length > 0 && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
                  style={{ transform: expandedSections[item.name] ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}>
                  <path d="M3 5l3 3 3-3"/>
                </svg>
              )}
            </button>
            {item.sub.length > 0 && expandedSections[item.name] && (
              <div style={{ padding: "4px 0 8px" }}>
                {item.sub.map((sub) => (
                  <button key={sub} onClick={() => handleSubClick(sub)} style={{
                    display: "block", width: "100%", padding: "7px 20px 7px 36px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: "#777", fontFamily: "inherit", textAlign: "left",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#6b4ce6"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#777"}
                  >{sub}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        {renderContent()}
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
      ) : activeTab === "Agents" ? (
        <AgentsPage jobs={jobs} onOpenAgent={(jobId, type) => setAgentView({ jobId, type })} />
      ) : activeTab === "For employers" ? (
        <EmployerDashboard />
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
 
