// app/components/RhythmGame.js

"use client";

import { useState, useCallback, useEffect } from "react";

export default function RhythmGame({ pattern, onNewPattern, onGameEnd }) {
  const [userInput, setUserInput] = useState([]);
  const [score, setScore] = useState(null);
  const [gameState, setGameState] = useState("idle");
  const [currentBeat, setCurrentBeat] = useState(-1);

  const playSound = (frequency, duration) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playPattern = useCallback(() => {
    setGameState("playing");
    setUserInput([]);
    setScore(null);
    setCurrentBeat(-1);

    const playBeat = (index) => {
      setCurrentBeat(index);
      if (pattern[index]) {
        playSound(300, 0.1);
      } else {
        playSound(200, 0.05);
      }

      if (index < pattern.length - 1) {
        setTimeout(() => playBeat(index + 1), 500);
      } else {
        setTimeout(() => {
          setCurrentBeat(-1);
          setGameState("playerTurn");
        }, 500);
      }
    };

    playBeat(0);
  }, [pattern]);

  const handleInput = (input) => {
    if (gameState !== "playerTurn") return;

    if (userInput.length < pattern.length) {
      const newInput = [...userInput, input];
      setUserInput(newInput);
      if (input === 1) {
        playSound(400, 0.1);
      }

      if (newInput.length === pattern.length) {
        calculateScore(newInput);
        setGameState("finished");
      }
    }
  };

  const calculateScore = useCallback(
    (input) => {
      const matchCount = input.reduce(
        (acc, val, idx) => acc + (val === pattern[idx] ? 1 : 0),
        0
      );
      const accuracy = (matchCount / pattern.length) * 100;
      const newScore = Math.round(accuracy);
      setScore(newScore);
      if (onGameEnd) {
        onGameEnd(newScore);
      }
    },
    [pattern, onGameEnd]
  );

  useEffect(() => {
    if (gameState === "idle") {
      setUserInput([]);
      setScore(null);
    }
  }, [gameState]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Rhythm Master</h1>

      {/* パターン表示 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pattern:</h2>
        <div className="flex justify-center space-x-2">
          {pattern.map((beat, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full transition-colors duration-200 ${
                beat
                  ? currentBeat === index
                    ? "bg-blue-300"
                    : "bg-blue-500"
                  : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* ユーザー入力表示 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Input:</h2>
        <div className="flex justify-center space-x-2">
          {userInput.map((beat, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full ${
                beat ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          ))}
          {Array(pattern.length - userInput.length)
            .fill()
            .map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-10 h-10 rounded-full bg-gray-200"
              ></div>
            ))}
        </div>
      </div>

      {/* ゲーム状態表示 */}
      <div className="text-center mb-6">
        {gameState === "playing" && (
          <div className="text-xl font-bold text-blue-600">
            Watch the pattern!
          </div>
        )}
        {gameState === "playerTurn" && (
          <div className="text-xl font-bold text-green-600">
            Your turn! Tap the rhythm!
          </div>
        )}
      </div>

      {/* プレイヤー入力ボタン */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => handleInput(1)}
          disabled={gameState !== "playerTurn"}
          className={`bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors ${
            gameState !== "playerTurn" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Tap
        </button>
        <button
          onClick={() => handleInput(0)}
          disabled={gameState !== "playerTurn"}
          className={`bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors ${
            gameState !== "playerTurn" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Rest
        </button>
      </div>

      {/* スコア表示 */}
      {score !== null && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Accuracy:</h2>
          <p className="text-3xl font-bold text-green-600">{score}%</p>
        </div>
      )}

      {/* ゲームコントロールボタン */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            onNewPattern();
            setGameState("idle");
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          New Pattern
        </button>
        <button
          onClick={playPattern}
          disabled={gameState !== "idle"}
          className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors ${
            gameState !== "idle" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Play Pattern
        </button>
      </div>
    </div>
  );
}
