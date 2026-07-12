const express = require('express');
const { getLogs, openLog, closeLog, deleteLog } = require('../controllers/maintenanceController');

const router = express.Router();

router.get('/', getLogs);
router.post('/', openLog);
router.post('/:id/close', closeLog);
router.delete('/:id', deleteLog);

module.exports = router;
