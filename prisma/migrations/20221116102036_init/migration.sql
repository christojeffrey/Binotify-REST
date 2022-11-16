/*
  Warnings:

  - Made the column `singer_id` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_singer_id_fkey";

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "singer_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_singer_id_fkey" FOREIGN KEY ("singer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
