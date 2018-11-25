import React from 'react';
import './footer.css';
import { FaGithub } from 'react-icons/fa';

const footer = props => (
  <div className="footer">
    <div className="footer-project-name">
      <span>
        Supermarket - DSSD 2018
      </span>
    </div>
    <div className="footer-github">
      <a href="https://github.com/onofricamila/Supermarket-DSSD" className="footer-github-link">
        <FaGithub size='2em'/>  Ver código fuente en GitHub
      </a>
    </div>
  </div>
);

export default footer;