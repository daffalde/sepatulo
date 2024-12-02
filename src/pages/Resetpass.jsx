import "../style/signup.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/signup.css";
import { account } from "../component/Client";

export default function Resetpass() {
  const [password, setPassword] = useState("");
  const [showpass, setShowpass] = useState(false);
  const [error, setError] = useState(false);
  const [errorcontent, setErrorcontent] = useState("");
  const nav = useNavigate();
  const [userid, setUserid] = useState();
  const [secret, setSecret] = useState();

  useEffect(() => {
    function getParam() {
      const query = new URLSearchParams(window.location.search);
      setUserid(query.get("userId"));
      setSecret(query.get("secret"));
    }
    getParam();
  });

  function handlepasscek() {
    setShowpass(!showpass);
  }

  async function handleReset(e) {
    e.preventDefault();

    try {
      await account.updateRecovery(userid, secret, password);
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
              <h4>Reset Password</h4>
            </span>
            <form onSubmit={handleReset}>
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
              {error && <p>{errorcontent}</p>}
              <button className="auth-button">Reset</button>
              {error && <p style={{ color: "#ff2348" }}>{errorcontent}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
