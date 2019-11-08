export default (`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Tillgänglighetsutlåtande</title>
  </head>
  <body>
    <h1>Tervetuloa, tämä on Turun kaupungin Varaamon saavutettavuusseloste</h1>
    <p>
      Tämä saavutettavuusseloste koskee Varaamo -palvelua (<a href="https://varaamo.turku.fi" target="_blank" rel="noopener noreferrer">https://varaamo.turku.fi</a>) ja on laadittu 06.11.2019. Tämän digipalvelun saavutettavuuden on arvioinut Eficode / Tuukka Muroke.
    </p>

    <h2>Digipalvelun saavutettavuuden tila</h2>
    <p>Täyttää kriittiset saavutettavuusvaatimukset</p>

    <h2>Digipalvelun ei-saavutettava sisältö (WCAG-kriteerien mukaan)</h2>
    <h3>Havaittava</h3>
    <h4>Ajanvarauspainikkeet</h4>
    <p><strong>Saavuttamaton sisältö ja sen puutteet</strong></p>

    <p>
      <span class="value">
      Ajan valinta on toteutettu painikejoukkona joka ei ole HTML-koodissa
      taulukkomuodossa. Painikkeiden lukujärjestys on kuitenkin järkevä (päivä eli
      sarake kerrallaan), mutta sarakeotsikkoa ei ole kytketty siihen liittyviin
      painikkeisiin.

      Mikä olennaisempaa, myös näppäimistökäytössä raskasta (ja muutenkin
      hieman hämmentävää), että aikojen valintalista alkaa aina maanantaista,
      vaikka käyttäjä olisi syöttänyt muun päivämäärän. Lisäksi kun haluttu aika on
      löydetty, käyttäjän tulee käydä kaikki viikon loput ajat läpi
      näppäimistöselauksessa päästäkseen käsiksi varauspainikkeisiin.
      </span>
    </p>
    <p>
      <strong>Saavutettavuusvaatimukset jotka eivät täyty</strong>
    </p>
    <p>
      <ul>
        <li>
          1.3.1 Informaatio ja suhteet:
        </li>
      </ul>
    </p>
    <h3>Hallittava</h3>
    <h4>Kieli- ja kirjautumisvalikot</h4>
    <p>
      <strong>
        Saavuttamaton sisältö ja sen puutteet
      </strong>
    </p>
    <p>
      <span class="value">
      Kielivalinta ja kirjaudu ulos -toiminnallisuus on toteutettu role=menu
      attribuutilla. Tällöin niiden näppäimistökäyttölogiikka poikkeaa muusta
      sisällöstä. Siirtymä navigaatiologiikassa on käytännössä  vaivalloinen
      yksittäisen linkin takia.
      </span>
    </p>
    <p>
      <strong>
        Saavutettavuusvaatimukset jotka eivät täyty
      </strong>
    </p>
    <p>
      <ul>
        <li>
          2.1.1 Näppäimistö
        </li>
      </ul>
    </p>
    <h3>Ymmärrettävä</h3>
    <h4>Hakulomakkeen kenttien nimeäminen</h4>
    <p>
      <strong>
        Saavuttamaton sisältö ja sen puutteet
      </strong>
    </p>
    <p>
      <span class="value">
      Hakulomakkeen pudotusvalikoissa käytetään sekä label-elementtiä että aria-
      label attribuuttia joiden sisältö on sama. Tämä tekee sivun kuuntelemisesta
      ruudunlukijalla toisteista. Vastaavasti  liukukytkinelementeillä on
      saavutettavasti toteutettu, hyvä label-checkbox rakenne, mutta niihin
      liittyvillä svg-kuvilla on myös turhia  englanninkielisiä title-attribuutteja, jotka
      ruudunlukija myös lukee.
      </span>
    </p>
    <p>
      <strong>
        Saavutettavuusvaatimukset jotka eivät täyty
      </strong>
    </p>
    <p>
      <ul>
        <li>
          3.3.2 Nimilaput tai ohjeet
        </li>
      </ul>
    </p>
    <h3>Ei kuulu lainsäädännön piiriin</h3>
    <p>
      <span class="value">
      Karttamuotoinen tieto ei ole täysin saavutettava, mutta karttaupotuksen
      olemassaolo ei haittaa muuta käyttöä ja osoitetiedot on esitetty myös
      tekstimuodossa.
      Lainsäädäntö saavutettavuudesta ei koske karttasisältöjä.
      </span>
    </p>

    <h2>Huomasitko saavutettavuuspuutteen digipalvelussamme?<br />Kerro se meille ja teemme parhaamme puutteen korjaamiseksi</h2>
    <p>
      <strong>
        Verkkolomakkeella
      </strong>
    </p>
    <p>
      <span class="value">
        <a href="https://opaskartta.turku.fi/eFeedback/fi/Feedback/30-S%C3%A4hk%C3%B6iset%20asiointipalvelut" target="_blank" rel="noopener noreferrer">Anna saavutettavuuspalautetta tällä verkkolomakkeella</a>
      </span>
    </p>
    <p>
      <strong>
        Sähköpostilla
      </strong>
    </p>
    <p>
      <span class="value">
        <a href="mailto:varaamo@turku.fi">varaamo@turku.fi</a>
      </span>
    </p>
    <h2>Valvontaviranomainen</h2>
    <p>
    Jos huomaat sivustolla saavutettavuusongelmia, anna ensin palautetta meille eli sivuston ylläpitäjälle. Vastauksessa voi mennä 14 päivää.
    Jos et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta lainkaan kahden viikon aikana, <a href="https://www.saavutettavuusvaatimukset.fi/oikeutesi/" target="_blank" rel="noopener noreferrer">voit tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon</a>.
    Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten ilmoituksen voi tehdä ja miten asia käsitellään.
    </p>

    <h3>Valvontaviranomaisen yhteystiedot</h3>

    <p>
      Etelä-Suomen aluehallintovirasto<br />
      Saavutettavuuden valvonnan yksikkö<br />
      <a href="https://www.saavutettavuusvaatimukset.fi" target="_blank" rel="noopener noreferrer">www.saavutettavuusvaatimukset.fi</a><br />
      <a href="mailto:saavutettavuus@avi.fi">saavutettavuus(at)avi.fi</a><br />
      puhelinnumero vaihde 0295 016 000
    </p>

    <h2>Teemme jatkuvasti työtä saavutettavuuden parantamiseksi</h2>
    <p>
      <strong>
        Digipalveluistamme on tehty saavutettavuusarviointi
      </strong>
    </p>
    <p>
      <span class="value">
        20.10.2019
      </span>
    </p>
    <p>
      <strong>
        Olemme sitoutuneet digipalveluiden saavutettavuuden parantamiseen
      </strong>
    </p>
    <p>
      <span class="value">
      Turun kaupungin saavutettavuusosaamista kehitetään suunnitelmallisesti ja määrätietoisesti. Kaupungin saavutettavuuden sopimustoimittajat tulevat arvioimaan kaupungin nykyiset verkkopalvelut.
      Arvioinnin perusteella palveluiden saavutettavuutta kehitetään lain vaatimalle tasolle kunkin palvelun määräaikaan mennessä.
      Uusien verkkopalveluiden kehittämisessä ja hankinnassa saavutettavuus huomioidaan alusta lähtien.
      Saavutettavuuskoulutusta järjestetään kaikille osapuolille, jotka osallistuvat verkkopalveluiden kehittämiseen ja niiden sisältöjen tuottamiseen.
      Kaupungissa on käynnissä projekti Saavutettavuuslain vaatimusten täyttämiseksi.
      </span>
    </p>
    <p>
      <strong>
        Tämä verkkosivusto/sovellus on julkaistu
      </strong>
    </p>
    <p>
      <span class="value">
        11.11.2019
      </span>
    </p>
  </body>
</html>
  `);
