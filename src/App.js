import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./components/Main";
import SquatExercise from "./components/SquatExercise";
import PlankExercise from "./components/PlankExercise";
import PushUpExercise from "./components/PushUpExercise";
import TonedArmExercise from "./components/TonedArmExercise";
import SquatDetails from "./components/squatDetails"; 
import PushUpDetails from "./components/pushupDetails";
import TonedArmDetails from "./components/tonedarmDetails";
import PlankDetails from "./components/plankDetails";

import AboutM from "./components/AboutM";


//import PrivateRoute from "./PrivateRoute";



export default function App() {
  return (
    <><BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/SquatExercise" element={<SquatExercise />} />
            <Route path="/PlankExercise" element={<PlankExercise />} />
            <Route path="/PushUpExercise" element={<PushUpExercise />} />
            <Route path="/TonedArmExercise" element={<TonedArmExercise />} />
            <Route path="/SquatDetails" element={<SquatDetails />} />
            <Route path="/PushUpDetails" element={<PushUpDetails />} />
            <Route path="/TonedArmDetails" element={<TonedArmDetails />} />
            <Route path="/PlankDetails" element={<PlankDetails />} />
         
            <Route path="/About" element={<AboutM />} />


          </Routes>
    </BrowserRouter>
    </>
  );
}

