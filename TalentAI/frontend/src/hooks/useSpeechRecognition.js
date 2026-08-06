import { useEffect, useRef, useState } from 'react';

/**
 * Wraps the browser's SpeechRecognition API (Chrome/Edge) for continuous,
 * interim-enabled dictation. Falls back gracefully — callers should check
 * `isSupported` and offer a manual text input when it's false.
 *
 * @param {(finalText: string) => void} onResult - called with newly finalized
 *   speech segments as they arrive. Always reflects the latest render, so it's
 *   safe to close over state like the current question index.
 */
export function useSpeechRecognition(onResult) {
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          finalText += `${event.results[i][0].transcript} `;
        }
      }
      if (finalText) onResultRef.current(finalText);
    };

    // Swallow recognition errors (e.g. brief silence) rather than crashing the session
    recognition.onerror = () => {};

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  const start = () => {
    try {
      recognitionRef.current?.start();
    } catch {
      // Already started — ignore
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
  };

  return { isSupported, start, stop };
}
