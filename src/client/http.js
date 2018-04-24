export default (uri, options = {}) => {
  const urlString = uri.match(/^http/) ? uri : `${location.origin}${uri}`;
  const token = localStorage.getItem('token');
  const url = new URL(urlString);

  if (token) {
    if (!options.headers) {
      options.headers = {};
    }

    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.params) {
    url.search = new URLSearchParams(options.params);
  }

  return fetch(url, options);
};