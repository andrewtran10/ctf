FROM ubuntu

RUN useradd -ms /bin/bash acrypto
RUN echo acrypto:cs561 | chpasswd
WORKDIR /home/acrypto

RUN apt-get update
RUN apt-get install net-tools iputils-ping wfuzz ncat    nmap openssh-server default-jre -y

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install ./google-chrome-stable_current_amd64.deb -y

COPY burpsuite_community_linux_v2022_2_3.sh ./
COPY run.sh ./
COPY data_analysis_welcome ./

RUN chmod 777 ./run.sh
RUN chmod +x ./burpsuite_community_linux_v2022_2_3.sh

RUN ./burpsuite_community_linux_v2022_2_3.sh -q

RUN yes | unminimize

EXPOSE 22
RUN sed -i 's/#X11UseLocalhost yes/X11UseLocalhost no/g' /etc/ssh/sshd_config

CMD ["./run.sh"]