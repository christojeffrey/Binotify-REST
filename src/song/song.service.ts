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
    return prisma.song.create({
      data: create_song_body,
    });
  } catch (error) {
    throw new Error("Error creating user");
  }
}

export async function deleteSongService(id: number) {
<<<<<<< HEAD
  try {
    return prisma.song.delete({
      where: {
        song_id: id,
      },
    });
  } catch (error) {
    throw new Error("Error deleting song");
  }
=======
    try {
        return prisma.song.delete({
            where: {
                song_id: id
            }
        })
    } catch (error) {
        throw new Error("Error deleting song")
    }
>>>>>>> eda2cc6cc2bf9f0fce35184c938104e5c852960e
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
    throw new Error("Error deleting song");
  }
}
