import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./components/Main";
import Profile from "./components/Profile";
import SquatExercise from "./components/SquatExercise";
import PlankExercise from "./components/PlankExercise";
import PushUpExercise from "./components/PushUpExercise";
import TonedArmExercise from "./components/TonedArmExercise";

import AboutM from "./components/AboutM";


//import PrivateRoute from "./PrivateRoute";



export default function App() {
  return (
    <><BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/SquatExercise" element={<SquatExercise />} />
            <Route path="/PlankExercise" element={<PlankExercise />} />
            <Route path="/PushUpExercise" element={<PushUpExercise />} />
            <Route path="/TonedArmExercise" element={<TonedArmExercise />} />
         
            <Route path="/About" element={<AboutM />} />


          </Routes>
    </BrowserRouter>
    </>
  );
}

