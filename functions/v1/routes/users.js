const Router = require('express');
const ProfileController = require('../controllers/ProfileController.js');

const router = Router();

router.get('/all/', ProfileController.routes.getUsers);
router.get('/top/', ProfileController.routes.getTop);
router.get('/byId/:id/', ProfileController.routes.getUserById);
router.post('/create/:id/', ProfileController.routes.createProfile);
router.put('/update/:id/', ProfileController.routes.updateProfile);
router.post('/setCompany/:id/', ProfileController.routes.setCompanyForUser);
router.delete('/delete/:id/', ProfileController.routes.deleteUserById);


module.exports = router;