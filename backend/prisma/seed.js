const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// seeder
const { seedUsers } = require("./seeder/usersSeeder.js");
const { seedKategori } = require("./seeder/kategoriSeeder.js");
const { seedMenu } = require("./seeder/menuSeeder.js");
const { seedPesanan } = require("./seeder/pesananSeeder.js");
const { seedPesanDetail } = require("./seeder/pesanDetailSeeder.js");
const { seedKeranjang } = require("./seeder/keranjangSeeder.js");


// main
async function main() {
  // Hapus Data
  // await prisma.user.deleteMany();
  // await prisma.kategori.deleteMany();
  // await prisma.menu.deleteMany();
  // await prisma.pesanan.deleteMany();
  // await prisma.pesan_Detail.deleteMany();
  // await prisma.keranjang.deleteMany();

  // Seeder
  // await seedUsers();
  // await seedKategori();
  // await seedMenu();
  // await seedPesanan();
  // await seedPesanDetail();
  // await seedKeranjang();

}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
