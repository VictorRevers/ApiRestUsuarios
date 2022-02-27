var express = require("express");
const { route } = require("express/lib/application");
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
var userController = require("../controllers/UserController");
var AdminAuth = require("../middleware/AdminAuth");

router.get('/', HomeController.index);


//User Routes
router.post('/user', UserController.create);
router.get('/user', AdminAuth, UserController.index);
router.get('/user/:id', AdminAuth, UserController.findUserById);
router.put('/user', AdminAuth, UserController.edit);
router.delete('/user/:id', AdminAuth, UserController.remove);
router.post('/recoverpassword', UserController.recoverPassword);
router.put("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);



module.exports = router;