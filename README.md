# Task Manager

## Description

Task Manager est une application en ligne de commande pour la gestion des tâches. Elle permet de créer, mettre à jour, supprimer et lister des tâches, avec un stockage persistant des données dans un fichier JSON.

## Fonctionnalités

- **Ajouter une tâche** : Crée une nouvelle tâche avec une description.
- **Mettre à jour une tâche** : Modifie la description d'une tâche existante.
- **Supprimer une tâche** : Supprime une tâche par son ID.
- **Lister les tâches** : Affiche toutes les tâches ou celles d'un statut spécifique (`todo`, `done`, `in-progress`).

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/a-alababsa/task-manager.git
   cd task-manager
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

## Utilisation

### Commandes

- Ajouter une tâche :

    ```bash
    npm run start add "Votre description de tâche"    
    ```

- Mettre à jour une tâche : 

    ```bash
    npm run start update 1 "Nouvelle description de tâche"
    ```
- Supprimer une tâche :
    ```bash
    npm run start delete 2
    ```
- Lister les tâches :

    ```bash
    npm run start list
    ```
    Pour lister les tâches par statut (todo, done, in-progress) :
    ```bash
    npm run start list todo
    ```