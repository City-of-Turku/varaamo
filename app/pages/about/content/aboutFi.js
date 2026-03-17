export default function getAboutContentFi(feedbackLink) {
  return `
<h1>Tietoa Turun kaupungin Varaamo-palvelusta</h1>
<p>Varaamo on Turun kaupungin ylläpitämä verkkopalvelu, jonka kautta voit varata tiloja, laitteita ja
  asiantuntijapalveluita. Palvelu löytyy osoitteesta <b>varaamo.turku.fi</b>.</p>
<p>Varaamon tarkoituksena on mahdollistaa varausten tekeminen saavutettavasti sekä ajasta ja paikasta riippumatta.
  Palvelun avulla voimme tehostaa varattavien kohteiden käyttöä ja toisaalta kerätä esimerkiksi käyttöasteeseen ja
  asiakastyytyväisyyteen liittyvää dataa.</p>
<h2>Tilojen maksullisuus</h2>
<p>Varaamosta löytyvät kohteet ovat pääosin maksuttomia, mutta jotkut tilat voivat olla maksullisia. Sekä
  yksityishenkilöt että yhdistykset ja järjestöt saavat varata tiloja, mutta niiden maksullisuus voi vaihdella sen
  mukaan, onko varaaja yksityishenkilö tai yhdistyksen tai järjestön edustaja.</p>
<h2>Varausten tekeminen, muuttaminen ja peruuttaminen</h2>
<h3>Tunnistautuminen</h3>
<p>Voit tehdä varauksia joko tunnistautumatta tai tunnistautuen. Erot riippuvat varattavasta kohteesta.
  Tunnistautumistapoja ovat:</p>
<ul>
  <li>Suomi.fi-tunnistus,</li>
  <li>Vaski-kirjastokortti ja sen tunnusluku ja</li>
  <li>Turun kaupungin työntekijätunnukset.</li>
</ul>
<p>Maksullisiin varauksiin tarvitset aina vahvemman tunnistautumistavan eli jonkun muun kuin Vaski-kirjastokortin
  tunnukset.</p>
<h3>Varausten muokkaaminen ja peruutus</h3>
<p>Tehdyistä varauksista saat aina sähköposti- tai tekstiviestin. Niihin vastaamalla tai niistä löytyvän Varaamon
  sähköpostiosoitteen kautta <b>et voi tehdä muutoksia varauksiin</b>.</p>
<p>Itse tehtyjen varausten muokkaaminen ja peruutus:</p>
<ul>
  <li>Voit muokata tai poistaa itse tehdyn varauksen kirjautumalla samalla tavalla itse järjestelmään kuin varausta
    tehdessäkin. Tunnistautumisen jälkeen siirry kohtaan <b>Omat varaukset</b>.</li>
  <li><b>Huomioithan, että eri tavoin kirjautuneena olet järjestelmälle eri henkilö</b>. Näin et näe vaikkapa
    kirjastokortilla tunnistautuen niitä varauksia, jotka olet tehnyt pankkitunnuksilla.</li>
</ul>
<p>Henkilökunnan tekemien varausten muuttaminen:</p>
<ul>
  <li>Jos kaupungin henkilökunta on tehnyt varauksen puolestasi, ota yhteyttä kyseiseen toimipisteeseen muutosten
    tekemiseksi. Toimipisteiden yhteystiedot löytyvät varattavien kohteiden esittelysivuilta.</li>
</ul>
<h2>Muiden liikuntapaikkojen varaaminen</h2>
<p>Jos haluat varata liikuntapaikkoja, jotka eivät ole saatavilla Varaamossa, voit tehdä varaukset Turun kaupungin
  erillisessä Timmi-järjestelmässä osoitteessa <b>timmi.turku.fi</b>.</p>
<h2>Palautteen antaminen</h2>
<p>Toivomme Varaamon käyttäjiltä palautetta palvelusta. <a href=${feedbackLink} rel="noopener noreferrer" target="_blank">Se onnistuu
    tämän linkin kautta</a>. Valitsethan palautteen aiheeksi
  silloin Varaamo-varauspalvelun. Kiitos!</p>
  `;
}
