#!/usr/bin/env python3
"""Alterna apenas a data do Bradesco e atualiza a versão do conteúdo no HTML."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('estado', choices=['status', 'original', 'entrevista'])
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    dates = json.loads((root / 'config/bradesco-dates.json').read_text(encoding='utf-8'))
    content_path = root / 'content.js'
    html_path = root / 'index.html'
    content = content_path.read_text(encoding='utf-8')
    html = html_path.read_text(encoding='utf-8')
    organization = re.escape(json.dumps(dates['organization'], ensure_ascii=False))
    pattern = re.compile(r'("organization":\s*' + organization + r',\s*"period":\s*)"([^"]+)"')
    matches = list(pattern.finditer(content))
    if len(matches) != 1:
        sys.exit('Não foi possível identificar uma única experiência no Bradesco. Nenhum arquivo foi alterado.')
    current = matches[0].group(2)
    active = next((state for state in ['original', 'entrevista'] if dates[state] == current), 'personalizado')
    if args.estado == 'status':
        print(f'Estado: {active}\nData: {current}')
        return
    if active == 'personalizado':
        sys.exit('A data foi editada manualmente. Confira config/bradesco-dates.json antes de alternar; nenhum arquivo foi alterado.')
    if active == args.estado:
        print(f'Estado {active} já ativo: {current}. Nenhum arquivo foi alterado.')
        return
    updated = pattern.sub(lambda match: match.group(1) + json.dumps(dates[args.estado], ensure_ascii=False), content)
    version = hashlib.sha256(updated.encode('utf-8')).hexdigest()[:12]
    html_updated, count = re.subn(r'content\.js\?v=[^"\s]+', f'content.js?v={version}', html)
    if count != 1:
        sys.exit('Não foi possível atualizar a versão de content.js no HTML. Nenhum arquivo foi alterado.')
    content_path.write_text(updated, encoding='utf-8')
    html_path.write_text(html_updated, encoding='utf-8')
    print(f'Estado: {args.estado}\nData: {dates[args.estado]}')
    print('Arquivos locais atualizados. Para publicar no GitHub Pages, faça commit de content.js e index.html e envie para main.')


if __name__ == '__main__':
    main()
