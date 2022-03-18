# Writeup for ...

Authors: Andrew Tran

## Description

You have been able to create a user on an intern's work pc, allowing you to ssh into the pc that is connected to MANGA's internal network. You have set up this pc with the necessary tools to use this as the attack box. The attack vector is an insecure internal database upload web tool that the company uses. The client must crack into the internal tool and from there send a malicious unserializable payload to open a remote shell into the web server to retrieve the first flag. To retreive the second flag, the client must gain privilege escalation to read as ALL permissions have been revoked from this flag and only root can read.


## Exploit

On the intern's machine you must enumerate to find any relevant information that may help you. There is a welcome file from the intern's team that lists her employee ID. Additionally, there is documentation of how to use the company's internal database upload tool. You must then port scan the internal network to find the address and port the tool is hosted on. 

 You must use wfuzz to find the password that goes along with the intern's id by bruteforcing. Wireshark may also be used to help determine the http request sent to the server when a login attempt is created to help with the password cracking. Then, reading the source code of the web server, you can find a vulnerable npm package called node-serialize. This allows you to run malicious code when an object is deserialized with an immediately invoked function expression. Using this you can tell the server to run a remote shell that you may connect to. 

Now connected, you can retreive the first flag. The second flag is a hidden file with no permissions granted for users, groups, and others. To gain privilege escalation, you must enumerate the machine and find two SETUID programs - gzip and diff - allowing anyone to run those programs as root. You can then leverage these programs to read the hidden second flag.

