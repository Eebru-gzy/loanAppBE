const { Router } = require("express");
const takeLoan = require("../../controller/loan");
const {signUp, confirmEmail, Login} = require("../../controller/user");
const { protect } = require("../../middleware/auth");
const router = Router();



router.post('/signup', signUp);
router.get("/confirm_signup/:confirmToken", confirmEmail);
router.post("/login", Login);
router.post("/takeloan", protect, takeLoan);



module.exports = router;