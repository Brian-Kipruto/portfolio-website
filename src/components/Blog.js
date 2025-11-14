import React from 'react';
import './../styles/main.css';

const blogPostsData = [
  {
    id: 1,
    title: 'The ByteLab: Where Curiosity Meets Innovation',
    date: 'July 2024',
    description: 'An article featured in the African Physics Newsletter & Citizen Digital, discussing the mission and impact of The ByteLab in fostering STEM education for young learners.',
    link: 'https://medium.com/@Brian_Kipruto/the-bytelab-where-curiosity-meets-innovation-8ff0914533aa',
  },
  {
    id: 2,
    title: 'Serendipity and the “prepared mind”',
    date: 'Sep 10, 2025',
    description: 'We must embrace the unknown. Not just to conquer it but to find opportunities hidden within its void.',
    link: 'https://medium.com/@Brian_Kipruto/serendipity-and-the-prepared-mind-57c50650bbce',
  },
  {
    id: 3,
    title: 'The day I unlearned how to count',
    date: 'Aug 23, 2025',
    description: 'Learning to think from first principles.',
    link: 'https://medium.com/@Brian_Kipruto/the-day-i-unlearned-how-to-count-479305701628',
  },
  {
    id: 4,
    title: 'Machine Learning in Nuclear Science: Predicting Shielding Performance',
    date: 'September 2025',
    description: 'An overview of how machine learning models are being applied to accelerate the design and testing of advanced radiation shielding materials.',
    link: '#',
  },
  //more blog posts here
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

