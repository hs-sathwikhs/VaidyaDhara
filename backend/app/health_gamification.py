# backend_/app/health_gamification.py
import random
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json
from dataclasses import dataclass, asdict
from enum import Enum

class DifficultyLevel(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class HealthCategory(Enum):
    NUTRITION = "nutrition"
    EXERCISE = "exercise"
    MENTAL_HEALTH = "mental_health"
    PREVENTIVE_CARE = "preventive_care"
    DISEASE_MANAGEMENT = "disease_management"
    EMERGENCY_CARE = "emergency_care"

@dataclass
class HealthScenario:
    id: str
    category: HealthCategory
    difficulty: DifficultyLevel
    title: str
    description: str
    situation: str
    options: List[Dict[str, Any]]  # Each option has: text, points, health_impact, feedback
    correct_option: int
    explanation: str
    learning_points: List[str]

@dataclass
class UserProgress:
    user_id: str
    total_points: int
    level: int
    scenarios_completed: List[str]
    achievements: List[str]
    health_knowledge_score: Dict[str, int]  # Category-wise scores
    streak_days: int
    last_activity: datetime

class HealthGameEngine:
    """
    Gamification engine for health education and decision making.
    Similar to BitLife but focused on health decisions.
    """
    
    def __init__(self):
        self.scenarios = self._load_health_scenarios()
        self.achievements = self._define_achievements()
        
    def _load_health_scenarios(self) -> List[HealthScenario]:
        """Load predefined health scenarios"""
        scenarios = [
            HealthScenario(
                id="nutrition_001",
                category=HealthCategory.NUTRITION,
                difficulty=DifficultyLevel.EASY,
                title="Healthy Breakfast Choice",
                description="You're rushing to work and need to grab breakfast quickly.",
                situation="You have 5 minutes before leaving for work. What's the healthiest breakfast option?",
                options=[
                    {
                        "text": "Skip breakfast entirely",
                        "points": -10,
                        "health_impact": -5,
                        "feedback": "Skipping breakfast can slow your metabolism and cause overeating later."
                    },
                    {
                        "text": "Grab a donut and coffee",
                        "points": -5,
                        "health_impact": -3,
                        "feedback": "High sugar and processed foods can cause energy crashes."
                    },
                    {
                        "text": "Have a banana and yogurt",
                        "points": 15,
                        "health_impact": 8,
                        "feedback": "Great choice! This provides protein, fiber, and natural sugars for sustained energy."
                    },
                    {
                        "text": "Make a quick smoothie with fruits and protein powder",
                        "points": 20,
                        "health_impact": 10,
                        "feedback": "Excellent! A balanced smoothie provides nutrients and is easy to consume on-the-go."
                    }
                ],
                correct_option=3,
                explanation="A quick smoothie combines convenience with nutrition, providing essential vitamins, minerals, and protein to start your day right.",
                learning_points=[
                    "Never skip breakfast - it jumpstarts your metabolism",
                    "Combine protein and fiber for sustained energy",
                    "Plan quick healthy options for busy mornings"
                ]
            ),
            
            HealthScenario(
                id="exercise_001",
                category=HealthCategory.EXERCISE,
                difficulty=DifficultyLevel.MEDIUM,
                title="Exercise with Limited Time",
                description="You have only 20 minutes free time today.",
                situation="You want to stay active but only have 20 minutes. What's the most effective approach?",
                options=[
                    {
                        "text": "Watch TV and rest",
                        "points": -5,
                        "health_impact": -2,
                        "feedback": "Missing exercise opportunities can impact your fitness goals."
                    },
                    {
                        "text": "Do light stretching for 20 minutes",
                        "points": 10,
                        "health_impact": 5,
                        "feedback": "Good choice for flexibility, but you could get more cardiovascular benefits."
                    },
                    {
                        "text": "High-intensity interval training (HIIT) for 15 minutes",
                        "points": 25,
                        "health_impact": 15,
                        "feedback": "Excellent! HIIT maximizes benefits in minimal time, boosting metabolism for hours."
                    },
                    {
                        "text": "Go for a leisurely 20-minute walk",
                        "points": 15,
                        "health_impact": 8,
                        "feedback": "Great for mental health and moderate exercise, especially if done regularly."
                    }
                ],
                correct_option=2,
                explanation="HIIT workouts are scientifically proven to provide maximum health benefits in short time periods, improving cardiovascular health and burning calories efficiently.",
                learning_points=[
                    "Short, intense workouts can be more effective than longer, moderate ones",
                    "Consistency matters more than duration",
                    "Any movement is better than no movement"
                ]
            ),
            
            HealthScenario(
                id="mental_health_001",
                category=HealthCategory.MENTAL_HEALTH,
                difficulty=DifficultyLevel.MEDIUM,
                title="Stress Management",
                description="You're feeling overwhelmed with work deadlines and personal responsibilities.",
                situation="Your stress levels are high and affecting your sleep. What's the best immediate action?",
                options=[
                    {
                        "text": "Work longer hours to get everything done",
                        "points": -15,
                        "health_impact": -10,
                        "feedback": "This will likely increase stress and harm your health in the long run."
                    },
                    {
                        "text": "Have a few drinks to relax",
                        "points": -10,
                        "health_impact": -8,
                        "feedback": "Alcohol may provide temporary relief but can worsen sleep quality and increase anxiety."
                    },
                    {
                        "text": "Practice deep breathing or meditation for 10 minutes",
                        "points": 20,
                        "health_impact": 12,
                        "feedback": "Excellent! Mindfulness practices activate the parasympathetic nervous system, reducing stress hormones."
                    },
                    {
                        "text": "Call a friend or family member to talk",
                        "points": 18,
                        "health_impact": 10,
                        "feedback": "Great choice! Social support is crucial for mental health and stress management."
                    }
                ],
                correct_option=2,
                explanation="Deep breathing and meditation have immediate physiological effects on stress, lowering cortisol levels and heart rate.",
                learning_points=[
                    "Stress management is a skill that improves with practice",
                    "Short mindfulness sessions can have immediate benefits",
                    "Avoiding stress through unhealthy habits creates more problems"
                ]
            ),
            
            HealthScenario(
                id="preventive_001",
                category=HealthCategory.PREVENTIVE_CARE,
                difficulty=DifficultyLevel.HARD,
                title="Health Screening Decision",
                description="You're 35 years old with a family history of heart disease.",
                situation="Your doctor recommends a comprehensive health screening. You feel fine and it's expensive. What do you do?",
                options=[
                    {
                        "text": "Skip it since you feel healthy",
                        "points": -20,
                        "health_impact": -15,
                        "feedback": "Many serious conditions have no early symptoms. Prevention is always better than treatment."
                    },
                    {
                        "text": "Wait until you have symptoms",
                        "points": -15,
                        "health_impact": -12,
                        "feedback": "By the time symptoms appear, conditions may be advanced and harder to treat."
                    },
                    {
                        "text": "Get the screening but only the basic tests",
                        "points": 10,
                        "health_impact": 7,
                        "feedback": "Better than nothing, but comprehensive screening is more effective for early detection."
                    },
                    {
                        "text": "Get the full comprehensive screening",
                        "points": 30,
                        "health_impact": 20,
                        "feedback": "Excellent choice! Early detection can prevent serious complications and save lives and money long-term."
                    }
                ],
                correct_option=3,
                explanation="With family history of heart disease, comprehensive screening can detect early warning signs, allowing for lifestyle changes or treatments that can prevent serious complications.",
                learning_points=[
                    "Family history significantly increases disease risk",
                    "Prevention costs less than treatment",
                    "Many serious conditions are asymptomatic in early stages",
                    "Investment in health screening pays long-term dividends"
                ]
            )
        ]
        return scenarios
    
    def _define_achievements(self) -> Dict[str, Dict[str, Any]]:
        """Define achievement system"""
        return {
            "first_scenario": {
                "name": "Health Journey Begins",
                "description": "Complete your first health scenario",
                "points": 50,
                "icon": "🏃‍♂️"
            },
            "nutrition_master": {
                "name": "Nutrition Master",
                "description": "Score perfectly on 5 nutrition scenarios",
                "points": 200,
                "icon": "🥗"
            },
            "exercise_enthusiast": {
                "name": "Exercise Enthusiast",
                "description": "Complete 10 exercise scenarios",
                "points": 300,
                "icon": "💪"
            },
            "mindfulness_guru": {
                "name": "Mindfulness Guru",
                "description": "Excel in mental health scenarios",
                "points": 250,
                "icon": "🧘‍♀️"
            },
            "prevention_champion": {
                "name": "Prevention Champion",
                "description": "Complete all preventive care scenarios perfectly",
                "points": 400,
                "icon": "🏥"
            },
            "streak_master": {
                "name": "Consistency King/Queen",
                "description": "Maintain a 7-day activity streak",
                "points": 500,
                "icon": "🔥"
            },
            "knowledge_seeker": {
                "name": "Health Knowledge Seeker",
                "description": "Reach 1000 total points",
                "points": 100,
                "icon": "📚"
            }
        }
    
    def get_random_scenario(self, 
                           category: Optional[HealthCategory] = None, 
                           difficulty: Optional[DifficultyLevel] = None,
                           exclude_completed: List[str] = None) -> HealthScenario:
        """Get a random scenario based on criteria"""
        
        available_scenarios = self.scenarios.copy()
        
        # Filter by category
        if category:
            available_scenarios = [s for s in available_scenarios if s.category == category]
        
        # Filter by difficulty
        if difficulty:
            available_scenarios = [s for s in available_scenarios if s.difficulty == difficulty]
        
        # Exclude completed scenarios
        if exclude_completed:
            available_scenarios = [s for s in available_scenarios if s.id not in exclude_completed]
        
        if not available_scenarios:
            return None
        
        return random.choice(available_scenarios)
    
    def evaluate_choice(self, scenario: HealthScenario, choice_index: int) -> Dict[str, Any]:
        """Evaluate user's choice in a scenario"""
        
        if choice_index < 0 or choice_index >= len(scenario.options):
            return {
                "valid": False,
                "error": "Invalid choice index"
            }
        
        chosen_option = scenario.options[choice_index]
        is_correct = choice_index == scenario.correct_option
        
        return {
            "valid": True,
            "is_correct": is_correct,
            "points_earned": chosen_option["points"],
            "health_impact": chosen_option["health_impact"],
            "feedback": chosen_option["feedback"],
            "explanation": scenario.explanation if is_correct else f"The best choice was: {scenario.options[scenario.correct_option]['text']}",
            "learning_points": scenario.learning_points,
            "scenario_completed": scenario.id
        }
    
    def update_user_progress(self, user_id: str, scenario_result: Dict[str, Any]) -> UserProgress:
        """Update user progress after completing a scenario"""
        # This would typically interface with a database
        # For now, we'll return a mock progress update
        
        return UserProgress(
            user_id=user_id,
            total_points=scenario_result["points_earned"],
            level=1,  # Calculate based on points
            scenarios_completed=[scenario_result["scenario_completed"]],
            achievements=[],
            health_knowledge_score={"total": scenario_result["points_earned"]},
            streak_days=1,
            last_activity=datetime.now()
        )
    
    def get_personalized_recommendations(self, user_progress: UserProgress) -> List[str]:
        """Get personalized health recommendations based on user progress"""
        
        recommendations = []
        
        # Analyze weak areas
        if user_progress.health_knowledge_score.get("nutrition", 0) < 100:
            recommendations.append("Focus on nutrition scenarios to improve your dietary knowledge")
        
        if user_progress.health_knowledge_score.get("exercise", 0) < 100:
            recommendations.append("Try more exercise scenarios to learn about fitness")
        
        if user_progress.streak_days < 7:
            recommendations.append("Aim for daily health learning to build a healthy habit")
        
        # General recommendations
        recommendations.extend([
            "Practice what you learn in real life for maximum benefit",
            "Share health knowledge with friends and family",
            "Consult healthcare professionals for personalized advice"
        ])
        
        return recommendations

# Global instance
health_game = HealthGameEngine()

# Convenience functions for API endpoints
def get_health_scenario(category: str = None, difficulty: str = None, user_id: str = None) -> Dict[str, Any]:
    """Get a health scenario for gameplay"""
    
    cat_enum = None
    if category:
        try:
            cat_enum = HealthCategory(category.lower())
        except ValueError:
            pass
    
    diff_enum = None
    if difficulty:
        try:
            diff_enum = DifficultyLevel(difficulty.lower())
        except ValueError:
            pass
    
    scenario = health_game.get_random_scenario(cat_enum, diff_enum)
    
    if not scenario:
        return {"error": "No scenarios available with the specified criteria"}
    
    return {
        "success": True,
        "scenario": asdict(scenario)
    }

def submit_scenario_choice(scenario_id: str, choice_index: int, user_id: str = None) -> Dict[str, Any]:
    """Submit user's choice for a scenario"""
    
    # Find the scenario
    scenario = next((s for s in health_game.scenarios if s.id == scenario_id), None)
    
    if not scenario:
        return {"error": "Scenario not found"}
    
    result = health_game.evaluate_choice(scenario, choice_index)
    
    if not result["valid"]:
        return {"error": result["error"]}
    
    return {
        "success": True,
        "result": result
    }
