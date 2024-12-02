import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import "../style/store.css";
import { databases, storage } from "../component/Client";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Store() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  // get data produk
  const [produk, setProduk] = useState([]);
  useEffect(() => {
    async function getData() {
      try {
        const resp = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DB,
          import.meta.env.VITE_APPWRITE_COLLECT
        );
        setProduk(resp.documents);
      } catch (e) {
        null;
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  // Format currency
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // Filter search
  const [search, setSearch] = useState("");

  // Sort
  const [sort, setSort] = useState("");

  //   filter
  const [kategori, setKategori] = useState("");
  const [merk, setMerk] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [cekpag, setCekpag] = useState(0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(produk.length / itemsPerPage);

  // mapping produk
  const map = produk
    .slice(indexOfFirstItem, indexOfLastItem)
    .reverse()
    .filter((e) => e.nama_produk.toLowerCase().includes(search))
    .filter((e) => e.kategori.includes(kategori))
    .filter((e) => e.merk.includes(merk))
    .sort((a, b) => {
      if (sort === "tinggi") {
        return b.harga - a.harga;
      } else if (sort === "rendah") {
        return a.harga - b.harga;
      } else {
        return 0;
      }
    })

    .map((e, i) => (
      <div onClick={() => nav(`/${e.$id}`)} key={i} className="a-r-produk">
        <img
          src={`${storage.getFilePreview(
            import.meta.env.VITE_APPWRITE_BUCKET,
            e.gambar[0]
          )}`}
          alt=""
        />
        <br />
        <br />
        <span>
          <h6>{e.nama_produk}</h6>
          <p>{formatter.format(e.harga)}</p>
        </span>
        <br />
      </div>
    ));

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="navbar-in"></div>
        <div className="store">
          <div className="s-left">
            {/* urutkan */}
            <span className="s-l-box">
              <h5>Urutkan</h5>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="product-select"
              >
                <option value="none">Terbaru</option>
                <option value="tinggi">Harga Tertinggi</option>
                <option value="rendah">Harga Terendah</option>
              </select>
            </span>
            <br />
            {/* filter */}
            <h5>Filter</h5>
            <span className="s-l-box">
              <p>Kategori</p>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="product-select"
              >
                <option value="">Semua</option>
                <option value="Formal">Formal</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Sandal">Sandal</option>
                <option value="Sneakers">Sneakers</option>
                <option value="Slip on">Slip on</option>
                <option value="wanita">Wanita</option>
              </select>
              <p>Merk</p>
              <select
                value={merk}
                onChange={(e) => setMerk(e.target.value)}
                className="product-select"
              >
                <option value="">Semua</option>
                <option value="Pijak Bumi">Pijak Bumi</option>
                <option value="Nah">Nah</option>
                <option value="Kanky">Kanky</option>
                <option value="Compass">Compass</option>
                <option value="Bavito">Bavito</option>
              </select>
            </span>
          </div>
          <div className="s-right-in">
            <input
              className="search"
              type="text"
              placeholder="Cari Produk...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <br />
            <br />
            <div className="s-right">
              {loading ? (
                <img
                  className="just-loading"
                  src="./loading.svg"
                  alt="loading"
                />
              ) : (
                map
              )}
            </div>
            {/* Pagination */}
            <div className="pagination">
              {[...Array(totalPages).keys()].map((number) => (
                <button
                  className={`pagbutton ${
                    number == cekpag ? "pagbutton-on" : ""
                  }`}
                  key={number}
                  onClick={() => {
                    paginate(number + 1);
                    setCekpag(number);
                  }}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
