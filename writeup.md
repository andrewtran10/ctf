# Writeup for ...

Authors: Andrew Tran

## Description

There is a netcat listener which is bound to a python process which generates random inputs for the client to keep echoing. If the client can echo all prompts correctly, the flag is printed out.

You have been able to ssh into a vulnerable intern's work pc that is connected to MANGA's internal network and will use this as the attack box. The attack vector is an insecure internal database upload web tool that the company uses. The client must crack into the internal tool and from there send a malicious unserializable payload to open a remote shell into the web server to retrieve the first flag. To retreive the second flag, the client must gain privilege escalation to read as ALL permissions have been revoked and only root can read.


## Exploit

You have sneakily downloaded Burpsuite and wfuzz. You must use wfuzz to find the password that goes along with the intern's password by bruteforcing. Then, reading the source code of the web server, you can find a vulnerable npm package called node-serialize. This allows you to run malicious code when an object is deserialized with an immediately invoked function expression. Using this you can tell the server to run a remote shell that you may connect to. 

Now connected, you can retreive the first flag. The second flag is a hidden file with no permissions granted for users, groups, and others. To gain privilege escalation, you must enumerate the machine and find two SETUID programs - gzip and diff - allowing anyone to run those programs as root. You can then leverage these programs to read the hidden second flag.

