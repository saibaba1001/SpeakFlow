import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, RefreshCw, CheckCircle, XCircle, Languages, Heart, BookOpen, Settings2 } from 'lucide-react';

// Types for Speech Recognition
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

interface Phrase {
  text: string;
  translation: string;
  romanized: string;
  category: string;
}

const categories = [
  "Greetings",
  "Daily Life",
  "Food & Dining",
  "Family",
  "Travel",
  "Business"
];

const phrases: Phrase[] = [
  // Greetings
  { 
    text: "Hello, how are you?",
    translation: "नमस्ते, आप कैसे हैं?",
    romanized: "Namaste, aap kaise hain?",
    category: "Greetings"
  },
  { 
    text: "Good morning",
    translation: "सुप्रभात",
    romanized: "Suprabhat",
    category: "Greetings"
  },
  // Daily Life
  { 
    text: "What is your name?",
    translation: "आपका नाम क्या है?",
    romanized: "Aapka naam kya hai?",
    category: "Daily Life"
  },
  { 
    text: "I am from India",
    translation: "मैं भारत से हूं",
    romanized: "Main Bharat se hoon",
    category: "Daily Life"
  },
  // Food & Dining
  { 
    text: "The food is delicious",
    translation: "खाना बहुत स्वादिष्ट है",
    romanized: "Khana bahut swadisht hai",
    category: "Food & Dining"
  },
  { 
    text: "I would like some tea",
    translation: "मैं चाय पीना चाहूंगा",
    romanized: "Main chai peena chahunga",
    category: "Food & Dining"
  },
  // Family
  { 
    text: "This is my family",
    translation: "यह मेरा परिवार है",
    romanized: "Yeh mera parivar hai",
    category: "Family"
  },
  // Travel
  { 
    text: "Where is the railway station?",
    translation: "रेलवे स्टेशन कहां है?",
    romanized: "Railway station kahan hai?",
    category: "Travel"
  },
  // Business
  { 
    text: "Nice to meet you",
    translation: "आपसे मिलकर अच्छा लगा",
    romanized: "Aapse milkar achcha laga",
    category: "Business"
  }
];

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Greetings");
  const [showRomanized, setShowRomanized] = useState(true);
  const [streak, setStreak] = useState(0);
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const filteredPhrases = phrases.filter(phrase => phrase.category === selectedCategory);

  useEffect(() => {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript.toLowerCase());
      checkAnswer(transcript.toLowerCase());
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.abort();
    };
  }, [currentPhraseIndex]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setFeedback(null);
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const checkAnswer = (spokenText: string) => {
    const currentPhrase = filteredPhrases[currentPhraseIndex].text.toLowerCase();
    const isCorrect = spokenText.includes(currentPhrase) || currentPhrase.includes(spokenText);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const speak = (text: string, isEnglish: boolean = true) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isEnglish ? 'en-US' : 'hi-IN';
    window.speechSynthesis.speak(utterance);
  };

  const nextPhrase = () => {
    setCurrentPhraseIndex((prev) => (prev + 1) % filteredPhrases.length);
    setTranscript('');
    setFeedback(null);
  };

  return (
    <div 
      className="min-h-screen bg-[#FFF5E4] relative overflow-hidden"
      style={{
        backgroundImage: `
          url('https://images.unsplash.com/photo-1558522195-e1201b090344?auto=format&fit=crop&w=2000&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light'
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-rose-500/10 backdrop-blur-sm"></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-3xl w-full space-y-8 border border-orange-100">
          <div className="text-center relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <Languages className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mt-8 mb-2">
              Learn Hindi
            </h1>
            <p className="text-gray-600 text-lg">Master pronunciation with native speech recognition</p>
            
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-rose-100 px-4 py-2 rounded-full">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-lg font-semibold text-gray-700">Streak: {streak}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPhraseIndex(0);
                  setTranscript('');
                  setFeedback(null);
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-8 shadow-lg space-y-6 border border-orange-100">
            <div className="text-center space-y-4">
              <p className="text-2xl font-medium text-gray-700">{filteredPhrases[currentPhraseIndex].text}</p>
              <p className="text-3xl font-medium text-orange-600">{filteredPhrases[currentPhraseIndex].translation}</p>
              {showRomanized && (
                <p className="text-lg text-gray-500 italic">{filteredPhrases[currentPhraseIndex].romanized}</p>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => speak(filteredPhrases[currentPhraseIndex].text)}
                className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transition-transform hover:scale-105"
                title="Listen to English pronunciation"
              >
                <Volume2 className="w-6 h-6" />
              </button>
              
              <button
                onClick={toggleListening}
                className={`p-4 rounded-full shadow-lg transition-transform hover:scale-105 ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                }`}
                title={isListening ? 'Stop recording' : 'Start recording'}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={nextPhrase}
                className="p-4 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg transition-transform hover:scale-105"
                title="Next phrase"
              >
                <RefreshCw className="w-6 h-6" />
              </button>

              <button
                onClick={() => setShowRomanized(!showRomanized)}
                className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-transform hover:scale-105"
                title="Toggle romanization"
              >
                <BookOpen className="w-6 h-6" />
              </button>
            </div>
          </div>

          {transcript && (
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg border border-orange-100">
              <p className="text-lg font-medium">Your pronunciation:</p>
              <p className="text-gray-600 text-lg">{transcript}</p>
              {feedback && (
                <div className="mt-4 flex justify-center items-center gap-2">
                  {feedback === 'correct' ? (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-medium">शाबाश! (Excellent!)</span>
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full flex items-center gap-2">
                      <XCircle className="w-6 h-6" />
                      <span className="font-medium">फिर से कोशिश करें (Try again)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;