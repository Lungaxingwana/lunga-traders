'use client';

import Image from "next/image";
import { useCallback, useState } from "react";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ImSpinner9 } from "react-icons/im";
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import lock from '../../../../public/icons/lock-white-icon.png';
import avatar from '../../../../public/icons/avatar-white-icon.png';
import chair from '../../../../public/icons/chair-icon.png';
import emailIcon from '../../../../public/icons/email-icon.png';
import cell from '../../../../public/icons/cell-icon.png';
import gen from '../../../../public/icons/gender-icon.png';
import addres from '../../../../public/icons/address-icon.png';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { CroppedArea, CroppedAreaPixels } from "@/data-types/structure-classes";
import getCroppedImg from "@/components/getCroppedImg";
import ImageSelector from "@/components/image-loader";
import { convertImageToBase64 } from "@/utils/util";
import { User } from "@/data-types/user.type";
import { useRouter } from "next/navigation";

import { ImProfile } from "react-icons/im";
import { useUser } from "@/app/UserContext";

export default function Profile() {
    // State declarations
    const { user, setUser } = useUser();
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [usernameError, setUsernameError] = useState('');
    const [email, setEmail] = useState(user.email);
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState(user.password);
    const [passwordError, setPasswordError] = useState('');
    const [image, setImage] = useState(user.person.profile_picture || '/icons/avatar-icon.png');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels>({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });

    const [cell_number, setCellNumber] = useState(user.person.cell_number);
    const [cellNumberError, setCellNumberError] = useState('');
    const [address, setAddress] = useState(user.person.address);
    const [addressError, setAddressError] = useState('');
    const [first_name, setFirstName] = useState(user.person.first_name);
    const [firstNameError, setFirstNameError] = useState('');
    const [last_name, setLastName] = useState(user.person.last_name);
    const [lastNameError, setLastNameError] = useState('');
    const [role, setRole] = useState(user.role);
    const [roleError, setRoleError] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>(user.person.gender === 'Male' ? 'Male' : 'Female');

    const router = useRouter();

    // Event handlers
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

    // Field validation
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

        if (!cell_number.trim()) {
            setCellNumberError('Cell Number is required.');
            isValid = false;
        } else {
            setCellNumberError('');
        }

        if (!address.trim()) {
            setAddressError('Address is required.');
            isValid = false;
        } else {
            setAddressError('');
        }

        if (!first_name.trim()) {
            setFirstNameError('First name is required.');
            isValid = false;
        } else {
            setFirstNameError('');
        }

        if (!last_name.trim()) {
            setLastNameError('Last name is required.');
            isValid = false;
        } else {
            setLastNameError('');
        }

        if (!role.trim()) {
            setRoleError('Role is required.');
            isValid = false;
        } else {
            setRoleError('');
        }

        if (!password.trim() || password.length < 1) {
            setPasswordError('Password must be at least 1 character long.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    async function handleUpdateProfile() {
        if (validateFields()) {
            const data: User = {
                _id: user._id,
                username: username,
                email: email,
                password: password,
                role: role,
                person: {
                    first_name: first_name,
                    last_name: last_name,
                    gender: gender,
                    address: address,
                    cell_number: cell_number,
                    profile_picture: image
                },
                createdAt: "",
                updatedAt: ""
            }
            setIsLoading(true);
            try {
                const response = await axios.patch<User>('/api/user/update-user', data);
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
        <div className="w-full max-w-7xl mx-auto justify-center items-center align-middle flex flex-1">
            <div className="justify-center items-center align-middle w-96 sm:w-full sm:h-[770] bg-white border border-stone-500 rounded-xl shadow-back shadow-lg space-y-2">
                <div className="bg-stone-500 mx-10 rounded-b-full"><p className="w-full text-center">Profile Screen</p></div>
                <div className="sm:flex">
                    <div className="sm:w-1/2 px-4">


                        <button onClick={showCroppedImage} className="w-full h-[400] sm:h-[650] justify-center align-middle items-center mt-5 rounded-t-xl border border-stone-500">
                            <ImageSelector onImageSelect={handleImageSelect} />
                            <div className="relative w-full h-[350px] md:h-[600px]">
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
                    <div className="sm:w-1/2">
                        <div className='w-full  justify-center flex mt-6 p-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={emailIcon} alt={"logo of the business"} className=" h-8 self-center w-8" />
                                </div>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter Email here' type="email" />
                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{emailError}</p>
                        </div>

                        <div className='w-full  justify-center flex pb-4 px-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={avatar} alt={"logo of the business"} className=" h-8 self-center w-8" />
                                </div>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter Username here' />
                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{usernameError}</p>
                        </div>
                        <div className='w-full justify-center flex px-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-1'>
                                    <Image src={lock} alt={"logo of the business"} className=" h-8 self-center w-8 mr-[-4]" />
                                </div>
                                <input value={!password ? '' : password} type={`${isVisible ? 'password' : ''}`} className='outline-none  p-3 px-5 text-white w-9/12 bg-transparent' placeholder='Enter Password here' onChange={(e) => setPassword(e.target.value)} />
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-3'>
                                    <button onClick={() => setIsVisible(!isVisible)}>{isVisible ? <MdVisibilityOff size={25} color='white' /> : <MdVisibility size={25} color='white' />}</button>
                                </div>
                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{passwordError}</p>
                        </div>
                        <div className='w-full  justify-center flex pb-4 px-4 mt-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={avatar} alt={"logo of the business"} className=" h-8 self-center w-8" />
                                </div>
                                <input value={first_name} onChange={(e) => setFirstName(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter First Name here' />
                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{firstNameError}</p>
                        </div>
                        <div className='w-full  justify-center flex pb-4 px-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={avatar} alt={"logo of the business"} className=" h-8 self-center w-8" />
                                </div>
                                <input value={last_name} onChange={(e) => setLastName(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter Last Name here' />
                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{lastNameError}</p>
                        </div>
                        <div className='w-full justify-center flex pb-4 px-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={gen} alt={"logo of the business"} className="h-8 self-center w-8" />
                                </div>
                                <div className='w-9/12 bg-transparent flex items-center px-3'>
                                    <label className='text-white flex gap-x-2'>
                                        <input type="radio" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value === 'Male' ? 'Male' : 'Female')} />
                                        <p>Male</p>
                                    </label>
                                    <label className='text-white ml-4 flex gap-x-2'>
                                        <input type="radio" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value === 'Female' ? 'Female' : 'Male')} />
                                        <p>Female</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='w-full  justify-center flex pb-4 px-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={cell} alt={"logo of the business"} className=" h-8 self-center w-8" />
                                </div>
                                <input type="number" value={cell_number} onChange={(e) => setCellNumber(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter Cell Number here' />
                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{cellNumberError}</p>
                        </div>
                        <div className='w-full  justify-center flex pb-4 px-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={addres} alt={"logo of the business"} className=" h-8 self-center w-8" />
                                </div>
                                <input value={address} onChange={(e) => setAddress(e.target.value)} className='outline-none p-3 text-white w-9/12 bg-transparent' placeholder='Enter Address here' />
                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{addressError}</p>
                        </div>
                        <div className='w-full  justify-center flex pb-4 px-4 align-middle items-center'>
                            <div className='bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10'>
                                <div className='w-2/12 h-full justify-end items-center align-middle flex p-2'>
                                    <Image src={chair} alt={"logo of the business"} className=" h-8 self-center w-8" />
                                </div>
                                <select value={role} onChange={(e) => setRole(e.target.value)} className='outline-none px-3 text-white w-9/12 bg-transparent'>
                                    <option className="bg-stone-700 cursor-pointer" value="admin">Admin</option>
                                    <option className="bg-stone-700 cursor-pointer" value="employee" selected>Employee</option>
                                    <option className="bg-stone-700 cursor-pointer" value="customer">Customer</option>
                                </select>

                            </div>
                            <p className="text-red-600 fixed text-center w-full mt-[60]">{roleError}</p>
                        </div>
                        <div className='w-full justify-evenly items-center align-middle flex'>
                            <div className='flex justify-evenly w-full items-center align-middle'>
                                <div className='w-5/12 mx-auto justify-center flex mt-6 p-4'>
                                    <Link href={'/'} className=' p-2 hover:underline active:opacity-40'>Back</Link>
                                </div>
                                <div className='w-7/12 mx-auto justify-center flex mt-6 p-2'>
                                    <Toaster richColors position='top-center' />
                                    <button onClick={handleUpdateProfile} className='p-2 hover:bg-stone-400 font-bold bg-stone-500 shadow-xl shadow-black active:opacity-40  w-full justify-center items-center align-middle rounded-full flex'>
                                        {isLoading ? <div className='flex gap-3'><ImSpinner9 size={23} className="animate-spin" /><p>Loading...</p></div> : <div className="flex gap-x-2 items-center justify-center align-middle"><ImProfile size={24} />Update Profile</div>}
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
