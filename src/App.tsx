import React, { useState, useEffect } from 'react';
import { Project, ProjectState, ProviderType } from './types/domain';
import { createDefaultProject } from './core/defaultProject';
import { createAutonomousProductionShots, isValidTransition } from './core/stateEngine';
import { Header } from './components/layout/Header';
import { StateBreadcrumbs } from './components/layout/StateBreadcrumbs';
import { NewProjectModal } from './components/layout/NewProjectModal';
import { DesignLockModal } from './components/design/DesignLockModal';
import { DesignWorkspace } from './components/design/DesignWorkspace';
import { ProductionWorkspace } from './components/production/ProductionWorkspace';
import { QAWorkspace } from './components/qa/QAWorkspace';
import { TimelineWorkspace } from './components/timeline/TimelineWorkspace';
import { AgentLogDrawer } from './components/agents/AgentLogDrawer';
import { ProviderSettingsModal } from './components/providers/ProviderSettingsModal';
import { soundEngine } from './core/mediaCanvasEngine';

export default function App() {
  const [project, setProject] = useState<Project>(() => createDefaultProject());
  const [activeView, setActiveView] = useState<'design' | 'production' | 'qa' | 'timeline'>('design');

  // Modals & Drawers state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isDesignLockOpen, setIsDesignLockOpen] = useState(false);
  const [isAgentLogsOpen, setIsAgentLogsOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isProducing, setIsProducing] = useState(false);

  // Auto-switch view based on state change
  const handleStateChange = (nextState: ProjectState) => {
    setProject(prev => ({
      ...prev,
      currentState: nextState,
      updatedAt: new Date().toISOString()
    }));

    if (['DRAFT', 'DESIGNING', 'DESIGN_READY', 'USER_REVIEW', 'DESIGN_LOCKED'].includes(nextState)) {
      setActiveView('design');
    } else if (['PRODUCTION_QUEUED', 'PRODUCING'].includes(nextState)) {
      setActiveView('production');
    } else if (['QA', 'REPAIRING'].includes(nextState)) {
      setActiveView('qa');
    } else {
      setActiveView('timeline');
    }
  };

  // Concept Selection
  const handleSelectConcept = (conceptId: string) => {
    setProject(prev => ({
      ...prev,
      designPackage: {
        ...prev.designPackage,
        selectedConceptId: conceptId
      },
      updatedAt: new Date().toISOString()
    }));
  };

  // Concept Regeneration
  const handleRegenerateConcept = (conceptId: string) => {
    setProject(prev => ({
      ...prev,
      designPackage: {
        ...prev.designPackage,
        concepts: prev.designPackage.concepts.map(c => 
          c.id === conceptId 
            ? { ...c, logline: `${c.logline} (Enhanced with deep neo-noir tension & optical flares)` }
            : c
        )
      }
    }));
  };

  // Confirm Design Lock
  const handleConfirmDesignLock = () => {
    setIsDesignLockOpen(false);
    setProject(prev => ({
      ...prev,
      currentState: 'DESIGN_LOCKED',
      updatedAt: new Date().toISOString()
    }));
  };

  // Variant Selection in Production
  const handleSelectVariant = (shotId: string, variantId: string) => {
    setProject(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => ({
        ...scene,
        shots: scene.shots.map(shot => 
          shot.id === shotId
            ? { ...shot, selectedVariantId: variantId }
            : shot
        )
      }))
    }));
  };

  // Targeted Retake
  const handleTriggerRetake = (shotId: string) => {
    soundEngine.playSfxGlitch();
    setProject(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => ({
        ...scene,
        shots: scene.shots.map(shot => {
          if (shot.id === shotId) {
            const nextRetakeCount = shot.retakeCount + 1;
            return {
              ...shot,
              status: 'RETAKE_QUEUED',
              retakeCount: nextRetakeCount,
              retakeHistory: [
                ...shot.retakeHistory,
                {
                  id: `retake-${Date.now()}`,
                  shotId,
                  qaReportId: shot.qaReport?.id || 'qa-auto',
                  attemptNumber: nextRetakeCount,
                  strategy: 'PROMPT_ADJUSTMENT' as const,
                  originalPrompt: shot.visualPrompt,
                  modifiedPrompt: `${shot.visualPrompt}, ultra-stable facial geometry, zero morphing`,
                  status: 'COMPLETED' as const
                }
              ]
            };
          }
          return shot;
        })
      }))
    }));

    setTimeout(() => {
      setProject(prev => ({
        ...prev,
        scenes: prev.scenes.map(scene => ({
          ...scene,
          shots: scene.shots.map(shot => 
            shot.id === shotId
              ? { ...shot, status: 'QA_PASSED' }
              : shot
          )
        }))
      }));
    }, 1200);
  };

  // Autonomous Production Runner Pipeline
  const startAutonomousProduction = () => {
    setIsProducing(true);
    setActiveView('production');

    // Stage 1: Breakdown screenplay & generate shots
    const scenes = createAutonomousProductionShots(project);
    
    setProject(prev => ({
      ...prev,
      currentState: 'PRODUCTION_QUEUED',
      scenes,
      updatedAt: new Date().toISOString()
    }));

    // Stage 2: Producing simulation
    setTimeout(() => {
      setProject(prev => ({
        ...prev,
        currentState: 'PRODUCING'
      }));
    }, 1000);

    // Stage 3: QA inspection
    setTimeout(() => {
      setProject(prev => ({
        ...prev,
        currentState: 'QA'
      }));
      setActiveView('qa');
    }, 3000);

    // Stage 4: Timeline Editing & Mastering
    setTimeout(() => {
      setProject(prev => ({
        ...prev,
        currentState: 'MASTERING'
      }));
      setActiveView('timeline');
      setIsProducing(false);
    }, 5500);

    // Stage 5: Completed
    setTimeout(() => {
      setProject(prev => ({
        ...prev,
        currentState: 'COMPLETED'
      }));
    }, 7000);
  };

  const handleCreateNewProject = (customData: Partial<Project>) => {
    const newProj = createDefaultProject(customData.title);
    setProject({
      ...newProj,
      ...customData,
      currentState: 'USER_REVIEW'
    });
    setActiveView('design');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased overflow-hidden select-none font-sans">
      {/* Top Application Header */}
      <Header
        project={project}
        onStateChange={handleStateChange}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenDesignLock={() => setIsDesignLockOpen(true)}
        onOpenAgentLogs={() => setIsAgentLogsOpen(true)}
        onOpenProviderModal={() => setIsProviderModalOpen(true)}
        onStartAutonomousProduction={startAutonomousProduction}
        isProducing={isProducing}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* 13-Stage Pipeline State Breadcrumbs */}
      <StateBreadcrumbs
        currentState={project.currentState}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeView === 'design' && (
          <DesignWorkspace
            project={project}
            onSelectConcept={handleSelectConcept}
            onRegenerateConcept={handleRegenerateConcept}
            onOpenDesignLock={() => setIsDesignLockOpen(true)}
          />
        )}

        {activeView === 'production' && (
          <ProductionWorkspace
            project={project}
            onSelectVariant={handleSelectVariant}
            onTriggerRetake={handleTriggerRetake}
            isProducing={isProducing}
            onToggleProducing={() => {
              if (isProducing) {
                setIsProducing(false);
              } else {
                startAutonomousProduction();
              }
            }}
          />
        )}

        {activeView === 'qa' && (
          <QAWorkspace
            project={project}
            onTriggerRetake={handleTriggerRetake}
          />
        )}

        {activeView === 'timeline' && (
          <TimelineWorkspace
            project={project}
          />
        )}
      </main>

      {/* Modals & Telemetry Drawers */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateNewProject}
      />

      <DesignLockModal
        isOpen={isDesignLockOpen}
        onClose={() => setIsDesignLockOpen(false)}
        onConfirmLock={handleConfirmDesignLock}
        project={project}
      />

      <AgentLogDrawer
        isOpen={isAgentLogsOpen}
        onClose={() => setIsAgentLogsOpen(false)}
        agentRuns={project.agentRuns}
      />

      <ProviderSettingsModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        activeProvider={project.activeProvider}
        onSelectProvider={(p) => {
          setProject(prev => ({ ...prev, activeProvider: p }));
          setIsProviderModalOpen(false);
        }}
      />
    </div>
  );
}
