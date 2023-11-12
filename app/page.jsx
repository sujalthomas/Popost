"use client";

import React, { useEffect, useRef } from 'react';
import Feed from "@components/Feed";
import WebsiteComponent from "@components/WebsiteComponent";
import { ToastContainer } from 'react-toastify';


const Home = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    // LOADER
    setTimeout(() => {
      const loader = loaderRef.current;
      if (loader) {
        loader.style.opacity = "0";
        loader.style.backgroundColor = "transparent";
        setTimeout(() => {
          if (loader) {
            loader.style.display = "none";
            document.body.style.overflow = "visible";
          }
        }, 1000);
      }
    }, 3000);
  }, []); // Empty dependency array to run only once on mount

  return (
    <section className='w-full flex-center flex-col'>
      <div className="loader" ref={loaderRef}>
        <div className="balls"></div>
      </div>
      <ToastContainer />
      <WebsiteComponent />
      <Feed />
    </section>
  );
};

export default Home;
