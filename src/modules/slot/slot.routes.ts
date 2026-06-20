import { Router } from 'express';
import { authenticate, authorize } from '../../utils/checkAuth';
import * as slotController from './slot.controller';

const router = Router();

router.get('/by-date', slotController.getSlotsByDate);
router.get('/', slotController.getAllSlots);
router.post('/generate', authenticate, authorize('admin'), slotController.generateSlots);
router.get('/:id', slotController.getSlotById);
router.post('/', authenticate, authorize('admin'), slotController.createSlot);
router.patch('/:id', authenticate, authorize('admin'), slotController.updateSlot);
router.delete('/:id', authenticate, authorize('admin'), slotController.deleteSlot);

export default router;
