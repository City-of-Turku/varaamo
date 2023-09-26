import React, { lazy, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Route from '../app/shared/route';
import PrivateRoute from '../app/shared/private-route';
import AppContainer from '../app/pages/AppContainer';
import HomePage from '../app/pages/home';
import NotFoundPage from '../app/pages/not-found';
import LoginCallback from '../app/pages/auth/LoginCallback';
import LogoutCallback from '../app/pages/auth/LogoutCallback';
import ReservationPaymentReturnPage from '../app/pages/reservation/payment/ReservationPaymentReturnPage';

// import non-landing pages dynamically
const SearchPage = lazy(() => import('../app/pages/search'));
const AboutPage = lazy(() => import('../app/pages/about'));
const ResourcePage = lazy(() => import('../app/pages/resource'));
const AccessibilityInfoPage = lazy(() => import('../app/pages/accessibility-info'));
const AdminResourcesPage = lazy(() => import('../app/pages/admin-resources'));
const FavoritesPage = lazy(() => import('../app/pages/favorites/favoritesPage'));
const UserReservationsPage = lazy(() => import('../app/pages/user-reservations'));
const ReservationPage = lazy(() => import('../app/pages/reservation'));
const ManageReservationsPage = lazy(() => import('../app/pages/manage-reservations/ManageReservationsPage'));


export default () => (
  <AppContainer>
    <Suspense fallback={<div />}>
      <Switch>
        <Route component={HomePage} componentName="Home" exact path="/" />
        <Route component={props => <SearchPage {...props} />} componentName="Search" path="/search" />
        <Route component={props => <AboutPage {...props} />} componentName="About" path="/about" />
        <Route component={props => <ResourcePage {...props} />} componentName="Resource" path="/resources/:id" />
        <Route component={props => <AccessibilityInfoPage {...props} />} componentName="Seloste" path="/accessibility-info" />

        <Route component={LoginCallback} componentName="LoginCallback" path="/callback" />
        <Route component={LogoutCallback} componentName="LogoutCallback" path="/logout/callback" />

        <PrivateRoute
          component={props => <AdminResourcesPage {...props} />}
          componentName="AdminResources"
          path="/admin-resources"
        />
        <PrivateRoute
          component={props => <ManageReservationsPage {...props} />}
          componentName="ManageReservations"
          path="/manage-reservations"
        />
        <PrivateRoute
          component={props => <FavoritesPage {...props} />}
          componentName="Favorites"
          path="/favourites"
        />
        <PrivateRoute
          component={props => <UserReservationsPage {...props} />}
          componentName="MyReservations"
          path="/my-reservations"
        />
        <Route component={props => <ReservationPage {...props} />} componentName="Reservation" path="/reservation" />
        <Route
          component={props => <ReservationPaymentReturnPage {...props} />}
          componentName="ReservationPaymentReturn"
          path="/reservation-payment-return"
        />

        <Redirect from="/home" to="/" />
        <Redirect from="/resources/:id/reservation" to="/resources/:id" />
        <Route component={NotFoundPage} componentName="NotFoundPage" path="*" />
      </Switch>
    </Suspense>
  </AppContainer>
);
