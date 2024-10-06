'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

let recognition: null | SpeechRecognition = null;
let synth: null | SpeechSynthesis = null;

const ChatBotPage: NextPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [buffer, setBuffer] = useState('');
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(false);
  const recordController = useRef(new AbortController());

  useEffect(() => {
    if (window) {
      const isBrowserCompatible = 'webkitSpeechRecognition' in window;
      setIsBrowserCompatible(isBrowserCompatible);

      if (isBrowserCompatible) {
        recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'es-ES';

        synth = window.speechSynthesis;
      }
    }
  }, []);


  const handleStartRecording = () => {
    synth?.cancel();

    setIsRecording(true);
    recognition?.start();

    // El signal es para eliminar el addEventListener cuando la grabación ha terminado para
    // evitar que se creen demasiandos addEventListener y se vayan eliminando cuando no se necesita
    recognition?.addEventListener(
      'result',
      (e: any) => {
        const buffer = Array.from(e.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setBuffer(buffer);

        console.log(e.results, buffer);
      },
      {
        signal: recordController.current.signal
      }
    );
  };

  const handleStopRecording = async () => {
    console.log(buffer)
    
    setIsRecording(false);
    const genAI = new GoogleGenerativeAI('AIzaSyA-pn12v5iWHQG_3j2ht7BX4nHV6Ez1who');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    recognition?.stop();
    recordController.current.abort();

    // Usar el buffer en lugar de un prompt fijo
    const userMessage = buffer || 'donde puedo encotnrar urracas en españa';

    // Actualizar el chatHistory con el mensaje del usuario
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
      let responseText = await chat.sendMessage(userMessage);
      responseText.response.text();
      console.log("🚀 ~ handleStopRecording ~ responseText.response.text();:", responseText.response.text())
      // Sintetizar la respuesta en voz
      const utterance = new SpeechSynthesisUtterance(responseText.response.text());
      utterance.lang = 'es-ES';
      synth?.speak(utterance);
    } catch (error) {
      console.error('Error al generar contenido:', error);
    }

    // Limpiar el buffer después de usarlo
    setBuffer('');
  };

  const handleStopTalking = () => {
    synth?.cancel();
  };

  return (
    <main
      className="flex flex-1 justify-center items-center"
      style={{ minHeight: 'calc(100vh - 7rem)' }}>
      {isBrowserCompatible ? (
        <section className="grid place-content-center py-8 gap-9">
          <h2 className="text-center text-2xl">
            {isRecording ? 'Pulsa para parar' : 'Pulsa para grabarte'}
          </h2>
          <button
            className={`
            relative h-64 w-64 rounded-full border-4 border-neutral-900 bg-red-500
            ${isRecording ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}
            transition-all duration-600 ease-in-out
            hover:bg-red-600  
          `}
            onClick={async () => {
              if (isRecording) {
                await handleStopRecording();
              } else {
                await handleStartRecording();
              }
            }}>
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-[spin_2s_linear_infinite]"></div>
            )}
          </button>
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
