import moment from 'moment';
// eslint-disable-next-line import/order
import { updateIntl } from 'react-intl-redux';

import { savePersistLocale } from 'store/middleware/persistState';
import enMessages from 'i18n/messages/en.json';
import fiMessages from 'i18n/messages/fi.json';
import svMessages from 'i18n/messages/sv.json';

// eslint-disable-next-line import/no-unresolved,import/order
import fiTURKU from '@city-i18n/fi.json';

const messages = {
  fi: { ...fiMessages, ...fiTURKU },
  en: enMessages,
  sv: svMessages,
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
