# Proposal 

## Project Title

Air Toronto
## Team Members

- Payam Yektamaram (1005035622)
- INSERT PERSON
- INSERT PERSON
## Description of the Web Application

A comprehensive web application that allows customers to book plane tickets to their destination of choice. Customers can choose their plane seats using the visual set map of the plane and then make pay for their tickets by using their credit card or debit card powered by Stripe.

Airline agencies, have special privileges, in which they can add flights to the system so customers can purchase them.

Furthermore, agencies can issue live updates about a  flight's status which will be broadcasted to the customers to inform them of the news.

## Concepts Used for Challenge Factor (CF)

### Required Elements
- Vue Frontend
- Deployed to Amazon Cloud Compute Instances (EC2) Instances
- Workers that send emails after one hour of account registration
  
### Obtaining 1.0 CF
- OAuth 2.0 Client
- Webhooks for flight changes/alerts

### Exceeding 1.0 CF

- Secure continuous deployment of docker containers to Amazon Cloud Compute Instances using Amazon Cloud Deploy

## Beta Version Features

## Final Version Features

## Tech Stack

- Vue (Frontend)
- NodeJs with Express Server (Backend)
- MongoDb (Database)
  
## Deployment

-  Amazon Elastic Container Registry (ECR) to store docker images
-  Amazon Elastic Compute Cloud (EC2) to run applications from ECR
-  Amazon Code Deploy to deploy docker image from ECR to EC2 instances
-  MongoDB Cloud Atlas instances for database storage