# JQuery Tutorial

```javascript
$(window).on('load', handler);
```
To listen for the onload event on window. Use this for code that depends on page elements. Eg on the dimensions of an image.

- - -

```JavaScript
$().ready(handler);
$(document).ready(handler);
$(handler);
```
This is the default lead-in to writing JQuery, it runs the handler:
* synchronously when the DOM is safe to manipulate (browsers typically fire the `DOMContentLoaded` event), or
* synchronously if the DOM is ready before the jquery is executed.

- - -

### Transversing:
```javascript
$(selector).find(selector/element)  //selects the descendants of the first selector
$(selector).children(selector/element) //selects only the direct descendants of the first selector
$(selector).first() //selects the first from a list of matching target elements
$(selector).last() //selects the last from a list of matching target elements
$(selector).last().prev() //selects the second to last element from a set of matching elements
$(selector).parent() //selects the parent of each element in the set of matching elements
$(selector).closest(selector2) //select the closest selector2 scanning from selector up its ancestors
$(selector).next(); //selects the adjoining sibling to selector, optionally takes a selector parameter
$(selector).parents() //selects the parents of each element in the set of matching elements
```

- - -

### Inserting:
```javascript
$(selector).append(content);
$(selector).prepend(content);
$(selector).before(content);
$(selector).after(content);
```

- - -

### Removing:
```javascript
$(selector).remove();
$(selector).detach();
$(selector).empty(); //removes all child nodes and text from selector
```

- - -

### Attaching handlers:
```javascript
$(selector).on('click', handler);
$(selector).on('click', selector2, handler); //run handler if the event occurs on a selector2 element within selector (implementation resembles find function)
```

- - -

### Saving data (using `data-*` attributes):
```JavaScript
$(selector).data(key, data);
$(selector).data(key); //to retrieve data with key
```

- - -

### Filtering:
```JavaScript
$(class1).filter(class2); //selects class1 elements that have another class class2
$(selector).filter(function(index) {})
```

- - -

### Classes:
```JavaScript
$(selector).addClass('class');
$(selector).removeClass('class');
```

- - -

### Showing/hiding (using display css):
```JavaScript
$(selector).slideDown(); //shows selector with a slidedown animation
$(selector).slideUp(); //hides selector with a slideup animation
$(selector).slideToggle(); //hybrid of the above two
$(selector).fadeIn();
$(selector).fadeOut();
$(selector).fadeToggle();
```

- - -

### Events:
```JavaScript
$(selector).on('moouseenter', handler);
$(selector).on('keydown', handler);
```

- - -

### Forms:
To capture form data, you can listen to the `keyup` or `change` events.
```JavaScript
$(form-selector).on('keyup', function() {
  let input = $(this).val();  //to harvest data entered in form element (e.g. input)
});
$(form-selector).on('change', handler); //to harvest data using the change event
$(form-selector).val(value); //sets the value of form element differently based on form type, read up
```

- - -

### Event object:
```JavaScript
$(selector).on('click', function(evt) {
  evt.preventDefault(); //also prevents links from loading url which is the default behaviour for links on click
  evt.stopPropagation(); //stops the bubbling phase
})
```

- - -

### CSS
```JavaScript
$(selector).css('background-color', '#233');
$(selector).css({'background-color': '#233', 'font-weight': 'bold'});
$(selector).show(); //shows a hidden element, optionally accepts arguments, read up
$(selector).hide();
$(selector).animate({'top': '-14px', 'opacity': 1}, fast) //takes a first object specifying properties to animate, and a second optional object for extra settings
```


## General Tips
* You can pass a number or string to the `text()` method. This method escapes html characters. To insert html characters, use `html()` instead
```JavaScript
$(selector).text(string or number);
```

* You can use plus to convert strings to numbers eg
`+'11';`

* To get/set content of most `html` elements, one can use `.val()`, `.text()` and `.html()`.

* To get/set element attributes, use `.attr()`.

* To get/set element properties, use `.prop()`.

* Use `elem.trigger(event)` to emit a DOM event, this runs the event handlers and performs the associated behavior.

* To hide elements with css, one can use
    `opacity`, `display`, `position`, `visibility` and `clip-path`

* Why is it problematic to nest callbacks which use `slideToggle()` serially? like so:
```JavaScript
  $(document).ready(function() {
    $(selector).on(mouseenter, function() {
      $(this).find(selector2).slideToggle();
      $(this).on(mouseleave, function() {
        $(this).find(selector2).slideToggle();
      });
    });
  });
```
