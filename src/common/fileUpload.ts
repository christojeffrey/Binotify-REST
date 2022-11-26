import { Request} from 'express';

const multer = require("multer");
const path = require("path");

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export interface MulterRequest extends Request {
    file: any
}
export const diskStorage = multer.diskStorage({
    // config file destination
    destination: (req: Request, file: Express.Multer.File, callback: DestinationCallback) => {
      callback(null, path.join(__dirname, "../../uploads/"));
    },

    // config file name
    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback) => {
      callback(null, Date.now() + path.extname(file.originalname));
    }

  });