import { Project, ProjectState, Shot, Scene, QAReport, RetakePlan, Timeline, MasterOutput } from '../types/domain';

export const ORDERED_STATES: ProjectState[] = [
  'DRAFT',
  'DESIGNING',
  'DESIGN_READY',
  'USER_REVIEW',
  'DESIGN_LOCKED',
  'PRODUCTION_QUEUED',
  'PRODUCING',
  'QA',
  'REPAIRING',
  'EDITING',
  'MASTERING',
  'FINAL_QC',
  'COMPLETED'
];

export function getStateProgress(state: ProjectState): number {
  const index = ORDERED_STATES.indexOf(state);
  if (index === -1) return 0;
  return Math.round(((index + 1) / ORDERED_STATES.length) * 100);
}

export function isValidTransition(from: ProjectState, to: ProjectState): boolean {
  const validMap: Record<ProjectState, ProjectState[]> = {
    DRAFT: ['DESIGNING'],
    DESIGNING: ['DESIGN_READY', 'DRAFT'],
    DESIGN_READY: ['USER_REVIEW', 'DESIGNING'],
    USER_REVIEW: ['DESIGN_LOCKED', 'DESIGNING', 'USER_REVIEW'],
    DESIGN_LOCKED: ['PRODUCTION_QUEUED', 'USER_REVIEW'],
    PRODUCTION_QUEUED: ['PRODUCING', 'DESIGN_LOCKED'],
    PRODUCING: ['QA', 'PRODUCING'],
    QA: ['REPAIRING', 'EDITING', 'QA'],
    REPAIRING: ['QA', 'REPAIRING'],
    EDITING: ['MASTERING', 'QA'],
    MASTERING: ['FINAL_QC', 'EDITING'],
    FINAL_QC: ['COMPLETED', 'MASTERING'],
    COMPLETED: ['DRAFT', 'USER_REVIEW']
  };

  return validMap[from]?.includes(to) || false;
}

// Generate simple deterministic hash for Design Lock snapshot
export function computeDesignPackageHash(pkg: any): string {
  const str = JSON.stringify({
    conceptId: pkg.selectedConceptId,
    chars: pkg.characters.map((c: any) => c.name + c.consistencyAnchorPrompt),
    world: pkg.world.name + pkg.world.era,
    story: pkg.storyBible.synopsis
  });
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return '0x' + Math.abs(hash).toString(16).padStart(8, '0').toUpperCase() + '-LOCK-SIG';
}

export function createAutonomousProductionShots(project: Project): Scene[] {
  const dp = project.designPackage;
  const selectedConcept = dp.concepts.find(c => c.id === dp.selectedConceptId) || dp.concepts[0];
  const mainChar = dp.characters[0];
  const secondChar = dp.characters[1];

  const shotList: Shot[] = [
    {
      id: 'shot-auto-01',
      sceneId: 'scene-auto-1',
      sceneHeading: 'EXT. SECTOR 9 ALLEYWAY - NIGHT',
      shotNumber: 1,
      shotType: 'WIDE',
      cameraMovement: 'DOLLY_IN',
      durationSeconds: 4.5,
      visualPrompt: `Cinematic wide establishing shot of ${mainChar.name} in rain-slicked neon street, towering holographic megastructures, anamorphic lens flare, ${mainChar.consistencyAnchorPrompt}, Kodak 500T 35mm grain`,
      negativePrompt: dp.visualBible.renderingTuning.negativePrompt,
      audioDialogue: `${mainChar.name.toUpperCase()} (V.O.): Every city has a memory. Most are corrupted.`,
      audioSfxAmbient: 'Constant acidic rain, distant sirens, heavy bass frequency pulse.',
      lightingCue: 'Cyan volumetric laser fog, dark puddles reflecting amber sodium glow.',
      characterIds: [mainChar.id],
      status: 'LOCKED',
      progressPct: 100,
      retakeCount: 0,
      retakeHistory: [],
      variants: [
        {
          id: 'var-auto-01-a',
          variantIndex: 1,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          seed: 1092831,
          qaScore: 9.3,
          isSelected: true,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-auto-01-a',
      qaReport: {
        id: 'qa-auto-01',
        shotId: 'shot-auto-01',
        variantId: 'var-auto-01-a',
        overallScore: 9.3,
        characterConsistency: 9.5,
        temporalStability: 9.4,
        promptFaithfulness: 9.2,
        lightingContinuity: 9.1,
        defects: [],
        status: 'PASSED',
        recommendation: 'ACCEPT',
        analyzedAt: new Date().toISOString()
      }
    },
    {
      id: 'shot-auto-02',
      sceneId: 'scene-auto-1',
      sceneHeading: 'INT. NOODLE BAR BENCH - NIGHT',
      shotNumber: 2,
      shotType: 'MEDIUM',
      cameraMovement: 'TRACKING',
      durationSeconds: 3.8,
      visualPrompt: `Medium profile tracking shot of ${secondChar ? secondChar.name : 'Envoy'} seated at wet steel counter, ${secondChar ? secondChar.consistencyAnchorPrompt : ''}, looking up with glowing optical eyes, high contrast chiaroscuro`,
      negativePrompt: dp.visualBible.renderingTuning.negativePrompt,
      audioDialogue: `${secondChar ? secondChar.name.toUpperCase() : 'ENVIO'}: Did anyone follow you?`,
      audioSfxAmbient: 'Ramen broth boiling, electrical transformer sputtering.',
      lightingCue: 'Intense cobalt blue rim light with amber tungsten key.',
      characterIds: [secondChar ? secondChar.id : mainChar.id],
      status: 'LOCKED',
      progressPct: 100,
      retakeCount: 0,
      retakeHistory: [],
      variants: [
        {
          id: 'var-auto-02-a',
          variantIndex: 1,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          seed: 4891024,
          qaScore: 9.4,
          isSelected: true,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-auto-02-a',
      qaReport: {
        id: 'qa-auto-02',
        shotId: 'shot-auto-02',
        variantId: 'var-auto-02-a',
        overallScore: 9.4,
        characterConsistency: 9.6,
        temporalStability: 9.3,
        promptFaithfulness: 9.5,
        lightingContinuity: 9.2,
        defects: [],
        status: 'PASSED',
        recommendation: 'ACCEPT',
        analyzedAt: new Date().toISOString()
      }
    },
    {
      id: 'shot-auto-03',
      sceneId: 'scene-auto-1',
      sceneHeading: 'INT. NOODLE BAR - CONTINUOUS',
      shotNumber: 3,
      shotType: 'EXTREME_CLOSE_UP',
      cameraMovement: 'ORBIT',
      durationSeconds: 4.2,
      visualPrompt: `Extreme macro close-up of glowing crystalline neural memory shard exploding with holographic data stream, reflecting in eyes, 35mm optical flare, 8k photorealistic`,
      negativePrompt: dp.visualBible.renderingTuning.negativePrompt,
      audioDialogue: `${mainChar.name.toUpperCase()}: This payload... it's human consciousness.`,
      audioSfxAmbient: 'High pitch data resonance synth sweep, glass vibration.',
      lightingCue: 'Prismatic magenta and cyan particle explosion illuminating characters.',
      characterIds: [mainChar.id],
      status: 'LOCKED',
      progressPct: 100,
      retakeCount: 0,
      retakeHistory: [],
      variants: [
        {
          id: 'var-auto-03-a',
          variantIndex: 1,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          seed: 9283104,
          qaScore: 9.2,
          isSelected: true,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-auto-03-a',
      qaReport: {
        id: 'qa-auto-03',
        shotId: 'shot-auto-03',
        variantId: 'var-auto-03-a',
        overallScore: 9.2,
        characterConsistency: 9.3,
        temporalStability: 9.1,
        promptFaithfulness: 9.4,
        lightingContinuity: 9.0,
        defects: [],
        status: 'PASSED',
        recommendation: 'ACCEPT',
        analyzedAt: new Date().toISOString()
      }
    },
    {
      id: 'shot-auto-04',
      sceneId: 'scene-auto-1',
      sceneHeading: 'EXT. ROOFTOP SKY-BRIDGE - DAWN',
      shotNumber: 4,
      shotType: 'WIDE',
      cameraMovement: 'DOLLY_OUT',
      durationSeconds: 4.8,
      visualPrompt: `Wide cinematic pull-back shot of ${mainChar.name} standing on edge of skybridge at dawn overlooking glowing futuristic skyline as city billboards broadcast neural memory, purple storm sky, golden beacon rays`,
      negativePrompt: dp.visualBible.renderingTuning.negativePrompt,
      audioDialogue: `${mainChar.name.toUpperCase()}: The city awakens now.`,
      audioSfxAmbient: 'Rising orchestral synth swell, wind howling over high altitude bridge.',
      lightingCue: 'Dawn purple and gold sunlight piercing smog canyons.',
      characterIds: [mainChar.id],
      status: 'LOCKED',
      progressPct: 100,
      retakeCount: 0,
      retakeHistory: [],
      variants: [
        {
          id: 'var-auto-04-a',
          variantIndex: 1,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          seed: 6712903,
          qaScore: 9.5,
          isSelected: true,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-auto-04-a',
      qaReport: {
        id: 'qa-auto-04',
        shotId: 'shot-auto-04',
        variantId: 'var-auto-04-a',
        overallScore: 9.5,
        characterConsistency: 9.7,
        temporalStability: 9.5,
        promptFaithfulness: 9.4,
        lightingContinuity: 9.4,
        defects: [],
        status: 'PASSED',
        recommendation: 'ACCEPT',
        analyzedAt: new Date().toISOString()
      }
    }
  ];

  return [
    {
      id: 'scene-auto-1',
      sceneNumber: 1,
      heading: 'INT./EXT. NEURAL EXTRACTION & BROADCAST',
      locationId: 'loc-1',
      timeOfDay: 'NIGHT / DAWN',
      dramaticIntent: selectedConcept.premise,
      characterIds: dp.characters.map(c => c.id),
      screenplayText: `EXT. SECTOR 9 ALLEYWAY - NIGHT\n\n${mainChar.name} makes contact with the payload.\n\n${mainChar.name.toUpperCase()} (V.O.)\nEvery city has a memory. Most are corrupted.\n\nINT. NOODLE BAR - CONTINUOUS\n\nThe shard explodes with iridescent neural light.\n\nEXT. SKYBRIDGE - DAWN\n\nThe broadcast unlocks across millions of holographic screens.`,
      estimatedDurationSeconds: 17.3,
      shots: shotList
    }
  ];
}
