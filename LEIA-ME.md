# FLOW

O FLOW é um habit tracker pessoal feito como PWA. Ele registra hábitos e atividades físicas no próprio aparelho, sem conta ou sincronização. Não é um APK e não está publicado na Play Store.

## Instalar no Android

### 1. Coloque o projeto em um endereço HTTPS

O celular precisa abrir o FLOW por um endereço que comece com `https://`. O projeto ainda está como arquivos no computador; abrir `index.html` com dois toques ou pelo endereço `file://` não instala o PWA.

Publique os arquivos em uma hospedagem estática que ofereça HTTPS. Envie juntos, preservando os nomes e a mesma pasta:

- `index.html`
- `styles.css`
- `script.js`
- `manifest.webmanifest`
- `sw.js`
- `icon.svg`
- `logo.svg`

Depois da publicação, copie o endereço HTTPS do site. Os nomes dos arquivos e a organização da pasta precisam continuar iguais.

### 2. Instale pelo Chrome no celular

1. Conecte o celular à internet e abra o endereço HTTPS do FLOW no **Google Chrome**.
2. Espere a página carregar. Na primeira abertura, mantenha a conexão ativa para o app guardar os arquivos necessários ao modo offline.
3. Toque no menu **⋮**, no canto superior direito.
4. Toque em **Instalar app**. Dependendo da versão do Chrome, a opção pode aparecer como **Instalar e criar atalho** ou **Adicionar à tela inicial**.
5. Confirme em **Instalar** ou **Adicionar**.
6. Procure o ícone **FLOW** na tela inicial ou na lista de aplicativos e abra por ele.

O Chrome pode mostrar uma tela de confirmação antes de criar o ícone. Se aparecer somente a opção de criar um atalho, ela também permite abrir o FLOW pela tela inicial, mas pode manter a aparência de uma página do navegador.

### Instalar pelo Samsung Internet

1. Abra no Samsung Internet o mesmo endereço HTTPS usado no Chrome.
2. Se aparecer o botão de instalação na barra de endereço, toque nele e confirme **Instalar**.
3. Se não aparecer, abra o menu do navegador e procure **Adicionar página a** ou **Adicionar à tela inicial**.
4. Confirme a instalação e abra o FLOW pelo ícone criado na tela inicial ou na lista de aplicativos.

### Se a opção de instalar não aparecer

- Confirme que o endereço começa com `https://` e que não abriu um arquivo local do computador.
- Abra o menu do Chrome com a página do FLOW carregada e procure **Instalar app**, **Instalar e criar atalho** ou **Adicionar à tela inicial**.
- Atualize o Chrome, recarregue a página com internet e verifique o menu novamente.

### Atualizar e usar sem internet

- Abra o FLOW com internet na primeira vez. O service worker guarda os arquivos principais para permitir a abertura posterior sem conexão.
- Para receber uma atualização publicada, conecte o celular à internet e abra o FLOW novamente. Feche e abra o app se a mudança ainda não aparecer.
- O uso offline cobre a estrutura principal do app; recursos que dependam de serviços externos podem não carregar sem internet.

## Dados e privacidade

Hábitos e registros ficam no armazenamento local do navegador/aparelho. Eles não são sincronizados com outros aparelhos. Limpar os dados do navegador ou desinstalar o app pode apagar os registros. Use **Exportar meus dados** no perfil para salvar uma cópia JSON.

## Recursos

- Marcar hábitos e acompanhar o progresso diário e semanal.
- Criar rituais pessoais com categorias e metas.
- Registrar corrida, caminhada, academia, ciclismo, alongamento, natação e outros exercícios.
- Anotar duração, distância, data e observações das atividades.
- Consultar histórico e totais pessoais.
- Exportar os registros em JSON.
- Interface escura com animações discretas e cache para uso offline básico.

## Ajuda dos navegadores

- [Instalar web apps no Android com Chrome](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=pt-BR)
- [Guia de PWA da Samsung](https://developer.samsung.com/automation/v2-pwa-guide.html)
