	
const multer = require('multer');
 
var storage = multer.memoryStorage()
var uploadFoto = multer({storage: storage});
var upload=multer();
var storageExcel=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './importar')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var uploadExel = multer({ 
    storage: storageExcel,
    fileFilter : function(req, file, callback) {
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Extención del archivo no valida'));
        }
        callback(null, true);
    }
});


module.exports = {
    uploadFoto,
    uploadExel,
    upload
};