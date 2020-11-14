const { Router } = require("express");
const {signUp, confirmEmail} = require("../../controller/signup");
const router = Router()



router.post('/signup', signUp);
router.get("/confirm_signup/:confirmToken", confirmEmail);



module.exports = router;