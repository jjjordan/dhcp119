# DHCP Domain Search List (Option 119) Encoder

Here's an encoder for DHCP Option 119, which sends domain search lists to
clients.  Many DHCP server implementations do not encode this option for
you, instead expecting the administrator to do it.  This repo provides a
quick, browser-based encoder for anyone to use quickly.

Here are some references that helped to build this:
* A [blog post](https://www.medo64.com/2017/04/adding-domain-search-option-to-mikrotik-dhcp/) describing the process to add this option to Mikrotik RouterOS.
* Another [blog post](https://blog.pessoft.com/2016/03/17/domain-search-list-as-dhcp-option-in-mikrotik-routeros/)
* A useful [post on the Mikrotik forums](https://forum.mikrotik.com/viewtopic.php?t=133801)
* A similar [python script](https://gist.github.com/SmartFinn/be417c7a7e0b3d9bee9c29e74d08ff78) (that lacks back-pointers)

The RFC's:
* 3397 [Dynamic Host Configuration Protocol (DHCP) Domain Search Option](https://tools.ietf.org/html/rfc3397)
* 1035 [DOMAIN NAMES - IMPLEMENTATION AND SPECIFICATION S 4.1.4 Message compression](https://tools.ietf.org/html/rfc1035#section-4.1.4)

The code here is licensed under GPL v3+.
