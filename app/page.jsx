"use client";

import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const PASSWORD = "sedona2026";

const PRESETS = [
  { label: "Occupancy next 60 days", q: "What's my occupancy rate for the next 60 days across all 3 properties? Break it down by property." },
  { label: "Upcoming booking gaps", q: "Show me open/unbooked nights in the next 30 days across Sunup, Sundown, and The Casita." },
  { label: "Recent reservations", q: "What are my 5 most recent reservations across all properties? Include dates, property, and payout amount." },
  { label: "Review scores compared", q: "What are the current overall review scores for each of my 3 properties? Compare them." },
  { label: "Revenue this month", q: "What's my total payout and revenue for this month? Break it down by property." },
  { label: "Next check-ins", q: "Who are my next 5 check-ins across all properties? Show names, property, and arrival date." },
];

function parseChart(text) {
  const m = text.match(/<chart>([\s\S]*?)<\/chart>/);
  if (!m) return null;
  try { return JSON.parse(m[1].trim()); } catch { return null; }
}

function cleanText(text) {
  return text.replace(/<chart>[\s\S]*?<\/chart>/g, "").trim();
}

const TOOLTIP_STYLE = {
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  fontSize: 12,
  color: "#1a1a1a",
};

function ChartBlock({ data }) {
  if (!data) return null;
  const tickStyle = { fontSize: 11, fill: "#888" };
  const axisProps = { axisLine: false, tickLine: false, tick: tickStyle };

  if (data.type === "bar") {
    return (
      <div style={{ marginTop: 14 }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{data.title}</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(196,98,45,0.06)" }} />
            <Bar dataKey="value" fill="#C4622D" radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (data.type === "multibar") {
    return (
      <div style={{ marginTop: 14 }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{data.title}</p>
        <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
          {(data.keys || []).map(k => (
            <span key={k.key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666" }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: k.color, display: "inline-block" }} />
              {k.key}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(196,98,45,0.06)" }} />
            <Legend wrapperStyle={{ display: "none" }} />
            {(data.keys || []).map(k => (
              <Bar key={k.key} dataKey={k.key} fill={k.color} radius={[4, 4, 0, 0]} maxBarSize={32} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (data.type === "line") {
    return (
      <div style={{ marginTop: 14 }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{data.title}</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data.data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="value" stroke="#C4622D" strokeWidth={2} dot={{ fill: "#C4622D", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return null;
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#C4622D",
          display: "inline-block",
          animation: `dotpulse 1.2s ${i * 0.18}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const attempt = () => {
    if (value === PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#C4622D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5L2 5.5v5c0 4 3 6.7 7 7.7 4-1 7-3.7 7-7.7v-5L9 1.5z" fill="rgba(255,255,255,0.9)" />
            <path d="M6 9l2.5 2.5 4-4" stroke="#C4622D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1a1008", marginBottom: 6 }}>Greg's Sedona Retreats</h1>
        <p style={{ fontSize: 14, color: "#8a7060", marginBottom: 32 }}>STR Intelligence Dashboard</p>
        <input
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Enter password"
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: 14,
            border: `1px solid ${error ? "#e05c2d" : "rgba(0,0,0,0.15)"}`,
            borderRadius: 10,
            outline: "none",
            fontFamily: "inherit",
            color: "#1a1008",
            background: "#fff",
            marginBottom: 12,
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
          autoFocus
        />
        {error && <p style={{ fontSize: 12, color: "#e05c2d", marginBottom: 12 }}>Incorrect password</p>}
        <button
          onClick={attempt}
          style={{
            width: "100%",
            padding: "10px",
            background: "#C4622D",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const ask = async (q) => {
    const text = (q || query).trim();
    if (!text || loading) return;
    setQuery("");
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") || "No response received.";
      setMessages(prev => [...prev, { role: "assistant", content: cleanText(raw), chart: parseChart(raw) }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again.", chart: null }]);
    }
    setLoading(false);
  };

  const empty = messages.length === 0;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem 3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: empty ? "2.5rem" : "1.5rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#C4622D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5L2 5.5v5c0 4 3 6.7 7 7.7 4-1 7-3.7 7-7.7v-5L9 1.5z" fill="rgba(255,255,255,0.9)" />
            <path d="M6 9l2.5 2.5 4-4" stroke="#C4622D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15, color: "#1a1008" }}>Greg's Sedona Retreats</p>
          <p style={{ fontSize: 12, color: "#8a7060" }}>STR Intelligence &nbsp;·&nbsp; Sunup &nbsp;·&nbsp; Sundown &nbsp;·&nbsp; The Casita</p>
        </div>
      </div>

      {empty && (
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: "#1a1008", marginBottom: 8 }}>What do you want to know?</h1>
          <p style={{ fontSize: 15, color: "#8a7060", lineHeight: 1.5 }}>Ask anything about your portfolio — reservations, occupancy, revenue, reviews, or guests. Powered by live Hospitable data.</p>
        </div>
      )}

      {!empty && (
        <div style={{ marginBottom: "1.25rem" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              {m.role === "user" ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: "#C4622D", color: "white", borderRadius: "12px 12px 2px 12px", padding: "9px 15px", fontSize: 14, lineHeight: 1.5, maxWidth: "72%" }}>
                    {m.content}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "2px 12px 12px 12px", padding: "13px 17px", fontSize: 14, lineHeight: 1.7, color: "#1a1008" }}>
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{m.content}</p>
                  {m.chart && <ChartBlock data={m.chart} />}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "2px 12px 12px 12px", padding: "13px 17px" }}>
              <LoadingDots />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 14, overflow: "hidden" }}>
        <textarea
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
          placeholder="Ask about your properties, bookings, revenue, guests…"
          rows={2}
          style={{ width: "100%", padding: "13px 15px", fontSize: 14, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "inherit", color: "#1a1008", lineHeight: 1.5 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 12px 11px" }}>
          <span style={{ fontSize: 11, color: "#aaa" }}>↵ to send</span>
          <button
            className="ask-btn"
            onClick={() => ask()}
