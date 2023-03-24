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

    it('Should sign-up a new user', async () => {
        const signUpCorrect = await request(app)
            .post('/usuario')
            .send({ nome: 'Teste', email: 'teste@teste.com', senha: '123456789' });
        expect(signUpCorrect.body).toHaveProperty('id');
        expect(signUpCorrect.body).toHaveProperty('nome');
        expect(signUpCorrect.body).toHaveProperty('email');

        const signUpOnlyName = await request(app)
            .post('/usuario')
            .send({ nome: 'Teste somente nome' });
        expect(signUpOnlyName.body).toBe('Os campos e-mail e senha são obrigatórios!')

        const signUpOnlyEmail = await request(app)
            .post('/usuario')
            .send({ email: 'teste-somente-email@teste.com' });
        expect(signUpOnlyEmail.body).toBe('Os campos nome e senha são obrigatórios!')

        const signUpOnlyPassword = await request(app)
            .post('/usuario')
            .send({ senha: 'testeSomenteSenha' });
        expect(signUpOnlyPassword.body).toBe('Os campos nome e e-mail são obrigatórios!')

        const signUpWithoutName = await request(app)
            .post('/usuario')
            .send({ email: 'teste-sem-nome@teste.com', senha: '123456789' });
        expect(signUpWithoutName.body).toBe('O campo nome é obrigatório!')

        const signUpWithoutEmail = await request(app)
            .post('/usuario')
            .send({ nome: 'teste sem email', senha: '123456789' });
        expect(signUpWithoutEmail.body).toBe('O campo e-mail é obrigatório!')

        const signUpWithoutPassword = await request(app)
            .post('/usuario')
            .send({ nome: 'Teste sem senha', email: 'teste-sem-senha@teste.com' });
        expect(signUpWithoutPassword.body).toBe('O campo senha é obrigatório!')

        const signUpWithoutProps = await request(app)
            .post('/usuario')
            .send({})
        expect(signUpWithoutProps.body).toBe('Todos os campos são obrigatórios!')
    })


    afterAll(async () => {

        await knex.raw(`
            drop table if exists contatos;
            drop table if exists usuarios;
        `)

    });
})