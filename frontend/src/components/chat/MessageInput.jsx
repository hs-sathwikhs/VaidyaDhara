import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

const MessageInput = ({ 
  onSendMessage, 
  disabled = false,
  currentLanguage = 'en',
  placeholder = 'Type your symptoms here...',
  allowVoiceInput = true,
  maxLength = 1000
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Handle text input
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      setError('');
    } else {
      setError(`Message too long. Maximum ${maxLength} characters allowed.`);
    }
  };

  // Handle send message
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    if (trimmedMessage.length < 2) {
      setError('Please enter a longer message.');
      return;
    }

    onSendMessage(trimmedMessage, 'text');
    setMessage('');
    setError('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Send on Enter (but not Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    // Clear on Escape
    if (e.key === 'Escape') {
      setMessage('');
      setError('');
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    if (!allowVoiceInput) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        onSendMessage(audioBlob, 'audio');
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      });

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // Max 60 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Format recording time
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get placeholder text based on language
  const getPlaceholder = () => {
    switch (currentLanguage) {
      case 'hi':
        return 'अपने लक्षण यहाँ लिखें...';
      case 'or':
        return 'ଆପଣଙ୍କର ଲକ୍ଷଣ ଏଠାରେ ଲେଖନ୍ତୁ...';
      case 'bn':
        return 'আপনার উপসর্গ এখানে লিখুন...';
      case 'ta':
        return 'உங்கள் அறிகுறிகளை இங்கே எழுதுங்கள்...';
      case 'te':
        return 'మీ లక్షణాలను ఇక్కడ రాయండి...';
      case 'kn':
        return 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...';
      default:
        return placeholder;
    }
  };

  return (
    <div className="message-input-container">
      {/* Error Display */}
      {error && (
        <div className="input-error" role="alert" aria-live="polite">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button 
            className="error-dismiss"
            onClick={() => setError('')}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="recording-indicator" role="status" aria-live="polite">
          <div className="recording-content">
            <span className="recording-icon">🎤</span>
            <span className="recording-text">Recording...</span>
            <span className="recording-time">{formatRecordingTime(recordingTime)}</span>
            <button 
              className="stop-recording-btn"
              onClick={stopRecording}
              aria-label="Stop recording"
            >
              ⏹️ Stop
            </button>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="input-wrapper">
        <div className="input-container">
          {/* Text Input */}
          <div className="text-input-section">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              disabled={disabled || isRecording}
              className="message-textarea"
              rows="1"
              maxLength={maxLength}
              aria-label="Type your message"
              aria-describedby={error ? 'input-error' : undefined}
            />
            
            {/* Character Counter */}
            <div className="character-counter">
              <span className={`counter-text ${message.length > maxLength * 0.9 ? 'counter-warning' : ''}`}>
                {message.length}/{maxLength}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="input-actions">
            {/* Voice Input Button */}
            {allowVoiceInput && (
              <button
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
                title={isRecording ? 'Stop recording' : 'Voice message'}
              >
                {isRecording ? '⏹️' : '🎤'}
              </button>
            )}

            {/* Send Button */}
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={disabled || !message.trim() || isRecording}
              aria-label="Send message"
              title="Send message (Enter)"
            >
              <span className="send-icon">➤</span>
              <span className="send-text">Send</span>
            </button>
          </div>
        </div>

        {/* Typing Hint */}
        <div className="input-hint">
          <span className="hint-text">
            Press Enter to send, Shift+Enter for new line
          </span>
          {allowVoiceInput && (
            <span className="hint-separator">•</span>
          )}
          {allowVoiceInput && (
            <span className="hint-text">
              Click 🎤 for voice message
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
