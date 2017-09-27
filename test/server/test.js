import chai from 'chai';
import chaiHttp from 'chai-http';

let should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
const SERVER = 'http://localhost:3000/';

let jwt, refresh_token;

let loginCred = {
    email: 'jack-lantern@abc.com',
    password: 'the-Secret-123'
};

let user = {
    email: 'jack-lantern@abc.com',
    name: 'Jack Lantern',
    password: 'the-Secret-123',
    avatar_url: 'abc.jpg'
};

let car = {
    make: 'Tesla',
    model: 'Model S',
    year: 2017
};

describe('Server', function () {

    it('Ping Server.', (done) => {
        chai.request(SERVER)
            .get('ping')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    });
});

describe('New User Signup', function () {

    before((done) => {
        chai.request(SERVER)
            .post('resetdb')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    after((done) => {
        chai.request(SERVER)
            .post('resetdb')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('Signup new User, with all correct info.', (done) => {
        chai.request(SERVER)
            .post('users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('jwt');
                res.body.should.have.property('refresh_token');
                done();
            })
    });

    it('Signup same User: Duplicate use case.', (done) => {
        chai.request(SERVER)
            .post('users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

    it('Signup new User with no name.', (done) => {
        chai.request(SERVER)
            .post('users')
            .send({ ...user, name: '' })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

    it('Signup new User with incorrect email id format.', (done) => {
        chai.request(SERVER)
            .post('users')
            .send({ ...user, email: 'jack-lanternabc.com' })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

    it('Signup new User with failing password.', (done) => {
        chai.request(SERVER)
            .post('users')
            .send({ ...user, password: 'the-secret-123' })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });
});

describe('User Login/Logout', function () {

    before((done) => {
        chai.request(SERVER)
            .post('resetdb')
            .end((err, res) => {
                res.should.have.status(200);

                chai.request(SERVER)
                    .post('users')
                    .send(user)
                    .end((err, res) => {
                        done();
                    })
            })
    });

    after((done) => {
        chai.request(SERVER)
            .post('resetdb')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('User Login.', (done) => {
        chai.request(SERVER)
            .post('users/login')
            .send(loginCred)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('jwt');
                res.body.should.have.property('refresh_token');
                jwt = res.body.jwt;
                refresh_token = res.body.refresh_token;
                done();
            })
    });

    it('User Login - Invalid email.', (done) => {
        chai.request(SERVER)
            .post('users/login')
            .send({ ...loginCred, email: 'abcd@abc.com' })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

    it('User Login - Invalid password.', (done) => {
        chai.request(SERVER)
            .post('users/login')
            .send({ ...loginCred, password: 'abcd123' })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

    it('Refresh Token.', (done) => {
        chai.request(SERVER)
            .post('users/refresh')
            .send({ refresh_token })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('jwt');
                done();
            })
    });

    it('Refresh Token - Passing invalid token.', (done) => {
        chai.request(SERVER)
            .post('users/refresh')
            .send({ refresh_token: 'abcd' })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    });

    it('Current User.', (done) => {
        chai.request(SERVER)
            .get('users/me')
            .set('x-access-token', jwt)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('email');
                res.body.should.have.property('name');
                done();
            })
    });

    it('User Logout.', (done) => {
        chai.request(SERVER)
            .post('users/logout')
            .set('x-access-token', jwt)
            .send({ refresh_token })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

});

describe('Cars', function () {

    before((done) => {
        chai.request(SERVER)
            .post('resetdb')
            .end((err, res) => {
                res.should.have.status(200);

                chai.request(SERVER)
                    .post('users')
                    .send(user)
                    .end((err, res) => {
                        jwt = res.body.jwt;
                        refresh_token = res.body.refresh_token;
                        done();
                    })
            })
    });

    after((done) => {
        chai.request(SERVER)
            .post('resetdb')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('Add Car without logging in.', (done) => {
        chai.request(SERVER)
            .post('cars')
            .send(car)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    });

    it('Add Car.', (done) => {
        chai.request(SERVER)
            .post('cars')
            .set('x-access-token', jwt)
            .send(car)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('make');
                res.body.should.have.property('model');
                res.body.should.have.property('year');
                res.body.should.have.property('created');
                car.id = res.body.id;
                done();
            })
    });

    it('Update Car.', (done) => {
        chai.request(SERVER)
            .put('cars/' + car.id)
            .set('x-access-token', jwt)
            .send({ ...car, model: 'Model Y' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('make');
                res.body.should.have.property('model');
                res.body.model.should.equal('Model Y')
                res.body.should.have.property('year');
                res.body.should.have.property('created');
                done();
            })
    });

    it('Get Cars.', (done) => {
        chai.request(SERVER)
            .get('cars')
            .set('x-access-token', jwt)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                expect(res.body).to.have.lengthOf(1);
                done();
            })
    });

    it('Delete Car.', (done) => {
        chai.request(SERVER)
            .delete('cars/' + car.id)
            .set('x-access-token', jwt)
            .send({ ...car, model: 'Model Y' })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });
    
});