// how to handle errors: https://zellwk.com/blog/express-errors/
export default (error, _req, res, _next) => {
  res.status(error.status || 500);

  res.json({
    errors: [{ msg: error.message, _stack: error.stack }],
  });
};
