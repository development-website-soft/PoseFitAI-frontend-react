import { useState } from 'react'
import { GoKey } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const imageUrl = "./images/home2.jpeg";
const imagebg = "./images/flat-lay-orange-weights-with-water-bottle-copy-space.jpg"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const getemail = (e) => {
        setEmail(e.target.value)
    }

    const getpassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // التحقق من صحة البيانات
        if (!email || !password) {
            toast.error("Username and password are required", {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Zoom,
            });
            return;
        }

        // التحقق من اسم المستخدم وكلمة المرور
        if (email === "admin" && password === "12345678") {
            toast.success("Login successful", { theme: "colored" });
            navigate('/main');  // توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول
        } else {
            toast.error("Invalid username or password", { theme: "colored" });
        }
    };

    return (
        <>
            <ToastContainer limit={2} />
            <div className="h-svh  flex md:justify-center justify-center  items-center  font-mono " style={{ backgroundImage: `url(${imagebg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                <div className="md:w-11/12 w-12/12 h-[100%] flex items-center justify-center container  flex-col md:flex-row md:py-6 " >
                    <div className="w-full md:w-5/12 h-[100%]" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                    </div>
                    <div className="bg-transparent w-[100%] md:w-6/12 h-full flex items-center justify-center  absolute md:static md:bg-white">
                        <form onSubmit={handleSubmit} className='w-3/4 h-5/6 flex flex-col justify-center gap-4'>

                            <label htmlFor="username">
                                <div className='flex items-center bg-gray-200  border rounded-[14px]'>
                                    <CiUser className='text-black w-6 h-6 m-2' />

                                    <input type="text" name="username" id="username" placeholder="Enter Username" onChange={getemail} value={email} className="w-full h-11 rounded-xl bg-gray-200 text-black   outline-none text-sm" />
                                </div>
                            </label>
                            <label htmlFor="password">
                                <div className='flex items-center bg-gray-200  border rounded-[14px]'>
                                    <GoKey className='text-black w-6 h-6 m-2' />

                                    <input type="password" name="password" id="password" onChange={getpassword} placeholder="Password" className=" rounded-[14px] bg-gray-200 h-11  w-full  text-black outline-none" />
                                </div>
                            </label>

                            <button type="submit" className="mt-[20px] md:shadow-2xl bg-blue-500 text-white rounded-md py-3 font-semibold hover:bg-blue-400">
                                Login
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
