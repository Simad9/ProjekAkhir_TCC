const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TO DO
// getMenu
const getMenu = async () => {
  const result = await prisma.menu.findMany();
  return result;
}

// getMenuById
const getMenuById = async (id) => {
  const result = await prisma.menu.findUnique({
    where: {
      id_menu: id,
    },
  });
  return result;
}

// createMenu
const createMenu = async (data) => {
  const result = await prisma.menu.create({
    data: data,
  });
  return result;
}

// updateMenu
const updateMenu =  async (id, data) => {
  const result = await prisma.menu.update({
    where: {
      id_menu: id,
    },
    data: data,
  });
  return result;
}

// deleteMenu
const deleteMenu = async (id) => {
  const result = await prisma.menu.delete({
    where: {
      id_menu: id,
    },
  });
  return result;
}

module.exports = {
  getMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
}