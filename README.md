# OCTN — Frontend público

Home institucional da Organização de Consultoria Técnica Nutricional.

## Executar localmente

O projeto é estático e não exige instalação de dependências. Na pasta `frontend`,
execute um servidor HTTP local, por exemplo:

```powershell
python -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

## Área profissional

- O login é autenticado pelo backend em `https://backend-a3kp.onrender.com`.
- O identificador `admin`, por exemplo, é convertido pelo backend em
  `admin@octn.com.br` antes da autenticação no Firebase.
- Nenhum token Firebase é salvo no JavaScript, `localStorage` ou `sessionStorage`.
- A sessão usa cookie seguro e `HttpOnly`, validado pelo backend.
- Os diagnósticos ILPI ainda são salvos no `localStorage` do navegador em uso.
- Fotografias anexadas são reduzidas e armazenadas localmente; PDFs e planilhas
  são relacionados pelo nome no índice de anexos.
- O botão **Gerar PDF** abre a impressão do navegador; escolha **Salvar como PDF**.
- O usuário correspondente precisa existir no Firebase Authentication com o
  provedor E-mail/senha habilitado.

## Publicação

O workflow `.github/workflows/deploy-pages.yml` publica o conteúdo no GitHub
Pages automaticamente a cada push na branch `main`.
