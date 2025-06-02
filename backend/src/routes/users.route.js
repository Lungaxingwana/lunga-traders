import express from "express";
import { checkAuth, fetchAdmins, fetchUserById, signup, login, updateLastSeen, updateProfile, logout, deleteAccount, fetchAllAccounts } from "../controllers/users.controller.js";
import { protectRoute } from "../middlewares/user.middleware.js";
import { multiUploadLogin, multiUploadUser, upload } from "../libs/db.js";

const router = express.Router();

router.get("/", protectRoute, checkAuth);
router.get("/get-admins", protectRoute, fetchAdmins);
router.get("/get-all-accounts", protectRoute, fetchAllAccounts);
router.get("/:_id", protectRoute, fetchUserById);

router.post("/signup", multiUploadUser, signup);

router.post("/login", multiUploadLogin, login);
router.post("/login", login);
router.put("/update-profile/:_id", multiUploadUser, updateProfile);
router.put("/update-last-seen/:_id", upload.single('last_seen'), updateLastSeen);

router.post("/logout", logout);
router.delete("/delete-account/:_id", protectRoute, deleteAccount);

export default router;