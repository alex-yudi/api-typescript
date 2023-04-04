import knex from '../services/connection'
import request from 'supertest';
import app from '../app';

describe('Test of all endpoints', () => {

    beforeAll(async () => { // Criando acesso para BD de testes
        await knex.raw(`
            drop table if exists contatos;
            drop table if exists usuarios;

            create table usuarios (
            id serial primary key,
            nome varchar not null,
            email varchar not null unique,
            senha varchar not null
           );
          create table contatos (
            id serial primary key,
            nome varchar not null,
            email varchar not null unique, 
            telefone varchar not null unique,
              id_usuario int references usuarios(id)
          );

          insert into usuarios 
          (nome, email, senha)
          values
          ('Alex', 'teste@email.com', '12456789');
        `)
    })

    const userData = {
        nome: "Teste",
        email: "teste@teste.com",
        senha: '123456789',
        token: ''
    }

    const contactData = {
        nome: 'Contato teste',
        email: 'contato@teste.com',
        telefone: '(84)12345-6789'
    }

    describe('Test of the sign-up user endpoint', () => {

        it('Should show message that missing the fields of e-mail and password', async () => {
            const signUpOnlyName = await request(app)
                .post('/usuario')
                .send({ nome: 'Teste somente nome' });
            expect(signUpOnlyName.body).toBe('Os campos e-mail e senha são obrigatórios!')
        })

        it('Should show message that missing the fields of name and password', async () => {
            const signUpOnlyEmail = await request(app)
                .post('/usuario')
                .send({ email: 'teste-somente-email@teste.com' });
            expect(signUpOnlyEmail.body).toBe('Os campos nome e senha são obrigatórios!')
        })


        it('Should show message that missing the fields of name and password', async () => {
            const signUpOnlyPassword = await request(app)
                .post('/usuario')
                .send({ senha: 'testeSomenteSenha' });
            expect(signUpOnlyPassword.body).toBe('Os campos nome e e-mail são obrigatórios!')
        })


        it('Should show message that missing the field of name', async () => {
            const signUpWithoutName = await request(app)
                .post('/usuario')
                .send({ email: 'teste-sem-nome@teste.com', senha: '123456789' });
            expect(signUpWithoutName.body).toBe('O campo nome é obrigatório!')
        })

        it('Should show message that missing the field of e-mail', async () => {
            const signUpWithoutEmail = await request(app)
                .post('/usuario')
                .send({ nome: 'teste sem email', senha: '123456789' });
            expect(signUpWithoutEmail.body).toBe('O campo e-mail é obrigatório!')
        })

        it('Should show message that missing the field of password', async () => {
            const signUpWithoutPassword = await request(app)
                .post('/usuario')
                .send({ nome: 'Teste sem senha', email: 'teste-sem-senha@teste.com' });
            expect(signUpWithoutPassword.body).toBe('O campo senha é obrigatório!')
        })

        it('Should show message that missing all the fields', async () => {
            const signUpWithoutProps = await request(app)
                .post('/usuario')
                .send({})
            expect(signUpWithoutProps.body).toBe('Todos os campos são obrigatórios!')
        })

        it('Should return a message with de id, name and email of the user created', async () => {
            const signUpCorrect = await request(app)
                .post('/usuario')
                .send({ nome: userData.nome, email: userData.email, senha: userData.senha });
            expect(signUpCorrect.body).toHaveProperty('id');
            expect(signUpCorrect.body).toHaveProperty('nome');
            expect(signUpCorrect.body).toHaveProperty('email');
        })


        it('Should return a message that user already registered', async () => {
            const signUpDuplicated = await request(app)
                .post('/usuario')
                .send({ nome: userData.nome, email: userData.email, senha: userData.senha });
            expect(signUpDuplicated.body.message).toBe('Usuário já cadastrado no sistema!');
        })


    })


    describe('Test of login endpoint', () => {

        it('Should return a error message of missing fields', async () => {
            const onlyEmail = await request(app)
                .post('/login')
                .send({ email: userData.email });

            expect(onlyEmail.body.message).toBe('Os campos e-mail e senha são obrigatórios!');
        })

        it('Should return a error message of email incorrect', async () => {
            const emailIncorrect = await request(app)
                .post('/login')
                .send({ email: 'incorreto@email.com', senha: userData.senha });

            expect(emailIncorrect.body.message).toBe('E-mail ou senha incorreto!');
        })

        it('Should return a error message of password incorrect', async () => {
            const passwordIncorrect = await request(app)
                .post('/login')
                .send({ email: userData.email, senha: '123456' });

            expect(passwordIncorrect.body.message).toBe('E-mail ou senha incorreto!');
        })

        it('Should return the id and token of the user logged', async () => {
            const loginCorrect = await request(app)
                .post('/login')
                .send({ email: userData.email, senha: userData.senha });

            expect(loginCorrect.body).toHaveProperty('user');
            expect(loginCorrect.body).toHaveProperty('token');
            userData.token = loginCorrect.body.token
        })

    })

    describe('Test of authentication token middleware', () => {

        it('Should return a error of invalid token', async () => {
            jest.setTimeout(10000)
            const invalidToken = await request(app)
                .post('/contatos')
                .set("Authorization", "Bearer tokenInvalido")

            expect(invalidToken.status).toBe(500)
        })

        it('Should return a error of missing token', async () => {
            const missingToken = await request(app)
                .post('/contatos')

            expect(missingToken.body.message).toBe('Token inválido!')
        })



    })

    describe('Test of register a contact endpoint', () => {

        it('Should return a error of missing fields', async () => {
            const missingFields = await request(app)
                .post('/contatos')
                .auth(userData.token, { type: 'bearer' })


            expect(missingFields.body.message).toBe('Os campos de nome, e-mail e telefone são obrigatórios!')
        })


        it('Should return the status 201 of the new contact registered', async () => {
            const newContact = await request(app)
                .post('/contatos')
                .auth(userData.token, { type: 'bearer' })
                .send({ ...contactData })

            expect(newContact.status).toBe(201)
        })

        it('Should return error of trying register duplicated email', async () => {
            const contactWithDuplicatedEmail = await request(app)
                .post('/contatos')
                .auth(userData.token, { type: 'bearer' })
                .send({ ...contactData })

            expect(contactWithDuplicatedEmail.body.message).toBe('Não é permitido o cadastro de e-mails repetidos!')
        })


        it('Should return error of trying register duplicated telephone', async () => {
            const contactWithDuplicatedTelephone = await request(app)
                .post('/contatos')
                .auth(userData.token, { type: 'bearer' })
                .send({ ...contactData, email: 'outroemail@email.com' })

            expect(contactWithDuplicatedTelephone.body.message).toBe('Não é permitido o cadastro de telefones repetidos!')
        })


    })

    describe('Test of get the list of contacts', () => {
        it('Should return error of dont sent the authentication token', async () => {
            const missingToken = await request(app)
                .get('/contatos')

            expect(missingToken.body.message).toBe('Token inválido!')
        })

        it('Should return error of invalid authentication token', async () => {
            const invalidToken = await request(app)
                .get('/contatos')
                .auth('invalidToken', { type: 'bearer' })

            expect(invalidToken.status).toBe(500);
        })

        it('Should return a array with all the contacts registered with the userLoggedId', async () => {
            const arrayListOfContacts = await request(app)
                .get('/contatos')
                .auth(userData.token, { type: 'bearer' })

            expect(arrayListOfContacts.body.list.length).toBeGreaterThanOrEqual(0)
        })
    })

    describe('Test of update a contact registered', () => {
        it('Should return a error of contact not found', async () => {
            const idInvalidContact = 2;
            const contactNotFound = await request(app)
                .put(`/contatos/${idInvalidContact}`)
                .auth(userData.token, { type: 'bearer' })
                .send({ ...contactData, email: 'outroEmail@email.com' })

            expect(contactNotFound.body.message).toBe('Contato não localizado!')
        })

        it('Should return a error of missing fields to modificate', async () => {
            const idContactValid = 1;
            const missingFields = await request(app)
                .put(`/contatos/${idContactValid}`)
                .auth(userData.token, { type: 'bearer' })

            expect(missingFields.body.message).toBe('É necessário informar algum campo para a alteração!')
        })

        it('Should return a error of invalid fields to modificate', async () => {
            const idContactValid = 1;
            const invalidBody = { id: 3 }
            const missingFields = await request(app)
                .put(`/contatos/${idContactValid}`)
                .auth(userData.token, { type: 'bearer' })
                .send(invalidBody)
            expect(missingFields.body.message).toBe('Um ou todos os campos informados são inválidos!')
        })

        it('Should return a message with the name of contact modified', async () => {
            const idContactValid = 1;
            const newContactName = await request(app)
                .put(`/contatos/${idContactValid}`)
                .auth(userData.token, { type: 'bearer' })
                .send({ nome: 'NovoNome' })

            expect(newContactName.body.nome).toBe('NovoNome')
        })
    })

    describe('Test of delete a contact registered', () => {
        it('Should return a error of contact not found', async () => {
            const idInvalidContact = 2;
            const contactNotFound = await request(app)
                .delete(`/contatos/${idInvalidContact}`)
                .auth(userData.token, { type: 'bearer' })

            expect(contactNotFound.body.message).toBe('Contato não localizado!')
        })

        it('Should return a confirmation of the contact deleted', async () => {
            const idContactValid = 1
            const deletedContact = await request(app)
                .delete(`/contatos/${idContactValid}`)
                .auth(userData.token, { type: 'bearer' })
            expect(deletedContact.body.message).toBe('Contato deletado!')
        })

    })



    afterAll(async () => {

        await knex.raw(`
            drop table if exists contatos;
            drop table if exists usuarios;
        `)

    });
})