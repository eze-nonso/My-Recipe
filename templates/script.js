const paragraph = document.querySelector('.paragraph');

paragraph.onmouseover = function () {
  paragraph.style.color = 'Green';
  paragraph.style.display = 'inline';
  const norm = paragraph.style.fontSize;
  console.log(norm);
  paragraph.style.fontSize = '4rem';
  paragraph.onmouseout = function () {
    paragraph.style.color = 'Black';
    paragraph.style.fontSize = norm;
  };
};

const button = document.querySelector('button');
button.textContent = 'Content activated by JavaScript';
button.style.backgroundColor = 'Blue';

const divgroup = document.querySelectorAll('.divstyle div');

for (let i = divgroup.length - 1; i >= 0; --i) {
  console.log(i);
  divgroup[i].onclick = function toggleCol(evt) {
    console.log(evt.target.style.backgroundColor.toString());
    if (evt.target.style.backgroundColor === 'lime') {
      console.log('yay');
      evt.target.style.backgroundColor = 'Yellow';
      return;
    }
    console.log('Nay');
    evt.target.style.backgroundColor = 'Lime';
  };
}

console.log((document.querySelectorAll('.divstyle div')[1].style));


document.querySelectorAll('.divstyle div')[1].style.backgroundColor = 'green';
console.log(document.querySelectorAll('.divstyle div')[1].style.backgroundColor);
// let body = document.querySelector('body');
// body.onload = function() {
// alert('Welcome to my homepage');
// }

// only one of body.onload and window.onload may be used

window.onload = function () {
  const heading = document.createElement('h1');
  const container = document.querySelector('.container');
  const bigText = 'I am a big big heading text';
  const text = document.createTextNode(bigText);
  heading.appendChild(text);
  container.appendChild(heading);
};


// $(
//   function() {
//     $('.divstyle').find('> div:first').append($('<button>Click me</button>'));
//     $('.divstyle').on('click', 'div', function() {
//       let welcome = $('<p>Welcome to our interactive click handler</p>');
//       $(this).empty();
//       $(this).prepend(welcome);
//     });
//     $('.divstyle').append($('<div><p>Attached div here</p></div>'));
//     // $('div').find('div').first().text('Another great content activated by JavaScript');
//     $('div').find('div').last().prev().next('div').prev().text('Using transversal methods to find the second to last div');
//     $('div').find('> div').css('border', '2px outset yellow');
//     $('div').children('div').css('margin', '2rem');
//     $('.divstyle').find('div').css({position: 'relative'});
//     $('.divstyle').on('mouseover', 'div', function() {
//       $(this).animate({bottom: -10}, 'slow');
//     });
//     $('.divstyle').on('mouseleave', 'div', function() {
//       $(this).animate({bottom: 0}, 'fast');
//     });
//
//   }
// );

// window.location.href = 'facebook.com'; sets the url of the current page
