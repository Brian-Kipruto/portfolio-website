import React from 'react';
import './../styles/main.css';

const blogPostsData = [
  {
    id: 1,
    title: 'The ByteLab: Where Curiosity Meets Innovation',
    date: 'July 2024',
    description: 'An article featured in the African Physics Newsletter, discussing the mission and impact of The ByteLab in fostering STEM education for young learners.',
    link: 'https://www.citizen.digital/tech/the-bytelab-where-curiosity-meets-innovation-n361062',
  },
  {
    id: 2,
    title: 'Democratizing Environmental Data with Project R.A.N.G.E.R.',
    date: 'August 2025',
    description: 'A deep dive into the development and societal impact of Project R.A.N.G.E.R., an autonomous robot for geospatial environmental reconnaissance.',
    link: 'https://medium.com/@your_medium_blog/ranger-project-details', // Placeholder link
  },
  {
    id: 3,
    title: 'Machine Learning in Nuclear Science: Predicting Shielding Performance',
    date: 'September 2025',
    description: 'An overview of how machine learning models are being applied to accelerate the design and testing of advanced radiation shielding materials.',
    link: 'https://medium.com/@your_medium_blog/ml-nuclear-science', // Placeholder link
  },
  // Add more blog posts here
];

const Blog = () => {
  return (
    <section id="blog" className="section-padding">
      <div className="container">
        <h2 className="section-title">My Blog Posts</h2>
        <p className="section-description">
          Here you'll find my thoughts and insights on my day to day life, technology, science, and innovation, primarily hosted on Medium.
        </p>
        <div className="blog-posts-grid">
          {blogPostsData.map(post => (
            <div key={post.id} className="blog-post-card">
              <h3>{post.title}</h3>
              <p className="blog-post-date">{post.date}</p>
              <p className="blog-post-description">{post.description}</p>
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="blog-post-link">
                Read on Medium &rarr;
              </a>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="https://medium.com/@Brian_Kipruto" target="_blank" rel="noopener noreferrer" className="view-all-blogs-btn">
            View All My Blogs on Medium &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;

