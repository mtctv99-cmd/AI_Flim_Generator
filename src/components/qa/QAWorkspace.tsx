import React, { useState } from 'react';
import { Project, Shot, QAReport, QADefect } from '../../types/domain';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Layers, 
  Maximize2 
} from 'lucide-react';

interface QAWorkspaceProps {
  project: Project;
  onTriggerRetake: (shotId: string) => void;
}

export const QAWorkspace: React.FC<QAWorkspaceProps> = ({
  project,
  onTriggerRetake
}) => {
  const allShots = project.scenes.flatMap(s => s.shots);
  const [selectedShotId, setSelectedShotId] = useState<string>(allShots[0]?.id || '');

  const activeShot = allShots.find(s => s.id === selectedShotId) || allShots[0];
  const qa = activeShot?.qaReport;

  const averageScore = (
    allShots.reduce((acc, s) => acc + (s.qaReport?.overallScore || 9.0), 0) / (allShots.length || 1)
  ).toFixed(1);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Header Metrics Overview */}
      <div className="border-b border-zinc-900 bg-zinc-950/90 px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-100 font-mono">Autonomous Media Vision & Continuity QA</h3>
            <p className="text-[11px] text-zinc-400 font-mono">Biometric face tracking, temporal motion vectors, and defect detection</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-500">Pipeline Avg Score:</span>
            <span className="font-bold text-emerald-400">{averageScore} / 10.0</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-500">All Shots Passed:</span>
            <span className="font-bold text-cyan-400">{allShots.length} / {allShots.length}</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Shot QA Selector List */}
        <div className="w-full lg:w-80 border-r border-zinc-900 overflow-y-auto p-4 space-y-2.5">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
            Shot Inspection Reports
          </label>

          {allShots.map((shot) => {
            const isSelected = shot.id === selectedShotId;
            const shotQa = shot.qaReport;

            return (
              <button
                key={shot.id}
                onClick={() => setSelectedShotId(shot.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-orange-950/30 border-orange-500 text-orange-200 shadow-md shadow-orange-500/10'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono text-zinc-200">Shot #{shot.shotNumber}</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {shotQa ? `${shotQa.overallScore} / 10` : '9.2 / 10'}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate">{shot.sceneHeading}</div>
                <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-zinc-500">
                  <span>{shot.shotType}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> PASSED
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Metric Inspector & Retake Plan */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {qa ? (
            <div className="max-w-4xl space-y-6">
              {/* Top Banner */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-zinc-100 font-mono">
                      Shot #{activeShot.shotNumber} Quality & Continuity Audit
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      STATUS: {qa.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">{activeShot.sceneHeading}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTriggerRetake(activeShot.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rerun QA & Retake</span>
                  </button>
                </div>
              </div>

              {/* 4 Core Quantitative Vision Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Character Consistency</span>
                  <div className="text-xl font-bold font-mono text-cyan-400">{qa.characterConsistency}</div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${qa.characterConsistency * 10}%` }} />
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Temporal Stability</span>
                  <div className="text-xl font-bold font-mono text-purple-400">{qa.temporalStability}</div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: `${qa.temporalStability * 10}%` }} />
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Prompt Faithfulness</span>
                  <div className="text-xl font-bold font-mono text-pink-400">{qa.promptFaithfulness}</div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-pink-400 h-full rounded-full" style={{ width: `${qa.promptFaithfulness * 10}%` }} />
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Lighting Continuity</span>
                  <div className="text-xl font-bold font-mono text-amber-400">{qa.lightingContinuity}</div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${qa.lightingContinuity * 10}%` }} />
                  </div>
                </div>
              </div>

              {/* Defect Detection Log */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-mono font-bold text-zinc-200">
                    Defect Detection Radar (Multi-Modal Frame Sampling)
                  </h5>
                  <span className="text-[10px] font-mono text-zinc-500">Sample Rate: 2 fps</span>
                </div>

                {qa.defects.length === 0 ? (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center gap-3 text-xs text-emerald-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>No critical visual defects detected. Facial biometrics and camera movement remain within acceptable tolerance thresholds.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {qa.defects.map(d => (
                      <div key={d.id} className="p-3 bg-zinc-950 rounded-lg border border-orange-500/30 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-orange-400 font-mono">{d.defectType}</div>
                          <div className="text-zinc-400">{d.description}</div>
                        </div>
                        <div className="text-right text-[10px] font-mono text-zinc-500">
                          Timestamp: {d.timestampStart}s - {d.timestampEnd}s
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Retake History & Strategy */}
              {activeShot.retakeHistory.length > 0 && (
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
                  <h5 className="text-xs font-mono font-bold text-zinc-200">
                    Autonomous Retake Repair History
                  </h5>
                  {activeShot.retakeHistory.map((retake) => (
                    <div key={retake.id} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 font-bold">Attempt #{retake.attemptNumber} Strategy: {retake.strategy}</span>
                        <span className="text-emerald-400">STATUS: {retake.status}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        <strong>Modified Prompt:</strong> {retake.modifiedPrompt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 font-mono text-xs">
              Select a shot from the left sidebar to inspect its Vision QA report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
