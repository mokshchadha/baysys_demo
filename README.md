

## Project setup and quickstart guide

Step 1:- Install dependencies (using node v20)
`npm i `

Step 2:- create .env and add chat gpt creds
`touch .env`

`nano .env`

add your env variables in the .env file key here

```CHAT_GPT_KEY=<API_KEY>
MONGO_URL=<MONGO_DB_URL>
DB_NAME=<NAME_OF_DB>
NODE_ENV="development"
AUTH_KEY="moksh1234"
```

authkey is hardcoded so make sure to change <i>middleware.js </i>before changin it int he env
change the NODE_ENV based on your preference it controles the auth middleware

Step 3:- In order to run the server `node index.js`
Server port runs at port `3000`
