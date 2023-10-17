import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addNotification } from 'actions/notificationsActions';
import { fetchResources } from 'actions/resourceActions';
import MassCancelForm from './MassCancelForm';
import injectT from '../../../i18n/injectT';
import { currentLanguageSelector } from '../../../state/selectors/translationSelectors';
import { resourcesSelector } from '../../../state/selectors/dataSelectors';
import { fontSizeSelector } from '../../../state/selectors/accessibilitySelectors';
import { FORM_INITIAL_VALUES, sendMassCancel, validateForm } from './massCancelUtils';

function MassCancelModal({
  show, onClose, t, actions, resources, state, onCancelSuccess, fontSize
}) {
  const [selectedResource, setSelectedResource] = useState(FORM_INITIAL_VALUES.selectedResource);
  const [startDate, setStartDate] = useState(FORM_INITIAL_VALUES.startDate);
  const [endDate, setEndDate] = useState(FORM_INITIAL_VALUES.endDate);
  const [confirmCancel, setConfirmCancel] = useState(FORM_INITIAL_VALUES.confirmCancel);
  const [cancelling, setCancelling] = useState(FORM_INITIAL_VALUES.cancelling);
  const [errors, setErrors] = useState(FORM_INITIAL_VALUES.errors);

  useEffect(() => {
    actions.fetchResources({ is_favorite: true });
  }, []);

  const resourceList = Object.values(resources);

  const resetForm = () => {
    setSelectedResource(FORM_INITIAL_VALUES.selectedResource);
    setStartDate(FORM_INITIAL_VALUES.startDate);
    setEndDate(FORM_INITIAL_VALUES.endDate);
    setConfirmCancel(FORM_INITIAL_VALUES.confirmCancel);
    setErrors(FORM_INITIAL_VALUES.errors);
  };

  const handleOnBlur = (target) => {
    const newErrors = { ...errors };
    delete newErrors[target];
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm({
      selectedResource, startDate, endDate, confirmCancel
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setCancelling(true);
    const result = await sendMassCancel(selectedResource, startDate, endDate, state);
    if (result.errorOccurred) {
      if (result.code === 403) {
        actions.addNotification({
          message: t('Notifications.noPermission'),
          type: 'error',
          timeOut: 10000,
        });
      } else {
        actions.addNotification({
          message: t('Notifications.errorMessage'),
          type: 'error',
          timeOut: 10000,
        });
      }
    } else {
      actions.addNotification({
        message: t('Notifications.massCancelSuccessful'),
        type: 'success',
        timeOut: 10000,
      });
      onClose();
      if (onCancelSuccess) {
        resetForm();
        onCancelSuccess();
      }
    }
    setCancelling(false);
  };

  return (
    <Modal
      animation={false}
      className={fontSize}
      onHide={() => { resetForm(); onClose(); }}
      show={show}
    >
      <Modal.Header closeButton>
        <Modal.Title componentClass="h2">{t('common.cancelReservations')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MassCancelForm
          confirmCancel={confirmCancel}
          endDate={endDate}
          errors={errors}
          handleOnBlur={handleOnBlur}
          resources={resourceList}
          selectedResource={selectedResource}
          setConfirmCancel={setConfirmCancel}
          setEndDate={setEndDate}
          setSelectedResource={setSelectedResource}
          setStartDate={setStartDate}
          startDate={startDate}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
          className={fontSize}
          onClick={() => { resetForm(); onClose(); }}
        >
          {t('common.back')}
        </Button>
        <Button
          bsStyle="danger"
          className={fontSize}
          disabled={!confirmCancel || cancelling}
          onClick={handleSubmit}
        >
          {t('MassCancel.cancelReservations')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

MassCancelModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  actions: PropTypes.shape({
    addNotification: PropTypes.func.isRequired,
    fetchResources: PropTypes.func.isRequired,
  }),
  resources: PropTypes.object,
  state: PropTypes.object,
  onCancelSuccess: PropTypes.func,
  fontSize: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    currentLanguage: currentLanguageSelector(state),
    resources: resourcesSelector(state),
    state,
    fontSize: fontSizeSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    fetchResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

const UnconnectedMassCancelModal = injectT(MassCancelModal);
export { UnconnectedMassCancelModal };
export default connect(mapStateToProps, mapDispatchToProps)(injectT(MassCancelModal));
