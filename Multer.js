const multer = require('multer');
const shortid = require('shortid');

const multerConfig = {
    storage: fileStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,__dirname+'../../public/uploads');
        },
        filename: (req,file,cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb) {
        if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            cb(null, true);
        } else {
            cb(new Error('wrong extension'));
        }
    }
}

// upload method 
const upload = multer(multerConfig).single('imagen');

module.exports = upload;