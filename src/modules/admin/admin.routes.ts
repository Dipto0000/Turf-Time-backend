import { Router } from 'express';
import { authenticate, authorize } from '../../utils/checkAuth';
import * as adminController from './admin.controller';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/promote', adminController.promoteToAdmin);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);
router.get('/dashboard-stats', adminController.getDashboardStats);

export default router;
