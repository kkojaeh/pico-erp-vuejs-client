import {Alert, Dialog} from 'quasar';
import * as _ from 'lodash';

export function confirm(message) {
  return new Promise((resolve, reject) => {
    Dialog.create({
      title: '확인',
      message: message,
      buttons: [{
        label: '예',
        handler() {
          resolve(true);
        }
      }, {
        label: '아니오',
        handler() {
          resolve(false);
        }
      }
      ]
    });
  });
};

export function positive(message) {
  let alert = Alert.create({
    icon: 'done',
    position: 'bottom-right',
    color: 'positive',
    html: `${message}`
  });
  setTimeout(alert.dismiss, 4000);
};

export function negative(message) {
  let alert = Alert.create({
    icon: 'error',
    position: 'bottom-right',
    color: 'negative',
    html: `${message}`
  });
  setTimeout(alert.dismiss, 4000);
};

export function warning(message) {
  let alert = Alert.create({
    icon: 'warning',
    position: 'bottom-right',
    color: 'warning',
    html: `${message}`
  });
  setTimeout(alert.dismiss, 4000);
};

export function info(message) {
  let alert = Alert.create({
    icon: 'info',
    position: 'bottom-right',
    color: 'info',
    html: `${message}`
  });
  setTimeout(alert.dismiss, 4000);
};