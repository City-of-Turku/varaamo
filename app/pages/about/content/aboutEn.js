export default function getAboutContentEn(feedbackLink) {
  return `
<h1>Information about the City of Turku's Varaamo Service</h1>
<p>Varaamo is an online service maintained by the City of Turku, where you can reserve spaces, equipment, and expert
  services. The service is available at <b>varaamo.turku.fi.</b></p>
<p>The purpose of Varaamo is to make reservations accessible, regardless of time and location. Through this service, we
  aim to enhance the use of reservable resources and gather data, such as usage rates and customer satisfaction.</p>
<h2>Payment for Spaces</h2>
<p>Most of the spaces available in Varaamo are free of charge, but some may require payment. Both private individuals
  and associations/organizations are eligible to reserve spaces. The cost may vary depending on whether the reserving
  party is an individual or representing an association/organization.</p>
<h2>Making, Modifying, and Cancelling Reservations</h2>
<h3>Identification</h3>
<p>You can make reservations either with or without identification, depending on the resource being reserved.
  Identification methods include:</p>
<ul>
  <li>Suomi.fi identification</li>
  <li>Vaski library card and its PIN</li>
  <li>City of Turku employee credentials</li>
</ul>
<p>For paid reservations, a stronger form of identification is always required, which means using an option other than
  the Vaski library card.</p>
<h3>Modifying and Cancelling Reservations</h3>
<p>You will receive a confirmation of your reservation via email or text message. However, responding to these messages
  or using the Varaamo service’s email address to request changes <b>is not possible</b>.</p>
<p>To modify or cancel a reservation you made yourself:</p>
<ul>
  <li>Log into the system the same way you did when making the reservation. After logging in, navigate to <b>Your
      Reservations</b>.</li>
  <li><b>Please note that the system recognizes you differently based on the identification method you use</b>. For
    instance,
    if you log in with a library card, you will not see reservations made using bank credentials.</li>
</ul>
<p>Modifying Reservations Made by Staff:</p>
<ul>
  <li>If the city staff made a reservation on your behalf, contact the respective office to make changes. The contact
    details for each location can be found on the resource’s details page.</li>
</ul>
<h2>Reserving Other Sports Facilities</h2>
<p>If you want to reserve sports facilities that are not available through Varaamo, you can do so via the City of
  Turku’s separate Timmi system at <b>timmi.turku.fi</b>.</p>
<h2>Providing Feedback</h2>
<p>We welcome feedback from Varaamo users. You can submit feedback via this <a href=${feedbackLink} rel="noopener noreferrer" target="_blank">link</a>.
 Please select “Reservation service Varaamo” as the subject of your feedback. Thank you!</p>
  `;
}
