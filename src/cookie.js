export default function getCookie(name) {
  let cookies = document.cookie;
  let split = cookies.split(name + "=");
  if (split.length === 1) {
    return undefined;
  }

  return split[1].split(';')[0]
}

export function setCookie(name, value, duration=1) {
  let now = new Date();
  now.setTime(now.getTime() + (duration*24*3600*1000));
  document.cookie = `${name}=${value}; expires=${now.toUTCString()}`;
}
