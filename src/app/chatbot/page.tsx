'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextPage } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';

const ChatBotPage: NextPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [buffer, setBuffer] = useState('');
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const recordController = useRef(new AbortController());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('webkitSpeechRecognition' in window) {
        try {
          const recognitionInstance = new (window as any).webkitSpeechRecognition();
          recognitionInstance.continuous = true;
          recognitionInstance.lang = 'es-ES';
          setRecognition(recognitionInstance);
          setSynth(window.speechSynthesis);
          setIsBrowserCompatible(true);
        } catch (error) {
          console.error('Error al inicializar el reconocimiento de voz:', error);
          setIsBrowserCompatible(false);
        }
      } else {
        setIsBrowserCompatible(false);
      }
    }
  }, []);

  const handleResult = useCallback((e: SpeechRecognitionEvent) => {
    const transcript = Array.from(e.results)
      .map(result => result[0].transcript)
      .join('');
    setBuffer(transcript);
    console.log("🚀 ~ handleResult ~ transcript:", transcript);
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.onresult = handleResult;
    }
  }, [recognition, handleResult]);

  const handleStartRecording = useCallback(() => {
    if (recognition) {
      recognition.start();
      synth?.cancel();
      setIsRecording(true);
      console.log('Grabación iniciada');
    }
  }, [recognition, synth]);

  const handleStopRecording = useCallback(async () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      console.log("🚀 ~ handleStopRecording ~ buffer:", buffer);

      const genAI = new GoogleGenerativeAI('AIzaSyA-pn12v5iWHQG_3j2ht7BX4nHV6Ez1who');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [
              {
                text: `
                Eres un asistente virtual amigable y servicial. Tu tarea es ayudar al usuario con sus preguntas y solicitudes de manera clara y concisa. 
                * Quiero que la respuesta sea lo más natural posible, pero también quiero que sea precisa y relevante.
                * Que la respuesta sea siempre en español
                * Si no entiendes la pregunta, puedes pedirle al usuario que la reformule.
                * Si no puedes responder a la pregunta, puedes decirle al usuario que no tienes la respuesta.
              `
              }
            ]
          }
        ]
      });

      try {
        let responseText = await chat.sendMessage(buffer);
        const response = responseText.response.text();

        if (synth) {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.lang = 'es-ES';
          synth.speak(utterance);
        }
      } catch (error) {
        console.error('Error al generar contenido:', error);
      }

      setBuffer('');
    }
  }, [recognition, buffer, synth]);

  const handleStopTalking = useCallback(() => {
    synth?.cancel();
  }, [synth]);

  return (
    <main
      className="flex flex-1 justify-center items-center"
      style={{ minHeight: 'calc(100vh - 7rem)' }}>
      {isBrowserCompatible ? (
        <section className="grid place-content-center py-8 gap-9">
          <h2 className="text-center text-2xl">
            {isRecording ? 'Pulsa para parar' : 'Pulsa para grabarte'}
          </h2>
          {recognition && (
            <button
              className={`
              relative h-64 w-64 rounded-full border-4 border-neutral-900 bg-red-500
              ${isRecording ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}
              transition-all duration-600 ease-in-out
              hover:bg-red-600  
            `}
              onClick={isRecording ? handleStopRecording : handleStartRecording}>
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-[spin_2s_linear_infinite]"></div>
              )}
            </button>
          )}
          {synth && (
            <button onClick={handleStopTalking} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Haz que se calle
            </button>
          )}
        </section>
      ) : (
        <section className="grid place-content-center py-8">
          <h3 className="text-3xl text-center">En este navegador no se puede usar :((</h3>
        </section>
      )}
    </main>
  );
};

export default ChatBotPage;
