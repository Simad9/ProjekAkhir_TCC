const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedKeranjang() {
  const datas = [
    {
      jumlah: 1,
      catatan: "tidak ada",
      menuId_menu: 1,
      userId_user: 1
    },
    {
      jumlah: 2,
      catatan: "tidak ada",
      menuId_menu: 1,
      userId_user: 2
    }
  ]

  for (const data of datas) {
    await prisma.keranjang.create({
      data: data
    })
  }

  console.log("Keranjang seeded successfully.");
}

module.exports = {  seedKeranjang };