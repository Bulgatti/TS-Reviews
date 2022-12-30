const { Reviews } = require('../models');

module.exports = {
  getReviews: (request, response) => {
    const product = +request.query.product_id;
    const sort = { newest: { date: -1 }, helpful: { helpfulness: -1 }, relevant: { rating: -1 } };
    const options = {
      page: +request.query.page || 1,
      count: +request.query.count || 5,
      sort: sort[request.query.sort] ?? sort.newest,
    };
    Reviews.getReviews(product, options)
      .then(reviews => {
        /* eslint-disable no-param-reassign */
        /* eslint-disable no-underscore-dangle */
        reviews.forEach(review => {
          review.review_id = review.id;
          review.date = new Date(review.date);
          review.response = review.response === 'null' ? null : review.response;
          delete review._id;
          delete review.id;
        });
        response.status(200).json(reviews);
      })
      .catch(error => response.status(500).send(error));
  },
  addReview: (request, response) => {
    const { body: review } = request;
    Reviews.addReview(review)
      .then(created => response.status(201).json(created))
      .catch(error => response.status(500).send(error));
  },
  updateReview: (request, response) => {
    const property = request.url.split('/').at(-1);
    const review = { id: +request.params.review_id };
    const update = {};
    if (property === 'helpful') {
      update.$inc = { helpfulness: 1 };
    } else if (property === 'report') {
      update.$set = { reported: true };
    }
    Reviews.updateReview(review, update)
      .then(() => response.status(204).send())
      .catch(error => response.status(500).send(error));
  },
};
