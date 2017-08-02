import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a class="search__result" href="/store/${store.slug}">
        <strong>${store.name}</strong>
      </a>
      `
 }).join('');
}

function typeAhead(search) {
  if(!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    if(!this.value) {
      searchResults.style.display = 'none';
      return;
    }
    searchResults.style.display = 'block';
    // searchResults.innerHTML = '';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if(res.data.length) {
          dompurify.sanitize(searchResults.innerHTML = searchResultsHTML(res.data));
          return;
        }
        searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No result for ${this.value} found</div>`);
      })
      .catch(err => {
        console.error(error);
      });
  });

  //handle keyboard inputs
  searchInput.on('keyup', (e) => {
    //in not up down or enter, who cares
    if(![38, 40, 13].includes(e.keyCode)) {
      return;
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);

    const items = search.querySelectorAll('.search__result');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
    }
    if(current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

export default typeAhead;