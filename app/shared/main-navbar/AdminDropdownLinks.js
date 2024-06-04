import React from 'react';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { injectT } from 'i18n';
import constants from 'constants/AppConstants';
import FAIcon from 'shared/fontawesome-icon';

function AdminDropdownLinks({ currentLanguage, gitbookURL, t }) {
  return (
    <NavDropdown
      className="nav-link-dropdown"
      eventKey="link-dropdown"
      id="nav-admin-dropdown"
      title={t('Navbar.links')}
    >
      <MenuItem
        className="nav-dropdown-link"
        eventKey="adminMaintenance"
        href={constants.NAV_ADMIN_URLS.respa}
        rel="noreferrer"
        target="_blank"
      >
        {t('Navbar.adminMaintenance')}

        <FAIcon icon={faExternalLinkAlt} />
      </MenuItem>

      <MenuItem
        className="nav-dropdown-link"
        eventKey="adminGuide"
        href={gitbookURL}
        rel="noreferrer"
        target="_blank"
      >
        {t('Navbar.adminGuide')}
        <FAIcon icon={faExternalLinkAlt} />
      </MenuItem>

      <MenuItem
        className="nav-dropdown-link"
        eventKey="feedback"
        href={`https://opaskartta.turku.fi/eFeedback/${currentLanguage}/Feedback/30/1039`}
        rel="noreferrer"
        target="_blank"
      >
        {t('Navbar.feedback')}
        <FAIcon icon={faExternalLinkAlt} />
      </MenuItem>
    </NavDropdown>
  );
}

AdminDropdownLinks.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  gitbookURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(AdminDropdownLinks);
