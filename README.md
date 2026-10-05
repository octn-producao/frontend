# OCTN — Frontend público
1
Home institucional da Organização de Consultoria Técnica Nutricional.

## Executar localmente

O projeto é estático e não exige instalação de dependências. Na pasta `frontend`,
execute um servidor HTTP local, por exemplo:

```powershell
python -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

## Agendamento Agendae

- O botão **Agendamento** do header abre o Agendae em um modal, sem retirar o visitante do site OCTN.
- A aba **Agendamento de clientes** abre somente a página pública do estabelecimento `octn`.
- A aba **Login administrativo** abre somente o acesso da equipe da OCTN; a administração global do Agendae não faz parte da integração.
- Agendamentos, consultas, check-in, agenda, fila e configurações continuam sendo executados e armazenados exclusivamente pelo Agendae.
- O backend OCTN mantém `/api/agenda/*` para integrações servidor a servidor e usa a variável secreta `agendae-api-octn`.
- A chave `ag_live_...` nunca é enviada ao HTML ou ao JavaScript público.

## Área profissional

- O login é autenticado pelo backend em `https://backend-a3kp.onrender.com`.
- Cada identificador é convertido pelo backend em `<login>@octn.com.br` antes
  da autenticação e precisa possuir um perfil ativo na coleção `logins`.
- Nenhum token de autenticação é salvo no JavaScript, `localStorage` ou `sessionStorage`.
- A sessão usa cookie seguro e `HttpOnly`, validado pelo backend.
- Nutricionistas editam apenas os próprios relatórios. Clientes visualizam e
  imprimem somente os relatórios associados ao seu login.
- Os relatórios são carregados exclusivamente do armazenamento remoto protegido;
  o frontend não mantém cópia em `localStorage`.
- Fotografias anexadas são processadas pelo backend; credenciais de serviços
  externos nunca são incluídas no frontend.
- PDFs e planilhas são relacionados apenas pelo nome no índice de anexos.
- O botão **Gerar PDF** abre a impressão do navegador; escolha **Salvar como PDF**.
- O usuário correspondente precisa existir no provedor de identidade configurado
  com autenticação por senha habilitada.

## Publicação

O workflow `.github/workflows/deploy-pages.yml` publica o conteúdo no GitHub
Pages automaticamente a cada push na branch `main`.
