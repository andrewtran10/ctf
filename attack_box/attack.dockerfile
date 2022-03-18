FROM ubuntu

RUN useradd -ms /bin/bash acrypto
RUN echo acrypto:cs561 | chpasswd

RUN apt-get update
RUN apt-get install net-tools iputils-ping wfuzz ncat nmap openssh-server default-jre -y

WORKDIR /root

COPY burpsuite_community_linux_v2022_2_3.sh ./
COPY run.sh ./
COPY midori_input ./

RUN chmod 777 ./run.sh
RUN chmod +x ./burpsuite_community_linux_v2022_2_3.sh

RUN apt-get install midori < midori_input
RUN ./burpsuite_community_linux_v2022_2_3.sh -q

RUN yes | unminimize

WORKDIR /home/acrypto
COPY data_analysis_welcome ./
COPY database_upload_instructions.txt ./
COPY rockyou.txt ./

EXPOSE 22
RUN sed -i 's/#X11UseLocalhost yes/X11UseLocalhost no/g' /etc/ssh/sshd_config

WORKDIR /root
CMD ["./run.sh"]