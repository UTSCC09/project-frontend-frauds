# Proposal (Final Project)

## Project Title

Air Toronto

## YouTube Link (Presentation)

https://www.youtube.com/watch?v=FM2_42rOM-A


## Application Documentation 

For application specific documentation on our REST APIs, workflows, and architecture please visit our [Notion file](https://earthy-tie-37e.notion.site/Air-Toronto-cb801fbaaced466a9bb29fe44459194b).

## Team Members

- Payam Yektamaram (1005035622)
- Ling Su (1005001597)
- Hai Yang Gu (1004923265)
## Description of the Web Application

A comprehensive web application that allows customers to book plane tickets to their destination of choice. Furthermore, customers can choose their plane seats using a visual seat map of the plane and then pay through Stripe.

However, it is crucial to note that our application doesn't own and manage a fleet of airplanes but instead shows tickets that other airline agencies have to offer. So the website will be operating similarly to Expedia.ca.

Therefore airline agencies/agents, have special privileges in which they can add flights to the system so customers can purchase them. Furthermore, agencies can subscribe to flight events like when a booking occurs to receive instantaneous notice of it through the usage of webhooks.

Our app will also be utilizing public domain flight data by https://openflights.org/data.html which will empower our app to validate flight routes and ensure flights are using the proper aircraft.


## Concepts Used for Challenge Factor (CF)

### Required Elements
- **Frontend Framework:** Vue.js
- **Non-CRUD Feature:** Generate and Email PDF Receipt with Booking Details
- **VM Deployment:** DigitalOcean Linux VMs (Droplets) 
  
### Obtaining 1.0 CF
- **OAuth 2.0 Client:** Using Google as Oauth2.0 provider to access user's name and email
- **Webhooks:** Broadcast webhooks to send notifications for flight changes/alerts
- **Workers:**  Used to send emails after one hour of account registration welcoming the user, used to process webhooks, and to send booking emails as they occur

## Beta Version Features

- OAuth2 integration
- Allowing airline agencies to add flights into the system
- Account creation, log-in, log-out
- Send welcome email one hour after account creation using workers
- Continuous deployment pipeline through Github Actions
- Deployment to DigitalOcean Droplets
  
## Final Version Features

- Allow customers to purchase flights
- Allow customers to choose their seats through a visual seat map
- Allow customers to view their purchased tickets
- Allow airline agencies to listen to flight events through the use of webhooks
- Stripe component integration for purchasing tickets
- Generation of PDF invoice and send email after purchase
## Tech Stack

- **Frontend:** Vue 3
- **Backend:** NodeJS with Express Server
- **Databases:** MongoDB, Redis for Async Task Queue
  
## Deployment

-  DigitalOcean Container Registry to store docker images
-  DigitalOcean Droplets to run applications on a Linux VM 
-  MongoDB Docker Image ran on a Linux VM
-  Github Actions workflow to manage and initiate deployments
-  Nginx as a reverse proxy and for HTTPs management
