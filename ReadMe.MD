# DND Node app Backend

## You have to perform following steps to setup the project

## 1 You have to manually add 3 record in columns collection example is below

### 1 `{_id: "todo", taskIds: []}`
### 2 `{_id: "inprogress", taskIds: []}`
### 3 `{_id: "completed", taskIds: []}`

**After adding records in MongoDb**
## Add .env file at root of the project below is the required variables

### MongoDb Srv variable name is : `DB_URL=******`


## You can run this app using following commands

### `npm i` for installing dependencies

### `npm run build` for make a build of project.
**since it is in typescript it should be transpiled to javascript.**

### `npm start` for run the app

