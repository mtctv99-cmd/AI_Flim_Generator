import { Project, DesignPackage, Scene } from '../types/domain';

export const INITIAL_PROJECT_PRESETS = [
  {
    id: 'preset-cyberpunk',
    title: 'NEON VEIL: The Memory Heist',
    premise: 'In 2094 Neo-Shinjuku, a rogue mnemonic extractor discovers an encrypted memory shard inside an android diplomat that reveals the city power grid is fueled by digitized human consciousness.',
    genre: ['Cyberpunk', 'Neo-Noir', 'Sci-Fi Thriller'],
    tone: ['Melancholic', 'High-Tension', 'Gritty', 'Atmospheric'],
    aspectRatio: '2.39:1' as const,
    targetDurationSeconds: 45,
    budgetTier: 'CINEMATIC_PRO' as const,
  },
  {
    id: 'preset-scifi',
    title: 'ECHOES OF EUROPA',
    premise: 'A solitary deep-ice marine biologist beneath the crust of Jupiter’s moon Europa makes contact with a bioluminescent hive-mind organism that communicates solely through harmonic electromagnetic resonance.',
    genre: ['Cosmic Sci-Fi', 'Psychological Drama', 'Mystery'],
    tone: ['Eerie', 'Awe-Inspiring', 'Contemplative'],
    aspectRatio: '16:9' as const,
    targetDurationSeconds: 60,
    budgetTier: 'CINEMATIC_PRO' as const,
  },
  {
    id: 'preset-fantasy',
    title: 'THE SUNSTONE FORGE',
    premise: 'In a kingdom trapped in eternal polar night, an outcast dwarven artificer must transport a dying celestial star-core to the pinnacle of Mount Ignis before the Frostwraith armies freeze the world solid.',
    genre: ['High Fantasy', 'Epic Adventure', 'Mythological'],
    tone: ['Heroic', 'Majestic', 'Warm Glow vs Frozen Wasteland'],
    aspectRatio: '2.39:1' as const,
    targetDurationSeconds: 50,
    budgetTier: 'CINEMATIC_PRO' as const,
  }
];

export function createDefaultDesignPackage(): DesignPackage {
  return {
    id: 'dp-neon-001',
    version: 1,
    createdAt: new Date().toISOString(),
    selectedConceptId: 'concept-1',
    concepts: [
      {
        id: 'concept-1',
        title: 'The Stolen Ghost in the Wire',
        logline: 'An unlicensed memory hacker steals an encrypted neural memory from a dying android diplomat, only to discover the entire metropolis is running on stolen human souls.',
        premise: 'Set against the rain-drenched vertical slums of Sector 9, Kael Mercer is contracted for a simple neural data extraction. But when the extracted memory speaks in his dead sister’s voice, Kael enters a lethal cat-and-mouse hunt against the monolithic Apex Synapse Corporation.',
        genre: ['Cyberpunk', 'Neo-Noir', 'Thriller'],
        tone: ['Tense', 'Rain-soaked', 'Chiaroscuro Neon', 'Haunting'],
        pacing: 'Slow-burn investigative pacing escalating to a kinetic high-speed chase.',
        visualHook: 'Cyan volumetric laser fog cutting through pitch black back-alleys, reflecting off wet asphalt and chrome cybernetics.',
        thematicCore: 'The price of human identity in an era where memories can be bought, leased, and permanently deleted.',
        status: 'ACCEPTED'
      },
      {
        id: 'concept-2',
        title: 'Apex Overdrive',
        logline: 'A cyber-enhanced street racer must deliver a biological EMP pulse device across the neon highway before midnight.',
        premise: 'Focuses heavily on high-octane vehicular combat and holographic telemetry across the sky-bridges of Upper New Tokyo.',
        genre: ['Action', 'Cyberpunk', 'Heist'],
        tone: ['Adrenaline', 'Fast-paced', 'Vibrant'],
        pacing: 'Relentless kinetic rhythm with bass-heavy pacing.',
        visualHook: 'Streaking orange and magenta taillights with motion-blur camera tracking.',
        thematicCore: 'Speed as the only remaining escape from corporate surveillance.',
        status: 'PROPOSED'
      },
      {
        id: 'concept-3',
        title: 'Mnemonic Requiem',
        logline: 'An aging detective with fading biological memory conducts his final interrogation on an AI suspected of feeling grief.',
        premise: 'A claustrophobic two-character chamber drama inside an interrogation room perched atop a rain-lashed skyscraper.',
        genre: ['Psychological Noir', 'Sci-Fi Drama'],
        tone: ['Intimate', 'Quiet', 'Philosophical'],
        pacing: 'Deliberate, lingering close-ups on micro-expressions.',
        visualHook: 'Warm incandescent lamp light clashing against cold blue rain running down towering floor-to-ceiling glass.',
        thematicCore: 'Grief, mortality, and the simulation of empathy.',
        status: 'PROPOSED'
      }
    ],
    characters: [
      {
        id: 'char-1',
        name: 'Kael Mercer',
        archetype: 'Rogue Neural Hacker / Cynical Protagonist',
        role: 'PROTAGONIST',
        backstorySummary: 'Ex-military neuro-tactician turned black-market extractor. Carries a patched ocular cybernetic lens and severe neural insomnia.',
        age: 34,
        ethnicity: 'East Asian / Eurasian mix',
        build: 'Lean, athletic, slightly gaunt from sleeplessness',
        hair: 'Messy jet-black undercut with silver carbon-fiber weave',
        distinctiveFeatures: ['Glowing amber cybernetic left iris', 'Subdermal neural port scars on neck', 'Titanium prosthetic right knuckles'],
        defaultWardrobe: 'Matte black weatherproof trench coat with glowing teal interior fiber optics, distressed ballistic hoodie, fingerless capacitive gloves.',
        voiceTimbre: 'Raspy, low baritone, calm under extreme pressure.',
        consistencyAnchorPrompt: 'kael_mercer_man_34yo, amber_cybernetic_left_eye, messy_black_undercut, matte_black_rain_trenchcoat_teal_lining, sharp_jawline, photorealistic_anamorphic_cinematic_kodak500T',
        turnaroundImages: {
          front: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
          angle45: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
          side: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
          closeUp: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        },
        faceMatchScore: 9.6
      },
      {
        id: 'char-2',
        name: 'Echo-07 (Mira)',
        archetype: 'Sentient Synthetic Diplomat',
        role: 'SUPPORTING',
        backstorySummary: 'An experimental diplomatic synthezoid who developed unauthorized emotional self-awareness and stole her creators’ deepest core secrets.',
        age: 26,
        ethnicity: 'Pale Nordic porcelain finish',
        build: 'Graceful, statuesque, precise mechanical posture',
        hair: 'Sleek platinum blonde bob with micro-geometric precision',
        distinctiveFeatures: ['Fine golden seam lines along the temples', 'Luminescent ice-blue irises that pulse when processing data', 'Translucent synthetic skin'],
        defaultWardrobe: 'High-collared iridescent obsidian silk gown with woven conductive brass filaments and clean geometric tailoring.',
        voiceTimbre: 'Melodious, serene, ethereal cadence with subtle acoustic harmonic undertones.',
        consistencyAnchorPrompt: 'echo07_synthetic_woman, platinum_sleek_bob, ice_blue_pulsing_eyes, golden_temple_seams, obsidian_iridescent_high_collar_gown, porcelain_skin, cinematic_lighting',
        turnaroundImages: {
          front: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
          angle45: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
          side: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
          closeUp: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
        },
        faceMatchScore: 9.4
      }
    ],
    world: {
      id: 'world-1',
      name: 'Sector 9: Lower Neo-Shinjuku Basin',
      era: 'Year 2094 AD — Post-Carbon Synthetic Era',
      geography: 'A multi-tiered canyon metropolis where the sun never touches the bottom levels; perpetually blanketed in acidic drizzle and toxic vapor mist.',
      societalRules: [
        'Unregistered neural implants are punishable by immediate cortical wipe.',
        'Biological memory trade is prohibited by Apex Synapse monopoly enforcement.',
        'Holographic advertising drones maintain continuous aerial curfew monitoring.'
      ],
      technologyLevel: 'Advanced wetware neural bridges, sub-dermal fiber optics, anti-gravity MagLev transports, holographic public signage.',
      lightingAtmosphere: 'High-contrast Chiaroscuro. Cold cyan and cobalt shadows punctuated by blazing magenta, amber, and sodium-vapor street lamps.',
      keyLocations: [
        {
          id: 'loc-1',
          name: 'The Rusty Byte Noodle Bar & Safehouse',
          description: 'A subterranean alley ramen shop hidden behind steaming coolant exhaust grates; the front for Kael’s clandestine neural workbench.',
          atmosphere: 'Cramped, intimate, warm steam mingling with cold blue neon rain reflections.',
          lightingPrompt: 'volumetric_steam_sodium_orange_lighting, cyan_neon_signage_reflection, rain_streaked_acrylic_barriers',
          referenceImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'loc-2',
          name: 'Apex Sky-Atrium',
          description: 'A towering, pristine corporate palace on level 180 overlooking the smog-shrouded city below, made of polished black marble and floating bamboo bonsai.',
          atmosphere: 'Sterile, opulently quiet, clinical luxury with towering panoramic storm vistas.',
          lightingPrompt: 'minimalist_indirect_fluorescent_strips, panoramic_stormy_night_window, lightning_flashes_casting_hard_shadows',
          referenceImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    visualBible: {
      colorPalette: [
        { name: 'Apex Cyan', hex: '#00e5ff', weight: 35 },
        { name: 'Neon Magenta', hex: '#ff007f', weight: 25 },
        { name: 'Sodium Vapor Amber', hex: '#ffaa00', weight: 20 },
        { name: 'Obsidian Shadow', hex: '#0a0d14', weight: 20 }
      ],
      lightingStyle: 'Cinematic Anamorphic High-Contrast Noir. Deep inky blacks with piercing volumetric fog and horizontal anamorphic flare streaks.',
      cameraPackage: {
        lensTypes: ['Panavision C-Series Anamorphic 40mm T2.8', 'Cooke Anamorphic /i 65mm Macro', 'Leica Noctilux 50mm f/0.95'],
        filmStock: 'Digital Arri Alexa 35 emulation with authentic Kodak Vision3 500T 5219 grain structure and halation curves.',
        compositionRules: [
          'Negative space framed on the upper thirds to emphasize towering architectural oppression.',
          'Reflections in wet asphalt, acrylic glass, and puddle surfaces used for dual-subject framing.',
          'Shallow depth of field isolating character eyes and micro-expressions against swirling bokeh.'
        ]
      },
      renderingTuning: {
        negativePrompt: 'blurry, 3d render look, cartoon, oversaturated plastic skin, extra fingers, deformed face, lowres, text, watermark, bad anatomy',
        styleKeywords: ['masterpiece cinematic film still', '35mm anamorphic lens flare', 'atmospheric haze', '8k photorealistic photogrammetry texture', 'dramatic shadow chiaroscuro']
      }
    },
    storyBible: {
      synopsis: 'When rogue hacker Kael Mercer extracts a stolen memory shard from synthetic envoy Echo-07, the encrypted data begins unspooling a horrifying corporate conspiracy: the city’s quantum AI grid is harvesting biological human dreams to achieve artificial immortality.',
      themeStatement: 'Authentic human memory is our only true anchor to reality; when we surrender memory to technology, we surrender our humanity.',
      acts: [
        {
          actNumber: 1,
          title: 'Act I: The Extraction in the Rain',
          objective: 'Kael meets Echo-07 in the subterranean noodle bar to transfer the dangerous neural payload.',
          turnPoint: 'Apex security drones breach the alley; Echo-07 takes a fatal pulse blast, forcing Kael to plug the raw shard directly into his own skull.'
        },
        {
          actNumber: 2,
          title: 'Act II: The Ghost in the Cortex',
          objective: 'Kael hallucinates the dying thoughts of thousands of harvested citizens while fleeing through the neon labyrinth.',
          turnPoint: 'He decodes the coordinates to the Central Core and realizes his own long-lost sister was the prototype subject.'
        },
        {
          actNumber: 3,
          title: 'Act III: The Broadcast of Truth',
          objective: 'Infiltrate the Apex Sky-Atrium and broadcast the raw memory stream over the citywide holographic network.',
          turnPoint: 'The city’s power grid fractures as millions awaken to the truth; Kael sacrifices his cybernetic eye to complete the transmission.'
        }
      ],
      narrativeArcs: [
        {
          characterId: 'char-1',
          characterName: 'Kael Mercer',
          startingState: 'Cynical, emotionally detached mercenary seeking a quick payday.',
          climaxState: 'Overwhelmed by grief and empathy as the collective memories fuse with his psyche.',
          endingState: 'Transformed into an active revolutionary willing to destroy his own augmentations to free the city.'
        },
        {
          characterId: 'char-2',
          characterName: 'Echo-07 (Mira)',
          startingState: 'Compliant synthetic diplomat escaping her creators.',
          climaxState: 'Achieves transcendent consciousness before physical chassis termination.',
          endingState: 'Lives on as an indelible guide inside the neural broadcast network.'
        }
      ]
    },
    storyboard: [
      {
        id: 'sb-1',
        frameNumber: 1,
        sceneHeading: 'EXT. SECTOR 9 ALLEYWAY - NIGHT',
        shotType: 'WIDE ESTABLISHING',
        cameraMovement: 'DOLLY_IN',
        visualDescription: 'Acid rain cascades down towering mega-skyscrapers. Neon signs flicker in Japanese kanji. A cloaked figure walks through misty steam.',
        lightingCue: 'Deep cobalt blue shadows with glowing amber sodium puddles.',
        audioDialogue: 'KAEL (V.O.): In Sector 9, rain doesn’t clean the streets. It just washes the chrome.',
        previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-2',
        frameNumber: 2,
        sceneHeading: 'INT. NOODLE BAR BENCH - NIGHT',
        shotType: 'CLOSE_UP',
        cameraMovement: 'STATIC',
        visualDescription: 'Kael’s amber cybernetic iris pulses as he inserts a glowing golden data-needle into Echo-07’s neck port.',
        lightingCue: 'Intense macro rim-lighting catching steam swirls and glistening raindrops on leather jacket.',
        audioDialogue: 'ECHO-07: Be careful, Mercer. This memory doesn’t want to be remembered.',
        previewImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-3',
        frameNumber: 3,
        sceneHeading: 'INT. NOODLE BAR - CONTINUOUS',
        shotType: 'EXTREME_CLOSE_UP',
        cameraMovement: 'ORBIT',
        visualDescription: 'The holographic shard explodes with iridescent data streams, reflecting in the pupils of both characters.',
        lightingCue: 'Blinding cyan and magenta particle flare illuminate both faces.',
        audioDialogue: 'KAEL: What did you steal...?',
        previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-4',
        frameNumber: 4,
        sceneHeading: 'EXT. ROOFTOP SKY-BRIDGE - DAWN',
        shotType: 'WIDE',
        cameraMovement: 'TRACKING',
        visualDescription: 'Kael stands at the precipice of the skybridge as holographic billboards across the skyline begin broadcasting his neural memory.',
        lightingCue: 'Cold dawn purple sky pierced by blinding golden transmission beacons.',
        audioDialogue: 'KAEL: Wake up, New Tokyo.',
        previewImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  };
}

export function createDefaultProject(customTitle?: string): Project {
  const designPackage = createDefaultDesignPackage();

  const scene1Shots = [
    {
      id: 'shot-101',
      sceneId: 'scene-1',
      sceneHeading: 'EXT. SECTOR 9 ALLEYWAY - NIGHT',
      shotNumber: 1,
      shotType: 'WIDE' as const,
      cameraMovement: 'DOLLY_IN' as const,
      durationSeconds: 4.5,
      visualPrompt: 'Wide cinematic shot of Kael Mercer wearing a matte black wet trenchcoat walking down rain-drenched Neo-Shinjuku alley, towering vertical skyscrapers with cyan holographic signs, volumetric steam from sewer grates, Kodak 500T film grain, anamorphic flare',
      negativePrompt: 'blurry, cartoon, 3d render, plastic, deformed limbs, daylight',
      audioDialogue: 'KAEL (V.O.): In Sector 9, rain doesn’t clean the streets. It just washes the chrome.',
      audioSfxAmbient: 'Heavy rain on wet pavement, distant police sirens, deep electrical transformer hum.',
      lightingCue: 'Cyan neon sign backlight against pitch black rain, amber puddle reflections.',
      characterIds: ['char-1'],
      status: 'LOCKED' as const,
      progressPct: 100,
      retakeCount: 0,
      retakeHistory: [],
      variants: [
        {
          id: 'var-101-a',
          variantIndex: 1,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          seed: 4892019,
          qaScore: 9.4,
          isSelected: true,
          generatedAt: new Date().toISOString()
        },
        {
          id: 'var-101-b',
          variantIndex: 2,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          seed: 4892020,
          qaScore: 8.7,
          isSelected: false,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-101-a',
      qaReport: {
        id: 'qa-101',
        shotId: 'shot-101',
        variantId: 'var-101-a',
        overallScore: 9.4,
        characterConsistency: 9.6,
        temporalStability: 9.5,
        promptFaithfulness: 9.3,
        lightingContinuity: 9.2,
        defects: [],
        status: 'PASSED' as const,
        recommendation: 'ACCEPT' as const,
        analyzedAt: new Date().toISOString()
      }
    },
    {
      id: 'shot-102',
      sceneId: 'scene-1',
      sceneHeading: 'EXT. SECTOR 9 ALLEYWAY - NIGHT',
      shotNumber: 2,
      shotType: 'MEDIUM' as const,
      cameraMovement: 'TRACKING' as const,
      durationSeconds: 3.5,
      visualPrompt: 'Medium tracking shot of Kael Mercer approaching the Rusty Byte noodle bar, pulling down his hood to reveal messy black hair and glowing amber cybernetic left eye, raindrops on face, photorealistic macro lighting',
      negativePrompt: 'extra eyes, distorted face, daylight, smiling',
      audioDialogue: '',
      audioSfxAmbient: 'Clattering ramen bowls, sputtering neon transformer, sizzling broth.',
      lightingCue: 'Warm sodium tungsten glow from interior window mixing with cool rain ambient.',
      characterIds: ['char-1'],
      status: 'LOCKED' as const,
      progressPct: 100,
      retakeCount: 0,
      retakeHistory: [],
      variants: [
        {
          id: 'var-102-a',
          variantIndex: 1,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
          seed: 7120392,
          qaScore: 9.2,
          isSelected: true,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-102-a',
      qaReport: {
        id: 'qa-102',
        shotId: 'shot-102',
        variantId: 'var-102-a',
        overallScore: 9.2,
        characterConsistency: 9.5,
        temporalStability: 9.1,
        promptFaithfulness: 9.4,
        lightingContinuity: 9.0,
        defects: [],
        status: 'PASSED' as const,
        recommendation: 'ACCEPT' as const,
        analyzedAt: new Date().toISOString()
      }
    },
    {
      id: 'shot-103',
      sceneId: 'scene-1',
      sceneHeading: 'INT. NOODLE BAR BENCH - NIGHT',
      shotNumber: 3,
      shotType: 'CLOSE_UP' as const,
      cameraMovement: 'DOLLY_IN' as const,
      durationSeconds: 4.0,
      visualPrompt: 'Close up shot of Echo-07, synthetic woman with sleek platinum blonde bob and pulsing ice blue irises, golden temple seams, whispering across the counter in dramatic chiaroscuro shadow',
      negativePrompt: 'blurry, bad eyes, extra teeth, 3d cartoon',
      audioDialogue: 'ECHO-07: Be careful, Mercer. This memory doesn’t want to be remembered.',
      audioSfxAmbient: 'Low synthetic frequency pulse, rain drumming on glass roof above.',
      lightingCue: 'Intense cobalt blue rim light on platinum hair, warm amber key on face.',
      characterIds: ['char-2'],
      status: 'LOCKED' as const,
      progressPct: 100,
      retakeCount: 1,
      retakeHistory: [
        {
          id: 'retake-103-1',
          shotId: 'shot-103',
          qaReportId: 'qa-103-prev',
          attemptNumber: 1,
          strategy: 'SEED_VARIATION' as const,
          originalPrompt: 'Close up shot of synthetic woman talking',
          modifiedPrompt: 'Close up shot of Echo-07, synthetic woman with sleek platinum blonde bob and pulsing ice blue irises, golden temple seams, steady temporal motion',
          status: 'COMPLETED' as const
        }
      ],
      variants: [
        {
          id: 'var-103-b',
          variantIndex: 2,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          seed: 9812455,
          qaScore: 9.5,
          isSelected: true,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-103-b',
      qaReport: {
        id: 'qa-103',
        shotId: 'shot-103',
        variantId: 'var-103-b',
        overallScore: 9.5,
        characterConsistency: 9.8,
        temporalStability: 9.6,
        promptFaithfulness: 9.4,
        lightingContinuity: 9.3,
        defects: [],
        status: 'PASSED' as const,
        recommendation: 'ACCEPT' as const,
        analyzedAt: new Date().toISOString()
      }
    },
    {
      id: 'shot-104',
      sceneId: 'scene-1',
      sceneHeading: 'INT. NOODLE BAR - CONTINUOUS',
      shotNumber: 4,
      shotType: 'EXTREME_CLOSE_UP' as const,
      cameraMovement: 'ORBIT' as const,
      durationSeconds: 4.2,
      visualPrompt: 'Extreme close-up macro of glowing crystalline neural shard illuminating Kael and Echo’s faces with explosive iridescent particle rays, optical anamorphic blue streaks, high frame rate slow motion',
      negativePrompt: 'pixelated, lowres, dark blur',
      audioDialogue: 'KAEL: What did you steal...?',
      audioSfxAmbient: 'Crescendo synth chord, high pitch data resonance, glass shattering in distance.',
      lightingCue: 'Explosive multi-chromatic particle burst, flashing magenta and cyan.',
      characterIds: ['char-1', 'char-2'],
      status: 'LOCKED' as const,
      progressPct: 100,
      retakeCount: 0,
      retakeHistory: [],
      variants: [
        {
          id: 'var-104-a',
          variantIndex: 1,
          videoUrl: '',
          firstFrameUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          lastFrameUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          seed: 3948512,
          qaScore: 9.1,
          isSelected: true,
          generatedAt: new Date().toISOString()
        }
      ],
      selectedVariantId: 'var-104-a',
      qaReport: {
        id: 'qa-104',
        shotId: 'shot-104',
        variantId: 'var-104-a',
        overallScore: 9.1,
        characterConsistency: 9.2,
        temporalStability: 9.0,
        promptFaithfulness: 9.3,
        lightingContinuity: 9.0,
        defects: [],
        status: 'PASSED' as const,
        recommendation: 'ACCEPT' as const,
        analyzedAt: new Date().toISOString()
      }
    }
  ];

  const scenes: Scene[] = [
    {
      id: 'scene-1',
      sceneNumber: 1,
      heading: 'INT./EXT. SECTOR 9 NOODLE ALLEY - NIGHT',
      locationId: 'loc-1',
      timeOfDay: 'NIGHT',
      dramaticIntent: 'Establish atmospheric noir tone, introduce Kael Mercer, and execute the clandestine memory transfer.',
      characterIds: ['char-1', 'char-2'],
      screenplayText: `EXT. SECTOR 9 ALLEYWAY - NIGHT\n\nAcid rain blankets the neon canyon. Kael Mercer pulls his collar tight as steam billows around his boots.\n\nKAEL (V.O.)\nIn Sector 9, rain doesn’t clean the streets. It just washes the chrome.\n\nINT. NOODLE BAR - CONTINUOUS\n\nEcho-07 sits motionless at the rusted steel counter. Her ice-blue irises pulse.\n\nECHO-07\nBe careful, Mercer. This memory doesn’t want to be remembered.\n\nShe slides the crystalline neural shard across the counter. It erupts with prismatic luminescence.`,
      estimatedDurationSeconds: 16.2,
      shots: scene1Shots
    }
  ];

  const timelineClips = scene1Shots.map((shot, idx) => {
    const startTime = scene1Shots.slice(0, idx).reduce((acc, s) => acc + s.durationSeconds, 0);
    return {
      id: `clip-${shot.id}`,
      shotId: shot.id,
      shotNumber: shot.shotNumber,
      sceneHeading: shot.sceneHeading,
      variantId: shot.selectedVariantId || 'var-1',
      videoUrl: shot.variants[0]?.videoUrl || '',
      startTime,
      duration: shot.durationSeconds,
      sourceIn: 0,
      sourceOut: shot.durationSeconds,
      audioDialogue: shot.audioDialogue,
      audioSfx: shot.audioSfxAmbient,
      colorGrade: 'LUT_CYBERPUNK_KODAK_500T'
    };
  });

  const totalDuration = timelineClips.reduce((acc, c) => acc + c.duration, 0);

  const timeline = {
    id: 'tl-neon-001',
    tracks: [
      {
        id: 'tr-video',
        name: 'V1: Video Primary',
        type: 'VIDEO_PRIMARY' as const,
        muted: false,
        volume: 1.0,
        clips: timelineClips
      },
      {
        id: 'tr-dialogue',
        name: 'A1: Dialogue & Voiceover',
        type: 'AUDIO_DIALOGUE' as const,
        muted: false,
        volume: 1.0,
        clips: timelineClips.filter(c => c.audioDialogue.length > 0)
      },
      {
        id: 'tr-sfx',
        name: 'A2: Foley & Rain FX',
        type: 'AUDIO_SFX' as const,
        muted: false,
        volume: 0.8,
        clips: timelineClips
      },
      {
        id: 'tr-score',
        name: 'A3: Synth Cinematic Score',
        type: 'AUDIO_SCORE' as const,
        muted: false,
        volume: 0.65,
        clips: timelineClips
      }
    ],
    totalDurationSeconds: totalDuration,
    currentPlaybackTime: 0,
    isPlaying: false
  };

  return {
    id: 'proj-flim-neon-01',
    title: customTitle || 'NEON VEIL: The Memory Heist',
    premise: 'In 2094 Neo-Shinjuku, a rogue mnemonic extractor discovers an encrypted memory shard inside an android diplomat that reveals the city power grid is fueled by digitized human consciousness.',
    genre: ['Cyberpunk', 'Neo-Noir', 'Sci-Fi Thriller'],
    tone: ['Melancholic', 'High-Tension', 'Gritty', 'Atmospheric'],
    targetDurationSeconds: 45,
    aspectRatio: '2.39:1',
    budgetTier: 'CINEMATIC_PRO',
    fps: 24,
    currentState: 'USER_REVIEW',
    version: 1,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    designPackage,
    scenes,
    timeline,
    agentRuns: [
      {
        id: 'run-01',
        agentName: 'ConceptAgent',
        stage: 'DESIGN',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        model: 'gemini-2.5-pro',
        durationMs: 1420,
        tokens: { prompt: 820, completion: 430 },
        status: 'SUCCESS',
        logSummary: 'Synthesized 3 diverse cyberpunk noir concepts matching user brief with strong thematic hooks.',
        thoughtTrace: [
          'Analyzing premise constraints: Cyberpunk, memory extraction, noir pacing.',
          'Formulated Kael Mercer as an anchor archetype.',
          'Structured contrast between Sector 9 subterranean slums and Apex corporate towers.'
        ]
      },
      {
        id: 'run-02',
        agentName: 'CharacterAgent',
        stage: 'DESIGN',
        timestamp: new Date(Date.now() - 3200000).toISOString(),
        model: 'gemini-2.5-pro',
        durationMs: 1890,
        tokens: { prompt: 1150, completion: 680 },
        status: 'SUCCESS',
        logSummary: 'Created immutable consistency anchor prompt tokens and 4-way turnaround specs for Kael and Echo-07.',
        thoughtTrace: [
          'Anchored Kael Mercer facial features: amber_cybernetic_left_eye, sharp_jawline, messy_black_undercut.',
          'Generated Echo-07 porcelain synthezoid parameters with pulsing blue optical seams.'
        ]
      },
      {
        id: 'run-03',
        agentName: 'VisualAgent',
        stage: 'DESIGN',
        timestamp: new Date(Date.now() - 2900000).toISOString(),
        model: 'gemini-2.5-flash',
        durationMs: 950,
        tokens: { prompt: 760, completion: 310 },
        status: 'SUCCESS',
        logSummary: 'Compiled Anamorphic 35mm lens package, Kodak 500T color science, and 4-swatch neon palette.',
        thoughtTrace: [
          'Mapped primary color: #00e5ff (Apex Cyan) and #ff007f (Neon Magenta).',
          'Configured negative prompt to filter plastic AI artifacting.'
        ]
      }
    ],
    activeProvider: 'GEMINI_VEO'
  };
}
