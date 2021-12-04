<br />
<div align="center">
  <a href="https://github.com/Dsiman/Kronos">
    <img src="https://cdn.discordapp.com/avatars/646372912953294881/82193cb73d823a9eb53911dc7b94b383.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Kronos</h3>

  <p align="center">
    A Discordjs Bot built with the intention of collecting user sessions in games and saving them to a database. 
    You can also use the Docker container listed below. Recently I have rewritten the database to include the activity object discord returns for each member.
  </p>
</div>


### Built With

* [ascii-table](https://www.npmjs.com/package/ascii-table)
* [discord.js](https://discord.js.org/#/)
* [mongoose](https://mongoosejs.com/)
* [dotenv](https://github.com/motdotla/dotenv)
* [docker](https://hub.docker.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

### Prerequisites


* You will need to obtain a Discord Bot TOKEN  
  ```sh
  https://discord.com/developers/applications
  ```
* Npm (If you intend to use this as a nodejs app)
  ```sh
  npm install npm@latest -g
  ```
* Docker (If you intend to use docker use this)
  ```sh
  https://hub.docker.com/repository/docker/damianisaacs/kronos
  ```

### NodeJs Installation


1. Clone the repo
  ```sh
  git clone https://github.com//Dsiman/Kronos.git
  ```
2. Navigate to the download location and install NPM packages
  ```sh
  npm install
  ```
3. Make a mongodb database to store your sessions
  ```
  https://www.mongodb.com/
  ```
4. Enter your enter your Discord bot token and mongodb connection string in your environment variables( or in a .env folder in the root of the bot)
  ```js
  token=somestringprovidedbydiscorddeveloperportal
  mongoURI=mongodb+srv://<Username>:<Password>@mongodb.com/<Database>
  ```
5. Run your bot
  ```js
  npm start
  ```

### Docker Installation


1. Install docker
  ```js
  https://docs.docker.com/get-docker/
  ```
2. Get Kronos from dockerhub
  ```js
  docker pull damianisaacs/kronos
  ```
3. Define your environment variables
  ```js
  /* make a .env file containing */
  token=somestringprovidedbydiscorddeveloperportal
  mongoURI=mongodb+srv://<Username>:<Password>@mongodb.com/<Database>
  ```
4. Run your bot
  ```js
  docker run --env-file .env damianisaacs/kronos
  ```
5. Invite your bot to the server
  ```js
  https://discord.com/developers/applications/<YourBotAppID>/oauth2/url-generator
  ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

[Discord](https://discord.com/users/239307675840544768) 

[Email](Damianisaacs@live.com)

[Docker](https://hub.docker.com/u/damianisaacs)

[Github](https://github.com/Dsiman/Kronos/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Donate

[Cashapp](https://cash.app/$DamianIsaacs) 

<p align="right">(<a href="#top">back to top</a>)</p>
