-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Keranjang` (
    `id_kerangjang` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` INTEGER NOT NULL,
    `catatan` LONGTEXT NOT NULL,
    `userId_user` INTEGER NULL,
    `menuId_menu` INTEGER NOT NULL,

    PRIMARY KEY (`id_kerangjang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pesanan` (
    `id_pesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `waktu_pesan` DATETIME(3) NOT NULL,
    `userId_user` INTEGER NOT NULL,

    PRIMARY KEY (`id_pesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id_menu` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_menu` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `harga` VARCHAR(191) NOT NULL,
    `gambar` TEXT NOT NULL,
    `kategoriId_kategori` INTEGER NOT NULL,

    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `id_kategori` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_kategori`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pesan_Detail` (
    `id_detail` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` INTEGER NOT NULL,
    `catatan` VARCHAR(191) NOT NULL,
    `menuId_menu` INTEGER NOT NULL,
    `pesananId_pesanan` INTEGER NOT NULL,

    PRIMARY KEY (`id_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Keranjang` ADD CONSTRAINT `Keranjang_userId_user_fkey` FOREIGN KEY (`userId_user`) REFERENCES `User`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Keranjang` ADD CONSTRAINT `Keranjang_menuId_menu_fkey` FOREIGN KEY (`menuId_menu`) REFERENCES `Menu`(`id_menu`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pesanan` ADD CONSTRAINT `Pesanan_userId_user_fkey` FOREIGN KEY (`userId_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_kategoriId_kategori_fkey` FOREIGN KEY (`kategoriId_kategori`) REFERENCES `Kategori`(`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pesan_Detail` ADD CONSTRAINT `Pesan_Detail_pesananId_pesanan_fkey` FOREIGN KEY (`pesananId_pesanan`) REFERENCES `Pesanan`(`id_pesanan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pesan_Detail` ADD CONSTRAINT `Pesan_Detail_menuId_menu_fkey` FOREIGN KEY (`menuId_menu`) REFERENCES `Menu`(`id_menu`) ON DELETE RESTRICT ON UPDATE CASCADE;
