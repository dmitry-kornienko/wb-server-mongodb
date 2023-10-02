const express = require('express');
const router = express.Router();
const { all, add, packedOperation, remove, edit } = require('../controllers/packed-operations');
const { auth } = require('../middleware/auth');

// api/packed-operation
router.get('/', all);
// api/packed-operation/:id
router.get('/:id', packedOperation);
// api/packed-operation/add
router.post('/add', auth, add);
// api/packed-operation/remove/:id
router.post('/remove/:id', auth, remove);
// api/packed-operation/edit/:id
router.put('/edit/:id', auth, edit);

module.exports = router;