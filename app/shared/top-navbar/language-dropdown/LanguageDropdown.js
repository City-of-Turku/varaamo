import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

import { injectT } from 'i18n';

function LanguageDropdown(props) {
  const [langOpen, toggleLangOpen] = useState(false);
  const {
    currentLanguage, t, handleLanguageChange, id
  } = props;
  const ref = useRef();

  const toggleDropdown = (e) => {
    e.preventDefault();
    toggleLangOpen(!langOpen);
  };

  const handleOutsideClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      if (langOpen) {
        toggleLangOpen(!langOpen);
      }
    }
  };

  const handleLangClick = (lang, e) => {
    handleLanguageChange(lang, e);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  });

  return (
    <React.Fragment>
      <li className={`app-TopNavbar__lang ${langOpen ? 'open' : 'closed'}`} id={id}>
        <a
          aria-expanded={langOpen}
          aria-haspopup="true"
          aria-label={t('Navbar.language.active')}
          className={`${props.classNameOptional ? props.classNameOptional : 'langDrop'}`}
          href="#"
          id="langdropdown"
          onClick={toggleDropdown}
          ref={ref}
        >
          {currentLanguage}
          <span className="caret" />
        </a>
        <ul className="language-dropdown-menu">
          <li>
            <a aria-label={t('Navbar.language-finnish')} className={`${currentLanguage === 'fi' ? 'active' : ''}`} href="#" onClick={e => handleLangClick('fi', e)}>FI</a>
          </li>
          <li>
            <a aria-label={t('Navbar.language-swedish')} className={`${currentLanguage === 'sv' ? 'active' : ''}`} href="#" onClick={e => handleLangClick('sv', e)}>SV</a>
          </li>
          <li>
            <a aria-label={t('Navbar.language-english')} className={`${currentLanguage === 'en' ? 'active' : ''}`} href="#" onClick={e => handleLangClick('en', e)}>EN</a>
          </li>
        </ul>
      </li>
    </React.Fragment>
  );
}

LanguageDropdown.propTypes = {
  classNameOptional: PropTypes.string,
  currentLanguage: PropTypes.string,
  t: PropTypes.func,
  handleLanguageChange: PropTypes.func,
  id: PropTypes.string,
};

export default injectT(LanguageDropdown);
