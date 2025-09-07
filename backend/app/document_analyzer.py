# backend_/app/document_analyzer.py
import os
from typing import List, Dict, Any
import PyPDF2
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

class MedicalDocumentAnalyzer:
    """
    Medical Document Analyzer for detecting concerning clauses, 
    medication interactions, and providing health document insights.
    """
    
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash-latest", 
            temperature=0.1  # Low temperature for consistent analysis
        )
        
        # Define concerning patterns in medical documents
        self.red_flag_patterns = [
            r"experimental\s+treatment",
            r"not\s+fda\s+approved",
            r"side\s+effects\s+may\s+include\s+death",
            r"no\s+warranty",
            r"use\s+at\s+your\s+own\s+risk",
            r"off-label\s+use",
            r"contraindicated\s+with",
            r"may\s+cause\s+severe",
            r"permanent\s+damage",
            r"irreversible\s+effects"
        ]
        
        # Common drug interactions to flag
        self.interaction_patterns = [
            r"warfarin",
            r"lithium",
            r"digoxin",
            r"phenytoin",
            r"cyclosporine",
            r"theophylline"
        ]

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            raise Exception(f"Error extracting PDF text: {str(e)}")

    def extract_text_from_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise Exception(f"Error reading text file: {str(e)}")

    def detect_red_flags(self, text: str) -> List[Dict[str, Any]]:
        """Detect concerning patterns in medical documents"""
        red_flags = []
        
        # Check for red flag patterns
        for pattern in self.red_flag_patterns:
            matches = re.finditer(pattern, text.lower(), re.IGNORECASE)
            for match in matches:
                red_flags.append({
                    "type": "warning",
                    "pattern": pattern,
                    "text": match.group(),
                    "position": match.start(),
                    "severity": "high",
                    "recommendation": "Consult with a qualified medical professional before proceeding"
                })
        
        # Check for drug interactions
        for pattern in self.interaction_patterns:
            matches = re.finditer(pattern, text.lower(), re.IGNORECASE)
            for match in matches:
                red_flags.append({
                    "type": "drug_interaction",
                    "pattern": pattern,
                    "text": match.group(),
                    "position": match.start(),
                    "severity": "medium",
                    "recommendation": "Check for potential drug interactions with your current medications"
                })
        
        return red_flags

    def analyze_document_with_ai(self, text: str) -> Dict[str, Any]:
        """Use AI to analyze medical document for concerning content"""
        
        prompt_template = """
        You are a medical document analysis expert. Analyze the following medical document text and provide:

        1. Summary of the document
        2. Any concerning clauses or statements that patients should be aware of
        3. Potential risks or side effects mentioned
        4. Recommendations for the patient
        5. Whether this document requires immediate medical consultation

        Document Text:
        {document_text}

        Provide your analysis in the following JSON-like format:
        {{
            "summary": "Brief summary of the document",
            "concerning_clauses": ["List of concerning statements"],
            "risks_mentioned": ["List of risks or side effects"],
            "recommendations": ["List of recommendations for the patient"],
            "requires_consultation": true/false,
            "severity_level": "low/medium/high"
        }}
        """
        
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["document_text"]
        )
        
        try:
            # Truncate text if too long to avoid token limits
            truncated_text = text[:8000] if len(text) > 8000 else text
            
            response = self.llm.invoke(prompt.format(document_text=truncated_text))
            return {
                "ai_analysis": response.content,
                "document_length": len(text),
                "truncated": len(text) > 8000
            }
        except Exception as e:
            return {
                "ai_analysis": f"Error in AI analysis: {str(e)}",
                "document_length": len(text),
                "truncated": False
            }

    def analyze_medical_document(self, file_path: str, file_type: str = "auto") -> Dict[str, Any]:
        """
        Main function to analyze medical document
        
        Args:
            file_path: Path to the document file
            file_type: Type of file ('pdf', 'txt', 'auto')
        
        Returns:
            Dictionary containing analysis results
        """
        
        try:
            # Determine file type
            if file_type == "auto":
                if file_path.lower().endswith('.pdf'):
                    file_type = "pdf"
                elif file_path.lower().endswith('.txt'):
                    file_type = "txt"
                else:
                    raise Exception("Unsupported file type. Please use PDF or TXT files.")
            
            # Extract text
            if file_type == "pdf":
                text = self.extract_text_from_pdf(file_path)
            elif file_type == "txt":
                text = self.extract_text_from_txt(file_path)
            else:
                raise Exception("Unsupported file type")
            
            # Perform analysis
            red_flags = self.detect_red_flags(text)
            ai_analysis = self.analyze_document_with_ai(text)
            
            return {
                "success": True,
                "file_path": file_path,
                "file_type": file_type,
                "text_length": len(text),
                "red_flags_count": len(red_flags),
                "red_flags": red_flags,
                "ai_analysis": ai_analysis,
                "recommendations": [
                    "Always consult with a qualified healthcare professional",
                    "Discuss any concerns about this document with your doctor",
                    "Keep a copy of this analysis for your medical records",
                    "Report any adverse effects immediately to your healthcare provider"
                ]
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "recommendations": [
                    "Please try uploading the document again",
                    "Ensure the document is in PDF or TXT format",
                    "Consult with a healthcare professional for document review"
                ]
            }

# Global instance
document_analyzer = MedicalDocumentAnalyzer()

def analyze_medical_document(file_path: str, file_type: str = "auto") -> Dict[str, Any]:
    """Wrapper function for easy import"""
    return document_analyzer.analyze_medical_document(file_path, file_type)
