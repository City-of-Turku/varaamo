import moment from 'moment';
import { updateIntl } from 'react-intl-redux';
// eslint-disable-next-line import/no-unresolved
import placeholderFi from '@city-i18n/fi.json';
// eslint-disable-next-line import/no-unresolved
import placeholderSv from '@city-i18n/sv.json';
// eslint-disable-next-line import/no-unresolved
import placeholderEn from '@city-i18n/en.json';


import { savePersistLocale } from 'store/middleware/persistState';
import enMessages from 'i18n/messages/en.json';
import fiMessages from 'i18n/messages/fi.json';
import svMessages from 'i18n/messages/sv.json';

const messages = {
  fi: { ...fiMessages, ...placeholderFi },
  en: { ...enMessages, ...placeholderEn },
  sv: { ...svMessages, ...placeholderSv },
};

function changeLocale(language) {
  const locale = language === 'sv' ? 'se' : language;
  savePersistLocale(locale);

  moment.locale(`varaamo-${locale}`);
  return updateIntl({
    locale,
    messages: messages[language],
  });
}

export default changeLocale;
