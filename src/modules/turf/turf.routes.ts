import { Router } from 'express';
import { authenticate, authorize } from '../../utils/checkAuth';
import * as turfController from './turf.controller';

const router = Router();

router.get('/', turfController.getAllTurfs);
router.get('/slug/:slug', turfController.getTurfBySlug);
router.get('/:id', turfController.getTurfById);
router.post('/', authenticate, authorize('admin'), turfController.createTurf);
router.patch('/:id', authenticate, authorize('admin'), turfController.updateTurf);
router.delete('/:id', authenticate, authorize('admin'), turfController.deleteTurf);

export default router;
