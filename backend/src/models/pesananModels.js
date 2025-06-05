const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TO DO
// getPesanan
const getPesanan = async () => {
  const result = await prisma.pesanan.findMany();
  return result;
};

// getPesananById
const getPesananById = async (id) => {
  const result = await prisma.pesanan.findUnique({
    where: {
      id_pesanan: id,
    },
  });
  return result;
};

// createPesanan
const createPesanan = async (data) => {
  const result = await prisma.pesanan.create({
    data: data,
  });
  return result;
};

// updatePesanan
const updatePesanan = async (id, data) => {
  const result = await prisma.pesanan.update({
    where: {
      id_pesanan: id,
    },
    data: data,
  });
  return result;
};

// deletePesanan
const deletePesanan = async (id) => {
  const result = await prisma.pesanan.delete({
    where: {
      id_pesanan: id,
    },
  });
  return result;
};

module.exports = {
  getPesanan,
  getPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
};
