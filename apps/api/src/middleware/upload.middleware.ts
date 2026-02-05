import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: maxFileSize,
    },
    fileFilter,
});

export const uploadMemory = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: maxFileSize,
    },
    fileFilter,
});
