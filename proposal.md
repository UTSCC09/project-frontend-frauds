# Proposal 

## Project Title

Air Toronto
## Team Members

- Payam Yektamaram (1005035622)
- INSERT PERSON
- INSERT PERSON
## Description of the Web Application

A comprehensive web application that allows customers to book plane tickets to their destination of choice. Furthermore, customers can choose their plane seats using a visual set map of the plane and then pay through Stripe.

Airline agencies, have special privileges, in which they can add flights to the system so customers can purchase them. Furthermore, agencies can issue live updates about a  flight's status which will be broadcasted to the customers to inform them of the news.

## Concepts Used for Challenge Factor (CF)

### Required Elements
- Vue Frontend
- Deployed to DigitalOcean Linux VMs (Droplets) 
- 
  
### Obtaining 1.0 CF
- OAuth 2.0 Client
- Webhooks for flight changes/alerts
- Workers that send emails after one hour of account registration
### Exceeding 1.0 CF

- Secure continuous deployment of docker containers to DigitalOcean Droplets using Github Actions and SSHing into the linux containers

## Beta Version Features

- Allowing airline agencies to add flights into the system
- OAuth2 integration
- Account creation, log-in, log-out
- Send welcome email one hour after account creation
- Continuous deployment pipeline through Github Actions
- Deployment to DigitalOcean Droplets
## Final Version Features

- Allow customers to purchase flights
- Allow customers to choose their seats through a visual seat map
- Allow customers to view their purchased tickets
- Allow airline agencies to issue changes/alerts to their flights
- Stripe integration for purchasing tickets
## Tech Stack

- Vue (Frontend)
- NodeJs with Express Server (Backend)
- MongoDb (Database)
  
## Deployment

-  DigitalOcean Container Registry to store docker images
-  DigitalOcean Droplets to run applications on a Linux VM 
-  MongoDB Cloud Atlas instances for NoSQL database