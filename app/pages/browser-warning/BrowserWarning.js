import React from 'react';

function BrowserWarning() {
  return (
    <div>
      <p className="alert alert-warning">
        Varaamo does not support Internet Explorer.
        Please use another browser (such as
        <a href="https://www.google.com/chrome/"> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a>
        or
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>
        ).
      </p>
      <p className="alert alert-warning">
        Varaamo ei tue Internet Explorer selainta.
        Käytä toista selainta (kuten
        <a href="https://www.google.com/chrome/"> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a>
        tai
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>
        ).
      </p>
      <p className="alert alert-warning">
        Varaamo stöder inte Internet Explorer.
        Vänligen använd någon annan webbläsare (t.ex.
        <a href="https://www.google.com/chrome/"> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a>
        eller
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>
        ).
      </p>
    </div>
  );
}

export default BrowserWarning;
