const express = require('express');
const router = express.Router();
const { all, add, component, remove, edit } = require('../controllers/components');
const { auth } = require('../middleware/auth');

// api/component
router.get('/', all);
// api/component/:id
router.get('/:id', component);
// api/component/add
router.post('/add', auth, add);
// api/component/remove/:id
router.post('/remove/:id', auth, remove);
// api/component/edit/:id
router.put('/edit/:id', auth, edit);

module.exports = router;