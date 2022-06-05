const payment = require('../controllers/payment');
const notification = require('../controllers/notification');
const user = require('../controllers/user');

const wrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const authentication = (req, res, next) => {
  const { key } = req.query;
  const API_KEY = process.env.API_KEY;

  if (!key || key !== API_KEY) {
    res.status(401).send({
      error: 'Invalid API key',
      code: '401',
      message: 'Please ensure your API key is valid'
    });
    return false;
  }

  next();
};

module.exports = (app) => {
  app.get('/', (req, res) => res.send('remove test'));

  app.post('/api/v1/payment', authentication, wrap(payment.create));

  app.post('/api/v1/payment/cancel/:id', authentication, wrap(payment.cancel));

  app.post('/api/v1/notification', authentication, wrap(notification.handle));

  app.post('/api/v1/user/:id', authentication, wrap(user.save));
};
