const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// configure the AWS SDK with your access key and secret key
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: "us-east-1",
});

// create an S3 client
const s3 = new AWS.S3();

function uploadFileToS3(file, bucket_name, fileName, is_public = false) {
  const params = {
    Bucket: bucket_name,
    Key: fileName,
    Body: file.buffer,
    ACL: is_public ? "public-read" : "private",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}

// Custom middleware to set the bucket name
const setBucketName = (req, res, next, bucketName, Access, is_image) => {
  req.bucketName = bucketName;
  req.bucket_access = Access;
  req.is_image = is_image;
  next();
};

const uploadFilesMiddleWare = () => {
  try {
    return multer({
      storage: multerS3({
        s3: s3,
        bucket: function (req, file, cb) {
          cb(null, req.bucketName);
        },
        acl: function (req, file, cb) {
          cb(null, req.bucket_access);
        },
        metadata: (req, file, callBack) => {
          callBack(null, { fieldName: file.fieldname });
        },
        // contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const { brandID, productID, variantID } = req.params;
          cb(
            null,
            `${brandID}/${productID}_${variantID}${
              req.is_image ? "_" + Date.now() : ""
            }_${file.originalname}`
          );
        },
      }),
    });
  } catch (e) {
    console.log(e);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
});

module.exports = {
  upload,
  uploadFilesMiddleWare,
  uploadFileToS3,
  setBucketName,
};
