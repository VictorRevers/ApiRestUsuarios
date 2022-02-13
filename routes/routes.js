var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
var userController = require("../controllers/UserController");

router.get('/', HomeController.index);

router.post('/user', UserController.create);

module.exports = router;