FROM openjdk:17-jdk-slim
EXPOSE 8083
RUN apt-get update && apt-get install -y default-mysql-client
COPY target/visits-service-0.0.1-SNAPSHOT.jar /app/visits-service.jar
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh
ENTRYPOINT ["./wait-for.sh","java","-jar","/app/visit-service.jar"]
