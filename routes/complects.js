const express = require('express');
const router = express.Router();
const { all, add, complect, remove, edit } = require('../controllers/complects');
const { auth } = require('../middleware/auth');

// api/complect
router.get('/', all);
// api/complect/:id
router.get('/:id', complect);
// api/complect/add
router.post('/add', auth, add);
// api/complect/remove/:id
router.post('/remove/:id', auth, remove);
// api/complect/edit/:id
router.put('/edit/:id', auth, edit);

module.exports = router;