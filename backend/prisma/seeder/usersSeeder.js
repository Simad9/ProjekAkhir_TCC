const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function seedUsers() {
  const users = [
    {
      username: "Jhondoe123",
      password: bcrypt.hashSync("Jhondoe123", 5),
    },
    {
      username: "123",
      password: bcrypt.hashSync("123", 5),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("Users seeded successfully.");
}

module.exports = { seedUsers };
