FROM openjdk:17-jdk-slim
# Expose the port that the Doctor Service will run on (configured via config server)
EXPOSE 8081
COPY target/doctor-service-0.0.1-SNAPSHOT.jar /app/doctor-service.jar
ENTRYPOINT ["java","-jar","/app/doctor-service.jar"]
