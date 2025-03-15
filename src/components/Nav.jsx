


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const list = ["PlankExercise", "SquatExercise", "About", "Profile"];

export default function Nav() {
  const [isopen, setisopen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage or any saved state (if needed)
    toast.success("Logged out successfully", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
    });
    navigate('/');  // Redirect to homepage or login page after logout
  };

  const toggle = () => {
    setisopen(!isopen);
  };

  return (
    <>
      <div className="z-20 sticky top-0 flex">
        <div className="w-full bg-blue-500 md:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="md:flex md:items-center ml-4 absolute md:gap-12">
              <div className="flex items-center gap-4">
                <img src="./images/logo.png" alt="logo" className="w-16 h-16" />
                <h1 className="text-2xl font-semibold text-white">AI Fitness</h1>
              </div>
            </div>

            <div className="md:flex flex-1 justify-end md:items-center relative md:gap-12">
              <nav
                aria-label="Global"
                className={`md:static absolute w-full md:w-auto mt-12 md:mt-0 bg-blue-500 md:block ${
                  isopen ? "block animate-slideDown" : "hidden animate-slideUp"
                }`}
              >
                <ul className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
                  {list.map((item) => (
                    <li key={item}>
                      <Link
                        to={`/${item}`}
                        className="text-white hover:text-gray-300 transition duration-300"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-white hover:text-gray-300 transition duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
              <button
                onClick={toggle}
                className="md:hidden text-white p-2 focus:outline-none"
              >
                {isopen ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



