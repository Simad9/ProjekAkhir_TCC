const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPesanan() {
  const datas = [
    {
      status: "Diproses",
      total_harga: 100000,
      waktu_pesan: new Date(),
      userId_user: 1
    },
    {
      status: "Selesai",
      total_harga: 50000,
      waktu_pesan: new Date(),
      userId_user: 2
    }
  ];

   for (const data of datas){
    await prisma.pesanan.create({
      data: data
    })
  }

   console.log("Pesanan seeded successfully.");
}

module.exports = { seedPesanan };