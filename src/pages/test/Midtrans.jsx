import axios from "axios";
import { useEffect } from "react";

export default function Midtrans() {
  const name = "john doe";
  const email = "johndoe@gmail.com";
  const number = "123412344321";

  async function handleBuy() {
    try {
      const resp = await axios.post(
        "/app/snap/v1/transactions",
        {
          transaction_details: {
            order_id: Date.now(),
            gross_amount: 20000,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            name: name,
            email: email,
            phone: number,
          },
        },
        {
          headers: {
            Authorization: `Basic ${btoa(import.meta.env.VITE_MIDTRANS)}`,
          },
        }
      );
      console.log(resp.data);
      window.open(resp.data.redirect_url);
    } catch (err) {
      console.error();
    }
  }

  async function getData() {
    try {
      const resp = await axios.get("/api/v2/6749dc0d002ff4678a8b/status", {
        headers: {
          Authorization: `Basic ${btoa(import.meta.env.VITE_MIDTRANS)}`,
        },
      });
      console.log(resp);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <div className="container">
        <h1>midtrans</h1>
        <button onClick={handleBuy}>Beli</button>
        <button onClick={getData}>cek</button>
      </div>
    </>
  );
}
