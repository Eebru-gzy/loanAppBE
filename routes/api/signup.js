const { Router } = require("express");
const {signUp, confirmEmail, Login} = require("../../controller/user");
const router = Router()



router.post('/signup', signUp);
router.get("/confirm_signup/:confirmToken", confirmEmail);
router.post("/login", Login);



module.exports = router;