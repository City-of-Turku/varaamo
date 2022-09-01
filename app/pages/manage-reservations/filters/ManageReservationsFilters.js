import constants from 'constants/AppConstants';

import { get } from 'lodash';
import React from 'react';
import {
  Button, Col, Grid, Row
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import moment from 'moment';

import ButtonGroupField from '../inputs/ButtonGroupField';
import injectT from '../../../i18n/injectT';
import {
  getStatusOptions, hasFilters, onDateFilterChange,
  onFavoriteFilterChange, onFilterChange, onReset
} from './filterUtils';
import iconTimes from 'pages/search/controls/images/times.svg';
import DateField from '../inputs/DateField';
import TextField from '../inputs/TextField';
import SelectField from '../inputs/SelectField';
import ToggleField from '../inputs/ToggleField';

function ManageReservationsFilters({
  t,
  filters,
  units,
  intl,
  onSearchChange,
  onShowOnlyFiltersChange,
  showOnlyFilters,
}) {
  const state = get(filters, 'state', null);
  const startDate = get(filters, 'start', null);
  const endDate = get(filters, 'end', null);
  const locale = intl.locale;
  const canModify = constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY;

  return (
    <div className="app-ManageReservationsFilters">
      <Grid>
        <Row>
          <Col md={12}>
            <ButtonGroupField
              id="stateField"
              label={t('ManageReservationsFilters.statusLabel')}
              onChange={value => onFilterChange('state', value, filters, onSearchChange)}
              options={getStatusOptions(t)}
              type="checkbox"
              value={state ? state.split(',') : null}
            />
          </Col>
        </Row>

        <Row>
          <Col md={7}>
            <div className="app-ManageReservationsFilters__datePickers">
              <DateField
                id="startDateField"
                label={t('ManageReservationsFilters.startDateLabel')}
                locale={locale}
                onChange={(startDateValue) => {
                  onDateFilterChange(startDateValue, endDate, filters, onSearchChange);
                }}
                placeholder={t('common.select')}
                value={startDate ? moment(startDate).toDate() : null}
              />
              <div className="separator" />
              <DateField
                id="endDateField"
                label={t('ManageReservationsFilters.endDateLabel')}
                locale={locale}
                onChange={(endDateValue) => {
                  onDateFilterChange(startDate, endDateValue, filters, onSearchChange);
                }}
                placeholder={t('common.select')}
                value={endDate ? moment(endDate).toDate() : null}
              />
            </div>
          </Col>
          <Col md={5}>
            <TextField
              id="searchField"
              label={t('ManageReservationsFilters.searchLabel')}
              onChange={event => onFilterChange('reserver_name', event.target.value, filters, onSearchChange)}
              value={get(filters, 'reserver_name', '')}
            />
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <SelectField
              id="unitField"
              label={t('ManageReservationsFilters.unitLabel')}
              onChange={item => onFilterChange('unit', item.value, filters, onSearchChange)}
              options={units.map(unit => ({
                value: unit.id,
                label: unit.name,
              }))}
              value={get(filters, 'unit', null)}
            />
          </Col>
          <Col className="app-ManageReservationsFilters__filterToggles" md={9}>
            <ToggleField
              id="favorite-toggle-field"
              label={t('ManageReservationsFilters.favoritesLabel')}
              onChange={event => onFavoriteFilterChange(
                event.target.checked, filters, onSearchChange
              )}
              // favorites is in use when not present in filters and not when its value is "no"
              value={get(filters, 'is_favorite_resource', true) !== 'no'}
            />
            <ToggleField
              id="can-modify-toggle-field"
              label={t('ManageReservationsFilters.showOnly.canModifyLabel')}
              onChange={event => (onShowOnlyFiltersChange(event.target.checked ? [canModify] : []))}
              value={showOnlyFilters.includes(canModify)}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            {hasFilters(filters, showOnlyFilters) && (
            <Button
              bsStyle="link"
              className="app-ManageReservationsFilters__resetButton"
              key="reset-button"
              onClick={() => onReset(onSearchChange, onShowOnlyFiltersChange)}
            >
              <img alt="" src={iconTimes} />
              {t('ManageReservationsFilters.resetButton')}
            </Button>
            )}
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

ManageReservationsFilters.propTypes = {
  t: PropTypes.func,
  filters: PropTypes.object,
  units: PropTypes.array,
  onSearchChange: PropTypes.func.isRequired,
  onShowOnlyFiltersChange: PropTypes.func.isRequired,
  showOnlyFilters: PropTypes.array,
  intl: intlShape,
};

export const UnwrappedManageReservationsFilters = injectT(ManageReservationsFilters);
export default injectIntl(UnwrappedManageReservationsFilters);
