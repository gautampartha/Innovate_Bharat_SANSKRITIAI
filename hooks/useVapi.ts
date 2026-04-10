"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) return;

    try {
      vapiRef.current = new Vapi(publicKey);
      
      vapiRef.current.on("call-start", () => {
        setIsCallActive(true);
        setIsLoading(false);
      });

      vapiRef.current.on("call-end", () => {
        setIsCallActive(false);
        setIsLoading(false);
      });

      vapiRef.current.on("speech-start", () => setIsSpeaking(true));
      vapiRef.current.on("speech-end", () => setIsSpeaking(false));

      vapiRef.current.on("message", (message: any) => {
        if (message.type === "transcript" && message.transcriptType === "partial") {
          setTranscript(message.transcript);
        }
        setMessages(prev => [...prev, message]);
      });

      vapiRef.current.on("error", (err: any) => {
        setError(err.message || String(err));
        setIsLoading(false);
      });

    } catch (err) {
      console.warn("[Vapi] Failed to initialize SDK", err);
      vapiRef.current = null;
    }

    return () => {
      void vapiRef.current?.stop().catch(() => {});
      vapiRef.current = null;
    };
  }, []);

  const startCall = useCallback(async (manualId?: string, monumentId?: string) => {
    const assistantId = manualId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId || !vapiRef.current) return;

    setIsLoading(true);
    setError(null);
    try {
      await vapiRef.current.start(assistantId);
    } catch (err: any) {
      setError(err.message || String(err));
      setIsLoading(false);
    }
  }, []);

  const endCall = useCallback(async () => {
    if (!vapiRef.current) return;
    try {
      await vapiRef.current.stop();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  }, []);

  return {
    isCallActive,
    isListening,
    isSpeaking,
    isLoading,
    transcript,
    messages,
    error,
    startCall,
    endCall,
    stopCall: endCall // Alias for compatibility
  };
}
