import express from 'express'
const SongRouter = express.Router()
import { createSong, deleteSong, getSongBySingerId, getSubscribedSongs, updateSong } from './song.controller'

import { diskStorage } from '../common/fileUpload';

const multer = require("multer");
const path = require("path");

SongRouter.post('/song', multer({ storage: diskStorage }).single("file"), createSong)
SongRouter.get('/song', getSongBySingerId)
SongRouter.post('/song/premium', getSubscribedSongs)
SongRouter.delete('/song/:id', deleteSong)
SongRouter.patch('/song/:id', multer({ storage: diskStorage }).single("file"), updateSong)


export default SongRouter