(function() {
  /**
   * Toggle class on element
   * @param el
   * @param className
   */
  var toggleClass = function (el, className) {
    if (el.classList) {
      el.classList.toggle(className);
    } else {
      var classes = el.className.split(' ');
      var existingIndex = classes.indexOf(className);

      if (existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(className);
      }

      el.className = classes.join(' ');
    }
  };

  /**
   * Get the closest matching element up the DOM tree
   * @param {Element} elem Starting element
   * @param {String} selector Selector to match against (class, ID, or data attribute)
   * @return {Boolean|Element} Returns false if not match found
   */
  var getClosest = function (elem, selector) {
    var firstChar = selector.charAt(0);
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (firstChar === '.') {
        if (elem.classList.contains(selector.substr(1))) {
          return elem;
        }
      } else if (firstChar === '#') {
        if (elem.id === selector.substr(1)) {
          return elem;
        }
      } else if (firstChar === '[') {
        if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
          return elem;
        }
      }
    }
    return false;
  };

  /*
   * Toggle dropdown
   */
  var submenu = document.querySelectorAll('.has-submenu');
  Array.from(submenu).forEach(item => {
    item.getElementsByTagName('a')[0].addEventListener('click', function(event) {
      var parent = event.target.parentNode;

      toggleClass(parent, 'is-open');
      toggleClass(parent.querySelector('ul'), 'show');
    });
  });

  /*
   * Remove when clicked outside dropdown
   */
  document.addEventListener('click', function (event) {
    if (!getClosest(event.target, '.has-submenu') && event.target !== this.querySelector('.has-submenu')) {
      Array.from(submenu).forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('ul').classList.remove('show');
      });
    }
  });
})();