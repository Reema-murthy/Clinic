FROM eclipse-temurin:17-jdk-jammy
EXPOSE 8082
RUN apt-get update && apt-get install -y default-mysql-client
COPY target/patient-service-0.0.1-SNAPSHOT.jar /app/patient-service.jar
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh
ENTRYPOINT ["./wait-for.sh","java","-jar","/app/patient-service.jar"]
