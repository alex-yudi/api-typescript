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
('Cadastro BD', 'cadastro-bd@email.com', '12456789');
