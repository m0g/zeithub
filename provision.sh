#!/bin/bash
export LANGUAGE="en_US.UTF-8"
echo "LANGUAGE="en_US.UTF-8"" | sudo tee --append /etc/default/locale
echo "LC_ALL="en_US.UTF-8"" | sudo tee --append /etc/default/locale

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

sudo apt-get update
sudo apt-get dist-upgrade -y

# Zammad requirements
sudo apt-get install -y curl git build-essential nodejs vim autoconf

# MySQL
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password vagrant'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password vagrant'
sudo apt-get -y install mysql-server libmysqlclient-dev

