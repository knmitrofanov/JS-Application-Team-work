import { homeController } from '../controllers/home-controller.js';
import { postsController } from '../controllers/posts-controller.js';
import { usersController } from '../controllers/users-controller.js';


var router = (() => {
    let navigo;

    function init() {

        navigo = new Navigo(null, false);
        navigo
            .on('/posts/add', postsController.add)
            .on('/posts/:id', postsController.getById)
            .on('/posts', postsController.all)
            .on('/register', usersController.register)
            .on('/', homeController.all)
            .resolve();

        function getQueryParams(query) {
            let hash, vars = {},
                hashes = query.substr(1)
                .split('&').forEach(val => {
                    hash = val.split('=');
                    vars[hash[0]] = hash[1];
                });
            return vars;
        }
    }
    return {
        init
    }
})();

export { router }