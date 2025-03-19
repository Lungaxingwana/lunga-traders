'use client'
import Image from "next/image";
import { useCallback, useState } from "react";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ImSpinner9 } from "react-icons/im";
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import lock from '../../../../public/icons/lock-white-icon.png'
import avatar from '../../../../public/icons/avatar-white-icon.png'
import emailIcon from '../../../../public/icons/email-icon.png'
import Cropper from 'react-easy-crop';
import { MdCreateNewFolder } from "react-icons/md";
import axios from 'axios';
import { CroppedArea, CroppedAreaPixels } from "@/data-types/structure-classes";
import getCroppedImg from "@/components/getCroppedImg";
import ImageSelector from "@/components/image-loader";
import { convertImageToBase64 } from "@/utils/util";
import { useRouter } from "next/navigation";
import { UserInput } from "@/data-types/user";


export default function CreateAccount() {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [image, setImage] = useState('/icons/avatar-icon.png');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels>({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });

    const router = useRouter();

    const handleImageSelect = (selectedImage: string) => {
        setImage(selectedImage);
    };

    const onCropComplete = useCallback((croppedArea: CroppedArea, croppedAreaPixels: CroppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            setImage(await convertImageToBase64(croppedImage || ''));
        } catch (e) {
            toast.error("UPDATE ERROR: ", e || 'Something went wrong!!!');
        }
    }, [image, croppedAreaPixels]);

    const validateFields = () => {
        let isValid = true;

        if (!email.trim() || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            setEmailError('A valid email is required. eg.: mye@gmail.com');
            isValid = false;
        } else {
            setEmailError('');
        } 

        if (!username.trim()) {
            setUsernameError('Username is required.');
            isValid = false;
        } else {
            setUsernameError('');
        }
        
        if (!password.trim() || password.length < 1) {
            setPasswordError('Password must be at least 1 characters long.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    async function handleCreateAccount() {
        if (validateFields()) {
            const data: UserInput = {
                username: username,
                email: email,
                password: password,
                role: "admin",
                person: {
                    first_name: "",
                    last_name: "",
                    gender: "Male",
                    address: "",
                    cell_number: "",
                    profile_picture: image
                },
            }
            setIsLoading(true);
            try {
                await axios.post('/api/users/signup', data);
                router.push('/login');
            } catch (error) {
                toast.error('Failed to login', error || '');
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="w-full mx-auto justify-center  align-middle flex flex-1 bg-stone-200 min-h-screen mt-10 pt-10">
            <div className="justify-center items-center align-middle w-96 h-[770] bg-white border border-stone-500 rounded-xl shadow-stone-500 shadow-lg space-y-2">
                <div className="bg-stone-500 mx-10 rounded-b-full"><p className="w-full text-center">Create Account Screen</p></div>
                <div className="w-full px-4">


                    <button onClick={showCroppedImage} className="w-full h-[400] justify-center align-middle items-center mt-5 rounded-t-xl border border-stone-500">
                        <ImageSelector onImageSelect={handleImageSelect} />
                        <div className="relative w-full" style={{ height: 350 }}>
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                    </button>
                </div>
                <div className='w-full  justify-center flex mt-6 p-4 align-middle items-center'>
                    <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                        <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                            <Image src={emailIcon} alt={"logo of the business"} className=" h-8 self-center w-8" />
                        </div>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter email here' type="email" />
                    </div>
                    <p className="text-red-600 fixed text-center w-full mt-[60]">{emailError}</p>
                </div>

                <div className='w-full  justify-center flex pb-4 px-4 align-middle items-center'>
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
                        <div className='w-5/12 mx-auto justify-center flex mt-6 p-4'>
                            <Link href={'/login'} className=' p-2 hover:underline active:opacity-40'>Back</Link>
                        </div>
                        <div className='w-7/12 mx-auto justify-center flex mt-6 p-2'>
                            <Toaster richColors position='top-center' />
                            <button onClick={handleCreateAccount} className='p-2 hover:bg-stone-400 font-bold bg-stone-500 shadow-xl shadow-black active:opacity-40  w-full justify-center items-center align-middle rounded-full flex'>
                                {isLoading ? <div className='flex gap-3'><ImSpinner9 size={23} className="animate-spin" /><p>Loading...</p></div> : <div className="flex gap-x-2 items-center justify-center align-middle"><MdCreateNewFolder size={24} />Create Account</div>}
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
