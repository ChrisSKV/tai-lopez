# Mur d'écrans de la scène (direction 05)

Sources de `assets/scene/agent-wall.jpg` et `agent-wall-mobile.jpg`.

Round 5 : chaque écran montre UN agent IA au travail, en mots simples (retour client : « les écrans
derrière, ce sont juste des sites web, on ne comprend pas »). Chaque écran a : un visage d'agent
(rendu 3D `assets/agents/white-*.png` sur les écrans clairs, ou visage maison en SVG généré par
`_agent.js`), son nom (« Sales agent »…), ce qu'il fait en ce moment (« Replying to 12 new leads… »),
et des preuves « en direct » (bulles de chat client/agent, coches, progression). Pas de prix, pas de
revenus, pas de code.

- `panels-html/` : les 14 écrans (1600×1000), en HTML autonome.
  - `_panel.css` : base commune (nom + pastille « en direct », titres, bulles, coches, tags, progression).
  - `_agent.js` : visages d'agents (coque brillante, écran noir, yeux en pixels lumineux, icône),
    `<div class="face" data-shell data-rim data-eye data-mood data-icon data-extra>` ; icônes `<i class="ic" data-i>`,
    anneau « en cours » `<i class="sp">`, coche `<span class="ok"></span>`.
  - Écrans : sales, inbox, booking, support, calls (Phone agent), content, travel, finance,
    research, social, shop (Orders agent), life, restaurant (Reservations agent), meeting.
- `render.cjs` : rend chaque écran en PNG 1600×1000 dans `panels/` (ignore les fichiers `_*`).
- `compose_wall_v3.py` : compose le mur incurvé à partir de ces PNG. Les fichiers
  `layout-*.txt` indiquent quel écran va dans quel emplacement (les 4 écrans autour de Tai portent
  les phrases clés : leads, appels réservés, Inbox: 0, clients répondus).

Régénérer, depuis ce dossier (venv avec opencv/numpy/pillow) :
```
NODE_PATH=$(npm root -g) node render.cjs
python compose_wall_v3.py panels agent-wall.jpg --layout layout-desktop.txt --rows 0,1,2,3 --pw 0.17 --gap 0.035 --top 0.035 --side 0.9 --sidepow 1.4 --back 0.7 --pitch 7 --dphi 21 --quality 88
python compose_wall_v3.py panels agent-wall-mobile.jpg --w 1200 --h 1100 --layout layout-mobile.txt --rows 0,1,2,3,4 --pw 0.28 --gap 0.035 --top 0.045 --eye 1.3 --side 0.6 --sidepow 2.2 --blurstart 0.8 --blur 2 --back 0.7 --pitch 7 --dphi 21 --fade0 0.5 --fade1 0.86 --edge 0.02 --dim 0.84 --quality 88
```
(`--dim 0.84` sur mobile garde la même luminosité moyenne que le mur validé par le client.)

Version rétina du mur desktop (même composition, 3360×1344, servie par `srcset` aux écrans 2x pour
qu'aucun écran n'agrandisse l'image ; `--blur` est en pixels, donc ×1,4) :
```
python compose_wall_v3.py panels agent-wall-2x.jpg --w 3360 --h 1344 --blur 3.5 --layout layout-desktop.txt --rows 0,1,2,3 --pw 0.17 --gap 0.035 --top 0.035 --side 0.9 --sidepow 1.4 --back 0.7 --pitch 7 --dphi 21 --quality 82
```
Copier ensuite les trois JPEG dans `assets/scene/`.
