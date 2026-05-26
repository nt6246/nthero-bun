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

export default async function compress(req, res, input) {
  // console.log(req.params.url);

  // const format = req.params.webp ? 'webp' : 'jpeg';
  // const format = req.params.avif ? 'avif' : 'webp';
  const format = req.params.webp ? 'webp' : 'avif';

  const img = new Bun.Image(input);
  const output = await img
  .webp({ quality: req.params.quality })
  .toBuffer()
  .catch(e => {
    // if (e.code === "ERR_IMAGE_FORMAT_UNSUPPORTED") return img.webp({ quality: req.params.quality }).bytes();
    return redirect(req, res);
    throw e;
  });

  if (res.headersSent) return redirect(req, res);

  const filename = getfilename(req.params.url);
  const size = Buffer.byteLength(output);

  res.setHeader('content-type', `image/${format}`);
  res.setHeader('content-length', size);
  res.setHeader('content-disposition', `attachment; filename="${filename}.${format}"`);
  res.setHeader('x-original-size', req.params.originSize);
  res.setHeader('x-bytes-saved', req.params.originSize - size);
  res.status(200);
  res.write(output);
  res.end();
}
