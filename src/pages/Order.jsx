import { useEffect, useState } from "react";
import { account, databases, storage } from "../component/Client";
import Navbar from "../component/Navbar";
import "../style/order.css";
import Footer from "./Footer";
import { ID, Permission, Query, Role } from "appwrite";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  // get user
  const [user, setUser] = useState([]);
  async function getUser() {
    try {
      const resp = await account.get();
      setUser(resp);
    } catch (e) {
      null;
    }
  }
  // get keranjang
  const [cart, setCart] = useState([]);
  async function getCart() {
    try {
      const resp1 = await account.get();
      const resp2 = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_CART,
        [Query.equal("user", resp1.$id), Query.equal("visible", true)]
      );
      setCart(resp2.documents);
    } catch (e) {
      null;
    }
  }

  //   pengiriman
  const [deliver, setDeliver] = useState([]);
  async function getDelivery() {
    setLoading(true);
    try {
      const resp1 = await account.get();
      const resp2 = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_USER,
        resp1.$id
      );
      const resp3 = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_CART,
        [Query.equal("user", resp1.$id)]
      );
      let jumlahberat = 0;
      for (let i = 0; i < resp3.documents.length; i++) {
        jumlahberat += resp3.documents[i].jumlah;
      }
      const resp4 = await axios.get(
        `https://api.binderbyte.com/v1/cost?api_key=${
          import.meta.env.VITE_DELIVER_API
        }&courier=jne&origin=yogyakarta&destination=${
          resp2.wilayah
        }&weight=${jumlahberat}&volume=100x100x100`
      );
      setDeliver(resp4.data.data.costs);
    } catch (e) {
      null;
      alert("Silahkan isi alamat terlebih dahulu");
      nav("/profil");
    } finally {
      setLoading(false);
    }
  }

  // Format currency
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  //   select deliver
  const [deliveron, setDeliveron] = useState(false);

  const [dname, setDname] = useState("");
  const [dservice, setDservice] = useState("Pilih pengiriman");
  const [dprice, setDprice] = useState("0");
  const [destimated, setDestimated] = useState("");

  function selectDeliver(name, service, price, estimated) {
    setDname(name),
      setDprice(parseInt(price)),
      setDservice(service),
      setDestimated(estimated);
    handleTotal();
  }

  //summary

  const [subtotal, setSubtotal] = useState();

  function handleTotal() {
    let subtotalawal = 0;
    for (let i = 0; i < cart.length; i++) {
      subtotalawal += cart[i].jumlah * cart[i].produk.harga;
    }
    setSubtotal(parseInt(subtotalawal));
  }

  useEffect(() => {
    getUser();
    getCart();
    getDelivery();
    handleTotal();
  }, []);

  // order button
  const [oloading, setOloading] = useState(false);
  const [senderror, setSenderror] = useState("");
  async function sendOrder() {
    setOloading(true);
    try {
      if (dname === "") {
        setSenderror("Pilih pengriman terlebih dahulu!");
      } else {
        const resp1 = await account.get();
        const resp2 = await databases.getDocument(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_USER,
          resp1.$id
        );
        const resp3 = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_CART,
          [Query.equal("user", resp1.$id), Query.equal("visible", true)]
        );
        let cart = [];
        let jum = 0;
        for (let i = 0; i < resp3.documents.length; i++) {
          const item = resp3.documents[i];
          jum += resp3.documents[i].jumlah;
          cart.push(item.$id);
        }
        const resp4 = await databases.createDocument(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
          ID.unique(),
          {
            user: resp2.$id,
            user_id: [resp2.$id],
            cart: cart,
            kirim_name: dname,
            kirim_service: dservice,
            kirim_price: dprice,
            kirim_estimated: destimated,
            status_pembayaran: "Belum Di Bayar",
            resi: "",
            total: subtotal + dprice,
            alamat: resp2.alamat,
            jumlah: jum,
            status_pengiriman: "Menunggu pembayaran",
          }
        );
        const resp = await axios.post(
          "/app/snap/v1/transactions",
          {
            transaction_details: {
              order_id: resp4.$id,
              gross_amount: resp4.total,
            },
            credit_card: {
              secure: true,
            },
            customer_details: {
              name: "halo",
            },
          },
          {
            headers: {
              Authorization: `Basic ${btoa(import.meta.env.VITE_MIDTRANS)}`,
              "Content-Type": "application/json",
            },
          }
        );
        await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_ORDER,
          resp4.$id,
          {
            link: resp.data.redirect_url,
          }
        );

        window.open(resp.data.redirect_url);
        const resp5 = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_CART,
          [Query.equal("user", resp1.$id), Query.equal("visible", true)]
        );
        for (let i = 0; i < resp5.documents.length; i++) {
          await databases.updateDocument(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_COLLECT_CART,
            resp5.documents[i].$id,
            {
              visible: false,
              id_order: resp4.$id,
            }
          );
        }
      }
    } catch (e) {
      null;
    } finally {
      nav("/pesanan");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="navbar-in"></div>
        {oloading && (
          <div className="loading">
            <img width={"100px"} src="./loading.svg" alt="loading" />
          </div>
        )}
        <div className="order">
          <div className="o-content">
            <h5>Pesanan</h5>
            <br />
            {cart.map((e, i) => (
              <div className="o-c-product" key={i}>
                <img
                  width={"110px"}
                  src={storage.getFilePreview(
                    import.meta.env.VITE_APPWRITE_BUCKET,
                    e.produk.gambar[0]
                  )}
                  alt="product list"
                />
                <div className="o-c-p-desc">
                  <h6>{e.produk.nama_produk}</h6>
                  <p>{formatter.format(e.produk.harga)}</p>
                  <p>
                    {e.ukuran} | {e.warna}
                  </p>
                </div>
                <div className="o-c-p-jumlah">
                  <p>Jumlah : x{e.jumlah}</p>
                </div>
              </div>
            ))}
            <br />
          </div>
          <div className="o-content">
            <h5>Pengiriman</h5>
            <br />
            <div className="o-c-dselect" onClick={() => setDeliveron(true)}>
              {loading ? (
                <img className="w-loading" src="./loading.svg" alt="loading" />
              ) : (
                <div className="o-c-d-list">
                  <img src="./jne.png" alt="jne logo" />
                  <span>
                    <p>{`${dname}(${dservice})`}</p>
                    <p>{formatter.format(dprice)}</p>
                    <p>{destimated}</p>
                  </span>
                </div>
              )}
            </div>
            {deliveron && (
              <div className="o-c-delivery">
                {deliver.map((e, i) => (
                  <div
                    className="o-c-d-list"
                    key={i}
                    onClick={() => {
                      selectDeliver(e.name, e.service, e.price, e.estimated);
                      setDeliveron(false);
                    }}
                  >
                    <img width={"50px"} src="./jne.png" alt="jne logo" />
                    <span>
                      <p>{`${e.name}(${e.service})`}</p>
                      <p>{formatter.format(e.price)}</p>
                      <p>{e.estimated}</p>
                    </span>
                  </div>
                ))}
              </div>
            )}
            <br />
            <h5>Ringkasan Pembayaran</h5>
            <div className="o-c-summary">
              <div className="o-c-s-up">
                <span>
                  <p>Subtotal</p> <p>{formatter.format(subtotal)}</p>
                </span>
                <span>
                  <p>Ongkos Kirim</p>
                  <p>{formatter.format(dprice)}</p>
                </span>
              </div>
              <div className="o-c-s-down">
                <span>
                  <p>Total</p>
                  <p>{formatter.format(subtotal + dprice)}</p>
                </span>
              </div>
              <br />
              <button onClick={sendOrder} className="order-pesan">
                Pesan
              </button>
              <p style={{ color: "#ff2323" }}>{senderror}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
