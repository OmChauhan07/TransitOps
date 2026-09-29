const express = require('express');
const { getLogs, openLog, closeLog, deleteLog } = require('../controllers/maintenanceController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authorizeRoles('FLEET_MANAGER'));

router.get('/', getLogs);
router.post('/', openLog);
router.post('/:id/close', closeLog);
router.delete('/:id', deleteLog);

module.exports = router;
