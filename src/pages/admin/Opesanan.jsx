import { useEffect, useState } from "react";
import { databases, storage } from "../../component/Client";
import "../../style/opesanan.css";

export default function Opesanan() {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [select, setSelect] = useState("");
  // get order
  const [order, setOrder] = useState([]);

  async function getOrder() {
    setLoading(true);
    try {
      const resp = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_ORDER
      );
      setOrder(resp.documents);
    } catch (e) {
      null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {}, [order]);

  // Format currency
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  //   input resi
  const [resi, setResi] = useState("");

  async function handleResi(e) {
    setLoading(true);

    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
        e,
        {
          resi: resi,
          status_pengiriman: "Dikirim",
        }
      );
    } catch (e) {
      null;
    } finally {
      setLoading(false);
      setResi("");
    }
  }

  return (
    <>
      <div className="opesanan">
        {loading && (
          <div style={{ width: "calc(100vw - 300px)" }} className="loading">
            <img width={"100px"} src="./loading.svg" alt="loading" />
          </div>
        )}
        <h4>pesanan</h4>
        <br />
        <div className="o-content">
          {order
            .slice()
            .reverse()
            .filter((e) => e.user_id[0].email !== "daffarere14@gmail.com")
            .map((e, i) => (
              <div
                onClick={() => setSelect(e.$id)}
                className={`o-c-list ${e.$id == select ? "o-c-list-on" : ""}`}
                key={i}
              >
                <div className="o-c-l-head">
                  <img
                    src={storage.getFilePreview(
                      import.meta.env.VITE_APPWRITE_BUCKET,
                      e.cart[0].produk.gambar[0]
                    )}
                    alt="image product"
                  />
                  <span>
                    <p>{e.cart[0].produk.nama_produk}</p>
                    <p>{e.jumlah} produk</p>
                    <p>{formatter.format(e.total)}</p>
                  </span>
                  <span>
                    <p>{e.user_id[0].nama_user}</p>
                    <p>{e.user_id[0].email}</p>
                  </span>
                  <span style={{ width: "500px" }}>
                    <p
                      className={`${
                        e.status_pembayaran === "Belum di bayar"
                          ? "status"
                          : "status-ok"
                      }`}
                    >
                      {e.status_pembayaran}
                    </p>
                  </span>
                </div>
                <div className="o-c-l-body">
                  <div className="o-c-l-b-content">
                    <h6>Product Info :</h6>
                    <div className="o-c-l-b-cart">
                      {e.cart.map((e, i) => (
                        <div key={i} className="o-c-l-b-c-list">
                          <div>
                            <img
                              width={"60px"}
                              src={storage.getFilePreview(
                                import.meta.env.VITE_APPWRITE_BUCKET,
                                e.produk.gambar[0]
                              )}
                              alt="img list"
                            />
                            <span>
                              <p>{e.produk.nama_produk}</p>
                              <p>{formatter.format(e.produk.harga)}</p>
                              <p>{e.produk.merk}</p>
                              <p>{e.produk.kategori}</p>
                            </span>
                          </div>

                          <span
                            style={{ border: "1px solid grey", padding: "5px" }}
                          >
                            <p>Warna : {e.warna}</p>
                            <p>Ukuran : {e.ukuran}</p>
                            <p>Jumlah : {e.jumlah}</p>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="o-c-l-b-content o-c-l-b-content2">
                    <h6>User Info :</h6>
                    <div className="o-c-l-b-border">
                      <span>
                        <p>Nama :</p>
                        <p>{e.user_id[0].nama_user}</p>
                      </span>
                      <span>
                        <p>Email :</p>
                        <p>{e.user_id[0].email}</p>
                      </span>
                      <span>
                        <p>Phone :</p>
                        <p>{e.user_id[0].phone_user}</p>
                      </span>
                      <span>
                        <p>Alamat :</p>
                        <p>{e.user_id[0].alamat}</p>
                      </span>
                    </div>
                    <br />
                    <h6>Delivery Info :</h6>
                    <div>
                      <div className="o-c-l-b-c-up">
                        <p>Pengiriman :</p>
                        <p>{e.kirim_name}</p>
                      </div>
                      <div className="o-c-l-b-c-up">
                        <p>Service :</p>
                        <p>{e.kirim_service}</p>
                      </div>
                      <div className="o-c-l-b-c-up">
                        <p>Estimasi :</p>
                        <p>{e.kirim_estimated}</p>
                      </div>
                      <div className="o-c-l-b-c-up">
                        <p>Harga :</p>
                        <p>{formatter.format(e.kirim_price)}</p>
                      </div>
                    </div>
                    <br />
                    <div className="form-order-dashboard">
                      <input
                        value={resi}
                        onChange={(e) => setResi(e.target.value)}
                        type="text"
                        placeholder={`${
                          e.resi !== "" ? e.resi : "Input resi...."
                        }`}
                      />
                      <button onClick={() => handleResi(e.$id)}>Set</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
