import {Dialog} from 'quasar';

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
}
