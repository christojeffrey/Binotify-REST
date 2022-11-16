-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Song" (
    "song_id" SERIAL NOT NULL,
    "title" VARCHAR(64) NOT NULL,
    "audio_path" TEXT NOT NULL,
    "singer_id" INTEGER,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("song_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_singer_id_fkey" FOREIGN KEY ("singer_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
