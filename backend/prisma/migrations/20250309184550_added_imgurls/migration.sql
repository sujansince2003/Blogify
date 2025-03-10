/*
  Warnings:

  - Added the required column `coverImgUrl` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAvatarUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "coverImgUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userAvatarUrl" TEXT NOT NULL;
