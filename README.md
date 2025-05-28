## 📋 Apresentação

Esta é uma aplicação Next.js criada para resolver uma necessidade real que surgiu nas peladas semanais que frequento com parentes e amigos.

Sempre que íamos marcar uma pelada (ou “racha”, como dizemos aqui no Ceará), o processo começava no grupo do WhatsApp: alguém iniciava uma lista de nomes para confirmar quem toparia jogar no dia marcado. O problema é que, a cada novo interessado, era preciso copiar toda a lista, colar e reenviar no grupo — algo trabalhoso e propenso a confusões. Essa foi a primeira dor percebida, e logo veio a ideia: **“seria ótimo automatizar esse processo.”**

A segunda dor era o sorteio dos times. Normalmente, os jogadores eram escolhidos “a dedo”, o que frequentemente gerava desconforto. Os mais habilidosos sempre eram os primeiros a ser escolhidos, e os demais acabavam sobrando, formando times visivelmente desequilibrados. Isso acabava desmotivando parte da galera.

A partir desses dois problemas nasceu a ideia desta aplicação, cujo MVP é bem direto:

- ✅ Cada jogador pode confirmar presença em uma pelada com apenas um clique.  
- ✅ O organizador, no início do jogo, faz o check-in dos presentes e clica em **“Sortear times”**, para uma divisão imparcial e aleatória.  
- ✅ Também será possível visualizar um histórico das peladas anteriores, mostrando quem esteve presente.

Este projeto nasceu de uma necessidade real, e o objetivo é tornar a organização das peladas **mais prática, justa e divertida** para todos os participantes.


## MVP - Rotas e Fluxo da Aplicação

### 🗺️ Mapa de Rotas

| # | Rota (Pages Router) | Quem acessa | Objetivo principal | Componentes-chave |
|---|---------------------|-------------|--------------------|-------------------|
| 1 | `/` **(Home)** | Todos | Listar partidas abertas / ocorridas | `MatchCard` (data, local) • botão **Criar partida** |
| 2 | `/novo` **(Criar partida)** | Organizador | Formulário para data, hora, local, nº máx de jogadores | `MatchForm` (DatePicker, Input) |
| 3 | `/partida/[id]` **(Detalhe)** | Jogadores / Organizador | Ver detalhes e confirmar presença | Lista **Confirmados** • botão **Confirmar** |
| 4 | `/partida/[id]/admin` **(Painel)** | Organizador | Fazer check-in e sortear times | Tabela **Presentes** (checkbox) • botão **Sortear times** |
| 5 | `/times/[token]` **(Times sorteados)** | Todos (link) | Exibir resultado do sorteio | Cards Time A / Time B (somente leitura) |
| 6 | `404.tsx` | — | Página de erro simpática | — |

### 🔄 Fluxo Resumido

1. **Organizador** cria partida em `/novo`  
   → recebe dois links:  
   • público `/partida/123` • privado `/partida/123/admin`.
2. **Jogadores** acessam `/partida/123`, clicam **Confirmar** e informam o nome.
3. No dia do jogo, **organizador** abre `/partida/123/admin`, marca check-in e clica **Sortear times**.
4. Sistema redireciona para `/times/XYZ`; link pode ser compartilhado no grupo.

> **Autenticação:** MVP sem login. Jogador só informa **nome**.  
> Ações de organizador protegidas por **token** (URL `/admin`).

### 📁 Estrutura de Arquivos (Next.js Pages Router)

