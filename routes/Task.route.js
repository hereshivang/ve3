import "dotenv/config";
import express from 'express';
import { 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/Task.controllers.js';

import {authenticate} from "../Middleware/JWT.js";

const router = express.Router();

router.get('/tasks',authenticate, getAllTasks);
router.get('/tasks/:id',authenticate, getTaskById);
router.post('/create',authenticate, createTask);
router.put('/tasks/:id',authenticate, updateTask);
router.delete('/tasks/:id',authenticate, deleteTask);

export default router;
