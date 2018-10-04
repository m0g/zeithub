interface Options {
  headers: {};
  query: string;
  search: URLSearchParams;
}

const defaultOptions = {
  headers: {},
  query: '',
  search: new URLSearchParams()
};

export default (uri, options: Options = defaultOptions) => {
  const urlString = uri.match(/^http/) ? uri : `${location.origin}${uri}`;
  const token = localStorage.getItem('token');
  const url = new URL(urlString);

  if (!options.headers) {
    options.headers = {};
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.query) {
    url.search = new URLSearchParams(options.query);
  }

  return fetch(url, options);
};
