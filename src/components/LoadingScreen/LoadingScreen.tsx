/**
 * LoadingScreen component with randomized letters animation
 * Similar to OTHR's MITA loader but displays HWMG
 */

import React, { useEffect, useState, useRef } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  minLoadingTime?: number;
}

const TARGET_LETTERS = ['H', 'W', 'M', 'G'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Loading screen with randomized letters that settle on HWMG
 * @param isLoading - Whether the loading screen should be visible
 * @param onLoadingComplete - Callback when loading is complete
 * @param minLoadingTime - Minimum time to show loading screen (ms)
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  onLoadingComplete,
  minLoadingTime = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const [letters, setLetters] = useState<string[]>(['?', '?', '?', '?']);
  const [isSettled, setIsSettled] = useState(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [expansionComplete, setExpansionComplete] = useState(false);
  const expansionStartedRef = useRef(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      setLetters(['?', '?', '?', '?']);
      setIsSettled(false);
      setDisplayText('');
      setExpansionComplete(false);
      expansionStartedRef.current = false;
    }
    // Don't set isVisible to false here - let it be controlled by expansionComplete
  }, [isLoading]);

  // Progress bar animation - continues until expansion completes
  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    // Calculate total time: settle time + expansion stages + final display
    const settleTime = minLoadingTime * 0.7;
    const expansionTime = 500 + (400 * 4) + 300 + 500; // All expansion stages + final display
    const duration = Math.max(minLoadingTime, settleTime + expansionTime);

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      // Keep updating until expansion completes or reaches 100%
      if (newProgress < 100 && !expansionComplete) {
        requestAnimationFrame(updateProgress);
      } else if (newProgress < 100 && expansionComplete) {
        setProgress(100);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [isVisible, minLoadingTime, expansionComplete]);

  // Random letter cycling animation - runs until settled
  useEffect(() => {
    if (isSettled) return;
    if (!isVisible) return;

    const settleTime = minLoadingTime * 0.7; // Start settling at 70% of loading time
    const letterInterval = 50; // Change letters every 50ms
    let letterCycles = 0;
    const maxCycles = settleTime / letterInterval;

    const letterIntervalId = setInterval(() => {
      letterCycles++;
      
      if (letterCycles >= maxCycles) {
        // Settle on final letters
        setLetters(TARGET_LETTERS);
        setIsSettled(true);
        setDisplayText('HWMG');
        clearInterval(letterIntervalId);
      } else {
        // Show random letters
        setLetters(
          TARGET_LETTERS.map(() => 
            ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
          )
        );
      }
    }, letterInterval);

    return () => clearInterval(letterIntervalId);
  }, [isVisible, isSettled, minLoadingTime]);

  // Expansion animation after HWMG is settled - runs independently of isLoading
  useEffect(() => {
    if (!isSettled || expansionStartedRef.current) return;
    
    // Ensure screen stays visible during expansion
    setIsVisible(true);
    expansionStartedRef.current = true;

    // Expansion stages: [H, W, M, G] with random letters between
    const stages = [
      { pattern: [0, 0, 0, 0], duration: 500 }, // HWMG
      { pattern: [1, 1, 1, 1], duration: 400 }, // HxWxMxGx
      { pattern: [2, 2, 3, 2], duration: 400 }, // HxxWxxMxxxGxx
      { pattern: [3, 2, 4, 3], duration: 400 }, // HxxxWxxMxxxxGxxx
      { pattern: [3, 2, 4, 4], duration: 400 }, // HxxxWxxMxxxxGxxxx
    ];

    let currentStage = 0;
    let stageStartTime = Date.now();
    const randomizeInterval = 80; // Change random letters every 80ms

    const generateText = (stage: typeof stages[0]) => {
      const mainLetters = ['H', 'W', 'M', 'G'];
      let text = '';
      
      for (let i = 0; i < mainLetters.length; i++) {
        text += mainLetters[i];
        // Add random letters
        for (let j = 0; j < stage.pattern[i]; j++) {
          text += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
      }
      
      return text;
    };

    const randomizeIntervalId = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        const elapsed = Date.now() - stageStartTime;
        
        if (elapsed >= stage.duration) {
          // Move to next stage
          currentStage++;
          if (currentStage < stages.length) {
            stageStartTime = Date.now();
          } else if (currentStage === stages.length) {
            // Transition to full text without spaces
            setDisplayText('HARDWEYMUSICGROUP');
            setTimeout(() => {
              // Final stage with spaces
              setDisplayText('HARDWEY MUSIC GROUP');
              // Mark expansion as complete after showing final text
              setTimeout(() => {
                setExpansionComplete(true);
              }, 500);
            }, 300);
            clearInterval(randomizeIntervalId);
            return;
          }
        }
        
        if (currentStage < stages.length) {
          const currentStageData = stages[currentStage];
          // For stage 0, just show HWMG without randomizing
          if (currentStage === 0) {
            setDisplayText('HWMG');
          } else {
            setDisplayText(generateText(currentStageData));
          }
        }
      }
    }, randomizeInterval);

    return () => clearInterval(randomizeIntervalId);
  }, [isSettled]);

  // Prevent closing during expansion - keep visible until expansion completes
  useEffect(() => {
    // Always keep visible if expansion hasn't completed yet
    if (!expansionComplete && isSettled) {
      setIsVisible(true);
    }
  }, [expansionComplete, isSettled]);

  // Close loading screen only after expansion completes
  useEffect(() => {
    // Only close if expansion is complete
    if (expansionComplete) {
      // Small delay to show final text, then exit
      const timer = setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [expansionComplete, onLoadingComplete]);

  if (!isVisible) return null;

  // Keep visible until expansion completes
  const shouldShowExit = expansionComplete;
  
  return (
    <div className={`${styles.loadingScreen} ${shouldShowExit ? styles.loadingScreenExit : ''}`}>
      {/* Loading Content */}
      <div className={styles.loadingContent}>
        {/* HWMG Text with Random Letters */}
        <div className={styles.hwmgTextContainer}>
          <h1 className={styles.hwmgText}>
            {isSettled && displayText ? (
              <span className={styles.expandedText}>
                {displayText.split('').map((char, index) => (
                  <span 
                    key={index}
                    className={char === ' ' ? styles.space : ''}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ) : (
              letters.map((letter, index) => (
                <span 
                  key={index} 
                  className={`${styles.hwmgLetter} ${isSettled ? styles.settled : ''}`}
                >
                  {letter}
                </span>
              ))
            )}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className={styles.progressText}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Loading Text */}
        <p className={styles.loadingLabel}>LOADING: MUSIC IS THE ANSWER™</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
