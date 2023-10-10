

fetch(`/oppdaterParti/${localStorage.getItem('parti')}`)
  .then((response) => {
    if (response.ok) {
      console.log('Stemmeoppdatering vellykket');
      $('.loadingContainer').css('display', 'none');
      
      // Oppdater lokalt grensesnitt eller vis en bekreftelsesmelding
    } else if (response.status === 403) {
        window.location.replace('/stemt');
      console.log('Du har allerede stemt.');
      // Vis en melding for brukeren om at de allerede har stemt.
    } else {
    //   window.location.href = '/';
    console.log("noe gikk galt")
    }
  })
  .catch((error) => {
    console.error(error);
  });


  
    