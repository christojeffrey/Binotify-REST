import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { Request, Response } from 'express';
import { createSongDto, updateSongDto } from './song.dto';

import { verifyToken } from '../common/authorization';

import { MulterRequest } from '../common/fileUpload';

import { createSongService, deleteSongService, getSongBySingerIdService, updateSongService } from './song.service';

export async function createSong(req: Request, res: Response) {
    const token = req.headers.authorization

    if (!token) {
        res.status(401).send("Unauthorized")
        return
    }

    const verified_user = verifyToken(token)
    if (!verified_user) {
        res.status(401).send("Unauthorized")
        return
    }

    const audio_file_path = (req as MulterRequest).file.path

    const create_song_body = {
        title: req.body.title,
        audio_path: audio_file_path,
        singer_id: verified_user.user_id
    }

    validate(create_song_body, {skipMissingProperties: false
        }).then(errors => {
            if (errors.length > 0) {
                res.status(400).send(errors)
            }
        })
    try {
        await createSongService(create_song_body)
        res.status(200).send({message: "created"})
    } catch(error) {
        res.status(500).send(error)
    }
}

export async function getSongBySingerId(req: Request, res: Response) {
    const token = req.headers.authorization

    if (!token) {
        res.status(401).send("Unauthorized")
        return
    }

    const verified_user = verifyToken(token)
    if (!verified_user) {
        res.status(401).send("Unauthorized")
        return
    }

    try {
        const songs = await getSongBySingerIdService(verified_user.user_id)
        res.status(200).send({songs: songs})
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function deleteSong(req: Request, res: Response) {
    const token = req.headers.authorization

    if (!token) {
        res.status(401).send("Unauthorized")
        return
    }

    const verified_user = verifyToken(token)
    if (!verified_user) {
        res.status(401).send("Unauthorized")
        return
    }

    const song_id = parseInt(req.params.id)
    if (!song_id) {
        res.status(400).send("Song id is required")
        return
    }

    try {
        await deleteSongService(song_id)
        res.status(200).send({message: "deleted"})
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function updateSong(req: Request, res: Response) {
    const token = req.headers.authorization

    if (!token) {
        res.status(401).send("Unauthorized")
        return
    }

    const verified_user = verifyToken(token)
    if (!verified_user) {
        res.status(401).send("Unauthorized")
        return
    }

    const song_id = parseInt(req.params.id)
    if (!song_id) {
        res.status(400).send("Song id is required")
        return
    }

    const audio_file_path = (req as MulterRequest).file?.path

    const update_song_body = {
        title: req.body.title,
        audio_path: audio_file_path,
    }

    validate(update_song_body, {skipMissingProperties: true
    }).then(errors => {
        if (errors.length > 0) {
            res.status(400).send(errors)
            return
        }
    })

    try {
        await updateSongService(song_id, update_song_body)
        res.status(200).send({message: "updated"})
    } catch (error) {
        res.status(500).send(error)
    }
}