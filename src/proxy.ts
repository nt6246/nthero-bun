// const request = require('request');
import request from 'request';

// const pick = require('lodash').pick;
import pick from 'lodash';

// const shouldCompress = require('./shouldCompress');
import shouldCompress from './shouldCompress';

// const redirect = require('./redirect');
import redirect from './redirect';

// const compress = require('./compress');
import compress from './compress';

// const bypass = require('./bypass');
import bypass from './bypass';

// const copyHeaders = require('./copyHeaders');
import copyHeaders from './copyHeaders';

export default function proxy(req, res) {
  // console.log('req', req);
  
  request.get(
    req.params.url,
    {
      /*headers: {
        ...pick(req.headers, ['cookie', 'dnt', 'referer']),
        'user-agent': 'Bandwidth-Hero Compressor',
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
        via: '1.1 bandwidth-hero'
      },*/
      headers: {...pick(req.headers, ['user-agent', 'cookie', 'dnt', 'referer'])},
      // timeout: 10000,
      timeout: 50000,
      // maxRedirects: 5,
      maxRedirects: 3,
      encoding: null,
      strictSSL: false,
      gzip: true,
      jar: true
    },
    (err, origin, buffer) => {
      if (err || origin.statusCode >= 400) return redirect(req, res);

      copyHeaders(origin, res);
      res.setHeader('content-encoding', 'identity');
      req.params.originType = origin.headers['content-type'] || '';
      req.params.originSize = buffer.length;

      if (shouldCompress(req)) {
        compress(req, res, buffer);
      } else {
        bypass(req, res, buffer);
      }
    }
  );
}
