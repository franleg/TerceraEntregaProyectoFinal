import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/public/img")
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const uploader = multer({storage : storage});

export { __dirname, createHash, isValidPassword, uploader };