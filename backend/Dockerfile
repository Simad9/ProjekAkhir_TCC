FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Menyalin semua kode sumber setelah install dependencies agar build cache maksimal
COPY . ./

# Jalankan prisma generate untuk generate prisma client
RUN npx prisma generate

# Menyalin .env jika dibutuhkan di dalam container
COPY .env ./

EXPOSE 5000

CMD ["node", "index.js"]
