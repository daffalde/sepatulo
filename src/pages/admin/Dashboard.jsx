import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/dashboard.css";
import Product from "./Product";
import { account, avatar } from "../../component/Client";
import Cookies from "js-cookie";
import Opesanan from "./Opesanan";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [profil, setProfil] = useState();
  const [error, setError] = useState(null);
  const nav = useNavigate();

  // cek admin
  useEffect(() => {
    async function getSession() {
      if (Cookies.get("id") !== "6742ccdf6ad8c4a564ab") {
        nav("/login");
      }
    }
    getSession();
  }, []);

  // change select
  const [select, setSelect] = useState("product");

  //get data user admin
  useEffect(() => {
    async function getUser() {
      try {
        const resp = await account.get();
        setData(resp);
        const image = await avatar.getInitials();
        setProfil(image);
      } catch (e) {
        null;
      }
    }
    getUser();
  }, []);

  // handle logout
  async function hanldeLogout() {
    try {
      await account.deleteSessions();
      Cookies.remove("id");
    } catch (e) {
      null;
    } finally {
      window.location.reload();
    }
  }

  return (
    <>
      <div className="container-dashboard">
        <div className="d-nav">
          <img src="./logo2.svg" alt="logo" />
          <div className="n-user">
            <img
              className="profil_user"
              src={`${profil ? profil : "./d-profil.svg"}`}
              alt="profil"
            />
            <span>
              <p>{data ? data.name : "Loading..."}</p>
              <p>Admin</p>
            </span>
          </div>
          <button onClick={() => setSelect("product")} className="n-u-menu">
            <img src="./d-cart.svg" alt="" />
            Product
          </button>
          <button onClick={() => setSelect("pesanan")} className="n-u-menu">
            <img width={"30px"} src="./opesanan.svg" alt="" />
            Pesanan
          </button>
          <button onClick={hanldeLogout} className="dashboard-nav-logout">
            Sign Out
          </button>
        </div>
        <div className="d-content">
          {select === "product" ? (
            <Product />
          ) : select === "pesanan" ? (
            <Opesanan />
          ) : null}
        </div>
      </div>
    </>
  );
}
