import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../component/Client";
import Cookies from "js-cookie";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const nav = useNavigate();
  const [error, setError] = useState(false);
  const [errorcontent, setErrorcontent] = useState("");

  useEffect(() => {
    async function getSession() {
      try {
        await account.getSession();
      } catch (e) {
        null;
      }
    }
    getSession();
  }, []);

  async function handleOtp(e) {
    e.preventDefault();

    try {
      await account.createSession(Cookies.get("idotp"), otp);

      setOtp("");
      nav("/login");
    } catch (e) {
      setError(true);
      setErrorcontent(e.message);
    }
  }

  return (
    <>
      <div className="container">
        <img
          onClick={() => nav("/")}
          className="logo"
          src="./logo.svg"
          alt="logo"
          draggable={false}
        />
        <div className="auth">
          <div className="a-content">
            <span>
              <h4>OTP</h4>
              <p>Input nomor otp yang sudah dikirim ke email anda.</p>
            </span>
            <form onSubmit={handleOtp}>
              <input
                style={{ border: `${error ? "2px solid #ff3523" : ""}` }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input"
                type={`number`}
                placeholder="Otp...."
              />
              {error && <p style={{ color: "#ff2348" }}>{errorcontent}</p>}
              <button className="auth-button">Masuk</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
