const Pesanan = require("../models/pesananModels");
const db = require("../lib/firebase");
const { collection, addDoc, updateDoc, doc } = require("firebase/firestore");

// getPesanan
const getPesanan = async (req, res) => {
  try {
    const result = await Pesanan.getPesanan();
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// getPesananById
const getPesananById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Pesanan.getPesananById(id);
    res.status(200).json({
      message: "Pesanan berhasil dibuat",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// createPesanan
const createPesanan = async (req, res) => {
  try {
    const data = req.body;

    // Simpan data ke Firestore
    const colRef = collection(db, "orders");
    const docRef = await addDoc(colRef, {
      ...data,
      status: "konfirmasi", // Status awal pesanan
    });

    // Query ke MySQL untuk menyimpan data pesanan
    data.id_firebase = docRef.id;
    const result = await Pesanan.createPesanan(data); // Pesanan.createPesanan adalah query ke MySQL

    // Response
    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// updatePesanan
const updatePesanan = async (req, res) => {
  try {
    const id = parseInt(req.params.id); // ID pesanan di MySQL
    const data = req.body;

    // Query ke MySQL untuk update pesanan
    const result = await Pesanan.updatePesanan(id, data); // Pesanan.updatePesanan adalah query ke MySQL

    // Update status di Firestore
    const docRef = doc(db, "orders", result.id_firebase);

    console.log(docRef);

    // Jika dokumen ada, update status
    await updateDoc(docRef, {
      status: data.status,
    });

    // Response
    res.status(200).json({
      message: "Status pesanan berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// deletePesanan
const deletePesanan = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Pesanan.deletePesanan(id);
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// Notifikasi Pesanan
const notifikasiPesanan = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Pesanan.notifikasiPesanan(id);
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

module.exports = {
  getPesanan,
  getPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
};
