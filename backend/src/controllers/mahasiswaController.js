const {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} = require("firebase/firestore");
const db = require("../lib/firebase");

async function getAllMahasiswa(req, res) {
  try {
    const colRef = collection(db, "mahasiswa");
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addMahasiswa(req, res) {
  try {
    const data = req.body;
    const colRef = collection(db, "mahasiswa");
    const docRef = await addDoc(colRef, data);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateMahasiswa(req, res) {
  try {
    const id = req.params.id; // ambil id dokumen dari param URL
    const dataUpdate = req.body; // data baru yang mau di-update

    const docRef = doc(db, "mahasiswa", id);

    await updateDoc(docRef, dataUpdate);

    res.json({ message: `Dokumen ${id} berhasil diupdate` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteMahasiswa(req, res) {
  try {
    const id = req.params.id; // id dokumen yang akan dihapus

    const docRef = doc(db, "mahasiswa", id);

    await deleteDoc(docRef);

    res.json({ message: `Dokumen ${id} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllMahasiswa,
  addMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
};
