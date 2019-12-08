FROM python

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

RUN apt-get update -y

RUN apt-get install -y curl software-properties-common && \
    curl -sL https://deb.nodesource.com/setup_13.x | sudo bash - && \
    apt-get install nodejs

RUN apt-get install postgresql-client -y

COPY package.json /code
COPY package-lock.json /code

RUN cd /code && npm i

COPY webpack.config.js /code

COPY src /code/src
WORKDIR /code/src

RUN rm -rf /tmp/* && apt-get clean -y

ENTRYPOINT ["./prod-run.sh"]