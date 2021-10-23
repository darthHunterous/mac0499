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
- Modularização dos ListGroups em componentes que representam uma seção que recebe o título e um array com os itens a serem mostrados
- Controles do player e slider movidos para um componente separado também
- Modularização do formulário de busca junto com a função correspondente que lida com a busca
- Modularização do modal de busca junto à função de adicionar na biblioteca

# Sprint 06/10: Adição de bordas

- Adição de bordas entre as seções do design para facilitar visualização, antes a divisão não aparentava estar clara

# Sprint 06/10: Persistência dos dados da biblioteca

- Remoção do carregamento inicial da músicas presentes no data.json
- Agora como a biblioteca inicia vazia, mostra-se um alert warning indicando que a biblioteca está vazia e o usuário deve inserir novas músicas
- O counter do footer mostra quantos itens tem na biblioteca atualmente e a duração total das músicas ali presentes
- Para persistir os dados, por enquanto salvaremos no localstorage o estado da biblioteca (songData), toda vez que ele for alterado.
  - Tentei fazer isso dentro da função addToLibrary presente no componente do Modal, mas como setState é async, não bastava colocar dentro da função o setItem do localstorage. Para resolver isso poderia se utilizar um callback do setState, que existia antes do setState ser um hook. Agora, como setState é um hook e não se lida com o state do component como função mais, a forma correta é configurar um useEffect na tela principal mesmo, passando como variável a ser verificada o songData, assim toda vez que songData for alterado, useEfect irá disparar a função anônima que consiste no setItem do localstorage.
- Para carregar os dados salvos no localstorage, pode-se usar o mesmo que foi feito com o data.json inicialmente:
  - Criar uma função loadSongData que pega a informação em string do localstorage e parseia para JSON
  - Usar o useEffect com variável vazia ([]) pois assim irá ser executado assim que a aplicação React carregar
- Deletar data.json pois não é necessário mais como placeholder
- Ao tentar dar deploy no Netlify, notei um bug: como o songData não existe no localstorage inicialmente, ao tentar carregá-lo o site quebra pois songData é setado com o valor null. Um segundo reload passa a funcionar pois acaba sendo setado como vazio por possuir o null
  - Resolver isso verificando o que é pego no getItem do localstorage, setando como JSON caso existir algo lá, senão array vazio

## Sprint 06/10: contagem de reprodução de músicas

- Problema detectado: por segurança iframes não permitem o uso de listeners
- Isso impede que seja monitorado o número de reproduções por click no iframe do spotify
- Será necessário uma gambiarra do tipo presente aqui https://stackoverflow.com/questions/2381336/detect-click-into-iframe-using-javascript/32138108#32138108
- Exemplo que funciona para detectar o foco em um iframe, removendo o foco logo em seguida com blur() para ser possível monitorar um eventual novo clique
  ```
  var monitor = setInterval(function(){
    var elem = document.activeElement;
    if(elem && elem.tagName == 'IFRAME'){
        document.activeElement.blur();
        console.log('hey');
    }
  }, 100);
  ```

## Sprint 06/10: adição à playlists

- Por padrão o Spotunes carrega 5 playlists inteligentes já pré-concebidas (Most played, recently added, recently modified, never played e best rated), para servirem de exemplos
- Adição de um botão em cada linha da tabela para adicionar uma música à playlist
- https://stackoverflow.com/questions/55968689/how-can-i-use-checkbox-form-in-react
  - Link que mostra como podemos submeter uma checkbox de forma bem estrutura em React
- Ao dar submit no form dos checkboxes, temos que percorrer todo os pares chave-valor do array de estados para saber quais playlists foram marcadas. Ao encontrar uma que foi marcada, precisamos percorrer o array de playlists, adicionando na lista de músicas correspondente
  - Uma solução simples, porém um pouco ineficiente, melhor adiconar um array e só passar o id das playlists modificadas. Também outra implementação melhor é usar o id como chave de um objeto que guarde as playlists, reduzindo o tempo de busca. Portanto fica como TODO
- Por enquanto as músicas são identificadas pelo ID do spotify, mas o ideal seria ter um uuid mesmo pois poderemos ter músicas de outras fontes

## Sprint 06/10: ajustes das rotas de Playlist

- Para cada playlist clicada, queremos mostrar apenas o resultado filtrado
- Usar routes do React para isso, passando os dados filtrados
  - Rotas podem ser do tipo /playlist/:id
- Passar um array com as rotas referentes para o ListGroupSection component  

## Sprint 06/10: Correção do nodemon no back-end
- O nodemon não estava adicionado corretamente como dependência de desenvolvimento (npm install nodemon --save-dev). Isso é importante para garantir que o ambiente execute corretamente com o mínimo de setup possível. Anteriormente, como ele estava instalado globalmente na minha máquina, clonar o repositório e instalar dependências com npm install não tornaria o servidor facil de por em operação

## Sprint 18/10: tornar rotas funcionais, filtrando conteúdo
- Usar react-router-dom
- Usar o hook do react-router-dom useLocation().pathname para identificar em que rotas estamos, assim dá para definir o elemento ativo nos ListGroups nas laterais
- Um problema encontrado foi que ao clicar em algum ListGroupItem, a página está sendo recarregada (como React usa SPA isso é uma prática ruim pois recarrega conteúdo que não deveria). Aparentemente, substituir os hrefs de cada ListGroupItem, colocando ao redor de uma tag Link conserta isso
- Colocar o Link ao redor do ListGroupItem quebra a funcionalidade do componente e a estilização, tentar consertar isso com a biblioteca react-router-boostrap, adicionada através do Yarn
- Usar o LinkContainer do react-router-bootstrap ao invés do Link do react-router resolve o problema do reload, com a página se comportando corretamente como SPA, porém o campo selecionado do ListGroup se torna extremamente bugado, vou testar se dá para deixar com reload mesmo
- Não é possível deixar com o comportamento de reload, pois isso resetaria o playback da música no iframe. Consertei o problema na base da gambiarra: alterando o CSS com javascript ao efetuar um clique em um elemento dos list groups, resetando o css dos ativos para o padrão e ativado o clicado. Agora a funcionalidade está a contento
- Remover dependências não utilizadas do componente ListGroupSection, pois não é uma boa prática deixá-las, gerando warnings
- Faltou adicionar o hover nos elementos dos ListsGroups. Quando o usuário estiver para clicar em outra seção, convém escurecer o pouco onde o mouse está atualmente para dar um feedback visual que o usuário está escolhendo a rota correta. Como em React não tem onHover, emulado com onMouseEnter e onMouseLeave
- Adição do filtro, passando para o componente SongTable apenas as músicas adequadas para exibição naquela rota. Para isso, filtra quando nota uma alteração na variável current_path através do useEffect. current_path é obtido pelo useLocation do react-router-dom
- Alteração do footer para usar o conteúdo filtrado, mostrando quantidade de músicas e duração apenas das músicas apresentadas na rota atual

## Sprint 18/10: decisão de separar deploy do front e do back
- O front está no Netlify e o back no Heroku, como o Netlify lida melhor com páginas estáticas, estando sempre à disposição, é melhor deixar separados pois o back só será ativado esporadicamente ao efetuar uma busca. O Heroku tem um tempo para acordar o dyno

## Sprint 18/10: adição do Nodemon como dev dependency
- Nodemon instalado no spotunes-server como dependência de desenvolvimento, tornando-o pronto para ser utilizado assim que o repositório seja clonado

## Spring 18/10: pequenas refatorações
- Remoção da funcionalidade "Recently added" como playlist, deixando apenas como função da Library mesmo, pois estava duplicado
- Remoção da funcionalidade da Library "Videos", serão adicionados mais tarde se houver tempo

## Sprint 18/10: rota de Albums
- Ao clicar em Albums, o usuário tem listado todos os álbuns em sua coleção, com imagem de capa, nome do artista e nome do álbum
- Código na Home para filtrar álbuns (sem repetições), enviando as informações necessárias para o componente AlbumsList (id do álbum, link para a imagem de capa, nome do álbum e nome do artista)

## Sprint 18/10: rota de um álbum específico
- Envolver o botão em /albums com o LinkContainer para evitar refresh do SPA
- Ao clicar no botão, carrega a Song Table com apenas as músicas do álbum atual filtradas e ordenadas por ordem alfabética

## Sprint 18/10: conserto do bug da /all na primeira carregada
- Antes estava sendo passado o filteredSongData para a SongTable, porém ao abrir o app, não há nada filtrado ainda. Solução com um ternário que checa se a rota atual é a /all, mostrando todas as músicas em caso positivo (songData ao invés de filteredSongData)

## Sprint 18/10: conserto do bug de mostrar álbums duplicados na lista de álbums
- Erro se dava pela alteração para um array de objetos, foi consertado com o método some para checar se já há algum objeto no array de albuns únicos que já possui o ID em questão, adicionando apenas em caso negativo

## Sprint 18/10: componente Artist List
- Lista todos os artistas presentes na biblioteca em ordem alfabética, podendo filtrar todas suas músicas com um clique

## Sprint 18/10: filtro específico de artista
- Rota /artist/:id
- Consertado typo no botão da lista de artistas, que redirecionava para albums/:id

## Sprint 18/10: listar todos os gêneros
- Na API do spotify, só é possível obter gêneros musicais a partir do artista e não de músicas específicas em si
- Portanto foi necessário alterar o back-end para fornecer a capacidade de pesquisar por artista também, retornando os gêneros, ID e URL da imagem para cada artista
- Ao clicar em adicionar na playlist após a busca de uma música, irá fazer uma nova requisição pelos dados do artista, adicionando no songData os novos dados buscados
- Lista implementada com base nos designs análogos de ArtistsList e AlbumsList
- Para melhorar a visualização dos gêneros foi implementado um método para capitalizar (primeira letra de cada palavra sendo maiúscula) a string que representa o gênero. Javascript não fornece algo do tipo como padrão, ao contrário de outras linguagens.
- Como os gêneros não precisam de uma ID para identificação (basta seu próprio nome como string), eles podem ser usados diretamente nas rotas, apenas substituindo whitespace por um traço para facilitar a leitura da URL e evitar caracteres especiais

## Sprint 27/10: adicionar imagem do artista na lista
- Com a adição do fetch na API do Spotify por informações do artista, foi possível adicionar também uma thumbnail para cada artista, melhorando o visual da lista de artista. Seria interessante fazer algo do tipo para gênero, cogitei uma api que gerasse Word Art mas não encontrei, pode ser possível com a biblioteca
react-wordart do npm
https://www.npmjs.com/package/react-wordart

## Sprint 27/10: arrumar informações do footer
- O footer agora mostrar a quantidade de músicas na seleção de músicas atuais (bem como a duração delas) ou no caso de uma lista de artistas, álbums ou gêneros, mostra a quantidade listada
- Consertado também uma comparação errada nos ternários de renderização da informação no footer, estava sendo utilizado apenas != ao invés de !==

## Sprint 27/10: músicas recentemente adicionadas
- Para poder listar as músicas recentemente adicionadas (atribuídas como aquelas adicionadas nas últimas 24 horas), foi preciso adicionar um campo de "createdAt" ao adicioná-las na biblioteca. Pensando em funcionalidades futuras, faz sentido um campo "modifiedAt" também, ambos configurados para o mesmo horário na adição
- Ao usar new Date(), quando salvamos em JSON no localStorage, a data acaba sendo armazenada como string, isto traz um bug ao recarregar o Spotunes, pois com a formatação como string torna-se impossível comparar diretamente com uma subtração para ver se foi adicionada há menos de 24 horas
- Uma boa solução para o problema acima foi salvar a data com o valueOf(), que retorna o tempo passado da data atual desde 01/01/1970 em milissegundos. Assim fica fácil calcular se a música foi adiciona em menos de 24h, sendo salvo no localStorage e recuperado sem grandes alterações

## Sprint 27/10: contagem de reproduções
- Para ser capaz de fornecer uma playlist inteligente que liste as músicas mais tocadas da biblioteca é necessário salvar a contagem de reproduções para cada música.
- Como não há maneira de interagir com o iframe do Spotify oficialmente, um workaround empregado foi se o elemento HTML em foco na página (clicado pelo usuário) é um iframe. Em caso positivo, sabemos que o usuário clicou no iframe para iniciar sua reprodução. Assim aumentamos o playCount da música em questão. Porém, não queremos que tal comportamento ocorra a cada clique (senão cliques subsequentes na mesma música para pausar e resumir contariam como reproduções separadas). Para resolver isso, uma boa forma é usar uma variável booleana de controle que seja iniciada como falsa ao carregar um novo iframe de uma nova música. Ao ser clicado pela primeira vez, essa variável se torna verdadeira e server como sentinela para evitar aumentar novamente a contagem de reproduções.

TODO: consertar bug de ser capaz de adicionar músicas repetidas
TODO: fechar modal depois de adicionar uma música
TODO: adicionar uuid a playlists e músicas

TODO: finalizar tudo que já tem na interface (criar playlists, playlists inteligentes, informações da barra lateral direita)
TODO: fazer um readme de como fazer deploy no heroku

TODO: adicionar /videos ao ListGroup Library novamente
TODO: consertar reload, que sempre acaba marcando all songs junto com o path atual

TODO: adicionar número da música no álbum para ordenar (track_number na API do Spotify)
TODO: limitação da biblioteca node-spotify-api: não é possível especificar um mercado para os álbums, assim podem haver repetidos, como o Enema of The State do Blink-182 usado nos testes

TODO: reorganizar os dados enviados pelo back-end por uma estrutura lógica
TODO: thumbnail dos gêneros com uma API de imagem 640x640 coloridas com wordart do react-wordart