'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextPage } from 'next';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatIAPage: NextPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [buffer, setBuffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistoryState, setChatHistoryState] = useState<
    {
      role: 'user' | 'model';
      parts: { text: string }[];
    }[]
  >([
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
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!buffer.trim()) return;
    scrollToBottom();
    const userMessage = buffer;

    setBuffer('');

    setChatHistoryState((prev) => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);

    if (inputRef.current) inputRef.current.value = '';

    setLoading(true);

    const genAI = new GoogleGenerativeAI('AIzaSyA-pn12v5iWHQG_3j2ht7BX4nHV6Ez1who');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const chatHistory: {
      role: 'user' | 'model';
      parts: { text: string }[];
    }[] = [...chatHistoryState];

    // Usar el buffer en lugar de un prompt fijo

    // Actualizar el chatHistory con el mensaje del usuario
    const chat = model.startChat({
      history: chatHistory
    });

    try {
      let responseText = await chat.sendMessage(userMessage);
      responseText.response.text();

      setChatHistoryState((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: responseText.response.text() }] }
      ]);
      // Sintetizar la respuesta en voz
    } catch (error) {
      console.error('Error al generar contenido:', error);
      setChatHistoryState((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [{ text: 'Lo siento, ha ocurrido un error al procesar tu solicitud.' }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  console.log(buffer);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="flex flex-1 justify-center items-center">
      <section className="grid pt-6 gap-9 min-w-full">
        {chatHistoryState.slice(1).map((chat, index) => (
          <div
            key={index}
            className={`flex gap-2 ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {chat.parts.map((part, index) => (
              <div
                className={`p-4 rounded-xl min-w-[80%] ${chat.role === 'user' ? 'bg-slate-500' : 'bg-slate-800'}`}>
                <ReactMarkdown className="text-white">{part.text}</ReactMarkdown>
              </div>
            ))}
          </div>
        ))}
        {loading && (
          <div className={`flex gap-2 justify-start`}>
            <div className={`p-4 rounded-xl  bg-slate-800`}>
              <div className="flex items-center justify-start space-x-2 h-6">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div className='py-6' ref={messagesEndRef} />
        <div
          className={`flex gap-3 fixed mx-7 px-4 rounded-xl bottom-20 left-0 right-0 z-50 transition-all duration-300 bg-gray-600 bg-opacity-45 backdrop-filter backdrop-blur-sm py-4`}>
          <Input
            type="text"
            ref={inputRef}
            placeholder="Haz una pregunta"
            onChange={(e) => {
              setBuffer(e.target.value);
            }}
            onKeyDown={handleKeyPress}
          />
          <Button
            variant="outline"
            value={buffer}
            onClick={handleSendMessage}
            className="text-gray-900 font-semibold transition-all duration-400 hover:bg-slate-300 hover:scale-105">
            Enviar
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ChatIAPage;
