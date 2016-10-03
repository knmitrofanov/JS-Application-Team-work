mocha.setup('bdd');
const expect = chai.expect;

import { data as dt} from '../scripts/data.js';

const user = {
    username: 'USERNAME',
    password: 'PASSWORD',
    email: "ABV",
    displayName: "PESHO"
};


var data = dt.users;

console.log(data.register(user));

describe('Register tests', function () {

    beforeEach(function () {
        sinon.stub(data, 'register')
            .returns(new Promise((resolve, reject) => {
                resolve(user);
            }));
    });
    afterEach(function () {
        data.register.restore();
    });

    it('Expect userRegister to be called once', function (done) {
        data.register(user)
            .then(() => {
                expect(data.register.calledOnce).to.be.true;
            })
            .then(done, done);
    });
    it('Expexct userRegister to make corect call', function (done) {
        data.register(user)
            .then(() => {
                const actual = data.register
                    .firstCall
                    .args[1];

                expect(actual).to.equal('/api/register');
            })
            .then(done, done);
    });
    it('Expexct userRegister to post correct user data', function (done) {
        data.register(user)
            .then(() => {
                const actual = data.register
                    .firstCall
                    .args[0];

                const prop = Object.keys(actual).sort();
                expect(prop.length).to.equal(4);
                expect(prop[0]).to.equal('username');
                expect(prop[1]).to.equal('password');
            })
            .then(done, done);
    });
    it('Expexct registering of user to return the user', function (done) {
        data.register(user)
            .then(actual => {
                expect(actual).to.eql(user);

            })
            .then(done, done);
    });
});

describe('Login tests', function () {
    beforeEach(function () {
        sinon.stub(data, 'login')
            .returns(new Promise((resolve, reject) => {
                resolve({
                    result: {
                        username: user.username,
                        password: user.password
                    }
                });
            }));
        localStorage.clear();
    });
    afterEach(function () {
        data.login.restore();
        localStorage.clear();
    });

    it('expect userLogin to be called once', function (done) {
        data.login(user)
            .then(() => {
                expect(data.login.calledOnce).to.be.true;
            })
            .then(done, done);
    });
    it('expect userLogin to make correct call', function (done) {
        data.login(user)
            .then(() => {
                const actual = data.login
                    .firstCall
                    .args[0];
                expect(actual).to.equal('/api/login');
            })
            .then(done, done);
    });
    it('Expexct userLogin to put correct user data', function (done) {
        data.register(user)
            .then(() => {
                const actual = data.register
                    .firstCall
                    .args[1];

                const prop = Object.keys(actual).sort();
                expect(prop.length).to.equal(2);
                expect(prop[0]).to.equal('username');
                expect(prop[1]).to.equal('password');
            })
            .then(done, done);
    });
    it('Expect login to login the right user and set him in localStorage', function (done) {
        data.login(user)
            .then(() => {
                expect(localStorage.getItem('User')).to.equal(user.username);
            })
            .then(done, done);
    });
});

describe('Logout tests', function () {
    beforeEach(function () {
        sinon.stub(data, 'logout')
            .returns(new Promise((resolve, reject) => {
                resolve({
                    result: {
                        username: user.username,
                        password: user.password
                    }
                });
            }));
        localStorage.clear();
    });
    afterEach(function () {
        data.logout.restore();
        localStorage.clear();
    });

    it('expect localStorage to have no username after logout', function (done) {
        data.login()
            .then(() => {
                return data.logout();
            })
            .then(() => {
                expect(localStorage.getItem('User')).to.be.null;
            })
            .then(done, done);
    });
});

mocha.run();