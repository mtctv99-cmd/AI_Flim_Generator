# FLIM AI Studio — Implementation Plan & Phased Roadmap

This roadmap breaks down the construction of FLIM AI Studio into small, testable, iterative phases.

---

## Overview of Development Phases

| Phase | Title | Focus Area | Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 0** | **Audit & Architecture (Current)** | Blueprints, Domain Models, Specs | Architectural documentation in `/docs` |
| **Phase 1** | **Core Domain & Persistence Backbone** | Schemas, DB Models, State Machine | Types, Store, State Machine Validator, Unit Tests |
| **Phase 2** | **Provider Abstraction & Mock Engines** | LLM/Image/Video Adapters & Mocks | Unified Provider Registry, Gemini Adapter, Mock Suite |
| **Phase 3** | **Design Phase Agents & Review UI** | Concept, Cast, World, Story, Design Lock | Design Board UI, Multi-Agent Creative Engine, Design Lock |
| **Phase 4** | **Production Breakdown & Autonomous Orchestration** | Screenplay Expansion, Shot Matrix, DAG Runner | Shot Breakdown Agent, Async Job Scheduler, Live Pipeline Monitor |
| **Phase 5** | **Media Vision QA, Continuity & Retake Engine** | Frame Analysis, Defect Detection, Retake Loop | Vision QA Engine, Continuity Inspector, Autonomous Retake Handler |
| **Phase 6** | **NLE Assembly, Audio & Master Video Renderer** | FFmpeg Concat, Timeline, Final QC | Timeline Editor UI, FFmpeg Video Pipeline, Master Export Player |

---

## Detailed Phase Breakdown

### Phase 1: Core Domain & State Machine Backbone
- **Objective**: Establish single source of truth models, project state machine, validation contracts, and persistent state storage.
- **Files/Modules**:
  - `src/types/domain.ts`: Full TypeScript definitions matching `DOMAIN_MODEL.md`.
  - `src/core/state-machine/`: Finite state machine engine with guard conditions and event dispatches.
  - `src/core/store/`: Central project store with versioning and event history.
- **Dependencies**: `zod` (schema validation).
- **Tests**: State transition unit tests, invariant assertion tests, serialization/deserialization tests.
- **Acceptance Criteria**: All state transitions from `DRAFT` to `COMPLETED` can be executed, saved, reloaded, and guarded against invalid transitions.

---

### Phase 2: Provider Abstraction & Mock Engine Suite
- **Objective**: Implement clean adapter interfaces for LLM, Image, Video, and Vision, plus deterministic mock providers.
- **Files/Modules**:
  - `src/providers/base.ts`: Abstract interfaces.
  - `src/providers/llm/gemini.ts` & `src/providers/llm/mock.ts`.
  - `src/providers/video/mock.ts` & `src/providers/video/veo.ts` (stub).
  - `src/providers/vision/mock.ts` & `src/providers/vision/gemini.ts`.
  - `src/providers/registry.ts`: Dynamic provider factory.
- **Dependencies**: `@google/genai`.
- **Tests**: Mock provider throughput tests, schema enforcement tests, timeout & retry tests.
- **Acceptance Criteria**: Seamless switching between live Gemini and zero-cost mock providers without changing application logic.

---

### Phase 3: Design Phase & Interactive Review Studio
- **Objective**: Build the human-in-the-loop creative package generation and review workspace.
- **Files/Modules**:
  - `src/agents/concept.ts`, `src/agents/character.ts`, `src/agents/world.ts`, `src/agents/story.ts`, `src/agents/visual.ts`.
  - `src/features/design/ConceptSelector.tsx`, `src/features/design/CharacterCastBoard.tsx`, `src/features/design/WorldBuilder.tsx`, `src/features/design/DesignLockModal.tsx`.
- **Dependencies**: `motion/react`, `lucide-react`.
- **Tests**: Design package synthesis tests, component regeneration tests, Design Lock snapshot integrity test.
- **Acceptance Criteria**: User inputs prompt -> AI generates candidate concepts, character anchors, world rules, and storyboard -> User can tweak/regenerate -> User activates Design Lock.

---

### Phase 4: Autonomous Production Engine & Shot Matrix
- **Objective**: Implement autonomous screenplay expansion, shot breakdown, prompt compilation, and asynchronous parallel job runner.
- **Files/Modules**:
  - `src/agents/production.ts`: Shot breakdown and prompt compiler.
  - `src/core/jobs/JobQueue.ts`: Priority task queue with pause/resume/cancel.
  - `src/features/production/ShotMatrix.tsx`, `src/features/production/PipelineDAGVisualizer.tsx`.
- **Tests**: Breakdown accuracy tests, concurrent job scheduling tests, crash-recovery job resumption tests.
- **Acceptance Criteria**: After Design Lock, system autonomously generates 10+ shots with persistent job IDs and visual progress tracking.

---

### Phase 5: Vision QA, Continuity Inspector & Retake Loop
- **Objective**: Implement autonomous video analysis, defect detection, and automated prompt-patch retakes.
- **Files/Modules**:
  - `src/agents/qa.ts`: Vision analyzer and defect evaluator.
  - `src/agents/retake.ts`: Strategy generator for retakes (seed modification vs prompt patch).
  - `src/features/qa/QAReportModal.tsx`, `src/features/qa/ContinuityMatrix.tsx`.
- **Tests**: QA threshold decision tests, retake limit guard tests (max 3 cycles).
- **Acceptance Criteria**: Shots with simulated defects automatically trigger retakes with adjusted prompts; passing shots advance to NLE assembly.

---

### Phase 6: NLE Timeline Assembly, Audio & Master Renderer
- **Objective**: Multi-track timeline assembly, audio stem synthesis, and master video generation.
- **Files/Modules**:
  - `src/agents/editor.ts`: Timeline compiler and pacing optimizer.
  - `src/media/ffmpeg.ts` (or canvas/web-codecs compositor for preview).
  - `src/features/editor/TimelineEditor.tsx`, `src/features/editor/MasterPlayer.tsx`.
- **Tests**: Concat script validation, timecode alignment tests, final QC compliance tests.
- **Acceptance Criteria**: Seamless playback of the finished film with synchronized audio, shot transitions, and 4K export capability.
