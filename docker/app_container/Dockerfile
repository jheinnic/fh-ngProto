# LoopBack App Base Image
FROM questiny/wins-web_base
 
# Create App Directory and CD into it
RUN mkdir /data/app
WORKDIR /data/app
 
# Clone Master and Install dependencies
RUN git clone https://github.com/Rolilink/remote-job-board.git
 
# Run App
WORKDIR /data/app/remote-job-board
RUN npm install
EXPOSE 3000
CMD slc run

