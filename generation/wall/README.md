# Mur d'écrans de la scène (direction 05)

Sources de `assets/scene/agent-wall.jpg` et `agent-wall-mobile.jpg`.

- `panels-html/` : les 14 écrans, en HTML autonome.
- `render.cjs` : rend chaque écran en PNG 1600×1000 dans `panels/`.
- `compose_wall_v3.py` : compose le mur incurvé à partir de ces PNG. Les fichiers
  `layout-*.txt` indiquent quel écran va dans quel emplacement.

Régénérer, depuis ce dossier :
```
NODE_PATH=$(npm root -g) node render.cjs
python compose_wall_v3.py panels agent-wall.jpg --layout layout-desktop.txt --rows 0,1,2,3 --pw 0.17 --gap 0.035 --top 0.035 --side 0.9 --sidepow 1.4 --back 0.7 --pitch 7 --dphi 21 --quality 88
python compose_wall_v3.py panels agent-wall-mobile.jpg --w 1200 --h 1100 --layout layout-mobile.txt --rows 0,1,2,3,4 --pw 0.28 --gap 0.035 --top 0.045 --eye 1.3 --side 0.6 --sidepow 2.2 --blurstart 0.8 --blur 2 --back 0.7 --pitch 7 --dphi 21 --fade0 0.5 --fade1 0.86 --edge 0.02 --quality 88
```
Copier ensuite les deux JPEG dans `assets/scene/`. Le prompt Higgsfield équivalent est dans
`generation/PROMPTS.md`.
