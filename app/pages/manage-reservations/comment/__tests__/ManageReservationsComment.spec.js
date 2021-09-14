import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import PopoverOverlay from '../../../../shared/popover/PopoverOverlay';
import ManageReservationsComment from '../ManageReservationsComment';
import commentIcon from 'assets/icons/comment.svg';

describe('ManageReservationsFilters', () => {
  const defaultProps = {
    comments: 'test comment',
  };

  function getWrapper(props) {
    return shallow(<ManageReservationsComment {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationComments');
      expect(wrapper).toHaveLength(1);
    });

    describe('when comments are given in props', () => {
      const comments = 'test abc';
      const overlay = getWrapper({ comments }).find(PopoverOverlay);
      test('PopoverOverlay', () => {
        expect(overlay).toHaveLength(1);
        expect(overlay.prop('content')).toStrictEqual(<p>{comments}</p>);
        expect(overlay.prop('placement')).toBe('top');
        expect(overlay.prop('title')).toStrictEqual(<FormattedMessage id="CommentForm.label" />);
      });

      test('comment icon', () => {
        const icon = overlay.find('img');
        expect(icon).toHaveLength(1);
        expect(icon.prop('alt')).toBe(comments);
        expect(icon.prop('src')).toBe(commentIcon);
      });
    });

    test('no PopoverOverlay when comments are not given in props', () => {
      const comments = undefined;
      const overlay = getWrapper({ comments }).find(PopoverOverlay);
      expect(overlay).toHaveLength(0);
    });
  });
});
