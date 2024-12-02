import { useEffect, useState } from "react";
import "../../style/product.css";
import { databases, storage } from "../../component/Client";
import { ID, Query } from "appwrite";

export default function Product() {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState();
  const [merk, setMerk] = useState("");
  const [kategori, setKategori] = useState("");
  const [stok, setStok] = useState();
  const [warna, setWarna] = useState("");
  const arraywarna = [];
  const [ukuran, setUkuran] = useState("");
  const arrayukuran = [];
  const [deskripsi, setDeskripsi] = useState("");
  const arrayImage = [];
  const [loading, setLoading] = useState(false);
  const [editpage, setEditpage] = useState(false);
  // get Image
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // sending data

  async function sendData(e) {
    e.preventDefault();
    setLoading(true);

    arraywarna.push(...warna.split(","));
    arrayukuran.push(...ukuran.split(","));

    // upload file
    try {
      if (files) {
        try {
          for (let i = 0; i < files.length; i++) {
            const upFile = files[i];
            const resp = await storage.createFile(
              import.meta.env.VITE_APPWRITE_BUCKET,
              ID.unique(),
              upFile
            );
            arrayImage.push(resp.$id);
          }
        } catch (e) {
          null;
        }
      }

      // insert data

      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT,
        ID.unique(),
        {
          nama_produk: nama,
          harga: parseInt(harga, 10),
          stok: parseInt(stok, 10),
          kategori: kategori,
          merk: merk,
          warna: arraywarna,
          ukuran: arrayukuran,
          gambar: arrayImage,
          deskripsi: deskripsi,
        }
      );
    } catch (e) {
      null;
    } finally {
      window.location.reload();
    }

    setNama("");
    setDeskripsi("");
    setImagePreviews([]);
    setFiles([]);
    setHarga("");
    setMerk("");
    setKategori("");
    setStok("");
    setWarna("");
    setUkuran("");

    getData();
  }

  // pemanggilan data
  const [dataproduk, setDataproduk] = useState([]);
  async function getData() {
    setLoading(true);
    try {
      const resp = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT,
        [Query.limit(100), Query.offset(0)]
      );
      setDataproduk(resp.documents);
    } catch (e) {
      null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // format currency
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  // handle hapus data
  async function handleDelete(id, gambar) {
    setLoading(true);

    try {
      for (let i = 0; i < gambar.length; i++) {
        storage.deleteFile(import.meta.env.VITE_APPWRITE_BUCKET, gambar[i]);
      }

      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DB,
        import.meta.env.VITE_APPWRITE_COLLECT,
        id
      );
    } catch (e) {
      null;
    } finally {
      setLoading(false);
      window.location.reload();
    }

    getData();
  }

  // search product
  const [search, setSearch] = useState("");

  // get edit

  const [idselect, setIdselect] = useState();

  async function handleGetData(e) {
    setIdselect(e);
    setEditpage(true);
    const resp = await databases.getDocument(
      import.meta.env.VITE_APPWRITE_DB,
      import.meta.env.VITE_APPWRITE_COLLECT,
      e
    );

    setNama(resp.nama_produk);
    setDeskripsi(resp.deskripsi);
    setHarga(resp.harga);
    setMerk(resp.merk);
    setKategori(resp.kategori);
    setStok(resp.stok);
    setWarna(resp.warna.join(","));
    setUkuran(resp.ukuran.join(","));
  }

  async function handleEditdata(e) {
    e.preventDefault();

    arraywarna.push(...warna.split(","));
    arrayukuran.push(...ukuran.split(","));

    await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DB,
      import.meta.env.VITE_APPWRITE_COLLECT,
      idselect,
      {
        nama_produk: nama,
        harga: parseInt(harga, 10),
        stok: parseInt(stok, 10),
        kategori: kategori,
        merk: merk,
        warna: arraywarna,
        ukuran: arrayukuran,
        deskripsi: deskripsi,
      }
    );
    setEditpage(false);
    setNama("");
    setDeskripsi("");
    setFiles([]);
    setHarga("");
    setMerk("");
    setKategori("");
    setStok("");
    setWarna("");
    setUkuran("");

    getData();
  }

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [cekpag, setCekpag] = useState(0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(dataproduk.length / itemsPerPage);

  return (
    <>
      <div className="Product">
        {editpage ? (
          <div className="p-input">
            <h5>Edit Data</h5>
            <form onSubmit={handleEditdata}>
              <br />
              <div className="form-up">
                <div className="form-in">
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    type="text"
                    placeholder="Nama Produk...."
                  />
                  <input
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    type="number"
                    placeholder="Harga...."
                  />
                  <select
                    className="product-select"
                    value={merk}
                    onChange={(e) => setMerk(e.target.value)}
                  >
                    <option className="select-disable" disabled value="">
                      Merk....
                    </option>

                    <option value="Pijak Bumi">Pijak Bumi</option>
                    <option value="Nah">Nah</option>
                    <option value="Kanky">Kanky</option>
                    <option value="Compass">Compass</option>
                    <option value="Bavito">Bavito</option>
                  </select>
                  <select
                    className="product-select"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                  >
                    <option className="select-disable" disabled value="">
                      Kategori....
                    </option>
                    <option value="Formal">Formal</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Sandal">Sandal</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Slip on">Slip on</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                  <input
                    value={stok}
                    onChange={(e) => setStok(e.target.value)}
                    type="number"
                    placeholder="Stok...."
                  />
                </div>
                <div className="form-in">
                  <input
                    value={warna}
                    onChange={(e) => setWarna(e.target.value)}
                    type="text"
                    placeholder="Warna...."
                  />
                  <input
                    value={ukuran}
                    onChange={(e) => setUkuran(e.target.value)}
                    type="text"
                    placeholder="Ukuran...."
                  />
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Deskripsi..."
                  ></textarea>
                </div>
              </div>
              <div className="product-action-button">
                <button className="send-button">Edit</button>
              </div>
            </form>
            <br />
            <button
              onClick={() => {
                setEditpage(false);
                window.location.reload();
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="p-input">
            <h5>Input Data</h5>
            <form onSubmit={sendData}>
              <br />
              <div className="form-up">
                <div className="form-in">
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    type="text"
                    placeholder="Nama Produk...."
                  />
                  <input
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    type="number"
                    placeholder="Harga...."
                  />

                  <select
                    className="product-select"
                    value={merk}
                    onChange={(e) => setMerk(e.target.value)}
                  >
                    <option className="select-disable" disabled value="">
                      Merk....
                    </option>

                    <option value="Pijak Bumi">Pijak Bumi</option>
                    <option value="Nah">Nah</option>
                    <option value="Kanky">Kanky</option>
                    <option value="Compass">Compass</option>
                    <option value="Bavito">Bavito</option>
                  </select>
                  <select
                    className="product-select"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                  >
                    <option className="select-disable" disabled value="">
                      Kategori....
                    </option>
                    <option value="Formal">Formal</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Sandal">Sandal</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Slip on">Slip on</option>
                    <option value="wanita">wanita</option>
                  </select>
                  <input
                    value={stok}
                    onChange={(e) => setStok(e.target.value)}
                    type="number"
                    placeholder="Stok...."
                  />
                </div>
                <div className="form-in">
                  <input
                    value={warna}
                    onChange={(e) => setWarna(e.target.value)}
                    type="text"
                    placeholder="Warna...."
                  />
                  <input
                    value={ukuran}
                    onChange={(e) => setUkuran(e.target.value)}
                    type="text"
                    placeholder="Ukuran...."
                  />
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Deskripsi..."
                  ></textarea>
                </div>
              </div>
              <div className="form-down">
                <input onChange={handleFileChange} type="file" multiple />
                <div className="image-previews">
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index}`}
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        marginRight: "10px",
                        marginTop: "20px",
                      }}
                    />
                  ))}
                </div>
                <br />
                <button className="send-button">Send</button>
              </div>
            </form>
          </div>
        )}

        <br />
        {/* Search... */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-product"
          type="text"
          placeholder="Search..."
        />
        <br />
        <br />
        {/* List product */}
        <div className="p-table">
          {loading == false ? (
            <table>
              <thead>
                <tr>
                  <th width={"2%"}>id</th>
                  <th width={"100px"} height={"100px"}>
                    Gambar
                  </th>
                  <th>Nama Produk</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Merk</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Warna</th>
                  <th>Ukuran</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataproduk
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .reverse()
                  .filter((e) => e.nama_produk.toLowerCase().includes(search))
                  .map((e, i) => (
                    <tr
                      className="table-list"
                      onClick={() => handleGetData(e.$id)}
                      key={i}
                    >
                      <td>{e.$id}</td>
                      <td>
                        <img
                          width={"100px"}
                          height={"100px"}
                          src={
                            e.gambar[0]
                              ? storage.getFilePreview(
                                  import.meta.env.VITE_APPWRITE_BUCKET,
                                  e.gambar[0]
                                )
                              : ""
                          }
                          alt="image list product"
                        />
                      </td>
                      <td width={"200px"}>{e.nama_produk}</td>
                      <td width={"400px"}>
                        <span className="table-desc">{e.deskripsi}</span>
                      </td>
                      <td>{formatter.format(e.harga)}</td>
                      <td>{e.merk}</td>
                      <td>{e.kategori}</td>
                      <td>{e.stok}</td>
                      <td>{e.warna.join(",")}</td>
                      <td>{e.ukuran.join(",")}</td>
                      <td>
                        <button
                          className="p-l-delete"
                          onClick={() => handleDelete(e.$id, e.gambar)}
                        >
                          <img src="./delete.svg" alt="delete product" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="loading-product">
              <img width={"80px"} src="./loading.svg" alt="loading" />
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="pagination">
          {[...Array(totalPages).keys()].map((number) => (
            <button
              className={`pagbutton ${number == cekpag ? "pagbutton-on" : ""}`}
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
    </>
  );
}
