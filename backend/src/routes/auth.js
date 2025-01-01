import express from 'express';
import { HandleUserSignUp, HandleUserLogin, HandleUserLogout, checkAuth,HandleUpdateProfile } from '../controller/auth.js';
import { restrictTo } from '../middlewares/authentication.js';


const router = express.Router();


router.post("/signup",HandleUserSignUp);

router.post("/login",HandleUserLogin);

router.get("/logout",HandleUserLogout);

router.put("/update-profile",restrictTo(),HandleUpdateProfile);

router.get("/check",restrictTo(),checkAuth);

export default router;