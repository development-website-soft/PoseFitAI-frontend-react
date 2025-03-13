import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const list = ["PlankExercise", "SquatExercise","About", "Profile"]; 

export default function Nav() {
  const [isopen, setisopen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
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
              <nav aria-label="Global" className={`md:static absolute w-full md:w-auto mt-12 md:mt-0 bg-blue-500 md:block ${isopen ? "block animate-slideDown" : "hidden animate-slideUp"}`}>
                <ul id="hidden" className={`flex items-center gap-4 text-md justify-end flex-col md:flex-row`}>
                  {list.map((item, index) => {
                    return (
                      <li key={index} className="w-full md:w-auto py-2 px-4 md:px-0">
                        <Link to={`/${item}`} className="font-semibold text-white hover:text-orange-200"> {/* تغيير لون النص إلى الأبيض وتعديل لون التمرير */}
                          {item}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="flex items-center gap-4 justify-end">
                <div className="sm:flex sm:gap-4">
                  <button
                    className="rounded-md bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-orange-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>

                <div className="block md:hidden">
                  <label className="btn btn-circle swap swap-rotate">
                    <input type="checkbox" onClick={toggle} />

                    {/* أيقونة القائمة */}
                    <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                      <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                    </svg>

                    {/* أيقونة الإغلاق */}
                    <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                      <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



// <Navbar bg="primary" variant="dark" expand="lg" className="p-2">
// <Container>
//   <Navbar.Brand as={Link} to="/">
//     <img src="/external/logo.png" alt="Smart Coach" width="50" height="50" />
//     AI Fitness
//   </Navbar.Brand>
  
//   <Nav className="ms-auto">
//     <Nav.Link as={Link} to="/about">About</Nav.Link>
//     <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
    
//     {token ? (
//       <>
//         <Nav.Link as={Link} to="/profile" className="profile-icon-h">
//           <FaUser size={24} color="white" />
//           {username && <span className="ms-2 text-white">{username}</span>}
//         </Nav.Link>
//         <Nav.Link onClick={handleLogout} className="text-white">Logout</Nav.Link>
//       </>
//     ) : (
//       <Nav.Link as={Link} to="/login" className="text-white">Login</Nav.Link>
//     )}
//   </Nav>
// </Container>
// </Navbar>