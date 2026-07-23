import express, { Router } from 'express';
import { deleteReminder, getReminders, markComplete, postReminder } from '../controllers/reminderControllers';

const router = Router();

router.post('/reminder', postReminder);
router.patch('/reminder/:id', markComplete);
router.get('/reminder', getReminders);
router.delete('/reminder/:id', deleteReminder)


export default router;