// Voice Assistant UI Component
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Settings, 
  MessageCircle, Navigation, Play, Pause 
} from 'lucide-react';
import { voiceAssistant } from '../services/voiceAssistant';
import { useLocalizationStore } from '../store';
import { translations } from '../translations';

function VoiceAssistant({ onVoiceQuery, onNavigate }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { currentLanguage } = useLocalizationStore();
  
  // Voice settings state
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    autoSpeak: true
  });

  const transcriptRef = useRef('');

  // Translation function
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  useEffect(() => {
    // Check support and request permissions on mount
    const checkSupport = async () => {
      setIsSupported(voiceAssistant.isSupported.full);
      
      if (voiceAssistant.isSupported.full) {
        const hasPermission = await voiceAssistant.requestMicrophonePermission();
        setPermissionGranted(hasPermission);
      }
    };

    checkSupport();
    
    // Update voice assistant language when app language changes
    voiceAssistant.setLanguage(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    // Update voice settings
    voiceAssistant.updateSettings(voiceSettings);
  }, [voiceSettings]);

  // Start voice recognition
  const startListening = () => {
    if (!permissionGranted) {
      alert(t('voice.permission.required', 'Microphone permission is required for voice input'));
      return;
    }

    setTranscript('');
    transcriptRef.current = '';
    
    voiceAssistant.startListening(
      ({ transcript, isFinal }) => {
        setTranscript(transcript);
        transcriptRef.current = transcript;
        
        if (isFinal) {
          handleVoiceInput(transcript);
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
        
        // User-friendly error messages
        let errorMessage = t('voice.error.general', 'Voice recognition error occurred');
        if (error === 'not-allowed') {
          errorMessage = t('voice.error.permission', 'Please allow microphone access');
        } else if (error === 'no-speech') {
          errorMessage = t('voice.error.no.speech', 'No speech detected. Please try again.');
        }
        
        alert(errorMessage);
      }
    );
    
    setIsListening(true);
  };

  // Stop voice recognition
  const stopListening = () => {
    voiceAssistant.stopListening();
    setIsListening(false);
  };

  // Handle voice input
  const handleVoiceInput = (transcript) => {
    const command = voiceAssistant.processVoiceCommand(transcript, window.location.pathname);
    
    switch (command.type) {
      case 'navigate':
        onNavigate?.(command.page);
        speakResponse(t('voice.navigating', 'Navigating to the requested page'));
        break;
        
      case 'action':
        if (command.action === 'startListening') {
          startListening();
        } else if (command.action === 'stopListening') {
          stopListening();
        }
        break;
        
      case 'healthQuery':
      default:
        // Send to chat for health queries
        onVoiceQuery?.(command.query || transcript);
        break;
    }
    
    setIsListening(false);
  };

  // Speak response
  const speakResponse = (text) => {
    if (!voiceSettings.autoSpeak) return;
    
    setIsSpeaking(true);
    voiceAssistant.speak(
      text,
      currentLanguage,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Stop speaking
  const stopSpeaking = () => {
    voiceAssistant.stopSpeaking();
    setIsSpeaking(false);
  };

  // Play welcome message
  const playWelcomeMessage = () => {
    const welcomeMessage = voiceAssistant.getWelcomeMessage(currentLanguage);
    speakResponse(welcomeMessage);
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm max-w-sm">
        <p>{t('voice.not.supported', 'Voice features are not supported in this browser')}</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Voice Assistant Panel */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-lg border border-slate-200 p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              {t('voice.assistant', 'Voice Assistant')}
            </h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Voice Settings */}
          {showSettings && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t('voice.settings.speed', 'Speech Speed')}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t('voice.settings.volume', 'Volume')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  {t('voice.settings.auto.speak', 'Auto-speak responses')}
                </label>
                <input
                  type="checkbox"
                  checked={voiceSettings.autoSpeak}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, autoSpeak: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>
          )}

          {/* Transcript Display */}
          {transcript && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-700 mb-1">
                {t('voice.listening', 'Listening...')}
              </p>
              <p className="text-sm text-blue-900">"{transcript}"</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={playWelcomeMessage}
              disabled={isSpeaking}
              className="flex items-center justify-center gap-1 p-2 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              {t('voice.welcome', 'Welcome')}
            </button>
            
            <button
              onClick={() => onNavigate?.('/')}
              className="flex items-center justify-center gap-1 p-2 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
            >
              <Navigation className="w-3 h-3" />
              {t('voice.go.chat', 'Go to Chat')}
            </button>
          </div>

          {/* Voice Commands Help */}
          <div className="text-xs text-slate-600">
            <p className="font-medium mb-1">{t('voice.commands', 'Voice Commands:')}</p>
            <ul className="space-y-1 text-xs">
              <li>• "{t('voice.command.chat', 'Go to chat')}"</li>
              <li>• "{t('voice.command.symptoms', 'Go to symptoms')}"</li>
              <li>• "{t('voice.command.tips', 'Go to health tips')}"</li>
              <li>• {t('voice.command.ask', 'Ask any health question')}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Voice Assistant Button */}
      <div className="flex items-center gap-2">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white rounded-full p-2 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </button>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="bg-green-500 rounded-full p-3 shadow-lg hover:bg-green-600 transition-all duration-200 animate-pulse"
          >
            <Volume2 className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Main Microphone Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={!permissionGranted}
          className={`rounded-full p-4 shadow-lg transition-all duration-200 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : permissionGranted
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Permission Request Banner */}
      {!permissionGranted && (
        <div className="absolute bottom-16 right-0 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm max-w-sm">
          <p className="font-medium mb-1">{t('voice.permission.title', 'Microphone Access Required')}</p>
          <p className="text-xs">{t('voice.permission.message', 'Please allow microphone access to use voice features.')}</p>
        </div>
      )}
    </div>
  );
}

export default VoiceAssistant;
