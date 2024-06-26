"use client";

import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WebsiteComponent() {
  const animateStar = (star) => {
    star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
    star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
    star.style.animation = "none";
    star.offsetHeight; // Trigger reflow
    star.style.animation = "";
  };

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    const stars = Array.from(document.getElementsByClassName("magic-star"));
    let intervals = [];

    stars.forEach((star, index) => {
      setTimeout(() => {
        animateStar(star);
        intervals.push(setInterval(() => animateStar(star), 1000));
      }, index * 333); // 333ms stagger time between each star
    });

    // Cleanup function to clear intervals
    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);

  return (

<>


      <div className="w-full md:w-auto">
        

      <section className="hero" id="top">
        <div className="title">
          <h1 className="intro">
            <span className="magic">
              <span className="magic-star">
                <svg viewBox="0 0 512 512">
                  <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                </svg>
              </span>
              <span className="magic-star">
                <svg viewBox="0 0 512 512">
                  <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                </svg>
              </span>
              <span className="magic-star">
                <svg viewBox="0 0 512 512">
                  <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                </svg>
              </span>
              <span className="magic-text">Pop  </span>
            </span>{" "}
            ost
          </h1>
        </div>

        <h2 className="subheading">Generate exciting social media posts</h2>

        



        {/* 
        <div className="info">
            <h1 className="info_text">Create your own event</h1>
        </div> */}



      </section>

    </div>
    </>
  );
}

export default WebsiteComponent;
