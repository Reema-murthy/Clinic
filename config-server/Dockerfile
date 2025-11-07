FROM eclipse-temurin:17-jdk-jammy
EXPOSE 8888
COPY target/config-server-0.0.1-SNAPSHOT.jar /app/config-server.jar
ENTRYPOINT ["java","-jar","/app/config-server.jar"]
