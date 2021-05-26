import * as express from 'express';
import * as stats from '../controllers/stats'

var router = express.Router();

router.post('/', stats.post_stats);

module.exports = router;
