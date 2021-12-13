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

## Sprint 27/10 - playlist inteligente "Mais tocadas"

- Filtrar apenas as músicas que possuem ao menos uma reprodução e listar em ordem decrescente (primeiro as mais reproduzidas), convém ordenar por ordem alfabética também antes, pois como o sort do JS mantém a ordem relativa, teremos as músicas ordenadas primeiro por número de reproduções e em caso de empate, por ordem alfabética
- Convém alterar a song table para mostrar o número de reproduções para ficar mais claro
- De início, a playlist limita a 25 itens (25 mais tocadas)

## Sprint 27/10 - remoção de erros e warnings

- Um erro era por não encontrar um logo especificado no manifest.json. Isso era algo que ficou do template do create-react-app que foi esquecido ali. A remoção das linhas dos logos no manifest.json sumiu com o erro.
- 3 erros referentes à key faltante na lista do SongTable, ListGroupSection e AddToPlaylistModal. Adicionar uma key (identificador único) ao elemento raiz imediatamente após cada map() resolveu.
- Erro acima também ocorreu em ArtistsList, AlbumsList, GenresList e foi resolvido da mesma forma
- Warning no arquivo do SpotifyIframe, reclama da função repeatedAction() estar fora do useEffect, porém movendo a função para dentro, mais dependências são pedidas para o array do useEffect. O warning sugere resolver com useCallback(), mas como não está 100% claro tal usabilidade, deixarei de fora por agora. O mesmo é válido para o warning em index.js
- Warning consertado em que havia uma comparação com == ao invés de === no SpotifyIframe

## Sprint 27/10: playlist inteligente "Recentemente modificados"

- Dados já estão preparados pois um atributo de data de modificação já foi incluído junto com o data de criação em refatorações passadas
- Por padrão serem filtrados as músicas modificadas nas últimas 24 horas

## Sprint 27/10: playlist inteligente "Nunca tocadas"

- Filtrar as músicas com zero reproduções, deve ser fácil e análogo à implementação de outras playlists pois o arcabouço necessário já está implementado

## Sprint 27/10: playlist inteligente "Músicas com melhor classificação"

- Para ser capaz de filtrar as músicas com melhor classificação, primeiro precisamos implementar uma forma do usuário atualizar sua classificação sobre as músicas. A melhor forma é utilizando estrelas de 0 a 5 como rating. O componente npm react-rating-stars-component facilita esse trabalho
- Após ter as estrelas implementadas, de forma que o usuário possa clicar para alterar a classificação de uma música, basta buscar dentre no array de músicas totais da biblioteca qual a maior classificação e filtra todas com essa mesma classificação
- A implementação da funcionalidade de rating deu muito mais trabalho que o esperado por conta das limitações do onChange das biblitecas de componentes de star rating (procurei outras no npm e todas apresentaram comportamento parecido). O componente de StarRating expõe através do onChange (quando se clica em uma estrela de classificação diferente da atual) apenas um callback que recebe um parâmetro "newRating" com o valor novo a ser alterado. Assim, não há como identificar o spotifyID da música que teve seu rating alterado.
- Provavelmente todos componentes apresentam esse mesmo comportamento, pois espera-se uma maior modularização em React, ou seja, isso serviu para indicar que meu approach com um componente SongTable que renderizava toda a tabela de músicas não era o mais adequado. Aumentando a componentização, criando um componente SongTableRow para ficar responsável pela linha da tabela correspondente a uma única música foi o suficiente para conseguir passar o spotifyID como prop e ser capaz de salvar o newRating através do onChange
- Com o arcabouço do sistema de ratings funcionando, implementar a rota deve ser uma tarefa fácil para filtrar as músicas melhores classificadas (de maior rating atualmente na biblioteca).
- De fato, a implementação foi análoga às feitas anteriormente

## Sprint 03/11: consertar problema variável ambiente do Netlify

- Os deploys do front não estavam buildando pois a variável de ambiente CI estava como true por padrão, que impede a build em caso de warnings. Como os warnings em questão não impactam a funcionalidade da aplicação e podem ser suprimidos com comentários especiais no código, a variável CI foi configurada como false para permitir o build.

## Sprint 03/11: backup da biblioteca

- Botões de import e export colocados abaixo do ListGroupSection de Library, acima das opções de filtragem da biblioteca
- Ícones de download e upload utilizados são fornecidos pelo Bootstrap. Para tornar o projeto o mais auto contido possível, foi copiado o svg que os gera. Para separar o ícone da label do button é necessário uma entidade HTML de espaço nbsp
- Ao clicar em export, o usuário recebe o prompt de seu SO de onde deseja salvar o arquivo json com o conteúdo de songData da biblioteca.
- O import é bem mais complexo que o export, pois requer o uso do FileReader e de um input field de tipo file. Como o comportamento desejado é clicar no botão de import e receber o prompt de seleção de arquivo do próprio SO, foi necessário um input field com classe d-none para se tornar invisível, porém mantendo sua funcionalidade com listeners do botão ativando comportamento do input e vice-versa. Ao detectar uma alteração no input field com onChange, a aplicação faz a leitura do arquivo carregado e invoca setSongData com a informação do JSON passado
  - Implementação acima baseada em:
    - https://medium.com/codex/use-a-button-to-upload-files-on-your-react-app-with-bootstrap-ef963cbe8280
    - https://jsfiddle.net/Ln37kqc0/
- Por enquanto o backup é funcional porém convém adicionar verificação se o arquivo enviado é válido ou não. Uma boa forma de garantir isso seria através do JWT (JSON Web Token) pois ao gerar com uma chave secreta, pode-se ter controle de que o arquivo que está sendo importado foi gerado pelo export do Spotunes

## Sprint 03/11: criação de novas playlists

- Por enquanto criação apenas de playlists não-inteligentes, ou seja, que contém apenas o título da Playlist
- Como serão adicionados mais playlists na barra lateral, ela foi configurada para adicionar um scroll no overflow do seu tamanho original. Ademais, as novas playlists são colocadas no topo da lista, pois caso o usuário tenha muitas, já é capaz de identificar que a playlist foi criada adequadamente
- Adição de um botão para criar uma nova playlist acima do ListGroup referentes a playlists, ao ser clicado abre um modal PlaylistCreationFormModal com o form de criação que pergunta pelo título que a playlist deve ter

## Sprint 10/11: substituição da mensagem no campo de busca

- Substituição de "Search" por "Add new song..." para indicar melhor que buscar ali permite incrementar na biblioteca

## Sprint 10/11: adição dos botões de edição e remoção de playlist

- Dentro de cada playlist foram adicionados botões para permitir edição e remoção
- O botão de remoção pede uma confirmação com um popup do próprio navegador. Após a confirmação do usuário, filtra as playlists, restando apenas aquelas que não são a atual, finalmente atualizando o estado das playlists e redirecionando para a página inicial do Spotunes.
- O botão de editar playlist abre um modal com o forms de edição da playlist. Foi criado um componente similar ao modal de criação de playlist, porém especializado na edição (que consiste em já carregar o valor atual do título da playlist no input, gerenciado através do useState do React. Ao digitar ou apagar no input, um campo onChange estabelece o novo valor do estado React, que serve como valor para o campo). Essa especialização do componente do modal de edição fez notar que havia um import desnecessário no modal de criação de playlist. O import foi removido.
- O componente SongTable gerencia os botões de edição e remoção bem com suas respectivas funções a serem executadas ao serem clicados. Para obter o id da playlist, presente na rota, utilizar o hook useParams().
- O hook useHistory é usado para redirecionar da rota atual da playlist deletada para a rota inicial da aplicação
- Após a implementação inicial, a edição e deleção de playlists parecia funcionar corretamente, mas um bug estranho ocorre se forem adicionadas duas playlists com mesmo nome, a edição de uma delas provoca o surgimento de uma playlist fantasma que continua com o nome antigo. Provavelmente tem algo a ver com terem sido usados os titles como key da lista no React
- O ListGroup de playlists agora recebe uma key mais adequada: os ids da playlist. O bug não tinha a ver com isso, mas sim estava faltando o useEffect receber a variável "currentPlaylist" para ficar de olho em alterações. Agora a funcionalidade de edição funciona normalmente.

## Sprint 10/11: funcionalidade dos botões do player

- Remoção do slider de volume, pois não é possível controlar o volume das músicas pelo iframe ou browser, apenas seria possível caso fossem elementos audio do HTML5
- A biblioteca 'react-player-controls' foi removida pois não contém um botão de stop, podendo ser facilmente substituída pelos ícones do bootstrap (a partir de código em svg para ficar auto-contido).
- Sendo assim, o novo design dos botões do player conta com botões de pular música (para frente e para trás), que navegam através da seleção de músicas atual, de acordo com o índice e um botão de stop, que remove o iframe do Spotify atual, colocando o placeholder no lugar
- Ao passar com o mouse em cima de um dos botões, o cursor do usuário se torna um pointer e o fundo dos botões se destaca, para sugerir o uso ao usuário
- Para a funcionalidade de stop, o componente MusicPlayerControls precisa receber o estado playerSongID, que guarda a ID da música do Spotify para o elemento atual a ser mostrado no iframe

## Sprint 17/11: pular para música seguinte ou anterior

- Os botões de pular para música seguinte ou anterior se baseiam no estado currentSongIndex, que é inicializado com -1 e tem seu valor somado ou subtraído, de acordo com o botão clicado. Resulta em um fluxo cíclico entre a atual seleção de músicas mostradas (filteredSongData)
- A música selecionada é mostrada no iframe e tem uma badge "Active" marcada na SongTable. O Badge não foi utilizado como componente do react-bootstrap pois há algum bug na biblioteca, que não está compilando o arquivo Badge.js. Utilizar a classe badge do Bootstrap convencional resolveu esse problema e o funcionamento é idêntico ao esperado. O bug não foi resolvido nem mesmo atualizando da versão 2.0.0 para 2.0.2 do react-bootstrap
- Para tornar consistente, foi padronizado usar a filteredSongData para todas músicas listadas na SongTable, mesmo quando o filtro é o "/all". Assim o ciclo de pular música mantém-se funcional e consistente.
- Ao clicar múltiplas vezes rapidamente no botão de pular música, o iframe acaba ficando "selecionado" em azul pelo browser, esse comportamento pode ser resolvido com a propriedade user-select no CSS, com valor none

## Sprint 17/11: desabilitar warning

- eslint-disable-next-line react-hooks/exhaustive-deps para remover o warning gerado no index.js em pages/Home, pois trata-se de uma dependência que não convém ser adicionada ao hook useEffect. Alterar de outra forma que eliminasse o warning resultaria em várias mudanças estruturais, pouco estratégicas no desenvolvimento da aplicação.

## Sprint 17/11: badge de play

- Cada SongTableRow tem uma badge de play que age como um botão, para configurar o iframe do Spotify com a música clicada. Ao ser clicado a badge se transforma em Active para o item atual

## Sprint 17/11: sidebar com informações da música

- Ao iniciar a aplicação, a sidebar mostra um warning, explicando que deve-se clicar na badge "Show" em alguma música da biblioteca para mostrar as informações na própria sidebar
- Ao clicar em "Show" em alguma música, a sidebar passa a mostrar as ações disponíveis para a música atual (Adicionar a uma playlist, editar informações da música e deletar da biblioteca), junto com um card com as informações relevantes ao usuário (capa do álbum, nome da música, artista, nome do álbum, duração, data de criação e modificação, quantidade de reproduções e classificação)
- Clicar no "Show" de uma música faz com que a aplicação busque o objeto em songData que contém o mesmo id do elemento clicado, adicionando o objeto encontrado ao estado do React que guarda a música selecionada
- Um problema resolvido foi que a data armazenada no songData tanto para criação quanto modificação está em milissegundos desde 01/01/1970, por isso para mostrar um valor mais expressivo ao usuário (no formato "ano/mês/data", junto com o horário no formato "hora:minuto") foi criada a função formatDateString() para auxiliar na conversão

## Sprint 17/11: componentização da song info sidebar

- Criação do componente SongInfoSidebar para extrair a siderbar responsável pela informação das músicas, agregando os estados correspondentes e as funções auxiliares para melhorar a organização do código

## Sprint 17/11: remoção do scroll horizontal inutilizado

- As sidebars e a SongTable estavam com a propriedade de overflow atribuída como scroll, para criar barras de rolagem quando seu conteúdo não coubesse no espaço que lhes foi reservado, porém a propriedade overflow atribui um scroll horizontal, que ficava inutilizado e tomando espaço na tela. Isso é facilmente resolvido trocando por overflow-y, que cria apenas a barra de rolagem vertical, aproveitando melhor o espaço da tela para a aplicação.

## Sprint 17/11: mover botão de adicionar playlist para dentro da SongInfoSidebar

- Como a funcionalidade de adiçionar música à playlist já estava pronta, com o botão de adição em cada uma das SongTableRow, para mover para a SongInfoSidebar foi bastante simples, bastando mover a função de adição para dentro do novo componente e injetar as dependências dentro dele

## Sprint 17/11: botão de deletar música dentro do SongInfoSidebar

- Análogo ao botão de deletar playlist. Ao clicar nele, o usuário recebe uma confirmação do navegador para evitar deleções indesejadas. Caso confirme, um novo conjunto de songData é filtrado sem a música selecionada para deleção e songData recebe esse array filtrado como novo estado. Após isso o estado showInfoSong é resetado para seu valor padrão (objeto vazio), para que o componente SongInfoSidebar volte a mostrar o alert inicial.

## Sprint 17/11: remoção do duplo clique para tocar música

- Como agora temos a badge "Play" explicitamente indicada na interface, a funcionalidade de dar um duplo clique na SongTableRow de uma música para reproduzi-la, se torna problemática, pois há grande chance que o usuário efetue um duplo clique sem imaginar que teria esse efeito indesejado, removendo-o da reprodução atual.

## Sprint 17/11: conserto de bug com funcionalidade de pular músicas

- Ao navegar pelas músicas atualmente filtradas com as setas, o índice da música ativa atualmente não era alterado se pulássemos para uma outra música diferente com o botão de "Play", sendo assim, clicar posteriormente no botão de skip considerava esse índice anterior, quebrando a funcionalidade cíclica sequencial pretendida.
- Para consertar isso, o estado currentSongIndex foi movido para fora do componente MusicPlayerControls, sendo gerenciado pelo index da aplicação. Assim, é possível passar o estado currentSongIndex para o component SongTableRow, para que currentSongIndex receba o índice de uma eventual música que tenha seu botão de "Play" clicado.

## Sprint 17/11: compactação do botão de criar playlist

- Como os ícones do Bootstrap em svg tomam um espaço padrão considerável, o botão "+ New Playlist" acabava quebrando uma linha desnecessariamente, para compactar e melhorar a interface da aplicação, tornando-a mais enxuta, o svg de "+" foi trocado pelo caracter "+" e agora o botão de criar playlist diz "+ Playlist" , cabendo em apenas uma linha

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

TODO: fix bug onde uma música de 5 min e 5segundos (The Great Gig In the Sky - Live at Knebworth 1990 ) aparece como 5:5 em vez de 5:05
TODO: checar mais a fundo o problema dos warnings e testar useCallback()

TODO: mostrar minutagem no footer sem ser em padrão decimal quando tem poucas musicas

TODO: consertar ou suprimir warnings do React para permitir build com CI sendo true

TODO: fazer verificações no JSON importado na biblioteca e verificar através do JWT com uma chave secreta se o arquivo foi de fato exportado pelo Spotunes ou não

TODO: ao abrir o app o contador no footer está zerado

TODO: ao deletar uma playlist e redirecionar para o /all, o ALl Songs está em branco não estando marcado na ListGroupSection

TODO: ao remover uma música da playlist editando as checkboxes, atualizar o componente da playlist atual

TODO: botão edit em SongInfoSidebar
TODO: clicar em skip para trás ou frente não reseta o songplayed e portanto contagem de reproduções não sobe corretamente

dickerizar os 2 juntos e facilitar deploy no heroku
começar monografia
lembrar de dar um relato sobre pq eu preferiria fazer em Angular do que react
questionário para usuários do spotunes
checar vlc player no android
