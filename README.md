# Agro Forte: Produzir Preservando

**Concurso Agrinho 2026 | Subcategoria 3: Linguagem JavaScript (p5.js)**  
Série: 1º Ano do Ensino Médio | Rede Estadual de Ensino do Paraná

---

## Objetivo do Tema Agrinho

O Concurso Agrinho 2026 propõe reflexão sobre o tema:

> *"Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente"*

Este projeto demonstra que o campo brasileiro pode **produzir mais e melhor sem destruir o planeta**, combinando site educacional interativo e jogo sobre boas práticas agrícolas, tecnologia no campo e participação dos jovens.

---

## Descrição do Projeto

### Site principal (`index.html`)

Site educacional com 8 seções navegáveis:

| Seção | Conteúdo |
|---|---|
| **O Desafio** | Por que produzir e preservar ao mesmo tempo é urgente e possível |
| **Boas Práticas** | Plantio direto, irrigação inteligente, energia solar e biodiversidade |
| **Tecnologia** | Drones, sensores IoT, GPS de precisão e análise de dados no campo |
| **Mapa Interativo** | Propriedade rural com 7 pontos clicáveis (Lavoura, Nascente, Mata Ciliar, Solar, Tecnologia, Biodigestor, Jovem Produtor) |
| **Números** | Dados reais do agronegócio brasileiro com animação de contadores |
| **Juventude** | Papel dos jovens na transformação do campo |
| **Simulador** | Escolha práticas sustentáveis e veja o índice de sustentabilidade em tempo real |
| **Jogo** | Card de lançamento com link para o jogo educativo em página separada |

### Jogo educativo (`jogo.html`)

**Salve a Fazendinha do Agrinho** — aventura interativa em tela cheia:

1. Historinha em 4 cenas com mascotes do Agrinho
2. Comparação visual entre fazenda degradada e fazenda sustentável
3. Quiz com 6 perguntas (mínimo 200 pontos para avançar)
4. Missão com 6 problemas ambientais para corrigir na fazenda
5. Tela de resultado com troféus e recorde salvo no navegador

---

## Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| **HTML5** | Estrutura semântica: `<section>`, `<article>`, `<main>`, `<footer>`, `<nav>`, `<dialog>`, atributos `aria-*` |
| **CSS3** | Flexbox, Grid, `@keyframes`, modo escuro (`.dark`), responsividade com `@media`, variáveis CSS, `prefers-reduced-motion` |
| **JavaScript (p5.js)** | Cena interativa no hero (`sketch.js`): `setup`, `draw`, eventos, `dist`, `map`, `lerpColor` |
| **JavaScript (vanilla)** | Site (`script.js`) e jogo (`game.js`): DOM, `localStorage`, quiz, simulador, mapa |

---

## Acessibilidade

Recursos implementados em ambas as páginas:

- **Skip link** — "Pular para o conteúdo principal" visível ao focar com teclado
- **`prefers-reduced-motion`** — reduz animações para usuários com sensibilidade a movimento
- **Escala de fonte** — botões A / A+ / A++ (preferência salva em `localStorage`)
- **Modo escuro** — alternância com preferência persistida
- **Modais acessíveis** — foco preso, tecla Esc para fechar, `aria-modal`
- **Contraste e tamanho mínimo** — inputs com `font-size: max(16px, 1em)` para evitar zoom no mobile
- **Textos alternativos** — atributos `alt` em imagens informativas

---

## Como usar

### Site principal

1. Acesse o link do GitHub Pages (campo "About" do repositório)
2. Insira seu nome no modal de boas-vindas (saudação personalizada)
3. Navegue pelas seções pelo menu fixo no topo
4. No **Mapa Interativo**, clique nos pontos coloridos para ver detalhes
5. No **Simulador**, marque práticas sustentáveis e observe o índice crescer
6. Na página inicial, **clique no solo da cena p5.js** para plantar sementes (tecla **R** reinicia)
7. Na seção **Jogo**, clique em "Abrir jogo em nova aba"
8. Use **🌙** para modo escuro e **A / A+ / A++** para ajustar a fonte

### Jogo

1. Abra `jogo.html` (pelo site ou diretamente)
2. Leia "Como jogar" e siga a historinha
3. Responda o quiz (precisa de pelo menos 200 pontos)
4. Corrija os 6 problemas na fazenda clicando nos ícones
5. Veja sua pontuação final e tente bater seu recorde

---

## Estrutura de Arquivos

```
agrinho/
├── index.html       # Site principal (8 seções + card do jogo)
├── sketch.js        # Interação p5.js no hero (Subcategoria 3)
├── jogo.html        # Jogo educativo standalone
├── style.css        # Estilos do site, modo escuro, responsividade
├── script.js        # Simulador, mapa, modais, contadores, acessibilidade
├── game.css         # Estilos do jogo
├── game.js          # Lógica do jogo (quiz, missão, pontuação)
├── README.md        # Documentação completa (este arquivo)
├── .nojekyll        # Publicação correta no GitHub Pages
└── img/
    ├── favicon.svg  # Ícone da aba do navegador
    ├── lavoura.png  # Fundo do mapa interativo (IA — prompt abaixo)
    └── game/        # Arte visual do jogo (21 PNGs)
        ├── agrinho.png, abelha.png, arvore_mascote.png, arvore_morta.png
        ├── cano.png, florinha.png, gota_mascote.png, home_bg.png
        ├── fazenda_boa.png, fazenda_ruim.png, lixo_rio.png, pneu.png
        ├── story_bg1.png … story_bg4.png, tambor.png, toco.png
        └── trofeu_quiz.png, trofeu_fazenda.png, trofeu_max.png
```

---

## Detalhes da Implementação

### HTML (`index.html`)

- Página única com `<header>`, `<main id="conteudo">`, `<footer>`, `<nav>` e 8 `<section>`
- Skip link, créditos de imagens no rodapé e fontes consultadas
- CSS e JS apenas por arquivos externos (`style.css`, `script.js`)

### CSS (`style.css`)

- Layout com **Flexbox** (menu, cards, hero) e **Grid** (seções, juventude, números)
- **Media queries** para desktop, tablet e celular
- Modo escuro via classe `.dark` no `<html>`
- Animações com `@keyframes` (hero, contadores, modais, gauge do simulador)

### JavaScript p5.js (`sketch.js`)

| Recurso | Função |
|---|---|
| `setup()` / `draw()` | Canvas interativo no hero da página inicial |
| `mousePressed()` | Planta sementes no solo ao clicar |
| `keyReleased()` | Tecla **R** reinicia o campo |
| `dist()` / `map()` / `lerpColor()` | Espaçamento das plantas, céu dinâmico e crescimento |
| Funções auxiliares | Céu, solo, chuva e HUD modularizados |

### JavaScript (`script.js`)

| Recurso | Função |
|---|---|
| Modal de boas-vindas | Saudação personalizada com `localStorage` |
| Barra de acessibilidade | Escala de fonte e modo escuro persistidos |
| `IntersectionObserver` | Contadores animados na seção "O agro em números" |
| Menu lateral | Gaveta responsiva no mobile |
| Modais unificados | Mapa e cards de juventude (foco, Esc, `aria-*`) |
| Simulador + mapa | Práticas sustentáveis ligadas aos pins do mapa |

### Jogo (`jogo.html`, `game.js`, `game.css`)

| Recurso | Função |
|---|---|
| Tela de loading | Barra de progresso enquanto assets carregam |
| Historinha | 4 cenas com transição e mascotes animados |
| Quiz | 6 perguntas, timer de 18 s, feedback imediato |
| Missão | 6 problemas com `<dialog>` e escolhas múltiplas |
| Pontuação | HUD em tempo real + recorde em `localStorage` |
| Responsivo | Media queries para tablet e celular |

---

## Links

- **Repositório:** https://github.com/rafael37917-lgtm/agrinho
- **Site publicado:** https://rafael37917-lgtm.github.io/agrinho/
- **Jogo:** https://rafael37917-lgtm.github.io/agrinho/jogo.html

---

## Fontes de Dados

- **EMBRAPA** — Empresa Brasileira de Pesquisa Agropecuária
- **IBGE** — Censo Agropecuário 2017
- **CNA** — Confederação da Agricultura e Pecuária do Brasil
- **Ministério da Agricultura, Pecuária e Abastecimento**
- **Absolar** — Associação Brasileira de Energia Solar Fotovoltaica

---

## Créditos de Imagens e Recursos

### `img/lavoura.png` (IA)

Gerada com **ChatGPT (DALL-E)** usando o prompt:

> *"Vista de cima de uma fazenda sustentável com lavouras verdes, um rio com mata ciliar nativa nas margens, painéis solares no telhado da casa rural, biodigestor e vegetação diversificada. Estilo fotorrealista, durante o dia, iluminação natural, cores verdes e vibrantes."*

### `img/favicon.svg`

Criado manualmente em código SVG (emoji de trigo 🌾 sobre fundo verde).

### `img/game/` (21 arquivos PNG)

Imagens criadas pelo autor com base na própria imaginação e nas características definidas para cada personagem, cenário e objeto. A geração visual foi feita com **ChatGPT (DALL-E)**, a partir de prompts escritos pelo autor descrevendo:

- **Mascotes:** Agrinho, Abelha (Zé Colmeia), Florinha, Gota (Pinguim da Água), Dona Árvore
- **Cenários:** fundos da historinha (`story_bg1` a `story_bg4`), tela inicial (`home_bg`)
- **Fazendas:** comparação antes/depois (`fazenda_ruim`, `fazenda_boa`)
- **Objetos interativos:** lixo no rio, pneu, tambor, toco, cano quebrado, árvore morta
- **Troféus:** quiz, fazenda, pontuação máxima

Conceito, roteiro visual e descrição de cada imagem são de autoria do estudante; a ferramenta de IA foi usada apenas para produzir os arquivos PNG conforme as características informadas nos prompts.

### Emojis

Unicode nativo do navegador (sem download externo).

---

## Autoria

**Autor:** Weslley Rafael Padilha Branco — 1º Ano EM, Rede Estadual de Ensino do Paraná  
(Colégio Estadual São Vicente de Paulo — Turma 1º B)

- **Textos, estrutura do site, simulador, mapa, jogo e código HTML/CSS/JS:** produzidos pelo autor
- **Imagem `img/lavoura.png`:** gerada com IA (prompt documentado acima)
- **Imagens `img/game/`:** conceito e prompts do autor; geração visual com ChatGPT (DALL-E)

---

## Configuração no GitHub (edital Subcategoria 3)

Antes de enviar o link na Alura, confira:

1. **Repositório público** — visível para todos
2. **Topic `agrinho`** — About → ⚙️ → Topics → adicionar `agrinho`
3. **GitHub Pages** — Settings → Pages → branch `main`, pasta `/ (root)`
4. **Website no About** — `https://rafael37917-lgtm.github.io/agrinho`
5. **Descrição do About** — frase sobre o tema Agrinho 2026

---

*Projeto desenvolvido para o Concurso Agrinho 2026: SENAR-PR / SEED-PR*
