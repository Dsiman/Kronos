<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Dsiman/Kronos">
    <img src="https://cdn.discordapp.com/avatars/646372912953294881/82193cb73d823a9eb53911dc7b94b383.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Kronos</h3>

  <p align="center">
    A Discordjs Bot built with the intention of collecting user sessions in games and saving them to a database 
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email`, `email_client`, `project_title`, `project_description`

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [ascii-table](https://www.npmjs.com/package/ascii-table)
* [discord.js](https://discord.js.org/#/)
* [mongoose](https://mongoosejs.com/)
<p align="right">(<a href="#top">back to top</a>)</p>

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* Discord token
  You will need to obtain a Bot TOKEN  
  ```sh
  https://discord.com/developers/applications
  ```

### Installation


1. Clone the repo
   ```sh
   git clone https://github.com//Dsiman/Kronos.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Make a mongodb database to store your sessions
   ```
   https://www.mongodb.com/
   ```
4. Enter your API in `config.js`
   ```js
   module.exports = {
        // Bot token
        token: 'somestringprovidedbydiscorddeveloperportal',
        // mongodb connection string
        mongoURI: 'mongodb+srv://<Username>:<Password>@mongodb.com/<Database>', 
        // Things to exclude from being tracked
        notgames: [
            'Custom Status',
            'Spotify',
        ]
    }
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Damian Isaacs - Discord handle RougeShadow#0680 
Email - Damianisaacs@live.com

Project Link: [https://github.com/Dsiman/Kronos/](https://github.com/Dsiman/Kronos/)

<p align="right">(<a href="#top">back to top</a>)</p>
