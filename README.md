# server
## Install Node JS
Go to this link and install node js to your local machine.
https://nodejs.org/en/download/
LTS version should be good.
We use Node JS to write our backend so this step is essential.

## Install Visual Studio [Recommended]
You may use visual studio to manage or run the code in the terminal inside visual studio. 
Go to this link and you can download a free community version 
https://visualstudio.microsoft.com/downloads/

## Clone the repo to your local machine
![pic4](https://user-images.githubusercontent.com/45025867/120817394-86625900-c506-11eb-9e2a-d306bd3cad2d.jpg)
### Option 1:
Use your terminal and go to the folder where you want to clone the repository. 
And copy the link by clicking on the button circled with red lines.
In your terminal , write :
git clone [link]
where link here is https://github.com/ImPerfectionProj/server.git.
So it should be:
git clone https://github.com/ImPerfectionProj/server.git

### Option 2:
Simply download a zip version and unzip it locally. The codes are then all copied to your local machine as well.

## Install Packages
Use terminal to go to the server folder that you cloned.
Then in the terminal write `npm install` to install all the packages required for backend. 
If you don't run this, errors will pop up.

## Database 

### Database Environment Set up
We use MongoDB to store our fake data. The location of the data is in Organization "MyProjects" under Project "imperfection." Below is a screen shot of the page you will see after you get into the project.
![Picture1](https://user-images.githubusercontent.com/45025867/120812942-4ef1ad80-c502-11eb-80bf-d91050b9f6be.jpg)

- Click on the "COLLECTIONS" circled with green to go to view or edit the raw data stored in the database. 
- Click on "Database Access" circled with red under "SECURITY" to edit user access to database. The following screenshot shows what you will see after you click on it.

![pic2](https://user-images.githubusercontent.com/45025867/120814046-54032c80-c503-11eb-914d-561cb781f19a.jpg)

Using this information, you will need to create `.env` file in the folder "server." This file is essential for you to connect our backend to database. 
You have to put the following line into the `.env` file:
MONGODB_URI=mongodb+srv://root_wws:VYe9XKac4XC0M3G0@cluster0.vuzfz.mongodb.net/development?retryWrites=true&w=majority

However, in the future, please create your own mongoDB uri because this information is very secret and if others have access to this url, they can change the database without your or admins' permission. 
In the future if you have your new project, you will need to add new database users by clicking on the button circled with red line and edit the user privileges. 

- Click on "Network Access" circled with red under "SECURITY" to add or update your IP address. MongoDB needs to know your IP address as well before you can connect server to the database.
- ![pic3](https://user-images.githubusercontent.com/45025867/120815116-66319a80-c504-11eb-981c-47d81fe3f733.jpg)

### Create Your Own Database [future]
In the future, you may want to set up your own organization and project to manage the dataset. We use free Atlas provided by MongoDB.
Please take a look at this instruction to get started: https://docs.atlas.mongodb.com/getting-started/. 

## Run backend code

Use terminal to go to the server folder and in the terminal write `node app`. This will start the backend. You will see the last line printed in terminal is "App running on 8000" which means the backend is running successfully.

Note: You need to run backend before or when you are running our frontend codes. Frontend needs to  connect to backend to send or receive the data from MongoDB.


# Some Simple Terminal Command
`cd [folder_name]`  - go to the folder named folder_name

`cd ..`             - go to the parent directory

`ls`                - list all the files stored in the current folder


