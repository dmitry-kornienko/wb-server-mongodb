const express = require('express');
const router = express.Router();
const { all, add, report, remove, edit } = require('../controllers/reports');
const { auth } = require('../middleware/auth');

// api/report
router.get('/', auth, all);
// api/report/:id
router.get('/:id', auth, report);
// api/report/add
router.post('/add', auth, add);
// api/report/remove/:id
router.post('/remove/:id', auth, remove);
// api/report/edit/:id
router.patch('/edit/:id', auth, edit);

module.exports = router;