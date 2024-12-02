import { useEffect, useState } from "react";
import { account, databases, storage } from "../component/Client";
import Navbar from "../component/Navbar";
import "../style/profil.css";
import Footer from "./Footer";
import { ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  // get user
  const [user, setUser] = useState([]);
  const [sesi, setSesi] = useState([]);
  async function getUser() {
    setLoading(true);
    try {
      const resp1 = await account.get();
      const resp2 = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_USER,
        resp1.$id
      );
      const resp3 = await account.getSession("current");
      setSesi(resp3.provider ? resp3.provider : null);
      setUser(resp2 ? resp2 : null);
    } catch (e) {
      null;
      nav(-1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  //   get file
  const [file, setFile] = useState();

  async function UpdateProfil(e) {
    setLoading(true);
    e.preventDefault();
    try {
      const cekimg = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_USER,
        user.$id
      );
      if (cekimg.picture_id === null) {
        const ambilidfoto = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          ID.unique(),
          file
        );
        await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_USER,
          cekimg.$id,
          {
            picture_id: ambilidfoto.$id,
          }
        );
        // ____________________________________________________
      } else {
        await storage.deleteFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          cekimg.picture_id
        );
        const ambilidfoto = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          ID.unique(),
          file
        );
        await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_USER,
          cekimg.$id,
          {
            picture_id: ambilidfoto.$id,
          }
        );
      }
    } catch (e) {
      null;
      setLoading(false);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  //   get info
  const [nama, setNama] = useState(user.nama_user);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone_user);

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_USER,
        user.$id,
        {
          nama_user: nama,
          email: email,
          phone_user: phone,
        }
      );
    } catch (e) {
      null;
      setLoading(false);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  //   get alamat
  const [alamat, setAlamat] = useState(user.alamat);

  async function hanldeAlamat(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_USER,
        user.$id,
        {
          alamat: alamat,
        }
      );
    } catch (e) {
      null;
      setLoading(false);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  // get wilayah
  const [wvalue, setWvalue] = useState("tidakada");
  const [wilayah, setWilayah] = useState("");
  const [daftarw, setDaftarw] = useState([]);

  async function getWilayah(e) {
    setWvalue("ada");
    e.preventDefault();
    try {
      const resp = await axios.get(
        `https://api.binderbyte.com/v1/district?courier=jne&type=origin&search=${wilayah}`
      );
      setDaftarw(resp.data ? resp.data.data : null);
      setWvalue("hilang");
    } catch (e) {
      setWvalue("error");
    }
  }

  async function hanldeWilayah(e) {
    setLoading(true);
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_USER,
        user.$id,
        {
          wilayah: e.split(" ")[0],
        }
      );
    } catch (e) {
      null;
    } finally {
      getUser();
      setLoading(false);
      window.location.reload();
    }
  }

  //   update password
  const [old, setOld] = useState("");
  const [neww, setNeww] = useState("");
  const [error, setError] = useState(false);
  const [emess, setEmess] = useState("");
  async function handleUppass(e) {
    e.preventDefault();
    setLoading(true);
    if (old !== "" && neww !== "") {
      try {
        await account.updatePassword(neww, old);
      } catch (e) {
        null;
      } finally {
        setLoading(false);
        window.location.reload();
      }
    } else {
      setLoading(false);
      setError(true);
      setEmess("Masukan password lama dan passwor baru anda");
    }
  }
  return (
    <>
      <Navbar />
      {loading && (
        <div className="loading">
          <img width={"100px"} src="./loading.svg" alt="loading" />
        </div>
      )}
      <div className="container">
        <div className="navbar-in"></div>

        <div className="profil">
          <div className="p-left">
            <div className="p-image">
              <span>
                <input
                  className="p-i-form"
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                />
                <img
                  className="p-userimg"
                  loading="lazy"
                  src={`${
                    file
                      ? URL.createObjectURL(file)
                      : user.picture_id
                      ? storage.getFilePreview(
                          import.meta.env.VITE_APPWRITE_BUCKET,
                          user.picture_id
                        )
                      : user.picture_profile
                      ? user.picture_profile
                      : "./profill.svg"
                  }`}
                  alt="user"
                />
              </span>
              <p>Klik foto untuk mengubah profil</p>
              <br />

              {file ? (
                <button onClick={UpdateProfil} className="p-changeimg">
                  Ubah Profil
                </button>
              ) : null}
            </div>
            <br />
            <div className="p-l-info">
              <span onSubmit={handleUpdate} className="p-l-i-span">
                <form>
                  <p>Nama :</p>
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    type="text"
                    placeholder={user.nama_user}
                  />
                  <p>Email :</p>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder={user.email}
                  />
                  <p>Phone :</p>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    placeholder={
                      user.phone_user ? user.phone_user : "Tambahkan nomor..."
                    }
                  />
                  <button>Simpan</button>
                </form>
              </span>
            </div>
          </div>
          <div className="p-right">
            <div className="p-l-i-span">
              <div className="p-r-info">
                <p>Alamat :</p>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder={
                    user.alamat ? user.alamat : "Isikan alamat anda...."
                  }
                ></textarea>
                <button onClick={hanldeAlamat}>Simpan</button>
              </div>
            </div>
            <br />
            <br />
            <p>Wilayah :</p>
            <span className="wilayah">
              <input
                value={wilayah}
                onChange={(e) => setWilayah(e.target.value)}
                type="text"
                placeholder={
                  user.wilayah ? user.wilayah : "Masukan wilayah...."
                }
              />
              <button onClick={getWilayah}>Cari</button>
            </span>
            {wvalue === "tidakada" ? null : wvalue === "ada" ? (
              <img className="w-loading" src="./loading.svg" alt="loading" />
            ) : wvalue === "hilang" ? (
              daftarw.map((e, i) => (
                <div
                  className="w-list"
                  key={i}
                  onClick={() => hanldeWilayah(e.label)}
                >
                  <p>{e.label}</p>
                </div>
              ))
            ) : wvalue == "error" ? (
              <p>*Wilayah tidak terdaftar</p>
            ) : null}
            <br />
            <br />
            <div className="p-r-bahaya">
              <h6 style={{ textDecoration: "underline", color: "#ff2323" }}>
                Danger zone!
              </h6>
              <br />
              {sesi == "google" && (
                <p>
                  Anda login menggunakan Google oAuth,anda tidak bisa merubah
                  password!
                </p>
              )}
              {sesi !== "google" && (
                <form onSubmit={handleUppass} className="danger">
                  <p>Update Password :</p>
                  <input
                    style={{
                      border: error
                        ? `2px solid red`
                        : "2px solid rgba(17, 17, 17, 0.3)",
                    }}
                    value={old}
                    onChange={(e) => setOld(e.target.value)}
                    type="password"
                    placeholder="Password Lama...."
                  />
                  <input
                    style={{
                      border: error
                        ? `2px solid red`
                        : "2px solid rgba(17, 17, 17, 0.3)",
                    }}
                    value={neww}
                    onChange={(e) => setNeww(e.target.value)}
                    type="password"
                    placeholder="Password Baru"
                  />
                  {error && <p style={{ color: "#ff2323" }}>{emess}</p>}
                  <button>Simpan</button>
                </form>
              )}
              <br />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
