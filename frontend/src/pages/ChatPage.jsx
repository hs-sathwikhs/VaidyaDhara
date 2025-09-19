// src/pages/ChatPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Heart, AlertTriangle, Phone, Globe } from 'lucide-react';
import { useChatStore, useUserStore, useLocalizationStore } from '../store';
import { chatAPI, emergencyAPI } from '../api';
import { translations } from '../translations';
import ReactMarkdown from 'react-markdown';

function ChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { 
    messages, 
    isLoading, 
    userLocation, 
    addMessage, 
    setLoading, 
    setLocation 
  } = useChatStore();
  
  const { profile, addPoints, unlockBadge } = useUserStore();
  const { 
    currentLanguage, 
    availableLanguages, 
    setLanguage: setGlobalLanguage 
  } = useLocalizationStore();

  // Translation function
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      language: currentLanguage,
      location: userLocation,
    };

    addMessage(userMessage);
    setInputMessage('');
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage(
        inputMessage.trim(),
        currentLanguage,
        userLocation
      );

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          type: 'bot',
          content: response.answer,
          language: currentLanguage,
        });

        // Award points for interaction
        addPoints(5, 'chat_interaction');
        
        // Check for badge achievements
        if (messages.length === 0) {
          unlockBadge('First Chat');
        }
        if (messages.length >= 10) {
          unlockBadge('Chatty Helper');
        }
        
        setLoading(false);
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      console.error('Chat API Error:', error);
      console.error('Error details:', error.response?.data, error.message);
      setIsTyping(false);
      addMessage({
        type: 'bot',
        content: `I apologize, but I'm having trouble connecting right now. Error: ${error.message || 'Unknown error'}. Please try again in a moment, or contact emergency services if you need immediate medical attention.`,
        isError: true,
      });
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: Heart,
      text: t('action.symptoms'),
      message: t('action.symptoms.message'),
      color: "from-red-500 to-pink-500"
    },
    {
      icon: AlertTriangle,
      text: t('action.general'),
      message: t('action.general.message'),
      color: "from-blue-500 to-teal-500"
    },
    {
      icon: Phone,
      text: t('action.emergency'),
      message: t('action.emergency.message'),
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      text: t('action.tips'),
      message: t('action.tips.message'),
      color: "from-green-500 to-blue-500"
    },
  ];

  const handleQuickAction = (message) => {
    setInputMessage(message);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-8 h-8 text-blue-500" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{t('chat.title')}</h1>
              <p className="text-sm text-slate-600">{t('chat.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) => {
                setGlobalLanguage(e.target.value);
              }}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native}
                </option>
              ))}
            </select>

            {/* User Points */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg text-sm font-medium">
              <Heart className="w-4 h-4" />
              <span>{profile.points} {t('points')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('chat.welcome.title')}</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {t('chat.welcome.subtitle')}
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.message)}
                  className="medical-card p-4 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{action.text}</h3>
                  <p className="text-sm text-slate-600">{t('action.click.start')}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
                  : 'bg-white border-2 border-blue-200 text-blue-500'
              }`}>
                {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              {/* Message Content */}
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'chat-bubble-user'
                  : message.isError
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'chat-bubble-bot'
              }`}>
                <ReactMarkdown 
                  className="prose prose-sm max-w-none"
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                
                <div className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-200 text-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="chat-bubble-bot flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-slate-600 ml-2">{t('chat.thinking')}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Medical Disclaimer */}
      {messages.length > 0 && (
        <div className="px-4 py-2">
          <div className="medical-card p-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>
                <strong>{t('disclaimer.title')}:</strong> {t('disclaimer.text')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">          
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[50px] max-h-32"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="medical-button-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="text-xs text-slate-500 text-center mt-2">
          {t('chat.enter.hint')}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;