# Cronograma

- Definir um cronograma mês a mês para a proposta final, que deve ser entregue até **26/05**
- Também definir um cronograma de trabalho, talvez com iterações de duas semanas

## Reunião para 23/06

- Testes da API com resultados no diretório `api_tests` e `relatorio-APIs.md`

## Reunião para 07/07

- Testar Musicmatch Jukebox e olhar sua interface
  - Não rodou no Windows 10, falha ao extrair um arquivo na instalação
- Teste do Winamp
  - No geral, as funcionalidades são bastante parecidas com iTunes, com edição de metadados, criação de playlists, classificações de músicas e histórico de reproduções
  - Porém iTunes possui uma interface menos poluída, permitindo playlists inteligentes, mais opções de metadados
  - Uma vantagem significativa do Winamp são as barras laterais, que facilitam a navegação pela biblioteca (sidebar à esquerda) e visualização do álbum/playlist atual na sidebar à direita
- Esboço de algumas telas no Figma
  - https://www.figma.com/file/v0aTcp8ozSLX53JhDiIo6Z/Spotunes-Wireframe

## Sprint para 22/09: Enfoque nas funcionalidades de busca e adição na biblioteca

- A tentativa de manter o Spotunes minimamente dependente de um back-end (ao menos inicialmente) não funcionou por conta da autenticação do Spotify
- Mesmo que a biblioteca npm node-spotify-api abstraia vários processos do fluxo de autenticação, ainda assim é necessário um servidor Node para lidar com os tokens
  - O uso dessa biblioteca simplificou muito o processo de autenticação com o Spotify
- Erro de CORS
- Gastei tempo tentando criar várias Rows no modal que mostra o resultado da pesquisa, onde cada row teria 2 elementos mostrados, porém bastava criar apenas uma Row geral, e ir colocando vários elementos com "col-md-6" dentro. Tentei até mesmo reformatar o array com 10 itens em grupos de 2 elementos por array
- Reestruturação dos objetos recebidos pelo front (mais atributos mostrados na busca)
- Adição de novas músicas à biblioteca clicando no botão
- https://medium.com/reprogramabr/consumindo-a-api-do-spotify-um-breve-passo-a-passo-fd210312fdd

## Sprint para 06/10: Deploy do back-end para o Heroku, integrar front em production (Netlify) com back-end

- Preparação das portas com process.env.PORT
- Várias dificuldades para integrar o back-end em produção por conta das especificadas de variáveis de ambiente
- cross-env só funciona em modo dev
- Dificuldades para setar o ambiente de dev com create-react-app
  - É necessário a lib env-cmd e um .env.development
- Após setar os ambientes de dev e production tanto no front quanto no dev ainda enfrentando erros de CORS, pode ser algo especificado errado no header de allow lá no back end
- O problema de CORS era um trailing '/' no final de https://spotunes.netlify.app/ (vem automaticamente ao copiar da URL do navegador)

## Sprint para 06/10: cuidado com scripts do package.json

- O comando errôneo `npm start development` acabava por executar o script de production, deixando a NODE_ENV undefined quando o esperado era development. O script correto que resolve isso é `npm run development`

## Sprint para 06/10: modularização de código

- Alteração do curso ao fazer hover sobre a tabela para indicar que é clicável
- Transformação da tabela de música em um componente
- Transformação do iframe em um componente, permitindo também renderizar um placeholder ao inicializar a aplicação
  - Troca do tema para escuro tornou a identidadade visual mais coesa
- Configuração do favicon e do título do site
- Troca da paleta de cores para variante dark
- Alteração de padding no título dos list groups em preparação para sua componentização
- Ao alterar a cor do botão de Search, foi notado que tentar buscar com campo de busca vazio batia no servidor do back-end, quebrando-o. Necessidade de consertar esse bug na duas frentes (no front-end, não fazer request com campo vazio e no back-end lançar um erro ao invés de quebrar o servidor inteiro)
- Tive problema de merge para a main do front-end pois fiz alterações na master que eram necessárias à branch de development também para subir este ambiente corretamente
- Alterei o back-end que ao receber o title faltante na rota de search no Spotify, retorna uma resposta com status 422 (Unprocessable Entity), informando do parâmetro faltante
