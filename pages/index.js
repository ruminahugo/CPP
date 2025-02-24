import { useEffect } from "react";

export default function GetPassPage() {
  useEffect(() => {
    fetch('/api/getPass')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return <div>Check console for API response.</div>;
}

  