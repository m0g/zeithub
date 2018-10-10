#!/bin/bash
export LANGUAGE="en_US.UTF-8"
echo "LANGUAGE="en_US.UTF-8"" | sudo tee --append /etc/default/locale
echo "LC_ALL="en_US.UTF-8"" | sudo tee --append /etc/default/locale

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt-get update
sudo apt-get dist-upgrade -y

sudo apt-get install -y curl git build-essential nodejs vim autoconf libx11-dev libx11-xcd-dev libxcomposite-dev libxcursor-dev libxdamage-dev libxi-dev libxtst-dev libnss3-dev libcups2-dev libxss-dev libxrandr-dev libasound-dev libpangocairo-1.0-0 libatk1.0-dev

# MySQL
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password vagrant'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password vagrant'
sudo apt-get -y install mysql-server libmysqlclient-dev

