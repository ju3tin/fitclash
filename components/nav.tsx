'use client';
import Link from 'next/link';
import React from 'react';

const Nav = () => {
  return (
    <nav id="site-nav" className="greedy-nav">
        
    <a className="site-title" href="/">
      <img src="/images/logo1.png" width="50vh" alt="Use your body as a controller" />
   
    </a>
    <ul className="visible-links"><li className="masthead__menu-item">
          <a href="/games">Games</a>
        </li><li className="masthead__menu-item">
          <a href="/faq">FAQ</a>
        </li><li className="masthead__menu-item">
          <a href="/how-to-play/">How To Play</a>
        </li><li className="masthead__menu-item">
          <a href="/app/index.html">Launch App</a>
        </li></ul>
    
 
    
    <button className="greedy-nav__toggle hidden" type="button" data-count="0">
      <span className="visually-hidden">Toggle menu</span>
      <div className="navicon"></div>
    </button>
    <ul className="hidden-links hidden"></ul>
  </nav>
  );
};

export default Nav;
