FROM ubuntu

RUN useradd -ms /bin/bash acrypto
RUN useradd -ms /bin/bash hackerman
RUN echo hackerman:cs561 | chpasswd

RUN apt-get update
RUN apt-get install net-tools iputils-ping wfuzz ncat nmap openssh-server default-jre -y

WORKDIR /root

COPY burpsuite_community_linux_v2022_2_3.sh ./
COPY run.sh ./

RUN chmod 777 ./run.sh
RUN chmod +x ./burpsuite_community_linux_v2022_2_3.sh

RUN DEBIAN_FRONTEND=noninteractive apt-get install midori -y
RUN ./burpsuite_community_linux_v2022_2_3.sh -q

WORKDIR /home/acrypto
COPY data_analysis_welcome ./
COPY database_upload_instructions_v2.3.txt ./

WORKDIR /home/hackerman
COPY rockyou.txt ./
COPY tools.txt ./

EXPOSE 22
RUN sed -i 's/#X11UseLocalhost yes/X11UseLocalhost no/g' /etc/ssh/sshd_config

WORKDIR /root
CMD ["./run.sh"]