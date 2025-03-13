import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { UserProvider } from "./UserContext";
import Main from "./components/Main";
import Profile from "./components/Profile";
import SquatExercise from "./components/SquatExercise";
import PlankExercise from "./components/PlankExercise";
import PushUpExercise from "./components/PushUpExercise";
import TonedArmExercise from "./components/TonedArmExercise";

import AboutM from "./components/AboutM";


import PrivateRoute from "./PrivateRoute";



export default function App() {
  return (
    <><BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/SquatExercise" element={<PrivateRoute><SquatExercise /></PrivateRoute>} />
            <Route path="/PlankExercise" element={<PrivateRoute><PlankExercise /></PrivateRoute>} />
            <Route path="/PushUpExercise" element={<PrivateRoute><PushUpExercise /></PrivateRoute>} />
            <Route path="/TonedArmExercise" element={<PrivateRoute><TonedArmExercise /></PrivateRoute>} />
         
            <Route path="/About" element={<PrivateRoute><AboutM /></PrivateRoute>} />


          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
    </>
  );
}

