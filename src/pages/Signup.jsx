import { Link, useNavigate } from "react-router-dom";
import "../style/signup.css";
import { useEffect, useState } from "react";
import { account } from "../component/Client";
import { ID, OAuthProvider } from "appwrite";
import Cookies from "js-cookie";

export default function Signup() {
  const nav = useNavigate();
  const [showpass, setShowpass] = useState(false);
  const [emailsend, setEmailsend] = useState(false);

  //   input signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorcontent, setErrorcontent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailsend) {
      setInterval(() => {
        setEmailsend(false);
        nav("/otp");
      }, 3000);
    }
  });

  // getsession
  useEffect(() => {
    async function getSession() {
      try {
        const resp = await account.getSession("current");
        if (resp) {
          nav("/");
        }
      } catch (e) {
        null;
      }
    }
    getSession();
  }, []);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await account.create(ID.unique(), email, password, name);
      Cookies.set("idotp", resp.$id);
      await account.createEmailToken(ID.unique(), email);
      setEmailsend(true);
    } catch (e) {
      setError(true);
      setErrorcontent(e.message);
    } finally {
      setLoading(false);
    }
  }

  //   handle error
  function handlepasscek() {
    setShowpass(!showpass);
  }

  //   input oauth
  async function handleoauth() {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        "http://localhost:5173",
        "http://localhost:5173/signup"
      );
    } catch (e) {
      null;
    }
  }
  return (
    <>
      {loading && (
        <div className="loading">
          <img src="./loading.svg" alt="loading" width={"100px"} />
        </div>
      )}
      <div className="container">
        <img
          onClick={() => nav("/")}
          className="logo"
          src="./logo.svg"
          alt="logo"
          draggable={false}
        />
        <div className={`confirm ${emailsend ? "confirm-true" : ""}`}>
          <p>OTP email terkirim</p>
        </div>
        <div className="auth">
          <div className="a-content">
            <span>
              <h4>Sign up</h4>
              <p>Hi,bergabunglah dengan kami!</p>
            </span>
            <form onSubmit={handleSignup}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                type="text"
                placeholder="Nama...."
              />
              <input
                value={email}
                style={{ border: `${error ? "2px solid #ff3523" : ""}` }}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                type="email"
                placeholder="Email...."
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                type={`${showpass ? "text" : "password"}`}
                placeholder="Password...."
              />
              <label>
                <input
                  className={`cekbox ${showpass ? "cektrue" : ""}`}
                  type="checkbox"
                  checked={showpass}
                  onChange={handlepasscek}
                />
                <p>Lihat Password</p>
              </label>
              <button className="auth-button">Daftar</button>
              {error && <p style={{ color: "#ff2348" }}>{errorcontent}</p>}
            </form>
            <p>Atau</p>
            <button onClick={handleoauth} className="oauth-button">
              <img src="./google.svg" alt="google" draggable={false} />
              Sign up dengan Google
            </button>
            <p>
              Sudah punya akun? <Link to={"/login"}>Sign in</Link> sekarang!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
