import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { Request, Response } from "express";
import { createSongDto, getSubscribedSongsRequestDto, updateSongDto } from "./song.dto";

import { verifyToken } from "../common/authorization";

import { MulterRequest } from "../common/fileUpload";

import { createSongService, deleteSongService, getSongBySingerIdService, updateSongService } from "./song.service";
import { errorFormatter } from "../common/errorFormatter";

const path = require("path");
const fetch = require("node-fetch");
let builder = require("xmlbuilder");
var parseString = require("xml2js").parseString;

export async function getSongAudioFile(req: Request, res: Response) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  const verified_user = verifyToken(token);
  if (!verified_user) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  if (verified_user.is_admin) {
    res.status(401).send(errorFormatter("Unauthorized, only singer can access"));
    return;
  }

  const audio_path = req.params.audio_path;
  if (!audio_path) {
    res.status(400).send(errorFormatter("Please provide audio path"));
    return;
  }
  try {
    res.sendFile(path.join(__dirname + "/../../uploads/" + audio_path));
  } catch (error) {
    res.status(401).send(errorFormatter(error));
  }
}

export async function createSong(req: Request, res: Response) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  const verified_user = verifyToken(token);
  if (!verified_user) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  if (verified_user.is_admin) {
    res.status(401).send(errorFormatter("Unauthorized, only singer can access"));
    return;
  }

  const audio_file_path = (req as MulterRequest).file.filename;
  console.log((req as MulterRequest).file);
  const create_song_body = {
    title: req.body.title,
    audio_path: audio_file_path,
    singer_id: verified_user.user_id,
  };

  validate(create_song_body, { skipMissingProperties: false }).then((errors) => {
    if (errors.length > 0) {
      res.status(400).send(errorFormatter(erros));
    }
  });
  try {
    await createSongService(create_song_body);
    res.status(200).send({ message: "created" });
  } catch (error) {
    res.status(500).send(errorFormatter(error));
  }
}

export async function getSongBySingerId(req: Request, res: Response) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  const verified_user = verifyToken(token);
  if (!verified_user) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  if (verified_user.is_admin) {
    res.status(401).send(errorFormatter("Unauthorized, only singer can access"));
    return;
  }

  try {
    const songs = await getSongBySingerIdService(verified_user.user_id);
    res.status(200).send({ songs: songs });
  } catch (error) {
    res.status(500).send(errorFormatter(error));
  }
}

export async function deleteSong(req: Request, res: Response) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send(errorFormatter("Unauthorized, only singer can access"));
    return;
  }

  const verified_user = verifyToken(token);
  if (!verified_user) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  if (verified_user.is_admin) {
    res.status(401).send(errorFormatter("Unauthorized, only singer can access"));
    return;
  }

  const song_id = parseInt(req.params.id);
  if (!song_id) {
    res.status(400).send(errorFormatter("Song id is required"));
    return;
  }

  try {
    await deleteSongService(song_id);
    res.status(200).send({ message: "deleted" });
  } catch (error) {
    res.status(500).send(errorFormatter(error));
  }
}

export async function updateSong(req: Request, res: Response) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send(errorFormatter("Song id is required"));
    return;
  }

  const verified_user = verifyToken(token);
  if (!verified_user) {
    res.status(401).send(errorFormatter("Unauthorized"));
    return;
  }

  if (verified_user.is_admin) {
    res.status(401).send(errorFormatter("Unauthorized, only singer can access"));
    return;
  }

  const song_id = parseInt(req.params.id);
  if (!song_id) {
    res.status(400).send(errorFormatter("Song id is required"));
    return;
  }

  const audio_file_path = (req as MulterRequest).file?.path;

  const update_song_body = {
    title: req.body.title,
    audio_path: audio_file_path,
  };

  validate(update_song_body, { skipMissingProperties: true }).then((errors) => {
    if (errors.length > 0) {
      res.status(400).send(errorFormatter(errors));
      return;
    }
  });

  try {
    await updateSongService(song_id, update_song_body);
    res.status(200).send({ message: "updated" });
  } catch (error) {
    res.status(500).send(errorFormatter(error));
  }
}

export async function getSubscribedSongs(req: Request, res: Response) {
  const body = plainToClass(getSubscribedSongsRequestDto, req.body);
  validate(body, { skipMissingProperties: false }).then((errors: any) => {
    if (errors.length > 0) {
      res.status(400).send(errorFormatter(errors));
      return;
    }
  });
  let status;
  let message;

  const creator_ids = Array.from(body.creator_ids);

  let songs: Array<any> = [];
  try {
    await Promise.all(
      creator_ids.map(async (id) => {
        let xmlrespond = await sendXMLRequestCheckSubscription(id, body.subscriber_id, process.env.SOAP_API_KEY);
        ({ status, message } = xmlRespondToStatusAndMessage(xmlrespond));
        if (status !== "ACCEPTED") {
          throw new Error("Not subscribed to all creators");
        }
        const curr_songs = await getSongBySingerIdService(id);
        songs.push(...curr_songs);
      })
    );
  } catch (error: any) {
    res.status(500).send(errorFormatter(error.message));
    return;
  }
  res.status(200).send({ songs: songs });
  return;
}

export async function sendXMLRequestCheckSubscription(creator_id: any, user_id: any, api_key: any) {
  // create header
  const header = {
    "Content-Type": "text/xml",
  };

  // create xml using builder
  let xml = builder
    .create("Envelope", { version: "1.0", encoding: "UTF-8" })
    .att("xmlns", "http://schemas.xmlsoap.org/soap/envelope/")
    .ele("Body")
    .ele("checkSubscription", {
      xmlns: "http://services.binotify/",
    })
    .ele("arg0", { xmlns: "" }, creator_id)
    .up()
    .ele("arg1", { xmlns: "" }, user_id)
    .up()
    .ele("arg2", { xmlns: "" }, api_key)
    .end({ pretty: true });

  // print xml
  // console.log("xml", xml);
  let SOAP_URL = "http://localhost:8080/api/binotify";

  let data = await fetch(SOAP_URL || "", {
    method: "POST",
    headers: header,
    body: xml,
    redirect: "follow",
  })
    .then((response: any) => response.text())
    .then((result: any) => {
      // console.log("result", result);
      return result;
    })
    .catch((error: any) => {
      // console.log("error", error);
      return error;
    });
  return data;
}

function xmlRespondToStatusAndMessage(xmlrespond: any) {
  // unpack xmlrespond, get status and message
  let status;
  let message;
  parseString(xmlrespond, function (err: any, result: any) {
    // console.log("status", result["S:Envelope"]["S:Body"][0]["ns2:updateSubscriptionResponse"][0]["return"][0]["status"][0]);
    status = result["S:Envelope"]["S:Body"][0]["ns2:checkSubscriptionResponse"][0]["return"][0]["status"][0];
    // get message if message exists
    if (result["S:Envelope"]["S:Body"][0]["ns2:checkSubscriptionResponse"][0]["return"][0]["message"]) {
      message = result["S:Envelope"]["S:Body"][0]["ns2:checkSubscriptionResponse"][0]["return"][0]["message"][0];
    }
  });
  return { status: status, message: message };
}
