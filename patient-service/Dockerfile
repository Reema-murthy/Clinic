FROM openjdk:17-jdk-slim
EXPOSE 8082
COPY target/patient-service-0.0.1-SNAPSHOT.jar /app/patient-service.jar
ENTRYPOINT ["java","-jar","/app/patient-service.jar"]
