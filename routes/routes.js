var express = require("express");
const { route } = require("express/lib/application");
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
var userController = require("../controllers/UserController");

router.get('/', HomeController.index);


//User Routes
router.post('/user', UserController.create);
router.get('/user', UserController.index);
router.get('/user/:id', userController.findUserById);
router.put('/user', userController.edit);
router.delete('/user/:id', UserController.remove);
router.post('/recoverpassword', UserController.recoverPassword);
router.put("/changepassword", UserController.changePassword);



module.exports = router;