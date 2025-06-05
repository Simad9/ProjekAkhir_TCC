const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedMenu() {
  const datas = [
    {
      nama_menu: "Ayam Bakar",
      deskripsi: "mantap ayamnya",
      harga: 10000,
      gambar: "ini_gambar.jpg",
      kategoriId_kategori: 1,
    },
    {
      nama_menu: "Ayam Goreng",
      deskripsi: "mantap ayamnya",
      harga: 10000,
      gambar: "ini_gambar.jpg",
      kategoriId_kategori: 1,
    }   
  ]

  for (const data of datas) {
    await prisma.menu.create({
      data: data
    })
  }

  console.log("Menu seeded successfully.");
}

module.exports = { seedMenu };