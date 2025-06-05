const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPesanDetail() {
  const datas = [
    {
      jumlah: 1,
      catatan: "tidak ada",
      menuId_menu: 1,
      pesananId_pesanan: 1,
    }
  ]

  for (const data of datas){
    await prisma.pesan_Detail.create({
      data: data
    })
  }

  console.log("Pesan Detail seeded successfully.");
}

module.exports = { seedPesanDetail };