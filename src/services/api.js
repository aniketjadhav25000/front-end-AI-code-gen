const API_BASE = 'http://localhost:5000/api';

export const apiPost = async (url, data, token = null) => {
  const jwt = token || localStorage.getItem('token');
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const apiGet = async (url, token = null) => {
  const jwt = token || localStorage.getItem('token');
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'GET',
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });
  return await res.json();
};
