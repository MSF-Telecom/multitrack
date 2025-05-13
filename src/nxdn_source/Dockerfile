FROM python:3.11-slim

ENV PUBLISH_IP=127.0.0.1
ENV PUBLISH_PORT=8081
ENV LISTEN_PORT=80

WORKDIR /usr/src/app

COPY ./src .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "./server.py"]
# CMD ["/bin/sh"]