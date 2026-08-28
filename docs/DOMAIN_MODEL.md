# FLIM AI Studio — Domain Model & Entity Definitions

This document defines the core domain entities, data schemas, and relations across the entire filmmaking lifecycle.

---

## 1. Entity-Relationship Overview

```text
[Project] ──1:1──> [CreativeBrief]
   │
   ├──1:1──> [DesignPackage]
   │           ├── Concept (Selected + Candidates)
   │           ├── Characters[]
   │           ├── World
   │           ├── VisualBible
   │           ├── StoryBible
   │           └── StoryboardFrames[]
   │
   ├──1:N──> [Scene] ──1:N──> [Shot] ──1:N──> [GenerationJob] ──1:N──> [GenerationResult]
   │                                                 │
   │                                                 └──1:1──> [ContinuityState]
   │                                                 └──1:1──> [QAReport] ──0:1──> [RetakePlan]
   │
   ├──1:1──> [Timeline] ──1:N──> [EditDecision]
   │
   ├──1:N──> [Asset]
   ├──1:N──> [AgentRun]
   └──1:1──> [MasterOutput]
```

---

## 2. Entity Specifications

### `Project`
- `id`: UUID (Primary Key)
- `title`: string
- `created_at`: ISO8601 Timestamp
- `updated_at`: ISO8601 Timestamp
- `current_state`: `ProjectState` enum (e.g. `DRAFT`, `DESIGNING`, `DESIGN_READY`, `DESIGN_LOCKED`, `PRODUCING`, `COMPLETED`)
- `version`: integer
- `active_design_package_id`: UUID
- `target_duration_seconds`: number (e.g., 60 - 300s)
- `aspect_ratio`: enum (`16:9`, `9:16`, `2.39:1`)
- `fps`: number (default: 24)

---

### `CreativeBrief`
- `project_id`: UUID
- `raw_user_prompt`: string
- `target_audience`: string
- `budget_tier`: enum (`FAST_DRAFT`, `CINEMATIC_PRO`, `HYPER_DETAILED`)
- `key_themes`: string[]
- `mandatory_elements`: string[]
- `prohibited_elements`: string[]

---

### `Concept`
- `id`: UUID
- `logline`: string
- `premise`: string
- `genre`: string[]
- `subgenres`: string[]
- `tone`: string[] (e.g., ["Cyberpunk Noir", "Melancholic", "Tense"])
- `pacing`: string
- `visual_hook`: string
- `thematic_core`: string
- `status`: enum (`PROPOSED`, `ACCEPTED`, `REJECTED`)

---

### `Character`
- `id`: UUID
- `name`: string
- `archetype`: string
- `role`: enum (`PROTAGONIST`, `ANTAGONIST`, `SUPPORTING`, `BACKGROUND`)
- `backstory_summary`: string
- `physical_description`: {
    `age`: number,
    `ethnicity`: string,
    `build`: string,
    `hair`: string,
    `distinctive_features`: string[],
    `default_wardrobe`: string,
    `voice_timbre`: string
  }
- `consistency_anchor_prompt`: string (Immutable prompt token set)
- `turnaround_asset_ids`: UUID[] (Front, 45-deg, Side, Close-up reference images)
- `voice_id`: string (TTS / ElevenLabs / Gemini audio voice identifier)

---

### `World`
- `id`: UUID
- `name`: string
- `era`: string
- `geography_and_climate`: string
- `societal_rules`: string[]
- `technology_level`: string
- `lighting_and_atmosphere`: string
- `key_locations`: Array<{
    `location_id`: string,
    `name`: string,
    `description`: string,
    `visual_reference_asset_ids`: UUID[]
  }>

---

### `VisualBible`
- `color_palette`: Array<{ `name`: string, `hex`: string, `weight`: number }>
- `lighting_style`: string (e.g., "High-contrast Chiaroscuro with cyan volumetric haze")
- `camera_package`: {
    `lens_types`: string[] (e.g. "Anamorphic 35mm & 50mm"),
    `film_stock_or_sensor`: string (e.g. "Kodak Vision3 500T 5219 grain"),
    `composition_rules`: string[]
  }
- `rendering_engine_tuning`: {
    `negative_prompt_preset`: string,
    `style_preset_keywords`: string[]
  }

---

### `StoryBible`
- `act_structure`: Array<{
    `act_number`: number,
    `title`: string,
    `objective`: string,
    `turn_point`: string
  }>
- `narrative_arcs`: Array<{
    `character_id`: UUID,
    `starting_state`: string,
    `climax_state`: string,
    `ending_state`: string
  }>

---

### `Scene`
- `id`: UUID
- `project_id`: UUID
- `scene_number`: number
- `heading`: string (e.g. "INT. NEO-TOKYO APARTMENT - NIGHT")
- `location_id`: string
- `time_of_day`: string
- `dramatic_intent`: string
- `characters_present`: UUID[]
- `screenplay_text`: string
- `estimated_duration_seconds`: number

---

### `Shot`
- `id`: UUID
- `scene_id`: UUID
- `shot_number`: number
- `shot_type`: enum (`ESTABLISHING`, `WIDE`, `MEDIUM`, `CLOSE_UP`, `EXTREME_CLOSE_UP`, `OVER_THE_SHOULDER`, `DUTCH_ANGLE`, `POV`)
- `camera_movement`: enum (`STATIC`, `PAN_LEFT`, `PAN_RIGHT`, `TILT_UP`, `TILT_DOWN`, `DOLLY_IN`, `DOLLY_OUT`, `TRACKING`, `ORBIT`, `WHIP_PAN`)
- `duration_seconds`: number (typically 2.5 - 6.0s)
- `visual_description`: string
- `audio_dialogue`: string
- `audio_sfx_ambient`: string
- `lighting_cue`: string
- `primary_character_ids`: UUID[]
- `reference_asset_ids`: UUID[]
- `status`: enum (`PLANNED`, `GENERATING`, `GENERATED`, `QA_PASSED`, `QA_FAILED`, `RETAKE_QUEUED`, `LOCKED`)

---

### `Asset`
- `id`: UUID
- `project_id`: UUID
- `type`: enum (`IMAGE_REFERENCE`, `VIDEO_CLIP`, `AUDIO_VOICE`, `AUDIO_SFX`, `AUDIO_MUSIC`, `TEXTURE`, `LORA_WEIGHT`)
- `storage_path`: string
- `thumbnail_path`: string
- `mime_type`: string
- `dimensions`: { `width`: number, `height`: number }
- `duration_seconds`: number | null
- `metadata`: Record<string, any>

---

### `GenerationJob`
- `id`: UUID
- `project_id`: UUID
- `shot_id`: UUID
- `job_type`: enum (`IMAGE_KEYFRAME`, `VIDEO_MOTION`, `AUDIO_SYNTHESIS`, `UPSCALING`, `VIDEO_ANALYSIS`)
- `provider`: enum (`GEMINI_VEO`, `SEEDANCE`, `RUNWAY`, `FLOW`, `IMAGEN`, `FLUX`, `MOCK`)
- `model_id`: string
- `compiled_prompt`: string
- `negative_prompt`: string
- `input_parameters`: Record<string, any> (seed, guidance_scale, duration, fps)
- `status`: enum (`QUEUED`, `SUBMITTED`, `PROCESSING`, `SUCCESS`, `FAILED`, `CANCELLED`)
- `progress_pct`: number
- `error_message`: string | null
- `retry_count`: number
- `created_at`: ISO8601
- `completed_at`: ISO8601 | null

---

### `GenerationResult`
- `id`: UUID
- `job_id`: UUID
- `shot_id`: UUID
- `variant_index`: number
- `video_asset_id`: UUID
- `first_frame_asset_id`: UUID
- `last_frame_asset_id`: UUID
- `duration`: number
- `fps`: number
- `is_selected`: boolean

---

### `ContinuityState`
- `project_id`: UUID
- `shot_id`: UUID
- `character_signatures`: Record<string, { `face_similarity_score`: number, `wardrobe_match_score`: number }>
- `lighting_vector`: number[]
- `color_histogram`: Record<string, any>
- `spatial_layout_fingerprint`: string

---

### `QAReport`
- `id`: UUID
- `shot_id`: UUID
- `generation_result_id`: UUID
- `score_overall`: number (0.0 - 10.0)
- `scores`: {
    `character_consistency`: number,
    `temporal_stability`: number,
    `prompt_faithfulness`: number,
    `visual_artifacts_score`: number,
    `lighting_continuity`: number
  }
- `detected_defects`: Array<{
    `defect_type`: enum (`MORPHING`, `EXTRA_LIMBS`, `FACE_DRIFT`, `JITTER`, `UNWANTED_TEXT`, `LIGHTING_FLICKER`),
    `timestamp_start`: number,
    `timestamp_end`: number,
    `severity`: enum (`LOW`, `MEDIUM`, `CRITICAL`),
    `notes`: string
  }>
- `status`: enum (`PASSED`, `WARNING`, `REJECTED`)
- `recommendation`: enum (`ACCEPT`, `RETAKE_WITH_NEW_SEED`, `RETAKE_WITH_PROMPT_PATCH`, `MANUAL_OVERRIDE`)

---

### `RetakePlan`
- `id`: UUID
- `qa_report_id`: UUID
- `shot_id`: UUID
- `strategy`: enum (`SEED_VARIATION`, `PROMPT_ADJUSTMENT`, `FIRST_FRAME_GUIDED`, `INPAINT_REGION`, `CAMERA_SPEED_MODULATION`)
- `modified_prompt`: string
- `reference_frame_override_asset_id`: UUID | null
- `execution_status`: enum (`PENDING`, `EXECUTING`, `COMPLETED`, `ABANDONED`)

---

### `Timeline` & `EditDecision`
- `Timeline`: {
    `id`: UUID,
    `project_id`: UUID,
    `tracks`: Array<{
      `id`: string,
      `type`: enum (`VIDEO_PRIMARY`, `VIDEO_B_ROLL`, `AUDIO_VOICE`, `AUDIO_SFX`, `AUDIO_SCORE`),
      `clips`: EditDecision[]
    }>,
    `total_duration_seconds`: number
  }
- `EditDecision`: {
    `clip_id`: UUID,
    `shot_id`: UUID,
    `generation_result_id`: UUID,
    `start_time_in_timeline`: number,
    `duration`: number,
    `source_in`: number,
    `source_out`: number,
    `speed`: number,
    `transition_in`: string | null,
    `transition_out`: string | null
  }

---

### `MasterOutput`
- `id`: UUID
- `project_id`: UUID
- `output_video_asset_id`: UUID
- `resolution`: string (e.g. "3840x2160")
- `bitrate_mbps`: number
- `codec`: string ("h264" | "prores" | "av1")
- `final_qc_status`: enum (`VERIFIED`, `REJECTED`)
- `render_logs`: string

---

### `AgentRun`
- `id`: UUID
- `project_id`: UUID
- `agent_name`: string
- `stage`: string
- `input_context_snapshot`: Record<string, any>
- `model_used`: string
- `tokens_used`: { `prompt_tokens`: number, `completion_tokens`: number }
- `execution_time_ms`: number
- `status`: enum (`RUNNING`, `SUCCESS`, `FAILED`, `CANCELLED`)
- `error_trace`: string | null
