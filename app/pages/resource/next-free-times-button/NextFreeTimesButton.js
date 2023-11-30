import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';

import {
  createFoundNotification, createNotFoundNotification, formatToDateObject,
  getNextFreeTimes, hasFreeTimesDesktop, hasFreeTimesMobile, mobileWidthMax
} from './utils';
import injectT from '../../../i18n/injectT';


function NextFreeTimesButton({
  resource, handleDateChange, selectedDate, addNotification, t
}) {
  const [viewHasFreeTime, setViewHasFreeTime] = React.useState(true);
  const [isSearching, setIsSearching] = React.useState(false);
  const [screenSize, setScreenSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isMobileView, setIsMobileView] = React.useState(screenSize.width <= mobileWidthMax);

  // update view free time when screen size changes
  React.useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setScreenSize({
        width: newWidth,
        height: window.innerHeight,
      });

      // Check if the screen size crossed the mobileWidthMax px threshold
      if (newWidth <= mobileWidthMax && !isMobileView) {
        setIsMobileView(true);
        setViewHasFreeTime(hasFreeTimesMobile(resource, selectedDate));
      } else if (newWidth > mobileWidthMax && isMobileView) {
        setIsMobileView(false);
        setViewHasFreeTime(hasFreeTimesDesktop(resource, selectedDate));
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileView]);


  // update view free time when resource data changes
  React.useEffect(() => {
    if (!resource || resource.openingHours.length < 10) {
      return;
    }
    if (screenSize.width <= mobileWidthMax) {
      setIsMobileView(true);
      setViewHasFreeTime(hasFreeTimesMobile(resource, selectedDate));
    } else {
      setIsMobileView(false);
      setViewHasFreeTime(hasFreeTimesDesktop(resource, selectedDate));
    }
  }, [resource]);


  // handles finding date with free time and setting it if found
  const runGetNextFreeTimes = async () => {
    if (isSearching) {
      return;
    }

    setIsSearching(true);
    const date = await getNextFreeTimes(selectedDate, resource);

    if (!date) {
      createNotFoundNotification(addNotification, t);
    } else {
      handleDateChange(formatToDateObject(date));
      createFoundNotification(addNotification, t, date);
    }

    setIsSearching(false);
  };

  return (
    <React.Fragment>
      {!viewHasFreeTime && (
        <p className="visually-hidden">{t('ResourceFreeTime.srHelpText')}</p>
      )}
      <Button
        className={viewHasFreeTime ? 'next-free-times-btn visually-hidden' : 'next-free-times-btn'}
        disabled={viewHasFreeTime}
        onClick={runGetNextFreeTimes}
      >
        {t('ResourceFreeTime.buttonLabel')}
      </Button>
    </React.Fragment>
  );
}

NextFreeTimesButton.propTypes = {
  addNotification: PropTypes.func.isRequired,
  resource: PropTypes.object,
  handleDateChange: PropTypes.func,
  selectedDate: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default injectT(NextFreeTimesButton);
