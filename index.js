const fs = require('fs'); 
const inquirer = require('inquirer');
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const workers = []; 
let manager; 
let companyName; 


function managerData() {
    inquirer.prompt([
        {   
            type: "input",
            message: "What is the name of this team/project?",
            name: "companyName"
        },
        {  
            type: "input",
            message: "Who is the manager of this project?",
            name: "managerName"
        },
        {  
            type: "input",
            message: "What is the manager's ID?",
            name: "managerID"
        },
        {   
            type: "input",
            message: "What is the manager's email?",
            name: "managerEmail"
        },
        {
            type: "input",
            message: "What is the manager's office number?",
            name: "officeNumber"
        }]).then(managerAnswers => {
            manager = new Manager(managerAnswers.managerName, managerAnswers.managerID, managerAnswers.managerEmail, managerAnswers.officeNumber);
            companyName = managerAnswers.companyName;
            console.log("Employee information part")
            EmployeeData();
        });
}

function render(employee) {
    if (employee.getRole() === "Intern") {
        var internCard = fs.readFileSync('./src/Intern.html', 'utf8');
        internCard = internCard.replace('{{name}}', employee.getName());
        internCard = internCard.replace('{{role}}', employee.getRole());
        internCard = internCard.replace('{{id}}', employee.getId());
        internCard = internCard.replace('{{email}}', employee.getEmail());
        internCard = internCard.replace('{{school}}', employee.getSchool());
        return internCard;
    } else if (employee.getRole() === "Engineer") {
        var engineerCard = fs.readFileSync('./src/Engineer.html', 'utf8');
        engineerCard = engineerCard.replace('{{name}}', employee.getName());
        engineerCard = engineerCard.replace('{{role}}', employee.getRole());
        engineerCard = engineerCard.replace('{{id}}', employee.getId());
        engineerCard = engineerCard.replace('{{email}}', employee.getEmail());
        engineerCard = engineerCard.replace('{{github}}', employee.getGithub());
        return engineerCard;
    }
}

function EmployeeData() {
    inquirer.prompt([
        {
            type: "list",
            message: "What is this employee's role?",
            name: "employeeRole",
            choices: ["Intern", "Engineer"]
        },

        {
            type: "input",
            message: "What is the employee's name?",
            name: "employeeName"
        },
        {
            type: "input",
            message: "What is the employee's id?",
            name: "employeeId"
        },
        {
            type: "input",
            message: "What is the employee's email?",
            name: "employeeEmail"
        },
        {
            type: "input",
            message: "What is the Engineer's Github?",
            name: "github",
            when: (userInput) => userInput.employeeRole === "Engineer"
        },
        {
            type: "input",
            message: "What's the Intern's school?",
            name: "school",
            when: (userInput) => userInput.employeeRole === "Intern"
        },
        {
            type: "confirm",
            name: "newEmployee",
            message: "Would you like to add another team member?"
        }
    ]).then(answers => {
        if (answers.employeeRole === "Intern") {
            const employee = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.school);
            workers.push(employee);
        } else if (answers.employeeRole === "Engineer") {
            workers.push(new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.github));
        }
        if (answers.newEmployee === true) {
            EmployeeData();
        } else {

            var main = fs.readFileSync('./src/main.html', 'utf8');
            main = main.replace(/{{companyName}}/g, companyName);

            var managerCard = fs.readFileSync('./src/Manager.html', 'utf8');
            managerCard = managerCard.replace('{{name}}', manager.getName());
            managerCard = managerCard.replace('{{role}}', manager.getRole());
            managerCard = managerCard.replace('{{id}}', manager.getId());
            managerCard = managerCard.replace('{{email}}', manager.getEmail());
            managerCard = managerCard.replace('{{officeNumber}}', manager.getOfficeNumber());

            var cards = managerCard; 
            for (var i = 0; i < workers.length; i++) {
                var employee = workers[i];
                cards += render(employee);
            }

            main = main.replace('{{cards}}', cards);

            fs.writeFileSync('./dist/team.html', main);

            console.log("The team.html has been generated in output");
        }
    });
}

function init() {
    managerData();
}

init();