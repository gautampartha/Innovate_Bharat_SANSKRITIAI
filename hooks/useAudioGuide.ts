"use client";

import { useCallback, useState } from "react";

export function useAudioGuide() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("");
  const [lang, setLang] = useState("en-IN");
  const [isMuted, setIsMuted] = useState(false);

  const speak = useCallback((text: string, langOverride?: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langOverride || lang;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback(() => {
    setIsListening(true);
    // Mock implementation as actual STT usually requires more setup
    console.log("[AudioGuide] Started listening...");
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    console.log("[AudioGuide] Stopped listening.");
  }, []);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  return {
    isSpeaking,
    speak,
    stopSpeaking,
    stop: stopSpeaking, // Alias
    isListening,
    startListening,
    stopListening,
    isThinking,
    lastAnswer,
    lang,
    setLang,
    isMuted,
    toggleMute
  };
}
