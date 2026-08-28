// ==========================================
// FLIM AI STUDIO — DOMAIN MODEL DEFINITIONS
// ==========================================

export type ProjectState =
  | 'DRAFT'
  | 'DESIGNING'
  | 'DESIGN_READY'
  | 'USER_REVIEW'
  | 'DESIGN_LOCKED'
  | 'PRODUCTION_QUEUED'
  | 'PRODUCING'
  | 'QA'
  | 'REPAIRING'
  | 'EDITING'
  | 'MASTERING'
  | 'FINAL_QC'
  | 'COMPLETED';

export type AspectRatio = '16:9' | '9:16' | '2.39:1';
export type BudgetTier = 'FAST_DRAFT' | 'CINEMATIC_PRO' | 'HYPER_DETAILED';
export type ProviderType = 'GEMINI_VEO' | 'SEEDANCE' | 'RUNWAY' | 'FLOW' | 'IMAGEN' | 'FLUX' | 'MOCK' | 'DEEPSEEK' | 'CLAUDE';

export interface ColorSwatch {
  name: string;
  hex: string;
  weight: number;
}

export interface Concept {
  id: string;
  title: string;
  logline: string;
  premise: string;
  genre: string[];
  tone: string[];
  pacing: string;
  visualHook: string;
  thematicCore: string;
  status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED';
}

export interface Character {
  id: string;
  name: string;
  archetype: string;
  role: 'PROTAGONIST' | 'ANTAGONIST' | 'SUPPORTING' | 'BACKGROUND';
  backstorySummary: string;
  age: number;
  ethnicity: string;
  build: string;
  hair: string;
  distinctiveFeatures: string[];
  defaultWardrobe: string;
  voiceTimbre: string;
  consistencyAnchorPrompt: string;
  turnaroundImages: {
    front: string;
    angle45: string;
    side: string;
    closeUp: string;
  };
  faceMatchScore?: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  lightingPrompt: string;
  referenceImage: string;
}

export interface World {
  id: string;
  name: string;
  era: string;
  geography: string;
  societalRules: string[];
  technologyLevel: string;
  lightingAtmosphere: string;
  keyLocations: Location[];
}

export interface VisualBible {
  colorPalette: ColorSwatch[];
  lightingStyle: string;
  cameraPackage: {
    lensTypes: string[];
    filmStock: string;
    compositionRules: string[];
  };
  renderingTuning: {
    negativePrompt: string;
    styleKeywords: string[];
  };
}

export interface ActStructure {
  actNumber: number;
  title: string;
  objective: string;
  turnPoint: string;
}

export interface StoryBible {
  synopsis: string;
  themeStatement: string;
  acts: ActStructure[];
  narrativeArcs: Array<{
    characterId: string;
    characterName: string;
    startingState: string;
    climaxState: string;
    endingState: string;
  }>;
}

export interface StoryboardFrame {
  id: string;
  frameNumber: number;
  sceneHeading: string;
  shotType: string;
  cameraMovement: string;
  visualDescription: string;
  lightingCue: string;
  audioDialogue: string;
  previewImage: string;
}

export interface DesignPackage {
  id: string;
  version: number;
  createdAt: string;
  lockedAt?: string;
  lockHash?: string;
  selectedConceptId: string;
  concepts: Concept[];
  characters: Character[];
  world: World;
  visualBible: VisualBible;
  storyBible: StoryBible;
  storyboard: StoryboardFrame[];
}

export type ShotType =
  | 'ESTABLISHING'
  | 'WIDE'
  | 'MEDIUM'
  | 'CLOSE_UP'
  | 'EXTREME_CLOSE_UP'
  | 'OVER_THE_SHOULDER'
  | 'DUTCH_ANGLE'
  | 'POV';

export type CameraMovement =
  | 'STATIC'
  | 'PAN_LEFT'
  | 'PAN_RIGHT'
  | 'TILT_UP'
  | 'TILT_DOWN'
  | 'DOLLY_IN'
  | 'DOLLY_OUT'
  | 'TRACKING'
  | 'ORBIT'
  | 'WHIP_PAN';

export type ShotStatus =
  | 'PLANNED'
  | 'GENERATING'
  | 'GENERATED'
  | 'QA_CHECKING'
  | 'QA_PASSED'
  | 'QA_FAILED'
  | 'RETAKE_QUEUED'
  | 'LOCKED';

export interface ShotVariant {
  id: string;
  variantIndex: number;
  videoUrl: string;
  firstFrameUrl: string;
  lastFrameUrl: string;
  seed: number;
  qaScore: number;
  isSelected: boolean;
  generatedAt: string;
}

export interface QADefect {
  id: string;
  defectType: 'MORPHING' | 'EXTRA_LIMBS' | 'FACE_DRIFT' | 'JITTER' | 'UNWANTED_TEXT' | 'LIGHTING_FLICKER';
  timestampStart: number;
  timestampEnd: number;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  description: string;
}

export interface QAReport {
  id: string;
  shotId: string;
  variantId: string;
  overallScore: number; // 0-10
  characterConsistency: number; // 0-10
  temporalStability: number; // 0-10
  promptFaithfulness: number; // 0-10
  lightingContinuity: number; // 0-10
  defects: QADefect[];
  status: 'PASSED' | 'WARNING' | 'REJECTED';
  recommendation: 'ACCEPT' | 'RETAKE_WITH_NEW_SEED' | 'RETAKE_WITH_PROMPT_PATCH' | 'MANUAL_OVERRIDE';
  analyzedAt: string;
}

export interface RetakePlan {
  id: string;
  shotId: string;
  qaReportId: string;
  attemptNumber: number;
  strategy: 'SEED_VARIATION' | 'PROMPT_ADJUSTMENT' | 'FIRST_FRAME_GUIDED' | 'CAMERA_SPEED_MODULATION';
  originalPrompt: string;
  modifiedPrompt: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'ABANDONED';
}

export interface Shot {
  id: string;
  sceneId: string;
  sceneHeading: string;
  shotNumber: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  durationSeconds: number;
  visualPrompt: string;
  negativePrompt: string;
  audioDialogue: string;
  audioSfxAmbient: string;
  lightingCue: string;
  characterIds: string[];
  status: ShotStatus;
  progressPct: number;
  currentJobId?: string;
  variants: ShotVariant[];
  selectedVariantId?: string;
  qaReport?: QAReport;
  retakeHistory: RetakePlan[];
  retakeCount: number;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  heading: string;
  locationId: string;
  timeOfDay: string;
  dramaticIntent: string;
  characterIds: string[];
  screenplayText: string;
  estimatedDurationSeconds: number;
  shots: Shot[];
}

export interface TimelineClip {
  id: string;
  shotId: string;
  shotNumber: number;
  sceneHeading: string;
  variantId: string;
  videoUrl: string;
  startTime: number;
  duration: number;
  sourceIn: number;
  sourceOut: number;
  audioDialogue: string;
  audioSfx: string;
  colorGrade: string;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'VIDEO_PRIMARY' | 'AUDIO_DIALOGUE' | 'AUDIO_SFX' | 'AUDIO_SCORE';
  muted: boolean;
  volume: number;
  clips: TimelineClip[];
}

export interface Timeline {
  id: string;
  tracks: TimelineTrack[];
  totalDurationSeconds: number;
  currentPlaybackTime: number;
  isPlaying: boolean;
}

export interface MasterOutput {
  id: string;
  resolution: '1920x1080' | '3840x2160';
  fps: number;
  aspectRatio: AspectRatio;
  bitrateMbps: number;
  codec: 'H264' | 'PRORES_422' | 'AV1';
  audioFormat: 'AAC_320K' | 'PCM_24BIT';
  renderedAt: string;
  videoUrl: string;
  fileSizeBytes: number;
  finalQcStatus: 'VERIFIED' | 'REJECTED';
  renderLogs: string[];
}

export interface AgentRun {
  id: string;
  agentName: string;
  stage: string;
  timestamp: string;
  model: string;
  durationMs: number;
  tokens: { prompt: number; completion: number };
  status: 'SUCCESS' | 'RUNNING' | 'FAILED';
  logSummary: string;
  thoughtTrace: string[];
}

export interface Project {
  id: string;
  title: string;
  premise: string;
  genre: string[];
  tone: string[];
  targetDurationSeconds: number;
  aspectRatio: AspectRatio;
  budgetTier: BudgetTier;
  fps: number;
  currentState: ProjectState;
  version: number;
  createdAt: string;
  updatedAt: string;
  designPackage: DesignPackage;
  scenes: Scene[];
  timeline: Timeline;
  masterOutput?: MasterOutput;
  agentRuns: AgentRun[];
  activeProvider: ProviderType;
}
