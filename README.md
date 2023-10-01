# MoyennesED - v3

## 📖 Présentation
MoyennesED est une application mobile conçue pour permettre aux élèves de consulter leurs **moyennes scolaires** et aux parents celles de leurs enfants, si leur école utilise le service EcoleDirecte.

## 🚀 Fonctionnalités
- [x] Authentification
  - [x] Compte élève
  - [x] Compte parent
- [x] Récup des notes + calcul moyennes
- [ ] Système de signalement de bugs
- [ ] Statistiques sur les lieux de téléchargement (établissements)

## ⚛️ Fonctionnement
Langage : **JavaScript** avec **React Native** et **Expo**  
L'application imite le fonctionnement du site web [ÉcoleDirecte](https://www.ecoledirecte.com/) pour se connecter, récupérer une clé de connexion, et ensuite récupérer les notes de l'élève automatiquement. Selon les paramètres décidés par l'utilisateur, les moyennes sont calculées avec des coefficients personnalisés.

## La v3 ?
Et oui, c'est la troisième version de l'application. Les deux premières étaient codées en **Flutter**, mais pour cette v3, **React Native** semblait plus approprié. Grâce à ce changement, l'amélioration de l'application dans le futur sera plus simple.

## Installation
L'application est dispo sur l'AppStore et bientôt le GooglePlay (seulement la v2 pour l'instant).

## Comment participer ?
N'hésitez pas à faire des pulls requests pour ajouter des fonctionnalités ou régler des bugs !  
Pour se faire, clonez le projet :
```bash
git clone https://github.com/diegofino15/moyennesed-v3.git
cd moyennesed-v3
```
Ensuite, installez les dependencies et lancez le projet avec expo :
```bash
npm install
npx expo start
```

## Contact
Si vous avez des questions ou des suggestions, n’hésitez pas à ouvrir une issue sur GitHub ou à me contacter directement via mail à moyennesed@gmail.com
