fetch('/hent-data')
  .then((response) => response.json())
  .then((data) => {
    lagChart(data)
  })
  .catch((error) => {
    console.error('Error fetching data:', error)
  })

  const data = []

function lagChart(data) {
   data = [
    { parti: 'R', count:data[0].stemmer },
    { parti: 'SV', count:data[1].stemmer},
    { parti: 'AP', count: data[2].stemmer },
    { parti: 'SP', count: data[3].stemmer},
    { parti: 'MDG', count:  data[4].stemmer},
    { parti: 'KRF', count:data[5].stemmer},
    { parti: 'V', count:  data[6].stemmer},
    { parti: 'H', count: data[7].stemmer },
    { parti: 'FRP', count:data[8].stemmer },
  ];

  new Chart(
    document.getElementById('valgResultat'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.parti),
        datasets: [
          {
            label: 'Valg resultater',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
  }