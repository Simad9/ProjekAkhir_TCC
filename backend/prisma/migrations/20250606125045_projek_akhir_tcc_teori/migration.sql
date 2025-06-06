/*
  Warnings:

  - Added the required column `id_firebase` to the `Pesanan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pesanan` ADD COLUMN `id_firebase` VARCHAR(191) NOT NULL;
