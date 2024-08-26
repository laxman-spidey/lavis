FROM centos:7

RUN mkdir /code-base
COPY ./ /code-base
RUN cd /code-base &&\
    curl -sL https://rpm.nodesource.com/setup_13.x | bash - && yum install nodejs -y &&\
    npm install 
 
CMD cd /code-base && npm run dev 
