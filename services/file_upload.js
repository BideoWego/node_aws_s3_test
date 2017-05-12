const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const bucket = process.env.AWS_S3_BUCKET;
const mime = require('mime');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');


const FileUploader = {};


FileUploader.single = (field) => upload.single(field);


FileUploader.upload = (file) => {
  const extension = mime.extension(file.mimetype);
  const filename = path.parse(file.name).name;

  return new Promise((resolve, reject) => {
    const options = {
      Bucket: bucket,
      Key: `${ filename }-${ md5(Date.now()) }.${ extension }`,
      Body: file.data
    };

    s3.upload(options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const photos = require('./../data/photos');
        const photo = {
          url: data.Location,
          name: data.key
        };
        photos[data.key] = photo;
        fs.writeFileSync(
          './data/photos.json',
          JSON.stringify(photos, null, 2)
        );
        resolve(photo);
      }
    });
  });
};



module.exports = FileUploader;



