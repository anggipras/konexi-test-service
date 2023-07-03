# konexi-test-service

API Documentation can be found here
https://documenter.getpostman.com/view/11621493/2s93zCZ1VD

## Deployment Instructions
Follow these steps to deploy your Node.js app on an AWS EC2 instance.

Prerequisites
- An AWS account with access to the EC2 service.
- Basic knowledge of using SSH.

### Step 1: Connect to your EC2 Instance
- Open a terminal or command prompt on your local machine.
- Use the following command to connect to your EC2 instance (replace your-ec2-instance-public-ip and /path/to/your/keypair.pem/ppk with the appropriate values):

  ```ssh -i /path/to/your/keypair.pem ec2-user@your-ec2-instance-public-ip```

### Step 2: Update NodeJS app github repo
1. Change to the directory where your app is located:
cd /etc/yum.repos.d/konexi-test-service

2. Git fetch and pull latest update of nodejs app (master branch)

### Step 3: Start the Node.js App
1. Start your Node.js app using nohup and forever:
nohup forever start index.js &
Your app is now running in the background on the EC2 instance.

### Step 4: Access your App
Open a web browser and enter the public IP or elastic IP address followed by the port or domain to access your Node.js app.
This project runs in:

http://18.139.116.43:5000/

That's it! Your Node.js app is now deployed on an AWS EC2 instance and accessible from anywhere.

## Troubleshooting
If you encounter any issues during the deployment process, please refer to the following troubleshooting tips:

## DEPLOYMENT INSTRUCTION AT VERY FIRST TIME

# Step 1: Launch an EC2 Instance
1. Sign in to the AWS Management Console and navigate to the EC2 service.
2. Launch a new EC2 instance using the following specifications:
- Amazon Machine Image (AMI): Choose an AMI that supports Node.js (e.g., Amazon Linux 2).
- Instance Type: Select an instance type eligible for the free tier (e.g., t2.micro).
  
3. Configure other instance details, storage, and security groups as per your requirements.
4. Create or select an existing key pair to securely connect to your instance.

# Step 2: Connect to your EC2 Instance
1. Open a terminal or command prompt on your local machine.
2. Use the following command to connect to your EC2 instance (replace your-ec2-instance-public-ip and /path/to/your/keypair.pem with the appropriate values):
ssh -i /path/to/your/keypair.pem ec2-user@your-ec2-instance-public-ip

# Step 3: Set up the Environment on the EC2 Instance
1. Install Node.js and other dependencies on the EC2 instance:

sudo yum update -y
sudo su
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
sudo yum install -y git

# Step 4: Set up Mongodb on AWS EC2 Instance
1. Change to the directory where your app is located:

cd /etc/yum.repos.d/
nano mongodb-org-6.0.repo

2. Copy this content inside:
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc

3. Install mongodb-org dependency
sudo yum install -y mongodb-org

4. Start mongodb service
sudo service mongod start

# Step 5: Start the Node.js App
1. Direct to nodejs project
- cd /konexi-test-service
- npm install

2. Start your Node.js app using nohup and forever:
nohup forever start your-app.js &

Your app is now running in the background on the EC2 instance.

# Step 6: Access your App
Assign a public IP or elastic IP to your EC2 instance in the AWS console (refer to AWS documentation for instructions).

Open a web browser and enter the public IP or elastic IP address followed by the port or domain to access your Node.js app.

That's it! Your Node.js app is now deployed on an AWS EC2 instance and accessible from anywhere.
