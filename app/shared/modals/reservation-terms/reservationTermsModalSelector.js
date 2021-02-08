import ModalTypes from 'constants/ModalTypes';

import { createStructuredSelector } from 'reselect';

import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';

const reservationTermsModalSelector = createStructuredSelector({
  showGeneric: modalIsOpenSelectorFactory(ModalTypes.RESOURCE_TERMS),
  showPayment: modalIsOpenSelectorFactory(ModalTypes.RESOURCE_PAYMENT_TERMS),
});

export default reservationTermsModalSelector;
