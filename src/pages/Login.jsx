import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/signup.css";
import { account } from "../component/Client";
import { ID, OAuthProvider } from "appwrite";
import Cookies from "js-cookie";

const supabase = createClient(
  import.meta.env.VITE_URL,
  import.meta.env.VITE_API
);

export default function Login() {
  const nav = useNavigate();
  const [showpass, setShowpass] = useState(false);

  //   input signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorcontent, setErrorcontent] = useState("");
  const [session, setSession] = useState(false);

  // get session
  useEffect(() => {
    async function getSession() {
      try {
        const resp = await account.get();
        if (resp) {
          nav("/");
        }
      } catch (e) {
        null;
      }
    }
    getSession();
  }, []);

  // handle signin

  async function handlesignin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      window.location.replace("/");
    } catch (e) {
      setError(true);
      setErrorcontent(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handlepasscek() {
    setShowpass(!showpass);
  }

  // reset Email
  async function resetEmail(e) {
    e.preventDefault();

    if (email === "") {
      setError(true);
      setErrorcontent("No email for reset");
    }

    try {
      await account.createRecovery(
        email,
        "https://sepatulo.vercel.app/resetpassword"
      );
      setEmailsend(true);
    } catch (e) {
      null;
    }
  }

  const [emailsend, setEmailsend] = useState(false);
  useEffect(() => {
    if (emailsend) {
      setInterval(() => {
        setEmailsend(false);
      }, 5000);
    }
  });

  //   input oauth
  async function handleoauth() {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        "https://sepatulo.vercel.app/",
        "https://sepatulo.vercel.app/login",
        ["profile"]
      );
    } catch (e) {
      null;
    }
  }

  // handle loading
  const [loading, setLoading] = useState(false);

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
          <p>
            Reset terkirim <br />
            periksa email anda
          </p>
        </div>
        <div className="auth">
          <div className="a-content">
            <span>
              <h4>Sign in</h4>
              <p>Selamat datang kembali!</p>
            </span>
            <form onSubmit={handlesignin}>
              <input
                style={{ border: `${error ? "2px solid #ff3523" : ""}` }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                type="email"
                placeholder="Email...."
              />
              <input
                style={{ border: `${error ? "2px solid #ff3523" : ""}` }}
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
              <button className="auth-button">Masuk</button>
              {error && <p style={{ color: "#ff2348" }}>{errorcontent}</p>}
            </form>
            <p>Atau</p>
            <button onClick={handleoauth} className="oauth-button">
              <img src="./google.svg" alt="google" draggable={false} />
              Sign in dengan Google
            </button>
            <p>
              Sudah punya akun? <Link to={"/signup"}>Sign up</Link> sekarang!
            </p>
            <p onClick={resetEmail} className="forgotpass">
              lupa password?
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
