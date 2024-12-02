import Navbar from "../component/Navbar";
import Footer from "./Footer";
import "../style/about.css";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="navbar-in"></div>
        <div className="about">
          <div className="a-header">
            <h2>About Us</h2>
          </div>
          <br />
          <br />
          <div className="a-story">
            <div className="a-s-content a-s-c-left"></div>
            <div className="a-s-content">
              <h4>Our Story</h4>
              <br />
              <p>
                Kami adalah sekelompok sahabat dari Yogyakarta yang memiliki
                hasrat besar untuk fashion dan sepatu. Setelah lulus dari
                sekolah, kami menyadari bahwa mencari pekerjaan yang sesuai
                dengan passion kami sangatlah sulit. Dengan modal yang
                dikumpulkan bersama dari tabungan dan bantuan keluarga, kami
                memutuskan untuk menjadi reseller sepatu dari berbagai brand
                ternama. Kami menyewa sebuah kios kecil di pusat kota, tempat di
                mana kami bisa memulai perjalanan bisnis kami. <br />
                <br /> Hari-hari awal penuh dengan tantangan. Kami harus belajar
                tentang cara terbaik untuk menjual dan mempromosikan produk,
                memahami tren pasar, dan memastikan kualitas sepatu yang kami
                jual. Dengan bantuan media sosial, kami mulai menarik perhatian
                pelanggan. Perlahan namun pasti, usaha keras kami mulai
                membuahkan hasil. Toko kami kini dikenal sebagai tempat
                terpercaya untuk mendapatkan sepatu berkualitas dari berbagai
                merek terkenal. Kami bangga bisa memberikan pilihan terbaik bagi
                pelanggan kami dan terus bersemangat untuk mengembangkan bisnis
                ini.
              </p>
            </div>
          </div>
          <br />
          <br />
          <div className="a-filosofi">
            <div className="a-f-content">
              <h4>Our Philisophy</h4>
              <br />
              <p>
                Di dunia yang terus berubah, kami percaya bahwa sepasang sepatu
                adalah lebih dari sekadar alas kaki. Bagi kami, sepatu adalah
                cerminan perjalanan, simbol dari setiap langkah yang diambil
                menuju impian dan tujuan. Sebagai reseller sepatu, misi kami
                adalah menghadirkan pilihan terbaik dari berbagai merek ternama,
                memastikan setiap pelanggan menemukan pasangannya yang sempurna.
                <br />
                <br /> Kami mengutamakan kualitas, kenyamanan, dan gaya dalam
                setiap produk yang kami tawarkan. Filosofi kami adalah melayani
                dengan hati dan integritas, memberikan pengalaman belanja yang
                hangat dan personal. Kami berkomitmen untuk menjadi mitra
                terpercaya yang membantu Anda melangkah dengan percaya diri,
                satu langkah demi satu langkah.
              </p>
            </div>
            <div className="a-f-content a-f-c-right">
              <img src="./phil.jpg" alt="philosophy" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
