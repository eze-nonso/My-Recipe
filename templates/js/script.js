$(() => {
  const $columnCards = $('.card-columns');
  // To sieve out cards which without the .js-card-baseline
  const $columnCardsEmp = $columnCards.find('.card-body').not($('.js-card-baseline').closest('.card-body')).closest('.card');

  // The wrap and unwrap method helps to get the html() of the element itself
  const content = $('.js-card-baseline').wrap($('<div>')).parent().html();
  $('.js-card-baseline').unwrap();
  $columnCardsEmp.find('.card-body').append(content);

  $columnCards.on('mouseover', '.card', function (evt) {
    const $cardBase = $(this).find('.js-card-baseline');
    $cardBase.css({ height: '55px', transition: 'height 0.3s ease-in-out' });
    $cardBase.children('div').css('opacity', '1');
    $cardBase.find('.btn-block').attr({ 'aria-hidden': 'false' });

    // alternative implementation of evt.stopPropagation()
    return false;
  });

  $columnCards.on('mouseout', '.card', function (evt) {
    evt.stopPropagation();
    const $cardBase = $(this).find('.js-card-baseline');
    $cardBase.css({ height: '4px', transition: 'height 0.1s linear' });
    $cardBase.children('div').css('opacity', '0');
    $cardBase.find('.btn-block').attr({ 'aria-hidden': 'true' });
    return false;
  });

  // this is a development utility, to be removed
  $('#rec-details').modal({
    keyboard: false, show: true, focus: true, backdrop: 'static'
  });

  // eventually we want to directly populate the #controller, and use just JS for the #main-veiw. deletions required to remodel for that change are marked in **, modifications in *
  const articles = $('#main-view').html(), //* *
    controllers = $('#controller'),
    overlay = $('<div>');
  overlay.css({
    position: 'absolute', 'background-color': 'rgba(0,0,0,0.6)', height: 'inherit', top: 0, bottom: 0, left: 0, right: 0
  });

  controllers.html(articles).find('article').prepend(overlay);
  const navArticles = document.querySelectorAll('#controller article');

  let slideIndex = 0;
  next();
  function next(a) {
    // initially hide all #controller articles
    for (x in navArticles) {
      if (navArticles[x].style) navArticles[x].style.display = 'none';
    }

    if (!a) {
      for (let i = 0; i <= 3; i++) { //* 
        navArticles[i].style.display = 'block';
      }

      slideIndex = 4;
    } else if (a === 'right') {
      const right = slideIndex + 3;
      for (slideIndex; slideIndex <= right; slideIndex++) {
        if (navArticles[slideIndex]) navArticles[slideIndex].style.display = 'block';
      }
    } else if (a === 'left') {
      const left = slideIndex - 3;
      for (slideIndex; slideIndex <= left; slideIndex--) {
        if (navArticles[slideIndex] && slideIndex >= 0) navArticles[slideIndex].style.display = 'block';
      }
    }
  }
  // initialize main-view on startup -
  // populate #main-view with the first article from #controllers, then remove the overlay and restyle the overlay div for the first #controller article
  // finally, set the first #controller article to lastClicked

  // 1.populate
  const firstArticle = controllers.find('article').first().wrap($('<div>')).parent()
    .html();
  controllers.find('article').first().unwrap();
  $('#main-view').html(firstArticle);

  // 2.remove overlay
  $('#main-view').children('article').find('div').first()
    .remove();

  // 3.restyle overlay
  controllers.find('article').first().find('div').first()
    .css('background-color', 'rgba(0,0,0,0.3)');

  // 4.set lastClicked
  let lastClicked = controllers.children('article').first();

  // on click, set html content of #main-view to that of clicked controller
  controllers.on('click', 'article', function (evt) {
    if (lastClicked && $(this) !== lastClicked) lastClicked.find('div').first().css('background-color', 'rgba(0,0,0,0.6)');
    const content = $(this).wrap('<div>').parent().html();
    $(this).unwrap();
    $('#main-view').html(content).find('div').first()
      .remove();
    $(this).find('div').first().css('background-color', 'rgba(0,0,0,0.3)');
    lastClicked = $(this);
  });
});
