# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.provider :lxc do |lxc, override| # w/ lxc provider
    config.vm.box = "asy/xenial64-lxc"
    config.vm.synced_folder ".", "/opt/konta"
    config.vm.network "private_network", ip: "192.168.2.100", lxc__bridge_name: 'lxcbr0'
  end

  config.vm.network "forwarded_port", guest: 8888, host: 8888
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.provision "shell", path: "provision.sh", privileged: false
  config.vm.box_check_update = false
end
