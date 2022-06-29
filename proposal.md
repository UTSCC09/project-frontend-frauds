# Proposal 

## Project Title

Air Toronto
## Team Members

- Payam Yektamaram (1005035622)
- Ling Su (1005001597)
- Hai Yang Gu (1004923265)

## Description of the Web Application

A comprehensive web application that allows customers to book plane tickets to their destination of choice. Furthermore, customers can choose their plane seats using a visual seat map of the plane and then pay through Stripe.
However, it is crucial to note that our application doesn't own and manage a fleet of airplanes but instead shows tickets that other airline agencies have to offer. So the website will be operating similarly to Expedia.ca.

Therefore airline agencies/agents, have special privileges in which they can add flights to the system so customers can purchase them. Furthermore, agencies can issue live updates about a  flight's status which will be broadcasted to the customers to inform them of the news.

Our app will also be utilizing public domain flight data by https://ourairports.com/ which will empower our app to validate flight routes and ensure flights are using the proper aircraft.

## Concepts Used for Challenge Factor (CF)

### Required Elements
- **Frontend Framework:** Vue.js
- **Non-CRUD Feature:** Generate and Email PDF Receipt with Booking Details
- **VM Deployment:** DigitalOcean Linux VMs (Droplets) 
  
### Obtaining 1.0 CF
- OAuth 2.0 Client
- Webhooks for flight changes/alerts
- Workers that send emails after one hour of account registration
### Exceeding 1.0 CF

- Secure continuous deployment of docker containers to DigitalOcean Droplets using Github Actions and SSHing into the linux containers

## Beta Version Features

- OAuth2 integration
- Allowing airline agencies to add flights into the system
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
- Generation of PDF invoice and send email after purchase
## Tech Stack

- **Frontend:** Vue 3
- **Backend:** NodeJS with Express Server
- **Database:** MongoDB
  
## Deployment

-  DigitalOcean Container Registry to store docker images
-  DigitalOcean Droplets to run applications on a Linux VM 
-  MongoDB Docker Image run on a Linux VM
-  Github Actions workflow to manage and initiate deployments
