import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { account, avatar, databases, storage } from "./Client";
import { Query } from "appwrite";
import axios from "axios";
import Cookies from "js-cookie";

export default function Navbar() {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const nav = useNavigate();
  const [cartproduk, setCartproduk] = useState([]);

  // get user
  const [user, setUser] = useState([]);
  async function getUser() {
    try {
      const resp = await account.get();
      const resp1 = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_USER,
        resp.$id
      );
      setUser(resp1 ? resp1 : null);
    } catch (e) {
      null;
    }
  }

  // get cart
  const [jumlah, setJumlah] = useState(0);
  const [harga, setHarga] = useState(0);
  async function getCart() {
    setLoading2(true);
    try {
      const user = await account.get();
      const resp = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_CART,
        [Query.equal("user", user.$id), Query.equal("visible", true)]
      );
      setCartproduk(resp.documents);
      try {
        const a = resp.documents[0].jumlah;
        setLoading(true);
      } catch (e) {
        setLoading(false);
      }
      let totaljumlah = 0;
      let totalharga = 0;
      for (let i = 0; i < resp.documents.length; i++) {
        totaljumlah += resp.documents[i].jumlah;
        totalharga += resp.documents[i].jumlah * resp.documents[i].produk.harga;
      }

      setJumlah(totaljumlah);
      setHarga(totalharga);
    } catch (e) {
      null;
    } finally {
      setLoading2(false);
    }
  }

  useEffect(() => {
    getUser();
    getCart();
  }, []);

  // currency
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // jumlah belanja
  async function tambah(id, total) {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_CART,
        id,
        {
          jumlah: total,
        }
      );
      getCart();
    } catch (e) {
      null;
    }
  }

  async function kurang(id, total) {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_CART,
        id,
        {
          jumlah: total,
        }
      );
      getCart();
    } catch (e) {
      null;
    }
  }

  // hapus dari cart
  async function cartDelete(id) {
    setLoading2(true);
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT_CART,
        id
      );
      getCart();
    } catch (e) {
      null;
    } finally {
      setLoading2(false);
    }
  }

  // tombol show cart
  const [cart, setCart] = useState(false);
  const [profile, setProfile] = useState(false);

  // signout
  async function handleSignout() {
    try {
      await account.deleteSessions();
      Cookies.remove("id");
    } catch (e) {
      null;
    } finally {
      nav("/login");
    }
  }

  return (
    <>
      <div className="navbar">
        <ul className="n-nav">
          <li>
            <NavLink
              className={({ isActive }) =>
                `navlink ${isActive ? "navlink-on" : ""}`
              }
              to={"/"}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `navlink ${isActive ? "navlink-on" : ""}`
              }
              to={"/store"}
            >
              Store
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `navlink ${isActive ? "navlink-on" : ""}`
              }
              to={"/about"}
            >
              About us
            </NavLink>
          </li>
        </ul>
        <img
          src="./logo.svg"
          alt="logo"
          draggable={false}
          style={{ cursor: "pointer" }}
          onClick={() => nav("/")}
        />
        <div className="n-menu">
          <button
            onClick={() => {
              setCart(true);
              getCart();
            }}
          >
            <img src="./cart.svg" alt="cart" />
            <p className="cart-info">{jumlah}</p>
          </button>
          {Cookies.get("id") ? (
            <button onClick={() => setProfile(!profile)}>
              <img
                className="n-m-profil"
                src={`${
                  user.picture_id
                    ? storage.getFilePreview(
                        import.meta.env.VITE_APPWRITE_BUCKET,
                        user.picture_id
                      )
                    : user.picture_profile
                    ? user.picture_profile
                    : "./profill.svg"
                }`}
                alt="profil"
              />
            </button>
          ) : (
            <button
              className="sign-in"
              style={{
                fontSize: "16px",
                width: "fit-content",
                border: "2px solid transparent",
              }}
              onClick={() => nav("/login")}
            >
              Sign in
            </button>
          )}

          <div
            className={`navbar-profile ${profile ? "navbar-profile-on" : ""} `}
          >
            <div className="n-p-head">
              <img
                width={"50px"}
                style={{ objectFit: "cover", objectPosition: "center" }}
                src={`${
                  user.picture_id
                    ? storage.getFilePreview(
                        import.meta.env.VITE_APPWRITE_BUCKET,
                        user.picture_id
                      )
                    : user.picture_profile
                    ? user.picture_profile
                    : "./profill.svg"
                }`}
                alt="profile"
              />
              <span>
                <h6>{user.nama_user}</h6>
                <p>{user.email}</p>
              </span>
            </div>
            <div className="n-p-body">
              <button onClick={() => nav("/profil")}>
                <img src="./n-user.svg" alt="user" /> Profil
              </button>
              <button onClick={() => nav("/pesanan")}>
                <img src="./n-order.svg" alt="order" /> Pesanan
              </button>
            </div>

            <button
              onClick={handleSignout}
              style={{
                backgroundColor: "#ff2323",
                color: "white",
                width: "100%",
                border: "1px solid transparent",
                fontSize: "16px",
              }}
              className="n-p-logout"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={() => setCart(false)}
        className={`cart-container ${cart ? "cart-container-show " : ""}`}
      ></div>
      <div className={`cart ${cart ? "cart-show" : ""}`}>
        <div className="c-head">
          <img
            onClick={() => setCart(false)}
            src="./back.svg"
            alt="back"
            draggable={false}
          />
          <h5>Keranjang</h5>
        </div>
        <div className="c-body">
          <span className="c-b-produk-body">
            {loading2 && (
              <div
                style={{ height: "70%", top: "80px", left: "0px" }}
                className="loading"
              >
                <img width={"50px"} src="./loading.svg" alt="loading" />
              </div>
            )}
            {cartproduk
              ? cartproduk
                  .slice()
                  .reverse()
                  .map((e, i) => (
                    <div className="c-b-produk" key={i}>
                      <img
                        onClick={() => window.open(`/${e.produk.$id}`)}
                        src={`${storage.getFilePreview(
                          import.meta.env.VITE_APPWRITE_BUCKET,
                          e.produk.gambar[0]
                        )}`}
                        alt="gambar produk"
                      />
                      <span>
                        <h6>{e.produk.nama_produk}</h6>
                        <p>{formatter.format(e.produk.harga)}</p>
                        <p style={{ fontSize: "13px" }}>
                          {e.ukuran} | {e.warna}
                        </p>
                        <div className="c-b-p-jumlah">
                          <h6
                            onClick={() =>
                              kurang(e.$id, e.jumlah > 1 ? e.jumlah - 1 : 1)
                            }
                          >
                            -
                          </h6>
                          <p>{e.jumlah}</p>
                          <h6 onClick={() => tambah(e.$id, e.jumlah + 1)}>+</h6>
                        </div>
                      </span>
                      <div
                        onClick={() => cartDelete(e.$id)}
                        className="c-b-p-delete"
                      >
                        <img src="./delete.svg" alt="delete" />
                      </div>
                    </div>
                  ))
              : "loading"}
          </span>
          <span className="c-b-beli-body">
            <h5>Total:</h5>
            <h5>{formatter.format(harga)}</h5>
            <p>Jumlah pembelian : {jumlah}</p>
            {loading && (
              <button onClick={() => nav("/order")} className="beli">
                Beli
              </button>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
