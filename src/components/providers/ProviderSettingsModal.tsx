import React from 'react';
import { ProviderType } from '../../types/domain';
import { Cpu, X, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

interface ProviderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProvider: ProviderType;
  onSelectProvider: (provider: ProviderType) => void;
}

export const ProviderSettingsModal: React.FC<ProviderSettingsModalProps> = ({
  isOpen,
  onClose,
  activeProvider,
  onSelectProvider
}) => {
  if (!isOpen) return null;

  const providers: Array<{
    id: ProviderType;
    name: string;
    description: string;
    speed: string;
    cost: string;
    tag: string;
  }> = [
    {
      id: 'GEMINI_VEO',
      name: 'Google Gemini 2.5 + Veo Engine',
      description: 'Native full-stack pipeline: Gemini 2.5 Pro for script/QA vision, Veo 2 for video generation.',
      speed: 'Ultra Fast (~3-5s per shot)',
      cost: 'Included in AI Studio',
      tag: 'RECOMMENDED'
    },
    {
      id: 'SEEDANCE',
      name: 'Seedance 2.0 Production Pipeline',
      description: 'Specialized film production framework with multi-pass reference image anchoring.',
      speed: 'Standard (~8s per shot)',
      cost: 'API Key Required',
      tag: 'CINEMATIC'
    },
    {
      id: 'RUNWAY',
      name: 'Runway Gen-3 Alpha Adapter',
      description: 'Camera motion control with keyframe interpolation and director mode guidance.',
      speed: 'Standard (~10s per shot)',
      cost: 'API Key Required',
      tag: 'DIRECTOR'
    },
    {
      id: 'FLOW',
      name: 'Flow Open Video Engine',
      description: 'Open-weights diffusion backbone for local/cloud video generation with custom LoRA.',
      speed: 'Variable',
      cost: 'Self-Hosted',
      tag: 'OPEN-SOURCE'
    },
    {
      id: 'MOCK',
      name: 'Deterministic Mock Engine Suite',
      description: 'Zero-cost offline test suite. Generates instant schema-compliant shots and QA reports.',
      speed: 'Instant (0ms)',
      cost: 'Free ($0.00)',
      tag: 'TEST & DEV'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 font-mono">Generation Provider Gateway</h3>
            <p className="text-xs text-zinc-400 font-mono">Decoupled LLM, Image & Video generation adapters</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {providers.map((p) => {
            const isSelected = activeProvider === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectProvider(p.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-100">{p.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{p.description}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 pt-0.5">
                    <span>Speed: {p.speed}</span> • <span>Cost: {p.cost}</span>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-zinc-700 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300"
          >
            Apply & Save Provider
          </button>
        </div>
      </div>
    </div>
  );
};
