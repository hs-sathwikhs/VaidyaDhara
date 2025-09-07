# backend_/app/knowledge_radar.py
import re
from typing import Dict, List, Any, Optional
from collections import defaultdict
from datetime import datetime, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dataclasses import dataclass, asdict
import json

@dataclass
class KnowledgeGap:
    topic: str
    category: str
    severity: str  # low, medium, high
    description: str
    recommended_resources: List[str]
    priority_score: float

@dataclass
class LearningRecommendation:
    topic: str
    resource_type: str  # video, article, interactive, quiz
    resource_url: Optional[str]
    description: str
    estimated_time: str
    difficulty_level: str

class HealthKnowledgeRadar:
    """
    Analyzes user interactions to identify knowledge gaps and recommend learning resources.
    Similar to a financial knowledge radar but focused on health literacy.
    """
    
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash-latest",
            temperature=0.3
        )
        
        # Define health knowledge categories
        self.knowledge_categories = {
            "nutrition": [
                "balanced diet", "vitamins", "minerals", "calories", "macronutrients",
                "portion control", "food safety", "dietary restrictions", "supplements"
            ],
            "exercise_fitness": [
                "cardiovascular health", "strength training", "flexibility", "endurance",
                "exercise frequency", "workout intensity", "recovery", "injury prevention"
            ],
            "mental_health": [
                "stress management", "anxiety", "depression", "sleep hygiene", "mindfulness",
                "work-life balance", "emotional wellbeing", "therapy", "medication"
            ],
            "preventive_care": [
                "vaccinations", "health screenings", "regular checkups", "risk factors",
                "early detection", "health insurance", "preventive measures"
            ],
            "chronic_diseases": [
                "diabetes", "hypertension", "heart disease", "arthritis", "asthma",
                "management strategies", "medication compliance", "lifestyle modifications"
            ],
            "emergency_care": [
                "first aid", "CPR", "emergency signs", "when to seek help",
                "emergency contacts", "basic life support", "accident prevention"
            ],
            "reproductive_health": [
                "family planning", "pregnancy", "sexual health", "contraception",
                "fertility", "menstrual health", "STD prevention"
            ],
            "substance_use": [
                "alcohol effects", "smoking cessation", "drug abuse", "addiction",
                "recovery resources", "harm reduction"
            ]
        }
        
        # Question patterns that indicate knowledge gaps
        self.gap_indicators = {
            "basic_concepts": [
                r"what is", r"define", r"explain", r"how does.*work",
                r"never heard of", r"don't understand", r"confused about"
            ],
            "misconceptions": [
                r"is it true that", r"someone told me", r"i heard",
                r"myth", r"misconception", r"false belief"
            ],
            "urgent_concerns": [
                r"should i be worried", r"is this serious", r"emergency",
                r"dangerous", r"life threatening", r"immediate help"
            ],
            "practical_application": [
                r"how do i", r"what should i do", r"when should i",
                r"practical steps", r"implementation", r"daily routine"
            ]
        }

    def analyze_user_query(self, query: str, category: str = None) -> Dict[str, Any]:
        """Analyze a single user query to identify knowledge gaps"""
        
        query_lower = query.lower()
        
        # Identify knowledge categories mentioned
        mentioned_categories = []
        for cat, keywords in self.knowledge_categories.items():
            if any(keyword in query_lower for keyword in keywords):
                mentioned_categories.append(cat)
        
        # Identify gap indicators
        gap_types = []
        for gap_type, patterns in self.gap_indicators.items():
            if any(re.search(pattern, query_lower) for pattern in patterns):
                gap_types.append(gap_type)
        
        # Calculate knowledge gap severity
        severity = "low"
        if "urgent_concerns" in gap_types:
            severity = "high"
        elif "basic_concepts" in gap_types or "misconceptions" in gap_types:
            severity = "medium"
        
        return {
            "query": query,
            "mentioned_categories": mentioned_categories,
            "gap_indicators": gap_types,
            "severity": severity,
            "timestamp": datetime.now().isoformat()
        }

    def analyze_conversation_history(self, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze conversation history to identify knowledge patterns"""
        
        user_messages = [msg for msg in messages if msg.get('role') == 'user']
        
        category_frequency = defaultdict(int)
        gap_pattern_frequency = defaultdict(int)
        total_gaps = []
        
        for message in user_messages:
            analysis = self.analyze_user_query(message.get('content', ''))
            
            # Count category mentions
            for category in analysis['mentioned_categories']:
                category_frequency[category] += 1
            
            # Count gap patterns
            for gap_type in analysis['gap_indicators']:
                gap_pattern_frequency[gap_type] += 1
            
            # Store individual gaps
            if analysis['mentioned_categories'] and analysis['gap_indicators']:
                total_gaps.append(analysis)
        
        return {
            "total_queries": len(user_messages),
            "category_frequency": dict(category_frequency),
            "gap_pattern_frequency": dict(gap_pattern_frequency),
            "identified_gaps": total_gaps,
            "analysis_timestamp": datetime.now().isoformat()
        }

    def generate_knowledge_gaps_with_ai(self, conversation_analysis: Dict[str, Any]) -> List[KnowledgeGap]:
        """Use AI to generate more sophisticated knowledge gap analysis"""
        
        prompt_template = """
        You are a health education expert analyzing user interactions to identify knowledge gaps.
        
        Based on the following conversation analysis, identify specific health knowledge gaps:
        
        Category Frequency: {category_freq}
        Gap Patterns: {gap_patterns}
        Recent Queries: {recent_queries}
        
        For each knowledge gap, provide:
        1. Specific topic area
        2. Category (nutrition, exercise, mental_health, etc.)
        3. Severity (low, medium, high)
        4. Description of the gap
        5. Recommended learning resources
        6. Priority score (0-100)
        
        Format your response as a JSON list of knowledge gaps.
        """
        
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["category_freq", "gap_patterns", "recent_queries"]
        )
        
        try:
            recent_queries = [gap['query'] for gap in conversation_analysis.get('identified_gaps', [])[-5:]]
            
            response = self.llm.invoke(prompt.format(
                category_freq=str(conversation_analysis.get('category_frequency', {})),
                gap_patterns=str(conversation_analysis.get('gap_pattern_frequency', {})),
                recent_queries=str(recent_queries)
            ))
            
            # Parse AI response (in a real implementation, you'd want more robust parsing)
            gaps_data = response.content
            
            # Create mock knowledge gaps based on analysis
            gaps = []
            
            # Generate gaps based on frequent categories with high gap indicators
            for category, frequency in conversation_analysis.get('category_frequency', {}).items():
                if frequency > 2:  # User asked about this category multiple times
                    gap_severity = "high" if frequency > 5 else "medium"
                    
                    gaps.append(KnowledgeGap(
                        topic=f"Understanding {category.replace('_', ' ').title()}",
                        category=category,
                        severity=gap_severity,
                        description=f"User shows repeated questions about {category.replace('_', ' ')}, indicating knowledge gaps in this area.",
                        recommended_resources=[
                            f"Basic {category.replace('_', ' ')} guide",
                            f"Interactive {category.replace('_', ' ')} course",
                            f"Expert consultation on {category.replace('_', ' ')}"
                        ],
                        priority_score=frequency * 10.0
                    ))
            
            return gaps
            
        except Exception as e:
            print(f"Error in AI knowledge gap analysis: {e}")
            return []

    def generate_learning_recommendations(self, knowledge_gaps: List[KnowledgeGap]) -> List[LearningRecommendation]:
        """Generate personalized learning recommendations based on knowledge gaps"""
        
        recommendations = []
        
        # Sort gaps by priority
        sorted_gaps = sorted(knowledge_gaps, key=lambda x: x.priority_score, reverse=True)
        
        for gap in sorted_gaps[:5]:  # Top 5 priority gaps
            # Generate different types of recommendations
            recommendations.extend([
                LearningRecommendation(
                    topic=gap.topic,
                    resource_type="video",
                    resource_url=None,  # Will be populated by content recommendation system
                    description=f"Educational video about {gap.topic.lower()}",
                    estimated_time="10-15 minutes",
                    difficulty_level="beginner" if gap.severity == "high" else "intermediate"
                ),
                LearningRecommendation(
                    topic=gap.topic,
                    resource_type="interactive",
                    resource_url=None,
                    description=f"Interactive quiz and exercises for {gap.topic.lower()}",
                    estimated_time="20-30 minutes",
                    difficulty_level="beginner" if gap.severity == "high" else "intermediate"
                )
            ])
        
        return recommendations

    def get_user_knowledge_profile(self, user_id: str, conversation_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate comprehensive knowledge profile for a user"""
        
        conversation_analysis = self.analyze_conversation_history(conversation_history)
        knowledge_gaps = self.generate_knowledge_gaps_with_ai(conversation_analysis)
        learning_recommendations = self.generate_learning_recommendations(knowledge_gaps)
        
        # Calculate knowledge scores by category
        knowledge_scores = {}
        for category in self.knowledge_categories.keys():
            frequency = conversation_analysis.get('category_frequency', {}).get(category, 0)
            gap_count = len([gap for gap in knowledge_gaps if gap.category == category])
            
            # Higher frequency of questions might indicate either interest or lack of knowledge
            # We'll use gap count as the primary indicator
            base_score = max(0, 100 - (gap_count * 20))
            knowledge_scores[category] = min(100, base_score)
        
        # Calculate overall health literacy score
        overall_score = sum(knowledge_scores.values()) / len(knowledge_scores) if knowledge_scores else 0
        
        return {
            "user_id": user_id,
            "overall_health_literacy_score": round(overall_score, 1),
            "category_scores": knowledge_scores,
            "identified_knowledge_gaps": [asdict(gap) for gap in knowledge_gaps],
            "learning_recommendations": [asdict(rec) for rec in learning_recommendations],
            "conversation_analysis": conversation_analysis,
            "last_updated": datetime.now().isoformat(),
            "improvement_suggestions": [
                "Focus on high-priority knowledge gaps first",
                "Practice applying health knowledge in daily life",
                "Engage with interactive learning content regularly",
                "Consult healthcare professionals for personalized guidance"
            ]
        }

# Global instance
knowledge_radar = HealthKnowledgeRadar()

# Convenience functions for API
def analyze_user_knowledge(user_id: str, conversation_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze user's health knowledge and identify gaps"""
    return knowledge_radar.get_user_knowledge_profile(user_id, conversation_history)

def get_learning_recommendations(user_id: str, conversation_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Get personalized learning recommendations"""
    profile = knowledge_radar.get_user_knowledge_profile(user_id, conversation_history)
    return profile.get('learning_recommendations', [])
