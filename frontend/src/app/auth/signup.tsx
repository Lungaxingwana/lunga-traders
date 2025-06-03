import React, { useRef, useState } from "react";
import { MdEmail, MdWork } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser, FaAddressCard, FaPhone, FaMars, FaVenus, FaGenderless, FaUserShield, FaUserAlt } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FiUserPlus, FiLogIn } from "react-icons/fi";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Helper to crop the image using pixel area from react-easy-crop
function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: { width: number; height: number; x: number; y: number }
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        size,
        size
      );
      canvas.toBlob((blob) => resolve(blob), "image/png");
    };
  });
}

type FormState = {
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  gender: string;
  address: string;
  cell_number: string;
  profile_image_id?: string;
  profile_picture?: File;
};

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    role: "Customer",
    first_name: "",
    last_name: "",
    gender: "Male",
    address: "",
    cell_number: "",
    profile_image_id: "",
    profile_picture: undefined,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const {signup, isSigningUp} = useAuthStore(); 

  // Image upload/resizing state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showResize, setShowResize] = useState(false);
  const [rawImage, setRawImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Role modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(form.role || "Customer");
  const [adminPassword, setAdminPassword] = useState("");
  const lstAdmin = ["Lunga-18DNP", "Nolwazi-14", "Winston-29DNP"];


  // Handle file selection
  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setRawImage(file);
      setShowResize(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResizeConfirm = async () => {
    if (!previewUrl || !croppedAreaPixels) return;
    const blob = await getCroppedImg(previewUrl, croppedAreaPixels);
    if (blob) {
      const resizedFile = new File([blob], rawImage?.name || "profile.png", { type: "image/png" });
      setForm((f) => ({ ...f, profile_picture: resizedFile }));
      setPreviewUrl(URL.createObjectURL(resizedFile));
    }
    setShowResize(false);
    setZoom(1);
  };

  const handleResizeCancel = () => {
    setShowResize(false);
    setRawImage(null);
    setPreviewUrl(form.profile_picture ? URL.createObjectURL(form.profile_picture) : null);
    setZoom(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    if (name === "profile_picture" && target instanceof HTMLInputElement && target.files && target.files[0]) {
      // handled by custom logic
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    setErrors((errs) => {
      const newErrs = { ...errs };
      delete newErrs[name];
      return newErrs;
    });
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Min 6 characters";
    if (!form.role) newErrors.role = "Role is required";
    if (!form.first_name) newErrors.first_name = "First name required";
    if (!form.last_name) newErrors.last_name = "Last name required";
    if (!form.gender) newErrors.gender = "Gender required";
    if (!form.address) newErrors.address = "Address required";
    if (!form.cell_number) newErrors.cell_number = "Cell number required";
    return newErrors;
  };



  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("gender", form.gender);
    formData.append("address", form.address);
    formData.append("cell_number", form.cell_number);
    if (form.profile_picture) {
      formData.append("profile_picture", form.profile_picture);
    }

    await signup({form: formData, navigate: (path: string) => navigate(path)})
    // Example: router.push("/login") after successful signup
    // router.push("/login");
  };
// Remove Next.js router usage. Use react-router-dom's useNavigate instead.
  return (
    <>
      <title>Lunga Traders | Sign Up</title>
      <AnimatePresence mode="wait">
          <div className="w-full h-full min-h-screen items-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300 pt-16 flex flex-col ">
            <motion.div
              className="max-w-7xl w-full mx-auto justify-items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
      
        {/* Role Modal */}
        {isRoleModalOpen && (
          <div className="fixed inset-0 bg-[#00000091] flex items-center justify-center z-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md shadow-black border-2 border-stone-500">
              <h3 className="text-lg font-bold text-center mb-6 flex items-center gap-2">
                <MdWork className="text-gray-500" /> Select Role
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="roleSelect" className="flex text-xs font-medium text-gray-700 items-center gap-1">
                    <MdWork className="text-gray-500" /> Role
                  </label>
                  <div className="flex items-center">
                    <MdWork className="absolute ml-3 text-gray-500" />
                    <select
                      id="roleSelect"
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value)}
                      className="mt-1 block w-full pl-10 px-4 py-2 border border-gray-300 bg-white rounded-md shadow-md outline-none"
                    >
                      <option value="Customer">
                        <FaUserAlt className="inline mr-1" /> Customer
                      </option>
                      <option value="Admin">
                        <FaUserShield className="inline mr-1" /> Admin
                      </option>
                    </select>
                  </div>
                </div>
                {selectedRole === "Admin" && (
                  <div className="relative">
                    <label htmlFor="adminPassword" className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <RiLockPasswordLine className="text-gray-500" /> Admin Password
                    </label>
                    <div className="flex items-center">
                      <RiLockPasswordLine className="absolute ml-3 text-gray-500" />
                      <input
                        type="password"
                        id="adminPassword"
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        className="mt-1 block w-full pl-10 px-4 py-2 border border-gray-300 bg-white rounded-md shadow-md outline-none"
                        placeholder="Enter Admin Password"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-6 gap-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg hover:opacity-70 active:opacity-40 w-1/2 flex cursor-pointer items-center justify-center gap-2 bg-gray-200 text-gray-700"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg w-1/2 flex items-center justify-center gap-2 shadow-black shadow-lg
                    ${selectedRole === "Admin"
                      ? "bg-gradient-to-r from-[#000051] to-[#00d8ff] text-white"
                      : "bg-gradient-to-r from-green-700 to-green-400 text-white"
                    }`}
                  onClick={() => {
                    if (selectedRole === "Admin") {
                      if (lstAdmin.includes(adminPassword)) {
                        setForm(f => ({ ...f, role: "Admin" }));
                        setIsRoleModalOpen(false);
                        setAdminPassword("");
                        // Optionally show a toast here
                      } else {
                        // Optionally show a toast here
                      }
                    } else {
                      setForm(f => ({ ...f, role: selectedRole }));
                      setIsRoleModalOpen(false);
                    }
                  }}
                >
                  <FaUserShield /> Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        <span className="opacity-60 mb-4">Sign Up</span>
        <div className="bg-white shadow-2xl shadow-black border border-stone-300 backdrop-blur-md rounded-xl p-8 w-full max-w-7xl flex flex-col items-center space-y-6">
          <form className="space-y-5 w-full" onSubmit={handleSubmit} noValidate>
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-2">
              <input
                ref={fileInputRef}
                name="profile_picture"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
              <button
                type="button"
                className="focus:outline-none"
                onClick={handleProfilePicClick}
                aria-label="Select profile picture"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    width={208}
                    height={208}
                    className="rounded-full object-cover border-2 w-52 h-52 border-stone-400 shadow-lg shadow-black/80"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center rounded-full bg-stone-200 border-2 border-stone-400 shadow-lg">
                    <img
                    src={"/background/both_avatar.jpg"}
                    alt="Profile"
                    width={208}
                    height={208}
                    className="rounded-full object-cover border-2 w-52 h-52 border-stone-400 shadow-lg shadow-black/80"
                  />
                  </div>
                )}
              </button>
              <span className="text-xs text-gray-500 mt-2">Click image to upload</span>
              {form.profile_picture && (
                <span className="text-xs text-green-600 mt-1">{form.profile_picture.name}</span>
              )}
            </div>
            {/* Resize Modal */}
            {showResize && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                  <div className="mb-4">Resize and confirm your image</div>
                  <div className="relative w-64 h-64 bg-gray-200 rounded mb-4">
                    {previewUrl && (
                      <Cropper
                        image={previewUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                      />
                    )}
                  </div>
                  <div className="w-56 mb-4">
                    <Slider
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(_, value) => setZoom(value as number)}
                      aria-label="Zoom"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={handleResizeConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      onClick={handleResizeCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Two-column layout for fields below profile picture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MdEmail size={20} /></span>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 focus:bg-white outline-none shadow-lg shadow-black/40 ${errors.email ? "border border-red-400" : ""}`}
                  required
                  autoComplete="email"
                />
                {errors.email && <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-16px] mt-1 absolute">{errors.email}</span>}
              </div>
              {/* Password */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><RiLockPasswordLine size={20} /></span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 focus:bg-white outline-none shadow-lg shadow-black/40 ${errors.password ? "border border-red-400" : ""}`}
                  required
                  autoComplete="new-password"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiEye size={22} /> : <HiEyeOff size={22} />}
                </span>
                {errors.password && <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-16px] mt-1 absolute">{errors.password}</span>}
              </div>
              {/* Role (readonly, opens modal) */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MdWork size={20} /></span>
                <input
                  name="role"
                  type="text"
                  placeholder="Role"
                  value={form.role}
                  readOnly
                  onClick={() => setIsRoleModalOpen(true)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 focus:bg-white outline-none shadow-lg shadow-black/40 cursor-pointer"
                  style={{ pointerEvents: "auto" }}
                />
              </div>
              {/* First Name */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser size={18} /></span>
                <input
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 focus:bg-white outline-none shadow-lg shadow-black/40 ${errors.first_name ? "border border-red-400" : ""}`}
                  required
                />
                {errors.first_name && <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-16px] mt-1 absolute">{errors.first_name}</span>}
              </div>
              {/* Last Name */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser size={18} /></span>
                <input
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 focus:bg-white outline-none shadow-lg shadow-black/40 ${errors.last_name ? "border border-red-400" : ""}`}
                  required
                />
                {errors.last_name && <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-16px] mt-1 absolute">{errors.last_name}</span>}
              </div>
              {/* Gender */}
              <div className="relative flex flex-col">
              
                <div className="flex gap-2  py-2">
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={form.gender === "male"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className={`w-full flex items-center justify-center gap-2 px-2 py-1 rounded-lg border shadow-lg ${
                        form.gender === "Male"
                          ? "bg-gradient-to-r from-blue-800 to-blue-400 text-white border-blue-700 shadow-black/90"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => setForm((f) => ({ ...f, gender: "Male" }))}
                    >
                      <FaMars /> Male
                    </button>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={form.gender === "Female"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className={`w-full flex items-center justify-center gap-2 px-2 py-1 rounded-lg border shadow-lg ${
                        form.gender === "female"
                          ? "bg-gradient-to-r from-pink-800 to-pink-400 text-white border-pink-700 shadow-black/90"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => setForm((f) => ({ ...f, gender: "female" }))}
                    >
                      <FaVenus /> Female
                    </button>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={form.gender === "Other"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className={`w-full flex items-center justify-center gap-2 px-2 py-1 rounded-lg border shadow-lg ${
                        form.gender === "other"
                          ? "bg-gradient-to-r from-gray-800 to-gray-400 text-white border-gray-700 shadow-black/90"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => setForm((f) => ({ ...f, gender: "other" }))}
                    >
                      <FaGenderless /> Other
                    </button>
                  </label>
                </div>
                {errors.gender && (
                  <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-16px] mt-1 absolute">
                    {errors.gender}
                  </span>
                )}
              </div>
              {/* Address */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaAddressCard size={18} /></span>
                <input
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 focus:bg-white outline-none shadow-lg shadow-black/40 ${errors.address ? "border border-red-400" : ""}`}
                  required
                />
                {errors.address && <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-16px] mt-1 absolute">{errors.address}</span>}
              </div>
              {/* Cell Number */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaPhone size={18} /></span>
                <input
                  name="cell_number"
                  type="tel"
                  placeholder="Cell Number"
                  value={form.cell_number}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 focus:bg-white outline-none shadow-lg shadow-black/40 ${errors.cell_number ? "border border-red-400" : ""}`}
                  required
                />
                {errors.cell_number && <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-16px] mt-1 absolute">{errors.cell_number}</span>}
              </div>
             
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-stone-700 via-stone-500 to-stone-700 hover:opacity-80 active:opacity-60 shadow-black shadow-lg transition disabled:opacity-50"
            >
              <FiUserPlus size={20} />
              {isSigningUp ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
        {/* Signup Link */}
        <div className="mt-4 text-center">
          <span className="opacity-60">go back to</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-stone-600 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1"
          >
            <FiLogIn size={18} />
            Login
          </button>
        </div>
      </motion.div>
    </div>
    </AnimatePresence>
    </>
  );
}
