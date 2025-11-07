FROM eclipse-temurin:17-jdk-jammy

EXPOSE 8080

COPY target/api-gateway-0.0.1-SNAPSHOT.jar /app/api-gateway.jar

ENTRYPOINT ["java","-jar","/app/api-gateway.jar"]

