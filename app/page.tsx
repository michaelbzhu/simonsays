"use client";
import { Game } from "@/components/Game";
import { getGameSingleton } from "@/game";
import { useState } from "react";

type GameState = "titlepage" | "playing" | "failed" | "won";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("titlepage");
  const game = getGameSingleton();

  const startGame = () => {
    setGameState("playing");
    game.resetGame();
  };

  const failGame = () => {
    setGameState("failed");
  };

  const winGame = () => {
    setGameState("won");
  };

  if (gameState === "titlepage") {
    return (
      <div className="w-screen text-2xl flex flex-col items-center">
        <p className="text-5xl py-4 mt-16">Simon Says</p>
        <div className="cursor-pointer" onClick={startGame}>
          [start game]
        </div>
      </div>
    );
  }
  if (gameState === "won") {
    return (
      <div className="w-screen text-2xl flex flex-col items-center">
        <h1 className="text-5xl py-4 mt-16">YOU WON!</h1>
        <div>here is the clue</div>
      </div>
    );
  }
  if (gameState === "failed") {
    return (
      <div className="w-screen text-2xl flex flex-col items-center">
        <h1 className="text-5xl py-4 mt-16">YOU FAILED!</h1>
        <div onClick={startGame} className="cursor-pointer">
          [play again]
        </div>
      </div>
    );
  }
  return <Game failGame={failGame} winGame={winGame} />;
}
