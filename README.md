# MoyennesED - v3

## 📖 Présentation
MoyennesED est une application mobile conçue pour permettre aux élèves de consulter leurs **moyennes scolaires** et aux parents celles de leurs enfants, si leur école utilise le service EcoleDirecte.

## 🚀 Fonctionnalités
- [x] Authentification (élève + parent)
- [x] Récupération des notes + calcul des moyennes
- [x] Devine coefficients (notes + matières)
  - [x] + Coefficients personnalisables
  - [x] Paramètres configurables sur l'onglet profil
- [x] Groupements de matières (ex: Spécialités / Tronc commun) + Sous matières (ex: Français > Écrit)
- [x] Graphique d'évolution de la moyenne générale
- [x] Système de signalement de bugs

## ⚛️ Fonctionnement
Structure : **JavaScript** avec **React Native** et **Expo**  
L'application imite le fonctionnement du site web [ÉcoleDirecte](https://www.ecoledirecte.com) pour se connecter, récupérer une clé de connexion, et ensuite récupérer les notes de l'élève automatiquement. Selon les paramètres décidés par l'utilisateur, les moyennes sont calculées avec des coefficients personnalisés.

## La v3 ?
Et oui, c'est la troisième version de l'application. Les deux premières étaient codées en **Flutter**, mais pour cette v3, **React Native** semblait plus approprié. Grâce à ce changement, l'amélioration de l'application dans le futur sera plus simple, et des animations et nouvelles interfaces plus stilisées.

## Installation
L'application est disponible sur l'AppStore, et sur le GooglePlay !

## Comment participer ?
N'hésitez pas à faire des pulls requests pour ajouter des fonctionnalités ou régler des bugs !  
Pour se faire, clonez le projet :
```bash
git clone https://github.com/diegofino15/moyennesed-v3.git
cd moyennesed-v3
```
Ensuite, installez les dependencies et lancez le projet avec expo et yarn :
```bash
yarn install
yarn start
```
Puis installez l'application ExpoGo sur votre appareil ou lancez un simulateur, et connectez vous au serveur lancé avec ```yarn start```

## Contact
Si vous avez des questions ou des suggestions, n’hésitez pas à ouvrir une issue sur GitHub ou à me contacter directement via mail à moyennesed@gmail.com.

## License
Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
