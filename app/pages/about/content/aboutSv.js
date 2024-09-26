export default function getAboutContentSv(feedbackLink) {
  return `
<h1>Information om Åbo stads Varaamo-tjänst</h1>
<p>Varaamo är en onlinetjänst som upprätthålls av Åbo stad, där du kan boka utrymmen, utrustning och experttjänster.
  Tjänsten finns tillgänglig på <b>varaamo.turku.fi.</b></p>
<p>Syftet med Varaamo är att göra bokningar tillgängliga oavsett tid och plats. Med denna tjänst strävar vi efter att
  effektivisera användningen av bokningsbara resurser och samla in data, såsom användningsgrad och kundnöjdhet.</p>
<h2>Betalning för utrymmen</h2>
<p>De flesta av utrymmena som finns tillgängliga på Varaamo är kostnadsfria, men vissa kan kräva betalning. Både
  privatpersoner och föreningar/organisationer kan boka utrymmen. Kostnaden kan variera beroende på om den bokande
  parten är en privatperson eller representerar en förening/organisation.</p>
<h2>Att göra, ändra och avboka bokningar</h2>
<h3>Identifiering</h3>
<p>Du kan göra bokningar antingen med eller utan identifiering, beroende på vilken resurs som bokas.
  Identifieringsmetoder inkluderar:</p>
<ul>
  <li>Suomi.fi-identifikation</li>
  <li>Vaski-bibliotekskort och dess PIN-kod</li>
  <li>Åbo stads anställningsuppgifter</li>
</ul>
<p>För bokningar som kräver betalning behövs alltid en starkare form av identifiering, vilket innebär att en annan metod
  än Vaski-bibliotekskort måste användas.</p>
<h3>Ändra och avboka bokningar</h3>
<p>Du kommer att få en bekräftelse av din bokning via e-post eller SMS. Det är dock <b>inte möjligt</b> att svara på
  dessa meddelanden eller använda Varaamo-tjänstens e-postadress för att begära ändringar.</p>
<p>För att ändra eller avboka en bokning du själv gjort:</p>
<ul>
  <li>Logga in i systemet på samma sätt som när du gjorde bokningen. Efter inloggning, gå till <b>Mina bokningar</b>.
  </li>
  <li><b>Observera att systemet känner igen dig olika beroende på vilken identifieringsmetod du använder</b>. Till
    exempel, om du loggar in med ett bibliotekskort, kommer du inte att se bokningar som gjorts med bankuppgifter.</li>
</ul>
<p>Ändra bokningar gjorda av personal:</p>
<ul>
  <li>Om stadens personal har gjort en bokning åt dig, kontakta den aktuella enheten för att göra ändringar.
    Kontaktuppgifterna för varje plats finns på resursens presentationssida.</li>
</ul>
<h2>Boka andra idrottsanläggningar</h2>
<p>Om du vill boka idrottsanläggningar som inte finns tillgängliga via Varaamo kan du göra det via Åbo stads separata
  Timmi-system på <b>timmi.turku.fi</b>.</p>
<h2>Lämna feedback</h2>
<p>Vi välkomnar feedback från användare av Varaamo. Du kan lämna feedback via denna <a href=${feedbackLink} rel="noopener noreferrer" target="_blank">länk</a>.
 Välj "Varaamo -bokningstjänst" som ämne för din feedback. Tack!</p>
  `;
}
