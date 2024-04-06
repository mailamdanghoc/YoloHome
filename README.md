# Yolo:Home

> [!WARNING]
> This project is under development

Welcome to Yolo:Home.

## Overview

Yolo:Home is a smart home service. It manages the conditions of the house environment such as temperature, humidity, lighting, etc. It also allows you to control your household devices like lights and fans.

## Technology Stack

- Front-end: ReactJS, Tailwind CSS.
- Back-end: NodeJS, ExpressJS.
- Database: MongoDB.
- Additional Technologies: MQTT protocol

## Installation

To use the application, you can follow the following steps:

### Clone the repository

Open a terminal at a directory of your choice and enter these commands (change the folder name if you want to):

```bash
  git clone https://github.com/quancao2310/YoloHome.git
  cd YoloHome
```

Inside **YoloHome** folder, you will see two subfolders: _frontend_ and _backend_.

### Install dependencies

First, if you haven't installed [NodeJS](https://nodejs.org/), please visit https://nodejs.org/ and download it.

Next, you will have to install all the dependencies of our project. Let's go to the "backend" directory first and enter these commands:

```bash
  cd backend
  npm i
```

Then, go to the "frontend" directory and do the similar thing:

```bash
  cd frontend
  npm i
```

You have installed all the dependencies.

### Set up a database server

The application also needs a MongoDB server. Install one or use the Atlas service, whatever you prefer. Then create a database named "YoloHome" and save the URI.

### Set up the environment

<!-- #### Frontend Environment -->

#### Backend Environment

Create a file named **.env** at the top of the "backend" directory. Add the following environment variables:

```bash
# Backend information
BACKEND_PORT=3001

# Database information
DB_URI=# Your database URI

# Adafruit.IO Services
ADAFRUIT_IO_USERNAME=# Your Adafruit.IO username
ADAFRUIT_IO_KEY=# Your Adafruit.IO key

# Frontend information
FRONTEND_URL=http://localhost:3000
```

You are ready now. Let's start the application.

### Run the application

Start two terminal instances in the **YoloHome** directory. For the first instance, run these commands:

```bash
  cd backend
  npm run dev
```

For the second one, run these commands:

```bash
  cd frontend
  npm run dev
```

The application should be starting. The ReactJS application will run on http://localhost:3000 and the Express application will run on http://localhost:3001.

You are now ready to explore our application!

## Contributor

This project is developed by a group of 5 students from the Faculty of Computer Science and Engineering (CSE), Ho Chi Minh University of Technology (HCMUT).
