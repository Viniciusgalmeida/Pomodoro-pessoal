import { useState, useEffect, useRef, useCallback } from "react";
import penClickingSound from "../../assets/Pen Clicking.mp3";
import metallicClankSound from "../../assets/Metallic Clank.mp3";

import "./style.css";

const Pomodoro = () => {
  const [time, setTime] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [initialTime, setInitialTime] = useState<number>(25 * 60);
  const intervalRef = useRef<number | NodeJS.Timeout | null>(null);

  const playEndSound = useCallback(() => {
    playSound(metallicClankSound);
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(intervalRef.current as unknown as number);
            playEndSound();
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current as unknown as number);
    }
    return () => clearInterval(intervalRef.current as unknown as number);
  }, [isActive, isPaused, playEndSound]);

  useEffect(() => {
    document.title = formatTime() + " - Pomodoro";
  }, [time]);

  const handleStartPause = () => {
    if (isActive) {
      setIsPaused(!isPaused);
    } else {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(initialTime);
  };

  const handleSetTime = (minutes: number) => {
    setIsActive(false);
    setIsPaused(true);
    const newTime = minutes * 60;
    setInitialTime(newTime);
    setTime(newTime);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const playSound = (sound: string) => {
    const audio = new Audio(sound);
    audio.play();
  };

  

  return (
    <div className="pomodoro">
      <h1 className="title">POMODORO</h1>
      <div className="set-timers">
        <button className="timer-button" onClick={() => handleSetTime(25)}>
          25 min
        </button>
        <button className="timer-button" onClick={() => handleSetTime(15)}>
          15 min
        </button>
        <button className="timer-button" onClick={() => handleSetTime(5)}>
          5 min
        </button>
      </div>
      <div className="container-screen">
        <div className="screen">
          {/*<textarea
            className="screen-text"
            placeholder="What pushes you?"
          ></textarea> */}
        </div>
      </div>
      <div className="timer">{formatTime()}</div>
      <div className="wrap-buttons">
        <div className="buttons">
          <button
            className="control-button"
            onClick={() => {
              handleStartPause();
              playSound(penClickingSound);
            }}
          >
            {isActive && !isPaused ? "PAUSE" : "START"}
          </button>
          <button
            className="control-button"
            onClick={() => {
              handleReset();
              playSound(penClickingSound);
            }}
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
