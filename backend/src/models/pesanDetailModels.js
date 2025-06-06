const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TO DO
// getPesanDetail
const getPesanDetail = async () => {
  const result = await prisma.pesan_Detail.findMany();
  return result;
};

// getPesanDetailById
const getPesanDetailById = async (id) => {
  const result = await prisma.pesan_Detail.findUnique({
    where: {
      id_detail: id,
    },
  });
  return result;
};

// createPesanDetail
const createPesanDetail = async (data) => {
  const result = await prisma.pesan_Detail.create({
    data: data,
  });
  return result;
};

// updatePesanDetail
const updatePesanDetail = async (id, data) => {
  const result = await prisma.pesan_Detail.update({
    where: {
      id_detail: id,
    },
    data: data,
  });
  return result;
};

// deletePesanDetail
const deletePesanDetail = async (id) => {
  const result = await prisma.pesan_Detail.delete({
    where: {
      id_detail: id,
    },
  });
  return result;
};

module.exports = {
  getPesanDetail,
  createPesanDetail,
  updatePesanDetail,
  deletePesanDetail,
  getPesanDetailById,
};
