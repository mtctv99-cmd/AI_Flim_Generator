import React from 'react';
import { AgentRun } from '../../types/domain';
import { Cpu, X, Sparkles, Clock, CheckCircle2, AlertCircle, ChevronRight, Terminal } from 'lucide-react';

interface AgentLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agentRuns: AgentRun[];
}

export const AgentLogDrawer: React.FC<AgentLogDrawerProps> = ({
  isOpen,
  onClose,
  agentRuns
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-zinc-950/95 border-l border-zinc-800 shadow-2xl backdrop-blur-md flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-100 font-mono">Agent Reasoning Telemetry</h3>
            <p className="text-[10px] text-zinc-400 font-mono">Structured output validation & Chain-of-Thought logs</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {agentRuns.map((run) => (
          <div key={run.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-purple-300">{run.agentName}</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {run.stage}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> SUCCESS
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-y border-zinc-800/80 py-1.5">
              <span>Model: <strong className="text-zinc-300">{run.model}</strong></span>
              <span>Latency: <strong className="text-zinc-300">{run.durationMs}ms</strong></span>
              <span>Tokens: <strong className="text-zinc-300">{run.tokens.prompt + run.tokens.completion}</strong></span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{run.logSummary}</p>

            {run.thoughtTrace.length > 0 && (
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/60 space-y-1 text-[11px] font-mono">
                <div className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  Chain of Thought Trace
                </div>
                {run.thoughtTrace.map((thought, idx) => (
                  <div key={idx} className="text-zinc-400 pl-2 border-l border-zinc-800">
                    › {thought}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
