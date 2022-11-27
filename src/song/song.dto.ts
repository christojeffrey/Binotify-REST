import { Expose } from 'class-transformer'
import { IsDefined } from 'class-validator';

export class createSongDto {
    @IsDefined()
    @Expose()
    title: string;

    @IsDefined()
    @Expose()
    audio_path: string;

    @IsDefined()
    @Expose()
    singer_id: number;
}

export class updateSongDto {
    @Expose()
    title: string;

    @Expose()
    audio_path: string;
}

export class getSubscribedSongsRequestDto{
    @IsDefined()
    @Expose()
    subscriber_id: number;

    @IsDefined()
    @Expose()
    creator_ids: Int16Array;
}