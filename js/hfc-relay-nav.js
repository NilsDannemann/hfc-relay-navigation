'use strict';

class HFCRelayNav {
  options = {
    initCallback: () => {},
    vpHeight: false,
    vpWidth: false
  };

  init(sel, options) {
    const root = this;
    let selector = document.querySelector(sel);

    /**
     * Settings options
     */
    root._setViewport(); // assigning viewport options

    /**
     * merging options from the initialization
     */
    root.options = Object.assign(root.options, options);

    /**
     * changing the viewport options while resizing
     */
    window.addEventListener('resize', () => {
      root._setViewport();
    }, true);

    /**
     * add submenu classes
     */
    this._applyClassToElement(selector, 'has-submenu');

    /**
     *  Toggle dropdown
     */
    let submenu = selector.querySelectorAll('.has-submenu');
    root._map(submenu, (item) => {
      item.getElementsByTagName('a')[0].addEventListener('click', (event) => {
        var parent = event.target.parentNode;
        let classNames = ['show'];
        let right = parseInt(item.getElementsByTagName('ul')[0].getBoundingClientRect().right);
        let maxWidth = root.options.vpWidth;

        if(right >= maxWidth) {
          classNames.push('from-left');
        }

        root._toggleClass(parent, 'is-open');
        root._toggleClass(parent.querySelector('ul'), classNames);
      });
    });

    /*
     * Remove when clicked outside dropdown
     */
    document.addEventListener('click', (event) => {
      if (!root._getClosest(event.target, '.has-submenu') && event.target !== event.target.querySelector('.has-submenu')) {
        root._map(submenu, (item) => {
          item.classList.remove('is-open');
          item.querySelector('ul').classList = '';
        });
      }
    });

    /**
     * running the callback after initializing
     */
    root.options.initCallback();
  };

  /**
   * Toggle class on element
   * @param el
   * @param classNames
   */
  _toggleClass(el, classNames) {
    const root = this;
    const classes = el && el.className.split(' ') ? el.className.split(' ') : [];
    const action = (classes.indexOf('show') !== -1 ? 'hide' : 'show');
    let type = typeof classNames;

    if(type === 'string') {
      el.classList.toggle(classNames);
    } else if(type === 'object') {
      let existingIndex = classes.indexOf('from-left');

      classNames.map((className) => {
        el.classList.toggle(className);
      });

      if(existingIndex === 1) {
        setTimeout(() => {
          el.classList.toggle('from-left');
        }, 350)
      }

      /**
       * hide all children that are visible
       */
      if(action == 'hide') {
        root._map(el.querySelectorAll('ul.show'), (ul) => {
          root._toggleClass(ul, 'show');
        });
      }
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

  /**
   * Apllys a class to a Element recursively
   * @param {String} selector Selector to match against (class, ID, or data attribute)
   * @param {String} class name to add
   */
  _applyClassToElement(selector, className) {
    const root = this;
    let lis = selector.querySelectorAll('li');

    root._map(lis, (li) => {
      let length = li.childNodes.length;

      if(length > 1) {
        root._toggleClass(li, className);
      }
    });
  };

  /**
   * Wrapper for [1,2,3].map
   * @param {Array} Array
   * @param {Func} function to call
   */
  _map(array, func) {
    return Array.prototype.map.call(array, func);
  }
}