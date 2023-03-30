import knex from '../services/connection'
import request from 'supertest';
import app from '../app';

describe('Should test the endpoints', () => {

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
        senha: '123456789'
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
        })

    })

    describe('Test of register a contact endpoint', () => {

        it('Should return a error of missing fields', async () => {
            const missingFields = await request(app)
                .post('/contatos')
                .send({ nome: contactData.nome })

            expect(missingFields.body.message).toBe('Os campos de nome, e-mail e telefone são obrigatórios!')
        })

        it('Should return the status 201 of the new contact registered', async () => {
            const newContact = await request(app)
                .post('/contatos')
                .send({ ...contactData })

            expect(newContact.body.status).toBe(201)
        })

    })

    afterAll(async () => {

        await knex.raw(`
            drop table if exists contatos;
            drop table if exists usuarios;
        `)

    });
})