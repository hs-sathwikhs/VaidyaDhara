// src/components/DocumentAnalyzer.jsx
import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, X, Loader, Download, Eye } from 'lucide-react';
import { useLocalizationStore } from '../store';
import { translations } from '../translations';

const DocumentAnalyzer = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { currentLanguage } = useLocalizationStore();
  
  // Translation function
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

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
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile) => {
    // Check file type
    if (!selectedFile.type.includes('pdf') && !selectedFile.name.endsWith('.txt')) {
      alert(t('doc_analyzer_invalid_file_type', 'Please upload PDF or TXT files only'));
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert(t('doc_analyzer_file_too_large', 'File size should be less than 10MB'));
      return;
    }
    
    setFile(selectedFile);
    setAnalysisResult(null);
  };

  const analyzeDocument = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/analyze-document', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAnalysisResult(result.analysis);
      } else {
        alert(t('doc_analyzer_error', 'Error analyzing document: ') + result.error);
      }
      
    } catch (error) {
      console.error('Document analysis error:', error);
      alert(t('doc_analyzer_network_error', 'Network error. Please try again.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'low': return <Eye className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('doc_analyzer_title', 'Prescription Analyzer')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {!file ? (
              // File Upload Area
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('doc_analyzer_upload_title', 'Upload Prescription')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('doc_analyzer_upload_desc', 'Drag and drop your prescription here, or click to browse')}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t('doc_analyzer_file_types', 'Supports PDF and TXT files (max 10MB)')}
                </p>
                
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  {t('doc_analyzer_browse', 'Browse Files')}
                </label>
              </div>
            ) : !analysisResult ? (
              // File Selected, Ready to Analyze
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{file.name}</h3>
                  <p className="text-gray-600">
                    {t('doc_analyzer_file_size', 'Size')}: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setFile(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('doc_analyzer_change_file', 'Change File')}
                  </button>
                  <button
                    onClick={analyzeDocument}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        {t('doc_analyzer_analyzing', 'Analyzing...')}
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        {t('doc_analyzer_analyze', 'Analyze Document')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Analysis Results
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {t('doc_analyzer_analysis_summary', 'Analysis Summary')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">
                        {t('doc_analyzer_document_length', 'Document Length')}:
                      </span>
                      <span className="ml-1 text-blue-700">
                        {analysisResult.text_length} {t('doc_analyzer_characters', 'characters')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">
                        {t('doc_analyzer_red_flags', 'Red Flags Found')}:
                      </span>
                      <span className="ml-1 text-blue-700">{analysisResult.red_flags_count}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">
                        {t('doc_analyzer_file_type', 'File Type')}:
                      </span>
                      <span className="ml-1 text-blue-700 uppercase">{analysisResult.file_type}</span>
                    </div>
                  </div>
                </div>

                {/* Red Flags */}
                {analysisResult.red_flags && analysisResult.red_flags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      {t('doc_analyzer_concerning_items', 'Concerning Items Found')}
                    </h3>
                    
                    {analysisResult.red_flags.map((flag, index) => (
                      <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(flag.severity)}`}>
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(flag.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{flag.type.replace('_', ' ')}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                flag.severity === 'high' ? 'bg-red-100 text-red-800' :
                                flag.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {flag.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm mb-2">
                              <strong>{t('doc_analyzer_found_text', 'Found')}:</strong> "{flag.text}"
                            </p>
                            <p className="text-sm">
                              <strong>{t('doc_analyzer_recommendation', 'Recommendation')}:</strong> {flag.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Analysis */}
                {analysisResult.ai_analysis && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {t('doc_analyzer_ai_analysis', 'AI Analysis')}
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                        {analysisResult.ai_analysis.ai_analysis}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">
                    {t('doc_analyzer_general_recommendations', 'General Recommendations')}
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      setFile(null);
                      setAnalysisResult(null);
                    }}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    {t('doc_analyzer_analyze_another', 'Analyze Another Document')}
                  </button>
                  
                  <button
                    onClick={() => {
                      const analysisText = JSON.stringify(analysisResult, null, 2);
                      const blob = new Blob([analysisText], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `analysis-${file.name}-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    {t('doc_analyzer_download_report', 'Download Report')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalyzer;
