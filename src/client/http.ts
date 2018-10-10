interface Options {
  headers?: {};
  query?: {};
  method?: string;
  body?: string;
  search?: URLSearchParams;
}

export default (uri, options: Options = {}) => {
  const urlString = uri.match(/^http/) ? uri : `${location.origin}${uri}`;
  const token = localStorage.getItem('token');
  const url: URL = new URL(urlString);

  if (!options.headers) {
    options.headers = {};
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.query) {
    url.search = new URLSearchParams(options.query).toString();
  }

  return fetch(url.toString(), options);
};
