import { useState, useEffect } from "react";
import { useUserContext } from "../UserContext";

export default function History() {
  const { squatData, plankData, pushUpData, tonedData } = useUserContext();

  const [squatCorrect, setSquatCorrect] = useState('0');
  const [squatIncorrect, setSquatIncorrect] = useState('0');
  const [plankCorrect, setPlankCorrect] = useState('0');
  const [plankIncorrect, setPlankIncorrect] = useState('0');
  const [pushUpCorrect, setPushUpCorrect] = useState('0'); 
  const [pushUpIncorrect, setPushUpIncorrect] = useState('0'); 
  const [tonedArmCorrect, setTonedArmCorrect] = useState('0'); 
  const [tonedArmIncorrect, setTonedArmIncorrect] = useState('0'); 

  useEffect(() => {
    if (squatData) {
      setSquatCorrect(squatData.correct || '0');
      setSquatIncorrect(squatData.incorrect || '0');
    }
    if (plankData) {
      setPlankCorrect(plankData.correct || '0');
      setPlankIncorrect(plankData.incorrect || '0');
    }
    if (pushUpData) { 
      setPushUpCorrect(pushUpData.correct || '0');
      setPushUpIncorrect(pushUpData.incorrect || '0');
    }
    if (tonedData) { 
      setPushUpCorrect(tonedData.correct || '0');
      setPushUpIncorrect(tonedData.incorrect || '0');
    }
  }, [squatData, plankData, pushUpData, tonedData]);

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col container gap-4 p-4">
          <div>
            <h1 className="text-5xl font-semibold text-blue-500">History</h1>
            <small>
              "Exercise not only changes your body, it changes your mind, your
              attitude and your mood."
            </small>
          </div>

          {/* Squat Exercise */}
          <div className="collapse p-4 collapse-arrow bg-base-200 mb-48">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-semibold">
              Squat Exercise
            </div>
            <div className="collapse-content flex flex-col justify-between sm:flex-row gap-2">
              <div className="flex justify-between p-2 px-4 w-full bg-green-400 h-10 rounded-lg text-white font-medium sm:w-[30%]">
                <p>Correct</p>
                <p>{squatCorrect}</p>
              </div>
              <div className="w-full bg-blue-500 h-10 rounded-lg flex justify-between p-2 px-4 text-white font-medium sm:w-[30%]">
                <p>Incorrect</p>
                <p>{squatIncorrect}</p>
              </div>
            </div>
          </div>

          {/* Plank Exercise */}
          <div className="collapse p-4 collapse-arrow bg-base-200 mb-48">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-semibold">
              Plank Exercise
            </div>
            <div className="collapse-content flex flex-col justify-between sm:flex-row gap-2">
              <div className="flex justify-between p-2 px-4 w-full bg-green-400 h-10 rounded-lg text-white font-medium sm:w-[30%]">
                <p>Correct</p>
                <p>{plankCorrect}</p>
              </div>
              <div className="w-full bg-blue-500 h-10 rounded-lg flex justify-between p-2 px-4 text-white font-medium sm:w-[30%]">
                <p>Incorrect</p>
                <p>{plankIncorrect}</p>
              </div>
            </div>
          </div>

          {/* Push-up Exercise */}
          <div className="collapse p-4 collapse-arrow bg-base-200 mb-48">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-semibold">
              Push-up Exercise
            </div>
            <div className="collapse-content flex flex-col justify-between sm:flex-row gap-2">
              <div className="flex justify-between p-2 px-4 w-full bg-green-400 h-10 rounded-lg text-white font-medium sm:w-[30%]">
                <p>Correct</p>
                <p>{pushUpCorrect}</p>
              </div>
              <div className="w-full bg-blue-500 h-10 rounded-lg flex justify-between p-2 px-4 text-white font-medium sm:w-[30%]">
                <p>Incorrect</p>
                <p>{pushUpIncorrect}</p>
              </div>
            </div>
          </div>

            {/* Toned-Arm Exercise */}
          <div className="collapse p-4 collapse-arrow bg-base-200 mb-48">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-semibold">
            Toned-Arm Exercise
            </div>
            <div className="collapse-content flex flex-col justify-between sm:flex-row gap-2">
              <div className="flex justify-between p-2 px-4 w-full bg-green-400 h-10 rounded-lg text-white font-medium sm:w-[30%]">
                <p>Correct</p>
                <p>{tonedArmCorrect}</p>
              </div>
              <div className="w-full bg-blue-500 h-10 rounded-lg flex justify-between p-2 px-4 text-white font-medium sm:w-[30%]">
                <p>Incorrect</p>
                <p>{tonedArmIncorrect}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}