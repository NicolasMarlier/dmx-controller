import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDmxButtonsContext } from "./DmxButtonsContext";
import { getProgramDmxMidi, updateProgramDmxMidi } from "../ApiClient";

interface DmxMidiContextType {
    midiPatterns: MidiPattern[]
    selectedMidiPatterns: MidiPattern[],
    setSelectedMidiPatterns: (v: MidiPattern[]) => void,
    updateProgramDmxMidiAndSync: (v: MidiPattern[]) => void
    updateSelectedMidiPatternNotes: (v: MidiNote[]) => void
    allMidiKeys: MidiKey[]
    activeEditor: 'TrackEditor' | 'PatternEditor'
    setActiveEditor: (v: 'TrackEditor' | 'PatternEditor') => void

    isRecording: boolean,
    setIsRecording: (v: boolean) => void
}

const DmxMidiContext = createContext<DmxMidiContextType | null>(null)

export const useDmxMidiContext = () => {
  const dmxMidiContext = useContext(DmxMidiContext);

  if (!dmxMidiContext) {
    throw new Error(
      "useDmxMidiContext has to be used within <RealTimeContext.Provider>"
    )
  }
  return dmxMidiContext
}

export const DmxMidiContextProvider = ({ children }: {children: React.ReactNode}) => {
 
    const { currentProgramId, dmxButtons } = useDmxButtonsContext()
    const currentProgramIdRef = useRef<number>(currentProgramId)
    currentProgramIdRef.current = currentProgramId

    const [selectedMidiPatterns, setSelectedMidiPatterns] = useState<MidiPattern[]>([])
    const [midiPatterns, setMidiPatterns] = useState<MidiPattern[]>([])

    const fetchDmxMidi = () => {
        if(!currentProgramIdRef.current) return

        getProgramDmxMidi(currentProgramIdRef.current).then((dmxMidi) => {
            setMidiPatterns(dmxMidi.midi_patterns)
            setSelectedMidiPatterns(prev =>
                prev.map(sp => dmxMidi.midi_patterns.find(p => p.ticks === sp.ticks) ?? sp)
            )
        })
    }
    const updateProgramDmxMidiAndSync = (midiPatterns: MidiPattern[]) => {
        if(!currentProgramIdRef.current) return
        updateProgramDmxMidi(currentProgramIdRef.current, {midi_patterns: midiPatterns}).then(
            fetchDmxMidi
        )
    }

    const updateSelectedMidiPatternNotes = (updatedNotes: MidiNote[]) => {
        if(selectedMidiPatterns.length != 1) return

        const newPatterns = midiPatterns.map(p =>
            p.ticks === selectedMidiPatterns[0].ticks ? { ...p, midi_notes: updatedNotes } : p
        )
        updateProgramDmxMidiAndSync(newPatterns)
    }

    const allMidiKeys = (dmxButtons.flatMap(({triggering_midi_key}) => triggering_midi_key) || []).toSorted() as MidiKey[]

    const [activeEditor, setActiveEditor] = useState<'TrackEditor' | 'PatternEditor'>('TrackEditor')

    const [isRecording, setIsRecording] = useState(false)
        

    useEffect(fetchDmxMidi, [currentProgramId])
    useEffect(() => setIsRecording(false), [currentProgramId])

    return (
        <DmxMidiContext.Provider value={ {
            midiPatterns,

            selectedMidiPatterns,
            setSelectedMidiPatterns,

            updateProgramDmxMidiAndSync,
            updateSelectedMidiPatternNotes,

            allMidiKeys,
            activeEditor,
            setActiveEditor,

            isRecording,
            setIsRecording,
            } }>
            {children}
        </DmxMidiContext.Provider>
    )
}