class APIError extends Error {
  /**
   *
   * @param status {number|null}
   * @param error {string}
   */
  constructor(status, {error}) {
    console.log(error);
    super(error);
    this.status = status;
  }
}

export default class API {
  /**
   *
   * @param base_url {string}: First part of the URL, common for all endpoints. No trailing slash.
   * Examples:
   *   - http://localhost:8000/app_name
   *   - https://public.url/api
   * @param csrftoken {string|null}: Django's CSRF token
   * @param token {string|null}: App's access token
   */
  constructor(base_url, csrftoken=null, token=null) {
    this.base_url = base_url;
    this.csrf = csrftoken;
    this.token = token;

    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  /**
   * Update or set token
   * @param token {string}
   */
  setToken(token) {
    this.token = token;
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

  /**
   *
   * @param username {string}
   * @param password {string}
   * @throws {APIError}
   * @returns {Promise<any>}
   */
  async login(username, password) {
    let response;
    try {
      response = await this.post(`chores/api/login`, {}, {username: username, password: password});
    } catch {
      throw new APIError(500, {error: "Unknown error"});
    }
    let json = await response.json();
    if (response.status === 200) {
      this.setToken(json.access_token);
      return json;
    } else {
      throw new APIError(response.status, json);
    }
  }

  /**
   *
   * @param username {string}
   * @param email {string}
   * @param password {string}
   * @returns {Promise<Response<any, Record<string, any>, number>>}
   */
  async register(username, email, password) {
    return await this.post(`chores/api/login`, {}, {username: username, password: password});
  }

  /**
   * @throws {APIError}
   * @returns {Promise<object>} Object containing the response.
   */
  async checklists() {
    if (this.token === null || this.token === undefined) return;

    let response;
    try {
      response = await this.get('chores/api/checklists/');
    } catch {
      throw new APIError(500, {error: "Unknown error"});
    }
    let json = await response.json();
    if (response.status === 200) {
      return json;
    } else {
      throw new APIError(response.status, json);
    }
  }

  /**
   *
   * @param name
   * @returns {Promise<object>}
   */
  async addChecklist(name) {
    let response;
    try {
      response = await this.post('chores/api/checklist/add', {}, {'name': name});
    } catch {
      throw new APIError(500, {error: "Unknown error"});
    }

    let json;
    try {
      json = await response.json();
    } catch {
      throw new APIError(999, {error: "Unknown error"});
    }

    if (response.status === 200) {
      return json;
    } else {
      throw new APIError(response.status, json);
    }
  }

  /**
   *
   * @param pk
   * @returns {Promise<object>} the Checklist object.
   */
  async checklist(pk) {
    let response;
    try {
      response = await this.get(`chores/api/checklist/${pk}`);
    } catch {
      throw new Error(500, {error: "Unknown error"});
    }
    let json;
    try {
      json = await response.json();
    } catch {
      throw new APIError(999, {error: "Unknown error"});
    }
    if (response.status === 200) {
      return json;
    } else {
      throw new APIError(response.status, json);
    }
  }

  /**
   *
   * @param pk {number}
   * @param name {string}
   * @returns {Promise<object>}
   */
  async updateChecklist(pk, name) {
    let response;
    try {
      response = await this.post(
        `chores/api/checklist/${pk}/update`,
        {},
        {'name': name}
      );
    } catch (e) {
      throw new APIError(500, {error: "Unknown error"});
    }
    let json;
    try {
      json = await response.json();
    } catch (e) {
      throw new APIError(999, {error: "Unknown error"});
    }
    if (response.status === 200) {
      return json;
    } else {
      throw new APIError(response.status, json);
    }
  }

  async removeChecklist(pk) {

  }

  async shareChecklist(pk) {

  }
}