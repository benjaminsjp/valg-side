fetch(`/oppdaterParti/${localStorage.getItem('parti')}`)
  .then((response) => {
    if (response.ok) {
      console.log('Vellykket')
    } 
    else {
      console.error('Request failed with status', response.status)
    }
  })
  .catch((error) => {
    console.error(error);
  });