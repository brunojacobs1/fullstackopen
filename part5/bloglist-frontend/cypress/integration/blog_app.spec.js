/* eslint-disable no-undef */

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'tester',
      username: 'tester123',
      password: 'testerPassword',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);

    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('tester123');
      cy.get('#password').type('testerPassword');
      cy.get('#login-button').click();

      cy.contains('tester logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('tester123');
      cy.get('#password').type('tester');
      cy.get('#login-button').click();

      cy.contains('Wrong username or password');
    });
  });

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('tester123');
      cy.get('#password').type('testerPassword');
      cy.get('#login-button').click();
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'tester123',
        password: 'testerPassword',
      }).then((res) => {
        console.log(res);
        const newBlog = {
          title: 'test',
          author: 'cypress',
          url: 'some.com',
        };
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          headers: {
            authorization: `bearer ${res.body.token}`,
          },
          body: newBlog,
        });
      });
    });

    it('A blog can be created', function () {
      cy.get('#togglable-button').click();
      cy.get('#title').type('cypress blog');
      cy.get('#author').type('cypress');
      cy.get('#url').type('cypress.me');
      cy.get('#create-button').click();

      cy.contains('cypress blog cypress');
    });

    it('A blog can be liked', function () {
      cy.reload();
      cy.get('#view-button').click();
      cy.contains('likes 0');
      cy.get('#like-button').click();
      cy.contains('likes 1');
    });

    it('User that created the blog can delete it', function () {
      cy.reload();
      cy.get('#view-button').click();
      cy.get('#remove-button').click();
      cy.contains('removed');
    });
  });
});
