/** ------------------------------------------------------------------------------------------------
 *  Dark Theme Switcher (just click the site logo)
 *  --------------------------------------------------------------------------------------------- */
const logo = document.getElementsByClassName('site-logo__icon')[0];
const darkElements = [
  'body',
  'header',
  'header-menu',
  'site-logo',
  'search',
  'account',
  'sidebar',
  'sidebar-menu',
  'breadcrumbs',
  'content-header',
  'content-suggestions',
  'single-tab',
  'single-widget',
  'manage-buttons',
  'task-list',
  'single-task',
  'market-chart',
  'chart-column',
];

logo.onclick = () => {
  darkElements.forEach(el => {
    const temp = [...document.getElementsByClassName(el)];

    temp.forEach(element => {
      element.classList.toggle(`${el}--dark`);
    });
  });
};

/** ------------------------------------------------------------------------------------------------
 *  JS Helper for togglin' "focus" state after clicking primary-button
 *  --------------------------------------------------------------------------------------------- */
const primaryButton = [...document.getElementsByClassName('primary-button')];

primaryButton.forEach(el => {
  el.onclick = () => {
    el.blur();
  };
});

/** ------------------------------------------------------------------------------------------------
 *  JS Logic for all navigation buttons switchin'
 *  --------------------------------------------------------------------------------------------- */
const navElements = ['header-menu', 'sidebar-menu', 'layout-switch'];
const navElementsMap = navElements.map(element => {
  const temp = {};
  if (document.getElementsByClassName(element)[0].tagName === 'NAV') {
    temp[element] = Array.from(document.getElementsByClassName(`${element}__link`));
  } else {
    temp[element] = Array.from(document.getElementsByClassName(`${element}__button`));
  }
  return temp;
});

// TODO: Нужно будет оптимизировать этот код
navElementsMap.forEach(el => {
  Object.keys(el).forEach(key => {
    el[key].forEach(element => {
      element.onclick = () => {
        if (document.getElementsByClassName(key)[0].tagName === 'NAV') {
          document
            .getElementsByClassName(`${key}__link--active`)[0]
            .classList.toggle(`${key}__link--active`);
          element.classList.toggle(`${key}__link--active`);
        } else {
          document
            .getElementsByClassName(`${key}__button--active`)[0]
            .classList.toggle(`${key}__button--active`);
          element.classList.toggle(`${key}__button--active`);
        }
      };
    });
  });
});

/** ------------------------------------------------------------------------------------------------
 *  "tabs-grid" horizontal scrolling on mouseover and wheel
 *  --------------------------------------------------------------------------------------------- */

const tabsGrid = document.getElementsByClassName('tabs-grid')[0];
let scrollTemp = 0;
let scrollMax = 0;

// TODO: Нужно будет создать обработку для "preventDefault"
if (window.innerWidth < 1200) {
  tabsGrid.onwheel = e => {
    const { scrollLeft } = document.getElementsByClassName('tabs-grid')[0];

    e.preventDefault();
    // if (scrollLeft >= 0 && scrollLeft !== scrollTemp) {
    //   e.preventDefault();
    // }
    if (e.deltaY > 0) tabsGrid.scrollLeft += 100;
    else tabsGrid.scrollLeft -= 100;
    // e.deltaY > 0 ? (tabsGrid.scrollLeft = tabsGrid.scrollLeft + 100) : (tabsGrid.scrollLeft = tabsGrid.scrollLeft - 100);
    scrollTemp = scrollLeft;
    if (scrollMax < scrollLeft) scrollMax = scrollLeft;
  };
}
