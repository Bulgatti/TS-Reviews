// eslint-disable-next-line object-curly-newline
const { Reviews, Photos, ProductChars, Chars } = require('../models');

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
          delete review.product_id;
          delete review.reported;
          delete review.name;
          delete review.email;
          delete review._id;

          return Promise.resolve(Photos.getPhotos(review.review_id)
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
  getMetadata: async (request, response) => {
    const product = +request.query.product_id;
    try {
      const reviews = await Reviews.getReviews(product);
      /* eslint-disable object-curly-newline */
      const body = {
        product_id: product,
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recommended: { 0: 0, 1: 0 },
        characteristics: {},
      };
      reviews.forEach(review => {
        body.ratings[review.rating] += 1;
        body.recommended[+review.recommend] += 1;
      });
      const productChars = await ProductChars.getProductChars(product);
      await Promise.all(productChars.map(async productChar => {
        const { id, name } = productChar;
        const { characteristics } = body;
        characteristics[name] = { id, value: 0 };

        /** Dear God, what have I done? */
        return Promise.resolve((async () => {
          const chars = await Chars.getChars(id);
          const average = +parseFloat(chars.reduce((total, char) => char.value + total, 0)
            / chars.length).toFixed(2);
          Object.keys(characteristics).forEach(char => {
            if (characteristics[char].id === id) {
              characteristics[char].value = average;
            }
          });
        })());
      }));
      response.status(200).json(body);
    } catch (error) {
      response.status(500).send(error);
    }
  },
  addReview: (request, response) => {
    const { body: review } = request;
    Reviews.addReview(review)
      .then(created => response.status(201).json(created))
      .catch(error => response.status(500).send(error));
  },
  updateReview: (request, response) => {
    const property = request.url.split('/').at(-1);
    const review = +request.params.review_id;
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
