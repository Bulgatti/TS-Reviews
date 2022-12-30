const { Reviews, Photos } = require('../models');

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
        Promise.all(reviews.map(review => {
          review.review_id = review.id;
          review.date = new Date(review.date);
          review.response = review.response === 'null' ? null : review.response;
          review.reviewer_name = review.name;
          delete review.id;
          delete review.reported;
          delete review.name;
          delete review.email;
          delete review._id;

          return Promise.resolve(Photos.getPhotos({ review_id: review.review_id })
            .then(photos => {
              photos.forEach(photo => {
                delete photo.review_id;
                delete photo._id;
              });
              review.photos = photos;
            }));
        }))
          .then(() => {
            const body = {
              product,
              page: options.page,
              count: options.count,
              results: reviews,
            };
            response.status(200).json(body);
          });
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
