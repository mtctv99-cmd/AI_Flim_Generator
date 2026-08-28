# FLIM AI Studio — Provider Architecture & Adapters

This document specifies the provider abstraction layer, decoupling the application core from external LLMs, image generation models, video engines, and vision analyzers.

---

## 1. Provider Adapter Hierarchy

```text
┌─────────────────────────────────────────────────────────────┐
│                      Provider Registry                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐        ┌──────────────┐
│ LLMProvider  │       │ ImageProvider│        │ VideoProvider│
└──────┬───────┘       └──────┬───────┘        └──────┬───────┘
       ├── Gemini             ├── Imagen              ├── Veo (Google)
       ├── Claude (Anthropic) ├── Flux (Black Forest) ├── Seedance
       ├── OpenAI / DeepSeek  ├── Midjourney API      ├── Runway Gen-3
       └── MockLLMProvider    └── MockImageProvider   ├── Flow
                                                      └── MockVideoProvider
```

---

## 2. LLM Provider Adapter Contract

```typescript
export interface LLMGenerateOptions {
  model: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseSchema?: Record<string, any>;
  responseMimeType?: "application/json" | "text/plain";
}

export interface LLMProvider {
  readonly id: string;
  readonly name: string;
  
  generateText(prompt: string, options?: LLMGenerateOptions): Promise<string>;
  
  generateStructured<T>(
    prompt: string,
    schema: any,
    options?: LLMGenerateOptions
  ): Promise<T>;
  
  streamText(
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: LLMGenerateOptions
  ): Promise<void>;
}
```

---

## 3. Video Generation Provider Adapter Contract

```typescript
export interface VideoGenerationRequest {
  jobId: string;
  prompt: string;
  negativePrompt?: string;
  durationSeconds: number;
  fps: number;
  aspectRatio: "16:9" | "9:16" | "2.39:1";
  seed?: number;
  referenceImageUrls?: string[];
  firstFrameUrl?: string;
  lastFrameUrl?: string;
  cameraMotion?: string;
}

export interface VideoGenerationResponse {
  providerTaskId: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  progressPct: number;
  videoUrl?: string;
  errorMessage?: string;
}

export interface VideoProvider {
  readonly id: string;
  readonly name: string;
  
  submitGeneration(request: VideoGenerationRequest): Promise<VideoGenerationResponse>;
  pollStatus(providerTaskId: string): Promise<VideoGenerationResponse>;
  cancelGeneration(providerTaskId: string): Promise<boolean>;
}
```

---

## 4. Multi-Modal Media Analysis / Vision Adapter

```typescript
export interface VideoAnalysisRequest {
  videoUrl: string;
  frameSampleRate: number; // e.g. 1 frame every 0.5s
  characterAnchorReferences: Record<string, string>; // name -> image URL
  expectedShotDescription: string;
}

export interface VideoAnalysisResult {
  overallScore: number;
  characterScores: Record<string, number>;
  temporalStabilityScore: number;
  artifactsDetected: Array<{
    type: string;
    timestamp: number;
    severity: "LOW" | "MEDIUM" | "HIGH";
    description: string;
  }>;
  suggestedPromptFixes?: string;
}

export interface MediaAnalysisProvider {
  analyzeVideo(request: VideoAnalysisRequest): Promise<VideoAnalysisResult>;
}
```

---

## 5. Mock Providers for Zero-Cost Local Testing & CI/CD

To ensure fast test execution and reliable CI/CD pipelines without incurring cloud compute costs or API quotas, the system implements:

- `MockLLMProvider`: Generates deterministic, pre-baked, schema-compliant JSON packages for concepts, characters, scenes, and shots.
- `MockImageProvider`: Produces styled SVG / WebP gradient placeholder images with shot labels, metadata, and timestamps.
- `MockVideoProvider`: Simulates asynchronous job processing (progress increments over 3–5 seconds) and returns sample animated MP4 clips with moving title cards and timecodes.
- `MockMediaAnalysisProvider`: Returns parameterized QA reports to test pass/fail state transitions and retake loops.
