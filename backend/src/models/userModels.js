const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TO DO
// getUser
const getUser = async () => {
  const result = await prisma.user.findMany();
  return result;
};

// getUserById
const getUserById = async (id) => {
  const result = await prisma.user.findUnique({
    where: {
      id_user: id,
    },
  });
  return result;
};

// getUserByUsername
const getUserByUsername = async (username) => {
  const result = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return result;
};

// createUser
const createUser = async (data) => {
  const result = await prisma.user.create({
    data: data,
  });
  return result;
};

// updateUser
const updateUser = async (id, data) => {
  const result = await prisma.user.update({
    where: {
      id_user: id,
    },
    data: data,
  });
  return result;
};

// deleteUser
const deleteUser = async (id) => {
  const result = await prisma.user.delete({
    where: {
      id_user: id,
    },
  });
  return result;
};

const getUserByRefreshToken = async (token) => {
  const result = await prisma.user.findUnique({
    where: {
      refresh_token: token,
    },
  });
  return result;
};

const updateByRefreshToken = async (token, data) => {
  const result = await prisma.user.update({
    where: {
      refresh_token: token,
    },
    data: data,
  });
  return result;
};

const updateById = async (id, data) => {
  const result = await prisma.user.update({
    where: {
      id_user: id,
    },
    data: data,
  });
  return result;
};

module.exports = {
  getUser,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserByRefreshToken,
  updateByRefreshToken,
  updateById,
};
