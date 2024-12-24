import express from 'express';
import controller from '../controllers/controllerUser.js';

const router = express.Router();

router.route('/login')
  .post(controller.loginUser);
  
router.route('/register')
  .post(controller.registerUser);

export default router;