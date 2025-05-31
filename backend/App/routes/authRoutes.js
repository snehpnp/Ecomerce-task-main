const router = require("express").Router()
const { login , register ,GetUserProfile } = require('../controllers/auth/authController')

router.post("/login", login);
router.post("/register", register);
router.get("/get-user-profile/:id", GetUserProfile);


module.exports = router;