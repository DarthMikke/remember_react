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

  async get(path, headers={}) {
    headers['x-csrftoken'] = this.csrf;
    headers['token'] = this.token;
    return await fetch(`${this.base_url}/${path}`, {
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