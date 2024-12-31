const express = require('express');
const { HandleUserSignUp, HandleUserLogin, HandleUserLogout, checkAuth,HandleUpdateProfile } = require('../controller/auth');
const { restrictTo } = require('../middlewares/authentication');


const router = express.Router();


router.post("/signup",HandleUserSignUp);

router.post("/login",HandleUserLogin);

router.get("/logout",HandleUserLogout);

router.put("/update-profile",restrictTo(),HandleUpdateProfile);

router.get("/check",restrictTo(),checkAuth);

module.exports = router;