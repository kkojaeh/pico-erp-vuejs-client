const firebaseProjectId = document.querySelector(
    'meta[name=firebase-project-id]').content;
let config;
if (firebaseProjectId === 'pico-erp-dev') {
  config = {
    apiKey: 'AIzaSyBaS7v9fhkK6Nn6MBqV02ej5T3ffdDKujc',
    authDomain: 'pico-erp-dev.firebaseapp.com',
    databaseURL: 'https://pico-erp-dev.firebaseio.com',
    projectId: 'pico-erp-dev',
    storageBucket: 'pico-erp-dev.appspot.com',
    messagingSenderId: '211743559657'
  };
} else if (firebaseProjectId === 'pico-erp-prd') {
  config = {
    apiKey: 'AIzaSyBD3_7mawl1eTovCDWJEO1_0pdj4-0Z75I',
    authDomain: 'pico-erp-prd.firebaseapp.com',
    databaseURL: 'https://pico-erp-prd.firebaseio.com',
    projectId: 'pico-erp-prd',
    storageBucket: 'pico-erp-prd.appspot.com',
    messagingSenderId: '1073558054534'
  };
} else {
  throw new Error(`${firebaseProjectId} is not allowed firebase project id`);
}

export {config};
