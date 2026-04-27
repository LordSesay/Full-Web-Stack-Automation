FROM jenkins/jenkins:latest

USER root

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    lsb-release \
    unzip \
    wget \
    jq \
    git \
    docker.io

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf aws awscliv2.zip

RUN wget https://releases.hashicorp.com/terraform/1.14.9/terraform_1.14.9_linux_amd64.zip \
    && unzip terraform_1.14.9_linux_amd64.zip \
    && mv terraform /usr/local/bin/ \
    && rm terraform_1.14.9_linux_amd64.zip

USER jenkins
