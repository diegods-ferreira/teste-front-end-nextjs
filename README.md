# Teste iCasei: Front-End

Uma pequena aplicação, feita em React, que utiliza um termo de busca para consultar a API do Youtube e exibir em tela uma lista de vídeos com algumas informações.

## Como executar o projeto?

Siga os passos abaixo para executar o projeto em ambiente de desenvolvimento.

#### Passo 1

Clone esse repositório e faça o download das dependências do projeto executando o comando `npm install`, caso esteja usando o gerenciador de pacotes NPM, ou `yarn`, caso esteja utilizando o Yarn.

#### Passo 2

Depois de baixadas as dependências, crie o arquivo `.env.local` na raiz do projeto para que seja possível configurar as variáveis de ambiente. Ele deve seguir o modelo do arquivo `.env.example`.

Nele, deve conter as variáveis:

- `YOUTUBE_API_KEY={API_KEY}`
- `JWT_SECRET={SECRET}`

Você pode gerar a sua chave da [API](https://developers.google.com/youtube/v3/docs/search/list) neste [link](https://developers.google.com/youtube/v3/getting-started?hl=pt-br).

###### * O *secret* pode ser uma `string` qualquer, mas ele é necessário para autenticação.

#### Passo 3

Concluídos os passos anteriores, basta executar o comando `npm run dev` ou `yarn dev`.

Assim que a aplicação terminar de carregar, basta abrir seu *browser* e acessar o endereço `http://localhost:3000`.