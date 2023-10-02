const express = require('express');
const router = express.Router();
const { all, add, buyOperation, remove, edit } = require('../controllers/buy-operations');
const { auth } = require('../middleware/auth');

// api/buy-operation
router.get('/', all);
// api/buy-operation/:id
router.get('/:id', buyOperation);
// api/buy-operation/add
router.post('/add', auth, add);
// api/buy-operation/remove/:id
router.post('/remove/:id', auth, remove);
// api/buy-operation/edit/:id
router.put('/edit/:id', auth, edit);

module.exports = router;