import React, { createContext, useContext, useMemo, useState } from 'react'

const LanguageContext = createContext()

const STRINGS = {
  en: {
    appName: 'Vaidya Dhara',
    chat: 'Chat',
    dashboard: 'Dashboard',
    symptomChecker: 'Symptom Checker',
    healthTips: 'Health Tips',
    emergency: 'Emergency',
    typeMessage: 'Type your message...',
    send: 'Send',
    disclaimer: 'This assistant provides general guidance and is not a substitute for professional medical advice.',
    language: 'Language',
    loading: 'Thinking...',
  },
  hi: {
    appName: 'वैद्य धारा',
    chat: 'चैट',
    dashboard: 'डैशबोर्ड',
    symptomChecker: 'लक्षण जाँच',
    healthTips: 'स्वास्थ्य सुझाव',
    emergency: 'आपातकाल',
    typeMessage: 'अपना संदेश लिखें...',
    send: 'भेजें',
    disclaimer: 'यह सहायक सामान्य मार्गदर्शन देता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
    language: 'भाषा',
    loading: 'सोच रहा है...',
  },
  kn: {
    appName: 'ವೈದ್ಯ ಧಾರಾ',
    chat: 'ಚಾಟ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    symptomChecker: 'ಲಕ್ಷಣ ಪರಿಶೀಲಕ',
    healthTips: 'ಆರೋಗ್ಯ ಸಲಹೆಗಳು',
    emergency: 'ತುರ್ತು',
    typeMessage: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    send: 'ಕಳುಹಿಸಿ',
    disclaimer: 'ಈ ಸಹಾಯಕ ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನವನ್ನು ಒದಗಿಸುತ್ತದೆ ಮತ್ತು ವೈದ್ಯಕೀಯ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    language: 'ಭಾಷೆ',
    loading: 'ಯೋಚಿಸುತ್ತಿದೆ...',
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = useMemo(() => STRINGS[lang] || STRINGS.en, [lang])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
