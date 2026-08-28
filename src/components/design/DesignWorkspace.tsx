import React, { useState } from 'react';
import { Project, Concept, Character } from '../../types/domain';
import { 
  Sparkles, 
  Users, 
  Globe2, 
  BookOpen, 
  Palette, 
  Clapperboard, 
  CheckCircle2, 
  RotateCcw, 
  Edit3, 
  Lock, 
  Eye,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DesignWorkspaceProps {
  project: Project;
  onSelectConcept: (conceptId: string) => void;
  onRegenerateConcept: (conceptId: string) => void;
  onOpenDesignLock: () => void;
}

export const DesignWorkspace: React.FC<DesignWorkspaceProps> = ({
  project,
  onSelectConcept,
  onRegenerateConcept,
  onOpenDesignLock
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'characters' | 'world' | 'story' | 'visual' | 'storyboard'>('concepts');
  const [selectedCharId, setSelectedCharId] = useState<string>(project.designPackage.characters[0]?.id || '');

  const dp = project.designPackage;
  const activeChar = dp.characters.find(c => c.id === selectedCharId) || dp.characters[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Design Package Subheader Navigation */}
      <div className="border-b border-zinc-900 bg-zinc-950/80 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'concepts'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Concepts ({dp.concepts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'characters'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Characters ({dp.characters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('world')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'world'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>World & Lore</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'story'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Story & 3-Act</span>
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'visual'
                ? 'bg-pink-500/15 text-pink-300 border border-pink-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Visual Bible</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'storyboard'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Storyboard ({dp.storyboard.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-zinc-500 font-mono hidden md:inline">Phase: Design Review & Selection</span>
          <button
            onClick={onOpenDesignLock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Design</span>
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* ===================== TAB 1: CONCEPTS ===================== */}
        {activeTab === 'concepts' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100 font-mono">Film Concept Directions</h3>
                <p className="text-xs text-zinc-400">Select the core creative vision to anchor autonomous screenplay and production.</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-cyan-400">
                Active: {dp.concepts.find(c => c.id === dp.selectedConceptId)?.title}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {dp.concepts.map((concept, index) => {
                const isSelected = concept.id === dp.selectedConceptId;
                return (
                  <div
                    key={concept.id}
                    className={`rounded-xl border p-5 flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? 'bg-zinc-900/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2.5 right-4 bg-cyan-500 text-black text-[10px] font-bold font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3" /> SELECTED DIRECTION
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Option {index + 1}</span>
                        <div className="flex items-center gap-1">
                          {concept.genre.map(g => (
                            <span key={g} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">{g}</span>
                          ))}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-zinc-100">{concept.title}</h4>

                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 block uppercase mb-0.5">Logline</span>
                        <p className="text-xs text-zinc-300 italic leading-relaxed">"{concept.logline}"</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block uppercase mb-0.5">Premise & Stakes</span>
                        <p className="text-xs text-zinc-400 leading-relaxed">{concept.premise}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                        <div className="text-[10px] text-purple-300 font-mono flex items-start gap-1.5">
                          <Eye className="w-3 h-3 shrink-0 mt-0.5 text-purple-400" />
                          <span><strong className="text-purple-200">Visual Hook:</strong> {concept.visualHook}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          <strong className="text-zinc-300">Pacing:</strong> {concept.pacing}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {concept.tone.map(t => (
                          <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onRegenerateConcept(concept.id)}
                        className="px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 font-mono flex items-center gap-1"
                        title="Regenerate this specific concept option"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reroll</span>
                      </button>

                      <button
                        onClick={() => onSelectConcept(concept.id)}
                        disabled={isSelected}
                        className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 cursor-default'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/20'
                        }`}
                      >
                        {isSelected ? 'Active Concept' : 'Select Direction'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: CHARACTERS ===================== */}
        {activeTab === 'characters' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100 font-mono">Cast & Consistency Anchor Bibles</h3>
                <p className="text-xs text-zinc-400">Immutable visual tokens, multi-angle turnarounds, and biometric profiles.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Character Selector List */}
              <div className="lg:col-span-1 space-y-2">
                {dp.characters.map((char) => {
                  const isSelected = char.id === activeChar.id;
                  return (
                    <button
                      key={char.id}
                      onClick={() => setSelectedCharId(char.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-md shadow-purple-500/10'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <img
                        src={char.turnaroundImages.front}
                        alt={char.name}
                        className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate flex-1">
                        <div className="text-xs font-bold text-zinc-200 truncate">{char.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate">{char.role}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </button>
                  );
                })}
              </div>

              {/* Active Character Detail Sheet */}
              <div className="lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-bold text-zinc-100">{activeChar.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                        {activeChar.role}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">{activeChar.archetype}</p>
                  </div>

                  {activeChar.faceMatchScore && (
                    <div className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-right">
                      <span className="text-[9px] text-zinc-500 font-mono block">Face Match Consistency</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{activeChar.faceMatchScore} / 10.0</span>
                    </div>
                  )}
                </div>

                {/* 4-Way Turnaround Reference Photos */}
                <div>
                  <label className="text-xs font-mono text-zinc-300 block mb-2 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    4-Angle Multi-Modal Turnaround References
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden group">
                      <img src={activeChar.turnaroundImages.front} alt="Front" className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-1.5 text-center text-[10px] font-mono text-zinc-400">Front (0°)</div>
                    </div>
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden group">
                      <img src={activeChar.turnaroundImages.angle45} alt="45 Degree" className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-1.5 text-center text-[10px] font-mono text-zinc-400">Quarter (45°)</div>
                    </div>
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden group">
                      <img src={activeChar.turnaroundImages.side} alt="Profile" className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-1.5 text-center text-[10px] font-mono text-zinc-400">Profile (90°)</div>
                    </div>
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden group">
                      <img src={activeChar.turnaroundImages.closeUp} alt="Close Up" className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-1.5 text-center text-[10px] font-mono text-zinc-400">Macro Close-Up</div>
                    </div>
                  </div>
                </div>

                {/* Biometric & Wardrobe Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Physical Specifications</span>
                    <p className="text-zinc-300"><strong className="text-zinc-400">Age / Build:</strong> {activeChar.age} yo • {activeChar.build}</p>
                    <p className="text-zinc-300"><strong className="text-zinc-400">Hair:</strong> {activeChar.hair}</p>
                    <p className="text-zinc-300"><strong className="text-zinc-400">Distinctive Features:</strong> {activeChar.distinctiveFeatures.join(', ')}</p>
                  </div>

                  <div className="space-y-2 bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Wardrobe & Audio</span>
                    <p className="text-zinc-300"><strong className="text-zinc-400">Wardrobe:</strong> {activeChar.defaultWardrobe}</p>
                    <p className="text-zinc-300"><strong className="text-zinc-400">Voice Timbre:</strong> {activeChar.voiceTimbre}</p>
                  </div>
                </div>

                {/* Consistency Anchor Prompt Tokens */}
                <div className="p-3 bg-zinc-950 border border-purple-500/30 rounded-lg">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block mb-1">
                    Consistency Anchor Prompt (Immutable Generation Token)
                  </span>
                  <code className="text-xs font-mono text-zinc-300 break-all select-all">
                    {activeChar.consistencyAnchorPrompt}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: WORLD & LORE ===================== */}
        {activeTab === 'world' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h4 className="text-lg font-bold text-zinc-100">{dp.world.name}</h4>
                  <p className="text-xs text-emerald-400 font-mono">{dp.world.era}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/80 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Geography & Atmosphere</span>
                  <p className="text-zinc-300 leading-relaxed">{dp.world.geography}</p>
                  <p className="text-zinc-400 text-[11px]"><strong className="text-zinc-300">Lighting Atmosphere:</strong> {dp.world.lightingAtmosphere}</p>
                </div>

                <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/80 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Societal Laws & Tech Level</span>
                  <p className="text-zinc-300 leading-relaxed"><strong className="text-zinc-400">Tech:</strong> {dp.world.technologyLevel}</p>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[11px]">
                    {dp.world.societalRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Location Cards */}
              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-3">Key Film Locations</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dp.world.keyLocations.map((loc) => (
                    <div key={loc.id} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                      <img src={loc.referenceImage} alt={loc.name} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="text-sm font-bold text-zinc-200">{loc.name}</h5>
                          <p className="text-xs text-zinc-400 mt-1">{loc.description}</p>
                        </div>
                        <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[10px] font-mono text-cyan-300">
                          <strong>Lighting:</strong> {loc.lightingPrompt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: STORY & 3-ACT ===================== */}
        {activeTab === 'story' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-5">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 font-mono">Narrative Architecture & 3-Act Structure</h4>
                <p className="text-xs text-zinc-400 mt-1 italic leading-relaxed">"{dp.storyBible.synopsis}"</p>
                <div className="mt-2 text-xs font-mono text-amber-400">
                  <strong>Thematic Statement:</strong> {dp.storyBible.themeStatement}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dp.storyBible.acts.map((act) => (
                  <div key={act.actNumber} className="bg-zinc-950 border border-zinc-800/90 rounded-lg p-4 space-y-2.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                      ACT {act.actNumber}
                    </span>
                    <h5 className="text-sm font-bold text-zinc-200">{act.title}</h5>
                    <p className="text-xs text-zinc-400"><strong className="text-zinc-300">Objective:</strong> {act.objective}</p>
                    <p className="text-xs text-zinc-400"><strong className="text-amber-300">Turning Point:</strong> {act.turnPoint}</p>
                  </div>
                ))}
              </div>

              {/* Character Arcs */}
              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-2">Character Narrative Arcs</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dp.storyBible.narrativeArcs.map((arc) => (
                    <div key={arc.characterId} className="bg-zinc-950/70 border border-zinc-800 p-3.5 rounded-lg text-xs space-y-1.5">
                      <div className="font-bold text-zinc-200 font-mono">{arc.characterName}</div>
                      <div className="text-[11px] text-zinc-400"><strong className="text-zinc-500">Starts:</strong> {arc.startingState}</div>
                      <div className="text-[11px] text-purple-300"><strong className="text-purple-400">Climax:</strong> {arc.climaxState}</div>
                      <div className="text-[11px] text-emerald-300"><strong className="text-emerald-400">Ends:</strong> {arc.endingState}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: VISUAL BIBLE ===================== */}
        {activeTab === 'visual' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-6">
              {/* Color Palette Swatches */}
              <div>
                <h4 className="text-sm font-bold text-zinc-200 font-mono mb-3">Dominant Cinematic Color Palette</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dp.visualBible.colorPalette.map((swatch) => (
                    <div key={swatch.hex} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-2">
                      <div className="w-full h-16 rounded-md shadow-inner" style={{ backgroundColor: swatch.hex }} />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-200">{swatch.name}</span>
                        <span className="font-mono text-zinc-400">{swatch.hex}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">Weight: {swatch.weight}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Camera & Lens Package */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/80 space-y-2">
                  <span className="text-[10px] font-mono text-pink-400 uppercase block">Anamorphic Camera Package</span>
                  <p className="text-zinc-300"><strong className="text-zinc-400">Film Stock / Grain:</strong> {dp.visualBible.cameraPackage.filmStock}</p>
                  <p className="text-zinc-300"><strong className="text-zinc-400">Lenses:</strong> {dp.visualBible.cameraPackage.lensTypes.join(', ')}</p>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[11px]">
                    {dp.visualBible.cameraPackage.compositionRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/80 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase block">Lighting & Prompt Tuning</span>
                  <p className="text-zinc-300 leading-relaxed"><strong className="text-zinc-400">Lighting Style:</strong> {dp.visualBible.lightingStyle}</p>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                    <strong className="text-emerald-400">Style Keywords:</strong> {dp.visualBible.renderingTuning.styleKeywords.join(', ')}
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-red-400/90">
                    <strong>Negative Filters:</strong> {dp.visualBible.renderingTuning.negativePrompt}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: STORYBOARD ===================== */}
        {activeTab === 'storyboard' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100 font-mono">Storyboard Phác Thảo & Camera Script</h3>
                <p className="text-xs text-zinc-400">Preliminary shot compositions prior to autonomous production breakdown.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dp.storyboard.map((frame) => (
                <div key={frame.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                  <div className="relative">
                    <img src={frame.previewImage} alt={frame.sceneHeading} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-zinc-700">
                      Frame #{frame.frameNumber} • {frame.shotType}
                    </div>
                    <div className="absolute top-2 right-2 bg-purple-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 border border-purple-800">
                      {frame.cameraMovement}
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-zinc-200">{frame.sceneHeading}</div>
                      <p className="text-xs text-zinc-400 mt-1">{frame.visualDescription}</p>
                    </div>

                    {frame.audioDialogue && (
                      <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-amber-300">
                        {frame.audioDialogue}
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-zinc-500">
                      <strong>Lighting:</strong> {frame.lightingCue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
