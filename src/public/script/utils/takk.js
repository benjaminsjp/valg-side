
fetch(`/oppdaterParti/${localStorage.getItem('parti')}`)
  .then((response) => {
    if (response.status == 500) {window.location.href = '/stemt'}
    if (response.ok) {
      console.log('Stemmeoppdatering vellykket');
      $('.loadingContainer').css('display', 'none');
    } else {
      console.error('Request failed with status:', response.status);
    }
  })
  .catch((error) => {
    console.error(error);
});