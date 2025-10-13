const router = require('express').Router();
const ctrl = require('../controllerAPI/events.controller');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// toggles
router.patch('/:id/active',    ctrl.setActive);
router.patch('/:id/suspended', ctrl.setSuspended);

module.exports = router;
