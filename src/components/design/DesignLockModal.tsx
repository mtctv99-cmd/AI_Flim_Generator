import React from 'react';
import { Project } from '../../types/domain';
import { computeDesignPackageHash } from '../../core/stateEngine';
import { Lock, ShieldAlert, CheckCircle2, X, Sparkles, ArrowRight } from 'lucide-react';

interface DesignLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLock: () => void;
  project: Project;
}

export const DesignLockModal: React.FC<DesignLockModalProps> = ({
  isOpen,
  onClose,
  onConfirmLock,
  project
}) => {
  if (!isOpen) return null;

  const dp = project.designPackage;
  const hash = computeDesignPackageHash(dp);
  const selectedConcept = dp.concepts.find(c => c.id === dp.selectedConceptId) || dp.concepts[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-emerald-500/40 rounded-xl max-w-xl w-full p-6 shadow-2xl shadow-emerald-500/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-mono tracking-wide">ACTIVATE DESIGN LOCK</h2>
            <p className="text-xs text-emerald-400 font-mono">Autonomous Production Gatekeeper</p>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 mb-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-400 font-mono">Selected Concept:</span>
            <span className="text-zinc-200 font-bold font-mono">{selectedConcept.title}</span>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-400 font-mono">Locked Characters:</span>
            <span className="text-zinc-200 font-mono">{dp.characters.map(c => c.name).join(', ')}</span>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-400 font-mono">World Baseline:</span>
            <span className="text-zinc-200 font-mono truncate max-w-[280px]">{dp.world.name}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-zinc-400 font-mono">Snapshot Hash:</span>
            <span className="text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">{hash}</span>
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-5 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-300/90 leading-relaxed">
            <strong className="text-amber-200 block mb-0.5">Immutable Autonomous Production Contract</strong>
            By activating Design Lock, the core creative design becomes the ground truth. Production agents will autonomously break down scenes, compile visual prompts, generate video shots, and run QA retakes without asking for further text inputs.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-900 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800"
          >
            Review Design Further
          </button>
          <button
            onClick={onConfirmLock}
            className="px-5 py-2 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Confirm & Lock Design Package</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
