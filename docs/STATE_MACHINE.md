# FLIM AI Studio — State Machine & Lifecycle Transitions

This document formally specifies all state transitions, invariants, triggers, failure recovery strategies, and cancellation semantics.

---

## 1. Project-Level State Machine

```text
 ┌───────────────┐
 │     DRAFT     │ ◄─── Initial creation, inputting idea
 └───────┬───────┘
         │ [User triggers "Generate Design"]
         ▼
 ┌───────────────┐
 │   DESIGNING   │ ◄─── Concept, Character, World, Story agents running
 └───────┬───────┘
         │ [All design artifacts synthesized]
         ▼
 ┌───────────────┐
 │ DESIGN_READY  │ ◄─── Design package populated, awaiting review
 └───────┬───────┘
         │ [User opens review board]
         ▼
 ┌───────────────┐
 │  USER_REVIEW  │ ◄─── User edits, regenerates specific options
 └───────┬───────┘
         │ [User clicks "DESIGN LOCK"]
         ▼
 ┌───────────────┐
 │ DESIGN_LOCKED │ ◄─── Creative baseline frozen; immutable snapshot created
 └───────┬───────┘
         │ [Auto / User queues production]
         ▼
 ┌───────────────────┐
 │ PRODUCTION_QUEUED │ ◄─── Scene/Shot breakdown and prompt compilation
 └─────────┬─────────┘
           │ [Generators dispatched]
           ▼
 ┌───────────────────┐
 │     PRODUCING     │ ◄─── Parallel video generation jobs running
 └─────────┬─────────┘
           │ [All shots have at least 1 candidate]
           ▼
 ┌───────────────────┐
 │        QA         │ ◄─── Autonomous Media Vision & Continuity analysis
 └─────────┬─────────┘
           │ [Defects detected requiring repair]
           ├───► ┌───────────┐
           │     │ REPAIRING │ ◄─── Targeted retakes (max 3 cycles)
           │     └─────┬─────┘
           │           │ [Retake generated]
           │           └──────► (Loop back to QA)
           │ [All shots pass QA thresholds]
           ▼
 ┌───────────────────┐
 │      EDITING      │ ◄─── NLE Assembly, shot pacing, audio alignment
 └─────────┬─────────┘
           │ [Timeline assembled]
           ▼
 ┌───────────────────┐
 │     MASTERING     │ ◄─── FFmpeg multi-track render, color LUT, audio mix
 └─────────┬─────────┘
           │ [Render complete]
           ▼
 ┌───────────────────┐
 │     FINAL_QC      │ ◄─── Audio loudness, frame drop & compliance check
 └─────────┬─────────┘
           │ [Final verification complete]
           ▼
 ┌───────────────────┐
 │     COMPLETED     │ ◄─── Master video ready for export / playback
 └───────────────────┘
```

---

## 2. Project State Transition Table

| Current State | Event / Trigger | Guard Condition | Next State | Rollback / Failure State |
| :--- | :--- | :--- | :--- | :--- |
| `DRAFT` | `START_DESIGN` | User prompt not empty | `DESIGNING` | `DRAFT` (if validation fails) |
| `DESIGNING` | `DESIGN_SYNTHESIZED` | All core entities created | `DESIGN_READY` | `DRAFT` (with error message) |
| `DESIGN_READY` | `ENTER_REVIEW` | None | `USER_REVIEW` | `DESIGN_READY` |
| `USER_REVIEW` | `REGENERATE_COMPONENT` | Target valid (character, world, etc.) | `USER_REVIEW` | `USER_REVIEW` |
| `USER_REVIEW` | `ACTIVATE_DESIGN_LOCK` | User confirmation provided | `DESIGN_LOCKED` | `USER_REVIEW` |
| `DESIGN_LOCKED` | `START_PRODUCTION` | Storage allocated | `PRODUCTION_QUEUED`| `DESIGN_LOCKED` |
| `PRODUCTION_QUEUED` | `DISPATCH_SHOTS` | Shot list validated | `PRODUCING` | `PRODUCTION_QUEUED` |
| `PRODUCING` | `SHOTS_GENERATED` | All shots have candidates | `QA` | `PRODUCING` (retry failed jobs) |
| `QA` | `DEFECTS_FOUND` | Critical defects > 0 and retries < limit | `REPAIRING` | `QA` |
| `QA` | `QA_APPROVED` | Quality score >= 7.5 | `EDITING` | `QA` |
| `REPAIRING` | `RETAKE_COMPLETED` | Retake candidate ingested | `QA` | `REPAIRING` |
| `EDITING` | `TIMELINE_COMPILED` | All clips synchronized | `MASTERING` | `EDITING` |
| `MASTERING` | `RENDER_SUCCEEDED` | FFmpeg exit code 0 | `FINAL_QC` | `EDITING` |
| `FINAL_QC` | `QC_VERIFIED` | Compliant video file | `COMPLETED` | `MASTERING` |
| `COMPLETED` | `EXPORT_REQUESTED` | File exists | `COMPLETED` | `COMPLETED` |

---

## 3. Generation Job Lifecycle State Machine

```text
       ┌─────────┐
       │ QUEUED  │
       └────┬────┘
            │ [Worker picks up job]
            ▼
       ┌───────────┐
       │ SUBMITTED │
       └────┬──────┘
            │ [Provider polling / webhook received]
            ▼
       ┌────────────┐
       │ PROCESSING │ ◄── Progress % streamed
       └────┬───────┘
            ├───► [Success] ──► ┌─────────┐
            │                   │ SUCCESS │
            │                   └─────────┘
            ├───► [Provider Error]
            │          │
            │          ▼
            │     ┌─────────┐   [retry_count < max_retries]
            │     │ RETRY   ├───► (Re-queue to QUEUED)
            │     └────┬────┘
            │          │ [retry_count >= max_retries]
            │          ▼
            │     ┌─────────┐
            │     │ FAILED  │
            │     └─────────┘
            │
            └───► [User Cancel] ──► ┌───────────┐
                                    │ CANCELLED │
                                    └───────────┘
```

---

## 4. Invariants & Recovery Policies

1. **Design Lock Immutability**:
   - In `DESIGN_LOCKED` or subsequent states, the concept, character anchor tokens, and world rules cannot be changed directly.
   - If an unlock is forced, the system creates a new project revision (e.g. `v2-Draft`) while preserving the existing production tree.
2. **Resumability & Crash Recovery**:
   - If the backend crashes during `PRODUCING`, on startup the `JobRecoveryEngine` queries all `SUBMITTED` or `PROCESSING` jobs against provider APIs using the persistent provider task ID.
   - Completed videos are fetched and ingested; stalled jobs are automatically re-queued.
3. **Max Retake Threshold**:
   - The autonomous QA/Retake loop has a hard cap (default: 3 retakes per shot) to prevent infinite billing loops. If a shot fails 3 times, it defaults to the highest-scoring candidate and flags `QA_WARNING` for human review.
