export const FIELDS = {
  // common fields
  RESERVER_NAME: {
    id: 'reserverName', label: 'common.reserverNameLabel', forBilling: false, order: 0
  },
  COMPANY: {
    id: 'company', label: 'common.companyLabel', forBilling: false, order: 1
  },
  RESERVER_ID: {
    id: 'reserverId', label: 'common.reserverIdLabel', forBilling: false, order: 2
  },
  RESERVER_PHONE_NUMBER: {
    id: 'reserverPhoneNumber', label: 'common.reserverPhoneNumberLabel', forBilling: false, order: 3
  },
  RESERVER_EMAIL_ADDRESS: {
    id: 'reserverEmailAddress', label: 'common.reserverEmailAddressLabel', forBilling: false, order: 4
  },
  RESERVER_ADDRESS_STREET: {
    id: 'reserverAddressStreet', label: 'common.addressStreetLabel', forBilling: false, order: 5
  },
  RESERVER_ADDRESS_ZIP: {
    id: 'reserverAddressZip', label: 'common.addressZipLabel', forBilling: false, order: 6
  },
  RESERVER_ADDRESS_CITY: {
    id: 'reserverAddressCity', label: 'common.addressCityLabel', forBilling: false, order: 7
  },
  HOME_MUNICIPALITY: {
    id: 'homeMunicipality', label: 'common.homeMunicipality', forBilling: false, order: 8
  },
  EVENT_SUBJECT: {
    id: 'eventSubject', label: 'common.eventSubjectLabel', forBilling: false, order: 16
  },
  EVENT_DESCRIPTION: {
    id: 'eventDescription', label: 'common.eventDescriptionLabel', forBilling: false, order: 17
  },
  NUMBER_OF_PARTICIPANTS: {
    id: 'numberOfParticipants', label: 'common.numberOfParticipantsLabel', forBilling: false, order: 18
  },
  REQUIRE_ASSISTANCE: {
    id: 'requireAssistance', label: 'common.requireAssistanceLabel', forBilling: false, order: 19
  },
  REQUIRE_WORKSTATION: {
    id: 'requireWorkstation', label: 'common.requireWorkstationLabel', forBilling: false, order: 20
  },
  PRIVATE_EVENT: {
    id: 'privateEvent', label: 'common.privateEventLabel', forBilling: false, order: 21
  },
  COMMENTS: {
    id: 'comments', label: 'common.commentsLabel', forBilling: false, order: 22
  },
  RESERVATION_EXTRA_QUESTIONS: {
    id: 'reservationExtraQuestions', label: 'common.additionalInfo.label', forBilling: false, order: 23
  },
  // terms fields are special, they have common starting label and unique end link label
  TERMS_AND_CONDITIONS: {
    id: 'termsAndConditions', label: 'ReservationInformationForm.termsAndConditionsLink', forBilling: false, order: 24
  },
  PAYMENT_TERMS_AND_CONDITIONS: {
    id: 'paymentTermsAndConditions', label: 'ReservationInformationForm.paymentTermsAndConditionsLink', forBilling: false, order: 25
  },
  // billing fields
  BILLING_FIRST_NAME: {
    id: 'billingFirstName', label: 'common.billingFirstNameLabel', forBilling: true, order: 9
  },
  BILLING_LAST_NAME: {
    id: 'billingLastName', label: 'common.billingLastNameLabel', forBilling: true, order: 10
  },
  BILLING_EMAIL_ADDRESS: {
    id: 'billingEmailAddress', label: 'common.billingEmailAddressLabel', forBilling: true, order: 12
  },
  BILLING_PHONE_NUMBER: {
    id: 'billingPhoneNumber', label: 'common.billingPhoneNumberLabel', forBilling: true, order: 11
  },
  BILLING_ADDRESS_STREET: {
    id: 'billingAddressStreet', label: 'common.addressStreetLabel', forBilling: true, order: 13
  },
  BILLING_ADDRESS_ZIP: {
    id: 'billingAddressZip', label: 'common.addressZipLabel', forBilling: true, order: 14
  },
  BILLING_ADDRESS_CITY: {
    id: 'billingAddressCity', label: 'common.addressCityLabel', forBilling: true, order: 15
  },
};



