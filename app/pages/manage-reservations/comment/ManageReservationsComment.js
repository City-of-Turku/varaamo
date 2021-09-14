import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import commentIcon from 'assets/icons/comment.svg';
import PopoverOverlay from 'shared/popover/PopoverOverlay';

const ManageReservationsComment = ({ comments }) => (
  <div className="app-ManageReservationComments">
    {comments && (
    <PopoverOverlay
      content={<p>{comments}</p>}
      placement="top"
      title={<FormattedMessage id="CommentForm.label" />}
    >
      <img alt={comments} src={commentIcon} />
    </PopoverOverlay>
    )}
  </div>
);
ManageReservationsComment.propTypes = {
  comments: PropTypes.string,
};

export default ManageReservationsComment;
