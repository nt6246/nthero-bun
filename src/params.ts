const DEFAULT_QUALITY = 40;

export default function params(req, res, next) {
  let url = req.query.url;
  if (Array.isArray(url)) url = url.join('&url=');
  if (!url) return res.end('bandwidth-hero-proxy');

  url = url.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');
  req.params.url = url;
  // req.params.webp = !req.query.jpeg;
  // req.params.avif = !req.query.webp;
  req.params.webp = !req.query.avif;
  // req.params.grayscale = req.query.bw != 0;
  req.params.quality = parseInt(req.query.l, 10) || DEFAULT_QUALITY;

  // console.log('query', req.query);
  // console.log('req.params.url', req.params.url);
  // console.log('req.params.webp', req.params.webp);
  // console.log('req.params.quality', req.params.quality);

  // return res.end('data: ' + JSON.stringify(req.query));

  next();
}
