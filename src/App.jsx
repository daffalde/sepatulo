import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Resetpass from "./pages/Resetpass";
import Dashboard from "./pages/admin/Dashboard";
import Midtrans from "./pages/test/Midtrans";
import Test from "./pages/test/Test";
import { useEffect, useState } from "react";
import Otp from "./pages/Otp";
import { account, avatar, databases } from "./component/Client";
import Cookies from "js-cookie";
import { ID, Permission, Query, Role } from "appwrite";
import Store from "./pages/Store";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import Pesanan from "./pages/Pesanan";
import About from "./pages/About";

function App() {
  useEffect(() => {
    async function getSesi() {
      try {
        await account.getSession("current");
      } catch (e) {
        null;
      }
    }
    getSesi();
  }, []);
  // get session
  useEffect(() => {
    async function getSession() {
      try {
        const resp = await account.get();

        if (!resp.emailVerification) {
          if (
            window.location.pathname !== "/otp" ||
            window.location.pathname !== "/signup"
          ) {
            setVerifedcek(true);
            await account.deleteSessions();
          }
        } else {
          if (resp.$id) {
            Cookies.set("id", resp.$id);
          }
          try {
            const resp1 = await databases.listDocuments(
              import.meta.env.VITE_APPWRITE_DB,
              import.meta.env.VITE_APPWRITE_COLLECT_USER,
              [Query.contains("email", resp.email)]
            );
            if (!resp1.documents[0]) {
              // kalau email tidak ada,buat database di user
              await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DB,
                import.meta.env.VITE_APPWRITE_COLLECT_USER,
                resp.$id,
                {
                  email: resp.email,
                  nama_user: resp.name,
                  picture_profile: avatar.getInitials(),
                  phone_user: resp.phone,
                  alamat: "",
                  kode_pos: "",
                }
              );
            }
          } catch (e) {
            null;
          }
        }
      } catch (e) {
        null;
      }
    }
    getSession();
  }, []);

  // verifed notif
  const [verifedcek, setVerifedcek] = useState(false);

  useEffect(() => {
    if (verifedcek) {
      setInterval(() => {
        setVerifedcek(false);
      }, 5000);
    }
  });

  return (
    <>
      <div className={`confirm ${verifedcek ? "confirm-true" : ""}`}>
        <p>Login gagal!</p>
        <p>Email belum terverifikasi</p>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/resetpassword" Component={Resetpass} />
          <Route path="/signup" Component={Signup} />
          <Route path="/" Component={Home} />
          <Route path="/store" Component={Store} />
          <Route path="/:id" Component={Product} />
          <Route path="/profil" Component={Profile} />
          <Route path="/order" Component={Order} />
          <Route path="/about" Component={About} />
          <Route path="/pesanan" Component={Pesanan} />
          <Route path="/midtrans" Component={Midtrans} />
          <Route path="/otp" Component={Otp} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
