export default class API {
  /**
   *
   * @param base_url {string}: First part of the URL, common for all endpoints. No trailing slash.
   * Examples:
   *   - http://localhost:8000/app_name
   *   - https://public.url/api
   * @param csrftoken {string}: Django's CSRF token
   * @param token {string}: App's access token
   */
  constructor(base_url, csrftoken, token) {
    this.base_url = base_url;
    this.csrf = csrftoken;
    this.token = token;

    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }
  
  /**
   *
   * @param path {string} path with no leading slash
   * @param body {object|null} one-level object
   * @param headers {object} one-level object.
   * @returns {Promise<Response<any, Record<string, any>, number>>}
   */
  async get(path, body=null, headers={}) {
    headers['x-csrftoken'] = this.csrf;
    headers['token'] = this.token;
    path = `${this.base_url}/${path}`;
    
    if (body !== null) {
      path = path + "?" + Object.keys(body).map((x) => `${x}=${body[x]}`).join("&");
    }
    
    return await fetch(path, {
      headers: headers
    });
  }

  async post(path, headers={}, body=null) {
    let formData = null;
    if (body !== null) {
      formData = new FormData();
      Object.keys(body).forEach(key => {
        console.log(key, body[key]);
        formData.append(key, body[key]);
      });
      console.log(Array.from(formData.entries()));
    }

    headers['x-csrftoken'] = this.csrf;
    headers['token'] = this.token;
    return await fetch(`${this.base_url}/${path}`, {
      method: 'post',
      headers: headers,
      body: formData,
    });
  }
}