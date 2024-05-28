import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollableContainer = document.querySelector('.contentContainer');
    if (scrollableContainer) {
      scrollableContainer.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
