# Rotas existentes:

## POST `/usuario`
    Rota responsável pelo cadastro de um novo usuário na aplicação.
Exemplo de requisição:
```json
{
    "nome":"Exemplo",
    "email":"exemplo@email.com",
    "senha":"senhaExemplo"
}
```
Obs.: Todos os campos são obrigatórios e não são permitidos e-mails repetidos.

## POST `/login`
    Rota responsável por realizar o login do usuário.

Exemplo de requisição:
```json
{
    "email":"exemplo@email.com",
    "senha":"senhaExemplo"
}
```
Ao fornecer os dados corretos será encaminhado um token para autenticação permitindo o uso das próximas rotas.
Exemplo de resposta:
```json
{
    "email":"exemplo@email.com",
    "senha":"senhaExemplo"
}
```
