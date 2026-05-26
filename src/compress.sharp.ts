// const sharp = require('sharp');
import sharp from 'sharp';

// const redirect = require('./redirect');
import redirect from './redirect';

function getfilename(url) {
  try {
    return new URL(url).pathname.split('/').pop();
  } catch (e) {
    return new Date().toISOString().slice(0,19).replace(/:/g, '-');
  }
}

export default function compress(req, res, input) {
  // console.log(req.params.url);

  // const format = req.params.webp ? 'webp' : 'jpeg';
  // const format = req.params.avif ? 'avif' : 'webp';
  const format = req.params.webp ? 'webp' : 'avif';

  sharp(input)
    // .grayscale(req.params.grayscale)
    // .toFormat(format, {
    //   quality: req.params.quality,
    //   progressive: true,
    //   optimizeScans: true

    .toFormat(format, {
      quality: req.params.quality
    })
    .toBuffer((err, output, info) => {
      if (err || !info || res.headersSent) return redirect(req, res);

      const filename = getfilename(req.params.url);

      res.setHeader('content-type', `image/${format}`);
      res.setHeader('content-length', info.size);
      res.setHeader('content-disposition', `attachment; filename="${filename}.${format}"`);
      res.setHeader('x-original-size', req.params.originSize);
      res.setHeader('x-bytes-saved', req.params.originSize - info.size);
      res.status(200);
      res.write(output);
      res.end();
    });
}

