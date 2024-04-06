"use client";
import { Color, getGameSingleton } from "@/game";
import { FC, useState } from "react";

type GameProps = {
  failGame: () => void;
  winGame: () => void;
};

const FINAL_LEVEL = 10;

export const Game: FC<GameProps> = ({ failGame, winGame }) => {
  const game = getGameSingleton();
  const [level, setLevel] = useState(game.getCurrentLevel());

  const onColorClick = async (color: Color) => {
    console.log(color);
    const correct = await game.userInput(color);
    setLevel(game.getCurrentLevel());
    if (!correct) {
      console.log("game over");
      failGame();
    } else {
      if (game.getCurrentLevel() === FINAL_LEVEL + 1) {
        console.log("you win");
        winGame();
      }
    }
  };

  const clickRed = async () => {
    await onColorClick(Color.red);
  };

  const clickBlue = async () => {
    await onColorClick(Color.blue);
  };

  const clickGreen = async () => {
    await onColorClick(Color.green);
  };

  const clickYellow = async () => {
    await onColorClick(Color.yellow);
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <div className="text-black">level: {level}</div>
      <div className="w-1/2 h-full flex flex-col">
        <div className="w-full h-full p-1 sm:p-4">
          <div
            className="w-full h-full bg-red-400 rounded-xl hover:bg-red-600"
            onClick={clickRed}
          />
        </div>
        <div className="w-full h-full p-1 sm:p-4">
          <div
            className="w-full h-full bg-green-400 rounded-xl hover:bg-green-600"
            onClick={clickGreen}
          />
        </div>
      </div>

      <div className="w-1/2 h-full flex flex-col">
        <div className="w-full h-full p-1 sm:p-4">
          <div
            className="w-full h-full bg-blue-400 rounded-xl hover:bg-blue-600"
            onClick={clickBlue}
          />
        </div>
        <div className="w-full h-full p-1 sm:p-4">
          <div
            className="w-full h-full bg-yellow-400 rounded-xl hover:bg-yellow-500"
            onClick={clickYellow}
          />
        </div>
      </div>
    </div>
  );
};
