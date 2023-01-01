const router = require('express').Router();
const { Reviews } = require('./controllers');

router.get('/reviews', Reviews.getReviews);
router.get('/reviews/meta', Reviews.getMetadata);
router.post('/reviews', Reviews.addReview);
router.put('/reviews/:review_id/helpful', Reviews.updateReview);
router.put('/reviews/:review_id/report', Reviews.updateReview);

module.exports = router;
