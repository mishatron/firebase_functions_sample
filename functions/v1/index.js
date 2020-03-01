const Router = require('express');
const router = Router();
const users = require("./routes/users")

router.use('/users', users);

module.exports = router;