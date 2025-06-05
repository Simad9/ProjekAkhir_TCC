const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TO DO
// getKeranjang
const getKeranjang = async () => {
  const result = await prisma.keranjang.findMany();
  return result;
};

// getKeranjangById
const getKeranjangById = async (id) => {
  const result = await prisma.keranjang.findUnique({
    where: {
      id_keranjang: id,
    },
  });
  return result;
};

// createKeranjang
const createKeranjang = async (data) => {
  const result = await prisma.keranjang.create({
    data: data,
  });
  return result;
};

// updateKeranjang
const updateKeranjang = async (id, data) => {
  const result = await prisma.keranjang.update({
    where: {
      id_keranjang: id,
    },
    data: data,
  });
  return result;
};

// deleteKeranjang
const deleteKeranjang = async (id) => {
  const result = await prisma.keranjang.delete({
    where: {
      id_keranjang: id,
    },
  });
  return result;
};

module.exports = {
  getKeranjang,
  getKeranjangById,
  createKeranjang,
  updateKeranjang,
  deleteKeranjang,
};
