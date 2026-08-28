# FLIM AI Studio — Agent Architecture & Execution Runtime

This document outlines the agent contracts, execution runtime, memory models, permissions, tool boundaries, and orchestrations for the autonomous filmmaking pipeline.

---

## 1. Core Agent Interface & Abstract Runtime

Every agent implements a strict, structured interface:

```typescript
export interface AgentExecutionContext {
  projectId: string;
  stage: string;
  provider: LLMProvider;
  temperature?: number;
  maxRetries?: number;
  memorySnapshot?: Record<string, any>;
  signal?: AbortSignal;
}

export interface Agent<TInput, TOutput> {
  readonly name: string;
  readonly description: string;
  readonly requiredPermissions: AgentPermission[];
  readonly inputSchema: z.ZodSchema<TInput>;
  readonly outputSchema: z.ZodSchema<TOutput>;
  
  execute(input: TInput, context: AgentExecutionContext): Promise<TOutput>;
}
```

---

## 2. Specialized Autonomous Agents

| Agent Name | Primary Responsibility | Input Contract | Output Contract | Tools Allowed |
| :--- | :--- | :--- | :--- | :--- |
| **Concept Agent** | Generates loglines, premises, thematic hooks, tone | `CreativeBrief` | `ConceptPackage` (3 candidate concepts) | Search, Taxonomy DB |
| **Character Agent** | Formulates character profiles, anchor prompts, turnaround briefs | `SelectedConcept`, `CreativeBrief` | `CharacterList` with visual anchor tokens | Visual Embedding Anchor |
| **World Agent** | Constructs environment rules, atmosphere, and locations | `SelectedConcept`, `CreativeBrief` | `WorldDefinition` with location prompts | Location DB |
| **Story Agent** | Generates 3-act narrative structure, scene outlines, screenplay | `Concept`, `Characters`, `World` | `Screenplay` + `SceneList` | Script Formatter |
| **Visual Agent** | Formulates color palette, camera lenses, lighting & rendering presets | `Concept`, `World`, `Genre` | `VisualBible` | Color Palette Tool |
| **Storyboard Agent** | Generates camera language, composition, and keyframe prompt setups | `Scenes`, `VisualBible` | `StoryboardFrameList` | Prompt Composer |
| **Production Agent** | Breaks scenes into granular shots, creates generation jobs | `LockedDesignPackage` | `ShotBreakdown` + `GenerationJobManifest` | Job Dispatcher |
| **QA & Retake Agent** | Analyzes video variants for continuity, defects, and scores | `ShotVideoArtifact`, `ContinuityState` | `QAReport` + `RetakePlan` | Video Vision Analyzer |
| **Editor / NLE Agent** | Analyzes temporal pacing, arranges timeline tracks, aligns audio | `ApprovedShotList`, `AudioTracks` | `TimelineEDL` | Concat Planner, Audio Matcher |

---

## 3. Agent Memory & Context Injection

To prevent hallucinations and context degradation across long pipelines, agents utilize a three-tiered memory architecture:

1. **Immutable Ground Truth Memory**:
   - `LockedDesignPackage` (Concept, Character Anchor Prompts, Visual Bible, Scene Screenplay).
   - Injected into every production agent run as system constraints.
2. **Episodic Continuity Memory**:
   - The previous shot's last frame embedding, lighting histogram, and character location.
   - Used by Shot Planners and QA agents to ensure seamless transition between shot $N$ and shot $N+1$.
3. **Run-Time Scratchpad**:
   - Intermediate reasoning chain (CoT) logged into `AgentRun.execution_logs` for transparency and debugging.

---

## 4. Structured Output Enforcement & Repair Loop

```text
 Agent Prompt Dispatch
         │
         ▼
 LLM Inference (Gemini / Claude / DeepSeek)
         │
         ▼
 JSON Schema Validation (Zod / Pydantic)
         ├───► [Valid] ──► Output Returned & Saved to Database
         │
         └───► [Invalid / Parse Error]
                    │
                    ▼
               Self-Correction Repair Prompt
               (Sends parse errors + original prompt back to LLM)
                    │
                    ├───► [Pass on Retry] ──► Success
                    └───► [Fail after 3 Retries] ──► Throw StructuredAgentException
```

---

## 5. Model Selection Strategy

- **Design & Script Phase (High Reasoning)**: Gemini 2.5 Pro / Claude 3.7 Sonnet / DeepSeek R1 for deep character psychology, narrative structure, and creative nuance.
- **Shot Breakdown & Prompt Compilation (Speed & Accuracy)**: Gemini 2.5 Flash / Claude 3.5 Haiku for deterministic JSON formatting and rapid template filling.
- **QA & Visual Inspection (Multi-Modal Vision)**: Gemini 2.5 Pro / Flash Vision analyzing video frame batches and calculating defect probabilities.
