const textToJsonPerser = (req, res, next) => {
  if (req?.body?.data) {
    req.body = JSON.parse(req.body.data);
  }
  next();
};
export default textToJsonPerser;
