var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Standard Automata' });
});

router.get('/popmachination.html', function(req, res, next) {
    res.render('popmachination', { title: 'Standard Automata' });
});
module.exports = router;
