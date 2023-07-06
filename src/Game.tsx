import useGame from "./hook/useGame";
import { AnimatePresence, motion } from "framer-motion";

const clickSound = new Audio("./sound/click.mp3");

const Game = () => {
  const step = useGame((state) => state.step);
  const setStep = useGame((state) => state.setStep);
  const layers = useGame((state) => state.layers);
  const reset = useGame((state) => state.reset);
  const Initial = () => {
    return (
      <div className="h-1/2 text-center">
        <motion.h1
          className="text-6xl mb-6"
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -200, opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.8 }}
        >
          STACK
        </motion.h1>
        <motion.button
          className="text-2xl py-3 px-4 border-2 border-black hover:scale-105"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            clickSound.play();
            setStep("start");
          }}
        >
          Start
        </motion.button>
      </div>
    );
  };
  const Count = () => {
    return (
      <motion.div
        className="h-3/4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <p className="text-4xl">{layers.length - 1}</p>
      </motion.div>
    );
  };
  const Finish = () => {
    return (
      <motion.div
        className="h-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 2 }}
      >
        <p className="text-2xl mb-3">Did you enjoy the game?</p>
        <p className="font-thin mb-3">
          Result : <span className="font-bold">{layers.length - 1}</span>
        </p>
        <button
          className="text-lg py-3 px-4 border-2 border-black hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            clickSound.play();
            reset();
            setStep("start");
          }}
        >
          Try again
        </button>
      </motion.div>
    );
  };
  return (
    <>
      {step === "start" && layers.length > 1 && <Count key="count" />}

      <AnimatePresence>
        {step === "initial" && <Initial key="initial" />}
        {step === "finish" && <Finish key="finish" />}
      </AnimatePresence>
    </>
  );
};

export default Game;
