const express = require('express');
const router = express.Router();
const FileUpload = require('./../services/file_upload');



// ----------------------------------------
// Index
// ----------------------------------------
router.get(['/', '/photos'], (req, res) => {
  const photos = require('./../data/photos');
  console.log(photos);
  res.render('photos/index', { photos });
});


// ----------------------------------------
// New
// ----------------------------------------
router.get('/photos/new', (req, res) => {
  res.render('photos/new');
});


// ----------------------------------------
// Create
// ----------------------------------------
const mw = FileUpload.single('photo[file]');
router.post('/photos', mw, (req, res, next) => {
  console.log('Files', req.file);

  FileUpload.upload({
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  })
    .then((data) => {
      console.log(data);
      req.flash('success', 'Photo created!');
      res.redirect('/photos');
    })
    .catch(next);
});




module.exports = router;





