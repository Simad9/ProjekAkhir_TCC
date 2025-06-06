const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPesanan() {
  const datas = [
    {
      status: "Konfirmasi",
      total_harga: 100000,
      userId_user: 1,
      menuId_menu: 1,
    },
  ];

  for (const data of datas) {
    await prisma.pesanan.create({
      data: data,
    });
  }

  console.log("Pesanan seeded successfully.");
}

module.exports = { seedPesanan };
