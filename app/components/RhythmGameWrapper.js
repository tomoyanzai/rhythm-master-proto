// app/components/RhythmGameWrapper.js

"use client";

import { useState, useCallback, useEffect } from "react";
import RhythmGame from "./RhythmGame";

export default function RhythmGameWrapper() {
  const generatePattern = useCallback(() => {
    return Array(4)
      .fill()
      .map(() => (Math.random() > 0.5 ? 1 : 0));
  }, []);

  const [pattern, setPattern] = useState(() => generatePattern());
  const [previousScore, setPreviousScore] = useState(null);

  const handleNewPattern = useCallback(() => {
    setPattern(generatePattern());
  }, [generatePattern]);

  const handleGameEnd = useCallback(async (score) => {
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        console.log("Score saved successfully");
        setPreviousScore(score);
      } else {
        console.error("Failed to save score");
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  }, []);

  useEffect(() => {
    const fetchPreviousScore = async () => {
      try {
        const response = await fetch("/api/scores");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setPreviousScore(data[0].score);
          }
        } else {
          console.error("Failed to fetch previous score");
        }
      } catch (error) {
        console.error("Error fetching previous score:", error);
      }
    };

    fetchPreviousScore();
  }, []);

  return (
    <div>
      {previousScore !== null && (
        <div className="mb-4 text-lg">
          Previous Score: <span className="font-bold">{previousScore}%</span>
        </div>
      )}
      <RhythmGame
        pattern={pattern}
        onNewPattern={handleNewPattern}
        onGameEnd={handleGameEnd}
      />
    </div>
  );
}
