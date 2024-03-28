<div align="center">
    
# Path Pilot

</div>


## Keywords

Section 4, ReactJS, Python, Web Application, Day-Trip Planning Tool

## Project Abstract

Path Pilot is an online program made specifically for the user who knows they want to take a day trip in Philadelphia but is overwhelmed by all the activity options the city has to offer. The application allows users to select different types of places they would like to visit on their trip (including coffee shops, picnic spots, thrift shops, museums, farmer’s markets, and playgrounds), select an optional starting location, select other optional criteria (i.e. open at a specific time, kid-friendly, etc.), and the program will return an optimized path for the user to take that includes all the user’s desired locations. These returned “strolls” ensure that the user’s stops are within a short walk (less than ten minutes) or on the same city block of one another, so the user can make the most of their time in the city without spending excessive amounts of time on transportation from place to place. As an alternative to selecting specific types of desired locations, the users can use Path Pilot’s AI-powered functionality to input a general idea of how they would like to spend their day (i.e. “a relaxing afternoon in the city”) and the system will provide them an optimized path based on their input. The user can choose to view their path and details about each selected location in two different formats: a list of the locations or a map of Philadelphia with each location marked and the route shown between the spots.

## High Level Requirement

This program allows users to plan a day trip in Philadelphia while removing the stressful decision of having to pick specific destinations. Instead, the burden of making plans is taken off the user and placed on the system: by allowing users to input how they would like to spend their day, Path Pilot will simply provide to them an optimized stroll based on the types of locations the user would like to go. Upon navigating to the site, the user is greeted by a welcome screen where they can log into the application, which allows them to save their past trips. From there, the user can begin to select requirements for their trip. Options to choose different location types and different starting location preferences (such as next to public transportation stops or next to the user’s hotel) will be displayed, as well as the option to plan the trip within a certain Philadelphia neighborhood/zip code. The user will then hit a search button to generate their personalized, optimized trip. Two options to view the results are offered, a list showing all the selected destinations and a map with markers reflecting all the locations and route planned. Hovering over each marker on the map will show the name and details about the spot that was picked for their stroll. In addition to the core functionality of providing the user an optimized path based on selected location types, the system allows the user to further specify features for their trip that will affect the route/plan they are provided. If the user inputs date and time information related to their trip, the program can reflect when the user is planning for the trip to take place and pick spots appropriately that will be open at that time to prevent any confusion. Another feature allows the user to choose from certain “tags” to better describe their trip, including whether they want “accessible” or “kid-friendly” options, or if they are looking for a “romantic” atmosphere. Upon selecting these tags, when the user presses “search” to generate their route, the selected locations will attempt to fulfill these criteria, alerting the user whether they do or do not. As an alternative to the basic option selection feature (allowing the user to select desired location types, location attributes, etc.), Path Pilot allows for the user to simply input a statement, such as, “I want to have a relaxing afternoon in Center City” or, “I am going on a first date”; using an OpenAI- powered response, the system will then be able to take the user’s statement and craft a day trip for them, providing the same locations list and map route viewing options as the default user selection-based offering. This further lessens planning difficulties for the user, allowing them to input an abstract idea of how they want to spend their day and get back a concrete plan of specific locations to visit that are a short walk from one another. With Path Pilot, no longer will a user have to look up each spot they want to visit separately and sort through hundreds of options in the city, worry about transportation between the places, what places will be open, or how far everything is from each other. Instead, they can simply select each type of place they would like to go to along with the day and time and the program will craft a plan for them.

## Conceptual Design

Path Pilot is being developed on and for Windows 11/MacOS operating systems, and the application does not require any additional hardware other than a computer and access to the internet. The product’s architecture contains three major components: a ReactJS, HTML, CSS frontend, a python backend, and third-party APIs that are called both to assist the backend logic and provide an accurate, aesthetically pleasing map for the user’s optimal path on the frontend. The frontend UI will consist of selection boxes where the user selects which location types they would like to visit, what time they would like to plan their trip (optional for the user), and where they would like their trip to start from (i.e. near a subway stop, also optional for the user), as well as any additional requirements set by the user; it will also have a search button to submit their query. Once the query is entered, the user’s request will be sent to a Python backend which will search through the available data to compile a list of trip location stops. The list will contain one location per location category, with each separate location being on the same city block or within a set range of distance (kept as small as possible). This list will be compiled in the data selection class and then that data will be sent to the frontend where it can be displayed via the Google Maps JavaScript API, which will be integrated into the frontend display to reflect the returned stroll option. This API allows a version of Google Maps to be shown on the application, with markers reflecting locations provided and a route drawn between the different spots. Every location on the list for that stroll will be displayed via a red marker. The name of each location picked for the stroll currently being reflected on the map will show when the user hovers over the marker. The OpenAI component will consist of a textbox on the frontend that the user can type into and then submit their query with the search button. To design and carry out the backend path finding logic, an extensive amount of data on Philadelphia locations and streets will be used. A select amount of this location data is available through open source .csv files, including information on coffee shops, trail heads, museums, picnic spots, playgrounds, and farmer’s markets. This data will be utilized for the program when these location types are desired on a path. Other commonly desired locations will be added as well, such as bagel shops, thrift stores, ice cream shops, bookstores, and more. As this data is not currently in any public .csv file, it (as well as any supplementary information to support the .csv data) will be collected via public APIs; intended APIs to be called include the Yelp API (business information and reviews) and/or the Google Places API (location details). These APIs will be called to find appropriate locations within the designated search location (chosen by the system or the user). In case the APIs and the .csv files are not able to provide all the necessary information, data can also be collected through web scraping of digital yellow pages or a similar site using a Python web scraping script. The web scraping, data collection, and data selection, as well as connection to the front-end display will all need to occur in separate classes to ensure that the processes are kept organized. Optimal routing details between locations will then be found using the help of the Google Maps Routes API (or an equivalent API).

## Background

For a long time, people have loved to organize day trips, especially in cities like Philadelphia. However, as social media has grown, and cities have gotten larger, the options of spots to go have seemingly grown as well. No one person knows every place in the city, and lots of tourists and locals alike may have no idea where to go in the city for a short visit. These demographics need a resource that can plan a day trip for them, within one central walking location, including each type of place they would like to visit on their trip. The organization of the trip is taken out of their hands, and they are left with a simple, cohesive course of action that includes each of the activities that they originally planned to do. There are a lot of applications that allow you to enter locations and addresses and then the application maps your trip. Many of these are mainly marketed for road trips to add stops on a route. However, there is currently no application that allows for the selection of multiple location types and will then pick for you both the spots to visit and an optimized path to travel. For existing applications, the user must know exactly where they want to go already, something that can be difficult for a user not familiar with the city or looking to try new places. They also will need to keep track of which locations are near each other in order to create an optimal, walkable trip. Where Google Maps and Apple maps provide users the ability to search a location type (coffee shop, museum, etc.) and then display markers of where each of these locations are on a map, these services will only do this for one location type at a time; users then need to keep track of options in their head or on paper while looking for spots near each other. Path Pilot takes this tedious organization away and instead searches for all desired location types at once, returning only collections of them that are near each other; it simplifies the user’s experience and helps the user avoid decision paralysis as the result of too many options. Furthermore, Path Pilot benefits the user compared to other mapping services by including the option for the planned outings to be located near a spot of public transport, such as a regional rail or subway station. This will help users who do not have a car or do not want to spend money on an Uber be able to plan accessible trips that won’t be hard to reach. This program could also be expanded upon to include multiple spots of one location type. This would be helpful for a trip to multiple farmer’s markets, a bar crawl, or historical/museum-based trip.

## Required Resources

The background knowledge needed for this project requires experience with Python, specifically using the language to work with .csv data, to make API calls, to connect a frontend architecture to a backend architecture, and to web scrape. It also requires knowledge with frontend languages and frameworks, in this case ReactJS, HTML, and CSS, to create the frontend view and utilize the Maps API to plot users’ returned paths. To develop this project, access to a variety of APIs is required. The Google Maps Routes costs 0.004 dollars per query ($4 per 1000 queries for the basic version). The Google Maps JavaScript API costs 0.007 dollars per map load ($7 per 1000 loads). The Google Maps Places API costs between 0 dollars and 0.040 dollars per call ($40 per 1000 call) depending on the endpoint used. The Yelp API is free to use, with a basic rate limit of 500 calls per day. If funds for Google Map Platform APIs cannot be acquired, possible alternatives such as OpenStreetMap and its applicable APIs would have to be investigated. However, as this data is community collected and organized, it may not be as up-to-date or accurate as the commercial API options.

## How To Run Path Pilot

### Install Python and Node.js if you haven't
Node.js is a JavaScript runtime environment that allows you to run JavaScript code outside of a web browser. It's commonly used for building server-side JavaScript applications and also for front-end development, especially when working with tools like ReactJS, which rely on Node.js for development tasks such as package management and build processes.

### 1. Install pip if don't have it
pip is pythons package manager and allows you to download packages easily from the command line.

### 2. set up your virtual environment *VERY IMPORTANT* 
In Python, a virtual environment is a self-contained directory tree that contains a Python installation for a particular version of Python, plus a number of additional packages. This allows you to work on multiple projects with different dependencies without them interfering with each other.

command line:
 pip install virtualenv
go to path pilot project directory and create your virtual environment. In command line type: 

#### virtualenv pathPilot
(pathPilot is the name I used for my env, you can name it whatever)

activate your virtual environment by typing 

Windows:
pathPilot\Scripts\activate

You may need to execute this command first:  
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser 

Mac:
source pathPilot/bin/activate

You will now notice your directory looks different (Notice the (pathPilot) at the beginning). This is you are now inside and working in your virtual environment. This is where you will install all your packages and do all the work on Path Pilot.

Whenever you are done coding, you can type "deactivate" in the command line and return to your system's default environment.

### 3. Install Necessary Packages

**Inside your virtual environment, install these required packages**

pip install django

pip install react

pip install djangorestframework 

pip install django-cors-headers 

**inside your virtual environment, within the "myapp" directory** 

npm install axios

npm install react-router-dom 

*Django Rest Framework - this is used to build API endpoints*

*Django-cors-headers - this is middleware for handling CORS (cross-origin resource sharing headers) to prevent cross-origin requests. security thing*

*Axios - this is a Javascript library used for making HTTP requests from browser or Node.js*

*react-router-dom - this is a package that allows routing in react applications* 

### 4. Run the Project

open two terminal windows (both on the your virtual environment)

**In the first window, navigate to the myproject directory and run the following command**

python manage.py runserver

**In the second window, navigate to the myapp directory and run the following command**

npm start

This will start the React development server. Open your web browser and navigate to http://localhost:3000/

For login screen navigate to http://localhost:3000/login