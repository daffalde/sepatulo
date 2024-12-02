import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import { useContext, useEffect, useState } from "react";
import { account, databases, storage } from "../component/Client";
import "../style/item.css";
import { ID, Query } from "appwrite";
import Footer from "./Footer";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

export default function Product() {
  const { id } = useParams();
  const [produk, setProduk] = useState();
  const [imgselect, setImgselect] = useState();
  const [selectwarna, setSelectwarna] = useState();
  const [selectukuran, setSelectukuran] = useState();
  const [kuantitas, setKuantitas] = useState(1);
  const [errorin, setErrorin] = useState(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    if (notif) {
      setTimeout(() => {
        setNotif(false);
      }, 5000);
    }
  });

  async function getProduk() {
    try {
      const resp = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT,
        id
      );
      setProduk(resp);
    } catch (e) {
      null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduk();
  }, []);

  // Format currency
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  //   fungsi tambahh kuantitas
  function tambah() {
    setKuantitas(kuantitas + 1);
  }
  function kurang() {
    if (kuantitas > 1) {
      setKuantitas(kuantitas - 1);
    }
  }

  // getUser
  const [user, setUser] = useState();
  useEffect(() => {
    async function getUser() {
      const resp = await account.get();
      setUser(resp);
    }
    getUser();
  }, []);

  //   keranjang
  async function handleCart() {
    setLoading(true);
    try {
      if (!selectukuran) {
        setErrorin(true);
      } else if (!selectwarna) {
        setErrorin(true);
      } else {
        const resp = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT_CART,
          [Query.equal("produk", id)]
        );
        if (resp.documents[0]) {
          if (resp.documents.every((e) => e.warna === selectwarna)) {
            if (resp.documents.every((e) => e.ukuran === selectukuran)) {
              await databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_COLLECT_CART,
                resp.documents[0].$id,
                {
                  jumlah: resp.documents[0].jumlah + kuantitas,
                }
              );
            } else {
              await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_COLLECT_CART,
                ID.unique(),
                {
                  produk: id,
                  jumlah: kuantitas,
                  user: user.$id,
                  ukuran: selectukuran,
                  warna: selectwarna,
                  visible: true,
                }
              );
            }
          } else {
            await databases.createDocument(
              import.meta.env.VITE_APPWRITE_DB,
              import.meta.env.VITE_APPWRITE_COLLECT_CART,
              ID.unique(),
              {
                produk: id,
                jumlah: kuantitas,
                user: user.$id,
                ukuran: selectukuran,
                warna: selectwarna,
                visible: true,
              }
            );
          }
        } else {
          await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DB,
            import.meta.env.VITE_APPWRITE_COLLECT_CART,
            ID.unique(),
            {
              produk: id,
              jumlah: kuantitas,
              user: user.$id,
              ukuran: selectukuran,
              warna: selectwarna,
              visible: true,
            }
          );
        }
      }
    } catch (e) {
      null;
      nav("/login");
    } finally {
      setLoading(false);
      setNotif(true);
    }
  }
  return (
    <>
      <Navbar />
      <div className="container">
        <div className={`confirm ${notif ? "confirm-true" : ""}`}>
          <p>Ditambahkan ke keranjang</p>
        </div>
        <div className="navbar-in"></div>
        {loading ? (
          <img className="just-loading2" src="./loading.svg" alt="loading" />
        ) : (
          <div className="store-product">
            <div className="s-p-img">
              <img
                className="s-p-i-cover"
                src={`${storage.getFilePreview(
                  import.meta.env.VITE_APPWRITE_BUCKET,
                  imgselect === undefined
                    ? produk
                      ? produk.gambar[0]
                      : null
                    : imgselect
                )}`}
                alt="img cover"
              />
              <span className="s-p-i-list">
                {produk
                  ? produk.gambar.map((e, i) => (
                      <img
                        className={`s-p-i-l-img ${
                          imgselect === e ? "s-p-i-l-img-select" : ""
                        }`}
                        onClick={() => setImgselect(e)}
                        key={i}
                        src={`${storage.getFilePreview(
                          import.meta.env.VITE_APPWRITE_BUCKET,
                          e
                        )}`}
                        alt="img list"
                      />
                    ))
                  : null}
              </span>
            </div>
            <div className="s-p-desc">
              <h4>{produk ? produk.nama_produk : null}</h4>
              <h5>{formatter.format(produk ? produk.harga : null)}</h5>
              <br />
              <p>{produk ? produk.deskripsi : null}</p>
              <br />
              <p>Warna :</p>
              <div className="s-p-d-wrap">
                {produk
                  ? produk.warna.map((e, i) => (
                      <div
                        onClick={() => setSelectwarna(e)}
                        key={i}
                        className={`s-p-d-detail ${
                          selectwarna === e ? "s-p-d-detail-on" : ""
                        }`}
                      >
                        <p>{e}</p>
                      </div>
                    ))
                  : null}
              </div>

              <br />
              <p>Ukuran :</p>
              <div className="s-p-d-wrap">
                {produk
                  ? produk.ukuran.map((e, i) => (
                      <div
                        onClick={() => setSelectukuran(e)}
                        key={i}
                        className={`s-p-d-detail ${
                          selectukuran === e ? "s-p-d-detail-on" : ""
                        }`}
                      >
                        <p>{e}</p>
                      </div>
                    ))
                  : null}
              </div>
              <br />
              <p>Kuantitas :</p>
              <div className="s-p-d-kuantitas">
                <h5 onClick={kurang}>-</h5>
                <p>{kuantitas}</p>
                <h5 onClick={tambah}>+</h5>
              </div>
              <br />
              <button onClick={handleCart} className="s-p-d-keanjang">
                Masukan Keranjang
              </button>
              <br />
              {errorin && (
                <p className="error-font">
                  Silahkan pilih warna dan ukuran terlebih dahulu
                </p>
              )}
              <br />
              <p>Share :</p>
              <span className="s-p-d-social">
                <TwitterShareButton
                  url={window.location.href}
                  title="Check this out!"
                >
                  <TwitterIcon size={30} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={window.location.href}
                  title="Check this out!"
                >
                  <WhatsappIcon size={30} round />
                </WhatsappShareButton>
                <FacebookShareButton
                  url={window.location.href}
                  hashtag={`Check this out! ${window.location.href}`}
                >
                  <FacebookIcon size={30} round />
                </FacebookShareButton>
                <EmailShareButton
                  url={window.location.href}
                  subject="Check this out!"
                >
                  <EmailIcon size={30} round />
                </EmailShareButton>
              </span>
            </div>
          </div>
        )}

        {loading ? "" : <Footer />}
      </div>
    </>
  );
}
