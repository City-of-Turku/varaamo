import React from 'react';
import { Helmet } from 'react-helmet';
import currentFavicon from '@city-assets/images/favicon.ico';

import { getCurrentCustomization } from 'utils/customizationUtils';
import espooFavicon from './espoo-favicon.ico';
import vantaaFavicon from './vantaa-favicon.ico';

const favicons = {
  ESPOO: espooFavicon,
  VANTAA: vantaaFavicon,
};

function Favicon() {
  const customization = getCurrentCustomization();
  const favicon = customization in favicons ? favicons[customization] : currentFavicon;

  return <Helmet link={[{ href: favicon, rel: 'icon', type: 'image/x-icon' }]} />;
}

Favicon.propTypes = {};

export default Favicon;
