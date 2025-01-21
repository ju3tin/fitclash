'use client';
import Link from 'next/link';
import React from 'react';

const Video = () => {
  return (
<div className="page__hero--overlay" style={{ padding: '0px' }}>
<div className="fullscreen-video-container">
    <video autoPlay loop muted>
      <source src="/video/tensor1.mp4" type="video/mp4" />
    </video>
    
    <div className="fullscreen-video-content">
  
    
        <div className="wrapper">
            <h1 id="page-title" className="page__title" itemProp="headline">
              
                Minimal Mistakes
      
              
            </h1>
            
              <p className="page__lead">A flexible two-column Jekyll theme. Perfect for building personal sites, blogs, and portfolios.<br /> <small><a href="https://github.com/mmistakes/releases/tag/4.26.2">Latest release v4.26.2</a></small>
      </p>
            
            
      
      
            
              <p>
              
                <a href="/docs/quick-start-guide/" className="btn btn--light-outline btn--large"><i className="fas fa-download"></i> Install now</a>
              
              </p>
            
          </div>
  
    </div>
  </div>
  
  
</div>
);
};

export default Video;