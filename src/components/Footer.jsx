import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerStyle = {
    position: 'relative',
    backgroundColor: '#4e2a11ff', // Mocha background
    color: '#F5F5DC', // Beige text
    padding: '3rem 0 2rem',
    borderTop: '1px solid #6b4e3a'
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1.5rem'
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    textAlign: 'center'
  };

  const logoStyle = {
    fontSize: '1.75rem',
    fontFamily: '"Georgia", serif',
    fontWeight: 'bold',
    color: '#F5F5DC', // Beige
    textDecoration: 'none'
  };

  const contactStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  const socialStyle = {
    display: 'flex',
    gap: '1.5rem',
    margin: '1rem 0'
  };

  const linkStyle = {
    color: '#F5F5DC', // Beige
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    paddingBottom: '0.1rem',
    borderBottom: '1px solid transparent'
  };

  const hoverStyle = {
    color: '#FFFFFF', // White on hover
    borderBottom: '1px solid #F5F5DC' // Beige underline
  };

  const handleHover = (e) => {
    Object.assign(e.currentTarget.style, hoverStyle);
  };

  const handleLeave = (e) => {
    e.currentTarget.style.color = linkStyle.color;
    e.currentTarget.style.borderBottom = linkStyle.borderBottom;
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <Link to="/" style={logoStyle}>AshCafé</Link>
          
          <div style={contactStyle}>
            <span>Coffee Street, Jalandhar</span>
            <span>hello@ashcafe.com • (+91) 123-456-7890</span>
          </div>

         

          <div style={{ 
            borderTop: '1px solid #6b4e3a', 
            paddingTop: '2rem',
            width: '100%'
          }}>
            <p>© {new Date().getFullYear()} AshCafé. All brews reserved.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Proudly roasting in small batches since 2015
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}