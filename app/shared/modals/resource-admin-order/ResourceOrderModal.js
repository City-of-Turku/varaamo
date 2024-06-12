import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';

import injectT from '../../../i18n/injectT';
import { addNotification } from 'actions/notificationsActions';
import { fontSizeSelector } from '../../../state/selectors/accessibilitySelectors';
import { resourcesSelector } from '../../../state/selectors/dataSelectors';
import {
  getItemStyle, getListStyle, getResourceIDs, sendResourceOrder, sortResources
} from './resourceOrderUtils';
import { fetchUser } from 'actions/userActions';
import { currentUserSelector } from '../../../state/selectors/authSelectors';


function ResourceOrderModal({
  show, onClose, t, actions, resources, fontSize, state, resourceOrder, user
}) {
  const initialResources = sortResources(Object.values(resources), resourceOrder);
  const [items, setItems] = React.useState(initialResources);

  React.useEffect(() => {
    setItems(sortResources(Object.values(resources), resourceOrder));
  },
  [resources]);

  const handleSubmit = async (reset) => {
    const result = await sendResourceOrder(reset ? [] : getResourceIDs(items), state);
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
        message: t('Notifications.resourceOrderPostSuccessful'),
        type: 'success',
        timeOut: 10000,
      });

      if (user?.uuid) {
        actions.fetchUser(user?.uuid);
      }
      onClose();
    }
  };

  const onDragEnd = result => {
    if (!result.destination) return;
    const itemsCopy = [...items];
    const [removed] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, removed);
    setItems(itemsCopy);
  };

  return (
    <Modal
      animation={false}
      className={classNames(['resource-order-modal', fontSize])}
      onHide={onClose}
      show={show}
    >
      <Modal.Header closeButton closeLabel={t('ModalHeader.closeButtonText')}>
        <Modal.Title componentClass="h2">{t('ResourceOrder.label')}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflowY: 'initial', maxHeight: 'fit-content' }}>
        <p>{t('ResourceOrder.dragAndDropHelp')}</p>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {items.map((item, index) => (
                  <Draggable draggableId={item.id} index={index} key={item.id}>
                    {(provided2, snapshot2) => (
                      <div
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        {...provided2.dragHandleProps}
                        style={getItemStyle(
                          snapshot2.isDragging,
                          provided2.draggableProps.style
                        )}
                      >
                        {item.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
          className={fontSize}
          onClick={onClose}
        >
          {t('common.back')}
        </Button>
        <Button
          bsStyle="warning"
          className={fontSize}
          onClick={() => handleSubmit(true)}
        >
          {t('ResourceOrder.resetOrder')}
        </Button>
        <Button
          bsStyle="success"
          className={fontSize}
          onClick={() => handleSubmit(false)}
        >
          {t('common.save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ResourceOrderModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  actions: PropTypes.shape({
    addNotification: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
  }),
  resources: PropTypes.object,
  fontSize: PropTypes.string.isRequired,
  state: PropTypes.object,
  resourceOrder: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    fontSize: fontSizeSelector(state),
    resources: resourcesSelector(state),
    state,
    user: currentUserSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    fetchUser,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

const UnconnectedResourceOrderModal = injectT(ResourceOrderModal);
export { UnconnectedResourceOrderModal };
export default connect(mapStateToProps, mapDispatchToProps)(injectT(ResourceOrderModal));
