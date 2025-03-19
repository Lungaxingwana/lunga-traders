'use client'
import Image from "next/image";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ImSpinner9 } from "react-icons/im";
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import lock from '../../../../public/icons/lock-white-icon.png'
import { IoLogIn } from "react-icons/io5";
import avatar from '../../../../public/icons/avatar-white-icon.png'
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/data-types/user";

export default function Login() {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('lunga');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('1');
    const [passwordError, setPasswordError] = useState('');
    const { setUser } = useUser();

    const router = useRouter();

    const validateFields = () => {
        let isValid = true;

        if (!username.trim()) {
            setUsernameError('Username is required.');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (!password.trim()) {
            setPasswordError('Password is required.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    async function handleLogin() {
        if (validateFields()) {
            setIsLoading(true);
            try {
                const response = await axios.post<User>('/api/users/login', { username, password } );
                setUser(response.data);
                router.push('/');
            } catch (error) {
                toast.error('Failed to login', error || '');
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="w-full mx-auto justify-center mt-10 pt-10 align-middle flex flex-1 min-h-screen bg-stone-200">
            <div className="justify-center items-center align-middle w-96 h-[670] bg-white border border-stone-500 rounded-xl shadow-black shadow-lg space-y-2">
                <div className="bg-stone-500 mx-10 rounded-b-full"><p className="w-full text-center">Login Screen</p></div>
                <div className="w-full px-4">
                    <div className="w-full h-80 flex justify-center align-middle items-center mt-5 rounded-xl border border-stone-500">
                        <Image alt="pic of the campany" src={'/background/lunga-trader.png'} width={300} height={300} objectFit="contain" />
                    </div>
                </div>
                <div className='w-full  justify-center flex mt-6 p-4 align-middle items-center'>
                    <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                        <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                            <Image src={avatar} alt={"logo of the business"} className=" h-8 self-center w-8" />
                        </div>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter username here' />
                    </div>
                    <p className="text-red-600 fixed text-center w-full mt-[60]">{usernameError}</p>
                </div>
                <div className='w-full justify-center flex px-4 align-middle items-center'>
                    <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                        <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                            <Image src={lock} alt={"logo of the business"} className=" h-8 self-center w-8" />
                        </div>
                        <input value={!password ? '' : password} type={`${isVisible ? 'password' : ''}`} className='outline-none  p-3 text-white w-9/12 bg-transparent' placeholder='Enter password here' onChange={(e) => setPassword(e.target.value)} />
                        <div className='w-2/12 h-full justify-end items-center align-middle flex p-3'>
                            <button onClick={() => setIsVisible(!isVisible)}>{isVisible ? <MdVisibilityOff size={25} color='white' /> : <MdVisibility size={25} color='white' />}</button>
                        </div>
                    </div>
                    <p className="text-red-600 fixed text-center w-full mt-[60]">{passwordError}</p>
                </div>


                <div className='w-full justify-evenly items-center align-middle flex'>
                    <div className='flex justify-evenly w-full items-center align-middle'>
                        <div className='w-1/2 mx-auto justify-center flex mt-6 p-4'>
                            <Link href={'/forgot-password'} className=' p-2 hover:underline active:opacity-40'>Forgot Password</Link>
                        </div>
                        <div className='w-1/2 mx-auto justify-center flex mt-6 p-2'>
                            <Toaster richColors position='top-center' />
                            <button onClick={handleLogin} className='p-2 hover:bg-stone-400 font-bold bg-stone-500 shadow-xl shadow-black active:opacity-40 w-full justify-center items-center align-middle rounded-full flex'>
                                {isLoading ? <div className='flex gap-3'><ImSpinner9 size={23} className="animate-spin" /><p>Loading...</p></div> : <div className="gap-x-2 flex justify-center align-middle items-center"><IoLogIn size={27} /><p>Login</p></div>}
                            </button>

                        </div>
                    </div>
                </div>
                <div className='w-full justify-evenly items-center align-middle flex'>
                    <div className='flex justify-evenly w-full items-center align-middle'>
                        <div className='w-full mx-auto justify-center flex  p-4'>
                            <p className=' p-2'>Dont have an <span className='font-bold'>account</span>? <Link href={'/create-account'} className='text-blue-900 hover:underline active:opacity-40'>Create one here</Link></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}