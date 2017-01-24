'use strict';

class HFCRelayNav {
  options = {
    vpHeight: false,
    vpWidth: false
  };

  init(sel, options) {
    const root = this;

    // Settings options
    root._setViewport(); // assigning viewport options

    // merging options from the initialization
    root.options = Object.assign(root.options, options);

    /**
     *  Toggle dropdown
     */
    let selector = document.querySelector(sel);
    let submenu = selector.querySelectorAll('.has-submenu');
    Array.from(submenu).forEach(item => {
      item.getElementsByTagName('a')[0].addEventListener('click', (event) => {
        var parent = event.target.parentNode;

        console.log(item.getBoundingClientRect());

        root._toggleClass(parent, 'is-open');
        root._toggleClass(parent.querySelector('ul'), 'show');
      });
    });

    /*
     * Remove when clicked outside dropdown
     */
    document.addEventListener('click', (event) => {
      if (!root._getClosest(event.target, '.has-submenu') && event.target !== event.target.querySelector('.has-submenu')) {
        Array.from(submenu).forEach(item => {
          item.classList.remove('is-open');
          item.querySelector('ul').classList.remove('show');
        });
      }
    });
  };

  /**
   * Toggle class on element
   * @param el
   * @param className
   */
  _toggleClass(el, className) {
    const root = this;

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
   *  Returns the viewport width and height
   */
  _setViewport(mode) {
    const root = this;

    const viewport = [];
    let height = false;
    let width = false;

    ['Width', 'Height'].map((name) => {
      let docVal = document.documentElement['client' + name];
      let winVal = window['inner' + name];
      let number = Math.min(docVal, winVal);

      eval(`root.options.vp${name} = ${number}`);
    });
  };


  /**
   * Get the closest matching element up the DOM tree
   * @param {Element} elem Starting element
   * @param {String} selector Selector to match against (class, ID, or data attribute)
   * @return {Boolean|Element} Returns false if not match found
   */
  _getClosest(elem, selector) {
    const firstChar = selector.charAt(0);
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
}