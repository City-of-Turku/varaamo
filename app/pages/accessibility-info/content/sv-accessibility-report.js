export default (`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Tillgänglighetsutlåtande</title>
  </head>
  <body>
    <h1>Välkommen, det här är tillgänglighetsutlåtandet för Åbo Stads bokningstjänst Varaamo</h1>
    <p>
      Denna tillgänglighetsutlåtande berör Varaamo-tjänsten (<a href="https://varaamo.turku.fi" target="_blank" rel="noopener noreferrer">https://varaamo.turku.fi</a>) och har utarbetats 6.11.2019.
      Tillgängligheten i denna digitjänst har bedömts av Eficode / Tuukka Muroke.
    </p>

    <h2>Digitjänstens tillgänglighet just nu</h2>
    <p>Tjänsten uppfyller tillgänglighetskraven</p>

    <h2>Digitjänstens icke-tillgängliga innehåll (enligt WCAG-kriterierna)</h2>
    <h3>Möjlig att uppfatta</h3>
    <h4>Tidsbokningstangenterna</h4>
    <p><strong>Otillgängligt innehåll och dess brister</strong></p>

    <p>
      <span class="value">
      Valet av tid har gjorts som en uppsättning knappar som inte är i tabellformat i HTML-kod.
      Knapparnas läsordning är ändå rimlig (en dag, dvs. en kolumn åt gången), men kolumnens rubrik är inte kopplad till dess knappar.
      Än mer relevant, och jobbigt i användingen (och annars också aningen förvirrande), är att listan med valbara tider börjar från måndag även om användaren skulle ha matat in ett annat datum.
      Dessutom när en lämplig tid har hittats, är användaren tvungen att bläddra genom veckans alla andra tider för att komma fram till bokningsknapparna.
      </span>
    </p>
    <p>
      <strong>Tillgänglighetskrav som inte uppfylls</strong>
    </p>
    <p>
      <ul>
        <li>
          1.3.1 Information och relationer:
        </li>
      </ul>
    </p>
    <h3>Hanterbar</h3>
    <h4>Språk- och inloggningsmenyer</h4>
    <p>
      <strong>
        Tillgängligt innehåll och dess brister
      </strong>
    </p>
    <p>
      <span class="value">
      Språkmenyns och utloggningens funktioner har gjorts med role=menu -attribut.
      Således avviker dessa funktioners tangetbordslogik från övrigt innehåll. Övergången är i navigationslogik praktiskt sett besvärlig för en enstaka länk.
      </span>
    </p>
    <p>
      <strong>
        Tillgänglighetskrav som inte uppfylls
      </strong>
    </p>
    <p>
      <ul>
        <li>
          2.1.1 Tangentbord
        </li>
      </ul>
    </p>
    <h3>Begriplig</h3>
    <h4>Namngivning av sökfunktionens fält</h4>
    <p>
      <strong>
        Tillgängligt innehåll och dess brister
      </strong>
    </p>
    <p>
      <span class="value">
      I sökfunktionens rullgardinsmenyer används både label-element och aria-label-attribut vars innehåll är det samma. Detta gör att lyssning av sidan med skärmläsare är upprepande.
      På motsvarande sätt har en bra label-checkboxstruktur gjorts tillgänglig med skjutomkopplarelement, men svg-bilderna kopplade till dem har också onödiga engelskspråkiga title-attribut som skärmläsaren också läser.
      </span>
    </p>
    <p>
      <strong>
        Tillgänglighetskrav som inte uppfylls
      </strong>
    </p>
    <p>
      <ul>
        <li>
          3.3.2 Ledtexter/etiketter eller instruktioner
        </li>
      </ul>
    </p>
    <h3>Omfattas inte av lagstiftningen</h3>
    <p>
      <span class="value">
      Informationen i kartformat är inte fullständigt tillgänglig, men den inbäddade kartans existens stör inte den övriga användningen, och adressinformationen finns även i textformat.
      Lagstiftningen om tillgänglighet berör inte kartinnehåll.
      </span>
    </p>
    <h3>Identifieringstjänsten</h3>
    <p>
      Suomi.fi -identifikationstjänsten, som används för stark autentisering, prodceras av en tredje part och Åbo stad kan således inte påverka tjänstens tillgänglighet.
    </p>

    <h2>Upptäckte du tillgänglighetsbrister i vår digitjänst?<br />Tala om det för oss! Vi gör vårt bästa för att fixa bristerna.</h2>
    <p>
      <strong>
        Webbformulär
      </strong>
    </p>
    <p>
      <span class="value">
        <a href="https://opaskartta.turku.fi/eFeedback/sv/Feedback/30-S%C3%A4hk%C3%B6iset%20asiointipalvelut" target="_blank" rel="noopener noreferrer">Ge feedback om tillgängligheten med detta webbformulär</a>
      </span>
    </p>
    <p>
      <strong>
        E-post
      </strong>
    </p>
    <p>
      <span class="value">
        <a href="mailto:varaamo@turku.fi">varaamo@turku.fi</a>
      </span>
    </p>
    <h2>Tillsynsmyndigheten</h2>
    <p>
    Om du upptäcker ett tillgänglighetsproblem på webbplatsen, ge feedback i första hand till oss d.v.s. vi som upprätthåller webbplatsen.
    Det kan dröja upp till 14 dagar innan du får svar. Om du är missnöjd med svaret eller inte får något svar alls efter två veckor,
    <a href="https://www.tillgänglighetskrav.fi/dina-rattigheter/" target="_blank" rel="noopener noreferrer">kan du göra en anmälan till Regionförvaltningsverket i Södra Finland</a>.
    På webbplatsen för Regionförvaltningsverket i Södra Finland finns noggranna instruktioner för hur man gör en anmälan och hur ärendet hanteras.
    </p>

    <h3>Tillsynsmyndighetens kontaktuppgifter</h3>

    <p>
      Regionförvaltningsverket i Södra Finland<br />
      Enheten för tillgänglighetstillsyn<br />
      <a href="https://www.tillgänglighetskrav.fi" target="_blank" rel="noopener noreferrer">www.tillgänglighetskrav.fi</a><br />
      <a href="mailto:webbtillganglighet@rfv.fi">webbtillganglighet(at)rfv.fi</a><br />
      telefonnummer växel 0295 016 000
    </p>

    <h2>Vi jobbar kontinuerligt för bättre tillgänglighet</h2>
    <p>
      <strong>
        Det har gjorts en tillgänglighetsbedömning av våra digitjänster
      </strong>
    </p>
    <p>
      <span class="value">
        20.10.2019
      </span>
    </p>
    <p>
      <strong>
        Vi har bundit oss till att förbättra tillgängligheten i digitjänsterna
      </strong>
    </p>
    <p>
      <span class="value">
      Åbo stads tillgänglighetskompetens utvecklas systematiskt och målmedvetet.
      Stadens avtalsleverantörer för tillgänglighet kommer att göra en bedömning av stadens nuvarande webbtjänster.
      På basen av bedömingen kommer tillgängligheten i tjänsterna utvecklas att motsvara de lagenliga kraven för vardera tjänst inom utsatt tid.
      Vid utveckling och anskaffning av nya webbtjänster tas tillgängligheten i beaktande från början.
      Alla parter som deltar i utvecklingen och innehållsproduktinen av webbtjänsterna blir utbildade i tillgänglighetsfrågor.
      Staden har ett pågående projekt för att uppfylla Tillgänglighetslagens krav.
      </span>
    </p>
    <p>
      <strong>
        Denna webbplats/plattform har publicerats
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
