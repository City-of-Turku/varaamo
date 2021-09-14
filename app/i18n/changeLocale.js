import moment from 'moment';
import { updateIntl } from 'react-intl-redux';
// eslint-disable-next-line import/no-unresolved
import fiMessagesFromTheme from '@city-i18n/fi.json';
// eslint-disable-next-line import/no-unresolved
import svMessagesFromTheme from '@city-i18n/sv.json';
// eslint-disable-next-line import/no-unresolved
import enMessagesFromTheme from '@city-i18n/en.json';


import { savePersistLocale } from 'store/middleware/persistState';
import enMessages from 'i18n/messages/en.json';
import fiMessages from 'i18n/messages/fi.json';
import svMessages from 'i18n/messages/sv.json';

const messages = {
  fi: { ...fiMessages, ...fiMessagesFromTheme },
  en: { ...enMessages, ...enMessagesFromTheme },
  sv: { ...svMessages, ...svMessagesFromTheme },
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
