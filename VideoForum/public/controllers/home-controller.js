import { templates } from '../scripts/templates.js';
import { data } from '../scripts/data.js';
import { utils } from '../scripts/utils.js';

let homeController = function () { 
    function all() {
      Promise.all([data.posts.get(), templates.get('home')])
          .then(([data, template]) => {
              let html = template(data);
              $('#content').html(html);
          })
          .catch((err) => utils.showMsg(err, 'Error', 'alert-danger'));
  }

  return {
    all: all
  };
 }();

 export { homeController }