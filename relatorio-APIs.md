# Spotify

* Informações sobre como buscar informações das músicas em https://developer.spotify.com/documentation/web-api/
  * https://developer.spotify.com/documentation/web-api/reference/
* Playback pode ser feito com o SDK em https://developer.spotify.com/documentation/web-playback-sdk/ [Em Beta]
  * Ou com widgets https://developer.spotify.com/documentation/widgets/generate/embed/
* `GET https://api.spotify.com/v1/audio-features/{id}` pode ser extremamente útil para implementar as recomendações musicais com base em features que o Spotify já pré-calculou
  * Mais detalhes https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-track

* **SDK**
  * Conectar ao SDK é bem mais fácil e só exige um token. Nos testes, ele expira em 1 hora
  * Para deploy em produção, Spotify recomenda esse conteúdo https://developer.spotify.com/documentation/general/guides/authorization-guide
  * Depois de conectado, você pode abrir um aplicativo do Spotify e pedir para reproduzir certas músicas no Spotunes
  * O ideal seria ser capaz de reproduzir via Spotunes, o SDK fornece a função "play" mas recebi um erro 403 por necessitar de usuário Premium
    * Pode ser um limitante para usuário não-Premium e ainda seria interessante deixar para implementar o SDK após ter um sistema de usuários para poder usar a autenticação via browser do próprio Spotify

# Youtube

* Requer gerar uma chave de API para as requisições conforme https://developers.google.com/youtube/v3/getting-started
* Um problema: limite diário de 10 mil unidades de cota, uma busca gasta 100 unidades
  * É possível pedir ao Google para expandir essa cota, porém já dá pra cogitar criar uma API básica que simplesmente requisite o HTML do próprio Youtube para a busca em si (o iframe parece poder ser gerado sem depender da API, bastando um link)
* No geral, a API do Youtube parece mais simples e robusta que o Spotify
* Carregar um vídeo é simples e pode ser feito com iframe, apenas configurando a ID do vídeo no link do iframe ou carregando o iframe em um elemento HTML através da API
* Porém, há uma limitação de não poder deixar os vídeos em fullscreen, pesquisar como resolver

# Soundcloud

* Também possui um SDK: https://developers.soundcloud.com/docs/api/sdks
  * Esbarra nas mesmas questões de praticidade da SDK do Spotify
  * Considerando que os termos de uso da API do Soundcloud requerem identificação com logomarca, nome do usuário, arte de capa, etc é mais prático usar o widget
* Para usar a API de busca https://developers.soundcloud.com/docs/api/guide#search
  * Necessário uma chave do cliente
* SoundCloud não está mais liberando chaves para API por causa da alta demanda
  * Tentar solucionar isso parseando o HTML da página web mesmo e passando a URL obtida para o iframe

