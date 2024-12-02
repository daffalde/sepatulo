import { Link } from "react-router-dom";
import "../style/footer.css";

export default function Footer() {
  return (
    <>
      <div className="Footer">
        <img src="./logo.svg" alt="logo" />
        <div className="f-content">
          <div style={{ width: "250px" }} className="f-c-menu">
            <h6>Location</h6>
            <br />
            <p>
              Maguwoharjo, Kec. Depok, Kabupaten Sleman, Daerah Istimewa
              Yogyakarta 55281
            </p>
          </div>
          <div className="f-c-menu">
            <h6>Menu</h6>
            <br />
            <ul>
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/store"}>Store</Link>
              </li>
              <li>
                <Link to={"/about"}>About us</Link>
              </li>
            </ul>
          </div>
          <div className="f-c-menu">
            <h6>Social</h6>
            <br />
            <ul>
              <li>
                <Link to={"https://www.facebook.com/"}>Facebook</Link>
              </li>
              <li>
                <Link to={"https://www.instagram.com/"}>Instagram</Link>
              </li>
              <li>
                <Link to={"https://x.com/home"}>X</Link>
              </li>
            </ul>
          </div>
          <div className="f-c-menu">
            <h6>Join our newsletter</h6>
            <br />
            <p>Email Address*</p>
            <form>
              <input type="text" />
              <button>Submit</button>
            </form>
          </div>
        </div>
        <p>© 2024 by SepatuLoe. All rights reserved.</p>
      </div>
    </>
  );
}
