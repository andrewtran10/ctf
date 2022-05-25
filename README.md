# CS 561 - CTF Challenge
Semester project for CS 561 - System Defense and Testing

The client will attempt to hack into a different machine on the network using a machine preloaded with various tools. The attack vector is an insecure internal database upload web tool that the company uses. The client must crack into the internal tool and from there send a malicious deserializable payload to open a remote shell into the web server to retrieve the first flag. To retreive the second flag, the client must gain privilege escalation to read as ALL permissions have been revoked from this flag and only root can read.

# Setup
Clone the repository.

Download the burpsuite setup script and the rockyou.txt file and place into the attack_box folder.

Run the following command:
```
docker-compose up
```


