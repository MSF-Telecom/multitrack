FROM python:3.11-slim

ENV PUBLISH_PORT=8000
ENV LISTEN_PORT=80

WORKDIR /usr/src/app

COPY ./src .

# RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "./server.py"]