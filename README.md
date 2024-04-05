
## Run Locally

First, open MongoDB Compass and connect to localhost:27017. Make sure that the connection string is as shown below

```
mongodb://localhost:27017
```

To run the Node.js server, go to the terminal and navigate to the project directory.

```bash
  cd my-project
```

Install dependencies
```bash
  npm i
```

Start the server
```bash
  npm run start
```

Or alternatively for Nodemon
```bash
  npm run dev
```

Using Nodejs
```bash
  node index.js
```

Note that the server needs to be run twice initially to properly populate the database. After executing any of the commands to start the server, terminate the session and run it again. The `reservedBy` field in the seats collection should then contain the objectID of the referenced user.

After starting the server, open any internet browser and type `https://localhost:3000`. You will be redirected to the home page in which you can only use its services if you are logged in.

