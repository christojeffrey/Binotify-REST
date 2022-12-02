# description

a webservice to maintain songs and artists. this service is used by Binotify-Premium-App.

# requirements

npm, npx

# manual installation

1. install dependencies `npm install`
2. Buat file .env dengan isi

```
DATABASE_URL="postgresql://sammy:your_password@localhost:5432/my-blog?schema=public"
JWT_SECRET_KEY = <your jwt secret key>
```

3. Migrasi model ke databae menggunakan `npx prisma migrate dev`
4. Run dev `npm run dev`

catatan:

- Poin nomor 3 harus dilakukan bila melakukan modifikasi pada model
- Kalau ngubah .env aja nggak ngubah models jalaninnya `npx prisma generate`

# database schema

```
model User {
  user_id     Int     @id @default(autoincrement())
  email       String  @unique
  password    String
  username    String  @unique
  name        String
  is_admin     Boolean @default(false)
  image_path  String  @default("")
  songs       Song[]
}

model Song {
  song_id    Int    @id @default(autoincrement())
  title      String @db.VarChar(64)
  audio_path String
  singer     User   @relation(fields: [singer_id], references: [user_id])
  singer_id  Int
}
```

note: we use prisma. data base can be checked inside prisma folder

## we use postman to test the api. we put the collection in the repository

# work distribution

| task                                                          | NIM      |
| ------------------------------------------------------------- | -------- |
| endpoint login                                                | 13520045 |
| endpoint register                                             | 13520045 |
| endpoint read song                                            | 13520045 |
| endpoint create song                                          | 1352045  |
| endpoint update song                                          | 13520045 |
| endpoint list all singer                                      | 1352156  |
| setup structure                                               | 13520156 |
| hashing password                                              | 13520156 |
| Get list request subscription                                 | 13520045 |
| checkup                                                       | 13520055 |
| get all premium singer by user                                | 13520156 |
| handle CORS                                                   | 13520055 |
| endpoint update subscription request                          | 13520055 |
| endpoint delete song                                          | 13520045 |
| docker bug, fix hot reload                                    | 13520055 |
| endpoint getUserInfo(not in spec, added to add functionality) | 13520055 |

# setup repo with docker

go to Binotify-Config repository. the that repo will setup every other repo.
