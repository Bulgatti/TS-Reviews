const axios = require('axios');

describe('Routes Unit Tests', () => {
  const URL = 'http://localhost:1337';

  it('should GET from /reviews', async () => {
    const { status } = await axios.get(`${URL}/reviews/?product_id=40345`);
    expect(status).toEqual(200);
  });

  it('should GET from /reviews/meta', async () => {
    const { status } = await axios.get(`${URL}/reviews/meta/?product_id=40345`);
    expect(status).toEqual(200);
  });
});
