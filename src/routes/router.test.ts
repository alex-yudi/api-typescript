import knex from '../services/connection'
import request from 'supertest';
import app from '../app';

describe('Teste de endpoint', () => {

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

    it('teste', async () => {
        const response = await request(app).get('/');

        expect(response.body).toBeTruthy();
    })


    afterAll(async () => {

        await knex.raw(`
            drop table if exists contatos;
            drop table if exists usuarios;
        `)

    });
})