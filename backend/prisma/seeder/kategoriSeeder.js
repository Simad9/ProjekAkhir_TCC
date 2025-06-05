const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedKategori(){
  const datas = [
    {
      nama_kategori: "Makanan",
    },
    {
      nama_kategori: "Minuman",
    }
  ];

  for (const data of datas) {
    await prisma.kategori.create({
      data: data
    })
  }

  console.log("Kategori seeded successfully.");
}

module.exports = { seedKategori };