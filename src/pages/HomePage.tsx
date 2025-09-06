import React from 'react';
import { useEffect, useState } from "react";
import liff from "@line/liff";

const HomePage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the Home page</p>
      <div>
        <h2>create-liff-app</h2>
        {message && <p>{message}</p>}
        {error && (
          <p>
            <code>{error}</code>
          </p>
        )}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
        >
          LIFF Documentation
        </a>
      </div>
    </div>
  );
};

export default HomePage;