Coding Challenge Guideline
The coding challenge is deploying a full-stack web application using Docker, AWS ECS, Terraform, and Jenkins for CI/CD. The project involves several steps, starting from environment setup to application deployment and automation with Jenkins. Here’s a high-level overview:

Environment Setup
Technologies Involved: Node.js, Terraform, Docker, Gitbash, VSCode.
Purpose: Prepares the local development environment with necessary tools and software.

Project Setup
Technologies Involved: Git, SSH.
Purpose: Configures access to GitHub for source code management and pulls a specific repository for the challenge.

Dockerization
Technologies Involved: Docker.
Purpose: Containerizes both the frontend and backend applications to ensure consistency across different environments and ease of deployment.

Manual Jenkins Server Setup on AWS
Technologies Involved: AWS (EC2, Elastic IP), Docker.
Purpose: Sets up Jenkins on an AWS EC2 instance for Continuous Integration and Continuous Deployment (CI/CD).

Use of Terraform for ECS Deployment
Technologies Involved: Terraform, AWS ECS, AWS IAM, AWS ECR.
Purpose: Utilizes Terraform to provision AWS resources, including ECS for container orchestration, IAM for permissions, and ECR for Docker image storage.

Configuring Jenkins & Creating a Jenkinsfile for Automation
Technologies Involved: Jenkins, Docker, AWS CLI.
Purpose: Automates the deployment process using Jenkins Pipelines, which includes building Docker images, pushing them to ECR, and updating ECS services.

Key Steps:


Environment Setup: Installing essential tools like Node.js, Terraform, Docker, and configuring the development environment.


Checking Environment Setup: Verifying the correct installation of Node.js, npm, Terraform, and Docker.


Project Setup: Setting up SSH keys, cloning a specific repository for the coding challenge, and preparing for the Dockerization process.


Dockerizing Applications: Creating Dockerfiles for both backend and frontend parts of the application, building Docker images, and running containers to test connectivity.


Manual Setup of Jenkins Server on AWS: Launching an EC2 instance for Jenkins, configuring networking, installing Docker, and running Jenkins inside a Docker container.


Using Terraform for ECS Deployment: Detailed steps to use Terraform for provisioning AWS ECS resources, including ECS cluster setup, IAM roles, task definitions, ECS services, VPC configuration, and setting up an Application Load Balancer.


Configuring Jenkins & Creating a Jenkinsfile for Automation: Steps to install necessary plugins in Jenkins, add credentials, write a Jenkinsfile to automate the building, pushing, and deployment process using AWS ECS, and configuring Jenkins container to support Docker and AWS CLI commands.



Conclusion
This project is a full-cycle deployment setup that includes development environment preparation, application containerization, infrastructure provisioning using Terraform, and automated deployment using Jenkins CI/CD pipelines. It leverages Docker for container management, AWS ECS for container orchestration, Terraform for infrastructure as code, and Jenkins for automation of the build and deployment process.

Step 1: Environment Setup


Install Node.js: Download and install Node.js (preferably version 16 as the frontend and backend were last tested with this version) from nodejs.org. If you're using macOS or Linux, you can also use your package manager for the installation. Ensure npm is installed by running npm -v in your terminal.


Install Terraform: Follow the instructions on HashiCorp’s website to install Terraform for your OS.



Watch the video YouTube video below to know how to properly install and configure Terraform in the operating system that you're using

Windows: Terraform Setup
Mac: Terraform Setup

Install Docker: Download and install Docker Desktop from the official Docker documentation. Choose the installer based on your operating system:


Windows
MacOS
Ubuntu



Install Gitbash


Install VSCode



Step 2: Check Environment Setup


Node.js: Open your terminal or command prompt and type the following command to check the version of Node.js installed on your system:


node -v


This command will display the version of Node.js if it's installed. For your project, you should have version 16 or a version that's compatible with the frontend and backend applications.


npm: To check if npm (Node Package Manager) is installed, type the following command in your terminal:


npm -v


This will show the version of npm installed. npm is installed with Node.js, so if Node.js is on your system, npm should be as well.

Terraform: To verify if Terraform is installed and to check its version, enter the following command:


terraform -v


This command will print the Terraform version. You need Terraform for writing and applying infrastructure as code, which is crucial for provisioning the AWS resources required for your project.

Docker: To check if Docker is installed and running, you can use the following command:


docker -v



Step 3: Project Setup

Go to github and go to your settings and look for "SSH and GPG keys and under "SSH Keys" click on "New SSH Key"
In your terminal type in


ssh-keygen -t ed25519 -C "your_email@example.com"



Press "enter" for every prompt that comes up and look for the confirmation that your key was created
you will need to content inside your public key. After your key is created you will see in your terminal something that says "your public key has been saved in "this is the location of your public key". You will need to use the "cat" command and then type in the location of your public key next


cat "location of your public key"
Here is an example

cat /c/Users/micha/.ssh/id_ed25519.pub



Copy the output of your public key, go back to github and insert what you copied into the box under "key". Add a title and click "Add SSH key"


Now that you set your SSH key, you can now pull the repository we need for the coding challenge.


Create a new directory for the coding challenge and pull the repository you need for the challenge. Do this by using the commands below:


mkdir coding_challenge
git init
git pull git@github.com:Team-LightFeather/devops-code-challenge.git



Create a repository in GitHub and push the code you just pulled into that new respository


Go on github and create a new repository
Go to your newly created repo and look for something that says something similar to "git remote add origin" and copy that command
Go back to your terminal and paste that inside
type in:


git add .
git commit -m '1st commit'
git push --set-upstream origin main


That should've pushed your directory on your local machine with the code we pulled from GitHub into our newly created repository.

Step 4: Dockerize Applications & Run it Locally

Dockerize the Backend


Navigate to the Backend Directory: Change into your project's backend directory where the package.json file is located.


Create a Dockerfile: Inside the backend directory, create a new file named Dockerfile (without any extension).


Edit the Dockerfile: Open the Dockerfile in VSCode and add the following content:



# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm ci --only=production

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variables
# ENV NODE_ENV=production

# Run npm start when the container launches
CMD ["npm", "start"]


This Dockerfile:

Starts with a lightweight version of Node (Alpine image for Node 16).
Sets the working directory inside the Docker container.
Copies the backend application code into the container.
Installs the application dependencies without installing packages meant for development.
Exposes port 8080 to the outside world.
Runs npm start to start the backend application.


Build the Docker Image:
From the terminal, within the backend directory, build your Docker image using the following command. Replace your-backend with a name for your backend image:

docker build -t your-backend .



Dockerize the Frontend
Repeat the process for the frontend application:


Navigate to the Frontend Directory: Change to your project's frontend directory where the package.json file is located.


Create and Edit a Dockerfile: As with the backend, create a Dockerfile in the frontend directory and fill it with a similar content, adapted for the frontend specifics:



# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm ci --only=production

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run npm start when the container launches
CMD ["npm", "start"]


The key difference here is typically the exposed port, which is commonly 3000 for frontend applications.

Build the Docker Image:
Similarly, build your Docker image for the frontend, replacing your-frontend with a name for your frontend image:

docker build -t your-frontend .



Run the Containers and Test Connectivity


Run the Backend Container: Replace "your-backend" with the name of your backend image. To see all of the images you've built type this in the terminal


docker images


This will show you the images that you have on your local machine
To run the container you will need to type this in the terminal

docker run -p 8080:8080 your-backend


This command runs the backend container and maps port 8080 inside the container to port 8080 on your host machine.


Run the Frontend Container: Similarly, start the frontend container, ensuring you replace "your-frontend" with the name of your frontend image.


docker run -p 3000:3000 your-frontend


This maps port 3000 inside the container to port 3000 on your host, allowing you to access the frontend application by visiting http://localhost:3000 in a web browser.

Troubleshooting
If the frontend cannot communicate with the backend, check network configurations and ensure both containers can reach each other. Docker's default network should allow this, but specific configurations may vary.


Logs from running containers can provide valuable insights into any issues.


By following these steps, you'll have both your backend and frontend applications containerized and running in Docker, ready for further development, testing, or deployment stages.

Step 5: Manual Setup Jenkins Server on AWS

Create an EC2 instance

Use the settings below to configure your AWS EC2 Instance


Name: Jenkins Server
AMI: Ubuntu Server 22.04 (Free Tier Eligble)
Instance Type: t2.medium
Create a key pair and name it whatever you want. The private key file format should be .pem
Network Settings
Enable: HTTP
Enable: HTTPS
Enable: Port 8080
Configure Storage = 20 Gib


Launch your instance after setting up the configuration above and connect to your instance after it's up and running.


Create an Elastic IP and Associate it With Your Jenkins Server

The reason you want to create an elastic IP is that you want your Jenkins server IP Address to be the same. Normally if you don't have an Elastic IP Address associated with an EC2 server, when you shut it down and start it back up again, a you'll receive another random IP address. You want the IP Address to be the same for this use case.


Go to the EC2 dashboard in the AWS console. and on the lefthand side click on "Elastic IPs" under the tab of "Network & Security"
Click on "Allocate Elastic IP Address" and then click on "Allocate"
Wait to see the green bar at the top that says "Elastic IP Address Allocated Successfully.
Then click on "Associate this Elastic IP Address" to the top right of the green bar. In the next page under the "instance" section, click on "Choose an instance" & select your instance name (Jenkins Server).


Install Docker and run a Jenkins Container on the AWS EC2

update your package manager using the command below:


sudo apt update && sudo apt-get update



Install Docker using the command below:


sudo apt install docker.io



Run the jenkins container using the command below:


docker run -p 8080:8080 -p 50000:50000 -d -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts



You should see docker pulling the docker image and running the container. After it completes, you should see a string of characters. If you see that, that means the Jenkins container is running.


Confirm that the Jenkins Container is running and connect to the Jenkins UI.


Type in the commands below to check to see if the Jenkins container is running:


docker ps -a



you should see some information about your Jenkins container after typing that command. If you do, the next thing you need to do is connect to your Jenkins application.


At the bottom left of your screen, you should see your server's public IP address. Copy the IP address and open up another web broswer and paste it in and add a semi colon and "8080" to connect to the Jenkins server. Below is an example of how it should look in your URL.

3.124.210.157:8080

Everything before the ":" is the IP Address and everything after that is the port that we enable when we created our EC2. Jenkins naturally runs on port 8080 so that's why we enabled it to connect to our application.


Connect to the Jenkins container and retrive the password

Retrieve the container_id of your Jenkins container by typing the command in your terminal:


docker ps -a



Use the command below to connect to the Jenkins container:


sudo docker exec -it container_ID bash



replace "container_ID to the container_ID that pops up for you when you run "docker ps -a"


retreive the Jenkins password by typing the command below:


cat /var/jenkins_home/secrets/initialAdminPassword



Finish configuring Jenkins



Copy the password that you get from the cat command and paste it inside the Jenkins UI under "Administrator Password" and click continue


Click on "Install Suggested Plugins" and the plugins for install for your Jenkins server. Wait for it to finish and skip the part where it asks you for a username and password. We want you to use the admin account so don't create a user. The username will be "admin" and the password will be the password you just used (The Default Password). Go ahead and save this information for the future. (DO THIS NOW!)


On the "Instance Configuration" page that comes up afterwards, don't change anything and just click on "Save and Finish"



Step 6: Use Terraform for ECS Deployment

What is AWS ECS?
AWS ECS (Amazon Web Services Elastic Container Service) is a fully managed container orchestration service. ECS allows you to run, stop, and manage containers on a cluster.
Your containers are defined in tasks, which can be run on AWS Fargate, a serverless compute engine for containers, or on EC2 instances that you manage. ECS handles the orchestration and provisioning of your containers, making it easier to deploy and scale containerized applications.

Step 1: Prepare Your Terraform Environment
Purpose: Setting up a dedicated directory for your Terraform configuration organizes your Infrastructure as Code (IaC), making it easier to manage, version, and deploy.
How To:

Create a folder in your inside your "devops-code-challenge" on VScode and name it "terraform". Inside that folder create another folder called "ecs"


Step 2: Define the AWS Provider
Purpose: Terraform needs to know which cloud provider you're using and in which region you'll be deploying resources. This step sets up Terraform to interact with AWS services.
How To:

Create a file called "main.tf" and inside that file copy and paste the following into the file:


provider "aws" {
  region = "us-east-1" 
}



Step 3: Define the ECS Cluster
ECS Cluster: A logical grouping of tasks or services. Think of it as the environment where your containers will run. You define it once and can then deploy multiple services or tasks into it.
Purpose: The cluster is the backbone of your ECS deployment. All your containerized applications will be deployed into this cluster.
Create a file called "ecs-cluster.tf" and inside that file copy and paste the following into the file:


resource "aws_ecs_cluster" "my_cluster" {
  name = "my-cluster" 
}



Step 4: Create IAM Roles and Policies
ECS Service Role: Allows ECS to make calls to other AWS services on behalf of your account (e.g., pulling images from ECR).
Execution Role: Used by the ECS tasks themselves, allowing them to fetch secrets, log to CloudWatch, etc.
Purpose: These roles ensure that your ECS services and tasks have the necessary permissions to operate correctly and securely within AWS.
How To:

Create a file called "iam.tf" and inside that file copy and paste the following into the file:


resource "aws_iam_role" "ecs_execution_role" {
  name = "ecsExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "ecsTaskRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

# Example policy attachment for the task role - adjust the policy according to your needs
resource "aws_iam_policy" "ecs_task_policy" {
  name        = "ecsTaskPolicy"
  description = "A policy that allows ECS tasks to access AWS services."
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::your_bucket_name/*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_task_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_task_policy.arn
}



Step 5: Define Task Definitions
Task Definition: A blueprint for your applications that tells ECS how to run your container, including which image to use, how much CPU and memory to allocate, and more.
Purpose: Task definitions are crucial for telling ECS exactly how you want your application to be deployed. Each task definition translates directly to one or more running containers.
How To:

Create a file called "frontend-task.tf" and inside that file copy and paste the following into the file:


resource "aws_ecs_task_definition" "frontend" {
  family                   = "frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"  
  memory                   = "1024"  
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "289953284546.dkr.ecr.us-east-1.amazonaws.com/my-application-repo:frontend"  # Update with your actual ECR image URI
      cpu       = 512
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        },
      ],
environment = [
    {
        name  = "NODE_ENV"
        value = "production"
    },
]
    }
  ])
}



Create a file called "backend-task.tf" and inside that file copy and paste the following into the file:


resource "aws_ecs_task_definition" "backend" {
  family                   = "backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"  # Adjust based on your needs
  memory                   = "1024"  # Adjust based on your needs
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "289953284546.dkr.ecr.us-east-1.amazonaws.com/my-application-repo:backend" # Update with your ECR image URI
      cpu       = 512
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        },
      ],
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
      ],
    }
  ])
}



Step 6: Create ECS Services
ECS Service: Defines long-running instances of your application. A service ensures that the specified number of tasks are always running and reschedules tasks when they fail.
Purpose: Services manage the lifecycle of your application on ECS, ensuring that your application is always running as defined in your task definition. They handle tasks like rolling updates and service discovery.
How To:

Create a file called "frontend-service.tf" and inside that file copy and paste the following into the file:


resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"  
    container_port   = 3000        
  }

  network_configuration {
    assign_public_ip = true
    subnets          = [aws_subnet.ecs_subnet.id]
    security_groups  = [aws_security_group.frontend_security_group.id]
  }

 
  force_new_deployment = true

  depends_on = [
    aws_ecs_cluster.my_cluster,
    aws_ecs_task_definition.frontend,
    aws_lb_listener.frontend_listener  
  ]
}



Create a file called "backend-service.tf" and inside that file copy and paste the following into the file:


resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    assign_public_ip = false  
    subnets          = [aws_subnet.ecs_private_subnet.id]
    security_groups  = [aws_security_group.backend_security_group.id]
  }

  depends_on = [
    aws_ecs_cluster.my_cluster,
    aws_ecs_task_definition.backend
  ]
}



Step 7: Configure Security Groups
Security Groups: Act as a virtual firewall for your tasks to control inbound and outbound traffic.
Purpose: Security groups are essential for defining who can access your application. For example, you might allow traffic on port 80 for a web application.
How To:

Create a file called "vpc.tf" and inside that file copy and paste the following into the file:


# Define the VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "main"
  }
}

# Internet Gateway for the VPC
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "main"
  }
}

# Public Subnets
resource "aws_subnet" "ecs_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "ecs_subnet"
  }
}

resource "aws_subnet" "ecs_subnet2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "ecs_subnet2"
  }
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"
  tags = {
    Name = "NATGatewayEIP"
  }
}

# NAT Gateway in one of the public subnets
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.ecs_subnet.id # Assuming ecs_subnet is your chosen public subnet
  tags = {
    Name = "main"
  }
}

# Private Subnet for ECS tasks
resource "aws_subnet" "ecs_private_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1c"
  tags = {
    Name = "ecs_private_subnet"
  }
}

# Route Table for Public Subnets (Internet Gateway)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = {
    Name = "public"
  }
}

# Route Table for Private Subnets (NAT Gateway)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block   = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }
  tags = {
    Name = "private"
  }
}

# Associate Public Route Table with Public Subnets
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.ecs_subnet.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.ecs_subnet2.id
  route_table_id = aws_route_table.public.id
}

# Associate Private Route Table with Private Subnet
resource "aws_route_table_association" "private_assoc" {
  subnet_id      = aws_subnet.ecs_private_subnet.id
  route_table_id = aws_route_table.private.id
}

# Security Groups
resource "aws_security_group" "frontend_security_group" {
  name        = "ecs_security_group"
  description = "Allow inbound HTTP and custom traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs_security_group"
  }
}

resource "aws_security_group" "backend_security_group" {
  name        = "backend_security_group"
  description = "Allow inbound traffic on port 8080"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "backend_security_group"
  }
}
resource "aws_lb" "frontend_alb" {
  name               = "frontend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.frontend_security_group.id]
  subnets            = [aws_subnet.ecs_subnet.id, aws_subnet.ecs_subnet2.id] # Updated to include both subnets

  enable_deletion_protection = false

  tags = {
    Name = "frontendALB"
  }
}


resource "aws_lb_target_group" "frontend_tg" {
  name     = "frontend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/" 
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200" 
  }

  target_type = "ip"
}

resource "aws_lb_listener" "frontend_listener" {
  load_balancer_arn = aws_lb.frontend_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}
resource "aws_ecr_repository" "my_repository" {
  name                 = "my-application-repo" # Name your repository
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}
terraform plan
terraform apply
if you get a prompt to confirm the deployment, type "yes" and press "enter" on the keyboard to deploy your infrastructure that you configured using Terraform.


Make sure you check your AWS console to see if everything was deployed after the terraform apply command finished.


push your newly changes to your github remote branch using the commands below



git add .
git commit -m '1st commit'
git push


Side Note: If you're receiving an error when you try to push the changes to your github remote branch that relates to something along the line of "the file exceeds GitHub's file size limit", use the command below to resolve it

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch terraform/ecs/.terraform/providers/registry.terraform.io/hashicorp/aws/5.41.0/windows_amd64/terraform-provider-aws_v5.41.0_x5.exe" \
  --prune-empty --tag-name-filter cat -- --all



Step 6: Configuring Jenkins & Creating Your Jenkinsfile To Automate Deployment

Step 1: Install Necessary Plugins
Open Jenkins: Launch Jenkins in your web browser (typically available at http://Your_EC2_IP_Address:8080).
Access Manage Jenkins: From the Jenkins dashboard, navigate to Manage Jenkins > Manage Plugins.
Install Plugins: Go to the Available Plugins, and use the search box to find the following plugins:


Docker Pipeline plugin: For building and pushing Docker images from Jenkins pipelines.


Amazon ECR: For generating authentication token from Amazon Credentials to access Amazon ECR


Select these plugins and click Install.

Step 2: Add Credentials
AWS Credentials:


Use this video to create a user with admin access  YouTube Video


Use this video to create your access key and secret key from the AWS user you just created (Skip to 1:54) YouTube Video


Navigate to Manage Jenkins > Credentials > System > Global credentials (unrestricted) > Add Credentials


Choose AWS Credentials from the Kind dropdown.


Enter your AWS Access Key ID and Secret Access Key.
Assign an ID (e.g., "aws-credentials") and description for identification.


Docker Credentials and ECR Credentials:

Still in the credentials section, add a new credetnial of type Username with password
For Username, enter your AWS access key. For Password, enter your AWS secret access key. This will be used to log into ECR. Give it an ID (e.g., 'ecr-credentials').

Generating a Personal Access Token (PAT) on GitHub
Login to GitHub:


Sign in to your GitHub account.


Access Settings: Click on your profile photo in the upper-right corner of any page, then click Settings.


Developer Settings: Scroll down the sidebar until you find Developer settings and click on it.


Personal Access Tokens: Click on Personal access tokens, then click on the Generate new token button.


Set Token Description: Give your token a descriptive name in the Note field to remember where it's used.


Select Scopes: Choose the scopes or permissions you'd like to grant this token. For Jenkins integration, you might need to select scopes such as repo, admin:repo_hook, etc., depending on what operations Jenkins needs to perform.


Generate Token: Click the Generate token button at the bottom of the page. Make sure to copy your new personal access token now. You won’t be able to see it again!


Adding Your GitHub PAT to Jenkins Credentials


Open Jenkins: Navigate to your Jenkins dashboard in a web browser.


Manage Jenkins: Click on Manage Jenkins from the main menu.


Manage Credentials: Select Manage Credentials under the Security section.


(global): Click on the (global) link under the Stores scoped to Jenkins section.


Add Credentials: Click on the Add Credentials link on the left side.


Credentials Details:

Kind: Select Username with password.
Scope: Choose Global (Jenkins, nodes, items, all child items, etc).
Username: Enter your GitHub username.
Password: Paste the Personal Access Token (PAT) you generated on GitHub.
ID (optional): Enter an identifier for your credentials (e.g., github-pat). If you leave it blank, an ID will be generated for you.
Description (optional): Provide a description for these credentials (e.g., "GitHub PAT for Jenkins").
Save Credentials: Click the OK button to save your credentials.


Step 3: Writing The Jenkinsfile

inside your local directory inside VSCode, go ahead and create a newfile under the "devops-code-challenge" directory.
Name the file "Jenkinsfile"
Copy and paste the following code into the Jenkinsfile


pipeline {
    agent any
    environment {
pipeline {
    agent any
    environment {

        // Define environment variables
        AWS_DEFAULT_REGION = 'us-east-1' //This will stay the same since your AWS_DEFAULT_REGION name is the same 
        AWS_ACCOUNT_ID = '289953123456' //change this to your AWS_ACCOUNT_ID
        ECR_REPOSITORY = 'my-application-repo' //This will stay the same since your ECR_REPOSITORY name is the same 
        FRONTEND_SERVICE_NAME = 'frontend-service' //This will stay the same since your FRONTEND_SERVICE_NAME name is the same
        BACKEND_SERVICE_NAME = 'backend-service'  //This will stay the same since your BACKEND_SERVICE_NAME name is the same
        ECS_CLUSTER_NAME = 'my-cluster' //This will stay the same since your ECS_CLUSTER_NAME name is the same
    }
    stages {
        stage('Build Docker Images') {
            steps {
                script {
                    // Build Docker images for frontend and backend
                    sh 'docker build -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$ECR_REPOSITORY:frontend ./frontend'
                    sh 'docker build -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$ECR_REPOSITORY:backend ./backend'
                }
            }
        }
        stage('Push to ECR') {
            steps {
                script {
                    // Login to ECR
                    sh 'aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com'
                    // Push images to ECR
                    sh 'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$ECR_REPOSITORY:frontend'
                    sh 'docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$ECR_REPOSITORY:backend'
                }
            }
        }
        stage('Update ECS Services') {
            steps {
                script {
                    // Force a new deployment of the ECS services
                    sh "aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $FRONTEND_SERVICE_NAME --force-new-deployment"
                    sh "aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $BACKEND_SERVICE_NAME --force-new-deployment"
                }
            }
        }
    }
}
Once you’ve defined your pipeline, click “Save” at the bottom of the page.
After saving, you’ll be redirected to your pipeline’s dashboard.


Step 5: Installing Docker on our Jenkins Container

retrieve your Container_ID by typing the command below in your teminal:


docker ps -a 



log into your Jenkins container using the command below:


docker exec -u 0 -it (container_id) bash


Replace container_id with the container id you retrieved after typing "docker ps -a"

When you log into your container run this command to install docker


curl https://get.docker.com/ > dockerinstall && chmod 777 dockerinstall && ./dockerinstall



After the download you want to run the command below to change the permissions of your "docker.sock file" which is needed to run docker commands for your jenkins pipeline


chmod 666 /var/run/docker.sock


EC2/Container Permissions

When you shut down your container or EC2 and start it back up again, you will need to give the permssions again. Go ahead and redo the steps provided above starting from changing the "docker.sock" permissions and then you'll be able to run the pipeline without any error relating to docker permissions.


Step 6: Installing AWS CLI on our Jenkins Container

retrieve your Container_ID by typing the command below in your teminal:


docker ps -a 



log into your Jenkins container using the command below:


docker exec -u 0 -it (container_id) bash


Replace container_id with the container id you retrieved after typing "docker ps -a"
To install the AWS CLI, run the following commands

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
If you receive an error that says


bash: sudo: command not found


go ahead and type in this command


./aws/install



Type this in the terminal to check you have aws cli install inside your Jenkins container


aws --version



You should see that it was installed afterwards

Configre Your AWS Account Inside The Jenkins Container:

Inside your Jenkins container, change to jenkins user using the command below:


su - jenkins



Now run the aws configure using the command below to configure your AWS account:


aws configure



When you see the prompts that shows up, input the information that it's requesting


AWS Access Key ID: (Retreive this from where you saved this at on your local computer)

AWS Secret Access Key: (Retreive this from where you saved this at on your local computer)

Default Region Name: (Use The Region That's closest to you)

Default Output Format: json



Step 7: Run Your Pipeline

Navigate to your the pipeline you created and configured and click on "Build Now" on the left hand side of the browser.
Under "Build History" you will see a build that's running with a number associated with the build.
Click the arrow near the build number and click on "Console Output" to see the logs of what's happening in the Jenkins Pipeline.
You should see that your Jenkins Pipeline was ran succesfully


Step 8: Connecting To Your Application

To access the frontend application, you will need to navigate to the EC2 dashboard and load balancer tab and click on the load balancer that was created with the Terraform code. Once it's selected, scroll down until you see "DNS name" and copy that and paste it into a URL to connect to the application.
