# FLIM AI Studio — System Architecture (v0.1)

## 1. Executive Summary & Vision

FLIM AI Studio is an autonomous AI filmmaking platform designed to transform a raw user prompt or story premise into a fully realized, polished cinematic video through two distinct, decoupled phases:

1. **Design Phase (Human-in-the-Loop)**: AI agents iteratively formulate concepts, character bibles, worldbuilding parameters, story outlines, visual directions, storyboard phác thảo, and preliminary production plans. The user reviews, modifies, regenerates, and eventually executes **DESIGN LOCK**.
2. **Production Phase (Autonomous Pipeline)**: After Design Lock, an autonomous multi-agent orchestration engine expands the screenplay, breaks down scenes, plans shots, generates multi-modal reference assets, compiles structured prompts, calls generation engines, analyzes continuity and audio/visual quality (QA), executes targeted retakes, and performs non-linear editing (NLE assembly) and master rendering.

---

## 2. Architectural Principles

1. **Database as the Single Source of Truth**: The client UI is purely a projection of the project state. No operational or pipeline state resides transiently in the UI.
2. **Structured Contracts**: Agents and pipeline nodes never communicate via loose, unparsed text. All input/output schemas are strictly typed JSON contracts (Pydantic / Zod / TypeScript schemas).
3. **Immutability of Locked State**: Once Design Lock is activated, core creative decisions cannot be mutated without an explicit unlocking version bump.
4. **Resumable Long-Running Jobs**: Every video/image generation, LLM reasoning loop, and media analysis job has a persistent UUID, state checkpoint, and idempotency key.
5. **Provider Agnosticism via Adapters**: LLM (Gemini, Claude, OpenAI, DeepSeek), Image (Flux, Midjourney, Imagen), and Video (Veo, Seedance, Flow, Runway) are isolated behind strict adapter interfaces with mock providers available for zero-cost testing.
6. **Multi-Modal Grounded Media as Truth**: Continuity is validated against actual generated video/image artifacts and extracted visual embeddings, not just text descriptions.

---

## 3. High-Level System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                         FLIM Web Client (React + TS)                   │
│  - Creative Studio UI    - Design Review Board   - Shot Matrix         │
│  - Timeline / NLE View   - Continuity Inspector  - Autonomous Monitor  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / Server-Sent Events / WS
┌───────────────────────────────────▼────────────────────────────────────┐
│                    API Gateway & Orchestrator Backend                  │
│  - Project Management Router    - Design Phase Controller              │
│  - Production Coordinator       - Job & Task Scheduler (Async Worker)  │
│  - Event Streamer & SSE Bus     - Media Asset Server                   │
└──────────────┬────────────────────┬────────────────────┬───────────────┘
               │                    │                    │
┌──────────────▼──────┐   ┌─────────▼──────────┐   ┌─────▼───────────────┐
│ Agent Runtime Engine│   │ Media Processing   │   │ Persistence Layer   │
│ - Concept Agent     │   │ - FFmpeg Engine    │   │ - Project Store     │
│ - Character Agent   │   │ - Frame Extractor  │   │ - Domain Entities   │
│ - World Agent       │   │ - Video Inspector  │   │ - Job & Event Log   │
│ - Story/Script Agent│   │ - Audio Assembler  │   │ - Artifact Registry │
│ - Visual Agent      │   │ - Resolution / LUT │   │                     │
│ - Storyboard Agent  │   └────────────────────┘   └─────────────────────┘
│ - Production Agent  │
│ - QA & Retake Agent │
│ - NLE Editor Agent  │
└──────────────┬──────┘
               │
┌──────────────▼─────────────────────────────────────────────────────────┐
│                      Unified Provider Gateway                          │
│ ┌────────────────┐ ┌─────────────────┐ ┌───────────────┐ ┌───────────┐ │
│ │  LLM Adapters  │ │ Image Adapters  │ │Video Adapters │ │Vision & QA│ │
│ │ (Gemini/Claude/│ │ (Imagen/Flux/   │ │(Veo/Seedance/ │ │ (Gemini   │ │
│ │  DeepSeek/Mock)│ │  Midjourney/Mock│ │ Runway/Mock)  │ │  Vision)  │ │
│ └────────────────┘ └─────────────────┘ └───────────────┘ └───────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Architecture (React + TypeScript)

### Module Layout
- `src/features/project`: Project creation, metadata, workspace switcher.
- `src/features/design`: Interactive Design Package review boards:
  - Concept selector & tone styler.
  - Character cast builder (visual prompt chips, wardrobe, voice profiles).
  - World & environment rulebook.
  - Story outline & 3-act scene breakdown.
  - Storyboard matrix & camera angle inspector.
  - Design Lock activation confirmation modal.
- `src/features/production`: Live autonomous production pipeline visualizer:
  - Real-time DAG execution tree.
  - Shot-by-shot generation monitor (prompt, variant picker, status).
  - Live progress & logs for autonomous jobs.
- `src/features/qa`: Visual continuity inspector, defect heatmaps, and retake queue.
- `src/features/editor`: Interactive timeline assembly, audio stems, shot trimmer, and final 4K export player.

### State & Communication
- **Zustand / TanStack Query**: Optimistic UI with real-time SSE (Server-Sent Events) synchronization.
- **WebSocket / SSE**: Streams agent reasoning steps, generation job statuses, and FFmpeg render percentages.

---

## 5. Backend Architecture (FastAPI / Express Core + TypeScript/Python)

### Modular Layers:
1. **API Layer (`/api/v1`)**:
   - `/projects`: CRUD, state transitions, design lock.
   - `/design`: Agents triggering creative package generations.
   - `/production`: Autonomous pipeline triggering, stage dispatching.
   - `/jobs`: Job polling, cancellation, resume, and telemetry.
   - `/media`: Asset streaming, thumbnail serving, and artifact downloading.
2. **Core Orchestration (`/core`)**:
   - `ProjectManager`: Enforces state transitions and versioning.
   - `AgentRuntime`: Abstract executor dispatching prompts and validating structured output.
   - `JobQueue`: Async task processing with persistent state checkpoints.
   - `EventBus`: In-memory / persistent event publication for real-time SSE.
3. **Media Pipeline (`/media`)**:
   - Wrapper around FFmpeg and OpenCV/sharp for frame extraction, audio alignment, concat demuxing, and color grading.

---

## 6. Security, Storage & Asset Pipeline

- **Storage Structure**:
  ```text
  /storage
    /projects/{project_id}
      /bsp/               # Design Package snapshots
      /assets/            # Character turnarounds, visual style references
      /shots/{shot_id}/   # Raw generations, variants, and cut frames
      /qa/{report_id}/    # Defect analysis crops and heatmaps
      /edit/              # XML / EDL / Timeline clips
      /master/            # Final rendered video & audio stems
  ```
- **Metadata Versioning**: Every major step produces immutable records (e.g., `DesignPackage_v1`, `RetakePlan_v3`).
