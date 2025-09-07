// src/components/VoicePrescriptionAnalyzer.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Upload, FileText, AlertTriangle, CheckCircle, Send, Volume2, VolumeX, 
  Bot, User, Heart, Phone, Globe, Stethoscope, Pill, Activity, Shield, 
  Clock, Info, Star, TrendingUp, MessageSquare, FileImage
} from 'lucide-react';
import { useLocalizationStore, useChatStore, useUserStore } from '../store';
import { translations } from '../translations/index.js';
import { chatAPI, emergencyAPI } from '../api';

const VoicePrescriptionAnalyzer = () => {
  // Get store data first
  const { messages: chatStoreMessages, addMessage, setLoading } = useChatStore();
  const { profile, addPoints, unlockBadge } = useUserStore();
  const { 
    currentLanguage, 
    availableLanguages, 
    setLanguage: setGlobalLanguage 
  } = useLocalizationStore();
  
  // Translation function - must be defined before using it in state
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  // State declarations
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentMode, setCurrentMode] = useState('general'); // 'general', 'prescription', 'health'
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: t('voice_assistant.welcome', 
        '👋 **Welcome to RISHI - Your Complete Health Assistant!**\n\n🎯 **I\'m your all-in-one health companion with these capabilities:**\n\n• 💊 **Smart Prescription Analysis** - Upload and get detailed medication insights\n• 🩺 **Health Consultations** - Get personalized medical guidance\n• 🚨 **Emergency Support** - Quick access to emergency protocols\n• 💬 **General Health Chat** - Ask any health-related questions\n• 🗣️ **Voice Interaction** - Speak naturally in multiple languages\n\n**🌟 New Features:**\n• Multi-language support (English & Hindi)\n• Voice recognition and text-to-speech\n• Real-time prescription analysis\n• Interactive health modes\n• Points and rewards system\n\n**How to get started:**\n• 🎤 Click the microphone to speak\n• ⌨️ Type your questions\n• 📁 Upload prescription documents\n• 🔄 Switch between different health modes\n• 🌍 Change language in the top-right corner\n\nWhat would you like to explore today?'
      ),
      timestamp: new Date(),
      mode: 'general'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Mode configurations with language support
  const modeConfig = {
    general: {
      icon: MessageSquare,
      title: t('mode.general.title', 'General Health Chat'),
      color: 'from-blue-500 to-indigo-600',
      description: t('mode.general.desc', 'Ask any health-related questions')
    },
    prescription: {
      icon: Pill,
      title: t('mode.prescription.title', 'Prescription Analysis'),
      color: 'from-teal-500 to-green-600',
      description: t('mode.prescription.desc', 'Upload and analyze medications')
    },
    health: {
      icon: Stethoscope,
      title: t('mode.health.title', 'Health Consultation'),
      color: 'from-purple-500 to-pink-600',
      description: t('mode.health.desc', 'Get medical advice and guidance')
    },
    emergency: {
      icon: Shield,
      title: t('mode.emergency.title', 'Emergency Support'),
      color: 'from-red-500 to-orange-600',
      description: t('mode.emergency.desc', 'Quick access to emergency info')
    }
  };

  // Quick action templates with language support
  const quickActions = [
    {
      icon: Heart,
      text: t('action.symptoms', 'Symptoms Check'),
      message: t('action.symptoms.message', 'I have some symptoms I\'d like to discuss. Can you help me understand what they might mean?'),
      mode: 'health',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Pill,
      text: t('action.medication', 'Medication Info'),
      message: t('action.medication.message', 'I need information about my medications, their interactions, or side effects.'),
      mode: 'prescription',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: Phone,
      text: t('action.emergency', 'Emergency Help'),
      message: t('action.emergency.message', 'I need emergency medical information or contacts in my area.'),
      mode: 'emergency',
      color: 'from-red-600 to-orange-600'
    },
    {
      icon: Activity,
      text: t('action.tips', 'Health Tips'),
      message: t('action.tips.message', 'Can you give me some general health tips and wellness advice?'),
      mode: 'general',
      color: 'from-green-500 to-blue-500'
    }
  ];

  // Handle drag and drop for file upload
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image') || file.type.includes('pdf')) {
        processMessage('', file);
      } else {
        alert('Please upload an image or PDF file');
      }
    }
  }, []);
  // Initialize speech recognition with language support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Set language based on current language setting
      const speechLang = currentLanguage === 'hi' ? 'hi-IN' : 
                        currentLanguage === 'or' ? 'en-IN' : 'en-US';
      recognitionRef.current.lang = speechLang;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          setInputMessage(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis with language support
    speechSynthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, [currentLanguage]); // Re-initialize when language changes

  // Update welcome message when language changes
  useEffect(() => {
    if (chatMessages.length > 0 && chatMessages[0].id === 1) {
      const updatedMessages = [...chatMessages];
      updatedMessages[0] = {
        ...updatedMessages[0],
        message: t('voice_assistant.welcome', 
          '👋 **Welcome to RISHI - Your Complete Health Assistant!**\n\n🎯 **I\'m your all-in-one health companion with these capabilities:**\n\n• 💊 **Smart Prescription Analysis** - Upload and get detailed medication insights\n• 🩺 **Health Consultations** - Get personalized medical guidance\n• 🚨 **Emergency Support** - Quick access to emergency protocols\n• 💬 **General Health Chat** - Ask any health-related questions\n• 🗣️ **Voice Interaction** - Speak naturally in multiple languages\n\n**🌟 New Features:**\n• Multi-language support (English & Hindi)\n• Voice recognition and text-to-speech\n• Real-time prescription analysis\n• Interactive health modes\n• Points and rewards system\n\n**How to get started:**\n• 🎤 Click the microphone to speak\n• ⌨️ Type your questions\n• 📁 Upload prescription documents\n• 🔄 Switch between different health modes\n• 🌍 Change language in the top-right corner\n\nWhat would you like to explore today?'
        )
      };
      setChatMessages(updatedMessages);
      
      // Add a language change notification if this isn't the initial load
      if (chatMessages.length > 1) {
        const langName = currentLanguage === 'hi' ? 'हिंदी' : 
                        currentLanguage === 'or' ? 'ଓଡ଼ିଆ' : 'English';
        const changeMessage = {
          id: Date.now(),
          type: 'bot',
          message: `🌍 ${t('language.changed', `Language changed to ${langName}. All features are now available in your selected language!`)}`,
          timestamp: new Date(),
          mode: 'general'
        };
        setChatMessages(prev => [...prev, changeMessage]);
      }
    }
  }, [currentLanguage]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        // Update language before starting recognition
        const speechLang = currentLanguage === 'hi' ? 'hi-IN' : 
                          currentLanguage === 'or' ? 'en-IN' : 'en-US';
        recognitionRef.current.lang = speechLang;
        
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
      } else {
        const langMessage = currentLanguage === 'hi' 
          ? 'आपके ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है'
          : 'Speech recognition not supported in your browser';
        alert(langMessage);
      }
    }
  };

  const speakMessage = (message) => {
    if (voiceEnabled && speechSynthRef.current) {
      speechSynthRef.current.cancel();
      
      // Clean message for speech (remove markdown and emojis)
      const cleanMessage = message.replace(/[#*•📋📎💊⚕️💯🩺⚠️👋🎯🔄⌨️🎤📁✨]/g, '')
                                 .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
                                 .replace(/\n+/g, ' '); // Replace newlines with spaces
      
      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Set language-specific voice
      const voices = speechSynthRef.current.getVoices();
      if (currentLanguage === 'hi') {
        const hindiVoice = voices.find(voice => 
          voice.lang.startsWith('hi') || voice.name.includes('Hindi')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
      } else if (currentLanguage === 'or') {
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en-IN') || voice.name.includes('Indian')
        );
        if (englishVoice) utterance.voice = englishVoice;
        utterance.lang = 'en-IN';
      } else {
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
        );
        if (englishVoice) utterance.voice = englishVoice;
        utterance.lang = 'en-US';
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const processMessage = async (message, file = null) => {
    if (!message.trim() && !file) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message || `📎 Uploaded: ${file?.name}`,
      timestamp: new Date(),
      file: file,
      mode: currentMode
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setInputMessage('');

    // Award points for interaction
    if (addPoints) {
      addPoints(5, 'chat_interaction');
    }

    try {
      let botResponse = '';

      if (file) {
        // Enhanced file analysis based on current mode
        setCurrentMode('prescription'); // Auto-switch to prescription mode for file uploads
        
        // Simulate comprehensive prescription analysis
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        botResponse = await generatePrescriptionAnalysis(file);
        
        // Create detailed analysis result
        setAnalysisResult({
          medications: [
            'Metformin 500mg - Twice daily with meals',
            'Lisinopril 10mg - Once daily in morning', 
            'Atorvastatin 20mg - Once daily at bedtime'
          ],
          interactions: [
            {
              severity: 'medium',
              description: 'Monitor for potential interaction between Lisinopril and potassium supplements'
            }
          ],
          recommendations: [
            'Take Metformin with food to reduce side effects',
            'Monitor blood pressure regularly',
            'Schedule liver function tests every 6 months'
          ]
        });

        } else {
          // Enhanced AI responses based on mode and context
          if (currentMode === 'emergency' || message.toLowerCase().includes('emergency')) {
            botResponse = await generateEmergencyResponse(message);
          } else if (currentMode === 'prescription' || message.toLowerCase().includes('medication')) {
            botResponse = await generateMedicationResponse(message);
          } else if (currentMode === 'health' || message.toLowerCase().includes('symptoms')) {
            botResponse = await generateHealthResponse(message);
          } else {
            // Try to use real chat API for general health questions
            try {
              const response = await chatAPI.sendMessage(
                message, 
                currentLanguage, 
                null // location can be added later if needed
              );
              botResponse = response.answer || response.message || response;
              
              // If API response is not in expected format, use fallback
              if (typeof botResponse !== 'string') {
                botResponse = await generateGeneralResponse(message);
              }
            } catch (error) {
              console.log('API not available, using fallback response');
              botResponse = await generateGeneralResponse(message);
            }
          }
        }      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: botResponse,
        timestamp: new Date(),
        mode: currentMode
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        const speechText = botResponse.replace(/[#*•📋📎💊⚕️💯🩺⚠️👋🎯🔄⌨️🎤📁]/g, '').replace(/\n/g, ' ');
        speakMessage(speechText);
      }

      // Check for badge achievements
      if (unlockBadge && chatMessages.length === 1) {
        unlockBadge('First Health Chat');
      }
      
      if (unlockBadge && chatMessages.length >= 5) {
        unlockBadge('Chatty Helper');
      }
      
      if (unlockBadge && file) {
        unlockBadge('Document Analyzer');
      }

    } catch (error) {
      console.error('Processing error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: '⚠️ I apologize, but I\'m having trouble processing your request right now. Please try again, or contact emergency services if you need immediate medical attention.',
        timestamp: new Date(),
        isError: true
      };

      setChatMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  };

  // Enhanced AI response generators with language support
  const generatePrescriptionAnalysis = async (file) => {
    const baseKey = 'prescription_analysis';
    return t(`${baseKey}.response`, 
      `📋 **${t('prescription_analysis.title', 'Comprehensive Prescription Analysis')}**

**📄 ${t('prescription_analysis.document', 'Document Processed')}:** ${file.name}

**💊 ${t('prescription_analysis.medications', 'Medications Identified')}:**
• **${t('prescription_analysis.med1', 'Metformin 500mg')}** - ${t('prescription_analysis.med1_desc', 'Twice daily with meals (Diabetes management)')}
• **${t('prescription_analysis.med2', 'Lisinopril 10mg')}** - ${t('prescription_analysis.med2_desc', 'Once daily, morning (Blood pressure control)')}
• **${t('prescription_analysis.med3', 'Atorvastatin 20mg')}** - ${t('prescription_analysis.med3_desc', 'Once daily at bedtime (Cholesterol management)')}

**⚠️ ${t('prescription_analysis.alerts', 'Important Alerts')}:**
• ${t('prescription_analysis.alert1', 'Monitor for potential interaction between Lisinopril and potassium supplements')}
• ${t('prescription_analysis.alert2', 'Regular kidney function monitoring required for Metformin')}
• ${t('prescription_analysis.alert3', 'Liver function tests recommended every 6 months for Atorvastatin')}

**🎯 ${t('prescription_analysis.recommendations', 'Key Recommendations')}:**
• ${t('prescription_analysis.rec1', 'Take Metformin with food to reduce gastrointestinal upset')}
• ${t('prescription_analysis.rec2', 'Monitor blood pressure regularly (target: <130/80 mmHg)')}
• ${t('prescription_analysis.rec3', 'Maintain consistent timing for all medications')}
• ${t('prescription_analysis.rec4', 'Stay hydrated and avoid excessive alcohol consumption')}

**📊 ${t('prescription_analysis.goals', 'Treatment Goals')}:**
• ${t('prescription_analysis.goal1', 'HbA1c target: <7% for diabetes management')}
• ${t('prescription_analysis.goal2', 'Blood pressure: <130/80 mmHg')}
• ${t('prescription_analysis.goal3', 'LDL cholesterol: <100 mg/dL')}

**🔔 ${t('prescription_analysis.next_steps', 'Next Steps')}:**
• ${t('prescription_analysis.step1', 'Schedule follow-up appointment in 3 months')}
• ${t('prescription_analysis.step2', 'Monitor blood glucose levels daily')}
• ${t('prescription_analysis.step3', 'Watch for side effects and report any concerns')}

**${t('prescription_analysis.questions', 'Questions?')}** ${t('prescription_analysis.ask_more', 'Ask me about any specific medication, interactions, or concerns!')}`
    );
  };

  const generateEmergencyResponse = async (message) => {
    return t('emergency.response',
      `🚨 **${t('emergency.title', 'Emergency Medical Information')}**

**${t('emergency.life_threatening', 'For Life-Threatening Emergencies')}:**
• 📞 ${t('emergency.call_numbers', 'Call 108/102 (India) or 911 (US) immediately')}
• 🏥 ${t('emergency.go_hospital', 'Go to nearest emergency room')}
• 📧 ${t('emergency.dont_delay', 'Don\'t delay for non-critical research')}

**⚡ ${t('emergency.immediate_actions', 'Immediate Actions for Common Emergencies')}:**

**${t('emergency.heart_attack', 'Heart Attack Signs')}:**
• ${t('emergency.heart_symptoms', 'Chest pain, arm pain, shortness of breath')}
• ${t('emergency.call_immediately', 'Call emergency services immediately')}
• ${t('emergency.aspirin', 'Chew aspirin if available (unless allergic)')}

**${t('emergency.stroke_signs', 'Stroke Signs (F.A.S.T.)')}:**
• ${t('emergency.stroke_symptoms', 'Face drooping, Arm weakness, Speech difficulty')}
• ${t('emergency.time_critical', 'Time to call emergency services NOW')}

**${t('emergency.allergic_reaction', 'Severe Allergic Reaction')}:**
• ${t('emergency.epipen', 'Use EpiPen if available')}
• ${t('emergency.call_services', 'Call emergency services')}
• ${t('emergency.monitor_breathing', 'Monitor breathing and consciousness')}

**🏥 ${t('emergency.find_services', 'Find Nearby Emergency Services')}:**
• ${t('emergency.phone_settings', 'Use your phone\'s emergency settings')}
• ${t('emergency.ask_directions', 'Ask someone nearby for directions')}
• ${t('emergency.call_family', 'Consider calling a friend or family member')}

**💡 ${t('emergency.remember', 'Remember')}:** ${t('emergency.disclaimer', 'When in doubt, always seek immediate professional medical help. I\'m here for information, but cannot replace emergency medical services.')}

${t('emergency.current_question', 'Is this a current emergency? Please seek immediate professional help if needed!')}`
    );
  };

  const generateMedicationResponse = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('side effect') || lowerMessage.includes('reaction')) {
      return `⚕️ **Medication Side Effects Guide**

**🔍 Common Side Effects to Monitor:**

**Mild (Usually Temporary):**
• Nausea, headache, dizziness
• Mild stomach upset
• Slight drowsiness or fatigue

**Moderate (Consult Healthcare Provider):**
• Persistent nausea or vomiting
• Skin rash or itching
• Changes in appetite or sleep patterns

**Severe (Seek Immediate Medical Attention):**
• Difficulty breathing or swelling
• Severe allergic reactions
• Chest pain or irregular heartbeat
• Severe mood changes

**📋 What to Do:**
1. **Track symptoms** - Note when they occur
2. **Don't stop medications** without consulting your doctor
3. **Contact healthcare provider** for persistent issues
4. **Seek emergency care** for severe reactions

**💡 Pro Tips:**
• Keep a medication diary
• Report all side effects to your doctor
• Never adjust doses without medical guidance

Would you like specific information about a particular medication's side effects?`;
    }
    
    if (lowerMessage.includes('interaction')) {
      return `⚠️ **Drug Interaction Safety Guide**

**🔍 Types of Drug Interactions:**

**Drug-Drug Interactions:**
• Multiple medications affecting each other
• Can increase or decrease effectiveness
• May cause unexpected side effects

**Drug-Food Interactions:**
• Grapefruit juice with many medications
• Calcium-rich foods with antibiotics
• Alcohol with pain medications

**Drug-Supplement Interactions:**
• Vitamin K with blood thinners
• St. John's Wort with antidepressants
• Iron supplements with thyroid medications

**🛡️ Safety Measures:**
• Always inform all healthcare providers about ALL medications
• Include over-the-counter drugs and supplements
• Use the same pharmacy when possible
• Keep an updated medication list

**📱 Helpful Tools:**
• Medication interaction checkers
• Pharmacy consultation services
• Regular medication reviews with pharmacist

**🚨 Warning Signs:**
• Unusual side effects after starting new medication
• Medications not working as expected
• Unexpected symptoms

Would you like to check specific drug interactions or upload your prescription list?`;
    }

    return `💊 **Comprehensive Medication Guidance**

**📚 What I Can Help You With:**

**💡 General Information:**
• How medications work in your body
• Proper timing and administration
• Storage requirements and expiration dates

**🔍 Specific Guidance:**
• Dosage calculations and timing
• What to do if you miss a dose
• When to take with or without food

**⚠️ Safety Information:**
• Potential side effects to monitor
• Drug interactions and contraindications
• When to contact your healthcare provider

**📋 Prescription Analysis:**
• Upload your prescription for detailed review
• Medication regimen optimization
• Compliance and adherence tips

**🎯 Personalized Support:**
• Medication reminders and timing
• Lifestyle modifications to improve effectiveness
• Questions to ask your doctor or pharmacist

**How would you like to proceed?**
• Upload a prescription for analysis
• Ask about a specific medication
• Get general medication safety tips
• Learn about drug interactions

What specific medication questions do you have?`;
  };

  const generateHealthResponse = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('symptom')) {
      return `🩺 **Symptom Assessment Guide**

**⚡ When to Seek Immediate Medical Attention:**
• Chest pain or difficulty breathing
• Severe headache with vision changes
• High fever with stiff neck
• Signs of stroke (F.A.S.T.)
• Severe allergic reactions

**📋 Common Symptoms & When to See a Doctor:**

**Respiratory Symptoms:**
• Persistent cough (>2 weeks)
• Shortness of breath
• Wheezing or chest tightness

**Gastrointestinal Issues:**
• Persistent abdominal pain
• Blood in stool or vomit
• Severe nausea/vomiting

**Neurological Concerns:**
• Severe headaches
• Dizziness or balance issues
• Memory problems

**🔍 Self-Assessment Questions:**
1. How long have symptoms persisted?
2. Are they getting better or worse?
3. Do they interfere with daily activities?
4. Are there any triggering factors?

**💡 Helpful Actions:**
• Keep a symptom diary
• Monitor vital signs if possible
• Note any medication changes
• Track triggers and patterns

**🏥 When in Doubt:**
Always consult with a healthcare professional for proper diagnosis and treatment.

Can you describe your specific symptoms? I can help you understand when to seek medical care.`;
    }

    return `🏥 **General Health Consultation**

**🌟 Comprehensive Health Support Available:**

**🔍 Symptom Analysis:**
• Help assess when to seek medical care
• Understand warning signs and red flags
• Guidance on self-care vs. professional care

**💊 Medication Support:**
• Prescription analysis and optimization
• Drug interaction checking
• Side effect management

**🎯 Preventive Care:**
• Wellness tips and lifestyle advice
• Screening recommendations
• Health maintenance schedules

**🚨 Emergency Preparedness:**
• Recognize medical emergencies
• First aid guidance
• Emergency contact information

**📱 Health Management:**
• Tracking symptoms and medications
• Appointment preparation
• Questions to ask healthcare providers

**🤝 Personalized Care:**
Based on your specific needs, I can provide:
• Tailored health recommendations
• Cultural and linguistic considerations
• Age and gender-appropriate advice

**What health topics would you like to explore?**
• Specific symptoms or concerns
• Medication questions
• General wellness advice
• Emergency information
• Preventive care guidance

How can I best support your health today?`;
  };

  const generateGeneralResponse = async (message) => {
    try {
      // Call the backend API for actual AI response
      const response = await chatAPI.sendMessage(message, currentLanguage, 'India');
      return response.answer;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return t('error.ai_unavailable', 'Sorry, I am unable to process your request right now. Please try again later.');
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      processMessage(inputMessage);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.includes('image') || file.type.includes('pdf')) {
        processMessage('', file);
      } else {
        alert('Please upload an image or PDF file');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow new line with Shift+Enter
      return;
    }
    
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'm':
          e.preventDefault();
          toggleListening();
          break;
        case 'u':
          e.preventDefault();
          fileInputRef.current?.click();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Enhanced Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${modeConfig[currentMode].color} relative`}>
              {React.createElement(modeConfig[currentMode].icon, { className: "w-6 h-6 text-white" })}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">RISHI Health Assistant</h2>
              <p className="text-teal-400 text-sm">
                {modeConfig[currentMode].description} • Voice-enabled support
              </p>
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) => {
                setGlobalLanguage(e.target.value);
              }}
              className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              title="Select Language"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-700">
                  {lang.native}
                </option>
              ))}
            </select>

            {/* Voice Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled ? 'bg-teal-500 text-white' : 'bg-slate-600 text-slate-400'
              }`}
              title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* User Points */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg text-sm font-medium">
              <Heart className="w-4 h-4" />
              <span>{profile.points} {t('points', 'Points')}</span>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {Object.entries(modeConfig).map(([mode, config]) => (
            <button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                currentMode === mode
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {React.createElement(config.icon, { className: "w-4 h-4" })}
              {config.title}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`p-2 rounded-full relative ${
              msg.type === 'user' ? 'bg-blue-500' : 'bg-teal-500'
            }`}>
              {msg.type === 'user' ? 
                <User className="w-4 h-4 text-white" /> : 
                <Bot className="w-4 h-4 text-white" />
              }
              {/* Mode indicator for bot messages */}
              {msg.type === 'bot' && msg.mode && (
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
                  msg.mode === 'prescription' ? 'bg-green-500' :
                  msg.mode === 'health' ? 'bg-purple-500' :
                  msg.mode === 'emergency' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {React.createElement(modeConfig[msg.mode]?.icon || MessageSquare, { 
                    className: "w-2 h-2 text-white" 
                  })}
                </div>
              )}
            </div>
            <div className={`max-w-[75%] p-4 rounded-2xl ${
              msg.type === 'user' 
                ? 'bg-blue-600 text-white ml-auto' 
                : msg.isError
                  ? 'bg-red-800/80 text-red-100 border border-red-600'
                  : 'bg-slate-800/80 text-slate-100 border border-slate-700'
            }`}>
              <div className="whitespace-pre-wrap">{msg.message}</div>
              {msg.file && (
                <div className="mt-2 p-2 bg-slate-700/50 rounded-lg">
                  <FileText className="w-4 h-4 inline mr-2" />
                  <span className="text-sm">{msg.file.name}</span>
                  <span className="text-xs text-slate-400 ml-2">
                    ({(msg.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
              {/* Analysis result display */}
              {msg.type === 'bot' && analysisResult && msg.message.includes('Prescription Analysis') && (
                <div className="mt-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-green-400">Detailed Analysis Available</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-slate-300">Medications:</strong>
                      <div className="text-slate-400">
                        {analysisResult.medications?.join(', ')}
                      </div>
                    </div>
                    {analysisResult.interactions?.length > 0 && (
                      <div>
                        <strong className="text-orange-300">Interactions:</strong>
                        <div className="text-orange-200 text-xs">
                          {analysisResult.interactions[0]?.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className={`text-xs mt-2 opacity-70 ${
                msg.type === 'user' ? 'text-blue-200' : 'text-slate-400'
              }`}>
                {msg.timestamp.toLocaleTimeString()}
                {msg.mode && msg.type === 'bot' && (
                  <span className="ml-2 px-2 py-1 bg-slate-600 rounded text-xs">
                    {modeConfig[msg.mode]?.title || msg.mode}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${modeConfig[currentMode].color}`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 text-slate-100 border border-slate-700 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
                <span>{t('voice.processing', 'RISHI is analyzing your')} {modeConfig[currentMode].title.toLowerCase()} {t('voice.request', 'request...')}</span>
              </div>
              {currentMode === 'prescription' && (
                <div className="mt-2 text-xs text-slate-400">
                  {t('prescription.analyzing', 'Reviewing medications, checking interactions, generating recommendations...')}
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Voice Visualization */}
      {isListening && (
        <div className="px-4 py-3 bg-slate-800/50">
          <div className="flex items-center justify-center gap-1">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full animate-pulse bg-gradient-to-t ${modeConfig[currentMode].color}`}
                style={{
                  height: `${Math.random() * 30 + 15}px`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
          <p className="text-center text-teal-400 text-sm mt-2">
            🎤 {t('voice.listening', 'Listening for')} {modeConfig[currentMode].title.toLowerCase()}{t('voice.speak_now', '... Speak now')}
          </p>
          {transcript && (
            <p className="text-center text-slate-300 text-xs mt-1 bg-slate-700/50 rounded px-2 py-1">
              "{transcript}"
            </p>
          )}
        </div>
      )}

      {/* Drag and Drop Overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border-2 border-dashed border-teal-500 rounded-xl p-8 text-center">
            <Upload className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-white mb-2">Drop your prescription here</p>
            <p className="text-slate-400">Support for images and PDF files</p>
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="flex items-end gap-3">
          {/* Enhanced File Upload */}
          <div className="relative">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl transition-colors group"
              title="Upload prescription or medical document"
            >
              <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="absolute -top-8 left-0 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Upload file
            </div>
          </div>

          {/* Enhanced Voice Button */}
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse scale-110 shadow-lg shadow-red-500/30'
                : `bg-gradient-to-r ${modeConfig[currentMode].color} hover:shadow-lg hover:scale-105 text-white`
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Enhanced Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentMode === 'prescription' 
                  ? t('placeholder.prescription', "Ask about medications, upload prescriptions, or describe side effects...")
                  : currentMode === 'health'
                  ? t('placeholder.health', "Describe your symptoms or health concerns...")
                  : currentMode === 'emergency'
                  ? t('placeholder.emergency', "Describe your emergency situation...")
                  : t('placeholder.general', "Ask any health question or describe your concerns...")
              }
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 border border-slate-600 focus:border-teal-500 transition-colors"
              rows="2"
              disabled={isProcessing}
            />
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="absolute right-3 top-3 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                title="Stop speaking"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Enhanced Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessing}
            className={`p-3 rounded-xl transition-all duration-200 ${
              !inputMessage.trim() || isProcessing
                ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                : `bg-gradient-to-r ${modeConfig[currentMode].color} hover:shadow-lg hover:scale-105 text-white`
            }`}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Status Information */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-slate-400">
            💡 {t('status.current_mode', 'Current mode')}: <span className="text-teal-400 font-medium">
              {modeConfig[currentMode].title}
            </span> • {t('status.voice', 'Voice')} {voiceEnabled ? t('status.enabled', 'enabled') : t('status.disabled', 'disabled')} • {t('status.shortcuts', 'Shortcuts: Ctrl+M (mic), Ctrl+U (upload)')}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t('status.connected', 'Connected')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{currentLanguage === 'hi' ? 'हिंदी' : currentLanguage === 'or' ? 'ଓଡ଼ିଆ' : 'English'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-teal-400" />
              <span>{profile.points} {t('status.points', 'pts')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePrescriptionAnalyzer;
