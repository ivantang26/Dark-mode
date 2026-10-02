"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Hero terminal (FR-2): types a curl request at ~40 characters per second, then
 * streams the response line by line. Real text, so it stays selectable and light.
 * Reduced motion: the final state, no replay.
 */

type Seg = { t: string; c?: string };

const S = {
  prompt: "text-lime",
  cmd: "text-cyan",
  flag: "text-violet-soft",
  str: "text-lime",
  key: "text-[#a5f3fc]",
  mute: "text-mute",
  ok: "text-lime",
};

const REQUEST: Seg[][] = [
  [{ t: "$ ", c: S.prompt }, { t: "curl", c: S.cmd }, { t: " api.synapse.example/v1/chat \\" }],
  [{ t: "    " }, { t: "-H", c: S.flag }, { t: " " }, { t: '"Authorization: Bearer $SYNAPSE_KEY"', c: S.str }, { t: " \\" }],
  [{ t: "    " }, { t: "-d", c: S.flag }, { t: " " }, { t: `'{"model": "syn-flash", "stream": true,`, c: S.str }],
  [{ t: `      "messages": [{"role": "user",`, c: S.str }],
  [{ t: `      "content": "Explain latency in 8 words"}]}'`, c: S.str }],
];

const WORDS = ["Latency:", " the", " pause", " between", " asking", " and", " knowing."];

const RESPONSE: Seg[][] = [
  [{ t: "HTTP/2 ", c: S.mute }, { t: "200 OK", c: S.ok }, { t: "  · first token 112ms", c: S.mute }],
  ...WORDS.map((w): Seg[] => [{ t: "data: ", c: S.flag }, { t: "{" }, { t: '"delta"', c: S.key }, { t: ": " }, { t: JSON.stringify(w), c: S.str }, { t: "}" }]),
  [{ t: "data: ", c: S.flag }, { t: "[DONE]", c: S.mute }],
];

const REQUEST_CHARS = REQUEST.reduce((n, line) => n + line.reduce((m, s) => m + s.t.length, 0), 0) + REQUEST.length - 1;
const CHAR_MS = 25; // 40 characters per second
const THINK_MS = 420;
const LINE_MS = 110;

type State = { typed: number; lines: number };
const FINAL: State = { typed: REQUEST_CHARS, lines: RESPONSE.length };

function renderTyped(lines: Seg[][], budget: number) {
  const out: React.ReactNode[] = [];
  let left = budget;
  lines.forEach((line, li) => {
    if (left <= 0 && li > 0) return;
    const parts: React.ReactNode[] = [];
    for (let si = 0; si < line.length && left > 0; si++) {
      const seg = line[si];
      const text = seg.t.slice(0, left);
      left -= text.length;
      parts.push(
        <span key={si} className={seg.c}>
          {text}
        </span>,
      );
    }
    out.push(<div key={li}>{parts.length ? parts : " "}</div>);
    left -= 1; // the newline
  });
  return out;
}

function renderLines(lines: Seg[][], count: number) {
  return lines.slice(0, count).map((line, li) => (
    <div key={li}>
      {line.map((seg, si) => (
        <span key={si} className={seg.c}>
          {seg.t}
        </span>
      ))}
    </div>
  ));
}

const plain = (lines: Seg[][]) => lines.map((l) => l.map((s) => s.t).join("")).join("\n");

export default function Terminal() {
  const [state, setState] = useState<State>(FINAL);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timers = useRef<number[]>([]);
  const root = useRef<HTMLDivElement>(null);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    setState({ typed: 0, lines: 0 });
    let t = 300;
    for (let i = 1; i <= REQUEST_CHARS; i++) {
      timers.current.push(window.setTimeout(() => setState({ typed: i, lines: 0 }), t));
      t += CHAR_MS;
    }
    t += THINK_MS;
    for (let l = 1; l <= RESPONSE.length; l++) {
      timers.current.push(window.setTimeout(() => setState({ typed: REQUEST_CHARS, lines: l }), t));
      t += l === 1 ? LINE_MS * 2 : LINE_MS;
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      return;
    }
    setState({ typed: 0, lines: 0 });
    // Start when the card is on screen (it usually is: it's in the hero).
    const el = root.current;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          play();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (el) io.observe(el);
    else play();
    const onChange = () => {
      if (mq.matches) {
        clear();
        setReduced(true);
        setState(FINAL);
      }
    };
    mq.addEventListener("change", onChange);
    return () => {
      clear();
      io.disconnect();
      mq.removeEventListener("change", onChange);
    };
  }, [play]);

  const typing = state.typed < REQUEST_CHARS;
  const waiting = !typing && state.lines === 0;
  const done = state.lines >= RESPONSE.length;
  const answer = WORDS.slice(0, Math.max(0, state.lines - 1)).join("");

  return (
    <div ref={root} className="card overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(139,92,246,0.08)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#2a2a36]" />
          <span className="size-2.5 rounded-full bg-[#2a2a36]" />
          <span className="size-2.5 rounded-full bg-[#2a2a36]" />
        </div>
        <span className="font-mono text-[12px] text-mute">bash: first request</span>
        {!reduced && (
          <button
            type="button"
            onClick={() => {
              track("terminal_replay");
              play();
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[12px] text-mute transition-colors hover:text-text"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" />
              <path d="M2.5 2v3h3" />
            </svg>
            Replay
          </button>
        )}
      </div>

      <p className="sr-only">
        Example request: {plain(REQUEST)}. Response: HTTP 200, first token in 112 milliseconds, streamed text: {WORDS.join("")}
      </p>

      <div className="relative overflow-x-auto" aria-hidden="true">
        {/* Grid stack: an invisible final frame reserves the height, so nothing below jumps. */}
        <div className="grid min-w-max whitespace-pre p-4 font-mono text-[12px] leading-[1.75] md:text-[13px] lg:text-[13.5px]">
          <div className="invisible col-start-1 row-start-1 select-none">
            {renderLines(REQUEST, REQUEST.length)}
            <div className="h-3" />
            {renderLines(RESPONSE, RESPONSE.length)}
          </div>
          <div className={`col-start-1 row-start-1 ${!mounted ? "terminal-ssr" : ""}`}>
            {renderTyped(REQUEST, state.typed)}
            {typing && <span className="caret" />}
            <div className="h-3" />
            {waiting && (
              <div className="text-mute">
                <span className="caret" /> waiting for first token…
              </div>
            )}
            {renderLines(RESPONSE, state.lines)}
          </div>
        </div>
      </div>

      <div className="flex min-h-[52px] items-center gap-3 border-t border-line bg-bg/50 px-4 py-3">
        <span className="font-mono text-[12px] text-violet-soft">&gt;</span>
        <span className={`text-[15px] ${answer ? "text-text" : "text-mute"} ${!mounted ? "terminal-ssr" : ""}`}>{answer || (done ? "" : "…")}</span>
        {done && (
          <span className="ml-auto hidden whitespace-nowrap font-mono text-[12px] text-mute sm:inline">11 tokens · 0.21s</span>
        )}
      </div>
    </div>
  );
}
