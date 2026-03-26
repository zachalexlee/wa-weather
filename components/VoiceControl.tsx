'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VoiceControlProps {
  onVoiceCommand: (command: string) => void;
}

export default function VoiceControl({ onVoiceCommand }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(true);
      
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const processCommand = (command: string) => {
    const lower = command.toLowerCase();
    
    if (lower.includes('rain')) {
      onVoiceCommand('Will it rain today?');
    } else if (lower.includes('temperature') || lower.includes('temp')) {
      onVoiceCommand('What is the temperature?');
    } else if (lower.includes('tomorrow')) {
      onVoiceCommand('What is the weather tomorrow?');
    } else if (lower.includes('week')) {
      onVoiceCommand('What is the weather this week?');
    } else if (lower.includes('wind')) {
      onVoiceCommand('How windy is it?');
    } else {
      onVoiceCommand(command);
    }
  };

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
          <h2 className="text-2xl font-bold mb-2">🎤 Voice Control</h2>
          <p className="text-sm text-white/70">
            Voice control is not supported in your browser. Try Chrome, Edge, or Safari.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
        <h2 className="text-3xl font-bold mb-2">🎤 Voice Control</h2>
        <p className="text-sm text-white/70 mb-6">Ask me about the weather using your voice</p>

        <div className="flex flex-col items-center gap-6">
          {/* Microphone Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-32 h-32 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            <span className="text-6xl">{isListening ? '⏹️' : '🎤'}</span>
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
            )}
          </button>

          {/* Status */}
          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              {isListening ? 'Listening...' : 'Click to speak'}
            </div>
            {transcript && (
              <div className="bg-white/10 rounded-lg p-4 max-w-md">
                <div className="text-sm text-white/70 mb-1">You said:</div>
                <div className="text-lg">&quot;{transcript}&quot;</div>
              </div>
            )}
          </div>

          {/* Example Commands */}
          <div className="w-full bg-black/20 rounded-xl p-4">
            <h3 className="font-semibold mb-3">💡 Try saying:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="bg-white/5 rounded-lg p-2">&quot;Will it rain today?&quot;</div>
              <div className="bg-white/5 rounded-lg p-2">&quot;What&apos;s the temperature?&quot;</div>
              <div className="bg-white/5 rounded-lg p-2">&quot;Weather tomorrow&quot;</div>
              <div className="bg-white/5 rounded-lg p-2">&quot;How windy is it?&quot;</div>
              <div className="bg-white/5 rounded-lg p-2">&quot;Show me this week&quot;</div>
              <div className="bg-white/5 rounded-lg p-2">&quot;Temperature forecast&quot;</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
