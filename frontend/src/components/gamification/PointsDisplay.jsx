import React, { useState, useEffect } from 'react';
import './PointsDisplay.css';

const PointsDisplay = ({ 
  points = 0, 
  isCompact = false,
  showAnimation = true,
  level = 1,
  nextLevelPoints = 200
}) => {
  const [displayPoints, setDisplayPoints] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate point changes
  useEffect(() => {
    if (showAnimation && points !== displayPoints) {
      setIsAnimating(true);
      const duration = 1000;
      const steps = 30;
      const increment = (points - displayPoints) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayPoints(points);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setDisplayPoints(Math.floor(displayPoints + increment * currentStep));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayPoints(points);
    }
  }, [points, displayPoints, showAnimation]);

  const progressToNextLevel = Math.min((points % nextLevelPoints) / nextLevelPoints * 100, 100);

  if (isCompact) {
    return (
      <div className="points-display compact">
        <div className="points-badge">
          <span className="points-icon">💎</span>
          <span className="points-value">{displayPoints.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="points-display">
      <div className="points-header">
        <h3 className="points-title">Your Health Points</h3>
        <div className="level-badge">
          Level {level}
        </div>
      </div>

      <div className="points-main">
        <div className="points-circle">
          <div className="points-inner">
            <span className="points-icon">💎</span>
            <span className={`points-value ${isAnimating ? 'animating' : ''}`}>
              {displayPoints.toLocaleString()}
            </span>
            <span className="points-label">Points</span>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress to Level {level + 1}</span>
          <span className="progress-points">
            {points % nextLevelPoints} / {nextLevelPoints}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressToNextLevel}%` }}
          ></div>
        </div>
      </div>

      <div className="points-actions">
        <button className="earn-points-btn">
          🎯 Earn More Points
        </button>
      </div>
    </div>
  );
};

export default PointsDisplay;
