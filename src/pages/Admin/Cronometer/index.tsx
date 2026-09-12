import { useEffect, useRef, useState } from "react"
import { Ban, Bike, CheckCircle2, Clock3, Dumbbell, Maximize2, Settings2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTournamentStore } from "@/stores/tournaments"
import { useFetchTournament, useFinishTournament, useStartTournament } from "@/services/useTournaments"
import { useCorrectAthleteLap, useCreateAthleteLap, useCreateAthleteLapBatch, useDeleteAthleteLap, useDestroyAthleteLapBatch, useLastFiveLaps } from "@/services/useAthleteLaps"
import { useCreateDisqualification, useDeleteDisqualification, useFetchLastFiveDisqualifications } from "@/services/useDisqualifications"
import { useFetchAthletes } from "@/services/useAthletes"

type PendingArrival = { id: string; recordedAt: string; elapsedMs: number }
type RecentLap = { id: string; attributes: { athlete: { attributes: { plate: string; name: string } }; formatted_time: string } }
type RecentDisqualification = { id: string; plate: string; name: string }
type RuntimeAthlete = { id: string; name?: string; plate?: string; attributes?: { name: string; plate: string; category?: { attributes?: { name?: string } } } }
type LastConfirmation = { plate: string; name: string; time: string }
type TrainingIntensity = "light" | "normal" | "intense"

const formatTime = (ms: number) => {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = Math.floor(ms % 1000)
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`
}

export const Cronometer = () => {
  const { currentTournament } = useTournamentStore()
  const tournamentId = currentTournament?.id as string
  const { data: tournament } = useFetchTournament(tournamentId)
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [time, setTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const plateInputRef = useRef<HTMLInputElement>(null)
  const focusContainerRef = useRef<HTMLDivElement>(null)
  const loadedPendingKeyRef = useRef<string | null>(null)
  const realPendingBackupRef = useRef<PendingArrival[]>([])
  const shortcutHandlerRef = useRef<(event: KeyboardEvent) => void>(() => undefined)
  const trainingArrivalTimeoutRef = useRef<number | null>(null)
  const trainingEndTimeoutRef = useRef<number | null>(null)
  const trainingCountdownIntervalRef = useRef<number | null>(null)
  const trainingRemainingPlatesRef = useRef<string[]>([])
  const trainingDisplayWindowRef = useRef<Window | null>(null)
  const trainingChannelRef = useRef<BroadcastChannel | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [competitionConfigOpen, setCompetitionConfigOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [plate, setPlate] = useState("")
  const [disqualificationPlate, setDisqualificationPlate] = useState("")
  const [pendingArrivals, setPendingArrivals] = useState<PendingArrival[]>([])
  const [operatorMessage, setOperatorMessage] = useState("Digite a placa e pressione Enter")
  const [operatorStatus, setOperatorStatus] = useState<"normal" | "success" | "error">("normal")
  const [lastConfirmation, setLastConfirmation] = useState<LastConfirmation | null>(null)
  const [pelotonOpen, setPelotonOpen] = useState(false)
  const [pelotonInput, setPelotonInput] = useState("")
  const [pelotonReview, setPelotonReview] = useState(false)
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [correctionPlate, setCorrectionPlate] = useState("")
  const [focusMode, setFocusMode] = useState(false)
  const [trainingMode, setTrainingMode] = useState(false)
  const [trainingSetupOpen, setTrainingSetupOpen] = useState(false)
  const [trainingIntensity, setTrainingIntensity] = useState<TrainingIntensity>("intense")
  const [trainingDuration, setTrainingDuration] = useState(120)
  const [trainingVoice, setTrainingVoice] = useState(true)
  const [trainingVoiceUnavailable, setTrainingVoiceUnavailable] = useState(false)
  const [availableVoiceCount, setAvailableVoiceCount] = useState(0)
  const [trainingCountdown, setTrainingCountdown] = useState<number | null>(null)
  const [trainingCalls, setTrainingCalls] = useState(0)
  const [lastBatchIds, setLastBatchIds] = useState<string[]>([])
  const { mutate: startTournament } = useStartTournament()
  const { mutate: finishTournament } = useFinishTournament()
  const { mutate: createAthleteLap } = useCreateAthleteLap()
  const { data: lastFiveLaps } = useLastFiveLaps()
  const { mutate: deleteAthleteLap } = useDeleteAthleteLap()
  const { mutate: createAthleteLapBatch, isPending: isSavingPeloton } = useCreateAthleteLapBatch()
  const { mutate: destroyAthleteLapBatch } = useDestroyAthleteLapBatch()
  const { mutate: correctAthleteLap, isPending: isCorrecting } = useCorrectAthleteLap()
  const { data: athletesData } = useFetchAthletes(1, 1000)
  const { mutate: createDisqualification } = useCreateDisqualification()
  const { mutate: deleteDisqualification } = useDeleteDisqualification()
  const { data: lastFiveDisqualifications } = useFetchLastFiveDisqualifications(tournamentId)
  const pendingStorageKey = tournamentId ? `swift-chrono:pending-arrivals:${tournamentId}` : ""
  const athletes = (athletesData?.athletes || []) as RuntimeAthlete[]
  const plateMaxLength = Math.max(1, ...athletes.map((item) => (item.plate || item.attributes?.plate || "").length))
  const athleteDetails = (value: string) => {
    const athlete = athletes.find((item) => (item.plate || item.attributes?.plate) === value)
    return athlete ? { name: athlete.name || athlete.attributes?.name || "Atleta", valid: true } : { name: "Placa não encontrada", valid: false }
  }
  const pelotonPlates = pelotonInput.trim().split(/[\s,;]+/).filter(Boolean)

  useEffect(() => {
    const updateVoiceCount = () => {
      const count = window.speechSynthesis?.getVoices().length || 0
      setAvailableVoiceCount(count)
      setTrainingVoiceUnavailable(count === 0)
    }
    updateVoiceCount()
    window.speechSynthesis?.addEventListener("voiceschanged", updateVoiceCount)
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", updateVoiceCount)
  }, [])

  const playFeedback = (kind: "complete" | "pending" | "undo" | "error") => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.frequency.value = { complete: 880, pending: 560, undo: 320, error: 180 }[kind]
    gain.gain.setValueAtTime(0.08, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.09)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1)
    oscillator.addEventListener("ended", () => audioContext.close())
  }

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }
  const registerPendingArrival = () => {
    if ((!isStarted && !trainingMode) || (isFinished && !trainingMode)) {
      setOperatorMessage("Inicie a competição antes de registrar chegadas")
      playFeedback("error")
      return
    }
    const arrival = { id: crypto.randomUUID(), recordedAt: new Date().toISOString(), elapsedMs: time }
    setPendingArrivals((current) => [...current, arrival])
    setOperatorMessage(`Chegada pendente marcada às ${formatTime(arrival.elapsedMs)}`)
    setOperatorStatus("normal")
    setLastBatchIds([])
    playFeedback("pending")
    requestAnimationFrame(() => plateInputRef.current?.focus())
  }

  const handleCreateAthleteLap = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedPlate = plate.trim()
    if (!normalizedPlate) return
    const pendingArrival = pendingArrivals[0]
    if (pendingArrival) setPendingArrivals((current) => current.filter((item) => item.id !== pendingArrival.id))
    setPlate("")
    if (trainingMode) {
      const details = athleteDetails(normalizedPlate)
      setLastConfirmation({ plate: normalizedPlate, name: details.valid ? details.name : "Registro de treino", time: formatTime(pendingArrival?.elapsedMs ?? time) })
      setOperatorMessage(`Treino: placa ${normalizedPlate} registrada sem alterar a prova`)
      setOperatorStatus("success")
      playFeedback("complete")
      return
    }
    createAthleteLap(
      { plate: normalizedPlate, recordedAt: pendingArrival?.recordedAt, silent: true },
      {
        onSuccess: (response) => {
          const savedLap = response.data.lap
          setLastConfirmation({
            plate: normalizedPlate,
            name: savedLap?.attributes?.athlete?.attributes?.name || athleteDetails(normalizedPlate).name,
            time: savedLap?.attributes?.formatted_time || formatTime(pendingArrival?.elapsedMs ?? time),
          })
          setOperatorMessage(pendingArrival
            ? `Placa ${normalizedPlate} associada à chegada ${formatTime(pendingArrival.elapsedMs)}`
            : `Placa ${normalizedPlate} registrada agora`)
          setOperatorStatus("success")
          setLastBatchIds([])
          playFeedback("complete")
          plateInputRef.current?.focus()
        },
        onError: () => {
          if (pendingArrival) {
            setPendingArrivals((current) => [...current, pendingArrival]
              .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt)))
          }
          setPlate(normalizedPlate)
          setOperatorMessage(`Não foi possível registrar a placa ${normalizedPlate}`)
          setOperatorStatus("error")
          playFeedback("error")
          plateInputRef.current?.focus()
        },
      }
    )
  }

  const undoLastAction = () => {
    if (lastBatchIds.length > 0) {
      if (trainingMode) {
        setLastBatchIds([])
        setOperatorMessage("Último pelotão de treino desfeito")
        return
      }
      destroyAthleteLapBatch(lastBatchIds, {
        onSuccess: () => {
          setLastBatchIds([])
          setOperatorMessage("Último pelotão desfeito por completo")
          setOperatorStatus("normal")
          playFeedback("undo")
        },
      })
      return
    }
    if (pendingArrivals.length > 0) {
      const lastPending = pendingArrivals[pendingArrivals.length - 1]
      setPendingArrivals((current) => current.slice(0, -1))
      setOperatorMessage(`Chegada pendente de ${formatTime(lastPending.elapsedMs)} desfeita`)
      setOperatorStatus("normal")
      playFeedback("undo")
      requestAnimationFrame(() => plateInputRef.current?.focus())
      return
    }
    const latestLap = recentLaps[0]
    if (!latestLap) return
    deleteAthleteLap(latestLap.id, {
      onSuccess: () => {
        setOperatorMessage(`Último registro da placa ${latestLap.attributes.athlete.attributes.plate} desfeito`)
        setOperatorStatus("normal")
        playFeedback("undo")
        plateInputRef.current?.focus()
      },
    })
  }

  const openPeloton = () => {
    if (!pendingArrivals.length) {
      setOperatorMessage("Marque chegadas pendentes antes de abrir o modo pelotão")
      setOperatorStatus("error")
      return
    }
    setPelotonInput("")
    setPelotonReview(false)
    setPelotonOpen(true)
  }

  const reviewPeloton = () => {
    const hasInvalidPlate = pelotonPlates.some((item) => !athleteDetails(item).valid)
    const hasDuplicates = new Set(pelotonPlates).size !== pelotonPlates.length
    if (!pelotonPlates.length || pelotonPlates.length > pendingArrivals.length || hasInvalidPlate || hasDuplicates) return
    setPelotonReview(true)
  }

  const confirmPeloton = () => {
    const selectedArrivals = pendingArrivals.slice(0, pelotonPlates.length)
    if (trainingMode) {
      setPendingArrivals((current) => current.slice(pelotonPlates.length))
      setLastBatchIds(pelotonPlates.map((_, index) => `training-${index}`))
      setLastConfirmation({ plate: pelotonPlates.join(", "), name: `${pelotonPlates.length} atletas no treino`, time: formatTime(selectedArrivals[0].elapsedMs) })
      setOperatorMessage(`Treino: pelotão com ${pelotonPlates.length} atletas concluído`)
      setOperatorStatus("success")
      setPelotonOpen(false)
      return
    }
    createAthleteLapBatch(selectedArrivals.map((arrival, index) => ({ plate: pelotonPlates[index], recordedAt: arrival.recordedAt })), {
      onSuccess: (response) => {
        setPendingArrivals((current) => current.slice(pelotonPlates.length))
        setLastBatchIds(response.data.laps.map((lap: { id: string }) => lap.id))
        setLastConfirmation({ plate: pelotonPlates.join(", "), name: `${pelotonPlates.length} atletas no pelotão`, time: formatTime(selectedArrivals[0].elapsedMs) })
        setOperatorMessage(`Pelotão com ${pelotonPlates.length} atletas registrado`)
        setOperatorStatus("success")
        setPelotonOpen(false)
        playFeedback("complete")
      },
      onError: () => {
        setOperatorMessage("O pelotão não foi salvo. Corrija as placas e tente novamente")
        setOperatorStatus("error")
        playFeedback("error")
      },
    })
  }

  const openCorrection = () => {
    if (!recentLaps[0] && !lastConfirmation) return
    setCorrectionPlate("")
    setCorrectionOpen(true)
  }

  const confirmCorrection = () => {
    const normalized = correctionPlate.trim()
    if (!normalized || !athleteDetails(normalized).valid) return
    if (trainingMode) {
      setLastConfirmation((current) => current ? { ...current, plate: normalized, name: athleteDetails(normalized).name } : null)
      setCorrectionOpen(false)
      return
    }
    const latestLap = recentLaps[0]
    if (!latestLap) return
    correctAthleteLap({ id: latestLap.id, plate: normalized }, {
      onSuccess: () => {
        setLastConfirmation({ plate: normalized, name: athleteDetails(normalized).name, time: latestLap.attributes.formatted_time })
        setOperatorMessage(`Último registro corrigido para a placa ${normalized}`)
        setOperatorStatus("success")
        setCorrectionOpen(false)
      },
      onError: () => {
        setOperatorMessage("Não foi possível corrigir o último registro")
        setOperatorStatus("error")
      },
    })
  }

  const toggleFocusMode = async () => {
    if (!focusMode) {
      await focusContainerRef.current?.requestFullscreen?.()
      setFocusMode(true)
    } else {
      await document.exitFullscreen?.()
      setFocusMode(false)
    }
  }

  const generateTrainingGroup = (intensity: TrainingIntensity) => {
    const available = trainingRemainingPlatesRef.current
    if (!available.length) return []
    const pelotonChance = { light: 0.12, normal: 0.3, intense: 0.48 }[intensity]
    const maxGroupSize = { light: 3, normal: 5, intense: 8 }[intensity]
    const size = Math.min(
      available.length,
      Math.random() < pelotonChance ? Math.floor(Math.random() * maxGroupSize) + 2 : 1
    )
    const group = available.splice(0, size)
    return group
  }

  const getTrainingVoice = () => {
    const voices = window.speechSynthesis?.getVoices?.() || []
    return voices.find((voice) => /^pt-BR$/i.test(voice.lang))
      || voices.find((voice) => /^pt[-_]/i.test(voice.lang))
      || voices.find((voice) => /portugu[eê]s|brazil|brasil/i.test(`${voice.name} ${voice.lang}`))
      || voices[0]
  }

  const formatPlateForSpeech = (value: string) => {
    const digits: Record<string, string> = { "0": "zero", "1": "um", "2": "dois", "3": "três", "4": "quatro", "5": "cinco", "6": "seis", "7": "sete", "8": "oito", "9": "nove" }
    return value.split("").map((character) => digits[character] || character).join(" ... ")
  }

  const speakTrainingGroup = (group: string[], intensity: TrainingIntensity) => {
    if (!trainingVoice || trainingVoiceUnavailable || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return
    if (availableVoiceCount === 0) {
      setTrainingVoiceUnavailable(true)
      setTrainingVoice(false)
      setOperatorMessage("Nenhuma voz instalada; as chamadas continuam visíveis na tela")
      return
    }
    // Falar dígito a dígito evita que "218" vire "duzentos e dezoito".
    const utterance = new SpeechSynthesisUtterance(group.map(formatPlateForSpeech).join(" .... "))
    utterance.lang = "pt-BR"
    utterance.rate = { light: 0.95, normal: 1.05, intense: 1.15 }[intensity]
    utterance.pitch = 1
    utterance.volume = 1
    const voice = getTrainingVoice()
    if (voice) utterance.voice = voice
    utterance.onerror = (event) => {
      if (event.error === "canceled" || event.error === "interrupted") return
      setTrainingVoiceUnavailable(true)
      setTrainingVoice(false)
      setOperatorMessage("Voz indisponível neste navegador; as chamadas continuam visíveis na tela")
      setOperatorStatus("normal")
    }
    try {
      // Não deixar chamadas antigas acumularem e chegarem atrasadas ao operador.
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()
      window.speechSynthesis.speak(utterance)
    } catch {
      setTrainingVoiceUnavailable(true)
      setTrainingVoice(false)
      setOperatorMessage("Voz indisponível neste navegador; as chamadas continuam visíveis na tela")
    }
  }

  const scheduleNextTrainingCall = (intensity: TrainingIntensity) => {
    const ranges = { light: [3500, 6000], normal: [1800, 3500], intense: [600, 1600] } as const
    const [minimum, maximum] = ranges[intensity]
    const delay = minimum + Math.random() * (maximum - minimum)
    trainingArrivalTimeoutRef.current = window.setTimeout(() => {
      const group = generateTrainingGroup(intensity)
      if (!group.length) {
        finishTraining("Todas as placas inscritas já foram chamadas")
        return
      }
      setTrainingCalls((current) => current + group.length)
      trainingChannelRef.current?.postMessage({ type: "call", plates: group, id: crypto.randomUUID() })
      speakTrainingGroup(group, intensity)
      scheduleNextTrainingCall(intensity)
    }, delay)
  }

  const restoreCompetitionTimer = () => {
    if (tournament?.started_at && !tournament.finished_at) {
      const startedAt = new Date(tournament.started_at).getTime()
      setTime(Date.now() - startedAt)
      intervalRef.current = setInterval(() => setTime(Date.now() - startedAt), 10)
    }
  }

  const finishTraining = (message = "Modo treino encerrado") => {
    stopTimer()
    if (trainingArrivalTimeoutRef.current) window.clearTimeout(trainingArrivalTimeoutRef.current)
    if (trainingEndTimeoutRef.current) window.clearTimeout(trainingEndTimeoutRef.current)
    if (trainingCountdownIntervalRef.current) window.clearInterval(trainingCountdownIntervalRef.current)
    window.speechSynthesis?.cancel()
    trainingChannelRef.current?.postMessage({ type: "end" })
    trainingChannelRef.current?.close()
    trainingChannelRef.current = null
    if (trainingDisplayWindowRef.current && !trainingDisplayWindowRef.current.closed) trainingDisplayWindowRef.current.close()
    trainingDisplayWindowRef.current = null
    trainingRemainingPlatesRef.current = []
    setTrainingMode(false)
    setTrainingCountdown(null)
    setPendingArrivals(realPendingBackupRef.current)
    restoreCompetitionTimer()
    setOperatorMessage(message)
    setLastConfirmation(null)
    setOperatorStatus("normal")
  }

  const startTraining = () => {
    realPendingBackupRef.current = pendingArrivals
    setPendingArrivals([])
    setTrainingCalls(0)
    setLastConfirmation(null)
    setTrainingSetupOpen(false)
    setTrainingMode(true)
    setTrainingCountdown(3)
    stopTimer()
    setTime(0)
    window.speechSynthesis?.cancel()
    trainingRemainingPlatesRef.current = [...new Set(
      athletes
        .map((item) => item.plate || item.attributes?.plate)
        .filter((item): item is string => Boolean(item))
    )].sort(() => Math.random() - 0.5)
    trainingDisplayWindowRef.current = window.open(
      `${window.location.origin}/training-display`,
      "swift-chrono-training-display",
      "popup=yes,width=1280,height=720"
    )
    trainingChannelRef.current?.close()
    trainingChannelRef.current = new BroadcastChannel("swift-chrono-training")
    const trainingStartMessage = { type: "start", total: trainingRemainingPlatesRef.current.length }
    // A janela auxiliar pode ainda estar carregando quando o treino é iniciado.
    // Reenviar após o carregamento evita perder o primeiro estado do treino.
    trainingChannelRef.current.postMessage(trainingStartMessage)
    window.setTimeout(() => trainingChannelRef.current?.postMessage(trainingStartMessage), 800)
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
      setTrainingVoiceUnavailable(true)
      setTrainingVoice(false)
      setOperatorMessage("Voz indisponível neste navegador; a tela auxiliar continuará mostrando as placas")
    }
    if (availableVoiceCount > 0 && window.speechSynthesis && typeof SpeechSynthesisUtterance !== "undefined") {
      try {
        // Chrome can require the first speech request to happen during the click gesture.
        const warmup = new SpeechSynthesisUtterance("Treino iniciado")
        warmup.lang = "pt-BR"
        warmup.rate = 1
        warmup.pitch = 1
        const voice = getTrainingVoice()
        if (voice) warmup.voice = voice
        warmup.onerror = () => {
          setTrainingVoiceUnavailable(true)
          setTrainingVoice(false)
          setOperatorMessage("Voz indisponível neste navegador; as chamadas continuam visíveis na tela")
        }
        window.speechSynthesis.speak(warmup)
      } catch {
        setTrainingVoiceUnavailable(true)
        setTrainingVoice(false)
      }
    }
    let countdown = 3
    trainingCountdownIntervalRef.current = window.setInterval(() => {
      countdown -= 1
      setTrainingCountdown(countdown > 0 ? countdown : null)
      if (countdown === 0) {
        if (trainingCountdownIntervalRef.current) window.clearInterval(trainingCountdownIntervalRef.current)
        const trainingStartedAt = Date.now()
        intervalRef.current = setInterval(() => setTime(Date.now() - trainingStartedAt), 10)
        setOperatorMessage("Treino automático iniciado")
        scheduleNextTrainingCall(trainingIntensity)
        trainingEndTimeoutRef.current = window.setTimeout(finishTraining, trainingDuration * 1000)
      }
    }, 1000)
  }

  const handleCreateDisqualification = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!disqualificationPlate) return
    createDisqualification(disqualificationPlate)
    setDisqualificationPlate("")
  }

  useEffect(() => {
    if (!pendingStorageKey) return
    const saved = localStorage.getItem(pendingStorageKey)
    try { setPendingArrivals(saved ? JSON.parse(saved) : []) } catch { setPendingArrivals([]) }
    loadedPendingKeyRef.current = pendingStorageKey
  }, [pendingStorageKey])

  useEffect(() => {
    if (!pendingStorageKey || loadedPendingKeyRef.current !== pendingStorageKey || trainingMode) return
    localStorage.setItem(pendingStorageKey, JSON.stringify(pendingArrivals))
  }, [pendingArrivals, pendingStorageKey, trainingMode])

  shortcutHandlerRef.current = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isEditingAnotherField = target && target !== plateInputRef.current && (
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable
      )

      if (event.ctrlKey && event.key.toLowerCase() === "z") {
        if (isEditingAnotherField) return
        event.preventDefault()
        undoLastAction()
      } else if (event.key === "F2" && !isEditingAnotherField) {
        event.preventDefault()
        openCorrection()
      } else if (event.key === "F3" && !isEditingAnotherField) {
        event.preventDefault()
        openPeloton()
      } else if (
        event.code === "Space" &&
        !isEditingAnotherField &&
        !isModalOpen &&
        !pelotonOpen &&
        !correctionOpen &&
        !trainingSetupOpen &&
        plate.length === 0 &&
        (trainingMode || (isStarted && !isFinished))
      ) {
        event.preventDefault()
        registerPendingArrival()
      } else if (
        !isEditingAnotherField &&
        document.activeElement !== plateInputRef.current &&
        (trainingMode || (isStarted && !isFinished)) &&
        plate.length < plateMaxLength &&
        /^[a-zA-Z0-9-]$/.test(event.key)
      ) {
        event.preventDefault()
        plateInputRef.current?.focus()
        setPlate((current) => `${current}${event.key}`)
      }
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => shortcutHandlerRef.current(event)
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  useEffect(() => {
    if (!tournament?.started_at) return
    const startedAt = new Date(tournament.started_at)
    setIsStarted(true)
    if (tournament.finished_at) {
      setTime(new Date(tournament.finished_at).getTime() - startedAt.getTime())
      setIsFinished(true)
      stopTimer()
      return
    }
    setIsFinished(false)
    setTime(Date.now() - startedAt.getTime())
    stopTimer()
    intervalRef.current = setInterval(() => setTime(Date.now() - startedAt.getTime()), 10)
    plateInputRef.current?.focus()
    return stopTimer
  }, [tournament])

  useEffect(() => {
    const handleFullscreenChange = () => setFocusMode(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => () => {
    if (trainingArrivalTimeoutRef.current) window.clearTimeout(trainingArrivalTimeoutRef.current)
    if (trainingEndTimeoutRef.current) window.clearTimeout(trainingEndTimeoutRef.current)
    if (trainingCountdownIntervalRef.current) window.clearInterval(trainingCountdownIntervalRef.current)
    window.speechSynthesis?.cancel()
  }, [])

  const recentLaps = (lastFiveLaps?.laps?.data || []) as RecentLap[]
  const recentDisqualifications = (lastFiveDisqualifications?.disqualifications || []) as RecentDisqualification[]

  return (
    <div ref={focusContainerRef} className={focusMode ? "overflow-y-auto bg-background p-6" : "mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8"}>
      <div className={focusMode ? "mx-auto flex max-w-6xl flex-col gap-6" : "contents"}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => trainingMode ? finishTraining() : setTrainingSetupOpen(true)}>
          <Dumbbell className="mr-2 h-4 w-4" /> {trainingMode ? "Encerrar treino" : "Treino"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCompetitionConfigOpen(true)} disabled={trainingMode}>
          <Settings2 className="mr-2 h-4 w-4" /> Configurar prova
        </Button>
        <Button variant="outline" onClick={toggleFocusMode}><Maximize2 className="mr-2 h-4 w-4" /> {focusMode ? "Sair da tela cheia" : "Tela cheia"}</Button>
      </div>
      {trainingMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
          <strong>{trainingCountdown ? `Treino começa em ${trainingCountdown}` : "Treino automático ativo — nada será gravado"}</strong>
            <span className="text-sm">{trainingCalls} placas anunciadas · {trainingRemainingPlatesRef.current.length} restantes na tela auxiliar</span>
        </div>
      )}
      <Card className="border-2 border-primary shadow-sm">
        <CardContent className="flex flex-col items-center justify-between gap-5 p-6 md:flex-row">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Tempo da competição</p>
            <div className="font-mono text-4xl font-semibold tabular-nums text-primary md:text-5xl">{formatTime(time)}</div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)} disabled={!isStarted || isFinished} variant="destructive" size="lg">Finalizar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Card className="border shadow-sm">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-xl"><Bike className="h-5 w-5" /> Registrar chegada</CardTitle>
              <div className="text-right"><span className="block text-2xl font-semibold tabular-nums">{pendingArrivals.length}</span><span className="text-xs text-muted-foreground">pendentes</span></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <form onSubmit={handleCreateAthleteLap} className="space-y-3">
              <label htmlFor="arrival-plate" className="flex justify-between text-sm font-medium"><span>Placa do atleta</span><span className="font-normal text-muted-foreground">máximo de {plateMaxLength} caracteres</span></label>
              <Input ref={plateInputRef} id="arrival-plate" inputMode="numeric" autoComplete="off"
                maxLength={plateMaxLength}
                placeholder="Digite a placa e pressione Enter" className="h-16 border-2 text-center font-mono text-3xl font-semibold"
                onChange={(event) => setPlate(event.target.value.slice(0, plateMaxLength))} value={plate} disabled={(!isStarted || isFinished) && !trainingMode} />
              <Button type="submit" size="lg" className="h-12 w-full" disabled={!plate.trim() || ((!isStarted || isFinished) && !trainingMode)}>Registrar placa</Button>
            </form>

            <button type="button" onClick={registerPendingArrival} disabled={(!isStarted || isFinished) && !trainingMode}
              className="flex min-h-20 w-full items-center justify-center gap-3 rounded-md border-2 border-dashed border-amber-500 bg-amber-50 px-4 text-lg font-semibold text-amber-950 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-950/30 dark:text-amber-100 dark:hover:bg-amber-950/50">
              <Clock3 className="h-6 w-6" /> Marcar sem placa <kbd className="rounded border bg-background px-2 py-1 font-mono text-sm">Espaço</kbd>
            </button>
            <Button type="button" variant="outline" className="h-12 w-full" onClick={openPeloton} disabled={!pendingArrivals.length}>
              Resolver pelotão <span className="ml-2 text-xs text-muted-foreground">F3</span>
            </Button>
            <div aria-live="polite" className={`min-h-10 rounded-md border px-3 py-2 text-sm font-medium ${operatorStatus === "error" ? "border-destructive bg-destructive/10 text-destructive" : operatorStatus === "success" ? "border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100" : "bg-muted/40"}`}>{operatorMessage}</div>
            <div className="flex items-center justify-between gap-4 border-t pt-4">
              <p className="text-sm text-muted-foreground">A placa resolve a pendência mais antiga.</p>
              <Button type="button" variant="outline" size="sm" onClick={undoLastAction}><Undo2 className="mr-2 h-4 w-4" /> Desfazer <span className="ml-2 text-xs text-muted-foreground">Ctrl+Z</span></Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {lastConfirmation && (
            <Card className="border-2 border-emerald-600 bg-emerald-50 shadow-sm dark:bg-emerald-950/30">
              <CardContent className="flex items-center gap-4 p-5">
                <CheckCircle2 className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">Registrado</p><p className="truncate text-2xl font-semibold"><span className="font-mono">{lastConfirmation.plate}</span> — {lastConfirmation.name}</p><p className="font-mono text-sm">{lastConfirmation.time}</p></div>
                <Button variant="outline" size="sm" onClick={openCorrection}>Corrigir <span className="ml-2 text-xs">F2</span></Button>
              </CardContent>
            </Card>
          )}
          <Card className="border shadow-sm">
            <CardHeader className="border-b py-4"><CardTitle className="text-base">Chegadas pendentes</CardTitle></CardHeader>
            <CardContent className="p-0">
              {pendingArrivals.length > 0 ? <ol className="divide-y">{pendingArrivals.slice(0, 8).map((arrival, index) => (
                <li key={arrival.id} className="flex items-center justify-between px-4 py-3"><span className="text-sm text-muted-foreground">#{index + 1}</span><time className="font-mono font-semibold tabular-nums">{formatTime(arrival.elapsedMs)}</time></li>
              ))}</ol> : <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma chegada pendente</p>}
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardHeader className="border-b py-4"><CardTitle className="text-base">Últimos registros</CardTitle></CardHeader>
            <CardContent className="p-0">
              {recentLaps.length ? <ul className="divide-y">{recentLaps.map((lap) => (
                <li key={lap.id} className="flex items-center justify-between gap-3 px-4 py-3"><div className="min-w-0"><span className="mr-2 font-mono font-semibold">{lap.attributes.athlete.attributes.plate}</span><span className="truncate text-sm text-muted-foreground">{lap.attributes.athlete.attributes.name}</span></div><span className="font-mono text-sm tabular-nums">{lap.attributes.formatted_time}</span></li>
              ))}</ul> : <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma volta registrada</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      {!focusMode && <Card className="border shadow-sm">
        <CardHeader className="border-b py-4"><CardTitle className="flex items-center gap-2 text-base text-destructive"><Ban className="h-4 w-4" /> Desclassificações</CardTitle></CardHeader>
        <CardContent className="grid gap-5 p-5 md:grid-cols-2">
          <form onSubmit={handleCreateDisqualification} className="flex gap-3"><Input placeholder="Placa do atleta" value={disqualificationPlate} onChange={(event) => setDisqualificationPlate(event.target.value)} /><Button type="submit" variant="destructive">Desclassificar</Button></form>
          <div className="space-y-2">
            {recentDisqualifications.map((item) => <div key={item.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"><span><strong className="font-mono">{item.plate}</strong> · {item.name}</span><Button variant="ghost" size="sm" onClick={() => deleteDisqualification(item.id)}>Reverter</Button></div>)}
            {!recentDisqualifications.length && <p className="text-sm text-muted-foreground">Nenhum atleta desclassificado.</p>}
          </div>
        </CardContent>
      </Card>}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}><DialogContent><DialogHeader><DialogTitle>Finalizar prova</DialogTitle><DialogDescription>Esta ação irá parar o cronômetro. Existem {pendingArrivals.length} chegadas pendentes. Digite “FINALIZAR” para confirmar.</DialogDescription></DialogHeader><Input placeholder='Digite "FINALIZAR"' value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} className="text-center text-lg" /><DialogFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button variant="destructive" onClick={() => { stopTimer(); finishTournament(); setIsModalOpen(false); setConfirmationText("") }} disabled={confirmationText !== "FINALIZAR"}>Finalizar prova</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={competitionConfigOpen} onOpenChange={setCompetitionConfigOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configurar prova</DialogTitle><DialogDescription>Confira a prova selecionada antes de liberar o registro de chegadas.</DialogDescription></DialogHeader>
          <div className="rounded-md border bg-muted/30 p-4 text-sm"><p className="font-medium">{currentTournament?.name || "Prova selecionada"}</p><p className="mt-1 text-muted-foreground">O cronômetro ainda não foi iniciado.</p></div>
          <DialogFooter><Button variant="outline" onClick={() => setCompetitionConfigOpen(false)}>Cancelar</Button><Button onClick={() => { startTournament(); setCompetitionConfigOpen(false) }} disabled={isStarted || isFinished}>Iniciar prova</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={pelotonOpen} onOpenChange={setPelotonOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Resolver pelotão</DialogTitle><DialogDescription>Digite as placas na ordem anunciada, separadas por espaço. Esc cancela.</DialogDescription></DialogHeader>
          <Input autoFocus value={pelotonInput} onChange={(event) => { setPelotonInput(event.target.value); setPelotonReview(false) }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); if (pelotonReview) confirmPeloton(); else reviewPeloton() } }} placeholder="123 284 91 45" className="h-14 font-mono text-xl" />
          <div className="max-h-72 overflow-y-auto border">
            {pelotonPlates.map((item, index) => {
              const details = athleteDetails(item)
              const arrival = pendingArrivals[index]
              return <div key={`${item}-${index}`} className={`grid grid-cols-[50px_140px_1fr] gap-3 border-b px-3 py-2 text-sm last:border-0 ${details.valid ? "" : "bg-destructive/10 text-destructive"}`}><span>#{index + 1}</span><span className="font-mono">{arrival ? formatTime(arrival.elapsedMs) : "Sem chegada"}</span><span><strong className="font-mono">{item}</strong> — {details.name}</span></div>
            })}
            {!pelotonPlates.length && <p className="p-4 text-sm text-muted-foreground">{pendingArrivals.length} chegadas aguardando placas.</p>}
          </div>
          {pelotonPlates.length > pendingArrivals.length && <p className="text-sm font-medium text-destructive">Existem mais placas do que chegadas pendentes.</p>}
          {new Set(pelotonPlates).size !== pelotonPlates.length && <p className="text-sm font-medium text-destructive">Existem placas repetidas no pelotão.</p>}
          <DialogFooter><Button variant="outline" onClick={() => setPelotonOpen(false)}>Cancelar</Button><Button onClick={pelotonReview ? confirmPeloton : reviewPeloton} disabled={!pelotonPlates.length || isSavingPeloton}>{isSavingPeloton ? "Salvando..." : pelotonReview ? "Confirmar pelotão" : "Revisar associação"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={correctionOpen} onOpenChange={setCorrectionOpen}>
        <DialogContent><DialogHeader><DialogTitle>Corrigir último registro</DialogTitle><DialogDescription>O horário será preservado; somente a placa do atleta será trocada.</DialogDescription></DialogHeader><Input autoFocus value={correctionPlate} onChange={(event) => setCorrectionPlate(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") confirmCorrection() }} placeholder="Placa correta" className="h-14 font-mono text-xl" />{correctionPlate && !athleteDetails(correctionPlate).valid && <p className="text-sm text-destructive">Placa não encontrada.</p>}<DialogFooter><Button variant="outline" onClick={() => setCorrectionOpen(false)}>Cancelar</Button><Button onClick={confirmCorrection} disabled={!athleteDetails(correctionPlate).valid || isCorrecting}>{isCorrecting ? "Corrigindo..." : "Corrigir"}</Button></DialogFooter></DialogContent>
      </Dialog>
      <Dialog open={trainingSetupOpen} onOpenChange={setTrainingSetupOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configurar treino automático</DialogTitle><DialogDescription>O treino usa as placas desta competição e não grava nenhum resultado real.</DialogDescription></DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2"><label htmlFor="training-intensity" className="text-sm font-medium">Ritmo</label><select id="training-intensity" value={trainingIntensity} onChange={(event) => setTrainingIntensity(event.target.value as TrainingIntensity)} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="light">Leve — 4 a 6 segundos</option><option value="normal">Normal — 2 a 4 segundos</option><option value="intense">Intenso — menos de 2 segundos</option></select></div>
            <div className="space-y-2"><label htmlFor="training-duration" className="text-sm font-medium">Duração</label><select id="training-duration" value={trainingDuration} onChange={(event) => setTrainingDuration(Number(event.target.value))} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value={60}>1 minuto</option><option value={120}>2 minutos</option><option value={300}>5 minutos</option></select></div>
            <div className="rounded-md border border-amber-500/50 bg-amber-50 px-3 py-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"><strong className="block">Tela auxiliar</strong><span>Uma segunda janela mostra os pelotões; esta tela fica livre para você digitar as placas anunciadas.</span></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setTrainingSetupOpen(false)}>Cancelar</Button><Button onClick={startTraining} disabled={!athletes.length}>Iniciar após contagem</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

declare global {
  interface Window { webkitAudioContext?: typeof AudioContext }
}
