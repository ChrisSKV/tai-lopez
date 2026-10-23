# Photos de Tai · Prompts Nano Banana Pro (Higgsfield)

Objectif : remplacer les photos actuelles de Tai, des miniatures basse définition prises sur
tailopez.com, par des images HD générées avec Nano Banana Pro. Les quatre pages utilisent
seulement trois fichiers. Si on les régénère au même cadrage, aucune ligne de code ne change.

## Réglages communs
- Modèle : Nano Banana Pro (Higgsfield).
- Images de référence à joindre à chaque génération, pour garder le visage de Tai :
  `generation/refs/ref-1-serious-3q.jpg`, `ref-2-serious-front.jpg`, `ref-3-smile.jpg`,
  `ref-4-laugh.jpg`.
- Résolution : 2K minimum, 4K si possible.
- Validation : chaque image générée doit être approuvée par l'équipe de Tai avant mise en
  ligne, puisqu'il s'agit de son visage.
- Bloc d'identité à coller au début de chaque prompt :

```
Use the reference photos as the exact identity: same man, same face shape, same rectangular
black glasses, same shoulder-length wavy dark brown hair, same short salt-and-pepper beard.
Photorealistic editorial photography, natural skin texture, sharp focus on the eyes,
no text, no logos, no watermark.
```

## Priorité 1 · Les trois poses utilisées par les pages

Elles sont générées sur fond uni pour un détourage propre. Après génération, on lance
le détourage puis on remplace les fichiers dans `assets/tai/`.

### A. `tai-portrait` · sérieux, trois-quarts. Utilisé par les héros 04, 05 et 03
Format 4:5 (1600×2000 ou plus).
```
[identity block] Head-and-chest portrait, body turned slightly to his left, head turned to
look off-camera to the right, calm confident expression, mouth closed. Dark navy wool
overshirt over a heather grey t-shirt, thin silver chain. Plain solid mid-grey seamless
studio background, soft key light from the front-left, subtle rim light on the hair.
Framing: top of the hair 6% below the top edge, crop at mid-chest, shoulders fully inside
the frame. 85mm lens, f/4.
```

### B. `tai-smile` · grand sourire face caméra. Utilisé par le héros 01
Format 6:5 (2400×2000).
```
[identity block] Head-and-shoulders portrait, facing the camera, big genuine smile showing
teeth, head tilted very slightly up, eyes to camera. Dark brown wool coat over a cream
zip-neck sweater. Plain solid light grey seamless studio background, soft bright beauty
lighting. Framing: generous space above the hair, crop at upper chest, both shoulders
fully inside the frame. 85mm lens.
```

### C. `tai-laugh` · éclat de rire. Utilisé par le héros 03 et les blocs « Meet Tai »
Format 1:1 (2048×2048).
```
[identity block] Candid laughing portrait, head turned slightly to his left, eyes crinkled,
natural laugh. Off-white textured button-up shirt, top button open. Plain solid light grey
seamless studio background, soft daylight. Framing: head and chest, both shoulders fully
inside the frame, space above the hair. 50mm lens.
```

### Intégration
```
python tools/cutout.py birefnet-portrait <dossier_des_png_generes> <dossier_sortie>
```
Ensuite, recadrer au contenu, exporter en WebP qualité 90 et remplacer `assets/tai/tai-portrait.webp`,
`tai-smile.webp` et `tai-laugh.webp`, plus leurs jumeaux PNG. Il faut ensuite mettre à jour
les attributs `width` et `height` des balises `img` dans chaque page avec les nouvelles dimensions.

## Priorité 2 · Images propres à chaque direction (optionnel)

### 01 Agent Lab · blanc et cobalt
Format 4:5.
```
[identity block] Waist-up, smiling at camera, arms relaxed, light grey t-shirt under an
unbuttoned navy overshirt. Bright minimal white studio, soft shadow, subtle cobalt blue
(#2B4BFF) rim light from the right. Clean, premium, Apple-style.
```

### 03 Autopilot · blanc et vert acide
Format 4:5.
```
[identity block] Waist-up, laughing and pointing at the camera with one hand, energetic.
White t-shirt, black overshirt. Solid acid lime (#C8FF2E) seamless backdrop, hard direct
flash, crisp shadow on the backdrop, pop editorial style.
```

### 04 Agent/OS · noir et violet
Format 4:5.
```
[identity block] Head-and-chest, three-quarter view looking off-camera to the right,
serious and calm. Black overshirt. Pure black background, low-key cinematic lighting,
strong violet (#8B5CF6) rim light from behind on the left edge of his hair and shoulder,
faint violet haze.
```

### 05 La scène · Tai sur scène
Deux formats : 16:9 pour le desktop (3840×2160) et 9:16 pour le mobile (2160×3840).
```
[identity block] Tai Lopez speaking on a huge keynote stage, waist-up, holding a black
handheld microphone, one hand open toward the audience, confident smile. Behind him a giant
LED wall glowing deep red (#FF3B30), blank (no text, we add the title in HTML). Volumetric
stage light beams from above through light haze, warm white key light on his face, cool
rim light. Foreground: dark silhouettes of the crowd, slightly out of focus, a few raised
phones with glowing screens. Shot from the audience at eye level, 50mm lens, shallow depth
of field, cinematic color grade. Keep the upper third of the LED wall clear for a headline.
```
Avec cette photo, la scène CSS de la direction 5 devient une vraie photo en fond de héros.
Le titre reste en HTML sur l'écran LED.

### Bloc « Meet Tai » commun · bibliothèque
Format 4:5.
```
[identity block] Seated in a dark brown leather armchair in front of floor-to-ceiling
bookshelves, holding an open book on his knee, looking at the camera with a slight smile.
Warm, moody library lighting, shallow depth of field.
```
