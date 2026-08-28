import React from 'react';
import { Project, ProjectState, ProviderType } from '../../types/domain';
import { 
  Film, 
  Sparkles, 
  Lock, 
  Play, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Activity, 
  Layers, 
  Download, 
  Plus, 
  CheckCircle2, 
  RotateCcw,
  Sliders
} from 'lucide-react';
import { soundEngine } from '../../core/mediaCanvasEngine';

interface HeaderProps {
  project: Project;
  onStateChange: (newState: ProjectState) => void;
  onOpenNewProject: () => void;
  onOpenDesignLock: () => void;
  onOpenAgentLogs: () => void;
  onOpenProviderModal: () => void;
  onStartAutonomousProduction: () => void;
  isProducing: boolean;
  activeView: 'design' | 'production' | 'qa' | 'timeline';
  onViewChange: (view: 'design' | 'production' | 'qa' | 'timeline') => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onStateChange,
  onOpenNewProject,
  onOpenDesignLock,
  onOpenAgentLogs,
  onOpenProviderModal,
  onStartAutonomousProduction,
  isProducing,
  activeView,
  onViewChange
}) => {
  const [isMuted, setIsMuted] = React.useState(true);

  const toggleAudio = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playAmbientDrone();
    }
  };

  const getStateBadgeColor = (state: ProjectState) => {
    switch (state) {
      case 'DRAFT': return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'DESIGNING': return 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse';
      case 'DESIGN_READY': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'USER_REVIEW': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'DESIGN_LOCKED': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'PRODUCTION_QUEUED':
      case 'PRODUCING': return 'bg-purple-500/15 text-purple-400 border-purple-500/30 animate-pulse';
      case 'QA':
      case 'REPAIRING': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'EDITING':
      case 'MASTERING':
      case 'FINAL_QC': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'COMPLETED': return 'bg-emerald-500 text-black font-semibold border-emerald-400';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Project Selector */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-wider text-sm text-zinc-100 font-mono">FLIM</span>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">Studio v0.1</span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block truncate max-w-[240px]">
                {project.title}
              </p>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-zinc-800 hidden sm:block" />

          {/* State Tag */}
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider border flex items-center gap-1.5 ${getStateBadgeColor(project.currentState)}`}>
            {project.currentState === 'PRODUCING' && <Activity className="w-3 h-3 animate-spin text-purple-400" />}
            {project.currentState === 'DESIGN_LOCKED' && <Lock className="w-3 h-3 text-emerald-400" />}
            {project.currentState === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-black" />}
            <span>{project.currentState.replace('_', ' ')}</span>
          </div>

          {/* New Project Button */}
          <button
            onClick={onOpenNewProject}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Film</span>
          </button>
        </div>

        {/* Center: Stage View Switcher Tabs */}
        <div className="hidden lg:flex items-center bg-zinc-900/90 p-1 rounded-lg border border-zinc-800/80">
          <button
            onClick={() => onViewChange('design')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'design'
                ? 'bg-zinc-800 text-cyan-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design Package</span>
          </button>

          <button
            onClick={() => onViewChange('production')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'production'
                ? 'bg-zinc-800 text-purple-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Shot Matrix</span>
          </button>

          <button
            onClick={() => onViewChange('qa')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'qa'
                ? 'bg-zinc-800 text-orange-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Vision QA</span>
          </button>

          <button
            onClick={() => onViewChange('timeline')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'timeline'
                ? 'bg-zinc-800 text-emerald-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Timeline & Master</span>
          </button>
        </div>

        {/* Right: Sound, Agent Telemetry, Provider, Stage Action */}
        <div className="flex items-center gap-2">
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            title={isMuted ? 'Unmute Cinematic Sound Engine' : 'Mute Sound'}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              !isMuted 
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-700/60' 
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
          </button>

          {/* Provider Selector Button */}
          <button
            onClick={onOpenProviderModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono"
            title="Configure LLM & Video Generation Providers"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{project.activeProvider}</span>
          </button>

          {/* Agent Reasoning Drawer Button */}
          <button
            onClick={onOpenAgentLogs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono"
            title="Agent Thought Trace & Telemetry"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Agents ({project.agentRuns.length})</span>
          </button>

          {/* Primary Lifecycle Action Button */}
          {project.currentState === 'DRAFT' && (
            <button
              onClick={() => onStateChange('DESIGNING')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesize Design</span>
            </button>
          )}

          {(project.currentState === 'USER_REVIEW' || project.currentState === 'DESIGN_READY') && (
            <button
              onClick={onOpenDesignLock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>ACTIVATE DESIGN LOCK</span>
            </button>
          )}

          {project.currentState === 'DESIGN_LOCKED' && (
            <button
              onClick={onStartAutonomousProduction}
              disabled={isProducing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-xs transition-all shadow-md shadow-purple-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Autonomous Production</span>
            </button>
          )}

          {(project.currentState === 'PRODUCING' || project.currentState === 'QA' || project.currentState === 'REPAIRING') && (
            <button
              onClick={() => onViewChange('production')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-950/80 border border-purple-600/50 text-purple-300 font-semibold text-xs animate-pulse"
            >
              <Activity className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              <span>Autonomous Pipeline Active</span>
            </button>
          )}

          {(project.currentState === 'COMPLETED' || project.currentState === 'MASTERING') && (
            <button
              onClick={() => onViewChange('timeline')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>View / Export Film</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
