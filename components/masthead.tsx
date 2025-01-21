'use client';
import Link from 'next/link';
import React from 'react';

const masthead = () => {
  return (
<div className="masthead">
  <div className="masthead__inner-wrap">
    <div className="masthead__menu">
      <nav id="site-nav" className="greedy-nav">
        
        <a className="site-title" href="/">
          <img src="/images/logo1.png" width="50vh" alt="Use your body as a controller"/>
       
        </a>
        <ul className="visible-links">
            <li className="masthead__menu-item">
              <a href="/games/">Games</a>
            </li><li className="masthead__menu-item">
              <a
                href="/faq/"
                
                
              >FAQ</a>
            </li><li className="masthead__menu-item">
              <a
                href="/how-to-play/"
                
                
              >How To Play</a>
            </li><li className="masthead__menu-item">
              <a
                href="/app/"
                
                
              >Launch App</a>
            </li></ul>
        
       {/* <button class="search__toggle" type="button">
          <span className="visually-hidden">Toggle search</span>
          <i className="fas fa-search"></i>
        </button>*/}
        
        <button className="greedy-nav__toggle hidden" type="button">
          <span className="visually-hidden">Toggle menu</span>
          <div className="navicon"></div>
        </button>
        <ul className="hidden-links hidden"></ul>
      </nav>
    </div>
  </div>
</div>
);
};

export default masthead;