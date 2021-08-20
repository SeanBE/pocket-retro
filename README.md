# Pocket Retro

Pocket updated their design recently. I love it but it has affected my main usecase for Pocket.

This simple application fetches article links and archives them when you open the original article in a new tab.
Powered by a Python service using Bottle and a Typescript React frontend. PRs and issues are welcome.

```shell
docker build -t pocket_retro:latest .
docker run --restart unless-stopped -d --init -p 127.0.0.1:3210:3000 --name pocket pocket_retro
```

![alt text](docs/preview.png "Sick frontend..")
