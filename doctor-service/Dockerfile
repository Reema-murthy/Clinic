FROM openjdk:17-jdk-slim

# Expose the port that the Doctor Service will run on (configured via config server)
EXPOSE 8081
RUN apt-get update && apt-get install -y default-mysql-client
COPY target/doctor-service-0.0.1-SNAPSHOT.jar /app/doctor-service.jar 
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh
ENTRYPOINT ["./wait-for.sh","java","-jar","/app/doctor-service.jar"]
