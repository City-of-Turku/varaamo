export default (`
<!DOCTYPE html>
<html>
<body>
  <h1>
    Tervetuloa, tämä on Turun kaupungin Varaamon saavutettavuusseloste </h1>
  <p>
    Tämä saavutettavuusseloste koskee Varaamo -palvelua (<a href="https://varaamo.turku.fi" target="_blank" rel="noopener noreferrer">https://varaamo.turku.fi</a>) ja on laadittu 25.10.2019. Tämän
    digipalvelun saavutettavuuden on arvioinut Eficode / Tuukka Muroke. </p>
  <h2>
    Digipalvelun saavutettavuuden tila </h2>
  <p>
    Täyttää kriittiset saavutettavuusvaatimukset </p>
  <h2>
    Digipalvelun ei-saavutettava sisältö (WCAG-kriteerien mukaan) </h2>

  <h3>Havaittava</h3>

  <h4>
    Aria-label ja role=presentation </h4>
  <p>
    <strong>
      Saavuttamaton sisältö ja sen puutteet </strong>
  </p>
  <p>
      Aria-label attribuutteja käytetään sivustolla paljon - joissain tilanteissa jopa ylenmäärin. Esimerkiksi:
      <ul>
        <li>
          etusivulla koko yläpalkilla on ylimääräinen aria-label "saavutettavuus" </li>
        <li>
          etusivun ison kuvan päällä olevassa hakukentässä sekä form- että input-elementeillä aria-labelit </li>
        <li>
          yläpalkissa esimerkiksi kontrasti-säätimeen liittyy useita "Kontrasti" sisältöisiä aria-labeleita. </li>
      </ul>
      Hieman samaan tapaan, joissakin kohdissa sivustoa käytetään turhaan role=presentation attribuuttia, esimerkiksi
      footerissa olevassa palautelinkissä, joka
      on oman tekstikappaleensa (p-elementti) sen sijaan että se olisi osa edellistä kappaletta.
  </p>
  <p>
    <strong>
      Saavutettavuusvaatimukset jotka eivät täyty </strong>
  </p>
  <p>
    <ul>
      <li>
        1.3.1 Informaatio ja suhteet: </li>
    </ul>
  </p>
  <p>
    <strong>
      Syy noudattamatta jättämiselle </strong>
  </p>
  <p>
      Ei vielä vaatimusten mukainen
  </p>
  <p>
    <strong>
      Kerro perustelut, miksi vetoat kohtuuttomaan rasitteeseen. Kerro myös aikataulu, jossa puutteet korjataan. Kerro
      kuinka tiedon/palvelun voi saada vaihtoehtoisella tavalla? </strong>
  </p>
  <p>
      Korjataan vuoden 2019 aikana
  </p>
  <h4>
    Lista- ja Kartta-välilehdet </h4>
  <p>
    <strong>
      Saavuttamaton sisältö ja sen puutteet </strong>
  </p>
  <p>
      Lista ja Kartta -valintoja ei ole toteutettu välilehtinä vaan painikkeina.
      Elementtien roolia ja statusta hankala ymmärtää nykyisellään.
  </p>
  <p>
    <strong>
      Saavutettavuusvaatimukset jotka eivät täyty </strong>
  </p>
  <p>
    <ul>
      <li>
        1.3.1 Informaatio ja suhteet: </li>
    </ul>
  </p>
  <p>
    <strong>
      Syy noudattamatta jättämiselle </strong>
  </p>
  <p>

      Ei vielä vaatimusten mukainen
  </p>
  <p>
    <strong>
      Kerro perustelut, miksi vetoat kohtuuttomaan rasitteeseen. Kerro myös aikataulu, jossa puutteet korjataan. Kerro
      kuinka tiedon/palvelun voi saada vaihtoehtoisella tavalla? </strong>
  </p>
  <p>
      Korjataan vuoden 2019 aikana
  </p>
  <h4>
    Ajanvarauspainikkeet </h4>
  <p>
    <strong>
      Saavuttamaton sisältö ja sen puutteet </strong>
  </p>
  <p>
      Ajan valinta on toteutettu painikejoukkona joka ei ole HTML-koodissa
      taulukkomuodossa. Painikkeiden lukujärjestys on kuitenkin järkevä (päivä eli
      sarake kerrallaan), mutta sarakeotsikkoa ei ole kytketty siihen liittyviin
      painikkeisiin.

      Mikä olennaisempaa, myös näppäimistökäytössä raskasta (ja muutenkin
      hieman hämmentävää), että aikojen valintalista alkaa aina maanantaista,
      vaikka käyttäjä olisi syöttänyt muun päivämäärän. Lisäksi kun haluttu aika on
      löydetty, käyttäjän tulee käydä kaikki viikon loput ajat läpi
      näppäimistöselauksessa päästäkseen käsiksi varauspainikkeisiin.
  </p>
  <p>
    <strong>
      Saavutettavuusvaatimukset jotka eivät täyty </strong>
  </p>
  <p>
    <ul>
      <li>
        1.3.1 Informaatio ja suhteet: </li>
    </ul>
  </p>
  <p>
    <strong>
      Syy noudattamatta jättämiselle </strong>
  </p>
  <p>

      Ei vielä vaatimusten mukainen
  </p>
  <p>
    <strong>
      Kerro perustelut, miksi vetoat kohtuuttomaan rasitteeseen. Kerro myös aikataulu, jossa puutteet korjataan. Kerro
      kuinka tiedon/palvelun voi saada vaihtoehtoisella tavalla? </strong>
  </p>
  <p>
      Korjataan vuoden 2019 aikana
  </p>
  <h4>
    Vaihepolku </h4>
  <p>
    <strong>
      Saavuttamaton sisältö ja sen puutteet </strong>
  </p>
  <p>
      Varausprosessin vaihepolun vaiheista on hieman hankala päätellä
      ruudunlukukäytössä mitä ne ovat ja missä niistä ollaan.
  </p>
  <p>
    <strong>
      Saavutettavuusvaatimukset jotka eivät täyty </strong>
  </p>
  <p>
    <ul>
      <li>
        1.3.1 Informaatio ja suhteet: </li>
    </ul>
  </p>
  <p>
    <strong>
      Syy noudattamatta jättämiselle </strong>
  </p>
  <p>

      Ei vielä vaatimusten mukainen
  </p>
  <p>
    <strong>
      Kerro perustelut, miksi vetoat kohtuuttomaan rasitteeseen. Kerro myös aikataulu, jossa puutteet korjataan. Kerro
      kuinka tiedon/palvelun voi saada vaihtoehtoisella tavalla? </strong>
  </p>
  <p>
      Korjataan vuoden 2019 aikana
  </p>

  <h3>Hallittava</h3>

  <h4>
    Hampurilaisvalikko </h4>
  <p>
    <strong>
      Saavuttamaton sisältö ja sen puutteet </strong>
  </p>
  <p>
      Tekstikokoa riittävästi suurennettaessa päänavigaatio muuttuu
      hampurilaiskuvakkeen takana olevaksi valikoksi ja yläpalkissa tapahtuu
      muitakin muutoksia. Tässä näyttökoossa yläpalkin näppäimistöselausjärjestys
      menee sekaisin: aukeavat valikot eivät tule järjestyksessä ne avaavan linkin
      jälkeen, selausjärjestykseen tulee näkymättömiä linkkejä ja fokus ei erotu
      kunnolla kaikissa kohteissa (esim. hampurilaismenukuvake).
  </p>
  <p>
    <strong>
      Saavutettavuusvaatimukset jotka eivät täyty </strong>
  </p>
  <p>
    <ul>
      <li>
        2.1.1 Näppäimistö </li>
      <li>
        2.4.7 Näkyvä fokus </li>
    </ul>
  </p>
  <p>
    <strong>
      Syy noudattamatta jättämiselle </strong>
  </p>
  <p>

      Ei vielä vaatimusten mukainen
  </p>
  <p>
    <strong>
      Kerro perustelut, miksi vetoat kohtuuttomaan rasitteeseen. Kerro myös aikataulu, jossa puutteet korjataan. Kerro
      kuinka tiedon/palvelun voi saada vaihtoehtoisella tavalla? </strong>
  </p>
  <p>
      Korjataan vuoden 2019 aikana
  </p>
  <h4>
    Kieli- ja kirjautumisvalikot </h4>
  <p>
    <strong>
      Saavuttamaton sisältö ja sen puutteet </strong>
  </p>
  <p>
    <span class="value">
    </span>
  </p>
  <p>
    <strong>
      Saavutettavuusvaatimukset jotka eivät täyty </strong>
  </p>
  <p>
    <ul>
    </ul>
  </p>
  <p>
    <strong>
      Syy noudattamatta jättämiselle </strong>
  </p>
  <p>
      Kohtuuton rasite
  </p>
  <p>
    <strong>
      Kerro perustelut, miksi vetoat kohtuuttomaan rasitteeseen. Kerro myös aikataulu, jossa puutteet korjataan. Kerro
      kuinka tiedon/palvelun voi saada vaihtoehtoisella tavalla? </strong>
  </p>
  <p>
    <span class="value">
    </span>
  </p>
  <h2>
    Huomasitko saavutettavuuspuutteen digipalvelussamme? Kerro se meille ja teemme parhaamme puutteen korjaamiseksi
  </h2>
  <p>
    <strong>
      Verkkolomakkeella </strong>
  </p>
  <p>
      <a href="https://opaskartta.turku.fi/eFeedback/fi/Feedback/30-S%C3%A4hk%C3%B6iset%20asiointipalvelut" target="_blank" rel="noopener noreferrer">Anna
        saavutettavuuspalautetta tällä verkkolomakkeella</a>
  </p>
  <p>
    <strong>
      Sähköpostilla </strong>
  </p>
  <p>
      <a href="mailto:varaamo@turku.fi">varaamo@turku.fi</a>
  </p>
  <p>
    <strong>
      Muilla tavoin </strong>
  </p>
  <p>
    <span class="value">
    </span>
  </p>

  <h2>Valvontaviranomainen</h2>
  <p>
    Jos huomaat sivustolla saavutettavuusongelmia, anna ensin palautetta meille eli sivuston ylläpitäjälle. Vastauksessa
    voi mennä 14 päivää. Jos et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta lainkaan kahden viikon aikana,
    voit tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon. Etelä-Suomen aluehallintoviraston sivulla kerrotaan
    tarkasti, miten ilmoituksen voi tehdä ja miten asia käsitellään. </p>

  <h3>Valvontaviranomaisen yhteystiedot</h3>

  <p>Etelä-Suomen aluehallintovirasto<br />
    Saavutettavuuden valvonnan yksikkö<br />
    <a href="https://www.saavutettavuusvaatimukset.fi" target="_blank" rel="noopener noreferrer">www.saavutettavuusvaatimukset.fi</a> <br />
    <a href="mailto:saavutettavuus@avi.fi">saavutettavuus(at)avi.fi</a><br />
    puhelinnumero vaihde 0295 016 000</p>
</body>
</html>
  `);
