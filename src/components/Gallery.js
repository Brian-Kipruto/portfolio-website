import React, { useState } from 'react';
import './../styles/main.css';

const galleryImagesData = [
  { id: 1, src: '/images/gallery/ranger.jpeg', alt: 'initial R.A.N.G.E.R. prototype in Field', category: 'Robotics' },
  { id: 2, src: '/images/gallery/dave.jpg', alt: 'Bytelab bot build', category: 'Team' },
  { id: 3, src: '/images/gallery/ayute.jpeg', alt: 'Ayute Gala awards', category: 'awards, pitches & Conferences' },
  { id: 4, src: '/images/gallery/initial.jpeg', alt: 'Initial fogponic prototype', category: 'IOT' },
  { id: 5, src: '/images/gallery/team.jpeg', alt: 'ByteAnza Team', category: 'Team' },
  { id: 6, src: '/images/gallery/BSc Graduation.jpg', alt: 'BSC Graduation Day', category: 'Graduation' },
  // Add more images here
];

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null); // New state for selected image

  const filteredImages = galleryImagesData.filter(image => {
    if (filter === 'All') {
      return true;
    }
    return image.category === filter;
  });

  const categories = ['All', 'Robotics', 'Machine Learning', 'Research','IOT', 'Graduation', 'Team', 'awards, pitches & Conferences'];

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="section-padding">
      <div className="container">
        <h2 className="section-title">My Gallery</h2>
        <p className="section-description">
          A visual showcase of my projects, research, and collaborative work.
        </p>

        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map(image => (
            <div key={image.id} className="gallery-item" onClick={() => openImageModal(image)}> {/* Add onClick */}
              <img src={image.src} alt={image.alt} className="gallery-image" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/24252A/E4E6EB?text=Image+Not+Found"; }} />
              <div className="gallery-overlay">
                <p>{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* START: Image Modal/Lightbox */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking image itself */}
            <button className="close-modal-btn" onClick={closeImageModal}>&times;</button>
            <img src={selectedImage.src} alt={selectedImage.alt} className="enlarged-image" />
            <p className="enlarged-image-caption">{selectedImage.alt}</p>
          </div>
        </div>
      )}
      {/* END: Image Modal/Lightbox */}
    </section>
  );
};

export default Gallery;