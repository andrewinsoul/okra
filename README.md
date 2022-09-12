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

- Create a .env file that matches with the template of .env.sample (The value of the USER_EMAIL & USER_PASSWORD should be the value of the credentials you used to signup in the first step. The value of OTP should be 12345)

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
  </tr>
  <tr>
    <td>GET</td> 
    <td>/v1/ping</td>  
    <td>Ensures the server is working without making any api call that calls the database</td>
  </tr>

  <tr>
    <td>GET</td> 
    <td>/v1/auth</td>  
    <td>Scrapes auth information and saves to database</td>
  </tr>
  <tr>
    <td>GET</td> 
    <td>/v1/customer</td>  
    <td>Scrapes customer information and saves to database</td>
  </tr>

  <tr>
    <td>GET</td> 
    <td>/v1/account</td>  
    <td>Scrapes account information and saves to database</td>
  </tr>
  <tr>
    <td>GET</td> 
    <td>/v1/transaction</td>  
    <td>Scrapes transaction information and saves to database</td>
  </tr>
</table>

## Deployment

This app was deployed to Heroku and can be accessed from <a href="https://okra2.herokuapp.com/v1/ping">HERE</a> ✨✨✨✨✨✨

## Stay in touch

- Author - [Andrew Okoye](https://www.linkedin.com/in/andrew-okoye-281261132/)
