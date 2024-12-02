import Navbar from "../component/Navbar";
import Footer from "./Footer";
import "../style/pesanan.css";
import { useEffect, useState } from "react";
import { account, databases, storage } from "../component/Client";
import { Query } from "appwrite";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Pesanan() {
  const nav = useNavigate();
  if (Cookies.get("id") == null) {
    nav("/");
  }
  const [loading, setLoading] = useState(false);

  // get pesanan
  const [pesanan, setPesanan] = useState([]);
  const [produk, setProduk] = useState([]);
  async function getPesanan() {
    setLoading(true);
    try {
      const resp1 = await account.get();
      const resp2 = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
        [Query.equal("user", resp1.$id)]
      );
      setPesanan(resp2.documents);
    } catch (e) {
      null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPesanan();
  }, []);

  // Format currency
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // select pesanan
  const [muncul, setMuncul] = useState(false);
  const [lacak, setLacak] = useState(false);
  const [select, setSelect] = useState({});
  const [selectL, setSelectL] = useState(false);
  async function selectOrder(e) {
    setLoading(true);
    setMuncul(true);
    try {
      const resp2 = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
        e
      );
      setSelect(resp2);
      const resp = await axios.get(`/api/v2/${e}/status`, {
        headers: {
          Authorization: `Basic ${btoa(import.meta.env.VITE_MIDTRANS)}`,
        },
      });
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
        e,
        {
          status_pembayaran:
            resp.data.status_code === "200"
              ? "Pembayaran berhasil"
              : resp.data.status_code === "201"
              ? "Pending"
              : "Belum di bayar",
        }
      );
      if (resp.data.status_code === "200") {
        await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
          e,
          {
            status_pengiriman: "Dikemas",
          }
        );
      }
      if (resp2.resi !== "") {
        await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
          e,
          {
            status_pengiriman: "Dikirim",
          }
        );
      }
    } catch (e) {
      null;
    } finally {
      setSelectL(true);
      setLoading(false);
    }
  }

  // lacak
  const [datalacak, setDatalacak] = useState({});
  async function getLacak(e) {
    try {
      const resp = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
        e
      );

      const resp1 = await axios.get(
        `https://api.binderbyte.com/v1/track?api_key=${
          import.meta.env.VITE_DELIVER_API
        }&courier=jne&awb=${resp.resi}`
      );
      setDatalacak(resp1.data.data);
    } catch (e) {
      null;
    } finally {
      setLacak(true);
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
        <div className="pesanan">
          <h4>Pesanan</h4>
          <br />
          <br />
          <div className="p-head">
            <p>Gambar</p>
            <p>Nama produk</p>
            <p>Tanggal pembelian</p>
            <p>Estimasi tiba</p>
            <p>Status pembayaran</p>
            <p>Total belanja</p>
            <p>Status pengiriman</p>
            <p>Action</p>
          </div>
          {pesanan
            .slice()
            .reverse()
            .map((e, i) => (
              <div
                onClick={() => selectOrder(e.$id)}
                key={i}
                className="p-body"
              >
                <p>
                  <img
                    width={"150px"}
                    src={storage.getFilePreview(
                      import.meta.env.VITE_APPWRITE_BUCKET,
                      e.cart[0].produk.gambar[0]
                    )}
                    alt="img"
                  />
                </p>

                <p>
                  {e.cart[0].produk.nama_produk}
                  <br />
                  {e.jumlah > 1 ? `+${e.jumlah - 1} barang lain` : ""}
                </p>
                <p>{e.$createdAt.split("T")[0]}</p>
                <p>{e.kirim_estimated}</p>
                <p
                  className={
                    e.status_pembayaran.toLowerCase() === "belum di bayar"
                      ? "status"
                      : "status-ok"
                  }
                >
                  {e.status_pembayaran}
                </p>
                <p>{formatter.format(e.total)}</p>
                <p style={{ textAlign: "center" }}>{e.status_pengiriman}</p>

                <p>
                  {e.resi !== "" ? (
                    <button onClick={() => getLacak(e.$id)}>Lacak</button>
                  ) : (
                    <button onClick={() => window.open(e.link)}>Bayar</button>
                  )}
                </p>
              </div>
            ))}
          {muncul && (
            <div className="p-detail">
              <div className="p-d-content">
                <div className="p-d-c-list">
                  <span className="entahlah">
                    <h4>Detail Pesanan</h4>
                    <button onClick={() => setMuncul(false)}>
                      <h5>X</h5>
                    </button>
                  </span>

                  {select.cart && Array.isArray(select.cart) ? (
                    select.cart.map((e, i) => (
                      <div key={i} className="p-d-c-l-item">
                        <span>
                          <img
                            src={storage.getFilePreview(
                              import.meta.env.VITE_APPWRITE_BUCKET,
                              e.produk.gambar[0]
                            )}
                            alt="image"
                          />
                          <div style={{ textAlign: "end" }}>
                            <h6>{e.produk.nama_produk}</h6>
                            <p>{formatter.format(e.produk.harga)}</p>
                          </div>
                        </span>

                        <span>
                          <p>
                            {e.ukuran} | {e.warna}
                          </p>
                          <p>Jumlah : x{e.jumlah}</p>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>loading....</p>
                  )}
                  <br />
                  <p style={{ textDecoration: "underline" }}>Alamat :</p>
                  <p>{select.alamat}</p>
                  <br />
                  <p style={{ textDecoration: "underline" }}>
                    Detail Pengiriman :
                  </p>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Jasa Kirim :</p>
                    <p>{`${select.kirim_name}(${select.kirim_service})`}</p>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Estimasi :</p>
                    <p>{select.kirim_estimated}</p>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>No. Resi :</p>
                    <p>{select.resi}</p>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Status pengiriman :</p>
                    <p style={{ textDecoration: "underline" }}>
                      {select.status_pengiriman}
                    </p>
                  </span>
                  <br />
                  <p style={{ textDecoration: "underline" }}>Pembayaran :</p>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Total :</p>
                    <p>{formatter.format(select.total)}</p>
                  </span>

                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Status Pembayaran :</p>
                    <p
                      className={`${
                        select.status_pembayaran === "Pembayaran berhasil"
                          ? "status-ok"
                          : "status"
                      }`}
                    >
                      {select.status_pembayaran}
                    </p>
                  </span>
                  <br />
                  {select.resi !== "" ? (
                    <button
                      onClick={() => getLacak(select.$id)}
                      className="waduh"
                    >
                      Lacak
                    </button>
                  ) : (
                    <button
                      className="waduh"
                      onClick={() => window.open(select.link)}
                    >
                      Bayar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {lacak && (
            <div className="lacak">
              <div className="lacak-content">
                <span className="entahlah">
                  <h4>Lacak pesanan</h4>
                  <button onClick={() => setLacak(false)}>
                    <h5>X</h5>
                  </button>
                </span>
                <br />
                <span className="l-c-in">
                  <p>Resi : </p>
                  <p>{datalacak.summary.awb}</p>
                </span>
                <span className="l-c-in">
                  <p>Tanggal pembelian : </p>
                  <p>{datalacak.summary.date}</p>
                </span>
                <span className="l-c-in">
                  <p>Lokasi pengirim : </p>
                  <p>{datalacak.detail.origin}</p>
                </span>
                <span className="l-c-in">
                  <p>Lokasi penerima : </p>
                  <p>{datalacak.detail.destination}</p>
                </span>
                <br />
                <div className="l-c-body">
                  {datalacak.history
                    .slice()
                    .reverse()
                    .map((e, i) => (
                      <div key={i} className="l-c-track">
                        <div className="l-c-t-visual"></div>
                        <div className="l-c-t-visual2"></div>
                        <span>
                          <h6>{e.desc}</h6>
                          <p>{e.date}</p>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
