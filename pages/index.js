import { useEffect } from "react";
useEffect(() => {
    fetch('/api/getPass')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);
  