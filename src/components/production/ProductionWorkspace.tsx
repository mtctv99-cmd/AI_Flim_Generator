import React, { useState, useRef, useEffect } from 'react';
import { Project, Shot, ShotVariant, Scene } from '../../types/domain';
import { 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Activity, 
  Camera, 
  Maximize2, 
  Sliders, 
  Cpu, 
  AlertTriangle 
} from 'lucide-react';
import { drawCinematicFrame } from '../../core/mediaCanvasEngine';

interface ProductionWorkspaceProps {
  project: Project;
  onSelectVariant: (shotId: string, variantId: string) => void;
  onTriggerRetake: (shotId: string) => void;
  isProducing: boolean;
  onToggleProducing: () => void;
}

export const ProductionWorkspace: React.FC<ProductionWorkspaceProps> = ({
  project,
  onSelectVariant,
  onTriggerRetake,
  isProducing,
  onToggleProducing
}) => {
  const [selectedShotId, setSelectedShotId] = useState<string>(
    project.scenes[0]?.shots[0]?.id || ''
  );
  const [previewProgress, setPreviewProgress] = useState<number>(0.3);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const allShots = project.scenes.flatMap(s => s.shots);
  const activeShot = allShots.find(s => s.id === selectedShotId) || allShots[0];

  // Animated canvas preview loop for active shot
  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const render = () => {
      const canvas = canvasRef.current;
      if (canvas && activeShot) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const elapsed = (performance.now() - startTime) / 1000;
          const currentProgress = (elapsed % (activeShot.durationSeconds || 4)) / (activeShot.durationSeconds || 4);
          setPreviewProgress(currentProgress);

          drawCinematicFrame(ctx, {
            width: canvas.width,
            height: canvas.height,
            progress: currentProgress,
            shotType: activeShot.shotType,
            cameraMovement: activeShot.cameraMovement,
            lightingCue: activeShot.lightingCue,
            seed: activeShot.variants[0]?.seed || 42,
            aspectRatio: project.aspectRatio
          });
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeShot, project.aspectRatio]);

  const getStatusBadge = (shot: Shot) => {
    switch (shot.status) {
      case 'LOCKED':
      case 'QA_PASSED':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> LOCKED & PASSED</span>;
      case 'GENERATING':
      case 'QA_CHECKING':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 animate-pulse"><Activity className="w-2.5 h-2.5 animate-spin" /> GENERATING ({shot.progressPct}%)</span>;
      case 'RETAKE_QUEUED':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1"><RotateCcw className="w-2.5 h-2.5" /> RETAKE #{shot.retakeCount}</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-400 text-[10px] font-mono px-2 py-0.5 rounded">{shot.status}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Top Controller Bar */}
      <div className="border-b border-zinc-900 bg-zinc-950/90 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-zinc-100 font-mono">Autonomous Shot Matrix</h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {allShots.length} Shots Planned • {allShots.filter(s => s.status === 'LOCKED' || s.status === 'QA_PASSED').length} Completed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleProducing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              isProducing
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 hover:from-purple-400 hover:to-pink-400'
            }`}
          >
            {isProducing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isProducing ? 'Pause Engine' : 'Run Autonomous Production'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Shot Grid (Left/Center) + Active Shot Inspector (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Shot Matrix List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allShots.map((shot) => {
              const isSelected = shot.id === selectedShotId;
              const selectedVar = shot.variants.find(v => v.id === shot.selectedVariantId) || shot.variants[0];

              return (
                <div
                  key={shot.id}
                  onClick={() => setSelectedShotId(shot.id)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900/90 border-purple-500 shadow-lg shadow-purple-500/10'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-200">
                          Shot #{shot.shotNumber}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {shot.shotType} • {shot.cameraMovement}
                        </span>
                      </div>
                      {getStatusBadge(shot)}
                    </div>

                    <div className="text-[11px] font-mono text-zinc-400 truncate">
                      {shot.sceneHeading}
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {shot.visualPrompt}
                    </p>

                    {/* Variant Tabs & Micro Preview */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-zinc-500">Variants:</span>
                        {shot.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectVariant(shot.id, v.id);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              v.id === shot.selectedVariantId
                                ? 'bg-cyan-500 text-black font-bold'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            V{v.variantIndex} (QA: {v.qaScore})
                          </button>
                        ))}
                      </div>

                      <span className="text-[10px] font-mono text-zinc-400">
                        {shot.durationSeconds}s @ 24fps
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Realtime Canvas Shot Visualizer & Parameter Deep-Dive */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-zinc-900 bg-zinc-950 p-4 lg:p-6 overflow-y-auto space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-bold text-zinc-200">
                Live Shot Render Preview
              </h4>
              <span className="text-[10px] font-mono text-cyan-400">
                {activeShot.shotType} • {activeShot.cameraMovement}
              </span>
            </div>

            {/* Dynamic Animated Canvas Preview */}
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-800 shadow-inner relative">
              <canvas
                ref={canvasRef}
                width={384}
                height={216}
                className="w-full h-auto aspect-video block"
              />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                <span>Timecode: 00:00:{Math.floor(previewProgress * activeShot.durationSeconds).toString().padStart(2, '0')}:12</span>
                <span className="text-emerald-400">FPS: 24.0</span>
              </div>
            </div>
          </div>

          {/* Prompt & Generation Parameters */}
          <div className="space-y-3 text-xs">
            <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block">Compiled Visual Prompt</span>
              <p className="text-zinc-300 leading-relaxed text-[11px] font-mono">{activeShot.visualPrompt}</p>
            </div>

            {activeShot.audioDialogue && (
              <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase block">Dialogue Audio Track</span>
                <p className="text-amber-200 text-xs italic">{activeShot.audioDialogue}</p>
              </div>
            )}

            <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Camera Move:</span>
                <span className="text-zinc-200">{activeShot.cameraMovement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Duration:</span>
                <span className="text-zinc-200">{activeShot.durationSeconds} seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Retake Cycles:</span>
                <span className="text-zinc-200">{activeShot.retakeCount} / 3 max</span>
              </div>
            </div>

            {/* Targeted Retake Action Button */}
            <button
              onClick={() => onTriggerRetake(activeShot.id)}
              className="w-full py-2 rounded-lg text-xs font-mono font-bold bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Trigger Targeted AI Retake</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
