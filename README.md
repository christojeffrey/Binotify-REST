# description

# requirements
npm, npx
# installation
1. install dependencies ```npm install```
2. Buat file .env dengan isi ```DATABASE_URL="postgresql://sammy:your_password@localhost:5432/my-blog?schema=public"```
3. Migrasi model ke databae menggunakan ```npx prisma migrate dev```
4. Run dev ```npm run dev```

catatan:
- Poin nomor 3 harus dilakukan bila melakukan modifikasi pada model
- Kalau ngubah .env aja nggak ngubah models jalaninnya ```npx prisma generate```
# setup repo

go to Binotify-Config repository. the that repo will setup every other repo.
