'use strict';

/**
 * class HFCRelayNav
 */
class HFCRelayNav {
  /**
   * Options
   */
  options = {
    initCallback: () => {},
    vpHeight: false,
    vpWidth: false,
    backLinkText: 'Zurück'
  };

  /**
   * Initilatization
   * @param {String} Selector | Element
   * @param {Object} Options
   */
  init(sel, options) {
    const root = this;
    let selector = document.querySelector(sel);

    /**
     * Settings options
     */
    root._setViewport(); // assigning viewport options

    /**
     * Merging options from the initialization
     */
    root.options = Object.assign(root.options, options);

    /**
     * Changing the viewport options on resize
     */
    window.addEventListener('resize', () => {
      root._setViewport();
    }, true);

    /**
     * Add submenu classes
     */
    this._applySubmenuToElement(selector, 'has-submenu');

    /**
     * Toggle dropdown
     */
    let submenu = selector.querySelectorAll('.has-submenu');
    root._map(submenu, (item) => {
      item.querySelector('a:not(.back)').addEventListener('click', (event) => {
        let parent = event.target.parentNode;
        let classNames = ['show'];
        let right = parseInt(item.getElementsByTagName('ul')[0].getBoundingClientRect().right);

        /**
         * Pushing menu to the left side when its outside the viewport
         */
        if(right >= root.options.vpWidth) {
          classNames.push('from-left');
        }

        /**
         * Toggleing some classes
         */
        root._toggleClass(parent, 'is-open');
        root._toggleClass(parent.querySelector('ul'), classNames);
      });
    });

    /*
     * Remove when clicked outside dropdown
     */
    document.addEventListener('click', (event) => {
      let openedDropdowns = selector.querySelectorAll('ul.show');

      if (!root._getClosest(event.target, '.has-submenu') && !root._getClosest(event.target, '.priority-nav-is-visible') && event.target !== event.target.querySelector('.has-submenu') && !event.target.classList.contains('back')) {
        /**
         * Close all opened dropdowns when clicking outside nav
         */
        root._map(openedDropdowns, (openedDropdown) => {
          root._toggleClass(openedDropdown, 'show');
          root._toggleClass(openedDropdown.parentNode, 'is-open');
        });
      } else if(root._getClosest(event.target, '.priority-nav-is-visible')) {
        /**
         * Special behaivior for mobile nav trigger
         */
        let openedLis = selector.querySelectorAll('li.is-open');
        root._map(openedLis, (openedLi) => {
          root._toggleClass(openedLi.querySelector('ul.show'), 'show');
          root._toggleClass(openedLi, 'is-open');
        });
      } else if(!event.target.classList.contains('back')) {
        root._map(openedDropdowns, (openedDropdown) => {
          let nearestLi = root._getClosest(event.target.parentNode, '.is-open');

          /**
           * Close all other opened dropdowns when opened a new
           */
          if(openedDropdown.parentNode !== nearestLi && !openedDropdown.parentNode.contains(nearestLi)) {
            root._toggleClass(openedDropdown, 'show');
            root._toggleClass(openedDropdown.parentNode, 'is-open');
          }
        });
      }
    });

    /**
     * Add eventlistener to back button to hide the submenu
     */
     let backLinks = selector.querySelectorAll('a.back');

     /**
      * Looping all links and add a eventlistener to it
      */
     root._map(backLinks, (backLink) => {
      backLink.addEventListener('click', (event) => {
        let ul = backLink.parentNode.parentNode;

        if(ul.classList.contains('show')) {
          root._toggleClass(ul, 'show');

          if(ul.parentNode.classList.contains('has-submenu')) {
            root._toggleClass(ul.parentNode, 'is-open');
          }
        }
      });
     });

    /**
     * Running the callback after initializing
     */
    root.options.initCallback();
  };

  /**
   * Toggle class on element
   * @param {String} el
   * @param {String|Array} classNames
   */
  _toggleClass(el, classNames) {
    const root = this;
    const classes = el && el.className ? el.className.split(' ') : [];
    const action = (classes.indexOf('show') !== -1 ? 'hide' : 'show');
    let type = typeof classNames;

    /**
     * Checking if the classNames are a string or object
     */
    if(type === 'string') {
      el.classList.toggle(classNames);
    } else if(type === 'object') {
      let existingIndex = classes.indexOf('from-left');

      /**
       * Removeing classes
       */
      classNames.map((className) => {
        el.classList.toggle(className);
      });

      /**
       * Little delay for smooth transitions
       */
      if(existingIndex === 1) {
        setTimeout(() => {
          el.classList.toggle('from-left');
        }, 350)
      }

      /**
       * Hide all children that are visible
       */
      if(action == 'hide') {
        root._map(el.querySelectorAll('ul.show'), (ul) => {
          root._toggleClass(ul, 'show');
        });
      }
    }
  };

  /**
   * Returns the viewport width and height
   */
  _setViewport() {
    const root = this;

    /**
     * Setting some options for viewport calculations
     */
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
  _applySubmenuToElement(selector, className) {
    const root = this;

    /**
     * Looping all lis
     */
    root._map(selector.querySelectorAll('li'), (li) => {
      /**
       * Check if the li has children and add has-submenu to it
       */
      if(li.childNodes.length > 1) {
        /**
         * Creating some DOM-Elements to store the back link
         */
        let backLink = document.createElement('li');
        let aTag = document.createElement('a');

        /**
         * Appending elements to the li to display the back link
         */
        aTag.appendChild(document.createTextNode(root.options.backLinkText));
        aTag.classList = 'back';
        backLink.appendChild(aTag);

        /**
         * Appending the li to the ul at the first position
         */
        let ul = li.querySelector('ul');
        ul.insertBefore(backLink, ul.firstChild);

        /**
         * Adding has-submenu to the li
         */
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