const TOKEN_KEY = "authToken";

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

//Retorna true si tenemos almacenado el token
//Retorna false si no tiene almacenado token

const isAuthenticaded = () => {
  return !!getToken();
};

export { setToken, getToken, removeToken, isAuthenticaded };
