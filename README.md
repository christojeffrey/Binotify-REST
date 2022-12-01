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

note: we use prisma. data base can be checked inside prisma folder

## we use postman to test the api. we put the collection in the repository

# work distribution

# setup repo with docker

go to Binotify-Config repository. the that repo will setup every other repo.
