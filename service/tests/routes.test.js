require('dotenv').config();
const axios = require('axios');

describe('Routes Unit Tests', () => {
  const PORT = process.env.PORT ?? 1337;
  const URL = `http://localhost:${PORT}`;

  it('should GET from /reviews', async () => {
    const { status } = await axios.get(`${URL}/reviews/?product_id=40345`);
    expect(status).toEqual(200);
  });

  it('should GET from /reviews/meta', async () => {
    const { status } = await axios.get(`${URL}/reviews/meta/?product_id=40345`);
    expect(status).toEqual(200);
  });
});
