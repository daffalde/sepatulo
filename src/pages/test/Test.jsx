import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { account, databases } from "../../component/Client";

const supabase = createClient(
  import.meta.env.VITE_URL,
  import.meta.env.VITE_API
);

export default function Test() {
  return (
    <>
      <div className="container"></div>
    </>
  );
}
