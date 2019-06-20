const dataFetch = (source, callback) => {
  fetch(`data/${source}.json`)
    .then(response => response.json())
    .then(json => callback(json))
    .catch(err => {
      console.error('Failed to load source', err);
      callback([]);
    });
};

/**
 * Fetches data...
 **/
export default dataFetch;
