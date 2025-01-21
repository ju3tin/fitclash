'use client';
import Link from 'next/link';
import React from 'react';

const footer = () => {
  return (
<div id="footer" className="page__footer">
      <footer>
        {/* start custom footer snippets */}

{/* end custom footer snippets */}
        <div className="page__footer-follow">
  <ul className="social-icons">
    

    
      
        
          <li><a href="https://twitter.com/mmistakes" rel="nofollow noopener noreferrer"><i className="fab fa-fw fa-twitter-square" aria-hidden="true"></i> Twitter</a></li>
        
      
        
          <li><a href="https://github.com/mmistakes" rel="nofollow noopener noreferrer"><i className="fab fa-fw fa-github" aria-hidden="true"></i> GitHub</a></li>
        
      
        
          <li><a href="https://instagram.com/mmistakes" rel="nofollow noopener noreferrer"><i className="fab fa-fw fa-instagram" aria-hidden="true"></i> Instagram</a></li>
        
      
    

    
      <li><a href="/feed.xml"><i className="fas fa-fw fa-rss-square" aria-hidden="true"></i> Feed</a></li>
    
  </ul>
</div>

<div className="page__footer-copyright">© 2024 <a href="https://mmistakes.github.io">Minimal Mistakes</a>. Powered by <a href="https://jekyllrb.com" rel="nofollow">Jekyll</a> &amp; <a href="https://mademistakes.com/work/jekyll-themes/" rel="nofollow">Minimal Mistakes</a>.</div>

      </footer>
    </div>
      );
    };
    
    export default footer;
    