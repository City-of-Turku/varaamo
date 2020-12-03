import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import { Helmet } from 'react-helmet';

function PageWrapper({
  children, className, fluid = false, title, canonicalUrl = undefined, transparent = false
}) {
  return (
    <div className={classNames('app-PageWrapper', { 'app-PageWrapper__transparent': transparent })}>
      <Grid
        fluid={fluid}
      >
        <Helmet>
          <title>{`${title} - Varaamo`}</title>
          {canonicalUrl && <link href={canonicalUrl} rel="canonical" />}
        </Helmet>

        <div className={className}>
          {children}
        </div>
      </Grid>
    </div>
  );
}

PageWrapper.propTypes = {
  canonicalUrl: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  title: PropTypes.string.isRequired,
  transparent: PropTypes.bool,
};

export default PageWrapper;
