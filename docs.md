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
  "user": {
    "id": 14,
    "nome": "Exemplo",
    "email": "exemplo@email.com"
  },
  "token": "tokenParaAutenticacao"
}
```

## POST `/contatos`
    Rota responsável por realizar o cadastro de um contato para o usuário logado.

Exemplo de requisição:
```json
{
  "nome": "Fulado",
  "email": "detal@email.com",
  "telefone": "(12) 3456-7890"
}
```
Obs.: Todos os campos são obrigatórios e não são permitidos e-mails ou telefones repetidos.

## GET `/contatos`
    Rota responsável por listar todos os contatos cadastrados do usuário logado.

Exemplo de resposta:
```json
{
  "list": [
    {
      "id": 17,
      "nome": "Fulado",
      "email": "detal@email.com",
      "telefone": "(12) 3456-7890",
      "id_usuario": 14
    }
  ]
}
```
Ou retorna um array vazio:
```json
{
  "list": []
}
```

## PUT `/contatos/:id`
    Rota responsável por realizar a alteração de um contato cadastrado pelo usuário logado.
    Obs.: É necessário fornecer o id do contato na url.

Será necessário, além do fornecimento do ID, também um body dos os dados que serão alterados.
Caso seja fornecido um ID desconhecido, ele retornará um erro.
Pode ser alterado somente um campo ou todos eles.
Exemplo de requisição:
```json
{
  "nome": "Nome Novo",
  "email": "novoEmail@email.com",
  "telefone": "(12) 1111-7890"
}
```
Caso deseje fazer a alteração apenas de um dos campos, basta passá-lo no corpo da requisição:
```json
{
  "nome": "Mudando Apenas Nome"
}
```

## DELETE `/contatos/:id`
    Rota responsável por deletar um contato cadastrado pelo usuário logado.
    Obs.: É necessário fornecer o id do contato na url.

Será necessário apenas o fornecimento do ID.
Caso seja fornecido um ID desconhecido, ele retornará um erro.
