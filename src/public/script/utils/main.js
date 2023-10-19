$('.parti').on('click', function (e) {
    localStorage.setItem('parti', $(this).attr('dbid'))
    if(e.target.classList.contains('bilde')) {
        $('.vilDuStemme').html(`Vil du stemme på <b> ${e.target.parentNode.innerText}</b>`)
    } else {
        $('.vilDuStemme').html(`Vil du stemme på <b> ${e.target.innerText}</b>`)
    }
    
    $('.numberModelContainer').css('display', 'inline-flex')
    })

$(".avbryt").on("click", function(){
      $('.numberModelContainer').css('display', 'none');
      $(".vilDuStemme").html("");
})
 $("#bekreft").on("click", function(){
       $('.loadingContainer').css('display', 'inline-flex');
       $('.numberModelContainer').css('display', 'none');
       window.location.replace('/auth/facebook');
 })

 // HTML-element for "Logg ut" -knappen
const logoutButton = document.getElementById('logout-button');

$(".seRes").on("click", function(){
    window.location.replace('/resultat')
})

