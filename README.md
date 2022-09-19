<p align="center">
  <h2 align="center">Web Scrapping With Pupeeteer & MongoDB</h2>
</p>

  <p align="center">
    An API that scrapes bank information from a webpage using Pupeeteer and stores it in a Mongo database
  </p>
  
## How to run locally
```
- Ensure you signup on https://bankof.okra.ng/register

- clone the repository by running gh repo clone andrewinsoul/okra (Ensure the gh cli tool is installed on your machine)

- cd into okra folder

- Create a .env file that matches with the template of .env.sample

- run npm install to install dependencies

````

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
````

## API ROUTES

<table>
  <tr>
    <th>HTTP VERB</th>
    <th>ENDPOINT</th>
    <th>FUNCTIONALITY</th>
    <th>PAYLOAD</th>
  </tr>
  <tr>
    <td>GET</td> 
    <td>/v1/ping</td>  
    <td>Ensures the server is working without making any api call that calls the database</td>
    <td>N/A</td>
  </tr>

  <tr>
    <td>POST</td> 
    <td>/v1/scrape</td>  
    <td>Scrapes user account information and saves into the database</td>
    <td>
    {
      email: '',
      password: ''
      }
    </td>
  </tr>
</table>

## Deployment

This app was deployed to Heroku and can be accessed from <a href="https://okra2.herokuapp.com/v1/ping">HERE</a> ✨✨✨✨✨✨

## Stay in touch

- Author - [Andrew Okoye](https://www.linkedin.com/in/andrew-okoye-281261132/)
