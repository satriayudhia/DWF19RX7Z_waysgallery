const multer = require("multer");

exports.upload = (file) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = {
        message: "Only image files are allowed!",
      };
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };

  const maxSize = 10 * 1000 * 1000; //Maximum file size 10 MB

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: file,
      maxCount: 4,
    },
  ]);

  //middleware handler
  return (req, res, next) => {
    upload(req, res, function (err) {
      //munculkan error jika validasi gagal
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      //munculkan error jika file tidak disediakan
      if (!req.files && !err)
        return res.status(400).send({
          message: "Please select images to upload",
        });

      //munculkan error jika melebihi max size
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10MB",
          });
        }
        return res.status(400).send(err);
      }
      //jika oke dan aman lanjut ke controller
      //akses nnti pake req.files
      return next();
    });
  };
};
