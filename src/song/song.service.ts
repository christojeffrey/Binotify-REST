import prisma from "../../prisma/prisma-client";
import { createSongDto, updateSongDto } from "./song.dto";

export async function getSongByIdService(id: number) {
  try {
    return prisma.song.findUnique({
      where: {
        song_id: id,
      },
    });
  } catch (error) {
    throw new Error("Error fetching song data");
  }
}

export async function getSongBySingerIdService(singer_id: number) {
  try {
    return prisma.song.findMany({
      where: {
        singer_id: singer_id,
      },
    });
  } catch (error) {
    throw new Error("Error fetching song data");
  }
}

export async function createSongService(create_song_body: createSongDto) {
  try {
    console.log("testing", create_song_body);

    return prisma.song.create({
      data: {
        title: create_song_body.title,
        audio_path: create_song_body.audio_path,
        singer_id: 2,
      },
    });
  } catch (error) {
    throw new Error("Error creating user");
  }
}

export async function deleteSongService(id: number) {
  try {
    return prisma.song.delete({
      where: {
        song_id: id,
      },
    });
  } catch (error) {
    throw new Error("Error deleting song");
  }
}

export async function updateSongService(id: number, update_song_body: updateSongDto) {
  try {
    return prisma.song.update({
      where: {
        song_id: id,
      },
      data: update_song_body,
    });
  } catch (error) {
    throw new Error("Error updating song");
  }
}
