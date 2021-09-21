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

## Sprint de 21/09: Enfoque nas funcionalidades de busca e adição na biblioteca

- A tentativa de manter o Spotunes minimamente dependente de um back-end (ao menos inicialmente) não funcionou por conta da autenticação do Spotify
- Mesmo que a biblioteca npm node-spotify-api abstraia vários processos do fluxo de autenticação, ainda assim é necessário um servidor Node para lidar com os tokens
  - O uso dessa biblioteca simplificou muito o processo de autenticação com o Spotify
- Erro de CORS
- Gastei tempo tentando criar várias Rows no modal que mostra o resultado da pesquisa, onde cada row teria 2 elementos mostrados, porém bastava criar apenas uma Row geral, e ir colocando vários elementos com "col-md-6" dentro. Tentei até mesmo reformatar o array com 10 itens em grupos de 2 elementos por array
- Reestruturação dos objetos recebidos pelo front (mais atributos mostrados na busca)
- Adição de novas músicas à biblioteca clicando no botão
