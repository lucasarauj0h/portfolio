# Portfólio — Lucas de Araujo Souza

Site pessoal com experiência profissional, projetos e leituras.

**Site:** https://lucasarauj0h.github.io/portfolio/

## Atualização

Os arquivos do site ficam na raiz deste repositório. Edite `index.html`, `content.js`, `app.js`, `styles.css` ou os arquivos em `assets/`, conforme necessário.

A publicação ocorre automaticamente após cada envio para a branch `main`. O GitHub Pages está configurado para publicar a raiz (`/`) dessa branch.

## Prévia local

```sh
python3 -m http.server 4173
```

Abra http://127.0.0.1:4173/ no navegador.

## Data de início no Bradesco

O backup da data anterior está em `config/bradesco-dates.json`:

- `original`: outubro de 2026, como estava antes desta alteração.
- `entrevista`: abril de 2025.

O comando abaixo mostra o estado atual, sem alterar arquivos:

```sh
python3 scripts/bradesco-date.py status
```

Para restaurar a data anterior e publicar no GitHub Pages:

```sh
cd /home/lucasouza/Documentos/python-scripts/portfolio
python3 scripts/bradesco-date.py original
git diff -- content.js index.html
git add content.js index.html
git commit -m "Restaura data original de inicio no Bradesco"
git push origin main
```

Para voltar a abril de 2025, use `python3 scripts/bradesco-date.py entrevista` e repita o commit e o push. O script altera somente o período dessa experiência e a versão de cache de `content.js`; as demais informações são preservadas. Não há botão visível no currículo.

Esses comandos publicam em `https://lucasarauj0h.github.io/portfolio/`. O endereço `chatgpt.site` é uma publicação separada; para sincronizá-lo depois, solicite também a atualização desse endereço.
