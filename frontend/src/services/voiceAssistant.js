// Voice Assistant Service for VaidyaDhara
class VoiceAssistantService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSupported = this.checkSupport();
    this.currentLanguage = 'en-US';
    this.voices = [];
    
    // Initialize speech recognition
    this.initializeSpeechRecognition();
    
    // Load available voices
    this.loadVoices();
    
    // Voice settings
    this.settings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    };
  }

  // Check browser support for speech APIs
  checkSupport() {
    const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasSynthesis = 'speechSynthesis' in window;
    
    return {
      recognition: hasRecognition,
      synthesis: hasSynthesis,
      full: hasRecognition && hasSynthesis
    };
  }

  // Initialize speech recognition
  initializeSpeechRecognition() {
    if (!this.isSupported.recognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLanguage;
    this.recognition.maxAlternatives = 1;

    // Event listeners
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };
  }

  // Load available voices
  loadVoices() {
    const updateVoices = () => {
      this.voices = this.synthesis.getVoices();
    };
    
    updateVoices();
    
    // Some browsers load voices asynchronously
    this.synthesis.onvoiceschanged = updateVoices;
  }

  // Get voice for specific language
  getVoiceForLanguage(language) {
    const languageMap = {
      'en': ['en-US', 'en-IN', 'en-GB'],
      'hi': ['hi-IN'],
      'kn': ['kn-IN'],
      'ta': ['ta-IN'],
      'te': ['te-IN'],
      'bn': ['bn-IN'],
      'or': ['or-IN']
    };

    const preferredLangs = languageMap[language] || ['en-US'];
    
    for (const lang of preferredLangs) {
      const voice = this.voices.find(v => v.lang === lang);
      if (voice) return voice;
    }
    
    // Fallback to first available voice
    return this.voices[0];
  }

  // Set language for voice recognition and synthesis
  setLanguage(languageCode) {
    const recognitionLanguageMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'kn': 'kn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'or': 'or-IN'
    };

    this.currentLanguage = recognitionLanguageMap[languageCode] || 'en-US';
    
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
  }

  // Start listening for voice input
  startListening(onResult, onError) {
    if (!this.isSupported.recognition || !this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    // Set up result handler
    this.recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        transcript += result[0].transcript;
        if (result.isFinal) {
          isFinal = true;
        }
      }
      
      onResult?.({ transcript, isFinal });
    };

    // Set up error handler
    this.recognition.onerror = (event) => {
      onError?.(event.error);
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError?.(error.message);
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Speak text using TTS
  speak(text, language = null, onStart = null, onEnd = null) {
    if (!this.isSupported.synthesis) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Stop any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    if (language) {
      const voice = this.getVoiceForLanguage(language);
      if (voice) {
        utterance.voice = voice;
      }
    }

    // Apply settings
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    // Event handlers
    utterance.onstart = () => {
      console.log('Speech started');
      onStart?.();
    };

    utterance.onend = () => {
      console.log('Speech ended');
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
    };

    this.synthesis.speak(utterance);
  }

  // Stop speaking
  stopSpeaking() {
    this.synthesis.cancel();
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis.speaking;
  }

  // Update voice settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Voice commands processor
  processVoiceCommand(transcript, currentPage) {
    const command = transcript.toLowerCase();
    
    // Navigation commands
    if (command.includes('go to') || command.includes('navigate to') || 
        command.includes('जाओ') || command.includes('नेविगेट') ||
        command.includes('होगे') || command.includes('ಹೋಗು')) {
      
      if (command.includes('chat') || command.includes('चैट') || command.includes('ಚಾಟ್')) {
        return { type: 'navigate', page: '/' };
      } else if (command.includes('symptoms') || command.includes('लक्षण') || command.includes('ಲಕ್ಷಣ')) {
        return { type: 'navigate', page: '/symptoms' };
      } else if (command.includes('tips') || command.includes('सुझाव') || command.includes('ಸುಝಾವುಗಳು')) {
        return { type: 'navigate', page: '/health-tips' };
      } else if (command.includes('rewards') || command.includes('पुरस्कार') || command.includes('ಪ್ರಶಸ್ತಿಗಳು')) {
        return { type: 'navigate', page: '/rewards' };
      }
    }
    
    // Action commands
    if (command.includes('start recording') || command.includes('listen') ||
        command.includes('रिकॉर्डिंग शुरू') || command.includes('सुनो') ||
        command.includes('ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ')) {
      return { type: 'action', action: 'startListening' };
    }
    
    if (command.includes('stop recording') || command.includes('stop listening') ||
        command.includes('रिकॉर्डिंग बंद') || command.includes('ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ')) {
      return { type: 'action', action: 'stopListening' };
    }

    // Health query (default action)
    return { type: 'healthQuery', query: transcript };
  }

  // Get microphone permissions
  async requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  // Voice assistant welcome message
  getWelcomeMessage(language = 'en') {
    const messages = {
      'en': 'Hello! I am Vaidya Dhara voice assistant. You can ask me health questions, navigate through the app, or use voice commands. How can I help you today?',
      'hi': 'नमस्ते! मैं वैद्य धारा वॉइस असिस्टेंट हूं। आप मुझसे स्वास्थ्य प्रश्न पूछ सकते हैं, ऐप में नेविगेट कर सकते हैं, या वॉइस कमांड का उपयोग कर सकते हैं। आज मैं आपकी कैसे मदद कर सकता हूं?',
      'kn': 'ನಮಸ್ಕಾರ! ನಾನು ವೈದ್ಯ ಧಾರಾ ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್. ನೀವು ನನ್ನನ್ನು ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು, ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಬಹುದು ಅಥವಾ ವಾಯ್ಸ್ ಕಮಾಂಡ್‌ಗಳನ್ನು ಬಳಸಬಹುದು. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
    };
    
    return messages[language] || messages['en'];
  }
}

// Export singleton instance
export const voiceAssistant = new VoiceAssistantService();
export default VoiceAssistantService;
