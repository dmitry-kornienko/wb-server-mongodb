const express = require('express');
const router = express.Router();
const { all, add, sendOperation, remove, edit } = require('../controllers/send-operations');
const { auth } = require('../middleware/auth');

// api/send-operation
router.get('/', all);
// api/send-operation/:id
router.get('/:id', sendOperation);
// api/send-operation/add
router.post('/add', auth, add);
// api/send-operation/remove/:id
router.post('/remove/:id', auth, remove);
// api/send-operation/edit/:id
router.put('/edit/:id', auth, edit);

module.exports = router;