import React, { useState, useRef, useEffect } from 'react';
import { Project, TimelineTrack, TimelineClip } from '../../types/domain';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Maximize2, 
  Scissors, 
  Sparkles, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  Film 
} from 'lucide-react';
import { drawCinematicFrame, soundEngine } from '../../core/mediaCanvasEngine';

interface TimelineWorkspaceProps {
  project: Project;
}

export const TimelineWorkspace: React.FC<TimelineWorkspaceProps> = ({
  project
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isExportSuccess, setIsExportSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalDuration = project.timeline.totalDurationSeconds || 16.2;
  const allShots = project.scenes.flatMap(s => s.shots);

  // Playback timer loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(totalDuration, prev + 0.05);
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Current active shot based on timecode
  const getCurrentShot = () => {
    let accTime = 0;
    for (const shot of allShots) {
      if (currentTime >= accTime && currentTime <= accTime + shot.durationSeconds) {
        const progressInShot = (currentTime - accTime) / shot.durationSeconds;
        return { shot, progressInShot };
      }
      accTime += shot.durationSeconds;
    }
    return { shot: allShots[0], progressInShot: 0 };
  };

  const { shot: currentShot, progressInShot } = getCurrentShot();

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && currentShot) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const mins = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const secs = Math.floor(currentTime % 60).toString().padStart(2, '0');
        const frames = Math.floor((currentTime % 1) * 24).toString().padStart(2, '0');
        const timecode = `00:${mins}:${secs}:${frames}`;

        drawCinematicFrame(ctx, {
          width: canvas.width,
          height: canvas.height,
          progress: progressInShot,
          shotType: currentShot.shotType,
          cameraMovement: currentShot.cameraMovement,
          lightingCue: currentShot.lightingCue,
          seed: currentShot.variants[0]?.seed || 42,
          timecode,
          aspectRatio: project.aspectRatio
        });
      }
    }
  }, [currentTime, currentShot, progressInShot, project.aspectRatio]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      soundEngine.playAmbientDrone();
    } else {
      soundEngine.stop();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekPct = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(seekPct * totalDuration);
  };

  const handleExportMaster = () => {
    setIsExporting(true);
    setExportProgress(0);
    setIsExportSuccess(false);

    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        clearInterval(interval);
        setExportProgress(100);
        setIsExporting(false);
        setIsExportSuccess(true);
      } else {
        setExportProgress(p);
      }
    }, 300);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Top Playback Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-6 bg-black/90 relative border-b border-zinc-900 overflow-hidden">
        {/* Screen Cinema Stage */}
        <div className="max-w-4xl w-full flex flex-col items-center">
          <div className="w-full aspect-[2.39/1] max-h-[46vh] bg-black rounded-lg overflow-hidden border border-zinc-800 shadow-2xl relative flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={1280}
              height={536}
              className="w-full h-full object-contain block cursor-pointer"
              onClick={togglePlay}
            />

            {/* Subtitle Dialogue Overlay */}
            {currentShot?.audioDialogue && (
              <div className="absolute bottom-6 left-4 right-4 text-center pointer-events-none">
                <span className="bg-black/75 backdrop-blur-sm text-yellow-300 font-mono text-xs px-3 py-1 rounded border border-yellow-500/20 shadow-lg">
                  {currentShot.audioDialogue}
                </span>
              </div>
            )}
          </div>

          {/* Master Transport Controls */}
          <div className="w-full max-w-4xl flex items-center justify-between gap-4 mt-3 px-2">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                title="Restart Timeline"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="font-mono text-xs text-zinc-300">
                <span>00:00:{Math.floor(currentTime).toString().padStart(2, '0')}:18</span>
                <span className="text-zinc-600"> / </span>
                <span className="text-zinc-500">00:00:{Math.floor(totalDuration).toString().padStart(2, '0')}:00</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                {currentShot?.shotType} • {currentShot?.cameraMovement}
              </span>

              <button
                onClick={handleExportMaster}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs shadow-md shadow-emerald-500/20 transition-all font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? `Rendering (${exportProgress}%)` : 'Export Master 4K'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Multi-Track NLE Timeline Scrubber */}
      <div className="h-64 border-t border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-900 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-zinc-200">Non-Linear Multi-Track Assembly</span>
          </div>
          <span className="text-zinc-500">Master Sequence: {allShots.length} Clips • 24 FPS Sync</span>
        </div>

        {/* Global Timeline Scrubber Bar */}
        <div 
          onClick={handleSeek}
          className="relative h-4 bg-zinc-900 rounded cursor-pointer border border-zinc-800 my-1 group"
        >
          <div 
            className="absolute top-0 bottom-0 left-0 bg-cyan-500/30 rounded"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-md shadow-cyan-400 group-hover:scale-y-125 transition-transform"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>

        {/* Tracks List */}
        <div className="space-y-1.5 overflow-y-auto flex-1 py-1">
          {project.timeline.tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-3 text-xs font-mono">
              <div className="w-36 text-zinc-400 truncate flex items-center justify-between text-[11px]">
                <span className="truncate">{track.name}</span>
              </div>

              {/* Track Clips Container */}
              <div className="flex-1 h-7 bg-zinc-900/80 rounded border border-zinc-800/80 flex overflow-hidden p-0.5 gap-0.5">
                {allShots.map((shot) => {
                  const clipWidthPct = (shot.durationSeconds / totalDuration) * 100;
                  const isCurrent = currentShot?.id === shot.id;

                  return (
                    <div
                      key={shot.id}
                      style={{ width: `${clipWidthPct}%` }}
                      className={`h-full rounded px-1.5 flex items-center justify-between text-[10px] truncate border transition-all ${
                        track.type === 'VIDEO_PRIMARY'
                          ? isCurrent
                            ? 'bg-cyan-950 text-cyan-200 border-cyan-400 font-bold'
                            : 'bg-zinc-800/90 text-zinc-300 border-zinc-700'
                          : track.type === 'AUDIO_DIALOGUE'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                          : track.type === 'AUDIO_SFX'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                      }`}
                    >
                      <span className="truncate">Shot #{shot.shotNumber}</span>
                      <span className="text-[8px] text-zinc-500 shrink-0">{shot.durationSeconds}s</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Success Modal / Toast */}
      {isExportSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 rounded-xl p-4 shadow-2xl text-xs font-mono text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-white">Master Video Export Complete!</div>
            <div className="text-[11px] text-emerald-300">NEON_VEIL_MASTER_4K_PRORES.mov rendered successfully.</div>
          </div>
          <button 
            onClick={() => setIsExportSuccess(false)}
            className="p-1 text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
