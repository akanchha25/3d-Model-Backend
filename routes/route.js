const User = require('../controller/userController')
const Design = require('../controller/designController')
const {
    upload,
    uploadFilesMiddleWare,
    setBucketName,
  } = require('../controller/awsS3Controller');
const express = require('express')
const Router = express.Router();


Router.post('/signup',User.signup)
Router.post('/login',User.login)
Router.post('/create-design',[User.valid],Design.createDesign)
Router.get('/view/all-design',Design.viewDesigns)
Router.get('/view-design/:id',Design.designById)
Router.post('/update-design/:id',[User.valid],Design.updateDesignById)
Router.delete('/remove-design/:id',[User.valid],Design.deleteDesignById)
Router.get('/search-design',Design.searchDesign)

Router.put(
    '/upload-images',
    (req, res, next) =>
      setBucketName(
        req,
        res,
        next,
        process.env.AWS_S3_IMAGE_BUCKET_NAME,
        process.env.AWS_S3_DOCUMENT_PUBLIC_ACCESS,
        true
      ),
    uploadFilesMiddleWare().array("images", 16),
    (req, res) => UploadImages(req, res)
  );

module.exports =Router;

