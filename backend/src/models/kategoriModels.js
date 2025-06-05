const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TO DO
// getKategori
const getKategori = async () => {
  const result = await prisma.kategori.findMany();
  return result;
};

// getKategoriById
const getKategoriById = async (id) => {
  const result = await prisma.kategori.findUnique({
    where: {
      id_kategori: id,
    },
  });
  return result;
};

// createKategori
const createKategori = async (data) => {
  const result = await prisma.kategori.create({
    data: data,
  });
  return result;
};

// updateKategori
const updateKategori = async (id, data) => {
  const result = await prisma.kategori.update({
    where: {
      id_kategori: id,
    },
    data: data,
  })  
}

// deleteKategori
const deleteKategori = async (id) => {
  const result = await prisma.kategori.delete({
    where: {
      id_kategori: id,
    },
  });
  return result;
}

module.exports = {
  getKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
};