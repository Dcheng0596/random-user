import * as express from 'express';
import * as stats from '../controllers/stats'

var router = express.Router();

router.get('/', stats.post_stats);

module.exports = router;
