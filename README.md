# Agro Forte: Produzir Preservando

**Agrinho 2026 | Subcategoria 3 — JavaScript (p5.js)**  
1º Ano do Ensino Médio — Rede Estadual do Paraná

**Autor:** Weslley Rafael Padilha Branco  
Colégio Estadual São Vicente de Paulo — Turma 1º B

---

## Sobre o projeto

Este trabalho foi feito por mim para o Concurso Agrinho 2026. O tema do ano é:

> *"Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente"*

Eu quis mostrar que o campo pode **produzir e cuidar da natureza ao mesmo tempo**. Por isso criei um site educativo e um jogo, ligando a **cidade** (quem consome os alimentos) ao **campo** (quem produz com responsabilidade).

---

## O que tem no site

Quando você abre o site, encontra estas partes:

- **Início** — apresentação do projeto e uma cena interativa com p5.js (dá para plantar sementes clicando no solo)
- **O Desafio** — por que precisamos equilibrar produção e meio ambiente
- **Boas Práticas** — plantio direto, água, energia solar e biodiversidade
- **Tecnologia** — drones, sensores, GPS e dados no campo
- **Mapa Interativo** — clique nos 7 pontos da fazenda para saber mais
- **Números** — dados reais do agro com contadores animados
- **Juventude** — como os jovens podem ajudar a transformar o campo
- **Simulador** — marque práticas sustentáveis e veja o índice subir
- **Jogo** — link para o jogo *Salve a Fazendinha do Agrinho*

---

## O jogo

O jogo abre em outra página (`jogo.html`). Lá você:

1. Lê a historinha com a turma do Agrinho (4 cenas)
2. Compara uma fazenda ruim com uma fazenda boa
3. Responde um quiz de 6 perguntas (precisa de 200 pontos para passar)
4. Corrige 6 problemas na fazenda (lixo, pneu, cano, etc.)
5. Vê sua pontuação final e tenta bater seu recorde

A pontuação máxima é cerca de **950 pontos**. O site lembra seu nome (ou "visitante" se você pular o modal) e salva seu melhor resultado no navegador.

---

## Como eu fiz

Usei **HTML**, **CSS** e **JavaScript**, como pede a Subcategoria 3.

| O quê | Para quê eu usei |
|---|---|
| **HTML** | Estrutura do site e do jogo (seções, menu, botões, modais) |
| **CSS** | Layout, cores, animações, modo escuro e versão para celular |
| **p5.js** (`sketch.js` + `lib/p5.min.js`) | Cena interativa na página inicial — plantar sementes no hero |
| **JavaScript** (`script.js`) | Mapa, simulador, contadores, menu mobile e acessibilidade |
| **JavaScript** (`game.js`) | Quiz, missão na fazenda e pontuação do jogo |

Também pensei em **acessibilidade**: skip link, botões para aumentar a fonte (A / A+ / A++), modo escuro e opção de pular o nome na entrada.

---

## Como usar

### Site

1. Acesse: https://rafael37917-lgtm.github.io/agrinho/
2. Digite seu nome ou clique em **Pular**
3. Navegue pelo menu (Início, Desafio, Mapa, Números, Simulador, Jogo…)
4. No mapa, clique nos pontos coloridos
5. No simulador, marque as práticas e veja o índice crescer
6. Na página inicial, clique no solo marrom para plantar (tecla **R** reinicia)
7. Use 🌙 para modo escuro e A / A+ / A++ para mudar a fonte

### Jogo

1. Abra: https://rafael37917-lgtm.github.io/agrinho/jogo.html
2. Siga a historinha e responda o quiz
3. Corrija os 6 problemas na fazenda
4. Veja quantos pontos você fez

---

## Arquivos do projeto

```
agrinho/
├── index.html       # Site principal
├── sketch.js        # Interação p5.js (edital)
├── lib/p5.min.js    # Biblioteca p5.js (salva no repositório)
├── style.css        # Estilos do site
├── script.js        # Mapa, simulador, contadores…
├── jogo.html        # Jogo educativo
├── game.js          # Lógica do jogo
├── game.css         # Estilos do jogo
├── README.md        # Este arquivo
├── .nojekyll        # Para publicar no GitHub Pages
└── img/
    ├── favicon.svg
    ├── lavoura.png  # Fundo do mapa (IA)
    └── game/        # Imagens do jogo (21 PNGs)
```

---

## Como funciona o código (resumo)

**`sketch.js` (p5.js)** — No hero do site eu usei `setup()`, `draw()`, `mousePressed()` e `keyReleased()`. Ao clicar no solo, nasce uma planta. Usei `dist()`, `map()` e `lerpColor()` para espaçamento, céu e crescimento.

**`script.js`** — Controla o mapa, os modais, o simulador (ligado aos pins do mapa), os contadores que animam quando você rola a página, o menu no celular e as preferências salvas no navegador.

**`game.js`** — Controla as telas do jogo, o quiz com timer, os 6 problemas da fazenda e a pontuação. Se você já digitou o nome no site, o jogo usa na hora de parabenizar no final.

---

## Links

- Repositório: https://github.com/rafael37917-lgtm/agrinho
- Site: https://rafael37917-lgtm.github.io/agrinho/
- Jogo: https://rafael37917-lgtm.github.io/agrinho/jogo.html

---

## Fontes que eu consultei

Pesquisei nestes sites e instituições para escrever os textos e montar os números:

- **EMBRAPA** — práticas agrícolas e meio ambiente
- **IBGE** — Censo Agropecuário 2017
- **CNA** — dados do agronegócio no Brasil
- **Ministério da Agricultura**
- **Absolar** — energia solar no campo

---

## Créditos de imagens

### `img/lavoura.png`

Eu gerei essa imagem no **ChatGPT (DALL-E)** com este prompt:

> *"Vista de cima de uma fazenda sustentável com lavouras verdes, um rio com mata ciliar nativa nas margens, painéis solares no telhado da casa rural, biodigestor e vegetação diversificada. Estilo fotorrealista, durante o dia, iluminação natural, cores verdes e vibrantes."*

### `img/favicon.svg`

Eu mesmo fiz em SVG (emoji de trigo 🌾 com fundo verde).

### `img/game/` (21 imagens do jogo)

As ideias dos personagens, cenários e objetos foram minhas. Depois descrevi cada um e pedi ao **ChatGPT (DALL-E)** para gerar a imagem. Exemplos de prompts que eu usei:

**Agrinho** (`agrinho.png`):
> *"Mascote infantil do Agrinho, menino sorridente com chapéu de palha, camiseta verde com desenho de folha, estilo cartoon educativo 2D, cores vibrantes, fundo transparente, personagem amigável para crianças."*

**Florinha** (`florinha.png`):
> *"Mascote feminina infantil chamada Florinha, vestido amarelo com flores, cabelo castanho, estilo cartoon educativo agrinho, expressão alegre, fundo transparente."*

**Fazenda ruim** (`fazenda_ruim.png`):
> *"Ilustração isométrica de fazenda poluída e abandonada, rio sujo com lixo, árvores secas, céu cinza com fumaça, estilo cartoon educativo para jogo infantil sobre meio ambiente."*

**Fazenda boa** (`fazenda_boa.png`):
> *"Mesma fazenda recuperada e sustentável, lavouras verdes, rio limpo, painéis solares, céu azul, árvores vivas, estilo cartoon educativo colorido para jogo infantil agrinho."*

**Fundo da historinha** (`story_bg1.png`):
> *"Paisagem rural cartoon para fundo de historinha infantil, colinas verdes, céu azul claro, nuvens leves, estilo ilustração educativa agrinho, proporção panorâmica."*

**Lixo no rio** (`lixo_rio.png`):
> *"Ilustração cartoon de rio poluído com garrafas plásticas, latas e sacos de lixo nas margens, estilo educativo infantil, fundo transparente, para jogo sobre problemas ambientais na fazenda."*

**Troféu máximo** (`trofeu_max.png`):
> *"Troféu dourado em formato de escudo com número 950, grinalda de louros, estrelas brilhantes, estilo cartoon para jogo educativo infantil, fundo transparente."*

**Zé Colmeia — Abelha** (`abelha.png`):
> *"Mascote abelha cartoon amarela e preta, com expressão amigável e asas pequenas, estilo educativo infantil agrinho, fundo transparente, personagem fofo para crianças."*

**Pinguim da Água — Gota** (`gota_mascote.png`):
> *"Mascote gota d'água azul com rosto simpático e pequenos braços, estilo cartoon educativo sobre preservação da água, fundo transparente, agrinho infantil."*

**Dona Árvore** (`arvore_mascote.png`):
> *"Mascote árvore verde com rosto sorridente, olhos grandes, estilo cartoon educativo sobre meio ambiente, fundo transparente, personagem amigável agrinho."*

**Tela inicial do jogo** (`home_bg.png`):
> *"Paisagem rural cartoon colorida para tela inicial de jogo infantil, céu azul, colinas verdes, estilo ilustração educativa agrinho, proporção horizontal."*

**Cenários da historinha** (`story_bg2.png`, `story_bg3.png`, `story_bg4.png`):
> *"Fundos cartoon para historinha infantil do agrinho, paisagem rural com variações de clima e cenário (tarde, rio, fazenda), cores suaves, estilo educativo."*

**Pneu no solo** (`pneu.png`):
> *"Pneu velho jogado no chão da fazenda, estilo cartoon educativo infantil, fundo transparente, objeto de poluição ambiental para jogo."*

**Tambor de lixo** (`tambor.png`):
> *"Tambor metálico enferrujado com resíduos, estilo cartoon educativo infantil, fundo transparente, problema ambiental na fazenda."*

**Toco de árvore** (`toco.png`):
> *"Toco de árvore cortada no chão, estilo cartoon educativo infantil, fundo transparente, símbolo de desmatamento para jogo agrinho."*

**Cano quebrado** (`cano.png`):
> *"Cano de água quebrado vazando no chão, estilo cartoon educativo infantil, fundo transparente, desperdício de água na fazenda."*

**Árvore morta** (`arvore_morta.png`):
> *"Árvore seca sem folhas, tronco cinza, estilo cartoon educativo infantil, fundo transparente, problema ambiental na propriedade rural."*

**Troféu do quiz** (`trofeu_quiz.png`):
> *"Troféu dourado cartoon com estrela, premiação do quiz educativo, estilo infantil agrinho, fundo transparente."*

**Troféu da fazenda** (`trofeu_fazenda.png`):
> *"Troféu dourado cartoon com folha verde, premiação por recuperar a fazenda, estilo educativo infantil, fundo transparente."*

### Emojis

Os emojis do site vêm do próprio navegador (Unicode).

---

## GitHub (para o edital)

Meu repositório está configurado assim:

1. Repositório **público**
2. Topic **`agrinho`** no About
3. GitHub Pages na branch **`main`**
4. Link do site no About: `https://rafael37917-lgtm.github.io/agrinho`

---

*Projeto desenvolvido para o Concurso Agrinho 2026 — SENAR-PR / SEED-PR*
