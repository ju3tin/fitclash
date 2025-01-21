'use client';
import Link from 'next/link';
import React from 'react';

const FEATURE_ITEMS = [
  {
    image: "/images/dinogame.jpg",
    alt: "customizable",
    title: "Dino Game",
    description: "Jump and Crouch to get the highest score in this classic game.",
    link: "/examples/dinogame/"
  },
  {
    image: "/images/posenet.png",
    alt: "fully responsive",
    title: "Dance Clash",
    description: "The best way to learn how to dance is by doing.",
    link: "/examples/3d/index4.html?videourl=/assets/video/2.mp4"
  },
  {
    image: "/images/walking.gif",
    alt: "100% free",
    title: "Game Controller",
    description: "Change your body to control a game.",
    link: "/examples/3d/"
  }
];

const Selection = () => {
  return (
    <div id="main" role="main">
      <article className="splash" itemScope itemType="https://schema.org/CreativeWork">
        <meta itemProp="description" content="A flexible two-column Jekyll theme. Perfect for building personal sites, blogs, and portfolios. Latest release v4.26.2" />
        <section className="page__content" itemProp="text">
          <div className="feature__wrapper">
            {FEATURE_ITEMS.map((item, index) => (
              <div className="feature__item" key={index}>
                <div className="archive__item">
                  <div className="archive__item-teaser">
                    <img src={item.image} alt={item.alt} />
                  </div>
                  <div className="archive__item-body">
                    <h2 className="archive__item-title">{item.title}</h2>
                    <div className="archive__item-excerpt">
                      <p>{item.description}</p>
                    </div>
                    <p>
                      <a href={item.link} className="btn btn--primary">Learn more</a>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};

export default Selection;