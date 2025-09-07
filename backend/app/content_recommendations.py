# backend_/app/content_recommendations.py
import requests
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import re
from urllib.parse import quote
from dataclasses import dataclass, asdict

@dataclass
class HealthContent:
    title: str
    description: str
    url: str
    content_type: str  # video, article, interactive, podcast
    source: str
    duration: Optional[str]
    difficulty_level: str
    category: str
    rating: Optional[float]
    thumbnail_url: Optional[str]

class HealthContentRecommendationEngine:
    """
    Curated content recommendation system for health education.
    Integrates with YouTube Data API and health news sources.
    """
    
    def __init__(self, youtube_api_key: str = None):
        self.youtube_api_key = youtube_api_key
        
        # Predefined trusted health content sources
        self.trusted_sources = {
            "medical_organizations": [
                "Mayo Clinic",
                "Cleveland Clinic",
                "Johns Hopkins",
                "Harvard Medical School",
                "WebMD",
                "Healthline",
                "Medical News Today"
            ],
            "government_health": [
                "CDC",
                "NIH",
                "WHO",
                "FDA",
                "Indian Council of Medical Research",
                "Ministry of Health"
            ],
            "educational_channels": [
                "Crash Course",
                "Khan Academy",
                "TED-Ed",
                "Osmosis",
                "Doctor Mike",
                "Medscape"
            ]
        }
        
        # Health category mappings for better search
        self.category_keywords = {
            "nutrition": [
                "healthy eating", "diet", "nutrition facts", "vitamins", "minerals",
                "meal planning", "food safety", "dietary guidelines"
            ],
            "exercise_fitness": [
                "workout", "exercise", "fitness", "physical activity", "cardio",
                "strength training", "flexibility", "sports medicine"
            ],
            "mental_health": [
                "stress management", "anxiety", "depression", "mindfulness",
                "meditation", "mental wellness", "therapy", "psychology"
            ],
            "preventive_care": [
                "vaccination", "health screening", "preventive medicine", "checkup",
                "health maintenance", "disease prevention", "early detection"
            ],
            "chronic_diseases": [
                "diabetes management", "hypertension", "heart disease", "arthritis",
                "asthma", "chronic illness", "disease management"
            ],
            "emergency_care": [
                "first aid", "CPR", "emergency response", "life support",
                "emergency medicine", "trauma care", "safety"
            ]
        }

    def search_youtube_content(self, query: str, category: str = None, max_results: int = 10) -> List[HealthContent]:
        """Search YouTube for health-related educational content"""
        
        if not self.youtube_api_key:
            # Return mock data if no API key provided
            return self._get_mock_youtube_content(query, category)
        
        try:
            # Enhance query with category-specific keywords
            if category and category in self.category_keywords:
                enhanced_query = f"{query} {' OR '.join(self.category_keywords[category][:3])}"
            else:
                enhanced_query = query
            
            # Add educational and trusted source filters
            search_query = f"{enhanced_query} health education"
            
            # YouTube Data API v3 search
            search_url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                "part": "snippet",
                "q": search_query,
                "type": "video",
                "maxResults": max_results,
                "key": self.youtube_api_key,
                "regionCode": "IN",  # Focus on Indian content
                "relevanceLanguage": "en",
                "safeSearch": "strict",
                "videoDefinition": "high",
                "videoDuration": "medium"  # 4-20 minutes
            }
            
            response = requests.get(search_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            videos = []
            for item in data.get("items", []):
                snippet = item["snippet"]
                
                # Filter for trusted sources
                channel_title = snippet.get("channelTitle", "")
                if self._is_trusted_source(channel_title):
                    
                    video_id = item["id"]["videoId"]
                    video_details = self._get_video_details(video_id)
                    
                    videos.append(HealthContent(
                        title=snippet.get("title", ""),
                        description=snippet.get("description", "")[:200] + "...",
                        url=f"https://www.youtube.com/watch?v={video_id}",
                        content_type="video",
                        source=channel_title,
                        duration=video_details.get("duration", "Unknown"),
                        difficulty_level=self._determine_difficulty(snippet.get("title", "") + " " + snippet.get("description", "")),
                        category=category or "general",
                        rating=None,
                        thumbnail_url=snippet.get("thumbnails", {}).get("medium", {}).get("url")
                    ))
            
            return videos
            
        except Exception as e:
            print(f"Error searching YouTube content: {e}")
            return self._get_mock_youtube_content(query, category)

    def _get_video_details(self, video_id: str) -> Dict[str, Any]:
        """Get additional video details like duration"""
        try:
            details_url = "https://www.googleapis.com/youtube/v3/videos"
            params = {
                "part": "contentDetails,statistics",
                "id": video_id,
                "key": self.youtube_api_key
            }
            
            response = requests.get(details_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("items"):
                item = data["items"][0]
                duration = item.get("contentDetails", {}).get("duration", "")
                view_count = item.get("statistics", {}).get("viewCount", 0)
                
                # Convert ISO 8601 duration to readable format
                duration_readable = self._parse_youtube_duration(duration)
                
                return {
                    "duration": duration_readable,
                    "view_count": int(view_count) if view_count else 0
                }
        except Exception as e:
            print(f"Error getting video details: {e}")
        
        return {"duration": "Unknown", "view_count": 0}

    def _parse_youtube_duration(self, duration: str) -> str:
        """Parse YouTube ISO 8601 duration format"""
        if not duration:
            return "Unknown"
        
        # Example: PT4M13S -> 4:13
        match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
        if match:
            hours, minutes, seconds = match.groups()
            hours = int(hours) if hours else 0
            minutes = int(minutes) if minutes else 0
            seconds = int(seconds) if seconds else 0
            
            if hours:
                return f"{hours}:{minutes:02d}:{seconds:02d}"
            else:
                return f"{minutes}:{seconds:02d}"
        
        return "Unknown"

    def _is_trusted_source(self, channel_title: str) -> bool:
        """Check if the channel is from a trusted source"""
        channel_lower = channel_title.lower()
        
        for source_list in self.trusted_sources.values():
            for trusted_source in source_list:
                if trusted_source.lower() in channel_lower:
                    return True
        
        return False

    def _determine_difficulty(self, content_text: str) -> str:
        """Determine content difficulty level based on text analysis"""
        content_lower = content_text.lower()
        
        beginner_indicators = ["basic", "introduction", "beginner", "simple", "easy", "101", "fundamentals"]
        advanced_indicators = ["advanced", "complex", "in-depth", "detailed", "research", "clinical", "professional"]
        
        beginner_count = sum(1 for indicator in beginner_indicators if indicator in content_lower)
        advanced_count = sum(1 for indicator in advanced_indicators if indicator in content_lower)
        
        if advanced_count > beginner_count:
            return "advanced"
        elif beginner_count > 0:
            return "beginner"
        else:
            return "intermediate"

    def search_health_articles(self, query: str, category: str = None, max_results: int = 10) -> List[HealthContent]:
        """Search for health articles from trusted sources"""
        
        # Mock implementation - in production, integrate with Google News API or RSS feeds
        mock_articles = [
            HealthContent(
                title=f"Understanding {query.title()}: A Comprehensive Guide",
                description=f"Learn about {query} with this detailed guide covering causes, symptoms, treatment options, and prevention strategies.",
                url=f"https://www.mayoclinic.org/diseases-conditions/{query.replace(' ', '-').lower()}",
                content_type="article",
                source="Mayo Clinic",
                duration="15-20 min read",
                difficulty_level="intermediate",
                category=category or "general",
                rating=4.8,
                thumbnail_url=None
            ),
            HealthContent(
                title=f"{query.title()}: What You Need to Know",
                description=f"Expert insights on {query} including latest research, treatment advances, and practical advice for patients.",
                url=f"https://www.healthline.com/health/{query.replace(' ', '-').lower()}",
                content_type="article",
                source="Healthline",
                duration="10-15 min read",
                difficulty_level="beginner",
                category=category or "general",
                rating=4.6,
                thumbnail_url=None
            ),
            HealthContent(
                title=f"Clinical Guidelines for {query.title()}",
                description=f"Evidence-based clinical guidelines and recommendations for healthcare professionals treating {query}.",
                url=f"https://www.who.int/news-room/fact-sheets/detail/{query.replace(' ', '-').lower()}",
                content_type="article",
                source="WHO",
                duration="20-30 min read",
                difficulty_level="advanced",
                category=category or "general",
                rating=4.9,
                thumbnail_url=None
            )
        ]
        
        return mock_articles[:max_results]

    def _get_mock_youtube_content(self, query: str, category: str = None) -> List[HealthContent]:
        """Provide mock YouTube content when API is not available"""
        
        mock_videos = [
            HealthContent(
                title=f"Everything You Need to Know About {query.title()}",
                description=f"In this comprehensive video, we explore {query} covering symptoms, causes, treatments, and prevention strategies.",
                url=f"https://www.youtube.com/watch?v=mock_{query.replace(' ', '_')}",
                content_type="video",
                source="Doctor Mike",
                duration="12:34",
                difficulty_level="beginner",
                category=category or "general",
                rating=None,
                thumbnail_url="https://img.youtube.com/vi/mock/maxresdefault.jpg"
            ),
            HealthContent(
                title=f"{query.title()} Explained - Medical Animation",
                description=f"Detailed medical animation explaining {query} with 3D visuals and expert narration.",
                url=f"https://www.youtube.com/watch?v=anim_{query.replace(' ', '_')}",
                content_type="video",
                source="Osmosis",
                duration="8:45",
                difficulty_level="intermediate",
                category=category or "general",
                rating=None,
                thumbnail_url="https://img.youtube.com/vi/mock/maxresdefault.jpg"
            ),
            HealthContent(
                title=f"Living with {query.title()}: Patient Stories",
                description=f"Real patient experiences and coping strategies for managing {query} in daily life.",
                url=f"https://www.youtube.com/watch?v=story_{query.replace(' ', '_')}",
                content_type="video",
                source="Mayo Clinic",
                duration="15:22",
                difficulty_level="beginner",
                category=category or "general",
                rating=None,
                thumbnail_url="https://img.youtube.com/vi/mock/maxresdefault.jpg"
            )
        ]
        
        return mock_videos

    def get_personalized_recommendations(self, 
                                       knowledge_gaps: List[Dict[str, Any]], 
                                       user_preferences: Dict[str, Any] = None) -> List[HealthContent]:
        """Generate personalized content recommendations based on knowledge gaps"""
        
        recommendations = []
        user_preferences = user_preferences or {}
        
        # Extract user preferences
        preferred_content_type = user_preferences.get("content_type", ["video", "article"])
        preferred_difficulty = user_preferences.get("difficulty_level", "beginner")
        preferred_duration = user_preferences.get("max_duration", "medium")  # short, medium, long
        
        # Process each knowledge gap
        for gap in knowledge_gaps[:3]:  # Top 3 gaps
            topic = gap.get("topic", "")
            category = gap.get("category", "")
            
            if "video" in preferred_content_type:
                video_content = self.search_youtube_content(topic, category, max_results=2)
                recommendations.extend(video_content)
            
            if "article" in preferred_content_type:
                article_content = self.search_health_articles(topic, category, max_results=2)
                recommendations.extend(article_content)
        
        # Filter by user preferences
        filtered_recommendations = []
        for content in recommendations:
            if content.difficulty_level == preferred_difficulty or preferred_difficulty == "any":
                if self._matches_duration_preference(content.duration, preferred_duration):
                    filtered_recommendations.append(content)
        
        return filtered_recommendations

    def _matches_duration_preference(self, content_duration: str, preferred_duration: str) -> bool:
        """Check if content duration matches user preference"""
        if preferred_duration == "any":
            return True
        
        if not content_duration or content_duration == "Unknown":
            return True
        
        # Extract numeric duration
        duration_match = re.search(r'(\d+)', content_duration)
        if not duration_match:
            return True
        
        duration_minutes = int(duration_match.group(1))
        
        if preferred_duration == "short" and duration_minutes <= 5:
            return True
        elif preferred_duration == "medium" and 5 < duration_minutes <= 20:
            return True
        elif preferred_duration == "long" and duration_minutes > 20:
            return True
        
        return False

    def get_trending_health_topics(self) -> List[str]:
        """Get currently trending health topics"""
        
        # Mock trending topics - in production, this would come from health news APIs
        trending_topics = [
            "Mental Health Awareness",
            "Diabetes Prevention",
            "Heart Health",
            "Nutrition Guidelines 2024",
            "Exercise and Immunity",
            "Sleep Hygiene",
            "Stress Management Techniques",
            "Vaccine Updates",
            "Chronic Disease Management",
            "Healthy Aging"
        ]
        
        return trending_topics

# Global instance
content_engine = HealthContentRecommendationEngine()

# Convenience functions for API
def get_health_content_recommendations(topic: str, category: str = None, content_type: str = "video") -> List[Dict[str, Any]]:
    """Get content recommendations for a specific health topic"""
    
    if content_type == "video":
        content = content_engine.search_youtube_content(topic, category)
    elif content_type == "article":
        content = content_engine.search_health_articles(topic, category)
    else:
        video_content = content_engine.search_youtube_content(topic, category, max_results=3)
        article_content = content_engine.search_health_articles(topic, category, max_results=3)
        content = video_content + article_content
    
    return [asdict(item) for item in content]

def get_personalized_learning_content(knowledge_gaps: List[Dict[str, Any]], user_preferences: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """Get personalized learning content based on knowledge gaps"""
    
    content = content_engine.get_personalized_recommendations(knowledge_gaps, user_preferences)
    return [asdict(item) for item in content]
